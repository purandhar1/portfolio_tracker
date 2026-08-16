// ============================================================
// ETF Tracker Backend Proxy — server.js
// Node.js + Express proxy for Yahoo Finance (bypasses CORS)
// Calculates: CMP, 20DMA, 52W Low, RSI on the server
// ============================================================

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Enable CORS for your React frontend
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET'],
}));

app.use(express.json());

// ============================================================
// CALCULATION UTILITIES
// ============================================================

function calculateSMA(closes, period) {
    if (closes.length < period) return null;
    const slice = closes.slice(-period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
}

function calculateRSI(closes, period = 14) {
    if (closes.length < period + 1) return null;
    const diffs = [];
    for (let i = 1; i < closes.length; i++) {
        diffs.push(closes[i] - closes[i - 1]);
    }
    const gains = diffs.map((diff) => (diff > 0 ? diff : 0));
    const losses = diffs.map((diff) => (diff < 0 ? Math.abs(diff) : 0));
    if (gains.length < period) return null;

    const firstAvgGain = gains.slice(0, period).reduce((sum, g) => sum + g, 0) / period;
    const firstAvgLoss = losses.slice(0, period).reduce((sum, l) => sum + l, 0) / period;
    let avgGain = firstAvgGain;
    let avgLoss = firstAvgLoss;

    for (let i = period; i < gains.length; i++) {
        avgGain = (avgGain * (period - 1) + gains[i]) / period;
        avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
}

function get52WeekLow(lows) {
    if (lows.length === 0) return null;
    return Math.min(...lows);
}

// ============================================================
// FETCH SINGLE ETF DATA
// ============================================================

async function fetchETFData(yahooSymbol) {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=1d&range=1y`;

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();
        const result = json.chart.result?.[0];

        if (!result) {
            throw new Error('No chart data returned from Yahoo');
        }

        const timestamps = result.timestamp || [];
        const quote = result.indicators.quote[0];
        const closes = quote.close || [];
        const lows = quote.low || [];
        const highs = quote.high || [];
        const opens = quote.open || [];
        const volumes = quote.volume || [];

        // Filter out null values
        const validData = [];
        for (let i = 0; i < timestamps.length; i++) {
            if (closes[i] !== null && closes[i] !== undefined) {
                validData.push({
                    date: new Date(timestamps[i] * 1000).toISOString().split('T')[0],
                    close: closes[i],
                    low: lows[i],
                    high: highs[i],
                    open: opens[i],
                    volume: volumes[i],
                });
            }
        }

        if (validData.length === 0) {
            throw new Error('No valid price data');
        }

        const closePrices = validData.map(d => d.close);
        const lowPrices = validData.map(d => d.low);

        const cmp = closePrices[closePrices.length - 1];
        const ma20 = calculateSMA(closePrices, 20);
        const week52Low = get52WeekLow(lowPrices);
        const rsi = calculateRSI(closePrices, 14);

        // Calculate derived metrics
        // Percent difference relative to MA20: negative when CMP < MA20
        const ma20Change = ma20 ? ((cmp - ma20) / ma20) * 100 : null;
        const distTo52WLow = week52Low ? ((cmp - week52Low) / week52Low) * 100 : null;

        return {
            success: true,
            yahooSymbol,
            cmp,
            ma20,
            week52Low,
            rsi,
            ma20Change,
            distTo52WLow,
            dataPoints: validData.length,
            lastDate: validData[validData.length - 1].date,
        };

    } catch (error) {
        return {
            success: false,
            yahooSymbol,
            error: error.message,
        };
    }
}

// ============================================================
// API ROUTES
// ============================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Fetch single ETF
app.get('/api/etf/:symbol', async (req, res) => {
    const { symbol } = req.params;
    console.log(`[${new Date().toLocaleTimeString()}] Fetching: ${symbol}`);

    const data = await fetchETFData(symbol);

    if (!data.success) {
        return res.status(500).json(data);
    }

    res.json(data);
});

// Fetch multiple ETFs (batch)
app.post('/api/etfs', async (req, res) => {
    const { symbols } = req.body;

    if (!symbols || !Array.isArray(symbols)) {
        return res.status(400).json({ error: 'symbols array required in body' });
    }

    console.log(`[${new Date().toLocaleTimeString()}] Batch fetching ${symbols.length} ETFs`);

    // Fetch sequentially with small delay to avoid rate limiting
    const results = [];
    for (const symbol of symbols) {
        const data = await fetchETFData(symbol);
        results.push(data);
        // Small delay between requests
        await new Promise(r => setTimeout(r, 300));
    }

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
        success: true,
        total: symbols.length,
        fetched: successful.length,
        failed: failed.length,
        failedSymbols: failed.map(f => f.yahooSymbol),
        data: successful,
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║     ETF Tracker Backend Proxy — Running              ║');
    console.log(`║     Port: ${PORT}                                    ║`);
    console.log('║                                                      ║');
    console.log('║  Endpoints:                                          ║');
    console.log('║    GET  /api/health         → Health check           ║');
    console.log('║    GET  /api/etf/:symbol    → Single ETF data        ║');
    console.log('║    POST /api/etfs           → Batch ETF data         ║');
    console.log('╚══════════════════════════════════════════════════════╝');
});