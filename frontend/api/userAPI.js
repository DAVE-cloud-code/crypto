// api/userAPI.js
const token = localStorage.getItem('token'); // Adjust if stored differently


export async function getDashboardData(token) {
    try {
      const response = await fetch('https://oreantrade.onrender.com/api/user/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
  
      const data = await response.json();
      console.log('Dashboard Data:', data);
      return data;
    } catch (error) {
      console.error('getDashboardData error:', error);
      throw error;
    }
  }
  