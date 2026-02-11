import React, { useState, useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Pill, ShoppingBag, MapPin, X, Zap, Scale, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type ServiceType = 'parcel' | 'pharmacy' | 'shopping';
type PackageSize = 'small' | 'medium' | 'large';

interface OrderFormProps {
  onClose: () => void;
  onOrderCreated: (order: any) => void;
}

const PRICING = {
  base: { parcel: 5, pharmacy: 3, shopping: 4 },
  distance: 2.5,
  size: { small: 0, medium: 3, large: 7 },
  urgent: 5,
};

const CreateOrderForm: React.FC<OrderFormProps> = ({ onClose, onOrderCreated }) => {
  const { t } = useI18n();

  const [service, setService] = useState<ServiceType | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [packageSize, setPackageSize] = useState<PackageSize>('small');
  const [weight, setWeight] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);

  const services = [
    { id: 'parcel' as ServiceType, icon: Package, label: t.services.parcels, desc: t.services.parcelsDesc },
    { id: 'pharmacy' as ServiceType, icon: Pill, label: t.services.pharmacy, desc: t.services.pharmacyDesc },
    { id: 'shopping' as ServiceType, icon: ShoppingBag, label: t.services.shopping, desc: t.services.shoppingDesc },
  ];

  const sizes: { id: PackageSize; label: string }[] = [
    { id: 'small', label: t.order.small },
    { id: 'medium', label: t.order.medium },
    { id: 'large', label: t.order.large },
  ];

  const priceBreakdown = useMemo(() => {
    if (!service) return null;
    const base = PRICING.base[service];
    const distance = PRICING.distance * (pickupAddress && deliveryAddress ? 1 + Math.random() * 3 : 0);
    const size = PRICING.size[packageSize];
    const urgent = isUrgent ? PRICING.urgent : 0;
    const total = base + Math.round(distance * 10) / 10 + size + urgent;
    return {
      base,
      distance: Math.round(distance * 10) / 10,
      size,
      urgent,
      total: Math.round(total * 10) / 10,
    };
  }, [service, pickupAddress, deliveryAddress, packageSize, isUrgent]);

  const handleSubmit = () => {
    if (!service || !pickupAddress.trim() || !deliveryAddress.trim()) return;

    const newOrder = {
      id: String(Math.floor(1000 + Math.random() * 9000)),
      type: service,
      status: 'pending',
      from: pickupAddress.trim(),
      to: deliveryAddress.trim(),
      price: priceBreakdown?.total || 0,
      date: new Date().toISOString().split('T')[0],
    };

    onOrderCreated(newOrder);
    toast({ title: t.order.orderPlaced, description: `#${newOrder.id} — ${newOrder.price} ${t.currency}` });
    onClose();
  };

  const canProceedStep1 = service !== null;
  const canProceedStep2 = pickupAddress.trim().length > 0 && deliveryAddress.trim().length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card-elevated rounded-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">{t.order.createTitle}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= s ? 'gradient-hero text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 transition-all ${step > s ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Service */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground mb-3">{t.order.selectService}</p>
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setService(s.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    service === s.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/30'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    service === s.id ? 'gradient-hero' : 'bg-muted'
                  }`}>
                    <s.icon className={`w-6 h-6 ${service === s.id ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </button>
              ))}
              <button
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 rounded-xl gradient-hero text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Addresses */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  <MapPin className="w-4 h-4 inline mr-1 text-primary" />
                  {t.order.pickupAddress}
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder={t.order.pickupPlaceholder}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  <MapPin className="w-4 h-4 inline mr-1 text-accent" />
                  {t.order.deliveryAddress}
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder={t.order.deliveryPlaceholder}
                  maxLength={200}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">{t.order.notes}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.order.notesPlaceholder}
                  maxLength={500}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium">{t.order.cancel}</button>
                <button
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 rounded-xl gradient-hero text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Details & Price */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {/* Package size */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">{t.order.packageSize}</label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setPackageSize(s.id)}
                      className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                        packageSize === s.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
                  <Scale className="w-4 h-4 text-primary" />
                  {t.order.weight}
                </label>
                <input
                  type="number"
                  min="0.1"
                  max="50"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>

              {/* Urgent toggle */}
              <button
                type="button"
                onClick={() => setIsUrgent(!isUrgent)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  isUrgent ? 'border-accent bg-accent/10' : 'border-border hover:border-accent/30'
                }`}
              >
                <Zap className={`w-5 h-5 ${isUrgent ? 'text-accent' : 'text-muted-foreground'}`} />
                <span className={`font-medium ${isUrgent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {t.order.urgent}
                </span>
                <span className="ml-auto text-sm font-bold text-accent">+{PRICING.urgent} {t.currency}</span>
              </button>

              {/* Price breakdown */}
              {priceBreakdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-muted/50 border border-border p-4 space-y-2"
                >
                  <p className="text-sm font-semibold text-foreground mb-3">{t.order.estimatedPrice}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.order.baseFee}</span>
                    <span className="text-foreground">{priceBreakdown.base} {t.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.order.distanceFee}</span>
                    <span className="text-foreground">{priceBreakdown.distance} {t.currency}</span>
                  </div>
                  {priceBreakdown.size > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.order.sizeFee}</span>
                      <span className="text-foreground">+{priceBreakdown.size} {t.currency}</span>
                    </div>
                  )}
                  {priceBreakdown.urgent > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t.order.urgentFee}</span>
                      <span className="text-accent font-medium">+{priceBreakdown.urgent} {t.currency}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-foreground">{t.order.total}</span>
                    <span className="text-xl font-bold text-gradient-gold">{priceBreakdown.total} {t.currency}</span>
                  </div>
                </motion.div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground font-medium">{t.order.cancel}</button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3.5 rounded-xl gradient-gold text-accent-foreground font-bold text-lg shadow-elevated hover:scale-[1.02] transition-transform"
                >
                  {t.order.placeOrder}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default CreateOrderForm;
