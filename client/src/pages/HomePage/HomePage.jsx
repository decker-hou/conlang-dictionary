import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="homePage">
      <p>Lexicon Creator provides a useful tool for creating and organizing conlang dictionaries</p>
      <Link to="/profile">Go to my profile</Link>
    </div>
  );
}

export default HomePage;
