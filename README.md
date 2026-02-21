# GoNepal - Discover the Land of the Himalayas 🇳🇵

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)

**Made by Team Valley**

GoNepal is a high-performance, premium travel companion platform built to revolutionize how global tourists experience Nepal. By blending real-time geolocation services with a groundbreaking **Site-Wide Auto-Translation Engine**, GoNepal breaks down cultural and language barriers, ensuring a safe, immersive, and guided journey through the heart of the Himalayas.

---

## 🚀 At a Glance: Key Innovations

- **Neural DOM Translation Layer**: A high-speed, **MutationObserver-based** engine that real-time translates the entire application into 22+ languages while maintaining brand-integrity through regex-shielding.
- **Weather-Contextual Itinerary Synthesis**: An AI concierge that leverages **Open-Meteo REST APIs** and **Nominatim Reverse-Geocoding** to generate personalized, weather-aware travel plans with optimized, scrollable UX.
- **Autonomous Digital Identity**: A localized-persistence **Digital Tourist ID** featuring dynamic **QR Code serialization** and a fully animated **FNMIS (Foreigner National Management Information System)** verification simulation.
- **Geofenced Safety Protocol**: Integrated **Overpass API** discovery with a persistent **"Set Home"** breadcrumb system that triggers proximity-breach alerts when a user wanders >3km from their base.
- **AI News Intelligence**: A dedicated news hub featuring **Neural Text Summarization** to provide tourists with concise, relevant updates on Nepalese travel and culture.
- **Liquid Motion Architecture**: A seamless, native-feeling user experience powered by **Framer Motion page-orchestration** and a bespoke **Shadcn/UI glassmorphic** design system.

---

## 🌟 Hero Feature: Site-Wide Auto-Translation Engine

GoNepal features a first-of-its-kind **Dynamic Translation Layer** that allows the entire application to be consumed in 22+ languages instantly.

- **Anywhere, Any Language**: With a single click, the entire DOM—from the Hero headers to your flight booking details—is transformed into your native tongue (e.g., Nepali, Italian, Japanese, Hindi).
- **MutationObserver Technology**: Our implementation uses a high-performance `MutationObserver` to watch for DOM changes, ensuring that even dynamically loaded content (like search results or chat messages) is translated in real-time.
- **Intelligent Caching**: To ensure a "buttery-smooth" experience, we've implemented a robust caching layer for translated strings, reducing API latency and preventing redundant network requests.
- **Brand Preservation**: Our engine employs robust regex-based protection to ensure "GoNepal" and its variations remain untranslated, maintaining brand identity across all languages.

---

## 📍 Core Capabilities

### 🪄 Plan My Day (AI Concierge) — *NEW*
A groundbreaking weather-aware itinerary generator that acts as your personal digital guide.
- **Weather-Responsive Engineering**: Dynamically fetches real-time weather and geolocation to curate the perfect day. Rain in Kathmandu? It suggests indoor cultural gems and cozy tea houses. Sun in Pokhara? It points you to Phewa Lake and sunrise viewpoints.
- **Curated Spot Intelligence**: Powered by a hand-picked database of 50+ Nepalese landmarks, each with "Pro Tips" and duration estimates.
- **One-Tap Navigation**: Generates a unified Google Maps walking route combining all itinerary stops, synced directly to your phone.
- **Premium UI & UX**: Features a glassmorphic interface with staggered animations and real-time weather status. Recently updated with a robust, scrollable layout to ensure seamless viewing of full itineraries on all device sizes.

### 🪪 Digital Tourist ID & FNMIS Simulation — *NEW*
A high-security digital identity card simulating integration with Nepal's **Foreigner National Management Information System (FNMIS)**.
- **Full Customization**: Users can now personalize their ID card with their own name, nationality, passport details, and emergency contacts. Changes are persisted via local storage.
- **Dynamic QR Generation**: Encodes personalized tourist data into a dynamic QR code for instant official verification.
- **Hotel Check-In Simulator**: A fully animated 4-step verification flow (Secure Connection → Visa Auth → Biometric Check → Identity Clear) for seamless hotel arrivals.
- **Official Compliance**: Designed with Nepal Government's aesthetic standards, featuring "Verified" badges, stay-tracking, and holographic shimmer effects.
- **Panic Integration**: Instant access to overstay alerts and emergency protocols directly from the digital card.

### 🔄 Smooth Page Transitions
All page navigations feature a fluid **fade + slide animation** powered by Framer Motion, giving the app a premium, native-app feel.

### 🗺️ Live Exploration & "Take Me Back" Safe-Guard
Designed specifically for the wandering traveler, our map integration is your digital breadcrumb trail.
- **Nearby Essentials Discovery**: Queries the Overpass API in real-time to find Hospitals, Hotels, Restaurants, Parks, and Malls within a customized 3km radius.
- **Home Base Persistence**: Users can "Set Home" at their hotel or base camp. This coordinate is saved to persistent local storage, surviving session wipes and refreshes.
- **Panic UI & Distance Alert**: A visual warning system that triggers when a user wanders >3km from their home base.
- **Native Navigation**: Deep-links directly to Google Maps or Apple Maps for precise, turn-by-turn walking directions back to safety.

### 🏔️ Curated Destination Discovery
- **Peak Experiences**: Real-time information on Everest Base Camp, Annapurna Circuit, and cultural hubs like Pokhara/Lumbini.
- **Seasonal Intelligence**: Dynamic content that changes based on the best time to visit specific regions.

### 🛠️ Strategic Travel Utilities
- **Travel Phrasebook**: A localized, high-speed phrasebook for quick communication.
- **Currency Converter**: Dynamic rate conversion for real-time budgeting in NPR and global currencies.
- **Intelligent Chatbot**: A contextual assistant ready to handle travel-specific queries.


### ☀️ Global Weather & AI Travel Advisor
- **Smart Search**: Find any city worldwide with intelligent autocomplete suggestions.
- **Easy Navigation**: Quickly toggle between your current location and searched cities with the "My Location" button.
- **Contextual AI Recommendations**: A smart logic engine that suggests activities based on the current weather.
- **Interactive Modal**: Access weather data instantly via the "Weather" quick link in the navigation bar.

---

## 🏗️ Technical Architecture

### Frontend Architecture
- **State Management**: React Context API for Global Language and Auth states.
- **Styling**: A bespoke design system built on **shadcn/ui** and **Tailwind CSS**, featuring glassmorphism and motion-based navigation via **Framer Motion**.
- **Real-time Maps**: **Leaflet.js** integrated with OpenStreetMap tiles for lightweight, fast mapping without the overhead of heavy commercial SDKs.

### Directory Structure Highlights
- `/src/contexts`: Contains the `LanguageContext` and `AuthContext` for global application state.
- `/src/components/AutoTranslator.tsx`: The core logic for the DOM-observation translation engine.
- `/src/lib/translationService.ts`: Centralized logic for interacting with translation APIs and local caches.

---

## 🛠️ Local Development

Get the project running on your machine in under 2 minutes:

1. **Clone & Navigate**
   ```bash
   git clone https://github.com/nishantXnova/Main-hackathon.git
   cd Main-hackathon
   ```

2. **Dependency Installation**
   ```bash
   npm install
   ```

3. **Runtime**
   ```bash
   npm run dev
   ```
   *Vite will automatically allocate a port (usually http://localhost:5173).*

---

## 🌐 Enterprise-Grade Deployment

The platform is continuously integrated and deployed via **Vercel**. 
- **CI/CD**: Every push to `main` undergoes a production build verification.
- **Performance**: Edge-cached assets and optimized tree-shaking for minimal JS bundle sizes.

---
*Developed with Passion & Pride by Team Valley for the Nepal Tourism Hackathon.*
