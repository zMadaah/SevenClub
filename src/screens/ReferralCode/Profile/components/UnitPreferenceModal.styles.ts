import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#061414',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  iconGlow: {
    alignSelf: 'center',
    backgroundColor: 'rgba(188, 255, 0, 0.15)',
    borderRadius: 40,
    padding: 14,
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#BCFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#fff',
    textAlign: 'center',
    textTransform: 'uppercase',
    lineHeight: 28,
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#fff',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  doneButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  doneText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#061414',
    letterSpacing: 1,
  },
});