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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 2,
  },
  activityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activityPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  mapArea: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  emptyMap: {
    flex: 1,
    backgroundColor: colors.richBlack,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyMapText: {
    fontSize: 13,
    color: colors.laurelLeaf,
  },
  detailSheet: {
    backgroundColor: colors.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  routeMeta: {
    fontSize: 12,
    color: colors.laurelLeaf,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  statBlock: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: colors.laurelLeaf,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.laurelLeaf,
  },
  useRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 28,
    paddingVertical: 14,
    marginBottom: 8,
  },
  useRouteButtonText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.richBlack,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.laurelLeaf,
  },
});