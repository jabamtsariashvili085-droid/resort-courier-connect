import React, { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { motion } from 'framer-motion';
import { Package, Plus, Clock, CheckCircle, MapPin, User, Settings, LogOut, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const mockOrders = [
  { id: '1001', type: 'parcel', status: 'inProgress', from: 'თბილისი', to: 'ბათუმი', price: 15, date: '2026-02-10' },
  { id: '1002', type: 'pharmacy', status: 'delivered', from: 'აფთიაქი N1', to: 'სასტუმრო ვარდი', price: 8, date: '2026-02-09' },
  { id: '1003', type: 'shopping', status: 'pending', from: 'სუპერმარკეტი', to: 'კოტეჯი #12', price: 12, date: '2026-02-11' },
];

const CustomerDashboard: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'orders' | 'history' | 'profile' | 'settings'>('orders');

  const statusColors: Record<string, string> = {
    pending: 'bg-accent/20 text-accent-foreground',
    inProgress: 'bg-primary/10 text-primary',
    delivered: 'bg-emerald-glow/10 text-emerald-glow',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  const tabs = [
    { id: 'orders' as const, label: t.dashboard.myOrders, icon: Package },
    { id: 'history' as const, label: t.dashboard.history, icon: History },
    { id: 'profile' as const, label: t.dashboard.profile, icon: User },
    { id: 'settings' as const, label: t.dashboard.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="glass-card-elevated sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">KurierGo</span>
          </Link>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-display font-bold text-foreground">
            {t.dashboard.welcome}, <span className="text-gradient-gold">გიორგი</span>
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.dashboard.myOrders, value: '12', icon: Package },
            { label: t.dashboard.activeDeliveries, value: '2', icon: Clock },
            { label: t.dashboard.status.delivered, value: '10', icon: CheckCircle },
            { label: t.dashboard.earnings, value: `156 ${t.currency}`, icon: MapPin },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-elevated rounded-xl p-4"
            >
              <stat.icon className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'gradient-hero text-primary-foreground shadow-glow'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-card-elevated rounded-xl p-4 flex items-center gap-3 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
                <Plus className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-foreground">{t.dashboard.newOrder}</span>
            </motion.button>

            {mockOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-elevated rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">#{order.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                    {t.dashboard.status[order.status as keyof typeof t.dashboard.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{order.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{order.to}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{order.date}</span>
                  <span className="font-bold text-foreground">{order.price} {t.currency}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="glass-card-elevated rounded-xl p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">{t.dashboard.profile}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">გიორგი მელაძე</p>
                  <p className="text-sm text-muted-foreground">giorgi@example.com</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'history' || activeTab === 'settings') && (
          <div className="glass-card-elevated rounded-xl p-8 text-center text-muted-foreground">
            <p>{t.dashboard.noOrders}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
