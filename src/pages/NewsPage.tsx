import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import CommentTree from "./Comment.tsx";

interface Story {
  id: number;
  title: string;
  by: string;
  url: string;
  descendants: number;
  time: number;
  kids?: number[];
}

function NewsPage() {
  const { id } = useParams();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  const getStory = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      setStory(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  }, [id]);

  useEffect(() => {
    getStory();
  }, [id, getStory]);

  const handleRefresh = () => {
    getStory();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (story) {
    return (
      <div className="news-page">
        <h1> {story.title}</h1>

        <div>
          {story.url && (
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="read-more">
              READ MORE...
            </a>
          )}
          <p>Author: {story.by}</p>
          <p>
            Publication Date:{" "}
            {story.time
              ? new Date(story.time * 1000).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            Publication Time:{" "}
            {story.time
              ? ("0" + new Date(story.time * 1000).getHours()).slice(-2)
              : "N/A"}
            :
            {story.time
              ? ("0" + new Date(story.time * 1000).getMinutes()).slice(-2)
              : "N/A"}
          </p>

          <Link to="/" className="link-route">Back to News List</Link>
          <div>Comments: {story.descendants}</div>
          <button onClick={handleRefresh}>Update</button>
          {story && story.descendants > 0 && (
            <CommentTree commentIds={story.kids} />
          )}
        </div>
      </div>
    );
  }
}

export default NewsPage;
