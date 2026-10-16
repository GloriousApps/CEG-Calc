import { TapeEntry } from '../types';

export const getTapeDimensionLabel = ({ dimension, isUnitless }: Pick<TapeEntry, 'dimension' | 'isUnitless'>): string => {
  if (isUnitless) return '';
  if (dimension === 3) return 'CB';
  if (dimension === 2) return 'SQ';
  return '';
};
