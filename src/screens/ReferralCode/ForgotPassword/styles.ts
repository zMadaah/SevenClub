import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  methodPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.backgroundAlt,
  },
  methodPillActive: {
    backgroundColor: colors.accent,
  },
  methodText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  methodTextActive: {
    color: colors.richBlack,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: colors.richBlack,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.laurelLeaf,
  },
  sendText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ceilingWhite,
    letterSpacing: 0.5,
  },
  sendTextDisabled: {
    color: colors.celeste,
  },
});