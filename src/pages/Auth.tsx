import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Package, Eye, EyeOff, User, Bike, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';

const Auth: React.FC = () => {
  const { t } = useI18n();
  const { signIn, signUp, user, userRole, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const isRegister = searchParams.get('mode') === 'register';
  const initialRole = searchParams.get('role') === 'courier' ? 'courier' : 'customer';
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'customer' | 'courier'>(initialRole);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const urlRole = searchParams.get('role') === 'courier' ? 'courier' : 'customer';
    setRole(urlRole);
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && userRole) {
      navigate(userRole === 'courier' ? '/courier-dashboard' : '/customer-dashboard');
    }
  }, [user, userRole, loading, navigate]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isRegister) {
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setSubmitting(false);
          return;
        }
        const { error } = await signUp(formData.email, formData.password, formData.fullName, formData.phone, role);
        if (error) {
          toast.error(error.message);
        } else {
          toast.success('Registration successful! Check your email.');
        }
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(error.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="glass-card-elevated rounded-2xl p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">
                {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
              </h1>
            </div>

            {/* Role selector */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">{t.auth.roleSelect}</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    role === 'customer'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{t.auth.asCustomer}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('courier')}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    role === 'courier'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border text-muted-foreground hover:border-primary/30'
                  }`}
                >
                  <Bike className="w-5 h-5" />
                  <span className="text-sm font-medium">{t.auth.asCourier}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t.auth.fullName}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.auth.email}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  required
                />
              </div>

              {isRegister && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t.auth.phone}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
              )}

              <div className="relative">
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  {t.auth.password}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {isRegister && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t.auth.confirmPassword}
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl gradient-hero text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity glow-emerald disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                {t.auth.submit}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground">
              {isRegister ? t.auth.hasAccount : t.auth.noAccount}{' '}
              <Link
                to={isRegister ? '/auth' : '/auth?mode=register'}
                className="text-primary font-medium hover:underline"
              >
                {isRegister ? t.auth.loginTitle : t.auth.registerTitle}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
