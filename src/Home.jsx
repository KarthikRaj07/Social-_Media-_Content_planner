import React from 'react';
import './Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Content Creator Helper</h1>
      <p>Navigate to the Chatbot page to get personalized assistance with your social media content planning!</p>

      <section className="about-project">
        <h2>About the Project</h2>
        <p>
          This platform is designed to assist social media managers and content creators in planning and creating engaging
          content. With the help of AI, you can get personalized suggestions and strategies to boost your social media presence.
        </p>
      </section>
    </div>
  );
}

export default Home;