import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Package, Bike, Clock, CheckCircle, MapPin, User, Settings, LogOut, History, DollarSign, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const mockDeliveries = [
  { id: '2001', type: 'parcel', status: 'inProgress', from: 'ცენტრალური ფოსტა', to: 'სასტუმრო რივიერა', price: 12, date: '2026-02-11', distance: '2.3 km' },
  { id: '2002', type: 'pharmacy', status: 'pending', from: 'აფთიაქი PSP', to: 'ვილა #7', price: 6, date: '2026-02-11', distance: '1.1 km' },
  { id: '2003', type: 'shopping', status: 'delivered', from: 'გუდვილი', to: 'აპარტამენტი 305', price: 10, date: '2026-02-10', distance: '3.5 km' },
];

const CourierDashboard: React.FC = () => {
  const { t } = useI18n();
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'deliveries' | 'earnings' | 'profile' | 'settings'>('deliveries');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const statusColors: Record<string, string> = {
    pending: 'bg-accent/20 text-accent-foreground',
    inProgress: 'bg-primary/10 text-primary',
    delivered: 'bg-emerald-glow/10 text-emerald-glow',
    cancelled: 'bg-destructive/10 text-destructive',
  };

  const tabs = [
    { id: 'deliveries' as const, label: t.dashboard.activeDeliveries, icon: Bike },
    { id: 'earnings' as const, label: t.dashboard.earnings, icon: DollarSign },
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
            {/* Online/Offline toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isOnline
                  ? 'gradient-hero text-primary-foreground glow-emerald'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isOnline ? '● Online' : '○ Offline'}
            </button>
            <LanguageSwitcher />
            <button onClick={() => signOut()} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-5 h-5" />
            </button>
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
            {t.dashboard.welcome}, <span className="text-gradient-gold">{profile?.full_name || user?.email}</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            <Bike className="w-4 h-4 inline mr-1" />
            {t.auth.asCourier}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: t.dashboard.activeDeliveries, value: '3', icon: Clock },
            { label: t.dashboard.status.delivered, value: '47', icon: CheckCircle },
            { label: t.dashboard.earnings, value: `892 ${t.currency}`, icon: DollarSign },
            { label: 'Rating', value: '4.9 ★', icon: User },
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
        {activeTab === 'deliveries' && (
          <div className="space-y-4">
            {mockDeliveries.map((delivery, i) => (
              <motion.div
                key={delivery.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card-elevated rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">#{delivery.id}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status]}`}>
                    {t.dashboard.status[delivery.status as keyof typeof t.dashboard.status]}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{delivery.from}</span>
                  <span className="text-muted-foreground">→</span>
                  <span>{delivery.to}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{delivery.distance}</span>
                    <span className="text-xs text-muted-foreground">{delivery.date}</span>
                  </div>
                  <span className="font-bold text-foreground">{delivery.price} {t.currency}</span>
                </div>
                {delivery.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 py-2 rounded-lg gradient-hero text-primary-foreground text-sm font-medium">
                      Accept
                    </button>
                    <button className="flex-1 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                      Decline
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="glass-card-elevated rounded-xl p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-6">{t.dashboard.earnings}</h3>
            <div className="text-center py-8">
              <p className="text-5xl font-bold text-foreground">892 {t.currency}</p>
              <p className="text-muted-foreground mt-2">თებერვალი 2026</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-lg font-bold text-foreground">47</p>
                <p className="text-xs text-muted-foreground">{t.dashboard.status.delivered}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-lg font-bold text-foreground">19 {t.currency}</p>
                <p className="text-xs text-muted-foreground">Avg/order</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <p className="text-lg font-bold text-foreground">4.9 ★</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="glass-card-elevated rounded-xl p-6">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">{t.dashboard.profile}</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center">
                <Bike className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{profile?.full_name || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-primary font-medium mt-1">{t.auth.asCourier}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card-elevated rounded-xl p-8 text-center text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
            <p>{t.dashboard.settings}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourierDashboard;
