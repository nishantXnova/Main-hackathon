import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import Categories from "@/components/Categories";
import Destinations from "@/components/Destinations";
import SeasonalHighlights from "@/components/SeasonalHighlights";
import FlightBooking from "@/components/FlightBooking";
import PlanTrip from "@/components/PlanTrip";
import Partners from "@/components/Partners";
import TravelInfo from "@/components/TravelInfo";
import CurrencyConverter from "@/components/CurrencyConverter";
import LanguageTranslator from "@/components/LanguageTranslator";
import Footer from "@/components/Footer";
import AIChatbot from "@/components/AIChatbot";
import NearbyPlaces from "@/components/NearbyPlaces";
import GuidedTour from "@/components/GuidedTour";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <StatsBar />
      <div className="section-divider" />
      <Categories />
      <Destinations />
      <SeasonalHighlights />
      <div className="section-divider" />
      <FlightBooking />
      <CurrencyConverter />
      <LanguageTranslator />
      <PlanTrip />
      <div className="section-divider" />
      <Partners />
      <TravelInfo />
      <NearbyPlaces />
      <Footer />
      <AIChatbot />
      <GuidedTour />
    </div>
  );
};

export default Index;
