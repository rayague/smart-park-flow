import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('Starting API Tests...');

    try {
        // 1. Health Check
        const health = await axios.get('http://localhost:5000/health');
        console.log('✅ Health Check:', health.data);

        // 2. Register
        const register = await axios.post(`${API_URL}/auth/register`, {
            email: 'test_user@example.com',
            password: 'password123',
            name: 'Test User'
        });
        console.log('✅ Register:', register.data.user.email);
        const token = register.data.token;

        // 3. Login
        const login = await axios.post(`${API_URL}/auth/login`, {
            email: 'test_user@example.com',
            password: 'password123'
        });
        console.log('✅ Login:', login.data.user.email);

        // 4. Get Parkings (Public)
        const parkings = await axios.get(`${API_URL}/parkings`);
        console.log('✅ Get Parkings:', parkings.data.length, 'found');

        // 5. Create Reservation (Protected)
        const reservation = await axios.post(`${API_URL}/reservations`, {
            parkingId: 'p1',
            parkingName: 'Central Station Parking',
            spotId: 's10',
            spotNumber: 'A-10',
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
            totalPrice: 3.5,
            vehiclePlate: 'TEST-123',
            isEv: false
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Create Reservation:', reservation.data.id);

        // 6. Get My Reservations (Protected)
        const myReservations = await axios.get(`${API_URL}/reservations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✅ Get My Reservations:', myReservations.data.length, 'found');

    } catch (error: any) {
        console.error('❌ Test Failed:', error.response?.data || error.message);
    }
}

// In real scenario we would run this after ensuring server is up
console.log('To run tests: npx ts-node test_api.ts');
