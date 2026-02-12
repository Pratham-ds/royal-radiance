const AboutSection = () => {
  return (
    <section id="about" className="py-24 px-6">
      <div className="container mx-auto max-w-3xl text-center">
        <p className="font-accent text-sm tracking-[0.4em] uppercase text-primary/70 mb-3">
          Our Heritage
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
          Born of <span className="gold-gradient-text">Royal Legacy</span>
        </h2>
        <div className="divider-gold max-w-xs mx-auto mb-8" />
        <p className="font-body text-foreground/50 leading-relaxed text-sm md:text-base mb-6">
          Medival draws from ancient botanical manuscripts and royal apothecary traditions, blending time-honored ingredients with cutting-edge dermatological science. Each serum is a testament to centuries of beauty wisdom — meticulously formulated, ethically sourced, and crafted for those who demand nothing less than excellence.
        


        </p>
        <p className="font-accent text-primary/60 italic text-lg">
          "Where heritage meets innovation, true beauty reigns."
        </p>
      </div>
    </section>);

};

export default AboutSection;