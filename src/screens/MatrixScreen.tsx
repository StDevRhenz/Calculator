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
import { matrixOperations } from '../utils/calculate';

type NavigationProp = {
  goBack: () => void;
};

interface Matrix {
  id: string;
  name: string;
  rows: number;
  cols: number;
  data: number[][];
}

const MatrixScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [matrices, setMatrices] = useState<Matrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [operation, setOperation] = useState<string>('');

  const createMatrix = (rows: number, cols: number) => {
    const newMatrix: Matrix = {
      id: Date.now().toString(),
      name: `Matrix ${matrices.length + 1}`,
      rows,
      cols,
      data: Array(rows).fill(0).map(() => Array(cols).fill(0)),
    };
    setMatrices(prev => [...prev, newMatrix]);
    setSelectedMatrix(newMatrix.id);
  };

  const updateMatrixValue = (matrixId: string, row: number, col: number, value: string) => {
    setMatrices(prev => prev.map(matrix => {
      if (matrix.id === matrixId) {
        const newData = [...matrix.data];
        newData[row][col] = parseFloat(value) || 0;
        return { ...matrix, data: newData };
      }
      return matrix;
    }));
  };

  const performOperation = (op: string) => {
    if (matrices.length < 2) {
      setResult('Need at least 2 matrices for operations');
      return;
    }

    const matrixA = matrices[0];
    const matrixB = matrices[1];

    try {
      let resultMatrix: number[][];
      let resultText: string;

      switch (op) {
        case 'add':
          resultMatrix = matrixOperations.add(matrixA.data, matrixB.data);
          resultText = 'Addition Result:';
          break;
        case 'multiply':
          resultMatrix = matrixOperations.multiply(matrixA.data, matrixB.data);
          resultText = 'Multiplication Result:';
          break;
        case 'determinant':
          if (matrixA.rows !== matrixA.cols) {
            setResult('Determinant only works with square matrices');
            return;
          }
          const det = matrixOperations.determinant(matrixA.data);
          setResult(`Determinant of ${matrixA.name}: ${det}`);
          return;
        default:
          setResult('Invalid operation');
          return;
      }

      const resultStr = resultMatrix.map(row => 
        row.map(val => val.toFixed(2)).join('  ')
      ).join('\n');
      
      setResult(`${resultText}\n${resultStr}`);
      setOperation(op);
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Invalid operation'}`);
    }
  };

  const renderMatrix = (matrix: Matrix) => {
    return (
      <View key={matrix.id} style={styles.matrixContainer}>
        <Text style={styles.matrixName}>{matrix.name} ({matrix.rows}×{matrix.cols})</Text>
        <View style={styles.matrixGrid}>
          {matrix.data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.matrixRow}>
              {row.map((value, colIndex) => (
                <TextInput
                  key={colIndex}
                  style={styles.matrixCell}
                  value={value.toString()}
                  onChangeText={(text) => updateMatrixValue(matrix.id, rowIndex, colIndex, text)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.secondaryText}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Matrix Calculator</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Create Matrix */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Create Matrix</Text>
          <View style={styles.createButtons}>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => createMatrix(2, 2)}
            >
              <Text style={styles.createButtonText}>2×2</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => createMatrix(3, 3)}
            >
              <Text style={styles.createButtonText}>3×3</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => createMatrix(2, 3)}
            >
              <Text style={styles.createButtonText}>2×3</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => createMatrix(3, 2)}
            >
              <Text style={styles.createButtonText}>3×2</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Matrices */}
        {matrices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Matrices</Text>
            {matrices.map(renderMatrix)}
          </View>
        )}

        {/* Operations */}
        {matrices.length >= 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Operations</Text>
            <View style={styles.operationButtons}>
              <TouchableOpacity 
                style={styles.operationButton}
                onPress={() => performOperation('add')}
              >
                <Text style={styles.operationButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.operationButton}
                onPress={() => performOperation('multiply')}
              >
                <Text style={styles.operationButtonText}>Multiply</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.operationButton}
                onPress={() => performOperation('determinant')}
              >
                <Text style={styles.operationButtonText}>Det(A)</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Result */}
        {result && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Result</Text>
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
  section: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.md,
  },
  createButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  createButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  createButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  matrixContainer: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  matrixName: {
    color: colors.menuText,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  matrixGrid: {
    alignItems: 'center',
  },
  matrixRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  matrixCell: {
    width: 50,
    height: 40,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.xs,
    textAlign: 'center',
    color: colors.menuText,
    fontSize: 14,
  },
  operationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  operationButton: {
    backgroundColor: colors.scientificButton,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  operationButtonText: {
    color: colors.scientificButtonText,
    fontWeight: '600',
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
  },
});

export default MatrixScreen; 