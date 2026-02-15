import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, BadgeCheck, User } from "lucide-react";
import { useTestimonials } from "@/hooks/useTestimonials";

const TestimonialsSection = () => {
  const { data: testimonials = [] } = useTestimonials(true);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => goNext(), 6000);
    return () => clearInterval(timer);
  }, [testimonials.length, current]);

  const goTo = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(idx);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goNext = () => goTo((current + 1) % testimonials.length);
  const goPrev = () => goTo((current - 1 + testimonials.length) % testimonials.length);

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Dark premium background */}
      <div className="absolute inset-0 luxury-gradient" />
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, hsl(var(--gold)) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="container mx-auto relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-primary/70 mb-3">Testimonials</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our <span className="gold-gradient-text">Customers</span> Say
          </h2>
          <div className="divider-gold max-w-xs mx-auto" />
        </div>

        {/* Carousel */}
        <div className="glass-card rounded-lg p-8 md:p-12 gold-glow relative">
          <div key={t.id} className="animate-fade-in text-center">
            {/* Photo */}
            <div className="w-20 h-20 rounded-full mx-auto mb-6 overflow-hidden border-2 border-primary/30">
              {t.customer_photo_url ? (
                <img src={t.customer_photo_url} alt={t.customer_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < t.rating ? "fill-primary text-primary" : "fill-muted text-muted"}`}
                />
              ))}
            </div>

            {/* Review text */}
            <blockquote className="font-body text-lg md:text-xl text-foreground/80 leading-relaxed mb-6 italic max-w-2xl mx-auto">
              "{t.review_text}"
            </blockquote>

            {/* Name + Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="font-heading text-lg font-bold text-foreground">{t.customer_name}</span>
              {t.is_verified_purchase && (
                <span className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <BadgeCheck className="w-3.5 h-3.5" /> Verified Purchase
                </span>
              )}
            </div>
          </div>

          {/* Navigation arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-muted transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-foreground/60 hover:text-primary hover:bg-muted transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
