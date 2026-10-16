import { describe, expect, it } from 'vitest';
import { CalculatorActionType, calculatorReducer, initialCalculatorState } from './calculatorReducer';
import { Operator } from '../types';
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
