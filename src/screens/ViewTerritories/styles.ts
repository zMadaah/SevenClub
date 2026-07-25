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
  rankBadge: {
    position: 'absolute',
    left: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  rankNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankNumberText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  rankBadgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  rankBadgeCaptureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rankBadgeCapture: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});