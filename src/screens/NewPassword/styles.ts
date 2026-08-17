import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.textPrimary,
    lineHeight: 36,
    marginBottom: 28,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#D85A30',
    marginBottom: 12,
  },
  resetButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  resetTextDisabled: {
    color: colors.disabledText,
  },
});