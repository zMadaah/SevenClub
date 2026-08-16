import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.richBlack,
  },
  header: {
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ceilingWhite,
    marginLeft: 2,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ceilingWhite,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 40,
  },
  summaryBlock: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ceilingWhite,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.ceilingWhite,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -16,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  togglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  togglePillActive: {
    backgroundColor: colors.accentGlowStrong,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.richBlack,
    fontWeight: '700',
  },
  statsCard: {
    backgroundColor: colors.backgroundDark,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
  },
  statsLoading: {
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
  },
  statBlockRight: {
    alignItems: 'flex-end',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textOnDark,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.textOnDark,
  },
  statValueSmall: {
    fontSize: 22,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.textOnDark,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textOnDark,
  },
  statsDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 16,
  },
  menu: {
    paddingBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});