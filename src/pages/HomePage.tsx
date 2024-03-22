import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UPDATE_TIME, COUNT_NEWS } from "../constants.tsx";

interface News {
  id: number;
  title: string;
  by: string;
  score: number;
  descendants: number;
  time: number;
}

function HomePage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  const getNews = async () => {
    try {
      const response = await axios.get(
        "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty"
      );
      const newStoryId = response.data.slice(0, COUNT_NEWS);
      const newsPromises = newStoryId.map((id) =>
        axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      );
      const newsResponses = await Promise.all(newsPromises);
      const newsData = newsResponses.map((response) => response.data);
      setNews(newsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    getNews();

    const intervalId = setInterval(getNews, UPDATE_TIME);
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    getNews();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <h1> {COUNT_NEWS} Hacker News Stories</h1>
      <button className="button" onClick={handleRefresh}>
        Update
      </button>
      <ul>
        {news.map(
          (story, index) =>
            story && (
              <li key={index}>
                <Link className="link" to={`/news/${story.id}`}>
                  {story.title}
                </Link>
                <p>Rating: {story.score}</p>
                <p>Author: {story.by}</p>
                <p>
                  Publication Date:{" "}
                  {new Date(story.time * 1000).toLocaleDateString()}{" "}
                  {("0" + new Date(story.time * 1000).getHours()).slice(-2)}:
                  {("0" + new Date(story.time * 1000).getMinutes()).slice(-2)}
                </p>
              </li>
            )
        )}
      </ul>
    </div>
  );
}

export default HomePage;
