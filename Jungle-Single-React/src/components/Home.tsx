import React from 'react';
import './Home.css'; // Import CSS for styling

const Home: React.FC = () => {
    return (
        <div className="home-container">
            <img
                src="https://via.placeholder.com/1920x1080" // Replace with your image URL
                alt="Full Page"
                className="full-page-image"
            />
        </div>
    );
};

export default Home;