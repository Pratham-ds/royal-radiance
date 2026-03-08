import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-6 max-w-3xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <h1 className="font-heading text-3xl md:text-4xl font-bold gold-gradient-text mb-8">Refund & Cancellation Policy</h1>

        <div className="space-y-8 text-sm text-foreground/80 leading-relaxed mb-16">
          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">1. Cancellation Policy</h2>
            <p>Orders can be cancelled within 12 hours of placing them, provided they have not already been dispatched. To cancel an order, please contact us through the Contact page or email us with your order ID. Once an order has been shipped, it cannot be cancelled.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">2. Return Eligibility</h2>
            <p>We accept returns within 7 days of delivery under the following conditions:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-foreground/70">
              <li>The product is unused, unopened, and in its original packaging.</li>
              <li>The product was damaged or defective upon arrival.</li>
              <li>The wrong product was delivered.</li>
            </ul>
            <p className="mt-2">Skincare products that have been opened or used cannot be returned due to hygiene reasons.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">3. How to Initiate a Return</h2>
            <p>To request a return, contact us via the Contact page with your order ID, the reason for return, and photos of the product (if damaged). Our team will review your request and respond within 2 business days.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">4. Refund Process</h2>
            <p>Once we receive and inspect the returned product, we will notify you of the approval or rejection of your refund. Approved refunds will be processed within 5–7 business days to the original payment method. Shipping charges are non-refundable.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">5. Exchanges</h2>
            <p>We currently do not offer direct exchanges. If you wish to exchange a product, please initiate a return and place a new order for the desired item.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">6. Damaged or Defective Products</h2>
            <p>If you receive a damaged or defective product, please contact us within 48 hours of delivery with photographs. We will arrange a free return pickup and send a replacement or issue a full refund at your preference.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">7. Non-Returnable Items</h2>
            <ul className="list-disc list-inside space-y-1 text-foreground/70">
              <li>Products purchased during promotional sales or with discount codes (unless defective).</li>
              <li>Gift cards or digital vouchers.</li>
              <li>Products marked as "Final Sale."</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">8. Contact Us</h2>
            <p>For any questions regarding returns, refunds, or cancellations, please reach out through our <a href="/contact" className="text-primary hover:underline">Contact page</a>.</p>
          </section>

          <p className="text-muted-foreground text-xs">Last updated: March 2026</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RefundPolicy;
