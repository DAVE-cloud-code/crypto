

document.addEventListener("DOMContentLoaded", ()=>{
    const assetOptions = {
        crypto: [
            { name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
            { name: 'Ethereum', symbol: 'BINANCE:ETHUSDT' },
            { name: 'Litecoin', symbol: 'BINANCE:LTCUSDT' },
            { name: 'Ripple', symbol: 'BINANCE:XRPUSDT' },
            { name: 'Cardano', symbol: 'BINANCE:ADAUSDT' },
            { name: 'Solana', symbol: 'BINANCE:SOLUSDT' },
            { name: 'Polkadot', symbol: 'BINANCE:DOTUSDT' },
            { name: 'Dogecoin', symbol: 'BINANCE:DOGEUSDT' },
            { name: 'Avalanche', symbol: 'BINANCE:AVAXUSDT' },
            { name: 'Chainlink', symbol: 'BINANCE:LINKUSDT' },
            { name: 'Polygon', symbol: 'BINANCE:MATICUSDT' },
            { name: 'Uniswap', symbol: 'BINANCE:UNIUSDT' },
            { name: 'Shiba Inu', symbol: 'BINANCE:SHIBUSDT' },
            { name: 'Tron', symbol: 'BINANCE:TRXUSDT' },
            { name: 'Cosmos', symbol: 'BINANCE:ATOMUSDT' }
          ],
          forex: [
            { name: 'EUR/USD', symbol: 'FX:EURUSD' },
            { name: 'USD/JPY', symbol: 'FX:USDJPY' },
            { name: 'GBP/USD', symbol: 'FX:GBPUSD' },
            { name: 'USD/CHF', symbol: 'FX:USDCHF' },
            { name: 'AUD/USD', symbol: 'FX:AUDUSD' },
            { name: 'USD/CAD', symbol: 'FX:USDCAD' },
            { name: 'EUR/JPY', symbol: 'FX:EURJPY' },
            { name: 'GBP/JPY', symbol: 'FX:GBPJPY' },
            { name: 'NZD/USD', symbol: 'FX:NZDUSD' },
            { name: 'EUR/GBP', symbol: 'FX:EURGBP' },
            { name: 'EUR/CHF', symbol: 'FX:EURCHF' },
            { name: 'AUD/JPY', symbol: 'FX:AUDJPY' },
            { name: 'CAD/JPY', symbol: 'FX:CADJPY' },
            { name: 'CHF/JPY', symbol: 'FX:CHFJPY' },
            { name: 'USD/SGD', symbol: 'FX:USDSGD' }
          ],
          stock: [
            { name: 'Apple', symbol: 'NASDAQ:AAPL' },
            { name: 'Tesla', symbol: 'NASDAQ:TSLA' },
            { name: 'Microsoft', symbol: 'NASDAQ:MSFT' },
            { name: 'Amazon', symbol: 'NASDAQ:AMZN' },
            { name: 'Meta', symbol: 'NASDAQ:META' },
            { name: 'Alphabet (GOOGL)', symbol: 'NASDAQ:GOOGL' },
            { name: 'NVIDIA', symbol: 'NASDAQ:NVDA' },
            { name: 'Netflix', symbol: 'NASDAQ:NFLX' },
            { name: 'Intel', symbol: 'NASDAQ:INTC' },
            { name: 'AMD', symbol: 'NASDAQ:AMD' },
            { name: 'Qualcomm', symbol: 'NASDAQ:QCOM' },
            { name: 'Adobe', symbol: 'NASDAQ:ADBE' },
            { name: 'PayPal', symbol: 'NASDAQ:PYPL' },
            { name: 'Berkshire Hathaway', symbol: 'NYSE:BRK.B' },
            { name: 'Visa', symbol: 'NYSE:V' }
          ],
          indices: [
            { name: 'S&P 500', symbol: 'INDEX:SPX' },
            { name: 'Nasdaq', symbol: 'INDEX:IXIC' },
            { name: 'Dow Jones', symbol: 'INDEX:DJI' },
            { name: 'Russell 2000', symbol: 'INDEX:RUT' },
            { name: 'FTSE 100', symbol: 'INDEX:FTSE' },
            { name: 'DAX', symbol: 'INDEX:DAX' },
            { name: 'CAC 40', symbol: 'INDEX:CAC' },
            { name: 'Nikkei 225', symbol: 'INDEX:NKY' },
            { name: 'Hang Seng', symbol: 'INDEX:HSI' },
            { name: 'Shanghai Composite', symbol: 'INDEX:SHCOMP' },
            { name: 'S&P/TSX', symbol: 'INDEX:GSPTSE' },
            { name: 'Bovespa', symbol: 'INDEX:BVSP' },
            { name: 'KOSPI', symbol: 'INDEX:KOSPI' },
            { name: 'ASX 200', symbol: 'INDEX:AXJO' },
            { name: 'Euro Stoxx 50', symbol: 'INDEX:STOXX50E' }
          ],
          commodities: [
            { name: 'Gold', symbol: 'TVC:GOLD' },
            { name: 'Silver', symbol: 'TVC:SILVER' },
            { name: 'Crude Oil', symbol: 'TVC:USOIL' },
            { name: 'Brent Oil', symbol: 'TVC:UKOIL' },
            { name: 'Natural Gas', symbol: 'TVC:NATGASUSD' },
            { name: 'Copper', symbol: 'TVC:COPPER' },
            { name: 'Platinum', symbol: 'TVC:PLATINUM' },
            { name: 'Palladium', symbol: 'TVC:PALLADIUM' },
            { name: 'Aluminum', symbol: 'TVC:ALUMINUM' },
            { name: 'Coffee', symbol: 'TVC:COFFEE' },
            { name: 'Cotton', symbol: 'TVC:COTTON' },
            { name: 'Wheat', symbol: 'TVC:WHEAT' },
            { name: 'Corn', symbol: 'TVC:CORN' },
            { name: 'Soybeans', symbol: 'TVC:SOYBEAN' },
            { name: 'Sugar', symbol: 'TVC:SUGAR' }
          ],
        metals: [
          { name: 'Copper', symbol: 'TVC:COPPER' },
          { name: 'Platinum', symbol: 'TVC:PLATINUM' }
        ],
        energy: [
          { name: 'Natural Gas', symbol: 'TVC:NATGASUSD' },
          { name: 'Brent Oil', symbol: 'TVC:UKOIL' }
        ],
        bonds: [
          { name: 'US 10Y Bond', symbol: 'TVC:US10Y' },
          { name: 'US 30Y Bond', symbol: 'TVC:US30Y' }
        ],
        etf: [
          { name: 'SPY', symbol: 'AMEX:SPY' },
          { name: 'QQQ', symbol: 'NASDAQ:QQQ' }
        ],
        mutual_funds: [
          { name: 'Vanguard 500 Index', symbol: 'MUTF:VFIAX' },
          { name: 'Fidelity Contrafund', symbol: 'MUTF:FCNTX' }
        ],
        futures: [
          { name: 'E-mini S&P 500', symbol: 'CME_MINI:ES1!' },
          { name: 'Bitcoin Futures', symbol: 'CME:BTC1!' }
        ],
        options: [
          { name: 'AAPL 150C', symbol: 'OPRA:AAPL230915C00150000' }
        ],
        real_estate: [
          { name: 'Real Estate Index Fund', symbol: 'AMEX:VNQ' }
        ],
        nfts: [
          { name: 'CryptoPunk #3100', symbol: 'NFT:PUNK3100' }
        ],
        synthetic_assets: [
          { name: 'sUSD (Synthetic USD)', symbol: 'BINANCE:SUSDUSDT' }
        ]
      };

      const assetSymbolToId = {
        'BINANCE:BTCUSDT': 'bitcoin',
        'BINANCE:ETHUSDT': 'ethereum',
        'BINANCE:LTCUSDT': 'litecoin',
        'BINANCE:XRPUSDT': 'ripple',
        'BINANCE:SUSDUSDT': 'susd', // synthetic USD from Synthetix
        'BINANCE:ADAUSDT': 'cardano',
        'BINANCE:SOLUSDT': 'solana',
        'BINANCE:DOTUSDT': 'polkadot',
        'BINANCE:DOGEUSDT': 'dogecoin',
        'BINANCE:AVAXUSDT': 'avalanche-2', // CoinGecko ID for Avalanche
        'BINANCE:LINKUSDT': 'chainlink',
        'BINANCE:MATICUSDT': 'polygon',
        'BINANCE:UNIUSDT': 'uniswap',
        'BINANCE:SHIBUSDT': 'shiba-inu',
        'BINANCE:TRXUSDT': 'tron',
        'BINANCE:ATOMUSDT': 'cosmos'
      };
      

  const assetCategory = document.getElementById('assetCategory');
  const asset = document.getElementById('asset');
  const livePrice = document.getElementById('livePrice');
  const tvChart = document.getElementById('tvChart');
  const tradeForm = document.getElementById('tradeForm');
  const tradeHistory = document.getElementById('tradeHistory');

  assetCategory.addEventListener('change', function () {
    const selected = this.value;
    asset.innerHTML = '<option value="">-- Select Asset --</option>';
    assetOptions[selected]?.forEach(({ name, symbol }) => {
      const opt = document.createElement('option');
      opt.value = symbol;
      opt.textContent = name;
      asset.appendChild(opt);
    });
  });

  asset.addEventListener('change', function () {
    const symbol = this.value;
    tvChart.src = `https://s.tradingview.com/widgetembed/?symbol=${symbol}&interval=1D&theme=dark`;
    fetchLivePrice(symbol);
  });

  async function fetchLivePrice(symbol) {
    const id = assetSymbolToId[symbol];
    if (!id) {
      livePrice.textContent = 'N/A';
      return;
    }
    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
      const data = await res.json();
      livePrice.textContent = `$${data[id]?.usd.toLocaleString()}`;
    } catch {
      livePrice.textContent = 'N/A';
    }
  }

  tradeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(tradeForm);
    const trade = Object.fromEntries(formData.entries());
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:1800/api/trades/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(trade)
      });

      const result = await res.json();
      if (res.ok) {
        alert('Trade placed successfully!');
        appendToHistory(trade);
        tradeForm.reset();
      } else {
        alert(result.message || 'Trade failed!');
      }
    } catch (err) {
      console.error(err);
      alert('Error placing trade.');
    }
  });

  function appendToHistory(trade) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${trade.asset}</td>
      <td>$${parseFloat(trade.amount).toFixed(2)}</td>
      <td>${trade.status === 'closed' ? 'Completed' : 'Active'}</td>
      <td>${trade.duration}</td>
      <td>x${trade.leverage}</td>
      <td>${trade.fromBalance === 'mainBalance' ? 'Main' : 'Profit'}</td>
    `;
    tradeHistory.prepend(row);
  }  
})

document.addEventListener("DOMContentLoaded", () => {
    const logoutLink = document.getElementById("logoutLink");
  
    logoutLink.addEventListener("click", logoutUser);
  
    function logoutUser() {
      localStorage.removeItem("token");
      window.location.href = "../signin.html";
    }
  });