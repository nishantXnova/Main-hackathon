// ... existing imports ...
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, MapPin, Sun, Cloud, CloudRain, Loader2, Sparkles,
    Navigation, Clock, ExternalLink, Route, Wind, Droplets,
    Thermometer, ChevronRight, Calendar, Coffee, Camera,
    Utensils, Landmark, TreePine, Mountain, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ... constants and interfaces (unchanged) ...
// (Omitting repetitive constants for space, assuming they are kept as is)

const PlanMyDay = ({ isOpen, onClose }: PlanMyDayProps) => {
    // ... states (unchanged) ...

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-md"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full sm:max-w-xl bg-white/90 backdrop-blur-xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-white/20"
                    >
                        {/* Sticky Header with Shimmer and Wave Decoration */}
                        <div className="relative bg-gradient-to-br from-[#E41B17] via-[#c0151a] to-[#8b0000] text-white p-6 pb-10 flex-shrink-0 overflow-hidden">
                            {/* Animated Background Elements */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
                            />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                            <div className="absolute top-0 left-1/4 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-y-12 translate-y-8" />

                            <div className="relative flex items-start justify-between">
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 mb-2"
                                    >
                                        <div className="p-1 px-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-1.5">
                                            <Sparkles className="w-3 h-3 text-yellow-300" />
                                            <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Smart Concierge</span>
                                        </div>
                                    </motion.div>
                                    <h2 className="text-3xl font-extrabold tracking-tight">Plan My Day</h2>
                                    <p className="text-white/80 text-sm mt-1 max-w-[280px]">Your personalized Himalayan journey, curated by AI based on real-time weather.</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 hover:scale-110 active:scale-95 group"
                                >
                                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>

                        {/* White overlap section for better mobile scroll feel */}
                        <div className="relative -mt-6 bg-white rounded-t-[2.5rem] flex-1 overflow-visible z-10">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full sm:hidden" />

                            {/* Scrollable Content */}
                            <div className="h-full overflow-y-auto custom-scrollbar p-6">
                                {(step === "locating" || step === "weather") && (
                                    <div className="flex flex-col items-center justify-center py-20 px-6 gap-6">
                                        <div className="relative">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-20 h-20 rounded-full border-4 border-dashed border-[#E41B17]/20"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    {step === "locating" ? <MapPin className="w-8 h-8 text-[#E41B17]" /> : <Sun className="w-8 h-8 text-yellow-500" />}
                                                </motion.div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-gray-900 font-bold text-lg mb-1">
                                                {step === "locating" ? "Locating your adventure…" : "Consulting the skies…"}
                                            </p>
                                            <p className="text-gray-400 text-sm font-medium">Almost ready to show you the best of Nepal</p>
                                        </div>
                                    </div>
                                )}

                                {step === "done" && weather && (
                                    <div className="space-y-8 pb-10">
                                        {/* Weather Summary Card */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="relative bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <Mountain className="w-24 h-24" />
                                            </div>

                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                        className="p-4 bg-white rounded-2xl shadow-soft"
                                                    >
                                                        {getWeatherIcon(weather.conditionCode)}
                                                    </motion.div>
                                                    <div>
                                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Current Skies</p>
                                                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                            {weather.locationName}
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                        </h3>
                                                        <p className="text-gray-500 text-sm font-medium">{weather.condition}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-4xl font-black text-gray-900 leading-none">{weather.temperature}°</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-6">
                                                <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border border-gray-50">
                                                    <Wind className="w-4 h-4 text-blue-400" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Wind</p>
                                                        <p className="text-sm font-bold text-gray-700 leading-none">{weather.windSpeed} km/h</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl border border-gray-50">
                                                    <Droplets className="w-4 h-4 text-indigo-400" />
                                                    <div>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase leading-none mb-1">Humidity</p>
                                                        <p className="text-sm font-bold text-gray-700 leading-none">{weather.humidity}%</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800 leading-relaxed italic">
                                                    “{getContextualOpening(weather)}”
                                                </p>
                                            </div>
                                        </motion.div>

                                        {/* Itinerary Header */}
                                        <div className="flex items-center justify-between px-2">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                                <Navigation className="w-5 h-5 text-[#E41B17]" />
                                                4-Stop Walking Tour
                                            </h4>
                                            <div className="flex items-center gap-1.5 py-1 px-3 bg-gray-100 rounded-full text-[10px] font-bold text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                ~{Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                                            </div>
                                        </div>

                                        {/* Staggered Itinerary List */}
                                        <div className="space-y-4">
                                            {stops.map((stop, index) => (
                                                <motion.div
                                                    key={stop.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.3 + index * 0.1 }}
                                                    whileHover={{ x: 5 }}
                                                    className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="flex items-stretch">
                                                        {/* Step Indicator */}
                                                        <div className="w-16 flex flex-col items-center py-4 border-r border-gray-50">
                                                            <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#E41B17] group-hover:text-white transition-colors flex items-center justify-center font-bold text-gray-400 text-sm">
                                                                {index + 1}
                                                            </div>
                                                            {index < stops.length - 1 && (
                                                                <div className="flex-1 w-[2px] bg-gray-50 my-2" />
                                                            )}
                                                        </div>

                                                        {/* Stop Content */}
                                                        <div className="flex-1 p-5 pl-4">
                                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                                <h5 className="font-bold text-gray-900 group-hover:text-[#E41B17] transition-colors">{stop.name}</h5>
                                                                <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter shrink-0">
                                                                    <Clock className="w-3 h-3" />
                                                                    {stop.duration}
                                                                </span>
                                                            </div>
                                                            <p className="text-gray-500 text-xs leading-relaxed mb-3">{stop.description}</p>

                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${TYPE_COLORS[stop.type]}`}>
                                                                    {TYPE_ICONS[stop.type]}
                                                                    {stop.type.toUpperCase()}
                                                                </span>
                                                            </div>

                                                            {/* Pro Tip Bubble */}
                                                            <div className="relative overflow-hidden bg-amber-50/50 rounded-2xl p-3 border border-amber-100/50">
                                                                <div className="absolute top-0 right-0 p-1">
                                                                    <Sparkles className="w-10 h-10 text-amber-500/10" />
                                                                </div>
                                                                <p className="text-[11px] text-amber-900 leading-tight">
                                                                    <span className="font-black uppercase text-[9px] mr-1.5">Pro Tip:</span>
                                                                    {stop.tip}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Action Area */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 }}
                                            className="pt-4"
                                        >
                                            <a
                                                href={mapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block w-full"
                                            >
                                                <Button className="w-full h-16 bg-gradient-to-r from-[#E41B17] to-[#8b0000] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-500/20 rounded-2xl group overflow-hidden relative">
                                                    <motion.div
                                                        className="absolute inset-0 bg-white/20 translate-x-[-100%]"
                                                        animate={{ translateX: ["100%", "-100%"] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <div className="relative flex items-center justify-center gap-3 font-bold text-lg">
                                                        <MapPin className="w-6 h-6 group-hover:animate-bounce" />
                                                        Start Journey (Google Maps)
                                                        <ExternalLink className="w-4 h-4 opacity-50" />
                                                    </div>
                                                </Button>
                                            </a>
                                            <p className="text-center text-[10px] text-gray-400 mt-4 font-medium uppercase tracking-widest">
                                                All destinations synced to walking directions
                                            </p>
                                        </motion.div>

                                        {/* Refresh Button */}
                                        <button
                                            onClick={startFlow}
                                            className="w-full flex items-center justify-center gap-2 py-4 text-xs font-bold text-gray-400 hover:text-[#E41B17] transition-colors border-t border-gray-50 mt-4"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            LOOKING FOR SOMETHING ELSE? REGENERATE
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};


export default PlanMyDay;
