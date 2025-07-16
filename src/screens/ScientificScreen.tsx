import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CalculatorButton from '../components/CalculatorButton';
import { colors, spacing } from '../constants/colors';
import { CalculatorState } from '../types';
import { calculate, formatNumber, handlePercentage, handleToggleSign, scientificCalculate } from '../utils/calculate';

type NavigationProp = {
  navigate: (screen: string) => void;
  goBack: () => void;
};

const ScientificScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    mode: 'scientific',
    angleUnit: 'deg',
    base: 10,
  });

  const [pressedButton, setPressedButton] = useState<string | null>(null);

  const handleButtonPress = (type: string, value: string | number) => {
    setPressedButton(value.toString());
    setTimeout(() => setPressedButton(null), 150);

    switch (type) {
      case 'number':
        handleNumberInput(value.toString());
        break;
      case 'operator':
        handleOperatorInput(value.toString());
        break;
      case 'function':
        handleFunctionInput(value.toString());
        break;
      case 'scientific':
        handleScientificInput(value.toString());
        break;
    }
  };

  const handleNumberInput = (num: string) => {
    if (state.waitingForNewValue) {
      setState(prev => ({
        ...prev,
        display: num,
        waitingForNewValue: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        display: prev.display === '0' ? num : prev.display + num,
      }));
    }
  };

  const handleOperatorInput = (operator: string) => {
    const currentValue = parseFloat(state.display);

    if (state.previousValue === null) {
      setState(prev => ({
        ...prev,
        previousValue: currentValue,
        operation: operator,
        waitingForNewValue: true,
      }));
    } else if (state.operation && !state.waitingForNewValue) {
      const result = calculate(state.previousValue, currentValue, state.operation);
      setState(prev => ({
        ...prev,
        display: formatNumber(result),
        previousValue: result,
        operation: operator,
        waitingForNewValue: true,
      }));
    } else {
      setState(prev => ({
        ...prev,
        operation: operator,
        waitingForNewValue: true,
      }));
    }
  };

  const handleFunctionInput = (func: string) => {
    const currentValue = parseFloat(state.display);

    switch (func) {
      case 'clear':
        setState({
          ...state,
          display: '0',
          previousValue: null,
          operation: null,
          waitingForNewValue: false,
        });
        break;
      case 'toggle-sign':
        setState(prev => ({
          ...prev,
          display: formatNumber(handleToggleSign(currentValue)),
        }));
        break;
      case 'percentage':
        setState(prev => ({
          ...prev,
          display: formatNumber(handlePercentage(currentValue)),
        }));
        break;
      case '=':
        if (state.operation && state.previousValue !== null && !state.waitingForNewValue) {
          const result = calculate(state.previousValue, currentValue, state.operation);
          setState({
            ...state,
            display: formatNumber(result),
            previousValue: null,
            operation: null,
            waitingForNewValue: true,
          });
        }
        break;
      case 'toggle-angle':
        setState(prev => ({
          ...prev,
          angleUnit: prev.angleUnit === 'deg' ? 'rad' : 'deg',
        }));
        break;
    }
  };

  const handleScientificInput = (func: string) => {
    const currentValue = parseFloat(state.display);
    
    try {
      const result = scientificCalculate(currentValue, func, state.angleUnit);
      setState(prev => ({
        ...prev,
        display: formatNumber(result),
        waitingForNewValue: true,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        display: 'Error',
        waitingForNewValue: true,
      }));
    }
  };

  const scientificButtonRows = [
    [
      { text: 'sin', type: 'scientific', value: 'sin' },
      { text: 'cos', type: 'scientific', value: 'cos' },
      { text: 'tan', type: 'scientific', value: 'tan' },
      { text: 'log', type: 'scientific', value: 'log' },
    ],
    [
      { text: 'asin', type: 'scientific', value: 'asin' },
      { text: 'acos', type: 'scientific', value: 'acos' },
      { text: 'atan', type: 'scientific', value: 'atan' },
      { text: 'ln', type: 'scientific', value: 'ln' },
    ],
    [
      { text: 'x²', type: 'scientific', value: 'square' },
      { text: 'x³', type: 'scientific', value: 'cube' },
      { text: '√x', type: 'scientific', value: 'sqrt' },
      { text: 'exp', type: 'scientific', value: 'exp' },
    ],
    [
      { text: 'x!', type: 'scientific', value: 'factorial' },
      { text: '1/x', type: 'scientific', value: 'reciprocal' },
      { text: '|x|', type: 'scientific', value: 'abs' },
      { text: state.angleUnit.toUpperCase(), type: 'function', value: 'toggle-angle' },
    ],
  ];

  const standardButtonRows = [
    [
      { text: 'C', type: 'function', value: 'clear' },
      { text: '±', type: 'function', value: 'toggle-sign' },
      { text: '%', type: 'function', value: 'percentage' },
      { text: '÷', type: 'operator', value: '÷' },
    ],
    [
      { text: '7', type: 'number', value: '7' },
      { text: '8', type: 'number', value: '8' },
      { text: '9', type: 'number', value: '9' },
      { text: '×', type: 'operator', value: '×' },
    ],
    [
      { text: '4', type: 'number', value: '4' },
      { text: '5', type: 'number', value: '5' },
      { text: '6', type: 'number', value: '6' },
      { text: '-', type: 'operator', value: '-' },
    ],
    [
      { text: '1', type: 'number', value: '1' },
      { text: '2', type: 'number', value: '2' },
      { text: '3', type: 'number', value: '3' },
      { text: '+', type: 'operator', value: '+' },
    ],
    [
      { text: '0', type: 'number', value: '0', flex: 2 },
      { text: '.', type: 'number', value: '.' },
      { text: '=', type: 'function', value: '=' },
    ],
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scientific</Text>
        <View style={styles.placeholder} />
      </View>
      
      {/* Display */}
      <View style={styles.displayContainer}>
        <View style={styles.displayHeader}>
          <Text style={styles.angleUnit}>{state.angleUnit.toUpperCase()}</Text>
        </View>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {state.display}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Scientific Buttons */}
        <View style={styles.scientificContainer}>
          <Text style={styles.sectionLabel}>Scientific Functions</Text>
          {scientificButtonRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((button, buttonIndex) => (
                <CalculatorButton
                  key={`sci-${rowIndex}-${buttonIndex}`}
                  text={button.text}
                  type={button.type}
                  flex={button.flex}
                  onPress={() => handleButtonPress(button.type, button.value)}
                  isPressed={pressedButton === button.value.toString()}
                />
              ))}
            </View>
          ))}
        </View>

        {/* Standard Buttons */}
        <View style={styles.buttonsContainer}>
          <Text style={styles.sectionLabel}>Standard Operations</Text>
          {standardButtonRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.buttonRow}>
              {row.map((button, buttonIndex) => (
                <CalculatorButton
                  key={`std-${rowIndex}-${buttonIndex}`}
                  text={button.text}
                  type={button.type}
                  flex={button.flex}
                  onPress={() => handleButtonPress(button.type, button.value)}
                  isPressed={pressedButton === button.value.toString()}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: colors.menuBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 20,
    color: colors.menuText,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.menuText,
  },
  placeholder: {
    width: 44,
  },
  displayContainer: {
    backgroundColor: colors.displayBackground,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 120,
  },
  displayHeader: {
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  angleUnit: {
    fontSize: 14,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  displayText: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.displayText,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  scientificContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  buttonsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryText,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
});

export default ScientificScreen; 