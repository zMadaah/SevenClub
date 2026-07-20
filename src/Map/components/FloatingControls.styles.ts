import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 125,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 900,
  },
  container: {
    position: 'absolute',
    top: 145,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 900,
  },

  territoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 20,
    shadowColor: colors.backgroundAlt,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 8,
  },

  territoryText: {
    marginLeft: 8,
    color: colors.textOnDark,
    fontSize: 12,
    fontWeight: '700',
  },

  locationButton: {
    width: 35,
    height: 35,
    borderRadius: 33,
    backgroundColor: colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.background,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    elevation: 8,
  },
});