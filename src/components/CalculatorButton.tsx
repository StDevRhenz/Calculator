import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius } from '../constants/colors';

interface CalculatorButtonProps {
  text: string;
  onPress: () => void;
  type: 'number' | 'operator' | 'function';
  flex?: number;
  isPressed?: boolean;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({
  text,
  onPress,
  type,
  flex = 1,
  isPressed = false,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex,
      aspectRatio: flex > 1 ? 2.2 : 1,
      margin: spacing.xs,
      borderRadius: borderRadius.full,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    };

    switch (type) {
      case 'number':
        return {
          ...baseStyle,
          backgroundColor: isPressed ? colors.numberButtonPressed : colors.numberButton,
        };
      case 'operator':
        return {
          ...baseStyle,
          backgroundColor: isPressed ? colors.operatorButtonPressed : colors.operatorButton,
        };
      case 'function':
        return {
          ...baseStyle,
          backgroundColor: isPressed ? colors.functionButtonPressed : colors.functionButton,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 32,
      fontWeight: '400',
    };

    switch (type) {
      case 'number':
        return { ...baseStyle, color: colors.numberButtonText };
      case 'operator':
        return { ...baseStyle, color: colors.operatorButtonText, fontWeight: '500' };
      case 'function':
        return { ...baseStyle, color: colors.functionButtonText, fontWeight: '500' };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={getTextStyle()}>{text}</Text>
    </TouchableOpacity>
  );
};

export default CalculatorButton;