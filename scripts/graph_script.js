let chart = null;

async function fetchHistoricalData(currency) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/prices/list/?symbol=${currency}`);
        
        if (!response.ok) throw new Error('Load error');
        
        const data = await response.json();
        return processHistoricalData(data);
        
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function processHistoricalData(data) {
    const items = Array.isArray(data) ? data.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    ).slice(-10) : [data];
    
    const labels = items.map(item => {
        const date = new Date(item.timestamp);
        return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    });
    
    const prices = items.map(item => item.price);
    
    return { labels, prices };
}

function createPriceChart(labels, prices, currency) {
    const canvas = document.getElementById('priceChart');
    if (!canvas) return;
    
    if (chart) chart.destroy();
    
    chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${currency} (USD)`,
                data: prices,
                borderColor: '#ffd700',
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#ffd700'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800 },
            plugins: {
                legend: {
                    labels: { color: '#fff', font: { size: 13 } }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffd700',
                    bodyColor: '#fff',
                    callbacks: {
                        label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: '#3a3a3a' },
                    ticks: { color: '#b0b0b0' }
                },
                y: {
                    grid: { color: '#3a3a3a' },
                    ticks: { 
                        color: '#b0b0b0',
                        callback: (val) => '$' + val.toLocaleString()
                    }
                }
            }
        }
    });
    
    updateChartStats(prices, currency);
}

function updateChartStats(prices, currency) {
    const statsDiv = document.getElementById('chartStats');
    if (!statsDiv || !prices.length) return;
    
    const current = prices[prices.length - 1];
    const first = prices[0];
    const diff = current - first;
    const percent = ((diff / first) * 100).toFixed(2);
    const isUp = diff >= 0;
}

async function initChartForCurrency(currency) {
    const statsDiv = document.getElementById('chartStats');
    
    try {
        if (statsDiv) statsDiv.innerHTML = '<div class="loading">Loading..</div>';
        
        const { labels, prices } = await fetchHistoricalData(currency);
        
        if (!prices.length) throw new Error('No data');
        
        createPriceChart(labels, prices, currency);
        
    } catch (error) {
        console.error('Error:', error);
        if (statsDiv) {
            statsDiv.innerHTML = '<div class="error">Error</div>';
        }
        if (chart) {
            chart.destroy();
            chart = null;
        }
    }
}

window.chartFunctions = { initChartForCurrency };