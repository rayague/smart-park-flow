// Tests de la logique métier de réservation

// Calcul du prix total d'une réservation
function calculateTotalPrice(
  pricePerHour: number,
  startTime: string,
  endTime: string
): number {
  const start = new Date(`2024-01-01T${startTime}`)
  const end = new Date(`2024-01-01T${endTime}`)
  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  return Math.round(pricePerHour * durationHours * 100) / 100
}

// Validation des étapes de réservation
function isStepValid(step: number, data: {
  parkingId?: string | null
  selectedSpot?: object | null
  selectedDate?: Date | null
  vehiclePlate?: string
}): boolean {
  switch (step) {
    case 1: return !!data.parkingId
    case 2: return !!data.selectedSpot
    case 3: return !!data.selectedDate
    case 4: return !!data.vehiclePlate && data.vehiclePlate.trim().length > 0
    default: return false
  }
}

describe('calculateTotalPrice', () => {
  it('calcule correctement pour 1 heure a 2.50€', () => {
    expect(calculateTotalPrice(2.50, '09:00', '10:00')).toBe(2.50)
  })

  it('calcule correctement pour 2 heures a 3€', () => {
    expect(calculateTotalPrice(3, '09:00', '11:00')).toBe(6)
  })

  it('calcule correctement pour 30 minutes', () => {
    expect(calculateTotalPrice(4, '09:00', '09:30')).toBe(2)
  })

  it('retourne 0 si meme heure de debut et de fin', () => {
    expect(calculateTotalPrice(5, '09:00', '09:00')).toBe(0)
  })
})

describe('isStepValid', () => {
  it('etape 1 valide si parkingId present', () => {
    expect(isStepValid(1, { parkingId: 'abc123' })).toBe(true)
  })

  it('etape 1 invalide si parkingId null', () => {
    expect(isStepValid(1, { parkingId: null })).toBe(false)
  })

  it('etape 2 valide si spot selectionne', () => {
    expect(isStepValid(2, { selectedSpot: { id: '1' } })).toBe(true)
  })

  it('etape 3 valide si date selectionnee', () => {
    expect(isStepValid(3, { selectedDate: new Date() })).toBe(true)
  })

  it('etape 4 invalide si plaque vide', () => {
    expect(isStepValid(4, { vehiclePlate: '' })).toBe(false)
  })

  it('etape 4 valide si plaque renseignee', () => {
    expect(isStepValid(4, { vehiclePlate: 'AB-123-CD' })).toBe(true)
  })
})