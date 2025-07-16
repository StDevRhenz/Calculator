import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../constants/colors';
import { solveLinearEquation } from '../utils/calculate';

type NavigationProp = {
  goBack: () => void;
};

const EquationSolverScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [equationType, setEquationType] = useState<'linear' | 'quadratic'>('linear');
  const [equations, setEquations] = useState<string[]>(['']);
  const [result, setResult] = useState<string>('');
  const [coefficients, setCoefficients] = useState<number[]>([1, 1]);
  const [constants, setConstants] = useState<number[]>([0, 0]);

  const solveLinearSystem = () => {
    try {
      const solution = solveLinearEquation(coefficients, constants);
      setResult(`Solution:\nx = ${solution[0].toFixed(4)}\ny = ${solution[1].toFixed(4)}`);
    } catch (error) {
      setResult('Error: Unable to solve system of equations');
    }
  };

  const solveQuadratic = () => {
    if (coefficients.length < 3) {
      setResult('Error: Need coefficients for ax² + bx + c = 0');
      return;
    }

    const [a, b, c] = coefficients;
    const discriminant = b * b - 4 * a * c;

    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      setResult(`Solutions:\nx₁ = ${x1.toFixed(4)}\nx₂ = ${x2.toFixed(4)}`);
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      setResult(`Solution:\nx = ${x.toFixed(4)} (double root)`);
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-discriminant) / (2 * a);
      setResult(`Solutions:\nx₁ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i\nx₂ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`);
    }
  };

  const updateCoefficient = (index: number, value: string) => {
    const newCoefficients = [...coefficients];
    newCoefficients[index] = parseFloat(value) || 0;
    setCoefficients(newCoefficients);
  };

  const updateConstant = (index: number, value: string) => {
    const newConstants = [...constants];
    newConstants[index] = parseFloat(value) || 0;
    setConstants(newConstants);
  };

  const renderLinearSystem = () => (
    <View style={styles.equationSection}>
      <Text style={styles.sectionLabel}>Linear System (2 equations)</Text>
      
      <View style={styles.equationContainer}>
        <Text style={styles.equationLabel}>Equation 1:</Text>
        <View style={styles.coefficientRow}>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[0].toString()}
            onChangeText={(text) => updateCoefficient(0, text)}
            keyboardType="numeric"
            placeholder="1"
          />
          <Text style={styles.variableText}>x +</Text>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[1].toString()}
            onChangeText={(text) => updateCoefficient(1, text)}
            keyboardType="numeric"
            placeholder="1"
          />
          <Text style={styles.variableText}>y =</Text>
          <TextInput
            style={styles.coefficientInput}
            value={constants[0].toString()}
            onChangeText={(text) => updateConstant(0, text)}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      <View style={styles.equationContainer}>
        <Text style={styles.equationLabel}>Equation 2:</Text>
        <View style={styles.coefficientRow}>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[2]?.toString() || '1'}
            onChangeText={(text) => updateCoefficient(2, text)}
            keyboardType="numeric"
            placeholder="1"
          />
          <Text style={styles.variableText}>x +</Text>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[3]?.toString() || '1'}
            onChangeText={(text) => updateCoefficient(3, text)}
            keyboardType="numeric"
            placeholder="1"
          />
          <Text style={styles.variableText}>y =</Text>
          <TextInput
            style={styles.coefficientInput}
            value={constants[1].toString()}
            onChangeText={(text) => updateConstant(1, text)}
            keyboardType="numeric"
            placeholder="0"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.solveButton} onPress={solveLinearSystem}>
        <Text style={styles.solveButtonText}>Solve System</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuadratic = () => (
    <View style={styles.equationSection}>
      <Text style={styles.sectionLabel}>Quadratic Equation</Text>
      <Text style={styles.equationFormat}>ax² + bx + c = 0</Text>
      
      <View style={styles.equationContainer}>
        <View style={styles.coefficientRow}>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[0].toString()}
            onChangeText={(text) => updateCoefficient(0, text)}
            keyboardType="numeric"
            placeholder="1"
          />
          <Text style={styles.variableText}>x² +</Text>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[1].toString()}
            onChangeText={(text) => updateCoefficient(1, text)}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.variableText}>x +</Text>
          <TextInput
            style={styles.coefficientInput}
            value={coefficients[2]?.toString() || '0'}
            onChangeText={(text) => updateCoefficient(2, text)}
            keyboardType="numeric"
            placeholder="0"
          />
          <Text style={styles.variableText}>= 0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.solveButton} onPress={solveQuadratic}>
        <Text style={styles.solveButtonText}>Solve Quadratic</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Equation Solver</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Equation Type Selector */}
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              equationType === 'linear' && styles.activeTypeButton,
            ]}
            onPress={() => setEquationType('linear')}
          >
            <Text style={[
              styles.typeButtonText,
              equationType === 'linear' && styles.activeTypeButtonText,
            ]}>
              Linear System
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              equationType === 'quadratic' && styles.activeTypeButton,
            ]}
            onPress={() => setEquationType('quadratic')}
          >
            <Text style={[
              styles.typeButtonText,
              equationType === 'quadratic' && styles.activeTypeButtonText,
            ]}>
              Quadratic
            </Text>
          </TouchableOpacity>
        </View>

        {/* Equation Input */}
        {equationType === 'linear' ? renderLinearSystem() : renderQuadratic()}

        {/* Result */}
        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionLabel}>Solution</Text>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>{result}</Text>
            </View>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
  },
  typeButton: {
    flex: 1,
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: colors.accent,
  },
  typeButtonText: {
    color: colors.menuText,
    fontWeight: '600',
  },
  activeTypeButtonText: {
    color: colors.background,
  },
  equationSection: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.md,
  },
  equationFormat: {
    color: colors.secondaryText,
    fontSize: 14,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  equationContainer: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  equationLabel: {
    color: colors.menuText,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  coefficientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  coefficientInput: {
    width: 60,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    textAlign: 'center',
    color: colors.menuText,
    fontSize: 16,
  },
  variableText: {
    color: colors.menuText,
    fontSize: 16,
    marginHorizontal: spacing.xs,
  },
  solveButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  solveButtonText: {
    color: colors.background,
    fontWeight: '600',
    fontSize: 16,
  },
  resultSection: {
    padding: spacing.lg,
  },
  resultContainer: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  resultText: {
    color: colors.menuText,
    fontSize: 14,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
});

export default EquationSolverScreen; 