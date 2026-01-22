import React, { useState, useEffect, useRef } from 'react';

const ParallaxVideo = ({ isBlurred }) => {
  const videoRef = useRef(null);
  const [videoW, setVideoW] = useState(0);
  const [videoH, setVideoH] = useState(0);
  const [baseScale, setBaseScale] = useState(1);
  const [transform, setTransform] = useState('');
  const target = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });
  const current = useRef({ rx: 0, ry: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const updateBaseScale = () => {
      if (!videoW || !videoH) return;
      const scaleX = window.innerWidth / videoW;
      const scaleY = window.innerHeight / videoH;
      let needed = Math.max(1, Math.max(scaleX, scaleY));
      setBaseScale(Math.min(needed, 1.01));
    };
    updateBaseScale();
    window.addEventListener('resize', updateBaseScale);
    return () => window.removeEventListener('resize', updateBaseScale);
  }, [videoW, videoH]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ry = (e.clientY / window.innerHeight - 0.5) * 2;
      target.current.ry = -rx * 4;
      target.current.rx = ry * 4;
      target.current.tx = rx * 20;
      target.current.ty = ry * 20;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    let frameId;
    const animate = (now) => {
      const dt = 0.016; // approx 60fps
      current.current.rx += (target.current.rx - current.current.rx) * (1 - Math.exp(-3.8 * dt));
      current.current.ry += (target.current.ry - current.current.ry) * (1 - Math.exp(-3.8 * dt));
      current.current.tx += (target.current.tx - current.current.tx) * (1 - Math.exp(-4.8 * dt));
      current.current.ty += (target.current.ty - current.current.ty) * (1 - Math.exp(-4.8 * dt));
      setTransform(`translate(-50%,-50%) translate3d(${current.current.tx}px, ${current.current.ty}px, 0) rotateX(${current.current.rx}deg) rotateY(${current.current.ry}deg) scale(${baseScale})`);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, [baseScale]);

  return (
    <div className={`video-wrapper ${isBlurred ? 'blurred' : ''}`}>
      <video ref={videoRef} id="bg-video" autoPlay muted playsInline loop style={{ transform, width: videoW ? `${videoW}px` : 'auto' }} onLoadedMetadata={(e) => { setVideoW(e.target.videoWidth); setVideoH(e.target.videoHeight); }}>
        <source src="/video.mp4" type="video/mp4" />
      </video>
      <div id="video-overlay" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(106,17,203,0.3))', backdropFilter: 'blur(10px)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 15px', fontWeight: 500 }}>🎥 Credits to Nepal Tourism Board</div>
    </div>
  );
};

export default ParallaxVideo;
