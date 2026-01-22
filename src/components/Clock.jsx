import React, { useState, useEffect, useRef } from 'react';

const Clock = () => {
  const [time, setTime] = useState('--:--:--');
  const [date, setDate] = useState('');
  const [smallTime, setSmallTime] = useState('--:--');
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef(null);

  const NEPAL_OFFSET_MIN = 5 * 60 + 45;

  const toNepalDate = (date) => {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    return new Date(utc + NEPAL_OFFSET_MIN * 60000);
  };

  const drawAnalog = (ctx, d) => {
    const w = 120;
    const h = 120;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2, radius = Math.min(w, h) * 0.45;

    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,255,0.02)');
    g.addColorStop(1, 'rgba(255,255,255,0.01)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, radius + 6, 0, Math.PI * 2); ctx.fill();

    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.stroke();

    for (let i = 0; i < 60; i++) {
      const ang = (Math.PI * 2) * (i / 60) - Math.PI / 2;
      const inner = radius - (i % 5 ? 6 : 12);
      const outer = radius - 2;
      ctx.strokeStyle = i % 5 ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.14)';
      ctx.lineWidth = i % 5 ? 1 : 2;
      ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner); ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer); ctx.stroke();
    }

    const hh = d.getUTCHours() % 12;
    const mm = d.getUTCMinutes();
    const ss = d.getUTCSeconds();
    const hourAngle = (Math.PI * 2) * ((hh * 60 + mm) / (12 * 60)) - Math.PI / 2;
    const minAngle = (Math.PI * 2) * ((mm * 60 + ss) / 3600) - Math.PI / 2;
    const secAngle = (Math.PI * 2) * (ss / 60) - Math.PI / 2;

    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(hourAngle) * (radius * 0.52), cy + Math.sin(hourAngle) * (radius * 0.52)); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(minAngle) * (radius * 0.72), cy + Math.sin(minAngle) * (radius * 0.72)); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,120,162,0.95)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(secAngle) * (radius * 0.82), cy + Math.sin(secAngle) * (radius * 0.82)); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  };

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const nepal = toNepalDate(now);
      const timeStr = nepal.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const dateStr = nepal.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' });
      setTime(timeStr);
      setDate(dateStr);
      setSmallTime(timeStr.slice(0, 5));
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const ratio = window.devicePixelRatio || 1;
          ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
          drawAnalog(ctx, nepal);
        }
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <button id="nepal-btn" className="clock-btn" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} title="Show Nepal time">
        🕒 <span className="clock-time">{smallTime}</span>
      </button>
      <div id="nepal-clock-pop" className="clock-pop" hidden={!isOpen}>
        <div className="clock-pop-grid">
          <div className="clock-digital">
            <div className="big-time">{time}</div>
            <div className="tz">Kathmandu · NPT (UTC+5:45)</div>
            <div className="clock-date">{date}</div>
          </div>
          <div className="clock-analog">
            <canvas ref={canvasRef} width={120 * (window.devicePixelRatio || 1)} height={120 * (window.devicePixelRatio || 1)} style={{ width: '120px', height: '120px' }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;
