# 📊 Professional Flowchart Generation Prompt

Copy and paste the prompt below into an LLM (Claude, ChatGPT) or a Mermaid.js editor to generate a high-quality technical diagram for your hackathon presentation.

---

## The Prompt

"Act as a Senior System Architect. Generate a high-quality, accurate **Mermaid.js** flowchart code for my Hackathon project 'GoNepal Premium'. The diagram should illustrate the **Data Pipeline and Technical Architecture**.

### The Pipeline Logic to include:

1.  **Data Ingestion Layer**:
    *   User Session (Supabase Auth)
    *   Live Environmental Data (Open-Meteo Weather API)
    *   Geo-Location (Browser GPS + Nominatim Reverse Geocoding)
    *   Regional Alerts (lib/newsService)

2.  **The 'Smart Companion' Processing Engine**:
    *   **Context Injected AI**: Ingests Weather + Geo-data -> Constrained AI Prompting (Edge Functions) -> Personalized Itinerary.
    *   **Auto-Translation Loop**: MutationObserver -> Detects Text -> Check Cache -> Regex Shielding (skip brand names) -> Google Translate API -> DOM Update.
    *   **Identity Logic**: User Data + Visa Status -> QR Code Generation (QRServer API) -> Real-time Verification UI.

3.  **Persistence & Resilience Layer**:
    *   **Online**: Supabase PostgreSQL (User/Guide profiles).
    *   **Offline (Trekker Mode)**: localStorage Caching (Trekker's Offline Toolkit).

4.  **User Output Channels**:
    *   Dynamic Itinerary (Plan My Day)
    *   Verified Digital Tourist ID
    *   Nearby Discovery Map (Leaflet.js)
    *   Offline Safety Dashboard (Cached Weather/Phrases)

### Styling Requirements:
*   Use a 'top-down' (TD) layout.
*   Color-code the nodes (e.g., APIs in Blue, AI in Purple, LocalStorage in Green, UI in Red).
*   Make it look 'Insane' and professional for a high-level hackathon judging panel."

---

## 💡 How to use this:
1.  Copy the text inside the quotes.
2.  Go to [Mermaid Live Editor](https://mermaid.live/) or your favorite AI.
3.  Paste it, and it will generate a clean, professional flowchart image you can put in your slides!
