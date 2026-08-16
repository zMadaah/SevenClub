import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  searchInput: {
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 24,
  },
  suggestionsSection: {
    paddingHorizontal: 20,
  },
  suggestionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  suggestionsSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  resultsList: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  resultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  resultName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  followButtonSmall: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  followingButtonSmall: {
    backgroundColor: colors.backgroundAlt,
  },
  followButtonSmallText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  followingButtonSmallText: {
    color: colors.textSecondary,
  },
});