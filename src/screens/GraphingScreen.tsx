import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../constants/colors';
import { evaluateFunction } from '../utils/calculate';

type NavigationProp = {
  goBack: () => void;
};

interface GraphFunction {
  id: string;
  expression: string;
  color: string;
  visible: boolean;
}

const GraphingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [functions, setFunctions] = useState<GraphFunction[]>([
    { id: '1', expression: 'x', color: colors.graphLine1, visible: true },
  ]);
  const [currentFunction, setCurrentFunction] = useState('x');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [yMin, setYMin] = useState('-10');
  const [yMax, setYMax] = useState('10');

  const graphColors = [colors.graphLine1, colors.graphLine2, colors.graphLine3, colors.graphLine4];

  const addFunction = () => {
    if (currentFunction.trim()) {
      const newFunction: GraphFunction = {
        id: Date.now().toString(),
        expression: currentFunction.trim(),
        color: graphColors[functions.length % graphColors.length],
        visible: true,
      };
      setFunctions(prev => [...prev, newFunction]);
      setCurrentFunction('');
    }
  };

  const removeFunction = (id: string) => {
    setFunctions(prev => prev.filter(f => f.id !== id));
  };

  const toggleFunction = (id: string) => {
    setFunctions(prev => prev.map(f => 
      f.id === id ? { ...f, visible: !f.visible } : f
    ));
  };

  const generateGraphPoints = () => {
    const points: { x: number; y: number; color: string }[] = [];
    const step = (parseFloat(xMax) - parseFloat(xMin)) / 100;

    functions.forEach(func => {
      if (func.visible) {
        for (let x = parseFloat(xMin); x <= parseFloat(xMax); x += step) {
          try {
            const y = evaluateFunction(func.expression, x);
            if (!isNaN(y) && isFinite(y) && y >= parseFloat(yMin) && y <= parseFloat(yMax)) {
              points.push({ x, y, color: func.color });
            }
          } catch (error) {
            // Skip invalid points
          }
        }
      }
    });

    return points;
  };

  const renderGraph = () => {
    const points = generateGraphPoints();
    const width = 300;
    const height = 200;
    const xScale = width / (parseFloat(xMax) - parseFloat(xMin));
    const yScale = height / (parseFloat(yMax) - parseFloat(yMin));

    return (
      <View style={styles.graphContainer}>
        <View style={styles.graph}>
          {/* Grid lines */}
          <View style={styles.gridLines}>
            {Array.from({ length: 11 }, (_, i) => (
              <View key={i} style={[styles.gridLine, { left: (i * width) / 10 }]} />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <View key={i} style={[styles.gridLine, { top: (i * height) / 10, left: 0, width: width, height: 1 }]} />
            ))}
          </View>
          
          {/* Points */}
          {points.map((point, index) => (
            <View
              key={index}
              style={[
                styles.point,
                {
                  left: (point.x - parseFloat(xMin)) * xScale - 2,
                  top: height - (point.y - parseFloat(yMin)) * yScale - 2,
                  backgroundColor: point.color,
                }
              ]}
            />
          ))}
        </View>
        
        {/* Axis labels */}
        <View style={styles.axisLabels}>
          <Text style={styles.axisLabel}>X: {xMin} to {xMax}</Text>
          <Text style={styles.axisLabel}>Y: {yMin} to {yMax}</Text>
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
        <Text style={styles.title}>Graphing Calculator</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Function Input */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionLabel}>Add Function</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.functionInput}
            value={currentFunction}
            onChangeText={setCurrentFunction}
            placeholder="Enter function (e.g., x^2, sin(x), 2*x+1)"
            placeholderTextColor={colors.secondaryText}
          />
          <TouchableOpacity style={styles.addButton} onPress={addFunction}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Functions List */}
      <View style={styles.functionsSection}>
        <Text style={styles.sectionLabel}>Functions</Text>
        <ScrollView style={styles.functionsList}>
          {functions.map((func, index) => (
            <View key={func.id} style={styles.functionItem}>
              <View style={styles.functionInfo}>
                <View style={[styles.colorIndicator, { backgroundColor: func.color }]} />
                <Text style={styles.functionText}>f{index + 1}(x) = {func.expression}</Text>
              </View>
              <View style={styles.functionActions}>
                <TouchableOpacity 
                  style={[styles.toggleButton, !func.visible && styles.toggleButtonOff]}
                  onPress={() => toggleFunction(func.id)}
                >
                  <Text style={styles.toggleText}>{func.visible ? 'ON' : 'OFF'}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => removeFunction(func.id)}
                >
                  <Text style={styles.removeText}>×</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Graph */}
      <View style={styles.graphSection}>
        <Text style={styles.sectionLabel}>Graph</Text>
        {renderGraph()}
      </View>

      {/* Range Controls */}
      <View style={styles.rangeSection}>
        <Text style={styles.sectionLabel}>Range</Text>
        <View style={styles.rangeInputs}>
          <View style={styles.rangeInput}>
            <Text style={styles.rangeLabel}>X Min:</Text>
            <TextInput
              style={styles.rangeTextInput}
              value={xMin}
              onChangeText={setXMin}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.rangeInput}>
            <Text style={styles.rangeLabel}>X Max:</Text>
            <TextInput
              style={styles.rangeTextInput}
              value={xMax}
              onChangeText={setXMax}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.rangeInput}>
            <Text style={styles.rangeLabel}>Y Min:</Text>
            <TextInput
              style={styles.rangeTextInput}
              value={yMin}
              onChangeText={setYMin}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.rangeInput}>
            <Text style={styles.rangeLabel}>Y Max:</Text>
            <TextInput
              style={styles.rangeTextInput}
              value={yMax}
              onChangeText={setYMax}
              keyboardType="numeric"
            />
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
  inputSection: {
    padding: spacing.lg,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  functionInput: {
    flex: 1,
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.menuText,
    marginRight: spacing.md,
  },
  addButton: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  addButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  functionsSection: {
    paddingHorizontal: spacing.lg,
    flex: 1,
  },
  functionsList: {
    maxHeight: 150,
  },
  functionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  functionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  functionText: {
    color: colors.menuText,
    fontSize: 14,
  },
  functionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
  },
  toggleButtonOff: {
    backgroundColor: colors.secondaryText,
  },
  toggleText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  graphSection: {
    padding: spacing.lg,
  },
  graphContainer: {
    alignItems: 'center',
  },
  graph: {
    width: 300,
    height: 200,
    backgroundColor: colors.graphBackground,
    borderRadius: borderRadius.md,
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.graphGrid,
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: colors.graphGrid,
  },
  point: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  axisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
    marginTop: spacing.sm,
  },
  axisLabel: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  rangeSection: {
    padding: spacing.lg,
  },
  rangeInputs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rangeInput: {
    width: '48%',
    marginBottom: spacing.md,
  },
  rangeLabel: {
    color: colors.secondaryText,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  rangeTextInput: {
    backgroundColor: colors.menuBackground,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    color: colors.menuText,
  },
});

export default GraphingScreen; 