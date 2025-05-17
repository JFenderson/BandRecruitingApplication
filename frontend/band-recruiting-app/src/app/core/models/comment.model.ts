export interface CommentDTO {
  commentId: string;
  videoId: string;
  recruiterId: string;
  text: string;
  createdAt: Date;
}

export interface AddCommentDTO {
  videoId: string;
  recruiterId: string;
  text: string;
}