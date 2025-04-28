// AI Trading buttons
const activateAiBtn = document.getElementById('activateAiBtn');
const deactivateAiBtn = document.getElementById('deactivateAiBtn');

// Sidebar ai-trading element
const aiTradingEl = document.getElementById('ai-trading');

// Function to update sidebar and buttons based on localStorage value
function updateAiTradingStatus() {
  const aiTradingEnabled = localStorage.getItem('aiTradingEnabled') === 'true';
  
  const tradingStatus = aiTradingEnabled ? 'Active ✅' : 'Inactive ❌';
  const tradingColor = aiTradingEnabled ? 'green' : 'red';
  aiTradingEl.textContent = tradingStatus;
  aiTradingEl.className = tradingColor;

  // Update button states
  if (aiTradingEnabled) {
    activateAiBtn.disabled = true;
    deactivateAiBtn.disabled = false;
  } else {
    activateAiBtn.disabled = false;
    deactivateAiBtn.disabled = true;
  }
}

// On page load, update the sidebar and buttons immediately
updateAiTradingStatus();

// Activate AI Trading
activateAiBtn.addEventListener('click', () => {
  localStorage.setItem('aiTradingEnabled', 'true');
  alert('AI Trading activated ✅');
  updateAiTradingStatus();
});

// Deactivate AI Trading
deactivateAiBtn.addEventListener('click', () => {
  localStorage.setItem('aiTradingEnabled', 'false');
  alert('AI Trading deactivated ❌');
  updateAiTradingStatus();
});
