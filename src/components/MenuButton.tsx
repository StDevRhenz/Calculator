import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors, spacing, borderRadius } from '../constants/colors';

interface MenuButtonProps {
  onPress: () => void;
  isOpen?: boolean;
}

const MenuButton: React.FC<MenuButtonProps> = ({ onPress, isOpen = false }) => {
  return (
    <TouchableOpacity
      style={[styles.container, isOpen && styles.active]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.hamburger}>
        <View style={[styles.line, isOpen && styles.lineOpen1]} />
        <View style={[styles.line, isOpen && styles.lineOpen2]} />
        <View style={[styles.line, isOpen && styles.lineOpen3]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    backgroundColor: colors.menuBackground,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacing.sm,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  active: {
    backgroundColor: colors.accent,
  },
  hamburger: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: colors.menuText,
    borderRadius: 1,
    transition: 'all 0.3s ease',
  },
  lineOpen1: {
    transform: [{ rotate: '45deg' }, { translateY: 7 }],
  },
  lineOpen2: {
    opacity: 0,
  },
  lineOpen3: {
    transform: [{ rotate: '-45deg' }, { translateY: -7 }],
  },
});

export default MenuButton; 