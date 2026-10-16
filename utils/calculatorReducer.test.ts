import { describe, expect, it } from 'vitest';
import { CalculatorActionType, calculatorReducer, initialCalculatorState } from './calculatorReducer';
import { Operator } from '../types';
import { builderToDisplay, formatConstructionUnit } from './formatter';
import { getTapeDimensionLabel } from './tape';

const reduce = (state: typeof initialCalculatorState, action: Parameters<typeof calculatorReducer>[1]) =>
  calculatorReducer(state, action);

describe('calculator reducer', () => {
  it('replaces a pending operator without recalculating the displayed value', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Add });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Multiply });

    expect(state.displayValue).toBe(2);
    expect(state.previousValue).toBe(2);
    expect(state.operator).toBe(Operator.Multiply);
    expect(state.waitingForOperand).toBe(true);
    expect(state.tape).toHaveLength(0);
  });

  it('uses the last selected operator when the next operand is entered', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Add });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Multiply });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '3' });
    state = reduce(state, { type: CalculatorActionType.EQUAL });

    expect(state.displayValue).toBe(6);
    expect(state.tape).toHaveLength(1);
    expect(state.tape[0].isUnitless).toBe(true);
  });

  it('repeats the last completed operation when equals is pressed again', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Add });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '3' });
    state = reduce(state, { type: CalculatorActionType.EQUAL });
    state = reduce(state, { type: CalculatorActionType.EQUAL });

    expect(state.displayValue).toBe(8);
    expect(state.tape).toHaveLength(2);
  });

  it('rejects division by zero without creating an invalid tape entry', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '8' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Divide });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '0' });
    state = reduce(state, { type: CalculatorActionType.EQUAL });

    expect(Number.isFinite(state.displayValue)).toBe(true);
    expect(state.tape).toHaveLength(0);
    expect(state.errorMessage).toBe('Sıfıra bölme yapılamaz.');
  });

  it('returns a unitless result when equal dimensions are divided', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Divide });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '4' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.EQUAL });

    expect(state.displayValue).toBe(0.5);
    expect(state.isUnitless).toBe(true);
    expect(state.tape[0].isUnitless).toBe(true);
  });

  it('rejects incompatible dimensions instead of silently relabeling the result', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Add });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '3' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.EQUAL });

    expect(state.tape).toHaveLength(0);
    expect(state.errorMessage).toBe('Bu boyutlarla işlem yapılamaz.');
  });

  it('rejects multiplication beyond cubic dimensions', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Multiply });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '3' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.EQUAL });

    expect(state.tape).toHaveLength(0);
    expect(state.errorMessage).toBe('Bu boyutlarla işlem yapılamaz.');
  });

  it('rejects a zero fraction denominator', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '1' });
    state = reduce(state, { type: CalculatorActionType.FRACTION });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '0' });
    state = reduce(state, { type: CalculatorActionType.OPERATOR, payload: Operator.Add });

    expect(state.previousValue).toBeNull();
    expect(state.errorMessage).toBe('Geçerli bir işlem değeri girin.');
  });

  it('preserves memory units when adding a unitless value', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.MEMORY_STORE });
    state = reduce(state, { type: CalculatorActionType.CLEAR });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '3' });
    state = reduce(state, { type: CalculatorActionType.MEMORY_ADD });
    state = reduce(state, { type: CalculatorActionType.MEMORY_RECALL });

    expect(state.displayValue).toBe(5);
    expect(state.isUnitless).toBe(false);
    expect(state.activeDimension).toBe(1);
  });

  it('rejects memory operations with incompatible dimensions', () => {
    let state = initialCalculatorState;

    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '2' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.MEMORY_STORE });
    state = reduce(state, { type: CalculatorActionType.CLEAR });
    state = reduce(state, { type: CalculatorActionType.NUMBER, payload: '3' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.UNIT, payload: 'feet' });
    state = reduce(state, { type: CalculatorActionType.MEMORY_ADD });

    expect(state.memory).toBe(2);
    expect(state.errorMessage).toBe('Bellekte uyumsuz boyutlar toplanamaz.');
  });
});

describe('tape dimension labels', () => {
  it('does not label a unitless result as square or cubic', () => {
    expect(getTapeDimensionLabel({ dimension: 2, isUnitless: true })).toBe('');
    expect(getTapeDimensionLabel({ dimension: 3, isUnitless: true })).toBe('');
  });

  it('keeps labels for unitful results', () => {
    expect(getTapeDimensionLabel({ dimension: 2, isUnitless: false })).toBe('SQ');
    expect(getTapeDimensionLabel({ dimension: 3, isUnitless: false })).toBe('CB');
  });
});

describe('construction formatter', () => {
  it('shows the feet remainder when a yard preference is active', () => {
    const formatted = formatConstructionUnit(4, null, 1, 1, 'yard', false);

    expect(formatted.yard).toBe(1);
    expect(formatted.feet).toBe(1);
    expect(formatted.showYardLabel).toBe(true);
    expect(formatted.showFeetLabel).toBe(true);
  });

  it('keeps the negative sign separate from square/cubic values', () => {
    const formatted = formatConstructionUnit(-3, null, 1, 2, 'feet', false);

    expect(formatted.feet).toBe(3);
    expect(formatted.isNegative).toBe(true);
  });

  it('previews decimal unit input without truncating it', () => {
    const formatted = builderToDisplay(
      { feet: 5, inch: null, yard: null, numerator: null, denominator: null, dimension: 1 },
      '3.5',
      'feet'
    );

    expect(formatted.inch).toBe(3.5);
  });
});
