import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-heading text-3xl md:text-4xl font-bold gold-gradient-text mb-8">Terms & Conditions</h1>

        <div className="space-y-8 text-sm text-foreground/80 leading-relaxed mb-16">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>Welcome to Medival. By accessing or using our website and purchasing our products, you agree to be bound by these Terms & Conditions. Please read them carefully before placing an order.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">2. Eligibility</h2>
            <p>You must be at least 18 years of age to make a purchase on our website. By placing an order, you confirm that the information you provide is accurate and complete.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">3. Products & Pricing</h2>
            <p>All product descriptions, images, and prices are subject to change without notice. We make every effort to display colours and images accurately, but we cannot guarantee that your device's display will reflect the actual product. Prices are listed in INR and are inclusive of applicable taxes unless stated otherwise.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">4. Orders & Payment</h2>
            <p>Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment must be completed at the time of order via the available payment methods. Orders are confirmed only after successful payment processing.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">5. Shipping & Delivery</h2>
            <p>We aim to dispatch orders within 2–3 business days. Delivery timelines may vary based on your location and are estimated, not guaranteed. Medival is not liable for delays caused by shipping carriers or unforeseen circumstances.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">6. Intellectual Property</h2>
            <p>All content on this website — including text, graphics, logos, images, and software — is the property of Medival and protected by intellectual property laws. You may not reproduce, distribute, or use any content without prior written consent.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">7. User Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account. Medival reserves the right to suspend or terminate accounts that violate these terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
            <p>Medival shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the amount paid for the product in question.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">9. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in the company's registered city.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">10. Changes to Terms</h2>
            <p>We reserve the right to update these Terms & Conditions at any time. Changes will be posted on this page with an updated effective date. Continued use of the website constitutes acceptance of the revised terms.</p>
          </section>

          <p className="text-muted-foreground text-xs">Last updated: March 2026</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
