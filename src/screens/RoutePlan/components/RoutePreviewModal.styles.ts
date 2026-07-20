import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  mapPreview: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
    marginBottom: 16,
  },
  mapPreviewInner: {
    width: '100%',
    height: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: colors.border,
  },
  block: {
    marginBottom: 16,
  },
  runnersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  runnersRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  runnerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: -10,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  runnersCaption: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disclaimer: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  routeNameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  requiredTag: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textOnAccent,
    letterSpacing: 0.5,
  },
  saveTextDisabled: {
    color: colors.disabledText,
  },
});