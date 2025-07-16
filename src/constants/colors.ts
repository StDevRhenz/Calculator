export const colors = {
  // Background colors
  background: '#000000',
  displayBackground: '#1C1C1E',
  menuBackground: '#2C2C2E',
  
  // Button colors
  numberButton: '#333333',
  numberButtonPressed: '#4A4A4A',
  operatorButton: '#FF9500',
  operatorButtonPressed: '#FFB143',
  functionButton: '#A6A6A6',
  functionButtonPressed: '#D1D1D1',
  scientificButton: '#4A4A4A',
  scientificButtonPressed: '#5A5A5A',
  modeButton: '#007AFF',
  modeButtonPressed: '#0056CC',
  
  // Text colors
  displayText: '#FFFFFF',
  numberButtonText: '#FFFFFF',
  operatorButtonText: '#FFFFFF',
  functionButtonText: '#000000',
  scientificButtonText: '#FFFFFF',
  modeButtonText: '#FFFFFF',
  menuText: '#FFFFFF',
  secondaryText: '#8E8E93',
  
  // Accent colors
  accent: '#FF9500',
  shadow: 'rgba(0, 0, 0, 0.3)',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  
  // Graph colors
  graphBackground: '#1C1C1E',
  graphGrid: '#333333',
  graphLine1: '#FF9500',
  graphLine2: '#007AFF',
  graphLine3: '#34C759',
  graphLine4: '#FF3B30',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const calculatorModes = [
  { id: 'standard', name: 'Standard', icon: '🔢' },
  { id: 'scientific', name: 'Scientific', icon: '🧮' },
  { id: 'programmer', name: 'Programmer', icon: '💻' },
  { id: 'unit', name: 'Unit Converter', icon: '📏' },
  { id: 'graph', name: 'Graphing', icon: '📈' },
  { id: 'matrix', name: 'Matrix', icon: '📊' },
  { id: 'equation', name: 'Equation Solver', icon: '🔍' },
] as const;