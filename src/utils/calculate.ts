export const formatNumber = (num: number): string => {
  if (num.toString().length > 9) {
    return num.toExponential(3);
  }
  
  // Remove trailing zeros and unnecessary decimal point
  return parseFloat(num.toPrecision(9)).toString();
};

export const calculate = (
  previousValue: number,
  currentValue: number,
  operation: string
): number => {
  switch (operation) {
    case '+':
      return previousValue + currentValue;
    case '-':
      return previousValue - currentValue;
    case '×':
      return previousValue * currentValue;
    case '÷':
      if (currentValue === 0) {
        throw new Error('Cannot divide by zero');
      }
      return previousValue / currentValue;
    default:
      return currentValue;
  }
};

export const handlePercentage = (value: number): number => {
  return value / 100;
};

export const handleToggleSign = (value: number): number => {
  return value * -1;
};

// Scientific Calculator Functions
export const scientificCalculate = (value: number, operation: string, angleUnit: 'deg' | 'rad' = 'deg'): number => {
  const toRadians = (angle: number, unit: 'deg' | 'rad') => unit === 'deg' ? angle * Math.PI / 180 : angle;
  const fromRadians = (angle: number, unit: 'deg' | 'rad') => unit === 'deg' ? angle * 180 / Math.PI : angle;

  switch (operation) {
    case 'sin':
      return Math.sin(toRadians(value, angleUnit));
    case 'cos':
      return Math.cos(toRadians(value, angleUnit));
    case 'tan':
      return Math.tan(toRadians(value, angleUnit));
    case 'asin':
      return fromRadians(Math.asin(value), angleUnit);
    case 'acos':
      return fromRadians(Math.acos(value), angleUnit);
    case 'atan':
      return fromRadians(Math.atan(value), angleUnit);
    case 'log':
      return Math.log10(value);
    case 'ln':
      return Math.log(value);
    case 'sqrt':
      return Math.sqrt(value);
    case 'square':
      return value * value;
    case 'cube':
      return value * value * value;
    case 'pow':
      return Math.pow(value, 2);
    case 'exp':
      return Math.exp(value);
    case 'factorial':
      if (value < 0 || value !== Math.floor(value)) {
        throw new Error('Factorial only works with non-negative integers');
      }
      let result = 1;
      for (let i = 2; i <= value; i++) {
        result *= i;
      }
      return result;
    default:
      return value;
  }
};

// Base Conversion Functions
export const convertBase = (value: string, fromBase: number, toBase: number): string => {
  const decimal = parseInt(value, fromBase);
  return decimal.toString(toBase).toUpperCase();
};

export const formatBinary = (value: string): string => {
  return value.padStart(8, '0');
};

export const formatHex = (value: string): string => {
  return value.padStart(2, '0').toUpperCase();
};

// Unit Conversion Functions
export const unitConversions = {
  length: {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    mi: 1609.344,
    yd: 0.9144,
    ft: 0.3048,
    in: 0.0254,
  },
  weight: {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.028349523125,
  },
  temperature: {
    C: (value: number) => value,
    F: (value: number) => (value - 32) * 5/9,
    K: (value: number) => value - 273.15,
  },
  area: {
    'm²': 1,
    'km²': 1000000,
    'cm²': 0.0001,
    'mm²': 0.000001,
    'mi²': 2589988.110336,
    'yd²': 0.83612736,
    'ft²': 0.09290304,
    'in²': 0.00064516,
  },
  volume: {
    'm³': 1,
    'L': 0.001,
    'mL': 0.000001,
    'gal': 0.003785411784,
    'qt': 0.000946352946,
    'pt': 0.000473176473,
  },
};

export const convertUnit = (value: number, fromUnit: string, toUnit: string, category: string): number => {
  const conversions = unitConversions[category as keyof typeof unitConversions];
  if (!conversions) return value;

  if (category === 'temperature') {
    const tempConversions = conversions as Record<string, (value: number) => number>;
    const toCelsius = tempConversions[fromUnit];
    const fromCelsius = (value: number) => {
      if (toUnit === 'F') return value * 9/5 + 32;
      if (toUnit === 'K') return value + 273.15;
      return value;
    };
    return fromCelsius(toCelsius(value));
  }

  const standardConversions = conversions as Record<string, number>;
  const fromFactor = standardConversions[fromUnit];
  const toFactor = standardConversions[toUnit];
  
  if (!fromFactor || !toFactor) return value;
  
  return (value * fromFactor) / toFactor;
};

// Matrix Operations
export const matrixOperations = {
  add: (a: number[][], b: number[][]): number[][] => {
    if (a.length !== b.length || a[0].length !== b[0].length) {
      throw new Error('Matrix dimensions must match');
    }
    return a.map((row, i) => row.map((val, j) => val + b[i][j]));
  },
  
  multiply: (a: number[][], b: number[][]): number[][] => {
    if (a[0].length !== b.length) {
      throw new Error('Matrix dimensions incompatible for multiplication');
    }
    const result = Array(a.length).fill(0).map(() => Array(b[0].length).fill(0));
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b[0].length; j++) {
        for (let k = 0; k < b.length; k++) {
          result[i][j] += a[i][k] * b[k][j];
        }
      }
    }
    return result;
  },
  
  determinant: (matrix: number[][]): number => {
    if (matrix.length !== matrix[0].length) {
      throw new Error('Matrix must be square');
    }
    if (matrix.length === 1) return matrix[0][0];
    if (matrix.length === 2) {
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < matrix.length; i++) {
      const minor = matrix.filter((_, row) => row !== 0)
        .map(row => row.filter((_, col) => col !== i));
      det += matrix[0][i] * Math.pow(-1, i) * matrixOperations.determinant(minor);
    }
    return det;
  },
};

// Equation Solver
export const solveLinearEquation = (coefficients: number[], constants: number[]): number[] => {
  // Simple linear equation solver using Gaussian elimination
  const n = coefficients.length;
  const augmented = coefficients.map((row, i) => [...row, constants[i]]);
  
  // Forward elimination
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const factor = augmented[j][i] / augmented[i][i];
      for (let k = i; k <= n; k++) {
        augmented[j][k] -= factor * augmented[i][k];
      }
    }
  }
  
  // Back substitution
  const solution = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += augmented[i][j] * solution[j];
    }
    solution[i] = (augmented[i][n] - sum) / augmented[i][i];
  }
  
  return solution;
};

// Graph Function Evaluator
export const evaluateFunction = (expression: string, x: number): number => {
  // Simple function evaluator - in a real app, you'd use a proper math parser
  const safeEval = (expr: string, xValue: number): number => {
    try {
      // Replace x with the actual value and evaluate
      const sanitized = expr.replace(/x/g, xValue.toString())
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/log/g, 'Math.log10')
        .replace(/ln/g, 'Math.log')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/pow/g, 'Math.pow');
      return eval(sanitized);
    } catch {
      return NaN;
    }
  };
  
  return safeEval(expression, x);
};