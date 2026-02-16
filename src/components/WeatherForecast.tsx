import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, CloudRain, Sun, Thermometer, MapPin, Loader2, Navigation, Wind, Droplets, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherData {
    temperature: number;
    condition: string;
    conditionCode: number;
    locationName: string;
    windSpeed: number;
    humidity: number;
}

const WeatherForecast = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [recommendation, setRecommendation] = useState<string>("");

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
            if (temp > 20) return "It's a beautiful day! Perfect for a sunrise trek at Sarangkot or exploring the streets of Thamel.";
            if (temp > 10) return "Crisp and clear. Ideal for sightseeing in Patan Durbar Square or a peaceful walk by Fewa Lake.";
            return "Chilly but clear. Great for a mountain flight or enjoying a warm cup of Nepali Chiya with a view.";
        }
        if (conditionCode >= 61 && conditionCode <= 82) {
            return "A bit damp outside. Perfect time to visit the indoor museums or enjoy a traditional Thakali meal indoors.";
        }
        if (conditionCode >= 95) {
            return "Stormy weather. Stay safe indoors! It's a great time to learn some basic Nepali phrases or read about Nepal's history.";
        }
        return "Adaptable weather ahead. Keep a light jacket handy and enjoy the unique atmosphere of Nepal!";
    };

    const fetchWeather = async (lat: number, lon: number) => {
        try {
            setLoading(true);
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.current_weather) {
                const current = data.current_weather;
                const condition = getWeatherCondition(current.weathercode);

                let locationName = "Your Location";
                try {
                    const geoResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const geoData = await geoResponse.json();
                    locationName = geoData.address.city || geoData.address.town || geoData.address.village || "Nepal";
                } catch (e) {
                    console.error("Geocoding error:", e);
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
                    fetchWeather(27.7172, 85.3240);
                    setError("Location access denied. Showing weather for Kathmandu.");
                }
            );
        } else {
            fetchWeather(27.7172, 85.3240);
        }
    };

    useEffect(() => {
        getLocation();
    }, []);

    const getWeatherIcon = (code: number) => {
        if (code === 0) return <Sun className="h-10 w-10 text-nepal-gold" />;
        if (code <= 3) return <Cloud className="h-10 w-10 text-muted-foreground" />;
        return <CloudRain className="h-10 w-10 text-nepal-forest" />;
    };

    return (
        <section id="weather" className="section-padding bg-secondary/20">
            <div className="container-wide">
                <div className="max-w-4xl mx-auto">
                    <div className="glass-effect rounded-3xl p-8 md:p-10 shadow-card border border-white/20 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-nepal-forest/5 rounded-full blur-3xl" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 text-nepal-forest font-medium">
                                        <Sparkles className="h-4 w-4" />
                                        <span className="text-sm uppercase tracking-wider">AI TRAVEL ADVISOR</span>
                                    </div>
                                    <h2 className="heading-section text-foreground flex items-center gap-3">
                                        <MapPin className="h-6 w-6 text-nepal-forest" />
                                        {loading ? "Locating..." : weather?.locationName}
                                    </h2>
                                </div>

                                {!loading && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={getLocation}
                                        className="rounded-full border-nepal-forest/20 hover:bg-nepal-forest/10 hover:border-nepal-forest text-nepal-forest transition-all"
                                    >
                                        Refresh
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-12"
                                    >
                                        <Loader2 className="h-12 w-12 animate-spin text-nepal-forest mb-4" />
                                        <p className="text-muted-foreground">Analyzing local weather patterns...</p>
                                    </motion.div>
                                ) : weather ? (
                                    <motion.div
                                        key="weather-content"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-10"
                                    >
                                        <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30">
                                            <div className="flex items-center gap-6 mb-6">
                                                <div className="bg-background rounded-2xl p-4 shadow-soft">
                                                    {getWeatherIcon(weather.conditionCode)}
                                                </div>
                                                <div>
                                                    <p className="text-5xl font-bold text-foreground">
                                                        {weather.temperature}°<span className="text-2xl text-muted-foreground">C</span>
                                                    </p>
                                                    <p className="text-lg text-muted-foreground capitalize">{weather.condition}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
                                                    <Wind className="h-5 w-5 text-nepal-forest" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase">Wind</p>
                                                        <p className="text-sm font-semibold">{weather.windSpeed} km/h</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
                                                    <Droplets className="h-5 w-5 text-nepal-forest" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground uppercase">Humidity</p>
                                                        <p className="text-sm font-semibold">{weather.humidity}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center">
                                            <h3 className="text-2xl font-bold text-foreground mb-4">GoNepal Recommendation</h3>
                                            <div className="relative">
                                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-nepal-forest/30 rounded-full" />
                                                <p className="text-lg text-body-large text-muted-foreground leading-relaxed pl-4">
                                                    "{recommendation}"
                                                </p>
                                            </div>
                                            {error && (
                                                <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-100 italic">
                                                    {error}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WeatherForecast;
