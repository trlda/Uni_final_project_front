const dataSelector = document.getElementById('currencies')
const dataDisplay = document.getElementById('currencyDetail')

dataSelector.addEventListener('change', function() {
    const selectedCurrency = this.value;
    
    if (selectedCurrency) {
        showCurrency(selectedCurrency);
    }
});

async function CurrencyDataFetch(currency) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/prices/?symbol=${currency}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        
        if(!response.ok) throw new Error('Failed to fetch currency')
        
        const currencyDetails = await response.json()
        return currencyDetails
    } catch (error) {
        console.error('Error fetching currency data:', error)
        throw error
    }
}
async function showCurrency(currency) {
    const data = await CurrencyDataFetch(currency)
    try {
        let priceChange = data.price - data.yesterday_price;
        let priceChangePercent = ((priceChange / data.yesterday_price) * 100).toFixed(5);
        let changeClass;
        let changeSymbol;

        if (priceChange >= 0) {
            changeClass = 'positive';
            changeSymbol = '+';
        } else {
            changeClass = 'negative';
            changeSymbol = '-';
        }
        
        dataDisplay.innerHTML = `
            <div class="currency-header">
                <div class="currency-name">
                    <h2>${currency}</h2>
                </div>
                <div>
                    <div class="price-display">${parseFloat(data.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} $</div>
                    <div class="price-change ${changeClass}">
                        ${changeSymbol}${Math.abs(priceChange).toFixed(3)} (${priceChangePercent}%)
                    </div>
                </div>
            </div>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Current Price</div>
                    <div class="stat-value">${parseFloat(data.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} $</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Yesterday's Price</div>
                    <div class="stat-value">${parseFloat(data.yesterday_price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} $</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">24h Change</div>
                    <div class="stat-value ${changeClass}">${changeSymbol}${Math.abs(priceChange).toFixed(3)}$</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">24h Change %</div>
                    <div class="stat-value ${changeClass}">${priceChangePercent}%</div>
                </div>
            </div>
        `;
    } catch (error) {
        dataDisplay.innerHTML = '<p>Error loading data</p>'
    }
}