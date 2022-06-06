import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './UserHeader.css';

function UserHeader(props) {
  const { loggedIn } = props;
  const [username, setUsername] = useState('');

  useEffect(() => {
    const user = (`; ${document.cookie}`).split('; user=').pop().split(';')[0];
    if (user) {
      setUsername(user);
    }
  }, []);

  return (
    <div className="header">
      { loggedIn
        ? (
          <div>
            <Link className="profile-link" to="/profile">{`Logged In as: ${username}`}</Link>
            <a href={`http://localhost:8000/logout?origin=${window.location.pathname}`}>Log out</a>
          </div>
        )
        : (
          <a className="login-button" href={`http://localhost:8000/login?origin=${window.location.pathname}`}>
            Login to Discord
          </a>
        )}

    </div>
  );
}

UserHeader.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
};

export default UserHeader;
