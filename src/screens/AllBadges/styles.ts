import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundDark,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textOnDark,
    letterSpacing: 1,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pageSubtitle: {
    fontSize: 12,
    color: colors.textOnDark,
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '31%',
    alignItems: 'center',
    marginBottom: 28,
  },
  tileName: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textOnDark,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 10,
    marginBottom: 2,
  },
  tileSubtitle: {
    fontSize: 10,
    color: colors.textOnDark,
    textAlign: 'center',
  },
});
