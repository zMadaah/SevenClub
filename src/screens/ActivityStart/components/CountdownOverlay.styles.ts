import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 20, 20, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: '#BCFF00',
    letterSpacing: 3,
    marginBottom: 8,
  },
  count: {
    fontSize: 96,
    fontWeight: '900',
    color: '#fff',
  },
});
