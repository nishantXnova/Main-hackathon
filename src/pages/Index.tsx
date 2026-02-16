import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WeatherForecast from "@/components/WeatherForecast";
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

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <WeatherForecast />
      <Categories />
      <Destinations />
      <SeasonalHighlights />
      <FlightBooking />
      <CurrencyConverter />
      <LanguageTranslator />
      <PlanTrip />
      <Partners />
      <TravelInfo />
      <NearbyPlaces />
      <Footer />
      <AIChatbot />
    </div>
  );
};

export default Index;
