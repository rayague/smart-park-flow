// Tests des fonctions utilitaires de mapping
// Auteur : Yassir El Moraghi

// On recopie les fonctions ici pour les tester independamment de Supabase
function mapParkingStatus(status: string | null | undefined): 'active' | 'maintenance' {
  switch (status) {
    case 'MAINTENANCE': return 'maintenance'
    case 'ACTIVE':
    default: return 'active'
  }
}

function mapReservationStatus(status: string | null | undefined): 'pending' | 'active' | 'completed' | 'cancelled' {
  switch (status) {
    case 'CANCELLED': return 'cancelled'
    case 'COMPLETED': return 'completed'
    case 'PAID': return 'active'
    case 'PENDING':
    default: return 'pending'
  }
}

describe('mapParkingStatus', () => {
  it('retourne "active" pour le statut ACTIVE', () => {
    expect(mapParkingStatus('ACTIVE')).toBe('active')
  })
  it('retourne "maintenance" pour MAINTENANCE', () => {
    expect(mapParkingStatus('MAINTENANCE')).toBe('maintenance')
  })
  it('retourne "active" par defaut pour null', () => {
    expect(mapParkingStatus(null)).toBe('active')
  })
  it('retourne "active" pour un statut inconnu', () => {
    expect(mapParkingStatus('INCONNU')).toBe('active')
  })
})

describe('mapReservationStatus', () => {
  it('retourne "cancelled" pour CANCELLED', () => {
    expect(mapReservationStatus('CANCELLED')).toBe('cancelled')
  })
  it('retourne "completed" pour COMPLETED', () => {
    expect(mapReservationStatus('COMPLETED')).toBe('completed')
  })
  it('retourne "active" pour PAID', () => {
    expect(mapReservationStatus('PAID')).toBe('active')
  })
  it('retourne "pending" par defaut', () => {
    expect(mapReservationStatus(null)).toBe('pending')
  })
})