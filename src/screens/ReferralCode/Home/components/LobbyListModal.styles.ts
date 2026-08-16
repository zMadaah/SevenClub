import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  list: {
    maxHeight: 280,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lobbyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    backgroundColor: '#F5F5F0',
  },
  lobbyRowActive: {
    backgroundColor: '#BFF2C8',
  },
  lobbyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  lobbyNameActive: {
    color: '#111',
    fontWeight: '700',
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusDotActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  statusDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1DBF5A',
  },
  newGameButton: {
    backgroundColor: '#061414',
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: 'center',
  },
  newGameButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
});
