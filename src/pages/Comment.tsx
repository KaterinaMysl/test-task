import React, { useState, useEffect } from "react";
import axios from "axios";

interface Comment {
  id: number;
  text: string;
  time: number;
  by: string;
  kids?: number[];
}

interface CommentTreeProps {
  commentIds?: number[];
}

const CommentTree = ({ commentIds }: CommentTreeProps) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const getComments = async () => {
      if (!commentIds || commentIds.length === 0) {
        return;
      }

      const validCommentIds = commentIds.filter((id) => typeof id === "number");
      if (validCommentIds.length === 0) {
        return;
      }

      const commentPromises = validCommentIds.map((id) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const commentResponses = await Promise.all(commentPromises);
      const commentData = commentResponses.map((response) => response.data);
      setComments(commentData);
    };

    getComments();
  }, [commentIds]);

  if (!comments || comments.length === 0) {
    return null;
  }
  console.log(comments);
  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment.id} className="comment-item">
          <div className="comment-content">
            <div className="comment-info">
              <div>{comment.by}</div>
              <div>
                {new Date(comment.time * 1000).toLocaleDateString()}{" "}
                {("0" + new Date(comment.time * 1000).getHours()).slice(-2)}:
                {("0" + new Date(comment.time * 1000).getMinutes()).slice(-2)}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: comment.text }}></div>

            {comment.kids && comment.kids.length > 0 && (
              <CommentTree commentIds={comment.kids} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CommentTree;
