import React from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Package } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-foreground/5 border-t border-border py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold text-foreground">KurierGo</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">{t.footer.contact}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t.footer.terms}</a>
            <a href="#" className="hover:text-foreground transition-colors">{t.footer.privacy}</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 KurierGo. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
