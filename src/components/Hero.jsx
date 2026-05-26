import React, { useState, useEffect } from "react";
import "../styles/Hero.css";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import ParticlesBg from "./ParticlesBg";

const Hero = () => {
  const words = ["ЯРКОЙ", "СТИЛЬНОЙ", "НЕПОВТОРИМОЙ"];
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      const currentWord = words[wordIndex];
      setDisplayedText(currentWord.slice(0, charIndex + 1));
      setCharIndex((prev) => prev + 1);

      if (charIndex + 1 === currentWord.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setCharIndex(0);
          setWordIndex((prev) => (prev + 1) % words.length);
        }, 1000);
      }
    }, 150); 

    return () => clearInterval(typingInterval);
  }, [charIndex, wordIndex, words]);

  return (
    <>
      <Helmet>
        <title>NOVA</title>
      </Helmet>
      <div className="hero-wrapper">
        <ParticlesBg />
        <div className="hero2">
          <h1>NOVA</h1>
          <p>New, Organized, Visits, Appointments</p>
          <Link to="/zapis">
            <button className="btn-book">
              Записаться
            </button>
          </Link>
        </div>
        <div className="hero">
          <span className="static">БУДЬ</span>
          <div className="container">
            <span className="dynamic">{displayedText}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
