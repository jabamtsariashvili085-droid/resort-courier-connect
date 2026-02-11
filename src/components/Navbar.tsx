import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { Package, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { t } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: t.nav.home },
    { to: '/auth', label: t.nav.login },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card-elevated">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-hero flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            KurierGo
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.to
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link
            to="/auth?mode=register"
            className="px-4 py-2 text-sm font-semibold rounded-lg gradient-hero text-primary-foreground transition-all hover:opacity-90 glow-emerald"
          >
            {t.nav.register}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card-elevated border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {item.label}
                </Link>
              ))}
              <LanguageSwitcher />
              <Link
                to="/auth?mode=register"
                onClick={() => setMobileOpen(false)}
                className="px-4 py-2 text-sm font-semibold rounded-lg gradient-hero text-primary-foreground text-center"
              >
                {t.nav.register}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
