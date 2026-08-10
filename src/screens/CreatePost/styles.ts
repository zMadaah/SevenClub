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
  changePhotoButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  changePhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  captionInput: {
    marginHorizontal: 20,
    marginTop: 20,
    minHeight: 90,
    fontSize: 14,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
});
