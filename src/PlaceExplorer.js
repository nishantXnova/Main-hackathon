import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// FIX: Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecenterMap = ({ center, zoom = 14 }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);
    return null;
};

// Simplified CATEGORIES with local terminology
const CATEGORIES = [
    { id: 'landmarks', name: 'Landmarks', icon: '🏛️', query: '(node["tourism"="attraction"];node["tourism"="museum"];node["historic"="monument"];)' },
    { id: 'nature', name: 'Nature', icon: '🌳', query: '(node["leisure"="park"];node["leisure"="garden"];node["natural"="beach"];node["natural"="water"];)' },
    { id: 'food', name: 'Food & Cafes', icon: '☕', query: '(node["amenity"="restaurant"];node["amenity"="cafe"];node["amenity"="fast_food"];)' },
    { id: 'entertainment', name: 'Fun', icon: '🎡', query: '(node["leisure"="amusement_arcade"];node["amenity"="zoo"];node["amenity"="theatre"];node["amenity"="cinema"];)' },
    { id: 'shopping', name: 'Malls & Marts', icon: '🛍️', query: '(node["shop"="mall"];node["shop"="supermarket"];node["shop"="department_store"];node["amenity"="marketplace"];)' },
    { id: 'cultural', name: 'Mandirs & Culture', icon: '🛕', query: '(node["amenity"="place_of_worship"];node["historic"="heritage"];node["tourism"="viewpoint"];)' },
    { id: 'adventure', name: 'Adventure', icon: '🧗', query: '(node["leisure"="sports_centre"];node["sport"="climbing"];node["sport"="hiking"];)' },
    { id: 'scenic', name: 'Scenic Views', icon: '🔭', query: '(node["tourism"="viewpoint"];node["natural"="peak"];node["natural"="water"];)' },
    { id: 'medical', name: 'Medical', icon: '🏥', query: 'node["amenity"="hospital"]' },
];

const PlaceExplorer = () => {
    const [position, setPosition] = useState(null);
    const [places, setPlaces] = useState([]);
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapFocus, setMapFocus] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(coords);
                    setMapFocus(coords);
                    fetchPlaces(coords[0], coords[1], activeCategory);
                },
                (err) => {
                    setError("Location access denied. Please enable it to explore nearby.");
                    console.error("Geolocation error:", err);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    const fetchPlaces = async (lat, lng, category) => {
        setLoading(true);
        setError(null);
        setPlaces([]); // Clear previous results
        try {
            // Simplify query: use (around:3000,lat,lng) for each node type
            let baseQuery = category.query;

            // If it's a union query (starts with '('), we need to inject the around parameter into each part
            if (baseQuery.startsWith('(')) {
                baseQuery = baseQuery.replace(/node\[/g, `node(around:3000,${lat},${lng})[`);
            } else {
                baseQuery = baseQuery.replace('node', `node(around:3000,${lat},${lng})`);
            }

            const opQuery = `[out:json][timeout:25];${baseQuery};out body;`;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(opQuery)}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.elements) {
                setPlaces([]);
                return;
            }

            const list = data.elements.map(item => ({
                id: item.id,
                name: item.tags.name || `Local ${category.name}`,
                lat: item.lat,
                lng: item.lon,
                type: item.tags.amenity || item.tags.tourism || item.tags.leisure || item.tags.shop || category.name
            }));

            // Sort by name or filter out duplicates if any
            const uniqueList = Array.from(new Map(list.map(item => [item.id, item])).values());
            setPlaces(uniqueList);
        } catch (err) {
            setError("Unable to load data. Please check your internet or try again later.");
            console.error("Overpass fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (cat) => {
        setActiveCategory(cat);
        if (position) fetchPlaces(position[0], position[1], cat);
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <div style={styles.categoryGrid}>
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat)}
                            style={{
                                ...styles.catBtn,
                                backgroundColor: activeCategory.id === cat.id ? '#1a365d' : '#fff',
                                color: activeCategory.id === cat.id ? '#fff' : '#4a5568',
                            }}
                        >
                            <span>{cat.icon}</span>
                            <span style={styles.catName}>{cat.name}</span>
                        </button>
                    ))}
                </div>

                <div style={styles.listArea}>
                    {loading ? (
                        <div style={styles.status}>Searching for {activeCategory.name}...</div>
                    ) : error ? (
                        <div style={styles.error}>{error}</div>
                    ) : places.length > 0 ? (
                        places.map(p => (
                            <div key={p.id} style={styles.listItem} onClick={() => setMapFocus([p.lat, p.lng])}>
                                <div style={styles.placeName}>{p.name}</div>
                                <div style={styles.placeType}>{p.type}</div>
                            </div>
                        ))
                    ) : (
                        <div style={styles.empty}>No {activeCategory.name} found within 3km.</div>
                    )}
                </div>
            </div>

            <div style={styles.mapWrap}>
                {position ? (
                    <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                        <Marker position={position}><Popup>Your Location</Popup></Marker>
                        {places.map(p => (
                            <Marker key={p.id} position={[p.lat, p.lng]}>
                                <Popup><strong>{p.name}</strong><br />{p.type}</Popup>
                            </Marker>
                        ))}
                        <RecenterMap center={mapFocus} zoom={mapFocus === position ? 14 : 16} />
                    </MapContainer>
                ) : <div style={styles.mapPlaceholder}>Enable location to view map</div>}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '600px', width: '100%', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', backgroundColor: '#fff' },
    sidebar: { width: '300px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #edf2f7', background: '#f8fafc' },
    categoryGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', padding: '15px', borderBottom: '1px solid #edf2f7' },
    catBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 5px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '10px', cursor: 'pointer', transition: 'all 0.2s' },
    catName: { marginTop: '4px', fontWeight: '600' },
    listArea: { flex: 1, overflowY: 'auto', padding: '10px' },
    listItem: { padding: '12px', marginBottom: '8px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'transform 0.1s' },
    placeName: { fontSize: '13px', fontWeight: '700', color: '#2d3748' },
    placeType: { fontSize: '11px', color: '#718096', textTransform: 'capitalize' },
    status: { padding: '20px', textAlign: 'center', fontSize: '12px', color: '#4a5568' },
    error: { padding: '20px', color: '#e53e3e', fontSize: '12px', textAlign: 'center' },
    empty: { padding: '20px', textAlign: 'center', fontSize: '12px', color: '#a0aec0' },
    mapWrap: { flex: 1, backgroundColor: '#fdfdfd' },
    mapPlaceholder: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096' }
};

export default PlaceExplorer;
