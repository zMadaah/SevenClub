import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  yAxis: {
    width: 28,
    marginRight: 6,
  },
  yAxisLabel: {
    position: 'absolute',
    fontSize: 11,
    color: colors.textMuted,
  },
  tooltip: {
    position: 'absolute',
    width: 84,
    backgroundColor: colors.accent,
    borderRadius: 14,
    paddingVertical: 6,
    alignItems: 'center',
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.richBlack,
  },
  xAxisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  xAxisLabel: {
    fontSize: 11,
    color: colors.textMuted,
  },
});