import React, { useEffect, useRef, useState } from 'react';

const InfoRow = ({ id, title, children, image, isTitle = false }) => {
  const rowRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
    if (rowRef.current) observer.observe(rowRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rowRef} id={id} className={`info-row ${isVisible ? 'in-view' : ''}`}>
      <div className="info-text">
        {isTitle ? <h2 className={`gradient-text ${isVisible ? 'revealed' : ''}`}>{title}</h2> : <h3>{title}</h3>}
        {children}
      </div>
      {image && <div className="info-media"><img className="info-img" src={image} alt={title} loading="lazy" /></div>}
    </div>
  );
};

export default InfoRow;
