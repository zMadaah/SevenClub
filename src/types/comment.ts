export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatarUrl: string;
  text: string;
  createdAtLabel: string;
  // presente quando o comentário é uma resposta a outro comentário
  parentCommentId?: string;
}
