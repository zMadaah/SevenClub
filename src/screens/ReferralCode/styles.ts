import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  decoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginLeft: 2,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 44,
    fontWeight: '800',
    fontStyle: 'italic',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    lineHeight: 46,
    marginBottom: 40,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.textPrimary,
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 20,
  },
 addButton: {
  backgroundColor: colors.accent,
  paddingVertical: 20,
  borderRadius: 999, // garante pílula completa, não depende da altura
  alignItems: 'center',
},
addButtonDisabled: {
  backgroundColor: "#bcff00",
},
addButtonText: {
  fontSize: 15,
  fontWeight: '700',
  color: colors.richBlack,
  letterSpacing: 0.8,
},
addButtonTextDisabled: {
  color: colors.disabledText,
},
});