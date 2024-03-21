import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {UPDATE_TIME, COUNT_NEWS} from '../constants'

function HomePage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNews = async () => {
      try {
        const response = await axios.get('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty');
        const newStoryId = response.data.slice(0, COUNT_NEWS);
        const newsPromises = newStoryId.map(id =>
          axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
        );
        const newsResponses = await Promise.all(newsPromises);
        const newsData = newsResponses.map(response => response.data);
        console.log(newsData)
        setNews(newsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    getNews();

    const intervalId = setInterval(getNews, UPDATE_TIME);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="HomePage">
      <h1> {COUNT_NEWS} Hacker News Stories</h1>
      <ul>
        {news.map((story, index) => (
          story && (
            <li key={index}>
              <a href={story.url}>{story.title} (Переход на сайт)</a>
              <p>{story.title} (Переход на карточку)</p>
              <p>Rating: {story.score}</p>
              <p>Author: {story.by}</p>
              <p>Publication Date: {new Date(story.time * 1000).toLocaleDateString()} {('0' + new Date(story.time * 1000).getHours()).slice(-2)}:{('0' + new Date(story.time * 1000).getMinutes()).slice(-2)}</p>
            </li>
          )
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
