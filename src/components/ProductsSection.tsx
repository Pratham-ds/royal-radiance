import { useState } from "react";
import { Star, ShoppingBag, Minus, Plus, AlertTriangle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CountdownTimer from "./CountdownTimer";
import { useProducts } from "@/hooks/useProducts";
import SubscribeBadge from "./SubscribeBadge";

import vitaminCImg from "@/assets/vitamin-c-serum.jpg";
import retinolImg from "@/assets/retinol-serum.jpg";
import hyaluronicImg from "@/assets/hyaluronic-serum.jpg";
import niacinamideImg from "@/assets/niacinamide-serum.jpg";
import salicylicImg from "@/assets/salicylic-serum.jpg";

// Fallback images by product name
const fallbackImages: Record<string, string> = {
  "Vitamin C Serum": vitaminCImg,
  "Retinol Serum": retinolImg,
  "Hyaluronic Acid Serum": hyaluronicImg,
  "Niacinamide Serum": niacinamideImg,
  "Salicylic Acid Serum": salicylicImg
};

const ProductsSection = () => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { data: products, isLoading } = useProducts();

  const featuredProduct = products?.find((p) => p.status === "in_stock");
  const otherProducts = products?.filter((p) => p.id !== featuredProduct?.id) ?? [];

  const getImage = (product: {name: string;image_url: string | null;}) =>
  product.image_url || fallbackImages[product.name] || "/placeholder.svg";

  const handleAddToCart = () => {
    if (!featuredProduct) return;
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: featuredProduct.id,
        name: featuredProduct.name,
        price: Number(featuredProduct.price),
        image: getImage(featuredProduct)
      });
    }
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <section id="products" className="py-24 px-6">
        <div className="container mx-auto text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </section>);

  }

  return (
    <section id="products" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-primary/70 mb-3">​  </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gold-gradient-text">Serums</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto" />
        </div>

        {/* Featured Product */}
        {featuredProduct &&
        <div className="glass-card rounded-lg overflow-hidden mb-20 max-w-5xl mx-auto gold-glow">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative overflow-hidden bg-muted/30">
                <img
                src={getImage(featuredProduct)}
                alt={`${featuredProduct.name} - luxury skincare product`}
                className="w-full h-full object-cover min-h-[400px] hover:scale-105 transition-transform duration-700"
                loading="lazy" />

                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                  Bestseller
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <p className="font-accent text-xs tracking-[0.3em] uppercase text-primary/60 mb-2">Featured</p>
                <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">{featuredProduct.name}</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) =>
                  <Star key={i} className={`w-4 h-4 ${i < 4 ? "fill-primary text-primary" : "fill-primary/30 text-primary/30"}`} />
                  )}
                  </div>
                  <span className="text-xs text-muted-foreground">(4.8 · 127 Reviews)</span>
                </div>
                <p className="text-foreground/60 font-body text-sm leading-relaxed mb-6">{featuredProduct.description}</p>
                <p className="font-heading text-3xl font-bold text-primary mb-6">
                  ₹{Number(featuredProduct.price).toFixed(0)}<span className="text-base text-muted-foreground font-body">.00</span>
                </p>

                {featuredProduct.urgency_message &&
              <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-primary animate-pulse-glow" />
                    <span className="text-xs text-primary font-semibold tracking-wider uppercase">{featuredProduct.urgency_message}</span>
                  </div>
              }

                {featuredProduct.countdown_minutes && <CountdownTimer minutes={featuredProduct.countdown_minutes} />}

                <div className="mt-4">
                  <SubscribeBadge productId={featuredProduct.id} productName={featuredProduct.name} price={Number(featuredProduct.price)} />
                </div>

                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center border border-border rounded-sm">
                    <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2 text-foreground/60 hover:text-primary transition-colors">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-heading text-sm font-bold min-w-[40px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity((q) => Math.min(10, q + 1))} className="px-3 py-2 text-foreground/60 hover:text-primary transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                  onClick={handleAddToCart}
                  disabled={featuredProduct.stock_quantity <= 0}
                  className="btn-luxury flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-sm tracking-[0.15em] disabled:opacity-50 disabled:cursor-not-allowed">

                    <ShoppingBag className="w-4 h-4" />
                    {featuredProduct.stock_quantity <= 0 ? "Sold Out" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        {/* Other Products */}
        {otherProducts.length > 0 &&
        <>
            <div className="mb-8">
              <h3 className="font-heading text-xl text-foreground/50 text-center mb-8">More Products</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {otherProducts.map((product) => {
              const isAvailable = product.status === "in_stock" && product.stock_quantity > 0;
              return (
                <div key={product.id} className={`glass-card rounded-lg overflow-hidden ${!isAvailable ? "opacity-60 grayscale-[40%]" : ""} group`}>
                    <div className="relative overflow-hidden aspect-square">
                      <img src={getImage(product)} alt={`{product.name}`} className="w-full h-full object-cover" loading="lazy" />
                      {!isAvailable && <div className="absolute inset-0 bg-background/40" />}
                      <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-border/50">
                        {product.status === "coming_soon" ? "Coming Soon" : !isAvailable ? "Out of Stock" : "Available"}
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-heading text-base font-semibold text-foreground/60 mb-1">{product.name}</h4>
                      <p className="text-xs text-muted-foreground mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-lg font-bold text-foreground/40">₹{Number(product.price).toFixed(0)}</span>
                        <button disabled={!isAvailable} className="text-xs font-body tracking-wider uppercase text-muted-foreground border border-border/30 px-3 py-1.5 rounded-sm cursor-not-allowed">
                          {isAvailable ? "Add to Cart" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          </>
        }
      </div>
    </section>);

};

export default ProductsSection;
