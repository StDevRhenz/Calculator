import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { colors, spacing, borderRadius, calculatorModes } from '../constants/colors';

interface ModeMenuProps {
  visible: boolean;
  onClose: () => void;
  onModeSelect: (mode: string) => void;
  currentMode: string;
}

const ModeMenu: React.FC<ModeMenuProps> = ({
  visible,
  onClose,
  onModeSelect,
  currentMode,
}) => {
  const handleModeSelect = (mode: string) => {
    onModeSelect(mode);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Calculator Modes</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {calculatorModes.map((mode) => (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeButton,
                    currentMode === mode.id && styles.activeModeButton,
                  ]}
                  onPress={() => handleModeSelect(mode.id)}
                >
                  <Text style={styles.modeIcon}>{mode.icon}</Text>
                  <Text style={[
                    styles.modeText,
                    currentMode === mode.id && styles.activeModeText,
                  ]}>
                    {mode.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.menuBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.menuText,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: colors.menuText,
    fontWeight: '600',
  },
  content: {
    padding: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeButton: {
    width: '48%',
    aspectRatio: 1.2,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  activeModeButton: {
    backgroundColor: colors.accent,
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  modeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.menuText,
    textAlign: 'center',
  },
  activeModeText: {
    color: colors.background,
  },
});

export default ModeMenu; 