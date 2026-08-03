import { fetchETFData } from './utils.js';

export const handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        const body = JSON.parse(event.body);
        const { symbols } = body;

        if (!symbols || !Array.isArray(symbols)) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'symbols array required in body' }),
            };
        }

        console.log(`[${new Date().toLocaleTimeString()}] Batch fetching ${symbols.length} ETFs`);

        const results = [];
        for (const symbol of symbols) {
            const data = await fetchETFData(symbol);
            results.push(data);
            await new Promise(r => setTimeout(r, 300));
        }

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                success: true,
                total: symbols.length,
                fetched: successful.length,
                failed: failed.length,
                failedSymbols: failed.map(f => f.yahooSymbol),
                data: successful,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ success: false, error: error.message }),
        };
    }
};
