import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudRain, Sun, Thermometer, MapPin, Loader2, Navigation, Wind, Droplets, Sparkles, AlertTriangle, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeather } from "@/contexts/WeatherContext";

interface WeatherData {
    temperature: number;
    condition: string;
    conditionCode: number;
    locationName: string;
    windSpeed: number;
    humidity: number;
}

const WeatherForecast = () => {
    const { isOpen, closeWeather } = useWeather();
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const getWeatherCondition = (code: number) => {
        if (code === 0) return "Clear sky";
        if (code <= 3) return "Partly cloudy";
        if (code <= 48) return "Foggy";
        if (code <= 67) return "Rainy";
        if (code <= 77) return "Snowy";
        if (code <= 82) return "Showers";
        if (code <= 99) return "Thunderstorm";
        return "Unknown";
    };

    const generateAIRecommendation = (temp: number, conditionCode: number) => {
        if (conditionCode === 0 || (conditionCode >= 1 && conditionCode <= 3)) {
            if (temp > 20) return "It's a beautiful day! Perfect for outdoor adventures or exploring local markets.";
            if (temp > 10) return "Crisp and clear. Ideal for sightseeing and photography.";
            return "Chilly but clear. Great for enjoying localized warm beverages with a view.";
        }
        if (conditionCode >= 61 && conditionCode <= 82) {
            return "A bit damp outside. Perfect time to visit indoor museums or cozy cafes.";
        }
        if (conditionCode >= 95) {
            return "Stormy weather. Stay safe indoors! Good time to plan your next itinerary.";
        }
        return "Adaptable weather ahead. Keep a light jacket handy!";
    };

    const fetchWeather = async (lat: number, lon: number, customLocationName?: string) => {
        try {
            setLoading(true);
            setError(null);
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.current_weather) {
                const current = data.current_weather;
                const condition = getWeatherCondition(current.weathercode);

                let locationName = customLocationName || "Your Location";
                if (!customLocationName) {
                    try {
                        const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                        const geoData = await geoResponse.json();
                        locationName = geoData.address.city || geoData.address.town || geoData.address.village || "Unknown Location";
                    } catch (e) {
                        console.error("Geocoding error:", e);
                    }
                }

                const weatherData: WeatherData = {
                    temperature: current.temperature,
                    condition: condition,
                    conditionCode: current.weathercode,
                    locationName: locationName,
                    windSpeed: current.windspeed,
                    humidity: data.hourly?.relativehumidity_2m?.[0] || 60,
                };

                setWeather(weatherData);
                setRecommendation(generateAIRecommendation(current.temperature, current.weathercode));
            }
        } catch (err) {
            console.error("Weather fetch error:", err);
            setError("Failed to fetch weather data.");
        } finally {
            setLoading(false);
        }
    };

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.error("Geolocation error:", err);
                    fetchWeather(27.7172, 85.3240, "Kathmandu"); // Fallback
                    setError("Location access denied. Showing Kathmandu.");
                }
            );
        } else {
            fetchWeather(27.7172, 85.3240, "Kathmandu");
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                // Extract a shorter name from display_name if possible, or use search query
                const shortName = display_name.split(",")[0];
                await fetchWeather(parseFloat(lat), parseFloat(lon), shortName);
            } else {
                setError("Location not found.");
            }
        } catch (err) {
            setError("Search failed.");
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (isOpen && !weather) {
            getLocation();
        }
    }, [isOpen]);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="h-10 w-10 text-nepal-gold" />;
        if (code <= 3) return <Cloud className="h-10 w-10 text-muted-foreground" />;
        return <CloudRain className="h-10 w-10 text-nepal-forest" />;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={closeWeather}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-lg bg-background/90 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header / Close */}
                        <div className="absolute top-4 right-4 z-20">
                            <Button variant="ghost" size="icon" onClick={closeWeather} className="rounded-full hover:bg-black/10">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search city (e.g., Pokhara, London)..."
                                    className="pl-10 rounded-xl bg-secondary/50 border-transparent focus:border-nepal-forest/50"
                                />
                                {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />}
                            </form>

                            {/* Content */}
                            <div className="min-h-[300px] flex flex-col justify-center">
                                {loading && !weather ? (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Loader2 className="h-10 w-10 animate-spin text-nepal-forest mb-3" />
                                        <p className="text-muted-foreground text-sm">Forecasting...</p>
                                    </div>
                                ) : weather ? (
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
                                                <MapPin className="h-5 w-5 text-nepal-forest" />
                                                {weather.locationName}
                                            </h2>
                                            <p className="text-muted-foreground text-sm">{weather.condition}</p>
                                        </div>

                                        <div className="flex items-center justify-center gap-6 py-4">
                                            <div className="p-4 bg-secondary/50 rounded-2xl">
                                                {getWeatherIcon(weather.conditionCode)}
                                            </div>
                                            <div className="text-5xl font-bold">
                                                {weather.temperature}°
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-xl">
                                                <Wind className="h-4 w-4 mb-1 text-muted-foreground" />
                                                <span className="font-semibold text-sm">{weather.windSpeed} km/h</span>
                                            </div>
                                            <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-xl">
                                                <Droplets className="h-4 w-4 mb-1 text-muted-foreground" />
                                                <span className="font-semibold text-sm">{weather.humidity}%</span>
                                            </div>
                                        </div>

                                        <div className="bg-nepal-forest/5 p-4 rounded-xl border border-nepal-forest/10">
                                            <div className="flex items-center gap-2 mb-2 text-nepal-forest text-xs font-bold uppercase tracking-wide">
                                                <Sparkles className="h-3 w-3" />
                                                Travel AI
                                            </div>
                                            <p className="text-sm text-foreground/90 leading-relaxed">
                                                "{recommendation}"
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg justify-center">
                                                <AlertTriangle className="h-3 w-3" />
                                                {error}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground">Search for a location to see the forecast.</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WeatherForecast;
