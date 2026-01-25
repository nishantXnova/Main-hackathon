import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * FIX: Leaflet marker icons often don't show up correctly in React/Webpack.
 * This code manually points to the CDN-hosted marker images to ensure they appear.
 */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * HELPER: RecenterMap component
 * This component accesses the Leaflet map instance and pans/zooms to a target coordinate.
 */
const RecenterMap = ({ center, zoom = 14 }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom, { animate: true });
        }
    }, [center, zoom, map]);
    return null;
};

const HospitalLocator = () => {
    // STATE: Coordinates of the user
    const [position, setPosition] = useState(null);
    // STATE: List of hospitals from API
    const [hospitals, setHospitals] = useState([]);
    // STATE: Tracking loading status
    const [loading, setLoading] = useState(false);
    // STATE: Storing error messages
    const [error, setError] = useState(null);
    // STATE: For panning the map when a hospital is clicked
    const [mapFocus, setMapFocus] = useState(null);

    /**
     * STEP 1 & 2: Get user's location via Browser Geolocation API
     */
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    const userCoords = [latitude, longitude];
                    setPosition(userCoords);
                    setMapFocus(userCoords); // Set initial map focus
                    fetchHospitals(latitude, longitude);
                },
                (err) => {
                    setError("Location access denied. Please enable location to find hospitals near you.");
                    console.error("Geolocation error:", err);
                }
            );
        } else {
            setError("Geolocation is not supported by your browser.");
        }
    }, []);

    /**
     * STEP 3: Fetch nearby hospitals from OpenStreetMap using Overpass API
     */
    const fetchHospitals = async (lat, lng) => {
        setLoading(true);
        try {
            // Overpass Query: find nodes with 'amenity=hospital' within 3000 meters of lat/lng
            const query = `[out:json];node["amenity"="hospital"](around:3000,${lat},${lng});out;`;
            const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();

            // Transform raw API data into a cleaner object structure
            const hospitalList = data.elements.map(item => ({
                id: item.id,
                name: item.tags.name || "Unnamed Hospital",
                lat: item.lat,
                lng: item.lon,
                address: item.tags['addr:street'] || item.tags['addr:full'] || "Nearby location"
            }));

            setHospitals(hospitalList);
        } catch (err) {
            setError("Failed to fetch hospital data. Please check your connection.");
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * INTERACTION: When a hospital in the list is clicked, focus the map on it.
     */
    const handleHospitalClick = (hosp) => {
        setMapFocus([hosp.lat, hosp.lng]);
    };

    return (
        <div className="hospital-locator-card" style={styles.card}>
            <div className="hospital-sidebar" style={styles.sidebar}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Emergency Help</h2>
                    <p style={styles.subtitle}>Nearby hospitals within 3km</p>
                </div>

                {loading && <div style={styles.loader}>Searching local data...</div>}
                {error && <div style={styles.errorBox}>{error}</div>}

                <div style={styles.listContainer}>
                    {hospitals.length > 0 ? (
                        hospitals.map(hosp => (
                            <div
                                key={hosp.id}
                                style={styles.listItem}
                                onClick={() => handleHospitalClick(hosp)}
                                className="hosp-item"
                            >
                                <div style={styles.hospIcon}>🏥</div>
                                <div>
                                    <div style={styles.hospName}>{hosp.name}</div>
                                    <div style={styles.hospAddress}>{hosp.address}</div>
                                </div>
                            </div>
                        ))
                    ) : (
                        !loading && position && <div style={styles.emptyState}>No hospitals found in this radius.</div>
                    )}
                </div>
            </div>

            <div className="map-area" style={styles.mapContainer}>
                {position ? (
                    <MapContainer center={position} zoom={14} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
                        />

                        {/* User Location Marker */}
                        <Marker position={position}>
                            <Popup>
                                <strong>You are here</strong>
                            </Popup>
                        </Marker>

                        {/* Hospital Markers */}
                        {hospitals.map(hosp => (
                            <Marker key={hosp.id} position={[hosp.lat, hosp.lng]}>
                                <Popup>
                                    <div style={{ textAlign: 'center' }}>
                                        <strong>{hosp.name}</strong><br />
                                        <small>{hosp.address}</small>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}

                        {/* Handles map panning movements */}
                        <RecenterMap center={mapFocus} zoom={mapFocus === position ? 14 : 16} />
                    </MapContainer>
                ) : (
                    <div style={styles.mapPlaceholder}>
                        <div style={styles.placeholderIcon}>📍</div>
                        <div style={styles.placeholderText}>
                            Allow location access to view the interactive map.
                        </div>
                    </div>
                )}
            </div>

            <style>
                {`
                    .hosp-item:hover {
                        background-color: #f1f5f9;
                        transform: translateX(4px);
                    }
                    .hosp-item {
                        transition: all 0.2s ease;
                        cursor: pointer;
                    }
                `}
            </style>
        </div>
    );
};

// PREMIUM CSS-IN-JS STYLES
const styles = {
    card: {
        display: 'flex',
        flexDirection: 'row',
        height: '650px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 15px 35px rgba(0,0,0,0.08)',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    sidebar: {
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fdfdfd',
        borderRight: '1px solid #edf2f7',
    },
    header: {
        padding: '30px',
        background: 'linear-gradient(135deg, #2c5282 0%, #1a365d 100%)',
        color: '#ffffff',
    },
    title: {
        margin: 0,
        fontSize: '22px',
        fontWeight: '700',
        letterSpacing: '-0.5px',
    },
    subtitle: {
        margin: '5px 0 0 0',
        fontSize: '13px',
        opacity: 0.9,
        fontWeight: '400',
    },
    listContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '10px',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        margin: '4px 0',
        borderRadius: '12px',
        border: '1px solid transparent',
    },
    hospIcon: {
        fontSize: '24px',
        marginRight: '15px',
        background: '#ebf4ff',
        width: '45px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
    },
    hospName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '2px',
    },
    hospAddress: {
        fontSize: '12px',
        color: '#718096',
    },
    loader: {
        padding: '20px',
        textAlign: 'center',
        color: '#4a5568',
        fontSize: '14px',
        fontStyle: 'italic',
    },
    errorBox: {
        margin: '15px',
        padding: '12px',
        backgroundColor: '#fff5f5',
        color: '#c53030',
        borderRadius: '8px',
        fontSize: '13px',
        border: '1px solid #feb2b2',
    },
    emptyState: {
        padding: '40px 20px',
        textAlign: 'center',
        color: '#a0aec0',
        fontSize: '14px',
    },
    mapContainer: {
        flex: 1,
        backgroundColor: '#f7fafc',
    },
    mapPlaceholder: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#4a5568',
        padding: '40px',
    },
    placeholderIcon: {
        fontSize: '48px',
        marginBottom: '20px',
    },
    placeholderText: {
        maxWidth: '300px',
        textAlign: 'center',
        fontWeight: '500',
        lineHeight: '1.6',
    }
};

export default HospitalLocator;

