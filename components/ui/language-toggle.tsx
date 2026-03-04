"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18nStore, type Language } from "@/lib/i18n"

const languages: { code: Language; name: string; flag: string }[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
]

export function LanguageToggle() {
    const { language, setLanguage } = useI18nStore()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return (
        <Button variant="ghost" size="icon" className="relative cursor-wait">
            <Globe className="h-[1.2rem] w-[1.2rem] opacity-50" />
        </Button>
    )

    const currentLanguage = languages.find((l) => l.code === language) || languages[0]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative overflow-hidden group"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center justify-center"
                    >
                        <Globe className="h-[1.2rem] w-[1.2rem] transition-transform duration-300 group-hover:rotate-12" />
                    </motion.div>
                    <span className="sr-only">Toggle language</span>

                    {/* Glow effect on hover */}
                    <motion.div
                        className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100"
                        transition={{ duration: 0.2 }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="glass-strong min-w-[140px]"
                sideOffset={8}
            >
                <AnimatePresence>
                    {languages.map((lang, index) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`flex items-center gap-3 cursor-pointer transition-colors ${language === lang.code
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-secondary"
                                }`}
                        >
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="text-lg"
                            >
                                {lang.flag}
                            </motion.span>
                            <motion.span
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                                className="font-medium"
                            >
                                {lang.name}
                            </motion.span>
                            {language === lang.code && (
                                <motion.div
                                    layoutId="language-indicator"
                                    className="ml-auto h-2 w-2 rounded-full bg-primary"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </DropdownMenuItem>
                    ))}
                </AnimatePresence>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
