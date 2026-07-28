
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#111',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111',
    marginBottom: 20,
  },
  pictureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  pictureBox: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pictureImage: {
    width: '100%',
    height: '100%',
  },
  addPictureText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D9E75',
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },
  nameInput: {
    borderWidth: 1.5,
    borderColor: '#111',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: '#111',
  },
  divider: {
    height: 1,
    backgroundColor: colors.surface,
    marginVertical: 28,
  },
  maxSizeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  maxSizeLabel: {
    fontSize: 14,
    color: '#666',
  },
  maxSizeInput: {
    width: 60,
    borderWidth: 1,
    borderColor: colors.borderWhite,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
  },
  createButton: {
    backgroundColor: '#061414',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#E5E5E5',
  },
  createText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  createTextDisabled: {
    color: '#aaa',
  },
});