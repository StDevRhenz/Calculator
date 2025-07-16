import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../constants/colors';
import { convertBase, formatBinary, formatHex } from '../utils/calculate';

type NavigationProp = {
  goBack: () => void;
};

const ProgrammerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [currentBase, setCurrentBase] = useState<2 | 8 | 10 | 16>(10);
  const [decimalValue, setDecimalValue] = useState(0);
  const [displayValue, setDisplayValue] = useState('0');

  const bases = [
    { value: 2, label: 'BIN', color: '#FF6B6B' },
    { value: 8, label: 'OCT', color: '#4ECDC4' },
    { value: 10, label: 'DEC', color: '#45B7D1' },
    { value: 16, label: 'HEX', color: '#96CEB4' },
  ];

  const handleNumberInput = (num: string) => {
    let newValue: number;
    
    if (currentBase === 16) {
      newValue = parseInt(displayValue + num, 16);
    } else {
      newValue = parseInt(displayValue + num, currentBase);
    }

    if (!isNaN(newValue)) {
      setDecimalValue(newValue);
      updateDisplay(newValue);
    }
  };

  const updateDisplay = (value: number) => {
    let display: string;
    switch (currentBase) {
      case 2:
        display = value.toString(2);
        break;
      case 8:
        display = value.toString(8);
        break;
      case 16:
        display = value.toString(16).toUpperCase();
        break;
      default:
        display = value.toString();
    }
    setDisplayValue(display);
  };

  const handleBaseChange = (base: 2 | 8 | 10 | 16) => {
    setCurrentBase(base);
    updateDisplay(decimalValue);
  };

  const handleClear = () => {
    setDecimalValue(0);
    setDisplayValue('0');
  };

  const handleBitwiseOperation = (operation: string) => {
    let result: number;
    switch (operation) {
      case 'AND':
        result = decimalValue & 0xFF;
        break;
      case 'OR':
        result = decimalValue | 0xFF;
        break;
      case 'XOR':
        result = decimalValue ^ 0xFF;
        break;
      case 'NOT':
        result = ~decimalValue & 0xFF;
        break;
      case 'LSHIFT':
        result = (decimalValue << 1) & 0xFF;
        break;
      case 'RSHIFT':
        result = (decimalValue >> 1) & 0xFF;
        break;
      default:
        return;
    }
    setDecimalValue(result);
    updateDisplay(result);
  };

  const getHexDigits = () => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  const getOctalDigits = () => ['0', '1', '2', '3', '4', '5', '6', '7'];
  const getBinaryDigits = () => ['0', '1'];

  const getValidDigits = () => {
    switch (currentBase) {
      case 2:
        return getBinaryDigits();
      case 8:
        return getOctalDigits();
      case 16:
        return getHexDigits();
      default:
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    }
  };

  const numberButtons = getValidDigits().map(digit => ({
    text: digit,
    type: 'number' as const,
    value: digit,
  }));

  const bitwiseButtons = [
    { text: 'AND', value: 'AND' },
    { text: 'OR', value: 'OR' },
    { text: 'XOR', value: 'XOR' },
    { text: 'NOT', value: 'NOT' },
    { text: '<<', value: 'LSHIFT' },
    { text: '>>', value: 'RSHIFT' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Programmer</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Base Selector */}
      <View style={styles.baseSelector}>
        {bases.map((base) => (
          <TouchableOpacity
            key={base.value}
            style={[
              styles.baseButton,
              currentBase === base.value && styles.activeBaseButton,
            ]}
            onPress={() => handleBaseChange(base.value as 2 | 8 | 10 | 16)}
          >
            <Text style={[
              styles.baseText,
              currentBase === base.value && styles.activeBaseText,
            ]}>
              {base.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Display */}
      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {displayValue}
        </Text>
        <Text style={styles.baseLabel}>{currentBase.toString().toUpperCase()}</Text>
      </View>

      {/* Bitwise Operations */}
      <View style={styles.bitwiseContainer}>
        <Text style={styles.sectionLabel}>Bitwise Operations</Text>
        <View style={styles.bitwiseButtons}>
          {bitwiseButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bitwiseButton}
              onPress={() => handleBitwiseOperation(button.value)}
            >
              <Text style={styles.bitwiseText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Number Pad */}
      <View style={styles.numberPad}>
        <View style={styles.numberGrid}>
          {numberButtons.map((button, index) => (
            <TouchableOpacity
              key={index}
              style={styles.numberButton}
              onPress={() => handleNumberInput(button.value)}
            >
              <Text style={styles.numberText}>{button.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>
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
  baseSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  baseButton: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 60,
    alignItems: 'center',
  },
  activeBaseButton: {
    backgroundColor: colors.accent,
  },
  baseText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.menuText,
  },
  activeBaseText: {
    color: colors.background,
  },
  displayContainer: {
    backgroundColor: colors.displayBackground,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: 'flex-end',
  },
  displayText: {
    fontSize: 32,
    fontWeight: '200',
    color: colors.displayText,
    textAlign: 'right',
  },
  baseLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: spacing.xs,
  },
  bitwiseContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.md,
  },
  bitwiseButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bitwiseButton: {
    backgroundColor: colors.scientificButton,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    minWidth: '30%',
    alignItems: 'center',
  },
  bitwiseText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.scientificButtonText,
  },
  numberPad: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  numberGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  numberButton: {
    backgroundColor: colors.numberButton,
    borderRadius: borderRadius.full,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.numberButtonText,
  },
  clearButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.menuText,
  },
});

export default ProgrammerScreen; 