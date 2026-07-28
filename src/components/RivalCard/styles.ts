import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  nameLeft: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  nameRight: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  barTrack: { flex: 1, height: 14, flexDirection: 'row', borderRadius: 8, overflow: 'hidden' },
  barSegment: { height: '100%' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  statValue: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  messageStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.accentGlow,
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    gap: 8,
  },
  messageText: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  messageButtonText: { fontSize: 10, fontWeight: '800', color: colors.richBlack, letterSpacing: 0.3 },
});