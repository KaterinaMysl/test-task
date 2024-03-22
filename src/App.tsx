import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx'
import NewsPage from './pages/NewsPage.tsx'

function App() {
  return (

    <Router>
      <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/news/:id" element={<NewsPage/>} />
      </Routes>
    </Router>

  );
}

export default App;
