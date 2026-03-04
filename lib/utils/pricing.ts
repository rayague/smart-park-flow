export interface PricingParams {
    pricePerHour: number
    startTime: string
    endTime: string
    isEv?: boolean
    serviceFee?: number
    evFee?: number
}

export interface PriceBreakdown {
    subtotal: number
    serviceFee: number
    evFee: number
    total: number
    durationInHours: number
}

/**
 * Calculates the total booking price based on duration and fees.
 */
export function calculateParkingPrice(params: PricingParams): PriceBreakdown {
    const {
        pricePerHour,
        startTime,
        endTime,
        isEv = false,
        serviceFee = 2.00,
        evFee = isEv ? 5.00 : 0
    } = params

    // Parse times
    const [startH, startM] = startTime.split(":").map(Number)
    const [endH, endM] = endTime.split(":").map(Number)

    // Calculate difference in minutes
    let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM)

    // Handle overnight bookings if applicable (basic logic)
    if (diffMinutes < 0) diffMinutes += 24 * 60

    const durationInHours = diffMinutes / 60

    const subtotal = durationInHours * pricePerHour
    const total = subtotal + serviceFee + evFee

    return {
        subtotal,
        serviceFee,
        evFee,
        total,
        durationInHours
    }
}
