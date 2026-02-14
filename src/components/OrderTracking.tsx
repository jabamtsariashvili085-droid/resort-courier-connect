import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, Star, Bike, Package, CheckCircle, Navigation } from 'lucide-react';

interface OrderTrackingProps {
  order: {
    id: string;
    type: string;
    status: string;
    from: string;
    to: string;
    price: number;
    date: string;
  };
  onClose: () => void;
}

const TRACKING_STEPS = [
  { key: 'confirmed', icon: Package },
  { key: 'pickedUp', icon: Bike },
  { key: 'onTheWay', icon: Navigation },
  { key: 'delivered', icon: CheckCircle },
];

const OrderTracking: React.FC<OrderTrackingProps> = ({ order, onClose }) => {
  const { t } = useI18n();
  const [currentStep, setCurrentStep] = useState(0);
  const [courierPosition, setCourierPosition] = useState(0); // 0-100 progress
  const [eta, setEta] = useState(12); // minutes

  // Map order status to initial step
  useEffect(() => {
    if (order.status === 'pending') setCurrentStep(0);
    else if (order.status === 'inProgress') setCurrentStep(1);
    else if (order.status === 'delivered') setCurrentStep(3);
  }, [order.status]);

  // Simulate courier movement
  useEffect(() => {
    if (order.status === 'delivered') {
      setCourierPosition(100);
      setEta(0);
      setCurrentStep(3);
      return;
    }

    const interval = setInterval(() => {
      setCourierPosition(prev => {
        const next = prev + Math.random() * 3 + 1;
        if (next >= 100) {
          clearInterval(interval);
          setCurrentStep(3);
          setEta(0);
          return 100;
        }
        // Update step based on progress
        if (next > 75) setCurrentStep(3);
        else if (next > 30) setCurrentStep(2);
        else if (next > 5) setCurrentStep(1);
        // Update ETA
        setEta(Math.max(1, Math.round(12 * (1 - next / 100))));
        return next;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [order.status]);

  const stepLabels = {
    confirmed: t.tracking.confirmed,
    pickedUp: t.tracking.pickedUp,
    onTheWay: t.tracking.onTheWay,
    delivered: t.tracking.delivered,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md glass-card-elevated rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="gradient-hero p-5 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground">
            <X className="w-5 h-5" />
          </button>
          <p className="text-primary-foreground/70 text-sm font-mono">#{order.id}</p>
          <h2 className="text-xl font-display font-bold text-primary-foreground mt-1">
            {t.tracking.title}
          </h2>
          {eta > 0 && (
            <div className="flex items-center gap-2 mt-3 bg-primary-foreground/15 rounded-lg px-3 py-2 w-fit">
              <Clock className="w-4 h-4 text-primary-foreground" />
              <span className="text-primary-foreground text-sm font-semibold">
                ~{eta} {t.tracking.minutes}
              </span>
            </div>
          )}
        </div>

        {/* Simulated Map */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {/* Simple route visualization */}
          <div className="absolute inset-0 flex items-center px-8">
            {/* Route line */}
            <div className="w-full h-1 bg-border rounded-full relative">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ background: 'var(--gradient-hero)' }}
                animate={{ width: `${courierPosition}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* From marker */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium bg-background/80 px-1.5 py-0.5 rounded max-w-[80px] truncate">
              {order.from}
            </span>
          </div>

          {/* Courier marker (animated) */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            animate={{ left: `${Math.max(12, Math.min(85, 6 + courierPosition * 0.82))}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg border-2 border-background"
            >
              <Bike className="w-5 h-5 text-accent-foreground" />
            </motion.div>
          </motion.div>

          {/* To marker */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground font-medium bg-background/80 px-1.5 py-0.5 rounded max-w-[80px] truncate">
              {order.to}
            </span>
          </div>

          {/* Grid pattern background */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
        </div>

        {/* Status Timeline */}
        <div className="p-5">
          <div className="space-y-0">
            {TRACKING_STEPS.map((step, i) => {
              const isActive = i <= currentStep;
              const isCurrent = i === currentStep;
              const StepIcon = step.icon;

              return (
                <div key={step.key} className="flex items-start gap-3">
                  {/* Connector line + icon */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: isCurrent ? [1, 1.15, 1] : 1,
                        backgroundColor: isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                      }}
                      transition={isCurrent ? { repeat: Infinity, duration: 2 } : {}}
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    >
                      <StepIcon className={`w-4 h-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </motion.div>
                    {i < TRACKING_STEPS.length - 1 && (
                      <div className={`w-0.5 h-8 ${i < currentStep ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                  {/* Label */}
                  <div className="pt-1">
                    <p className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stepLabels[step.key as keyof typeof stepLabels]}
                    </p>
                    {isCurrent && i < 3 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-xs text-primary mt-0.5"
                      >
                        {t.tracking.inProgress}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Courier Info */}
        <div className="px-5 pb-5">
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
                  <Bike className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">ნიკა ბ.</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-xs text-muted-foreground">4.9</span>
                  </div>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                <Phone className="w-4 h-4 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.order.total}</span>
            <span className="font-bold text-foreground text-lg">{order.price} {t.currency}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderTracking;
