# Enhanced Calculator App 🧮

A feature-rich calculator app built with React Native and Expo, featuring multiple calculation modes and advanced mathematical functions.

## Features

### 🍔 Hamburger Menu
- Access all calculator modes through an intuitive hamburger menu
- Quick switching between different calculator types

### 📝 History Log
- Automatic calculation history tracking
- Tap the history button (📝) to view past calculations
- Reuse previous results with a single tap
- Clear history option available

### 🧮 Scientific Calculator
- **Trigonometric Functions**: sin, cos, tan, asin, acos, atan
- **Logarithmic Functions**: log (base 10), ln (natural log)
- **Power Functions**: x², x³, √x, exp
- **Advanced Functions**: factorial, absolute value
- **Angle Units**: Toggle between degrees and radians
- **Error Handling**: Graceful handling of invalid operations

### 💻 Programmer Calculator
- **Base Conversions**: Binary (BIN), Octal (OCT), Decimal (DEC), Hexadecimal (HEX)
- **Bitwise Operations**: AND, OR, XOR, NOT, Left Shift (<<), Right Shift (>>)
- **Dynamic Number Pad**: Shows only valid digits for selected base
- **Real-time Conversion**: Instant conversion between bases

### 📏 Unit Converter
- **Length**: meters, kilometers, centimeters, millimeters, miles, yards, feet, inches
- **Weight**: kilograms, grams, milligrams, pounds, ounces
- **Temperature**: Celsius, Fahrenheit, Kelvin
- **Area**: square meters, square kilometers, square centimeters, etc.
- **Volume**: cubic meters, liters, milliliters, gallons, quarts, pints
- **Swap Function**: Quick unit swapping with ⇅ button

### 🎨 Modern UI Design
- **Dark Theme**: Eye-friendly dark interface
- **Responsive Design**: Adapts to different screen sizes
- **Smooth Animations**: Button press feedback and transitions
- **Consistent Styling**: Unified design language across all modes

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the App**
   ```bash
   npx expo start
   ```

3. **Run on Device/Simulator**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web

## Usage Guide

### Standard Calculator
- Basic arithmetic operations (+, -, ×, ÷)
- Percentage calculations
- Sign toggle (±)
- Clear function (C)

### Scientific Calculator
- Access via hamburger menu → Scientific
- Use trigonometric functions with angle unit toggle
- Calculate factorials and powers
- Natural and base-10 logarithms

### Programmer Calculator
- Access via hamburger menu → Programmer
- Select base (BIN/OCT/DEC/HEX)
- Perform bitwise operations
- Real-time base conversion

### Unit Converter
- Access via hamburger menu → Unit Converter
- Select conversion category
- Choose from/to units
- Use swap button for quick reversal

### History Feature
- Tap the 📝 button to view calculation history
- Tap any history entry to reuse the result
- Use "Clear" to remove all history

## Technical Details

### Architecture
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Hooks
- **Styling**: React Native StyleSheet
- **Type Safety**: TypeScript

### Performance Optimizations
- Lightweight implementation to prevent lag
- Efficient state management
- Optimized rendering with proper key props
- Memory-conscious history storage (max 50 entries)

### File Structure
```
src/
├── components/          # Reusable UI components
│   ├── CalculatorButton.tsx
│   ├── MenuButton.tsx
│   ├── ModeMenu.tsx
│   └── HistoryPanel.tsx
├── screens/            # Calculator mode screens
│   ├── HomeScreen.tsx
│   ├── ScientificScreen.tsx
│   ├── UnitConverterScreen.tsx
│   └── ProgrammerScreen.tsx
├── constants/          # Design system
│   └── colors.ts
├── utils/             # Calculation logic
│   └── calculate.ts
└── types/             # TypeScript definitions
    └── index.ts
```

## Contributing

Feel free to contribute to this project by:
- Adding new calculation modes
- Improving the UI/UX
- Adding more unit conversions
- Enhancing the scientific functions
- Optimizing performance

## License

This project is open source and available under the MIT License.

