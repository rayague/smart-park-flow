'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Car, MapPin } from 'lucide-react';

import { fetchJson } from '@/lib/api';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type SuggestionItem = {
  id: string;
  type: 'city' | 'district' | 'place' | 'parking';
  value: string;
  labelFr?: string;
  labelEn?: string;
  subtitleFr?: string;
  subtitleEn?: string;
  parkingId?: string;
  priceFr?: string;
  priceEn?: string;
  available?: number;
  hasEV?: boolean;
};

type SuggestionsResponse = {
  items: SuggestionItem[];
  query?: string;
};

type CommandBarSearchProps = {
  className?: string;
  initialValue?: string;
};

export default function CommandBarSearch({ className, initialValue }: CommandBarSearchProps) {
  const router = useRouter();
  const language = useAppStore((s) => s.language);
  const isMobile = useIsMobile();

  const overlayId = useId();
  const listboxId = useId();

  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const placeholders = useMemo(() => {
    if (language === 'fr') {
      return ['Adresse, quartier ou lieu', 'Ex : Gare de Lyon', 'Ex : Aéroport CDG', 'Ex : Centre-ville'];
    }
    return ['Address, neighborhood, or place', 'e.g. Gare de Lyon', 'e.g. CDG Airport', 'e.g. Downtown'];
  }, [language]);

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderFading, setPlaceholderFading] = useState(false);

  const canSuggest = useMemo(() => value.trim().length >= 2, [value]);
  const canShowTop = useMemo(() => value.trim().length < 2, [value]);

  const currentPlaceholder = placeholders[placeholderIndex] ?? '';

  const topSuggestions = useMemo<SuggestionItem[]>(() => {
    if (language === 'fr') {
      return [
        { id: 'city:Paris', type: 'city', value: 'Paris', labelFr: 'Paris', labelEn: 'Paris' },
        {
          id: 'place:fr:Gare de Lyon',
          type: 'place',
          value: 'Gare de Lyon',
          labelFr: 'Gare de Lyon',
          labelEn: 'Gare de Lyon',
          subtitleFr: 'Paris',
          subtitleEn: 'Paris',
        },
        {
          id: 'place:fr:Aéroport CDG',
          type: 'place',
          value: 'Aéroport CDG',
          labelFr: 'Aéroport CDG',
          labelEn: 'CDG Airport',
          subtitleFr: 'Paris',
          subtitleEn: 'Paris',
        },
      ];
    }

    return [
      { id: 'city:Paris', type: 'city', value: 'Paris', labelFr: 'Paris', labelEn: 'Paris' },
      {
        id: 'place:fr:Gare de Lyon',
        type: 'place',
        value: 'Gare de Lyon',
        labelFr: 'Gare de Lyon',
        labelEn: 'Gare de Lyon',
        subtitleFr: 'Paris',
        subtitleEn: 'Paris',
      },
      {
        id: 'place:fr:Aéroport CDG',
        type: 'place',
        value: 'Aéroport CDG',
        labelFr: 'Aéroport CDG',
        labelEn: 'CDG Airport',
        subtitleFr: 'Paris',
        subtitleEn: 'Paris',
      },
    ];
  }, [language]);

  const itemsForDropdown = useMemo(() => {
    return canShowTop ? topSuggestions : suggestions;
  }, [canShowTop, suggestions, topSuggestions]);

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const submit = (q?: string) => {
    const query = (q ?? value).trim();
    if (!query) return;
    close();
    router.push(`/parkings?query=${encodeURIComponent(query)}`);
  };

  const applySuggestion = (s: SuggestionItem) => {
    submit(s.value);
  };

  useEffect(() => {
    if (typeof initialValue !== 'string') return;
    if (focused) return;
    const next = initialValue.trim();
    if (!next) return;
    setValue(next);
  }, [focused, initialValue]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPlaceholderFading(true);
      window.setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % placeholders.length);
        setPlaceholderFading(false);
      }, 160);
    }, 3400);

    return () => window.clearInterval(id);
  }, [placeholders.length]);

  useEffect(() => {
    if (!canSuggest) {
      setSuggestions([]);
      setIsLoading(false);
      setHasSearched(false);
      if (focused) {
        setIsOpen(true);
        setActiveIndex(-1);
      } else {
        close();
      }
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    const id = window.setTimeout(async () => {
      try {
        const res = await fetchJson<SuggestionsResponse>(
          `/api/parkings/suggestions?query=${encodeURIComponent(value.trim())}`
        );
        if (cancelled) return;
        setSuggestions(Array.isArray(res.items) ? res.items : []);
        setIsOpen(true);
        setActiveIndex(-1);
        setHasSearched(true);
      } catch {
        if (cancelled) return;
        setSuggestions([]);
        setHasSearched(false);
        close();
      } finally {
        if (cancelled) return;
        setIsLoading(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [canSuggest, value]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!boxRef.current) return;
      if (!boxRef.current.contains(target)) {
        close();
        setFocused(false);
      }
    };

    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const activeId = activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined;
  const showEmptyState = canSuggest && hasSearched && !isLoading && suggestions.length === 0;

  return (
    <div ref={boxRef} className={cn('w-full', className)}>
      {focused && (
        <div
          id={overlayId}
          className="fixed inset-0 z-30 bg-black/20 transition-opacity"
          onMouseDown={(e) => {
            e.preventDefault();
            close();
            setFocused(false);
            inputRef.current?.blur();
          }}
        />
      )}

      <div className="relative z-40">
        <form
          className={cn(
            'relative w-full mx-auto max-w-[720px] rounded-[18px] transition-all duration-150 ease-out',
            'shadow-[0_18px_50px_-18px_rgba(0,0,0,0.35)]',
            focused ? 'scale-[1.02] shadow-[0_26px_70px_-26px_rgba(0,0,0,0.55)]' : 'scale-100'
          )}
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <div
            className={cn(
              'flex items-center gap-3 bg-card/90 backdrop-blur-xl border border-border/60',
              'h-[56px] sm:h-[64px] lg:h-[72px] rounded-[18px] px-4 sm:px-5',
              focused ? 'border-primary/30 ring-2 ring-primary/15' : 'ring-0'
            )}
          >
            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />

            <div className="relative flex-1">
              {value.length === 0 && (
                <div
                  aria-hidden
                  className={cn(
                    'pointer-events-none absolute inset-y-0 left-0 flex items-center',
                    'text-muted-foreground/80 select-none',
                    'transition-all duration-200',
                    placeholderFading ? 'opacity-0 translate-y-0.5' : 'opacity-100 translate-y-0'
                  )}
                >
                  <span className="text-[15px] sm:text-[16px]">{currentPlaceholder}</span>
                </div>
              )}

              <input
                ref={inputRef}
                type="text"
                value={value}
                onFocus={() => {
                  setFocused(true);
                  setIsOpen(true);
                  if (isMobile) {
                    window.setTimeout(() => {
                      inputRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }, 50);
                  }
                }}
                onBlur={() => {
                  window.setTimeout(() => {
                    setFocused(false);
                  }, 0);
                }}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    close();
                    return;
                  }

                  if (!isOpen) return;

                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setActiveIndex((idx) => Math.min(idx + 1, itemsForDropdown.length - 1));
                    return;
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setActiveIndex((idx) => Math.max(idx - 1, 0));
                    return;
                  }
                  if (e.key === 'Enter' && activeIndex >= 0 && itemsForDropdown[activeIndex]) {
                    e.preventDefault();
                    applySuggestion(itemsForDropdown[activeIndex]);
                  }
                }}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                aria-activedescendant={activeId}
                autoComplete="street-address"
                className={cn(
                  'w-full bg-transparent border-none outline-none',
                  'text-[15px] sm:text-[16px] font-medium text-foreground',
                  'placeholder:text-muted-foreground/70',
                  'caret-primary'
                )}
              />
            </div>

            {isLoading ? (
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
            ) : null}

            <button
              type="submit"
              disabled={!value.trim()}
              className={cn(
                'h-[44px] sm:h-[48px] px-4 sm:px-5 rounded-[14px] flex items-center gap-2',
                'gradient-primary text-primary-foreground font-semibold',
                'shadow-[0_10px_30px_-18px_rgba(59,130,246,0.7)]',
                'transition-all duration-150',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <span className="hidden sm:inline">{language === 'fr' ? 'Rechercher' : 'Search'}</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          {isOpen && (itemsForDropdown.length > 0 || showEmptyState) && (
            <div
              id={listboxId}
              role="listbox"
              className={cn(
                'absolute left-0 right-0 mt-3 overflow-hidden',
                'rounded-[18px] border border-border/60 bg-popover/95 backdrop-blur-xl',
                'shadow-[0_22px_70px_-35px_rgba(0,0,0,0.6)]'
              )}
            >
              <div className="max-h-[50vh] sm:max-h-96 overflow-y-auto">
                {itemsForDropdown.map((s, idx) => {
                  const label = language === 'fr' ? s.labelFr || s.value : s.labelEn || s.value;
                  const subtitle = language === 'fr' ? s.subtitleFr : s.subtitleEn;
                  const price = language === 'fr' ? s.priceFr : s.priceEn;

                  const metaParts: string[] = [];
                  if (s.type === 'parking') {
                    if (price) metaParts.push(language === 'fr' ? `À partir de ${price}` : `From ${price}`);
                    if (typeof s.available === 'number') {
                      metaParts.push(
                        language === 'fr'
                          ? `${s.available} place${s.available > 1 ? 's' : ''}`
                          : `${s.available} spot${s.available > 1 ? 's' : ''}`
                      );
                    }
                    if (s.hasEV) metaParts.push('EV');
                  }

                  const Icon = s.type === 'parking' ? Car : MapPin;

                  return (
                    <button
                      key={s.id}
                      id={`${listboxId}-opt-${idx}`}
                      role="option"
                      aria-selected={idx === activeIndex}
                      type="button"
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applySuggestion(s)}
                      className={cn(
                        'w-full text-left px-4 sm:px-5 py-4 flex items-start justify-between gap-4',
                        'transition-colors',
                        idx === activeIndex ? 'bg-primary/10' : 'hover:bg-muted/40'
                      )}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5 h-9 w-9 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{label}</div>
                          {(subtitle || metaParts.length > 0) && (
                            <div className="mt-1 text-sm text-muted-foreground truncate">
                              {subtitle ? subtitle : ''}
                              {subtitle && metaParts.length > 0 ? ' • ' : ''}
                              {metaParts.join(' • ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground flex-shrink-0 pt-1">
                        {s.type === 'parking'
                          ? language === 'fr'
                            ? 'Parking'
                            : 'Parking'
                          : s.type === 'district'
                            ? language === 'fr'
                              ? 'Quartier'
                              : 'District'
                            : s.type === 'city'
                              ? language === 'fr'
                                ? 'Ville'
                                : 'City'
                              : language === 'fr'
                                ? 'Lieu'
                                : 'Place'}
                      </div>
                    </button>
                  );
                })}

                {showEmptyState && (
                  <div className="px-4 sm:px-5 py-4 text-sm text-muted-foreground">
                    {language === 'fr' ? 'Aucun résultat' : 'No results'}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
