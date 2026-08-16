import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingTop: 12,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  scroll: {
    paddingHorizontal: 20,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  runnerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  runnerMeta: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 1,
  },
  runnerLocation: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.richBlack,
    borderRadius: 18,
    height: 76,
    overflow: 'hidden',
    marginBottom: 20,
  },
  rankFlag: {
    width: 72,
    height: '100%',
  },
  rankContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  rankCardBlock: {
    alignItems: 'flex-start',
  },
   rankCardRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
   rankGlobeIcon: {
    marginTop: 4,
  },

  rankCardFlag: {
    fontSize: 18,
    marginBottom: 2,
  },
  rankCardValue: {
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#fff',
  },
   rankCardHash: {
    fontSize: 14,
    fontWeight: '500',
    fontStyle: 'normal',
  },
  rankCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.celeste,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  rankCardCenterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.laurelLeaf,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statBlockLeft: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.textPrimary,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 13,
    color: colors.textMuted,
  },
  routeMapCard: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  routeMap: {
    width: '100%',
    height: '100%',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  recapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 999,
  },
  recapButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  flagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  flagButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  singleStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  singleStatLabel: {
    fontSize: 13,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  singleStatValue: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  singleStatUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});