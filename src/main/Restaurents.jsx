import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Restaurent from './Restaurent';
import { Link } from 'react-router-dom';

export default function Restaurents() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/restaurants');
        setRestaurants(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching restaurants:', err);
        setError('Failed to load restaurants. Please try again later.');
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Restaurants</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : restaurants.length > 0 ? (
        <div className="row g-4">
          {restaurants.map((rest) => (
            <div className="col-md-4 mb-4" key={rest._id}>
              <Restaurent
                id={rest._id}
                name={rest.name}
                address={rest.address}
                imageUrl={rest.imageUrl || 'https://via.placeholder.com/300x200?text=Restaurant'}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No restaurants found.</p>
        </div>
      )}
    </div>
  );
}
