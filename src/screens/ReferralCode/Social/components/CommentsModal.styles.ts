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
    paddingBottom: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  list: {
    flexGrow: 0,
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
  commentRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
  },
  replyRow: {
    marginLeft: 38,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  commentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  commentTime: {
    fontSize: 11,
    color: '#999',
  },
  commentActionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#666',
  },
  commentActionTextDanger: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D85A30',
  },
  replyingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1EFE8',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  replyingText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#F1EFE8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BCFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
