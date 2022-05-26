import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage/HomePage';
import WordPrompt from './pages/WordPrompt/WordPrompt';
import Dictionary from './pages/Dictionary/Dictionary';
import UserPage from './pages/UserPage/UserPage';
import Error from './pages/Error/Error';
import UserHeader from './components/UserHeader/UserHeader';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const auth = (`; ${document.cookie}`).split('; auth=').pop().split(';')[0];
    if (auth) {
      setLoggedIn(true);
    }
  }, []);

  const logout = () => {
    setLoggedIn(false);
  };

  return (
    <div>
      <UserHeader loggedIn={loggedIn} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="dictionary/:id" element={<Dictionary />} />
        <Route path="prompt/:id" element={<WordPrompt />} />
        <Route path="profile" element={<UserPage logout={logout} />} />
        <Route path="404" element={<Error />} />
      </Routes>

    </div>
  );
}

export default App;
