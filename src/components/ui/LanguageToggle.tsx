import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';

export function LanguageToggle() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
      className="h-9 px-3 rounded-lg glass flex items-center justify-center gap-1.5 text-sm font-medium transition-colors hover:bg-muted"
      title={language === 'en' ? 'Switch to French' : 'Passer en anglais'}
    >
      <span className={language === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
      <span className="text-muted-foreground">/</span>
      <span className={language === 'fr' ? 'opacity-100' : 'opacity-50'}>FR</span>
    </motion.button>
  );
}
