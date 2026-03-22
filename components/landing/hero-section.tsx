"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Search, MapPin, Building2, Car, X, Command, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TypingText } from "@/components/ui/typing-text"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock data for autocomplete
const MOCK_RESULTS = [
  { id: "1", type: "city", name: "Paris", sub: "France", icon: MapPin },
  { id: "2", type: "city", name: "Lyon", sub: "France", icon: MapPin },
  { id: "3", type: "city", name: "Marseille", sub: "France", icon: MapPin },
  { id: "4", type: "parking", name: "Parking Central Plazza", sub: "Paris, FR", icon: Building2 },
  { id: "5", type: "parking", name: "Etoile Park", sub: "Paris, FR", icon: Building2 },
  { id: "6", type: "parking", name: "Riviera Smart", sub: "Nice, FR", icon: Building2 },
  { id: "7", type: "location", name: "Tour Eiffel", sub: "Paris, FR", icon: MapPin },
  { id: "8", type: "location", name: "Gare de Lyon", sub: "Paris, FR", icon: MapPin },
]

import { LoadingOverlay } from "@/components/loading-overlay"
import { supabase } from "@/lib/supabase"

interface SearchResult {
  id: string
  type: 'city' | 'parking' | 'location'
  name: string
  sub: string
  icon: any
}

export function HeroSection() {
  const { t, language } = useTranslation()
  const [searchValue, setSearchValue] = React.useState("")
  const [showResults, setShowResults] = React.useState(false)
  const [filteredResults, setFilteredResults] = React.useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  const typingTexts = React.useMemo(() => [
    t.landing.typingTexts.smartParking,
    t.landing.typingTexts.evCharging,
    t.landing.typingTexts.urbanMobility,
    t.landing.typingTexts.easyBooking,
  ], [t, language])

  // Real-time search from Supabase
  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchValue.trim().length > 0) {
        setIsSearching(true)
        try {
          // Search in parkings table
          const { data, error } = await supabase
            .from('parkings')
            .select('id, name, address, city')
            .or(`name.ilike.%${searchValue}%,city.ilike.%${searchValue}%,address.ilike.%${searchValue}%`)
            .limit(8)

          if (error) throw error

          const results: SearchResult[] = data.map(item => ({
            id: item.id,
            type: 'parking',
            name: item.name,
            sub: `${item.address}, ${item.city}`,
            icon: Building2
          }))

          setFilteredResults(results)
          setShowResults(true)
        } catch (err) {
          console.error("Search error:", err)
          setFilteredResults([])
        } finally {
          setIsSearching(false)
        }
      } else {
        setFilteredResults([])
        setShowResults(false)
      }
    }, 300) // Debounce

    return () => clearTimeout(timer)
  }, [searchValue])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Stars Background is handled by StarrySkyWrapper in layout */}

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        <div className="flex flex-col items-center gap-12">
          {/* Headline and Typing Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-2"
          >
            <h1 className="font-sans text-5xl font-black leading-tight tracking-tight sm:text-7xl lg:text-8xl flex flex-col items-center">
              <span>{t.landing.heroTitle}</span>
              <div className="h-20 sm:h-28 flex items-center justify-center">
                <TypingText
                  key={language}
                  texts={typingTexts}
                  className="text-primary"
                />
              </div>
            </h1>
          </motion.div>

          {/* Large Search Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-3xl relative"
          >
            <div className={cn(
              "relative group flex items-center p-2 rounded-3xl glass backdrop-blur-2xl border-white/10 transition-all duration-500",
              showResults ? "rounded-b-none border-b-transparent shadow-2xl" : "shadow-xl hover:shadow-primary/20"
            )}>
              <div className="pl-6 flex items-center text-primary">
                <Search className="h-6 w-6" />
              </div>
              <Input
                value={searchValue}
                onChange={handleSearch}
                onFocus={() => searchValue.length > 0 && setShowResults(true)}
                placeholder={t.landing.heroSearchPlaceholder || "Find a city, an address or a parking name..."}
                className="h-16 bg-transparent border-0 focus-visible:ring-0 text-xl font-medium placeholder:text-muted-foreground/50 pl-4 pr-12"
              />
              {searchValue && (
                <button
                  onClick={() => { setSearchValue(""); setShowResults(false) }}
                  className="absolute right-20 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <X className="h-5 w-5" />}
                </button>
              )}
              <Button
                size="lg"
                className="h-14 rounded-2xl px-8 bg-linear-to-r from-primary to-accent glow-primary-sm hidden sm:flex"
              >
                {t.landing.findParking || "Find Parking"}
              </Button>
            </div>

            {/* Autocomplete Results */}
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 glass-strong border-t-0 border-white/10 rounded-b-3xl overflow-hidden shadow-2xl z-50 backdrop-blur-3xl"
                >
                  <div className="p-2 max-h-[400px] overflow-y-auto">
                    {filteredResults.length > 0 ? (
                      <div className="space-y-1">
                        {filteredResults.map((result) => (
                          <button
                            key={result.id}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group text-left"
                            onClick={() => {
                              setSearchValue(result.name)
                              setShowResults(false)
                            }}
                          >
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                              <result.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{result.name}</p>
                              <p className="text-sm text-muted-foreground">{result.sub}</p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                              <ArrowRight className="h-4 w-4 text-primary" />
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-12 text-center text-muted-foreground">
                        <Command className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No results found for "{searchValue}"</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Secondary stats or mini-links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8 text-sm text-muted-foreground font-medium"
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <span>12.4k active spots</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>450+ facilities</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
              <span>24/7 support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
