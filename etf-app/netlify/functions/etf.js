import { fetchETFData } from './utils.js';

export const handler = async (event, context) => {
    // Support both query param `?symbol=` and path-style `/etf/SYMBOL`
    const qsSymbol = event.queryStringParameters?.symbol;
    const pathSymbol = event.path ? event.path.split('/').pop() : null;
    const symbol = qsSymbol || pathSymbol;

    if (!symbol) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ success: false, error: 'Symbol is required (query param or path)' }),
        };
    }

    console.log(`[${new Date().toLocaleTimeString()}] Fetching: ${symbol}`);
    const data = await fetchETFData(symbol);

    return {
        statusCode: data.success ? 200 : 500,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data),
    };
};
