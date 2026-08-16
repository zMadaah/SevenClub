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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: colors.textPrimary,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    color: colors.textPrimary,
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 28,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeBox: {
    width: 48,
    height: 58,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  codeBoxActive: {
    backgroundColor: colors.accent,
    color: colors.richBlack,
  },
  joinButton: {
    backgroundColor: colors.richBlack,
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  joinButtonDisabled: {
    backgroundColor: colors.laurelLeaf,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ceilingWhite,
    letterSpacing: 0.5,
  },
});