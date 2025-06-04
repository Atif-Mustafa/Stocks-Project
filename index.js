const apiKey = '6GSHPV5A7L5XM418';

const stockInput = document.getElementById('stockInput');
const searchBtn = document.getElementById('searchBtn');
const stockInfo = document.getElementById('stockInfo');
const compareTable = document.getElementById('compareTable').getElementsByTagName('tbody')[0];
const ctx = document.getElementById('stockCanvas').getContext('2d');
let stockChart;

const stockSelect = document.getElementById('stockSelect');
const fetchStockBtn = document.getElementById('fetchStockBtn');

// Fetch stock data
async function getStockData(stockSymbol) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&apikey=${apiKey}`);
    const data = await response.json();
    return data['Time Series (Daily)'];
}

// Simulate trending stocks
async function getTrendingStocks() {
    const trendingStocks = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'FB', 'NFLX', 'NVDA', 'BABA', 'INTC'];
    return trendingStocks;
}

// Display stock details
function displayStockDetails(stockData, symbol) {
    const latestDate = Object.keys(stockData)[0];
    const latestData = stockData[latestDate];
    const price = latestData['4. close'];
    const volume = latestData['5. volume'];
    const change = (latestData['4. close'] - stockData[Object.keys(stockData)[1]]['4. close']).toFixed(2);

    stockInfo.innerHTML = `
        <h3>${symbol}</h3>
        <p>Price: $${price}</p>
        <p>Change: $${change}</p>
        <p>Volume: ${volume}</p>
    `;

    updateCompareTable(symbol, price, change, volume);
}

// Update comparison table
function updateCompareTable(symbol, price, change, volume) {
    const row = compareTable.insertRow();
    row.innerHTML = `
        <td>${symbol}</td>
        <td>$${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
    `;
}

// Display stock graph
function displayStockGraph(stockData) {
    const labels = Object.keys(stockData).slice(0, 30).reverse();
    const data = labels.map(date => stockData[date]['4. close']);

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: false
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Search button
searchBtn.addEventListener('click', async () => {
    const stockSymbol = stockInput.value.toUpperCase();
    const stockData = await getStockData(stockSymbol);
    if (stockData) {
        displayStockDetails(stockData, stockSymbol);
        displayStockGraph(stockData);
    } else {
        stockInfo.innerHTML = `<p>Stock symbol not found.</p>`;
    }
});

// Load stock from dropdown
fetchStockBtn.addEventListener('click', async () => {
    const selectedStock = stockSelect.value;
    const stockData = await getStockData(selectedStock);
    if (stockData) {
        displayStockDetails(stockData, selectedStock);
        displayStockGraph(stockData);
    } else {
        stockInfo.innerHTML = `<p>Stock data not available for ${selectedStock}.</p>`;
    }
});

// Populate dropdown on load
window.addEventListener('DOMContentLoaded', async () => {
    const trendingStocks = await getTrendingStocks();
    stockSelect.innerHTML = trendingStocks.map(stock => `<option value="${stock}">${stock}</option>`).join('');
});
