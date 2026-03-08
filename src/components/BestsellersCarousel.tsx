import { useState } from "react";
import { ShoppingBag, Minus, Plus, AlertTriangle, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import CountdownTimer from "./CountdownTimer";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import vitaminCImg from "@/assets/vitamin-c-serum.jpg";
import retinolImg from "@/assets/retinol-serum.jpg";
import hyaluronicImg from "@/assets/hyaluronic-serum.jpg";
import niacinamideImg from "@/assets/niacinamide-serum.jpg";
import salicylicImg from "@/assets/salicylic-serum.jpg";

const fallbackImages: Record<string, string> = {
  "Vitamin C Serum": vitaminCImg,
  "Retinol Serum": retinolImg,
  "Hyaluronic Acid Serum": hyaluronicImg,
  "Niacinamide Serum": niacinamideImg,
  "Salicylic Acid Serum": salicylicImg,
};

const BestsellersCarousel = () => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { addToCart } = useCart();
  const { data: products } = useProducts();

  const bestsellers = products?.filter((p: any) => p.is_bestseller) ?? [];

  if (bestsellers.length === 0) return null;

  const getImage = (product: { name: string; image_url: string | null }) =>
    product.image_url || fallbackImages[product.name] || "/placeholder.svg";

  const getQty = (id: string) => quantities[id] || 1;
  const setQty = (id: string, val: number) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Math.min(10, val)) }));

  const handleAddToCart = (product: any) => {
    const qty = getQty(product.id);
    for (let i = 0; i < qty; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: getImage(product),
      });
    }
    setQty(product.id, 1);
  };

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-primary/70 mb-3">
            ★ Curated Picks
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gold-gradient-text">Bestsellers</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto" />
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel opts={{ align: "center", loop: true }} className="w-full">
            <CarouselContent>
              {bestsellers.map((product: any) => {
                const isAvailable = product.status === "in_stock" && product.stock_quantity > 0;
                const qty = getQty(product.id);
                return (
                  <CarouselItem key={product.id} className="basis-full">
                    <div className="glass-card rounded-lg overflow-hidden gold-glow">
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="relative overflow-hidden bg-muted/30">
                          <img
                            src={getImage(product)}
                            alt={`${product.name} - bestseller`}
                            className="w-full h-full object-cover min-h-[400px] hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Bestseller
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <p className="font-accent text-xs tracking-[0.3em] uppercase text-primary/60 mb-2">
                            Bestseller
                          </p>
                          <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < 4 ? "fill-primary text-primary" : "fill-primary/30 text-primary/30"}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">(4.8 · 127 Reviews)</span>
                          </div>

                          <p className="text-foreground/60 font-body text-sm leading-relaxed mb-6">
                            {product.description}
                          </p>

                          <p className="font-heading text-3xl font-bold text-primary mb-6">
                            ₹{Number(product.price).toFixed(0)}
                            <span className="text-base text-muted-foreground font-body">.00</span>
                          </p>

                          {product.urgency_message && (
                            <div className="flex items-center gap-2 mb-4">
                              <AlertTriangle className="w-4 h-4 text-primary animate-pulse-glow" />
                              <span className="text-xs text-primary font-semibold tracking-wider uppercase">
                                {product.urgency_message}
                              </span>
                            </div>
                          )}

                          {product.countdown_minutes && (
                            <CountdownTimer minutes={product.countdown_minutes} />
                          )}

                          <div className="flex items-center gap-4 mt-6">
                            <div className="flex items-center border border-border rounded-sm">
                              <button
                                onClick={() => setQty(product.id, qty - 1)}
                                className="px-3 py-2 text-foreground/60 hover:text-primary transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-heading text-sm font-bold min-w-[40px] text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => setQty(product.id, qty + 1)}
                                className="px-3 py-2 text-foreground/60 hover:text-primary transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              disabled={!isAvailable}
                              className="btn-luxury flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-sm tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              {isAvailable ? "Add to Cart" : "Sold Out"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12 border-primary/30 text-primary hover:bg-primary/10" />
            <CarouselNext className="hidden md:flex -right-12 border-primary/30 text-primary hover:bg-primary/10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BestsellersCarousel;
