import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters required.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords are the same.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      navigate("/login");
    }
  };

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 luxury-gradient">
        <div className="w-full max-w-md text-center">
          <Link to="/" className="font-heading text-3xl font-bold gold-gradient-text tracking-widest">
            MEDIVAL
          </Link>
          <div className="glass-card rounded-lg p-8 md:p-10 gold-glow mt-10">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Invalid Link</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/login" className="btn-luxury px-8 py-3 rounded-sm text-sm tracking-[0.2em]">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 luxury-gradient">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link to="/" className="font-heading text-3xl font-bold gold-gradient-text tracking-widest">
            MEDIVAL
          </Link>
        </div>

        <div className="glass-card rounded-lg p-8 md:p-10 gold-glow">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-6 text-center">
            Set New Password
          </h2>

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="block text-xs font-body tracking-wider uppercase text-foreground/60 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-muted/50 border border-border/50 rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-body tracking-wider uppercase text-foreground/60 mb-2">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-muted/50 border border-border/50 rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-luxury w-full py-3.5 rounded-sm text-sm tracking-[0.2em] gold-glow disabled:opacity-50">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/login" className="text-primary hover:text-primary/80 transition-colors font-semibold">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
