import HeroSection from "@/components/HeroSection";
import BestsellersCarousel from "@/components/BestsellersCarousel";
import ProductsSection from "@/components/ProductsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main>
      <HeroSection />
      <BestsellersCarousel />
      <ProductsSection />
      <TestimonialsSection />
      <AboutSection />
      <Footer />
    </main>
  );
};

export default Index;
