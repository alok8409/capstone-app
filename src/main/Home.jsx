import React from 'react';
import { Carousel } from 'react-bootstrap';
import './HomeCarousel.css';
import Restaurent from './Restaurent';

const HomeCarousel = () => {
  return (
    <div className="home-container">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3840"
            alt="Gourmet Food Plating"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?q=80&w=3840"
            alt="Luxury Restaurant Interior"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=3840"
            alt="Vibrant Food Spread"
          />
        </Carousel.Item>

        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=3840"
            alt="Fine Dining Experience"
          />
        </Carousel.Item>
      </Carousel>

      <div className="content-section text-center">
        <h1><u>TOP RATED RESTAURANTS</u></h1>
        <div className="container mt-5">
          <div className="row g-4">
            <div className="col-md-4">
              <Restaurent 
                name="The Gourmet Kitchen"
                image="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                description="Experience fine dining at its best with our contemporary cuisine"
                location="123 Culinary Street"
                distance="2.5 km"
              />
            </div>
            <div className="col-md-4">
              <Restaurent 
                name="Spice Paradise"
                image="https://images.unsplash.com/photo-1552566626-52f8b828add9"
                description="Authentic Indian cuisine with a modern twist"
                location="456 Flavor Avenue"
                distance="3.2 km"
              />
            </div>
            <div className="col-md-4">
              <Restaurent 
                name="Mediterranean Oasis"
                image="https://images.unsplash.com/photo-1537047902294-62a40c20a6ae"
                description="Fresh Mediterranean dishes in a relaxing atmosphere"
                location="789 Olive Lane"
                distance="1.8 km"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCarousel;
