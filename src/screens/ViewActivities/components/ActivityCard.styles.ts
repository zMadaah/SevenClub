import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrapper: {
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    left: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.richBlack,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  levelText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },
  headerInfo: {
    flex: 1,
  },
  runnerName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  runnerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  runnerMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  description: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 10,
  },
  mapWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 12,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 4,
  },
});