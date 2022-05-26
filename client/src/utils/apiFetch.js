// custom hook for fetch operation which handles authorization errors

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useApiFetch = (url, update) => {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:8000${url}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (res.status === 401) {
        console.log('authorization error');
        navigate('/404');
      }

      const content = await res.json();
      setData(content);
      setLoading(false);
    })();
  }, [url, update]);

  return { data, loading };
};

export default useApiFetch;
