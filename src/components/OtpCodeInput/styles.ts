import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  box: {
    width: 48,
    height: 58,
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 12,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  boxActive: {
    backgroundColor: colors.accent,
    color: colors.richBlack,
  },
});