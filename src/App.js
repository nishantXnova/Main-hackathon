import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Chatbot from './Chatbot';
import HospitalLocator from './HospitalLocator';
import PlaceExplorer from './PlaceExplorer';
import SmartWeather from './SmartWeather';


// Particles Component
const Particles = () => {
  useEffect(() => {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 10;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = 10 + Math.random() * 10;

      particle.style.left = `${left}%`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationDuration = `${duration}s`;

      const size = 2 + Math.random() * 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.opacity = 0.3 + Math.random() * 0.4;

      particlesContainer.appendChild(particle);
    }

    return () => {
      if (particlesContainer) {
        particlesContainer.innerHTML = '';
      }
    };
  }, []);

  return <div className="particles" id="particles"></div>;
};

// Scroll Indicator Component
const ScrollIndicator = () => {
  useEffect(() => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    let timeout;

    const hideIndicator = () => {
      scrollIndicator.style.opacity = '0';
      scrollIndicator.style.pointerEvents = 'none';
    };

    const showIndicator = () => {
      scrollIndicator.style.opacity = '0.8';
      scrollIndicator.style.pointerEvents = 'auto';
    };

    const handleScroll = () => {
      hideIndicator();
      clearTimeout(timeout);
      timeout = setTimeout(showIndicator, 1000);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="scroll-indicator">
      <div className="scroll-text">Scroll Down</div>
      <div className="scroll-arrow"></div>
    </div>
  );
};

// Video Background Component
const VideoBackground = () => {
  const videoRef = useRef(null);
  const statusRef = useRef(null);
  const canvasRef = useRef(null);
  const [videoW, setVideoW] = useState(0);
  const [videoH, setVideoH] = useState(0);
  const [baseScale, setBaseScale] = useState(1);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentVideo(video);

    const handleLoadedMetadata = () => {
      setVideoW(video.videoWidth);
      setVideoH(video.videoHeight);
      if (statusRef.current) statusRef.current.style.display = 'none';
    };

    const handleCanPlay = () => {
      if (statusRef.current) statusRef.current.style.display = 'none';
    };

    const handleError = (e) => {
      console.error('Video error', e);
      if (statusRef.current) {
        statusRef.current.textContent = 'Video failed to load. Check filename/codec or try re-encoding to H.264 MP4.';
        statusRef.current.style.display = 'block';
      }
      video.controls = true;
    };

    const handleStalled = () => {
      if (statusRef.current) {
        statusRef.current.textContent = 'Video stalled while loading';
        statusRef.current.style.display = 'block';
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('stalled', handleStalled);

    video.play().catch((err) => {
      console.warn('Autoplay prevented:', err);
      if (statusRef.current) {
        statusRef.current.textContent = 'Autoplay prevented — click to play';
        statusRef.current.style.display = 'block';
      }
      video.controls = true;
    });

    // Analyze video color for text contrast
    const analyzeColor = () => {
      if (video.paused || video.ended || !canvasRef.current) return;

      try {
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        // Sample center area
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;

        let r = 0, g = 0, b = 0;
        const count = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        // Calculate perceived brightness
        const brightness = Math.round(((r / count) * 299 + (g / count) * 587 + (b / count) * 114) / 1000);
        setTheme(brightness > 128 ? 'light' : 'dark');
      } catch (e) {
        // Fallback or silence errors (e.g. taint issues)
      }
    };

    const intervalId = setInterval(analyzeColor, 1000);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('stalled', handleStalled);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const updateBaseScale = () => {
      if (!videoW || !videoH) return;
      const scaleX = window.innerWidth / videoW;
      const scaleY = window.innerHeight / videoH;
      let needed = Math.max(1, Math.max(scaleX, scaleY));

      setBaseScale(needed);
    };

    updateBaseScale();
    window.addEventListener('resize', updateBaseScale);

    return () => {
      window.removeEventListener('resize', updateBaseScale);
    };
  }, [videoW, videoH]);

  // Parallax effect
  useEffect(() => {
    const maxRotate = 4;
    const maxTranslate = 20;
    let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;
    let targetTX = 0, targetTY = 0, currentTX = 0, currentTY = 0;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const onMouseMove = (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;

      targetRY = clamp(-rx * maxRotate, -maxRotate, maxRotate);
      targetRX = clamp(ry * maxRotate, -maxRotate, maxRotate);

      targetTX = clamp(rx * maxTranslate, -maxTranslate, maxTranslate);
      targetTY = clamp(ry * maxTranslate, -maxTranslate, maxTranslate);
    };

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    let lastTime = performance.now();
    let animationFrameId;

    const animate = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const rotSpeed = 3.8;
      const transSpeed = 4.8;

      const sRot = 1 - Math.exp(-rotSpeed * dt);
      const sTrans = 1 - Math.exp(-transSpeed * dt);

      currentRX += (targetRX - currentRX) * sRot;
      currentRY += (targetRY - currentRY) * sRot;
      currentTX += (targetTX - currentTX) * sTrans;
      currentTY += (targetTY - currentTY) * sTrans;

      if (Math.abs(currentRX) < 0.001) currentRX = 0;
      if (Math.abs(currentRY) < 0.001) currentRY = 0;
      if (Math.abs(currentTX) < 0.1) currentTX = 0;
      if (Math.abs(currentTY) < 0.1) currentTY = 0;

      const tx = Math.round(currentTX);
      const ty = Math.round(currentTY);
      const rx = Math.round(currentRX * 10) / 10;
      const ry = Math.round(currentRY * 10) / 10;

      if (currentVideo) {
        currentVideo.style.transform = `translate(-50%,-50%) translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${baseScale})`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [baseScale, currentVideo]);

  return (
    <div className="video-wrapper">
      <video
        id="bg-video"
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        loop
        style={{ opacity: 1 }}
        crossOrigin="anonymous"
      >
        <source src="video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <canvas ref={canvasRef} width="50" height="50" style={{ display: 'none' }}></canvas>
      <div id="video-status" ref={statusRef} style={{ display: 'none' }}>Loading video…</div>

      <div className={`hero-center-text ${theme}`}>
        We need Nepal
      </div>

      <div id="video-overlay" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(106,17,203,0.3))', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 15px', fontWeight: 500 }}>
        🎥 Credits to Nepal Tourism Board
      </div>
    </div>
  );
};

// Search content data (outside component to avoid dependency warnings)
const searchableContent = [
  { id: 'info-1', title: 'Discover Nepal', snippet: 'Nepal is a Himalayan country in South Asia, home to Mount Everest' },
  { id: 'info-2', title: 'Culture & Festivals', snippet: 'Nepal celebrates many festivals such as Dashain and Tihar' },
  { id: 'info-3', title: 'Outdoor Activities', snippet: 'Popular activities include trekking, mountaineering, white-water rafting' },
  { id: 'top-places', title: 'Top Places', snippet: 'Kathmandu Valley, Pokhara, Boudhanath Stupa' },
  { id: 'provinces', title: 'Provinces of Nepal', snippet: 'Nepal has 7 provinces with diverse landscapes and cultures' }
];

// Search Component
const SearchComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      inputRef.current?.focus();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = searchableContent.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.snippet.toLowerCase().includes(query)
    );
    setSearchResults(results);
  }, [searchQuery]);

  const handleResultClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      element.classList.add('search-highlight');
      setTimeout(() => element.classList.remove('search-highlight'), 2000);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="search-wrapper" ref={searchRef}>
      <button
        id="search-toggle"
        className="search-btn"
        aria-expanded={isOpen}
        aria-controls="search-popover"
        aria-label="Search topics"
        title="Search topics"
        onClick={toggleSearch}
      >
        🔍
      </button>
      {isOpen && (
        <div id="search-popover" className="search-popover">
          <input
            ref={inputRef}
            id="search-input"
            type="search"
            placeholder="Search topics..."
            aria-label="Search topics"
            autoComplete="off"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
                setSearchQuery('');
              }
            }}
          />
          {searchResults.length > 0 ? (
            <ul id="search-results" className="search-results" role="listbox">
              {searchResults.map((result, index) => (
                <li
                  key={index}
                  className="search-result-item"
                  role="option"
                  aria-selected="false"
                  tabIndex={0}
                  onClick={() => handleResultClick(result.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleResultClick(result.id);
                  }}
                >
                  <strong>{result.title}</strong>
                  <div className="search-snippet">{result.snippet}</div>
                </li>
              ))}
            </ul>
          ) : searchQuery.trim() !== '' ? (
            <div className="search-empty">No results</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

// Nepal Clock Component
const NepalClockComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState('--:--');
  const [fullTime, setFullTime] = useState('--:--:--');
  const [date, setDate] = useState('');
  const canvasRef = useRef(null);
  const clockRef = useRef(null);

  // Get Nepal time (NPT = UTC+5:45)
  // Get Nepal time (NPT = UTC+5:45) using Intl for accuracy
  const getNepalTime = () => {
    try {
      const options = {
        timeZone: 'Asia/Kathmandu',
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
      };
      const formatter = new Intl.DateTimeFormat('en-US', options);
      const parts = formatter.formatToParts(new Date());

      const partValues = {};
      parts.forEach(p => partValues[p.type] = p.value);

      // Construct a Date object from the parts
      return new Date(
        partValues.year,
        partValues.month - 1,
        partValues.day,
        partValues.hour,
        partValues.minute,
        partValues.second
      );
    } catch (e) {
      // Fallback
      const now = new Date();
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      return new Date(utc + (3600000 * 5.75));
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const nepalTime = getNepalTime();
      const hours = String(nepalTime.getHours()).padStart(2, '0');
      const minutes = String(nepalTime.getMinutes()).padStart(2, '0');
      const seconds = String(nepalTime.getSeconds()).padStart(2, '0');

      setTime(`${hours}:${minutes}`);
      setFullTime(`${hours}:${minutes}:${seconds}`);
      setDate(nepalTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));

      // Draw analog clock
      drawAnalogClock(nepalTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const drawAnalogClock = (date) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw hour markers
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 * Math.PI) / 180;
      const x1 = centerX + Math.sin(angle) * (radius * 0.95);
      const y1 = centerY - Math.cos(angle) * (radius * 0.95);
      const x2 = centerX + Math.sin(angle) * (radius * 0.85);
      const y2 = centerY - Math.cos(angle) * (radius * 0.85);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const hours = date.getHours() % 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    // Draw hour hand
    const hourAngle = ((hours + minutes / 60) * 30 * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.sin(hourAngle) * (radius * 0.5),
      centerY - Math.cos(hourAngle) * (radius * 0.5)
    );
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw minute hand
    const minuteAngle = ((minutes + seconds / 60) * 6 * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.sin(minuteAngle) * (radius * 0.7),
      centerY - Math.cos(minuteAngle) * (radius * 0.7)
    );
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw second hand
    const secondAngle = (seconds * 6 * Math.PI) / 180;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.sin(secondAngle) * (radius * 0.8),
      centerY - Math.cos(secondAngle) * (radius * 0.8)
    );
    ctx.strokeStyle = '#E62E2D';
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#E62E2D';
    ctx.fill();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clockRef.current && !clockRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={clockRef} style={{ position: 'relative' }}>
      <button
        id="nepal-btn"
        className="clock-btn"
        aria-expanded={isOpen}
        title="Show Nepal time"
        aria-controls="nepal-clock-pop"
        onClick={() => setIsOpen(!isOpen)}
      >
        🕒 <span className="clock-time">{time}</span>
      </button>
      {isOpen && (
        <div id="nepal-clock-pop" className="clock-pop">
          <div className="clock-pop-grid">
            <div className="clock-digital">
              <div className="big-time">{fullTime}</div>
              <div className="tz">Kathmandu · NPT (UTC+5:45)</div>
              <div className="clock-date">{date}</div>
            </div>
            <div className="clock-analog">
              <canvas
                id="nepal-analog"
                ref={canvasRef}
                width="120"
                height="120"
                aria-label="Analog clock"
              ></canvas>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sound Toggle Component
const SoundToggleComponent = () => {
  const [isSoundOn, setIsSoundOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/Audio.mp3');
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = () => {
    if (audioRef.current) {
      if (isSoundOn) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.warn('Audio play failed:', err));
      }
      setIsSoundOn(!isSoundOn);
    }
  };

  return (
    <button
      id="sound-toggle"
      className={`sound-btn ${isSoundOn ? 'on' : ''}`}
      aria-pressed={isSoundOn}
      aria-label="Toggle sound"
      title="Toggle sound"
      onClick={toggleSound}
    >
      {isSoundOn ? '🔊' : '🔈'}
    </button>
  );
};

// Quick Links Component
const QuickLinks = () => {
  return (
    <nav id="quick-links" className="jersey-10-regular" aria-label="Quick links">
      <a href="#info-1">Overview</a>
      <a href="#info-2">Culture</a>
      <a href="#info-3">Outdoors</a>
      <a href="#provinces">Provinces</a>
      <SearchComponent />
      <NepalClockComponent />
      <SoundToggleComponent />
    </nav>
  );
};

// Info Section Component
const InfoSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveal = () => setVisible(true);
    const hide = () => setVisible(false);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) reveal();
          else hide();
        });
      }, { threshold: 0.12 });
      io.observe(section);

      return () => io.disconnect();
    }
  }, []);

  return (
    <section className={`info-section ${visible ? 'visible' : ''}`} ref={sectionRef}>
      <div className="info-container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="#info-1">Nepal</a>
          <span>/</span>
          <a href="#info-2">Culture</a>
          <span>/</span>
          <a href="#info-3">Outdoors</a>
          <span>/</span>
          <a href="#top-places">Places</a>
          <span>/</span>
          <a href="#provinces">Provinces</a>
        </nav>

        <div className="info-row" id="info-1">
          <div className="info-text">
            <h2 className="gradient-text">Discover Nepal</h2>
            <p>Nepal is a Himalayan country in South Asia, home to Mount Everest — the highest peak on Earth. It has a rich cultural heritage, diverse ethnic groups, and a long tradition of mountain tourism and trekking.</p>
            <p>Capital: Kathmandu. Languages: Nepali and many regional languages. Known for beautiful landscapes, temples, and friendly hospitality.</p>
          </div>
          <div className="info-media">
            <img className="info-img" src="https://tse2.mm.bing.net/th/id/OIP._UNasqmNY5xyWu98GiyupAHaFM?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Nepal" loading="lazy" />
          </div>
        </div>

        <div className="info-row" id="info-2">
          <div className="info-text">
            <h3>Culture & Festivals</h3>
            <p>Nepal celebrates many festivals such as Dashain and Tihar, which include family gatherings, rituals, and traditional music. Religious diversity includes Hinduism and Buddhism, with many historic temples and monasteries.</p>
          </div>
          <div className="info-media">
            <img className="info-img" src="https://th.bing.com/th/id/OIP.nDmRWmh-NzqeIrKxp6d8-wHaDj?w=289&h=180&c=7&r=0&o=7&pid=1.7&rm=3" alt="Nepal festival" loading="lazy" />
          </div>
        </div>

        <div className="info-row" id="info-3">
          <div className="info-text">
            <h3>Outdoor Activities</h3>
            <p>Popular activities include trekking (e.g., Annapurna Circuit), mountaineering, white-water rafting, and wildlife safaris. The country offers a wide range of experiences for outdoor enthusiasts.</p>
          </div>
          <div className="info-media">
            <img className="info-img" src="https://tse1.mm.bing.net/th/id/OIP.jvdtAq3plpeZKqYKcJiW7AHaEK?rs=1&pid=ImgDetMain&o=7&rm=3" alt="Nepal outdoors" loading="lazy" />
          </div>
        </div>

        <div className="info-row" id="top-places">
          <div className="info-text">
            <h3>Top places to visit</h3>
            <div className="places-list">
              <div className="place">
                <img className="place-img" src="/top_places/kathmandu.jpg" alt="Kathmandu Valley" loading="lazy" />
                <h4 className="montserrat-800">Kathmandu Valley</h4>
                <p className="place-desc lora-400">The Kathmandu Valley is a culturally rich and historically significant region in Nepal, known for its three ancient cities: Kathmandu, Patan, and Bhaktapur. This valley is a UNESCO World Heritage Site, featuring numerous UNESCO World Heritage shrines and exquisite monuments that reflect the artistic genius of the Newars, the original inhabitants. The valley is also home to Pashupatinath Temple, a major Hindu pilgrimage site, and Boudhanath Stupa, a significant Buddhist site. Visitors can explore vibrant markets, ancient temples, and the Kathmandu Durbar Square, which showcases the architectural marvels of the Malla period. The valley's rich tapestry of history, culture, and spirituality makes it a must-visit destination for travelers seeking to experience the essence of Nepal.</p>
              </div>
              <div className="place">
                <img className="place-img" src="/top_places/pokhara.jpg" alt="Pokhara" loading="lazy" />
                <h4 className="montserrat-800">Pokhara</h4>
                <p className="place-desc lora-400">Pokhara, often referred to as the 'Jewel of Nepal,' is a vibrant city nestled in the lap of the Annapurna mountain range. Known for its stunning Fewa Lake and the reflection of the majestic Annapurna peaks, Pokhara offers a blend of natural beauty and cultural richness. The city is a major tourism hub, attracting visitors with its historical temples, such as the Tal Barahi Temple, and various adventure activities like paragliding and bungee jumping. Pokhara's unique position as a crossroads for different cultures, including Hindu and Buddhist traditions, makes it a fascinating destination for travelers seeking both adventure and spirituality.</p>
              </div>
              <div className="place">
                <img className="place-img" src="/top_places/boudhanath.png" alt="Boudhanath Stupa" loading="lazy" />
                <h4 className="montserrat-800">Boudhanath Stupa</h4>
                <p className="place-desc lora-400">The Boudhanath Stupa, located in Kathmandu, Nepal, is one of the largest stupas in the world and a major spiritual landmark in Tibetan Buddhism. Built by King Manadeva, it is believed to house the relics of Kassapa Buddha and is situated along the historic trade route from Tibet to India. The stupa's circular base symbolizes Mount Meru and is adorned with the all-seeing eyes of the Buddha, making it a significant site for meditation and pilgrimage. It has been recognized as a UNESCO World Heritage Site since 1979 and is a vibrant cultural hub, attracting thousands of visitors each year.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="info-row" id="provinces">
          <div className="info-text">
            <h3>Provinces of Nepal</h3>
            <div className="nepal-map">
              <img className="nepal-map-img" src="/Provinces/map.png" alt="Nepal Map with Provinces" loading="lazy" />
            </div>
            <div className="provinces-list">
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Province 1</h4>
                  <p className="lora-400">Province 1 is located in the eastern part of Nepal and is known for its diverse landscapes, including mountains, hills, and Terai plains. It is home to Mount Everest and features cultural sites like the Everest region.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/Illam-1631441491.jpg" alt="Province 1" loading="lazy" />
                </div>
              </div>
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Province 2</h4>
                  <p className="lora-400">Province 2, also known as Madhesh Province, is in the southeastern Terai region. It is rich in agriculture and has historical sites like the ancient city of Janakpur.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/janakpur_ss_lt-1624431003.jpeg" alt="Province 2" loading="lazy" />
                </div>
              </div>
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Bagmati Province</h4>
                  <p className="lora-400">Bagmati Province is the central province and includes the capital city Kathmandu. It is known for its cultural heritage, temples, and urban development.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/kathmandu_oy_lt2-1624431334.jpeg" alt="Bagmati Province" loading="lazy" />
                </div>
              </div>
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Gandaki Province</h4>
                  <p className="lora-400">Gandaki Province is home to the Annapurna mountain range and Pokhara. It offers stunning natural beauty and is a hub for adventure tourism.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/Gandaki-1631441545.jpg" alt="Gandaki Province" loading="lazy" />
                </div>
              </div>
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Lumbini Province</h4>
                  <p className="lora-400">Lumbini Province is the birthplace of Buddha and includes the Lumbini site. It is significant for its religious and historical importance.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/Lumbini-1631441562.jpg" alt="Lumbini Province" loading="lazy" />
                </div>
              </div>
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Karnali Province</h4>
                  <p className="lora-400">Karnali Province is in the mid-western region and features rugged terrains, rivers, and is known for its natural resources and biodiversity.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/shey-1626727697.jpeg" alt="Karnali Province" loading="lazy" />
                </div>
              </div>
              <div className="province">
                <div className="province-text">
                  <h4 className="montserrat-700">Sudurpashchim Province</h4>
                  <p className="lora-400">Sudurpashchim Province, the far-western province, includes areas near the border with India and features diverse landscapes from plains to hills.</p>
                </div>
                <div className="province-media">
                  <img className="province-img" src="/Provinces/Khaptad_taan_trekker_(6)-1624819036.jpg" alt="Sudurpashchim Province" loading="lazy" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function App() {
  return (
    <div className="App">
      <Particles />
      <ScrollIndicator />
      <VideoBackground />
      <QuickLinks />
      {/* Nishant text */}
      <div className="jersey-10-regular gradient-text" style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '28px', zIndex: 10, writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '2px', textShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        NISHANT
      </div>
      <main className="content">
        <InfoSection />

        <section className="weather-section" style={{ padding: '60px 20px', backgroundColor: '#1a1a1a', textAlign: 'center' }}>
          <div className="info-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '36px', marginBottom: '20px' }}>Real-time Weather & Safety</h2>
            <p style={{ color: '#ccc', marginBottom: '40px' }}>Planning a trek or a visit? Check the current conditions and safety recommendations.</p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>
              <SmartWeather latitude={27.7172} longitude={85.3240} locationName="Kathmandu" />
              <SmartWeather latitude={28.2096} longitude={83.9856} locationName="Pokhara" />
              <SmartWeather latitude={27.6939} longitude={86.7308} locationName="Lukla (Everest Region)" />
            </div>
          </div>
        </section>

        <section className="hospital-locator-section" style={{ padding: '40px 20px', backgroundColor: '#f0f2f5' }}>
          <div className="info-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '36px', marginBottom: '20px', textAlign: 'center' }}>Find Emergency Help Nearby</h2>
            <HospitalLocator />
          </div>
        </section>

        <section className="place-explorer-section" style={{ padding: '60px 20px', backgroundColor: '#ffffff' }}>
          <div className="info-container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="gradient-text" style={{ fontSize: '36px', marginBottom: '10px', textAlign: 'center' }}>Explore Your Surroundings</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '40px' }}>Discover local Mandirs, Heritage sites, Malls, Marts, and more within 3km of your location.</p>
            <PlaceExplorer />
          </div>
        </section>

        <footer className="footer-section">
          <p><strong>Nepal Explorer</strong> - Discover the beauty and culture of Nepal</p>
          <p>© 2026 Nepal Tourism. All rights reserved | <a href="#top">Back to Top</a></p>
          <p>Built with passion for showcasing Nepal's rich heritage and natural wonders.</p>
        </footer>
      </main>
      <Chatbot />
    </div>
  );
}

export default App;
