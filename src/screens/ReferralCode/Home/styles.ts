import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  mapContainer: {
    flex: 1,
  },

  lobbyPill: {
    position: 'absolute',
    top: 165,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#061414',
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 20,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    zIndex: 900,
  },
  lobbyPillText: {
    color: '#E9EBE6',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },

  chatButton: {
    position: 'absolute',
    right: 16,
    bottom: 70,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#061414',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 8,
    zIndex: 900,
  },

  devSeedButton: {
    position: 'absolute',
    top: 165,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#BCFF00',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#061414',
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 16,
    zIndex: 900,
  },
  devSeedButtonText: {
    color: '#061414',
    fontSize: 11,
    fontWeight: '700',
  },
});