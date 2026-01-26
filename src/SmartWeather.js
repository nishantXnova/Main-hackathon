import React, { useState, useEffect } from 'react';
import './SmartWeather.css';

const SmartWeather = ({ latitude: defaultLat = 27.7172, longitude: defaultLon = 85.3240, locationName: defaultName = "Kathmandu" }) => {
    const [coords, setCoords] = useState({ lat: defaultLat, lon: defaultLon });
    const [locationName, setLocationName] = useState(defaultName);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
                );
                if (!response.ok) throw new Error('Weather data fetch failed');
                const data = await response.json();
                setWeatherData(data.current_weather);
                setError(null);
            } catch (err) {
                setError("Failed to load weather");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [coords]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setIsSearching(true);
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                setCoords({ lat: result.latitude, lon: result.longitude });
                setLocationName(result.name + (result.admin1 ? `, ${result.admin1}` : ''));
                setSearchQuery('');
            } else {
                alert("Location not found. Try another name.");
            }
        } catch (err) {
            console.error("Geocoding failed", err);
            alert("Search failed. Please try again.");
        } finally {
            setIsSearching(false);
        }
    };

    const getWeatherCondition = (code) => {
        if (code === 0) return { label: 'Clear Sky', type: 'clear' };
        if (code >= 1 && code <= 3) return { label: 'Partly Cloudy', type: 'cloudy' };
        if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) return { label: 'Rainy', type: 'rain' };
        if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return { label: 'Snowfall', type: 'snow' };
        return { label: 'Other', type: 'other' };
    };

    if (loading && !weatherData) return <div className="weather-card loading">Loading weather data...</div>;
    if (error) return <div className="weather-card error">{error}</div>;

    const { temperature, weathercode } = weatherData;
    const condition = getWeatherCondition(weathercode);

    const getSmartSuggestion = () => {
        const isIdealTemp = temperature >= 15 && temperature <= 30;
        const isGoodConditions = condition.type === 'clear' || condition.type === 'cloudy';
        const isBadWeather = condition.type === 'rain' || condition.type === 'snow';

        if (!isBadWeather && isGoodConditions && isIdealTemp) {
            return {
                verdict: "✅ GO",
                text: "🌟 Perfect conditions! Best time to visit today.",
                className: "suggestion-good"
            };
        }
        return {
            verdict: "❌ STAY",
            text: "⚠️ Weather is suboptimal. Not recommended for sightseeing today.",
            className: "suggestion-bad"
        };
    };

    const getTrekkingWarning = () => {
        if (condition.type === 'rain') return { text: "⚠️ Rain expected – trekking risky!", className: "warning-rain" };
        if (condition.type === 'snow') return { text: "❄️ Snowfall – trekking not safe!", className: "warning-snow" };
        return { text: "🥾 SAFE: Trekking conditions look good. Enjoy!", className: "warning-safe" };
    };

    const suggestion = getSmartSuggestion();
    const trekking = getTrekkingWarning();

    return (
        <div className={`weather-card weather-${condition.type}`}>
            <form className="weather-search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isSearching}
                />
                <button type="submit" disabled={isSearching}>
                    {isSearching ? '...' : '🔍'}
                </button>
            </form>

            <div className="weather-header">
                <h3 className="location-name">{locationName}</h3>
                <div className="weather-main">
                    <span className="temperature">{Math.round(temperature)}°C</span>
                    <span className="condition-label">{condition.label}</span>
                </div>
            </div>

            <div className="weather-details">
                <div className={`suggestion-box ${suggestion.className}`}>
                    <span className="verdict">{suggestion.verdict}</span>
                    <span className="advice-text">{suggestion.text}</span>
                </div>
                <div className={`trekking-box ${trekking.className}`}>
                    {trekking.text}
                </div>
            </div>
        </div>
    );
};

export default SmartWeather;
