import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../constants/colors';
import { convertUnit, unitConversions } from '../utils/calculate';

type NavigationProp = {
  goBack: () => void;
};

const UnitConverterScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('3.28084');

  const categories = [
    { id: 'length', name: 'Length', icon: '📏' },
    { id: 'weight', name: 'Weight', icon: '⚖️' },
    { id: 'temperature', name: 'Temperature', icon: '🌡️' },
    { id: 'area', name: 'Area', icon: '📐' },
    { id: 'volume', name: 'Volume', icon: '🧪' },
  ];

  const getUnitsForCategory = (category: string) => {
    const conversions = unitConversions[category as keyof typeof unitConversions];
    return conversions ? Object.keys(conversions) : [];
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    if (value && !isNaN(parseFloat(value))) {
      const result = convertUnit(parseFloat(value), fromUnit, toUnit, selectedCategory);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setToValue('0');
    }
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    if (fromValue && !isNaN(parseFloat(fromValue))) {
      const result = convertUnit(parseFloat(fromValue), unit, toUnit, selectedCategory);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    if (fromValue && !isNaN(parseFloat(fromValue))) {
      const result = convertUnit(parseFloat(fromValue), fromUnit, unit, selectedCategory);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const units = getUnitsForCategory(category);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setFromValue('1');
    if (units.length > 1) {
      const result = convertUnit(1, units[0], units[1], category);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setToValue('1');
    }
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Unit Converter</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Category Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => handleCategoryChange(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.activeCategoryText,
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Converter */}
      <View style={styles.converterContainer}>
        {/* From Unit */}
        <View style={styles.unitSection}>
          <Text style={styles.sectionLabel}>From</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.valueInput}
              value={fromValue}
              onChangeText={handleFromValueChange}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.secondaryText}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitSelector}>
              {getUnitsForCategory(selectedCategory).map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitButton,
                    fromUnit === unit && styles.activeUnitButton,
                  ]}
                  onPress={() => handleFromUnitChange(unit)}
                >
                  <Text style={[
                    styles.unitText,
                    fromUnit === unit && styles.activeUnitText,
                  ]}>
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Swap Button */}
        <TouchableOpacity style={styles.swapButton} onPress={swapUnits}>
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>

        {/* To Unit */}
        <View style={styles.unitSection}>
          <Text style={styles.sectionLabel}>To</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.valueInput}
              value={toValue}
              editable={false}
              placeholder="0"
              placeholderTextColor={colors.secondaryText}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitSelector}>
              {getUnitsForCategory(selectedCategory).map((unit) => (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitButton,
                    toUnit === unit && styles.activeUnitButton,
                  ]}
                  onPress={() => handleToUnitChange(unit)}
                >
                  <Text style={[
                    styles.unitText,
                    toUnit === unit && styles.activeUnitText,
                  ]}>
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
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
  categoryContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  categoryButton: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginRight: spacing.md,
    alignItems: 'center',
    minWidth: 80,
  },
  activeCategoryButton: {
    backgroundColor: colors.accent,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.menuText,
    textAlign: 'center',
  },
  activeCategoryText: {
    color: colors.background,
  },
  converterContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  unitSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.md,
  },
  inputContainer: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  valueInput: {
    fontSize: 32,
    fontWeight: '200',
    color: colors.menuText,
    textAlign: 'center',
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
  },
  unitSelector: {
    flexDirection: 'row',
  },
  unitButton: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
  },
  activeUnitButton: {
    backgroundColor: colors.accent,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.menuText,
  },
  activeUnitText: {
    color: colors.background,
  },
  swapButton: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: borderRadius.full,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  swapIcon: {
    fontSize: 20,
    color: colors.background,
    fontWeight: '600',
  },
});

export default UnitConverterScreen; 