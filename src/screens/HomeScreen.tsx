import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CalculatorButton from '../components/CalculatorButton';
import MenuButton from '../components/MenuButton';
import ModeMenu from '../components/ModeMenu';
import HistoryPanel from '../components/HistoryPanel';
import { colors, spacing } from '../constants/colors';
import { CalculatorState, HistoryEntry } from '../types';
import { calculate, formatNumber, handlePercentage, handleToggleSign } from '../utils/calculate';

type NavigationProp = {
  navigate: (screen: string) => void;
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false,
    mode: 'standard',
    angleUnit: 'deg',
    base: 10,
  });

  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [expression, setExpression] = useState<string>('');
  const [displayAnimation] = useState(new Animated.Value(1));
  const [resultAnimation] = useState(new Animated.Value(1));

  const addToHistory = (expression: string, result: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date(),
      mode: state.mode,
    };
    setHistory(prev => [newEntry, ...prev.slice(0, 49)]); // Keep only last 50 entries
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    setState(prev => ({
      ...prev,
      display: entry.result,
      waitingForNewValue: true,
    }));
    setExpression(entry.result);
    setHistoryVisible(false);
  };

  const handleModeSelect = (mode: string) => {
    setMenuVisible(false);
    switch (mode) {
      case 'scientific':
        navigation.navigate('Scientific');
        break;
      case 'unit':
        navigation.navigate('UnitConverter');
        break;
      case 'programmer':
        navigation.navigate('Programmer');
        break;
      case 'graph':
        navigation.navigate('Graphing');
        break;
      case 'matrix':
        navigation.navigate('Matrix');
        break;
      case 'equation':
        navigation.navigate('EquationSolver');
        break;
      default:
        // Stay in standard mode
        break;
    }
  };

  const animateDisplay = () => {
    Animated.sequence([
      Animated.timing(displayAnimation, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(displayAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const animateResult = () => {
    Animated.sequence([
      Animated.timing(resultAnimation, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(resultAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

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
    }
  };

  const handleNumberInput = (num: string) => {
    if (state.waitingForNewValue) {
      setState(prev => ({
        ...prev,
        display: num,
        waitingForNewValue: false,
      }));
      setExpression(prev => prev + num);
    } else {
      setState(prev => ({
        ...prev,
        display: prev.display === '0' ? num : prev.display + num,
      }));
      setExpression(prev => {
        if (prev === '0' || prev === '') {
          return num;
        }
        return prev + num;
      });
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
      setExpression(prev => {
        const cleanExpression = prev.replace(/[+\-×÷]$/, '');
        return cleanExpression + ' ' + operator + ' ';
      });
    } else if (state.operation && !state.waitingForNewValue) {
      const result = calculate(state.previousValue, currentValue, state.operation);
      const fullExpression = `${state.previousValue} ${state.operation} ${currentValue}`;
      addToHistory(fullExpression, formatNumber(result));
      animateResult();
      setState(prev => ({
        ...prev,
        display: formatNumber(result),
        previousValue: result,
        operation: operator,
        waitingForNewValue: true,
      }));
      setExpression(fullExpression + ' ' + operator + ' ');
    } else {
      setState(prev => ({
        ...prev,
        operation: operator,
        waitingForNewValue: true,
      }));
      setExpression(prev => {
        const cleanExpression = prev.replace(/[+\-×÷]$/, '');
        return cleanExpression + ' ' + operator + ' ';
      });
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
        setExpression('');
        break;
      case 'toggle-sign':
        const newValue = handleToggleSign(currentValue);
        setState(prev => ({
          ...prev,
          display: formatNumber(newValue),
        }));
        setExpression(prev => {
          const parts = prev.split(' ');
          if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (!isNaN(parseFloat(lastPart))) {
              parts[parts.length - 1] = formatNumber(newValue);
              return parts.join(' ');
            }
          }
          return formatNumber(newValue);
        });
        break;
      case 'percentage':
        const percentValue = handlePercentage(currentValue);
        setState(prev => ({
          ...prev,
          display: formatNumber(percentValue),
        }));
        setExpression(prev => {
          const parts = prev.split(' ');
          if (parts.length > 0) {
            const lastPart = parts[parts.length - 1];
            if (!isNaN(parseFloat(lastPart))) {
              parts[parts.length - 1] = formatNumber(percentValue);
              return parts.join(' ');
            }
          }
          return formatNumber(percentValue);
        });
        break;
      case '=':
        if (state.operation && state.previousValue !== null && !state.waitingForNewValue) {
          const result = calculate(state.previousValue, currentValue, state.operation);
          const fullExpression = `${state.previousValue} ${state.operation} ${currentValue}`;
          addToHistory(fullExpression, formatNumber(result));
          animateResult();
          setState({
            ...state,
            display: formatNumber(result),
            previousValue: null,
            operation: null,
            waitingForNewValue: true,
          });
          setExpression(fullExpression + ' = ' + formatNumber(result));
        }
        break;
    }
  };

  type ButtonConfig = {
    text: string;
    type: 'function' | 'operator' | 'number';
    value: string;
    flex?: number;
  };

  const buttonRows: ButtonConfig[][] = [
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
      
      {/* Header with Menu and History */}
      <View style={styles.header}>
        <MenuButton onPress={() => setMenuVisible(true)} />
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => setHistoryVisible(true)}
        >
          <Text style={styles.historyIcon}>📝</Text>
        </TouchableOpacity>
      </View>
      
      {/* Display */}
      <View style={styles.displayContainer}>
        {/* Expression Display */}
        <View style={styles.expressionContainer}>
          <Text style={styles.expressionText} numberOfLines={3} adjustsFontSizeToFit>
            {expression || '0'}
          </Text>
        </View>
        
        {/* Result Display */}
        <View style={styles.resultContainer}>
          <Animated.Text 
            style={[styles.resultText, { transform: [{ scale: resultAnimation }] }]} 
            numberOfLines={1} 
            adjustsFontSizeToFit
          >
            {state.display}
          </Animated.Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {buttonRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.buttonRow}>
            {row.map((button, buttonIndex) => (
              <CalculatorButton
                key={`${rowIndex}-${buttonIndex}`}
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

      {/* Mode Menu */}
      <ModeMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onModeSelect={handleModeSelect}
        currentMode={state.mode}
      />

      {/* History Panel */}
      <HistoryPanel
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        history={history}
        onHistorySelect={handleHistorySelect}
        onClearHistory={clearHistory}
      />
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  historyButton: {
    width: 44,
    height: 44,
    borderRadius: 9999,
    backgroundColor: colors.menuBackground,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.sm,
  },
  historyIcon: {
    fontSize: 20,
  },
  displayContainer: {
    flex: 1,
    backgroundColor: colors.displayBackground,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: 16,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  expressionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    minHeight: 80,
  },
  expressionText: {
    fontSize: 28,
    fontWeight: '300',
    color: colors.secondaryText,
    textAlign: 'right',
    lineHeight: 36,
  },
  resultContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    minHeight: 80,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    paddingTop: spacing.md,
  },
  resultText: {
    fontSize: 48,
    fontWeight: '200',
    color: colors.displayText,
    textAlign: 'right',
  },
  buttonsContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;