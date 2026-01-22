import React, { useState, useEffect, useRef } from 'react';

const SoundToggle = () => {
  const [isOn, setIsOn] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('bgSoundOn');
    if (saved === 'true') {
      setIsOn(true);
    }
  }, []);

  useEffect(() => {
    if (isOn) {
      audioRef.current?.play().catch(() => setIsOn(false));
    } else {
      audioRef.current?.pause();
    }
    localStorage.setItem('bgSoundOn', isOn);
  }, [isOn]);

  return (
    <>
      <audio ref={audioRef} id="bg-sound" loop preload="auto">
        <source src="/Audio.mp3" type="audio/mpeg" />
      </audio>
      <button id="sound-toggle" className={`sound-btn ${isOn ? 'on' : ''}`} onClick={() => setIsOn(!isOn)} aria-pressed={isOn} title="Toggle sound">
        {isOn ? '🔊' : '🔈'}
      </button>
    </>
  );
};

export default SoundToggle;
