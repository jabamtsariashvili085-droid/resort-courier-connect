import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { motion } from 'framer-motion';
import { Package, Pill, ShoppingBag, MapPin, Truck, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import heroBg from '@/assets/hero-bg.jpg';

const Index: React.FC = () => {
  const { t } = useI18n();

  const services = [
    { icon: Package, title: t.services.parcels, desc: t.services.parcelsDesc },
    { icon: Pill, title: t.services.pharmacy, desc: t.services.pharmacyDesc },
    { icon: ShoppingBag, title: t.services.shopping, desc: t.services.shoppingDesc },
  ];

  const steps = [
    { icon: MapPin, title: t.howItWorks.step1, desc: t.howItWorks.step1Desc, num: '01' },
    { icon: Truck, title: t.howItWorks.step2, desc: t.howItWorks.step2Desc, num: '02' },
    { icon: CheckCircle, title: t.howItWorks.step3, desc: t.howItWorks.step3Desc, num: '03' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Resort delivery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/50" />
          <div className="absolute inset-0 gradient-hero opacity-60" />
        </div>

        <div className="relative container mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-display font-bold text-primary-foreground leading-tight"
            >
              {t.hero.title}
              <span className="block text-gradient-gold">{t.hero.subtitle}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-lg md:text-xl text-primary-foreground/80 max-w-lg"
            >
              {t.hero.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-8 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/auth?mode=register"
                className="px-8 py-4 text-lg font-semibold rounded-xl gradient-gold text-accent-foreground shadow-elevated hover:scale-105 transition-transform text-center"
              >
                {t.hero.cta}
              </Link>
              <Link
                to="/auth?mode=register&role=courier"
                className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-primary-foreground/30 text-primary-foreground backdrop-blur-sm hover:bg-primary-foreground/10 transition-colors text-center"
              >
                {t.hero.ctaSecondary}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating stats */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-10 right-10 hidden lg:block"
        >
          <div className="glass-card-elevated rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <Truck className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Deliveries / day</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">99.2%</p>
                <p className="text-xs text-muted-foreground">Satisfaction</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground">
              {t.services.title}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{t.services.subtitle}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass-card-elevated rounded-2xl p-8 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl gradient-hero flex items-center justify-center mb-6 group-hover:glow-emerald transition-shadow">
                  <service.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold text-foreground text-center mb-16"
          >
            {t.howItWorks.title}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-border" />

            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center relative"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-gold text-accent-foreground text-2xl font-bold mb-6 shadow-elevated relative z-10">
                  {step.num}
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              {t.hero.cta}
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-md mx-auto mb-8">
              {t.hero.description}
            </p>
            <Link
              to="/auth?mode=register"
              className="inline-block px-10 py-4 text-lg font-semibold rounded-xl gradient-gold text-accent-foreground shadow-elevated hover:scale-105 transition-transform"
            >
              {t.nav.register}
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
