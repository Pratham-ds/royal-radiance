import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Luxury skincare collection on emerald velvet"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <p
          className="font-accent text-sm md:text-base tracking-[0.4em] uppercase text-primary/80 mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          The Royal Collection
        </p>
        <h1
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <span className="gold-gradient-text">Ancient Wisdom,</span>
          <br />
          <span className="text-foreground">Modern Radiance</span>
        </h1>
        <p
          className="font-body text-foreground/60 text-base md:text-lg max-w-xl mx-auto mb-10 opacity-0 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          Crafted with centuries-old botanical secrets and modern science.
          Elevate your skincare ritual to royalty.
        </p>
        <div
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          <a
            href="#products"
            className="btn-luxury inline-block px-10 py-4 rounded-sm text-sm tracking-[0.2em] gold-glow"
          >
            Explore the Collection
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 animate-fade-in" style={{ animationDelay: "1.2s" }}>
        <div className="w-px h-16 bg-gradient-to-b from-primary/60 to-transparent mx-auto mb-2" />
        <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-primary/50">Scroll</p>
      </div>
    </section>
  );
};

export default HeroSection;
