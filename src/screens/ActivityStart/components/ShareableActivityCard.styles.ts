import { StyleSheet } from 'react-native';

const textShadow = {
  textShadowColor: 'rgba(0, 0, 0, 0.4)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 3,
};

export const styles = StyleSheet.create({
  card: {
    // sem backgroundColor de propósito — é o que faz o Instagram tratar
    // isso como adesivo flutuante em vez de fundo do Story
    padding: 4,
    gap: 10,
  },
  brandChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 20, 20, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  brandText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#E9EBE6',
    letterSpacing: 1.2,
    ...textShadow,
  },
  mainChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(6, 20, 20, 0.55)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E9EBE6',
    flexShrink: 1,
    ...textShadow,
  },
  mainStat: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  mainStatValue: {
    fontSize: 52,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 52,
    ...textShadow,
  },
  mainStatUnit: {
    fontSize: 18,
    fontWeight: '700',
    color: '#E9EBE6',
    marginBottom: 6,
    ...textShadow,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statChip: {
    backgroundColor: 'rgba(6, 20, 20, 0.55)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#96998C',
    letterSpacing: 0.5,
    marginBottom: 2,
    ...textShadow,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E9EBE6',
    ...textShadow,
  },
});
