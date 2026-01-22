import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Particles from './components/Particles';
import ParallaxVideo from './components/ParallaxVideo';
import Clock from './components/Clock';
import Search from './components/Search';
import SoundToggle from './components/SoundToggle';
import InfoRow from './components/InfoRow';
import PlacesList from './components/PlaceCard';
import ProvincesSection from './components/ProvincesSection';

function App() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const infoSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsRevealed(entry.isIntersecting);
      },
      { threshold: 0.12 }
    );

    if (infoSectionRef.current) {
      observer.observe(infoSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Particles />

      <div className="scroll-indicator" style={{ opacity: isRevealed ? 0 : 0.8 }}>
        <div className="scroll-text">Scroll Down</div>
        <div className="scroll-arrow"></div>
      </div>

      <ParallaxVideo isBlurred={isRevealed} />

      <nav id="quick-links" className="jersey-10-regular">
        <a href="#info-1" className={activeLink === 'info-1' ? 'active' : ''}>Overview</a>
        <a href="#info-2" className={activeLink === 'info-2' ? 'active' : ''}>Culture</a>
        <a href="#info-3" className={activeLink === 'info-3' ? 'active' : ''}>Outdoors</a>
        <a href="#provinces" className={activeLink === 'provinces' ? 'active' : ''}>Provinces</a>

        <Search />
        <Clock />
        <SoundToggle />
      </nav>

      <div className="jersey-10-regular gradient-text" style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '28px', zIndex: 10, writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '2px', textShadow: '0 0 10px rgba(255, 126, 95, 0.5)' }}>NISHANT</div>

      <main className="content">
        <section ref={infoSectionRef} className={`info-section ${isRevealed ? 'visible' : ''}`}>
          <div className="info-container">
            <nav className="breadcrumb">
              <a href="#info-1">Nepal</a>
              <span>/</span>
              <a href="#info-2">Culture</a>
              <span>/</span>
              <a href="#top-places">Places</a>
              <span>/</span>
              <a href="#provinces">Provinces</a>
            </nav>

            <InfoRow
              id="info-1"
              title="Discover Nepal"
              isTitle={true}
              image="https://tse2.mm.bing.net/th/id/OIP._UNasqmNY5xyWu98GiyupAHaFM?rs=1&pid=ImgDetMain&o=7&rm=3"
            >
              <p>Nepal is a Himalayan country in South Asia, home to Mount Everest — the highest peak on Earth. It has a rich cultural heritage, diverse ethnic groups, and a long tradition of mountain tourism and trekking.</p>
              <p>Capital: Kathmandu. Languages: Nepali and many regional languages. Known for beautiful landscapes, temples, and friendly hospitality.</p>
            </InfoRow>

            <InfoRow
              id="info-2"
              title="Culture & Festivals"
              image="https://th.bing.com/th/id/OIP.nDmRWmh-NzqeIrKxp6d8-wHaDj?w=289&h=180&c=7&r=0&o=7&pid=1.7&pid=1.7&rm=3"
            >
              <p>Nepal celebrates many festivals such as Dashain and Tihar, which include family gatherings, rituals, and traditional music. Religious diversity includes Hinduism and Buddhism, with many historic temples and monasteries.</p>
            </InfoRow>

            <InfoRow
              id="info-3"
              title="Outdoor Activities"
              image="https://tse1.mm.bing.net/th/id/OIP.jvdtAq3plpeZKqYKcJiW7AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3"
            >
              <p>Popular activities include trekking (e.g., Annapurna Circuit), mountaineering, white-water rafting, and wildlife safaris. The country offers a wide range of experiences for outdoor enthusiasts.</p>
            </InfoRow>

            <div id="top-places" className="info-row in-view" style={{ display: 'block' }}>
              <div className="info-text">
                <h3>Top places to visit</h3>
                <PlacesList />
              </div>
            </div>

            <ProvincesSection />
          </div>
        </section>

        <footer className="footer-section">
          <p><strong>Nepal Explorer</strong> - Discover the beauty and culture of Nepal</p>
          <p>© 2026 Nepal Tourism. All rights reserved. | <a href="#top">Back to Top</a></p>
          <p>Built with passion for showcasing Nepal's rich heritage and natural wonders.</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
