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
  publishText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.richBlack,
    letterSpacing: 0.5,
  },
  publishTextDisabled: {
    color: colors.textMuted,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingBottom: 40,
  },
  photoArea: {
    marginHorizontal: 20,
    marginTop: 20,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.backgroundAlt,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  thumbnailRow: {
    marginTop: 12,
  },
  thumbnailRowContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  thumbnailWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailRemove: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(6, 20, 20, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailAdd: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.backgroundAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionInput: {
    marginHorizontal: 20,
    marginTop: 20,
    minHeight: 100,
    borderRadius: 16,
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
});
