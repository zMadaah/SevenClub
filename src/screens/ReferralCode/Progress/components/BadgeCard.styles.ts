import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    width: 104,
    backgroundColor: colors.backgroundDark,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  cardLocked: {
    opacity: 0.55,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconCircleLocked: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  lockBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.richBlack,
    borderWidth: 1,
    borderColor: colors.laurelLeaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ceilingWhite,
    textAlign: 'center',
  },
});
