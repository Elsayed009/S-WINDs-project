import { useState, useEffect, useRef } from 'react';
import  geocodeSearchApi  from '../api/geocodeApi';

const LocationAutocomplete = ({ label, placeholder, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const skipNextSearch = useRef(false); // new

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    if (query.trim().length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await geocodeSearchApi(query);
        setResults(response.data.results);
        setShowDropdown(true);
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleSelect = (place) => {
    skipNextSearch.current = true; //  useEffect "dont send request"
    setQuery(place.displayName);
    setShowDropdown(false);
    setResults([]);
    onSelect({ lat: place.lat, lng: place.lng, address: place.displayName });
  };

  return (
    <div style={styles.wrapper}>
      <label style={styles.label}>{label}</label>
      <input
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
      />

      {loading && <span style={styles.loadingText}>Searching...</span>}

      {showDropdown && results.length > 0 && (
        <div style={styles.dropdown}>
          {results.map((place, i) => (
            <div
              key={i}
              style={styles.option}
              onMouseDown={() => handleSelect(place)}
            >
              📍 {place.displayName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { position: 'relative', marginBottom: '4px' },
  label: { color: '#8a93a3', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '6px' },
  input: {
    width: '100%', background: '#0a0e14', border: '1px solid #2a2f3a', borderRadius: '8px',
    padding: '10px 12px', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box',
  },
  loadingText: { color: '#8a93a3', fontSize: '0.7rem', marginTop: '4px', display: 'block' },
  dropdown: {
    position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 10,
    background: '#11151c', border: '1px solid #2a2f3a', borderRadius: '8px',
    marginTop: '4px', maxHeight: '200px', overflowY: 'auto',
  },
  option: {
    padding: '10px 12px', color: '#fff', fontSize: '0.8rem', cursor: 'pointer',
    borderBottom: '1px solid #1a1f2a',
  },
};

export default LocationAutocomplete;