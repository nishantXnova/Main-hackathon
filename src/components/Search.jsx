import React, { useState, useEffect, useRef } from 'react';

const Search = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const items = [
    { id: 'info-1', title: 'Discover Nepal', text: 'Nepal is a Himalayan country in South Asia, home to Mount Everest. Capital: Kathmandu.' },
    { id: 'info-2', title: 'Culture & Festivals', text: 'Nepal celebrates many festivals such as Dashain and Tihar. Hinduism and Buddhism.' },
    { id: 'info-3', title: 'Outdoor Activities', text: 'Trekking, mountaineering, white-water rafting, and wildlife safaris.' },
    { id: 'top-places', title: 'Top places to visit', text: 'Kathmandu Valley, Pokhara, Boudhanath Stupa.' },
    { id: 'provinces', title: 'Provinces of Nepal', text: 'Province 1, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim.' }
  ];

  const handleSearch = (q) => {
    setQuery(q);
    const term = q.trim().toLowerCase();
    if (!term) {
      setResults([]);
      return;
    }
    const matches = items.filter(it => it.title.toLowerCase().includes(term) || it.text.toLowerCase().includes(term));
    setResults(matches);
  };

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      setIsOpen(false);
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('search-highlight');
      setTimeout(() => el.classList.remove('search-highlight'), 2200);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className="search-wrapper">
      <button id="search-toggle" className="search-btn" onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen} title="Search topics">🔍</button>
      <div id="search-popover" className="search-popover" hidden={!isOpen}>
        <input ref={inputRef} type="search" placeholder="Search topics..." value={query} onChange={(e) => handleSearch(e.target.value)} autoComplete="off" />
        <ul className="search-results">
          {results.map(res => (
            <li key={res.id} className="search-result-item" onClick={() => goTo(res.id)}>
              <strong>{res.title}</strong>
              <div className="search-snippet">{res.text}</div>
            </li>
          ))}
        </ul>
        {query && results.length === 0 && <div className="search-empty">No results</div>}
      </div>
    </div>
  );
};

export default Search;
