// ============================================================
// Netlify Function: utils.js (shared helpers)
// ES Module syntax — compatible with "type": "module"
// ============================================================

function calculateSMA(closes, period) {
    if (closes.length < period) return null;
    const slice = closes.slice(-period);
    const sum = slice.reduce((a, b) => a + b, 0);
    return sum / period;
}

function calculateRSI(closes, period = 14) {
    if (closes.length < period + 1) return null;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
        const change = closes[closes.length - i] - closes[closes.length - i - 1];
        if (change > 0) gains += change;
        else losses += Math.abs(change);
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - 100 / (1 + rs);
}

function get52WeekLow(lows) {
    if (lows.length === 0) return null;
    return Math.min(...lows);
}

export async function fetchETFData(yahooSymbol) {
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

        const ma20Change = ma20 ? ((ma20 - cmp) / cmp) * 100 : null;
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
