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

        let formattedPrice = parseFloat(data.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        let formattedYesterdayPrice = parseFloat(data.yesterday_price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        let formattedChange = Math.abs(priceChange).toFixed(3);
        
        document.getElementById('currencyName').textContent = currency;
        document.getElementById('priceDisplay').textContent = `${formattedPrice} $`;
        
        let priceChangeEl = document.getElementById('priceChange');
        priceChangeEl.textContent = `${changeSymbol}${formattedChange} (${priceChangePercent}%)`;
        priceChangeEl.className = `price-change ${changeClass}`;
        
        document.getElementById('currentPrice').textContent = `${formattedPrice} $`;
        document.getElementById('yesterdayPrice').textContent = `${formattedYesterdayPrice} $`;
        
        let change24hEl = document.getElementById('change24h');
        change24hEl.textContent = `${changeSymbol}${formattedChange}$`;
        change24hEl.className = `stat-value ${changeClass}`;
        
        let changePercentEl = document.getElementById('changePercent');
        changePercentEl.textContent = `${priceChangePercent}%`;
        changePercentEl.className = `stat-value ${changeClass}`;
        
    } catch (error) {
        document.getElementById('currencyDetail').innerHTML = '<p>Error loading data</p>';
    }
}