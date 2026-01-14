import { useAppStore } from '@/store/useAppStore';
import { translations, type TranslationKeys } from '@/i18n/translations';

export function useTranslation() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const t = translations[language] as TranslationKeys;

  return {
    t,
    language,
    setLanguage,
  };
}
