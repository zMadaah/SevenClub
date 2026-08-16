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
    maxHeight: '75%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 24,
  },
  sortLabel: {
    fontSize: 14,
    color: '#111',
  },
  sortOption: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sortOptionActive: {
    color: '#111',
    fontWeight: '700',
    backgroundColor: '#BCFF00',
    borderRadius: 14,
    overflow: 'hidden',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 24,
  },
  planButton: {
    backgroundColor: '#BCFF00',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111',
    letterSpacing: 0.5,
  },
  list: {
    flexGrow: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  routeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1EFE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  routeMeta: {
    fontSize: 12,
    color: '#888',
  },
});