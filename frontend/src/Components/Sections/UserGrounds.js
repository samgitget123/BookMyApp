import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserGrounds = () => {
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserGrounds = async () => {
      const user_id = localStorage.getItem('user_id'); // Get user_id from localStorage
      console.log(user_id, 'userid')
      if (!user_id) {
        setError('User ID not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        //http://localhost:5000/api/ground/user/grounds?userId=c4efa2de-4bce-4f9e-b9a7-812580d38b2e
        const response = await axios.get(`http://localhost:5000/api/ground/user/grounds?userId=${user_id}`);
        console.log(response, 'userresponse')
        setGrounds(response.data);
      } catch (err) {
        setError('Error fetching grounds');
      } finally {
        setLoading(false); // Ensure loading is turned off after request
      }
    };

    fetchUserGrounds();
  }, []); // Empty dependency array ensures it runs once on mount

  if (loading) return <p>Loading grounds...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Your Grounds</h2>
      {grounds.length === 0 ? (
        <p>No grounds found.</p>
      ) : (
        <ul>
          {grounds.map((ground) => (
            <li key={ground.ground_id}>
              {ground.name} - {ground.location}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserGrounds;
