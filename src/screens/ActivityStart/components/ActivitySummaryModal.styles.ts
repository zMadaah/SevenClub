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
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  mapPreview: {
    height: 150,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F1EFE8',
    marginBottom: 18,
  },
  mapPreviewInner: {
    width: '100%',
    height: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  statBlock: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#061414',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
  },
  statUnit: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: '#E5E5E5',
  },
  territoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F1EFE8',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 18,
  },
  territoryText: {
    fontSize: 12,
    color: '#444',
    flex: 1,
  },
  subtitle: {
    fontSize: 11,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111',
    marginBottom: 18,
  },
  saveButton: {
    backgroundColor: '#BCFF00',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#EDEDED',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#061414',
    letterSpacing: 0.5,
  },
  saveTextDisabled: {
    color: '#D2D3CE',
  },
});