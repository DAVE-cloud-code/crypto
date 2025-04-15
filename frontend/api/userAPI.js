// api/userAPI.js
const token = localStorage.getItem('token'); // Adjust if stored differently

export async function getDashboardData(token) {
    try {
      const response = await fetch('http://localhost:1800/api/user/dashboard', {
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
      return data;
    } catch (error) {
      console.error('getDashboardData error:', error);
      throw error;
    }
  }
  