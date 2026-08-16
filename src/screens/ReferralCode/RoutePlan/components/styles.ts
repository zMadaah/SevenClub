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
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
  },
  list: {
    flexGrow: 0,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1EFE8',
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
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
    marginBottom: 2,
  },
  routeMeta: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 4,
  },
});