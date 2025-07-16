import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { colors, spacing, borderRadius } from '../constants/colors';
import { HistoryEntry } from '../types';

interface HistoryPanelProps {
  visible: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onHistorySelect: (entry: HistoryEntry) => void;
  onClearHistory: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  visible,
  onClose,
  history,
  onHistorySelect,
  onClearHistory,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
            <Text style={styles.title}>History</Text>
            <View style={styles.headerButtons}>
              {history.length > 0 && (
                <TouchableOpacity onPress={onClearHistory} style={styles.clearButton}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyText}>No calculations yet</Text>
                <Text style={styles.emptySubtext}>Your calculation history will appear here</Text>
              </View>
            ) : (
              history.map((entry, index) => (
                <TouchableOpacity
                  key={entry.id}
                  style={styles.historyItem}
                  onPress={() => onHistorySelect(entry)}
                >
                  <View style={styles.historyContent}>
                    <Text style={styles.expression}>{entry.expression}</Text>
                    <Text style={styles.result}>{entry.result}</Text>
                    <View style={styles.historyMeta}>
                      <Text style={styles.mode}>{entry.mode}</Text>
                      <Text style={styles.time}>{formatTime(entry.timestamp)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.error,
  },
  clearText: {
    fontSize: 14,
    color: colors.menuText,
    fontWeight: '500',
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  historyItem: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  historyContent: {
    flex: 1,
  },
  expression: {
    fontSize: 16,
    color: colors.secondaryText,
    marginBottom: spacing.xs,
  },
  result: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.menuText,
    marginBottom: spacing.xs,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mode: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  time: {
    fontSize: 12,
    color: colors.secondaryText,
  },
});

export default HistoryPanel; 