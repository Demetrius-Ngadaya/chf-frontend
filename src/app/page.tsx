import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import MissionSection from "@/components/MissionSection";
import ProjectsSection from "@/components/ProjectsSection";
import EventsSection from "@/components/EventsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection";
import CTABand from "@/components/CTABand";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <MissionSection />
      <ProjectsSection />
      <EventsSection />
      <TestimonialsSection />
      <PartnersSection />
      <CTABand />
      <Footer />
    </main>
  );
}
