import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 20,
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
  continueButton: {
    backgroundColor: colors.richBlack,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
  },
  continueButtonDisabled: {
    backgroundColor: colors.laurelLeaf,
  },
  continueText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ceilingWhite,
    letterSpacing: 0.5,
  },
  continueTextDisabled: {
    color: colors.celeste,
  },
});