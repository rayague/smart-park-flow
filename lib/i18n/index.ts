'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { en, type Translations } from './locales/en'
import { fr } from './locales/fr'

export type Language = 'en' | 'fr'

const translations: Record<Language, Translations> = {
    en,
    fr,
}

interface I18nState {
    language: Language
    isChangingLanguage: boolean
    setLanguage: (lang: Language) => void
    setIsChangingLanguage: (changing: boolean) => void
    t: Translations
}

export const useI18nStore = create<I18nState>()(
    persist(
        (set, get) => ({
            language: 'en',
            isChangingLanguage: false,
            setLanguage: (lang) => {
                set({ isChangingLanguage: true })
                // Small delay to trigger loading animation
                setTimeout(() => {
                    set({ language: lang, t: translations[lang] })
                    setTimeout(() => {
                        set({ isChangingLanguage: false })
                    }, 800)
                }, 100)
            },
            setIsChangingLanguage: (changing) => set({ isChangingLanguage: changing }),
            t: translations.en,
        }),
        {
            name: 'language-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.t = translations[state.language]
                }
            },
        }
    )
)

// Hook for easy access to translations
export function useTranslation() {
    const { t, language, setLanguage, isChangingLanguage } = useI18nStore()
    return { t, language, setLanguage, isChangingLanguage }
}

// Helper to get nested translation values
export function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const keys = path.split('.')
    let value: unknown = obj

    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = (value as Record<string, unknown>)[key]
        } else {
            return path // Return the path if not found
        }
    }

    return typeof value === 'string' ? value : path
}
