import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-everest.jpg";
import PlanMyDay from "./PlanMyDay";

const Hero = () => {
  const [showPlanMyDay, setShowPlanMyDay] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <PlanMyDay isOpen={showPlanMyDay} onClose={() => setShowPlanMyDay(false)} />

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Background Image with optimized transition */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
            src={heroImage}
            alt="Mount Everest"
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-wide px-4 pt-20">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-8"
            >
              <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-[10px] md:text-xs font-medium uppercase tracking-[0.3em] text-white/80">
                Beyond the Peaks
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tight leading-[0.9] font-sans"
            >
              Nepal. <br />
              <span className="text-white/60">Land of Legends.</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl font-light leading-relaxed"
            >
              Experience the majestic Himalayas and ancient wonders through a modern lens.
              Your journey begins at the roof of the world.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center gap-6"
            >
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 rounded-full px-10 py-7 text-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                onClick={() => scrollToSection("destinations")}
              >
                Start Exploring
              </Button>

              <button
                onClick={() => scrollToSection("flights")}
                className="group flex items-center gap-2 text-white text-lg font-medium hover:text-white/80 transition-colors"
              >
                Book Flights
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>

            {/* Premium AI Trigger */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="mt-20"
            >
              <button
                onClick={() => setShowPlanMyDay(true)}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-500 group"
              >
                <Sparkles className="w-5 h-5 text-nepal-gold transition-transform group-hover:rotate-12" />
                <span className="text-white/80 font-medium">✨ Design your perfect day with AI</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Minimal Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
        </motion.div>
      </section>
    </>
  );
};

export default Hero;

