import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
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
  const { addToCart } = useCart();
  const { data: products } = useProducts();

  const bestsellers = products?.filter((p: any) => p.is_bestseller) ?? [];

  if (bestsellers.length === 0) return null;

  const getImage = (product: { name: string; image_url: string | null }) =>
    product.image_url || fallbackImages[product.name] || "/placeholder.svg";

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
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {bestsellers.map((product: any) => {
                const isAvailable = product.status === "in_stock" && product.stock_quantity > 0;
                return (
                  <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="glass-card rounded-lg overflow-hidden group h-full flex flex-col">
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={getImage(product)}
                          alt={`${product.name} - bestseller`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
                          ★ Bestseller
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h4 className="font-heading text-base font-semibold text-foreground mb-1">
                          {product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="font-heading text-lg font-bold text-primary">
                            ₹{Number(product.price).toFixed(0)}
                          </span>
                          <button
                            disabled={!isAvailable}
                            onClick={() =>
                              addToCart({
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                image: getImage(product),
                              })
                            }
                            className="btn-luxury flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {isAvailable ? "Add to Cart" : "Sold Out"}
                          </button>
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
