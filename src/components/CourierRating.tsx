import React, { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { motion } from 'framer-motion';
import { Star, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface CourierRatingProps {
  orderId: string;
  courierName: string;
  onClose: () => void;
}

const CourierRating: React.FC<CourierRatingProps> = ({ orderId, courierName, onClose }) => {
  const { t } = useI18n();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    setSubmitted(true);
    toast(t.rating.thankYou, { description: t.rating.submitted });
    setTimeout(onClose, 1800);
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
        className="w-full max-w-sm glass-card-elevated rounded-2xl overflow-hidden"
      >
        {submitted ? (
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-4"
            >
              <Star className="w-8 h-8 text-accent-foreground fill-accent-foreground" />
            </motion.div>
            <h3 className="text-xl font-display font-bold text-foreground">{t.rating.thankYou}</h3>
            <p className="text-sm text-muted-foreground mt-2">{t.rating.submitted}</p>
          </div>
        ) : (
          <>
            <div className="gradient-hero p-5 relative">
              <button onClick={onClose} className="absolute top-4 right-4 text-primary-foreground/80 hover:text-primary-foreground">
                <X className="w-5 h-5" />
              </button>
              <p className="text-primary-foreground/70 text-sm font-mono">#{orderId}</p>
              <h2 className="text-xl font-display font-bold text-primary-foreground mt-1">
                {t.rating.title}
              </h2>
              <p className="text-primary-foreground/80 text-sm mt-1">{courierName}</p>
            </div>

            <div className="p-5 space-y-5">
              {/* Stars */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoveredStar || rating)
                          ? 'text-accent fill-accent'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm font-medium text-foreground"
                >
                  {t.rating.labels[rating - 1]}
                </motion.p>
              )}

              {/* Comment */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.rating.commentPlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted text-foreground text-sm placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={300}
                />
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={rating === 0}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed gradient-hero text-primary-foreground shadow-glow"
              >
                {t.rating.submit}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CourierRating;
