export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
  mode: 'standard' | 'scientific' | 'programmer' | 'unit' | 'graph' | 'matrix' | 'equation';
  angleUnit: 'deg' | 'rad';
  base: 2 | 8 | 10 | 16;
}

export type OperationType = '+' | '-' | '×' | '÷' | '=' | 'clear' | 'toggle-sign' | 'percentage';

export interface ButtonConfig {
  text: string;
  type: 'number' | 'operator' | 'function' | 'scientific' | 'mode';
  value: string | number;
  flex?: number;
  secondaryText?: string;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  mode: string;
}

export interface UnitConversion {
  category: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
}

export interface Matrix {
  rows: number;
  cols: number;
  data: number[][];
}

export interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

export interface Equation {
  id: string;
  expression: string;
  variables: string[];
  solution: any;
}