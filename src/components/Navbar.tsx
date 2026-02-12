import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, User, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ?
      "glass-card border-b border-border/30 py-3" :
      "bg-transparent py-5"}`
      }>

      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-bold gold-gradient-text tracking-widest text-orange-200">
            
            
            
            
            
            MEDIVAL
          
          
           
           
           
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#products" className="text-sm font-body tracking-wider text-foreground/70 hover:text-primary transition-colors duration-300 uppercase">
            Collections
          </a>
          <a href="#about" className="text-sm font-body tracking-wider text-foreground/70 hover:text-primary transition-colors duration-300 uppercase">
            About
          </a>
          <a href="#footer" className="text-sm font-body tracking-wider text-foreground/70 hover:text-primary transition-colors duration-300 uppercase">
            Contact
          </a>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-foreground/70 hover:text-primary transition-colors duration-300">
            <User className="w-5 h-5" />
          </Link>
          <button onClick={openCart} className="relative text-foreground/70 hover:text-primary transition-colors duration-300">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount}
              </span>}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground/70 hover:text-primary transition-colors">

            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen &&
      <div className="md:hidden glass-card mt-2 mx-4 rounded-lg p-6 animate-fade-in">
          <div className="flex flex-col gap-4">
            <a href="#products" onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wider text-foreground/70 hover:text-primary transition-colors uppercase">
              Collections
            </a>
            <a href="#about" onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wider text-foreground/70 hover:text-primary transition-colors uppercase">
              About
            </a>
            <a href="#footer" onClick={() => setMobileOpen(false)} className="text-sm font-body tracking-wider text-foreground/70 hover:text-primary transition-colors uppercase">
              Contact
            </a>
          </div>
        </div>
      }
    </nav>);

};

export default Navbar;