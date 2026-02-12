import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="footer" className="border-t border-border/30 pt-16 pb-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="font-heading text-xl font-bold gold-gradient-text tracking-widest">
              MEDIVAL KEEPS
            </span>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Luxury skincare rooted in medieval botanical traditions. Crafted for radiance, designed for royalty.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-[0.2em] uppercase text-foreground/70 mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li><a href="#products" className="text-xs text-muted-foreground hover:text-primary transition-colors">Collections</a></li>
              <li><a href="#products" className="text-xs text-muted-foreground hover:text-primary transition-colors">Bestsellers</a></li>
              <li><a href="#products" className="text-xs text-muted-foreground hover:text-primary transition-colors">New Arrivals</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-[0.2em] uppercase text-foreground/70 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading text-xs font-bold tracking-[0.2em] uppercase text-foreground/70 mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Twitter / X</a></li>
              <li><a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">Facebook</a></li>
              <li><Link to="/login" className="text-xs text-muted-foreground hover:text-primary transition-colors">Customer Login</Link></li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mb-6" />
        <p className="text-center text-[10px] text-muted-foreground tracking-widest uppercase">
          © 2026 Medival Keeps. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
