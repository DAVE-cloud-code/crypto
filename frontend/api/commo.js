// Hardcoded list of commodities (you can replace this with an API call)
const commodities = [
  { name: 'Gold', symbol: 'XAU', img: 'https://cdn-icons-png.flaticon.com/512/2086/2086748.png' },
  { name: 'Silver', symbol: 'XAG', img: 'https://cdn-icons-png.flaticon.com/512/4461/4461396.png' },
  { name: 'Crude Oil', symbol: 'WTI', img: 'https://cdn-icons-png.flaticon.com/512/1963/1963981.png' },
  { name: 'Natural Gas', symbol: 'NG', img: 'https://cdn-icons-png.flaticon.com/512/2947/2947992.png' },
  { name: 'Copper', symbol: 'HG', img: 'https://cdn-icons-png.flaticon.com/512/553/553416.png' },
  { name: 'Corn', symbol: 'ZC', img: 'https://cdn-icons-png.flaticon.com/512/1842/1842515.png' },
  { name: 'Wheat', symbol: 'ZW', img: 'https://cdn-icons-png.flaticon.com/512/1842/1842520.png' },
  { name: 'Cotton', symbol: 'CT', img: 'https://cdn-icons-png.flaticon.com/512/1842/1842503.png' },
  { name: 'Coffee', symbol: 'KC', img: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
  { name: 'Soybeans', symbol: 'ZS', img: 'https://cdn-icons-png.flaticon.com/512/1842/1842525.png' },
  { name: 'Platinum', symbol: 'XPT', img: 'https://cdn-icons-png.flaticon.com/512/2769/2769607.png' },
  { name: 'Palladium', symbol: 'XPD', img: 'https://cdn-icons-png.flaticon.com/512/1055/1055687.png' },
]

  // Function to generate the commodity list
  const container = document.getElementById('commodity-list');
  
  commodities.forEach(asset => {
    const card = document.createElement('div');
    card.className = 'commodity-card';
    card.innerHTML = `
    <img src="${asset.img}" alt="${asset.name}" width="60" height="60" />
    <h3>${asset.name}</h3>
    <p>Symbol: ${asset.symbol}</p>
    <button onclick="viewCommodity('${asset.name}')">View</button>
  `;
    container.appendChild(card);
  });
  
  function viewCommodity(name) {
    localStorage.setItem('selectedCommodity', name);
    // Redirect to the investment page with the commodity name as a URL param
    window.location.href = `commodity.html?name=${encodeURIComponent(name)}`;
  }

  const params = new URLSearchParams(window.location.search);
    const name = params.get('name');


    document.getElementById('commodity-detail').innerHTML = `
      <h2>Commodity: ${name}</h2>
      <p id="price">Fetching price...</p>
    `;

    // Fetch real-time price
    fetch(`https://metals-api.com/api/latest?access_key=YOUR_API_KEY&base=USD&symbols=${name}`)
      .then(response => response.json())
      .then(data => {
        const price = data.rates[name];
        document.getElementById('price').innerText = `Current Price: $${price}`;
      })
      .catch(error => {
        console.error('Error fetching price:', error);
        document.getElementById('price').innerText = 'Price data unavailable.';
      });

    document.getElementById('investment-form').addEventListener('submit', e => {
      e.preventDefault();
      const amount = document.getElementById('invest-amount').value;
      alert(`Invested $${amount} in ${name}`);
      // Here you'd POST to your backend investment route
    });

  
  document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
  
    logoutLink.addEventListener("click", logoutUser);
  
    function logoutUser() {
      localStorage.removeItem("token");
      window.location.href = "../signin.html";
    }
  });
