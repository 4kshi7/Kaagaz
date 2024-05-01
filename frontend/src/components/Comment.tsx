import React from 'react';

interface CommentProps {
  content: string;
  createdAt: string;
  email?: string; // Add userEmail to the props
}

const Comment: React.FC<CommentProps> = ({ content, createdAt, email }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="comment">
      <p className="comment-content">{content}</p>
      <small className="comment-user">User: {email}</small> {/* Display userEmail */}
      <small className="comment-date">Posted at: {formatDate(createdAt)}</small>
    </div>
  );
};

export default Comment;
