import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Hospital, Hotel, Utensils, TreePine, ShoppingBag, MapPin, Loader2, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Fix for default marker icon in Leaflet + Webpack/Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Place {
    id: number;
    lat: number;
    lon: number;
    name: string;
    type: string;
    category: "hospital" | "hotel" | "restaurant" | "park" | "mall";
}

const CATEGORIES = {
    hospital: { label: "Hospitals", icon: Hospital, color: "bg-red-500", query: 'node["amenity"="hospital"]' },
    hotel: { label: "Hotels & Homestays", icon: Hotel, color: "bg-amber-500", query: 'node["tourism"~"hotel|guest_house|hostel"]' },
    restaurant: { label: "Restaurant & Cafes", icon: Utensils, color: "bg-orange-500", query: 'node["amenity"~"restaurant|cafe"]' },
    park: { label: "Parks", icon: TreePine, color: "bg-green-500", query: 'node["leisure"="park"]' },
    mall: { label: "Malls", icon: ShoppingBag, color: "bg-purple-500", query: 'node["shop"="mall"]' },
};

function ChangeView({ center }: { center: [number, number] }) {
    const map = useMap();
    map.setView(center, 14);
    return null;
}

const NearbyPlaces = () => {
    const [location, setLocation] = useState<[number, number] | null>(null);
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const requestLocation = () => {
        setLoading(true);
        setError(null);
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation([position.coords.latitude, position.coords.longitude]);
                fetchNearbyPlaces(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
                setError("Please allow location access to see places nearby");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const fetchNearbyPlaces = async (lat: number, lon: number) => {
        setLoading(true);
        try {
            const radius = 3000;
            const queries = Object.entries(CATEGORIES)
                .map(([key, cat]) => `${cat.query}(around:${radius},${lat},${lon});`)
                .join("");

            const overpassQuery = `
        [out:json];
        (
          ${queries}
        );
        out body;
      `;

            const response = await fetch("https://overpass-api.de/api/interpreter", {
                method: "POST",
                body: overpassQuery,
            });

            if (!response.ok) throw new Error("Failed to fetch places");

            const data = await response.json();
            const formattedPlaces: Place[] = data.elements
                .filter((el: any) => el.lat && el.lon)
                .map((el: any) => {
                    let category: Place["category"] = "restaurant";
                    if (el.tags.amenity === "hospital") category = "hospital";
                    else if (el.tags.tourism) category = "hotel";
                    else if (el.tags.leisure === "park") category = "park";
                    else if (el.tags.shop === "mall") category = "mall";

                    return {
                        id: el.id,
                        lat: el.lat,
                        lon: el.lon,
                        name: el.tags.name || el.tags.operator || "Unnamed Place",
                        type: el.tags.amenity || el.tags.tourism || el.tags.leisure || el.tags.shop || "Place",
                        category,
                    };
                });

            setPlaces(formattedPlaces);
        } catch (err) {
            setError("Error fetching nearby places. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const filteredPlaces = activeCategory
        ? places.filter(p => p.category === activeCategory)
        : places;

    return (
        <section className="py-20 px-4 md:px-8 bg-background relative overflow-hidden" id="nearby-places">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <Badge variant="outline" className="text-nepal-terracotta border-nepal-terracotta/30 bg-nepal-terracotta/5 px-4 py-1">
                            Live Exploration
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-display text-nepal-stone">
                            Discover <span className="text-nepal-terracotta italic">Nearby</span> Essentials
                        </h2>
                        <p className="text-muted-foreground max-w-2xl text-lg">
                            Explore hospitals, hotels, restaurants, and more within 3km of your current location.
                        </p>
                    </div>

                    <Button
                        onClick={requestLocation}
                        disabled={loading}
                        className="bg-nepal-terracotta hover:bg-nepal-terracotta/90 text-white gap-2 h-12 px-6 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-nepal-terracotta/20"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                        {location ? "Refresh Location" : "Find Nearby Places"}
                    </Button>
                </div>

                {error && (
                    <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                        <MapPin className="w-5 h-5" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] md:h-[700px]">
                    {/* Map Column */}
                    <Card className="lg:col-span-2 overflow-hidden border-none shadow-soft h-full relative group">
                        {!location ? (
                            <div className="absolute inset-0 z-10 bg-nepal-stone/5 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 transition-all group-hover:bg-nepal-stone/10">
                                <div className="w-20 h-20 rounded-full bg-white shadow-elevated flex items-center justify-center mb-6 animate-float">
                                    <MapPin className="w-10 h-10 text-nepal-terracotta" />
                                </div>
                                <h3 className="text-2xl font-display text-nepal-stone mb-2">Location Required</h3>
                                <p className="text-muted-foreground max-w-sm mb-8">
                                    Allow location access to visualize nearby facilities on our interactive map.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={requestLocation}
                                    className="rounded-full px-8 hover:bg-nepal-terracotta hover:text-white border-nepal-terracotta text-nepal-terracotta transition-colors"
                                >
                                    Enable Location
                                </Button>
                            </div>
                        ) : (
                            <MapContainer
                                center={location}
                                zoom={14}
                                style={{ height: "100%", width: "100%" }}
                                className="z-0"
                            >
                                <ChangeView center={location} />
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <Circle
                                    center={location}
                                    radius={3000}
                                    pathOptions={{ color: '#E53E3E', fillColor: '#E53E3E', fillOpacity: 0.05, weight: 1 }}
                                />

                                <Marker position={location}>
                                    <Popup className="custom-popup">
                                        <div className="font-semibold text-nepal-terracotta">Your Location</div>
                                    </Popup>
                                </Marker>

                                {filteredPlaces.map((place) => {
                                    const CategoryIcon = CATEGORIES[place.category].icon;
                                    return (
                                        <Marker
                                            key={place.id}
                                            position={[place.lat, place.lon]}
                                        >
                                            <Popup>
                                                <div className="p-1 min-w-[120px]">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className={cn("p-1.5 rounded-md text-white shadow-sm", CATEGORIES[place.category].color)}>
                                                            <CategoryIcon className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                            {CATEGORIES[place.category].label}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-bold text-nepal-stone leading-tight">{place.name}</h4>
                                                    <p className="text-[10px] text-muted-foreground mt-1 truncate">{place.type}</p>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        )}
                    </Card>

                    {/* List Column */}
                    <div className="flex flex-col gap-6 overflow-hidden">
                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant={activeCategory === null ? "default" : "outline"}
                                size="sm"
                                onClick={() => setActiveCategory(null)}
                                className={cn(
                                    "rounded-full px-4 text-xs font-semibold h-9",
                                    activeCategory === null ? "bg-nepal-stone text-white" : "text-nepal-stone border-nepal-stone/20 hover:bg-nepal-stone/5"
                                )}
                            >
                                All
                            </Button>
                            {Object.entries(CATEGORIES).map(([key, cat]) => {
                                const Icon = cat.icon;
                                return (
                                    <Button
                                        key={key}
                                        variant={activeCategory === key ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setActiveCategory(key)}
                                        className={cn(
                                            "rounded-full px-4 text-xs font-semibold h-9 gap-2",
                                            activeCategory === key
                                                ? "bg-nepal-stone text-white"
                                                : "text-nepal-stone border-nepal-stone/20 hover:bg-nepal-stone/5"
                                        )}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span className="hidden sm:inline">{cat.label.split(' ')[0]}</span>
                                        <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                                    </Button>
                                );
                            })}
                        </div>

                        <Card className="flex-1 flex flex-col border-none shadow-soft overflow-hidden">
                            <div className="p-4 border-b bg-muted/30">
                                <h3 className="font-display text-lg text-nepal-stone flex items-center justify-between">
                                    Nearby Results
                                    <Badge variant="secondary" className="bg-white/50 text-nepal-stone">
                                        {filteredPlaces.length} found
                                    </Badge>
                                </h3>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-4 space-y-3">
                                    {loading && !location && (
                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-nepal-terracotta" />
                                            <p className="text-sm font-medium">Locating you...</p>
                                        </div>
                                    )}

                                    {location && filteredPlaces.length === 0 && !loading && (
                                        <div className="text-center py-12 px-4 rounded-xl bg-muted/20 border border-dashed border-muted">
                                            <p className="text-sm text-muted-foreground">
                                                No {activeCategory ? CATEGORIES[activeCategory as keyof typeof CATEGORIES].label : "places"} found in this area.
                                            </p>
                                        </div>
                                    )}

                                    {!location && !loading && (
                                        <div className="text-center py-12 px-4 rounded-xl bg-muted/20 border border-dashed border-muted text-muted-foreground italic text-sm">
                                            Please enable location to view results.
                                        </div>
                                    )}

                                    {filteredPlaces.map((place) => {
                                        const CategoryIcon = CATEGORIES[place.category].icon;
                                        return (
                                            <div
                                                key={place.id}
                                                className="p-4 rounded-xl border border-transparent bg-white hover:border-nepal-terracotta/20 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer"
                                                onClick={() => {
                                                    // In a real app we'd zoom the map to this marker
                                                }}
                                            >
                                                <div className={cn("p-2.5 rounded-lg text-white shadow-soft transition-transform group-hover:scale-110", CATEGORIES[place.category].color)}>
                                                    <CategoryIcon className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-nepal-stone text-sm line-clamp-1 group-hover:text-nepal-terracotta transition-colors">{place.name}</h4>
                                                    <p className="text-xs text-muted-foreground mt-1 capitalize">{place.type.replace(/_/g, ' ')}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Background accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-nepal-terracotta/5 rounded-full blur-3xl -z-10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-nepal-gold/5 rounded-full blur-3xl -z-10 translate-y-1/2 -translate-x-1/2" />
        </section>
    );
};

export default NearbyPlaces;
