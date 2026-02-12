import { useState } from "react";
import { Star, ShoppingBag, Minus, Plus, AlertTriangle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CountdownTimer from "./CountdownTimer";

import vitaminCImg from "@/assets/vitamin-c-serum.jpg";
import retinolImg from "@/assets/retinol-serum.jpg";
import hyaluronicImg from "@/assets/hyaluronic-serum.jpg";
import niacinamideImg from "@/assets/niacinamide-serum.jpg";
import salicylicImg from "@/assets/salicylic-serum.jpg";

const outOfStockProducts = [
{ id: "retinol", name: "Retinol Serum", price: 68, image: retinolImg, desc: "Advanced age-defying night renewal" },
{ id: "hyaluronic", name: "Hyaluronic Acid Serum", price: 58, image: hyaluronicImg, desc: "Deep hydration & plumping complex" },
{ id: "niacinamide", name: "Niacinamide Serum", price: 52, image: niacinamideImg, desc: "Pore-refining radiance booster" },
{ id: "salicylic", name: "Salicylic Acid Serum", price: 55, image: salicylicImg, desc: "Clarifying & smoothing treatment" }];


const ProductsSection = () => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: "vitamin-c",
        name: "Vitamin C Serum",
        price: 72,
        image: vitaminCImg
      });
    }
    setQuantity(1);
  };

  return (
    <section id="products" className="py-24 px-6">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-accent text-sm tracking-[0.4em] uppercase text-primary/70 mb-3">
            The Royal Collection
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-4">
            Our <span className="gold-gradient-text">Serums</span>
          </h2>
          <div className="divider-gold max-w-xs mx-auto" />
        </div>

        {/* Featured Product */}
        <div className="glass-card rounded-lg overflow-hidden mb-20 max-w-5xl mx-auto gold-glow">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative overflow-hidden bg-muted/30">
              <img

                alt="Vitamin C Serum - luxury skincare product"
                className="w-full h-full object-cover min-h-[400px] hover:scale-105 transition-transform duration-700"
                loading="lazy" src="/lovable-uploads/42d7bbf4-1c4e-4f9e-9be2-96489f626997.png" />

              <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-sm">
                Bestseller
              </div>
            </div>

            {/* Details */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <p className="font-accent text-xs tracking-[0.3em] uppercase text-primary/60 mb-2">
                Featured
              </p>
              <h3 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
                Vitamin C Serum
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) =>
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < 4 ? "fill-primary text-primary" : "fill-primary/30 text-primary/30"}`} />

                  )}
                </div>
                <span className="text-xs text-muted-foreground">(4.8 · 127 Reviews)</span>
              </div>

              <p className="text-foreground/60 font-body text-sm leading-relaxed mb-6">
                Infused with Ethyl ascorbic acid and rare botanical extracts from ancient royal gardens. This potent elixir brightens, firms, gentle on your skin and protects — revealing your skin's natural glow.
              
              </p>

              <p className="font-heading text-3xl font-bold text-primary mb-6">
                $72<span className="text-base text-muted-foreground font-body">.00</span>
              </p>

              {/* Urgency */}
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-primary animate-pulse-glow" />
                <span className="text-xs text-primary font-semibold tracking-wider uppercase">
                  Only Few Items Left — Hurry!
                </span>
              </div>

              <CountdownTimer />

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center border border-border rounded-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-foreground/60 hover:text-primary transition-colors">

                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-heading text-sm font-bold min-w-[40px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="px-3 py-2 text-foreground/60 hover:text-primary transition-colors">

                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="btn-luxury flex-1 flex items-center justify-center gap-2 py-3 rounded-sm text-sm tracking-[0.15em]">

                  <ShoppingBag className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="mb-8">
          <h3 className="font-heading text-xl text-foreground/50 text-center mb-8">
            ​More Products  
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {outOfStockProducts.map((product) =>
          <div
            key={product.id}
            className="glass-card rounded-lg overflow-hidden opacity-60 grayscale-[40%] group">

              <div className="relative overflow-hidden aspect-square">
                <img
                src={product.image}
                alt={`${product.name} - currently out of stock`}
                className="w-full h-full object-cover"
                loading="lazy" />

                <div className="absolute inset-0 bg-background/40" />
                <div className="absolute top-3 right-3 bg-muted text-muted-foreground text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm border border-border/50">
                  Out of Stock
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-heading text-base font-semibold text-foreground/60 mb-1">
                  {product.name}
                </h4>
                <p className="text-xs text-muted-foreground mb-3">{product.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg font-bold text-foreground/40">
                    ${product.price}
                  </span>
                  <button
                  disabled
                  className="text-xs font-body tracking-wider uppercase text-muted-foreground border border-border/30 px-3 py-1.5 rounded-sm cursor-not-allowed">

                    Sold Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default ProductsSection;