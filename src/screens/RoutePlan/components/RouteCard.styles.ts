import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111',
    marginBottom: 2,
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
  },
  distanceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  awayValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 2,
  },
  thumbnailBox: {
    width: 110,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#BCFF00',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  startButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#061414',
    letterSpacing: 0.3,
  },
});
