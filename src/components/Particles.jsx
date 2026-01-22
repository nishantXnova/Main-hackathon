import React, { useEffect, useState } from 'react';

const Particles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const particleCount = 10;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = 10 + Math.random() * 10;
      const size = 2 + Math.random() * 3;
      const opacity = 0.3 + Math.random() * 0.4;

      newParticles.push({
        id: i,
        style: {
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          width: `${size}px`,
          height: `${size}px`,
          opacity: opacity,
        },
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="particles">
      {particles.map((p) => (
        <div key={p.id} className="particle" style={p.style} />
      ))}
    </div>
  );
};

export default Particles;
