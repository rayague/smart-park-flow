"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Calendar as CalendarIcon, Clock, ChevronRight } from "lucide-react"
import { format, addHours, isSameDay } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n"
import { useBookingStore } from "@/lib/store"

export function BookingDateTimePicker() {
    const { t } = useTranslation()
    const {
        selectedDate,
        setSelectedDate,
        startTime,
        setStartTime,
        endTime,
        setEndTime
    } = useBookingStore()

    // Generate time slots (24h format, 30min intervals)
    const timeSlots = React.useMemo(() => {
        const slots = []
        for (let i = 0; i < 24; i++) {
            for (let j = 0; j < 60; j += 30) {
                const hour = i.toString().padStart(2, "0")
                const minute = j.toString().padStart(2, "0")
                slots.push(`${hour}:${minute}`)
            }
        }
        return slots
    }, [])

    // Calculate duration
    const duration = React.useMemo(() => {
        if (!startTime || !endTime) return 0
        const [startH, startM] = startTime.split(":").map(Number)
        const [endH, endM] = endTime.split(":").map(Number)
        let diff = (endH * 60 + endM) - (startH * 60 + startM)
        if (diff < 0) diff += 24 * 60 // Handle overnight
        return diff / 60
    }, [startTime, endTime])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            <div>
                <h2 className="font-serif text-2xl font-bold mb-2">
                    {t.booking.dateTime.title}
                </h2>
                <p className="text-muted-foreground">
                    Select when you want to park
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Date Selection */}
                <div className="space-y-4">
                    <label className="text-sm font-medium">{t.booking.dateTime.date}</label>
                    <div className="rounded-2xl glass p-4">
                        <Calendar
                            mode="single"
                            selected={selectedDate || undefined}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                            className="rounded-md border-0"
                            classNames={{
                                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                                day_today: "bg-secondary text-accent-foreground",
                            }}
                        />
                    </div>
                </div>

                {/* Time Selection */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-sm font-medium">{t.booking.dateTime.startTime}</label>
                        <Select value={startTime} onValueChange={setStartTime}>
                            <SelectTrigger className="h-12 glass">
                                <SelectValue placeholder="Select start time" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map((time) => (
                                    <SelectItem key={`start-${time}`} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-medium">{t.booking.dateTime.endTime}</label>
                        <Select value={endTime} onValueChange={setEndTime}>
                            <SelectTrigger className="h-12 glass">
                                <SelectValue placeholder="Select end time" />
                            </SelectTrigger>
                            <SelectContent>
                                {timeSlots.map((time) => (
                                    <SelectItem key={`end-${time}`} value={time}>
                                        {time}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Duration Display */}
                    <motion.div
                        key={duration}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="rounded-xl bg-secondary/50 p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{t.booking.dateTime.duration}</span>
                        </div>
                        <div className="text-xl font-bold text-primary">
                            {duration.toFixed(1)} {t.booking.dateTime.hours}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
