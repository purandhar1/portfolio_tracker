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

        // Fetch in concurrent batches to avoid long sequential execution
        const chunkSize = 8; // tune this for concurrency vs rate-limits
        const results = [];

        function chunkArray(arr, size) {
            const chunks = [];
            for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
            return chunks;
        }

        const batches = chunkArray(symbols, chunkSize);
        for (const batch of batches) {
            const settled = await Promise.allSettled(batch.map(s => fetchETFData(s)));
            for (const s of settled) {
                if (s.status === 'fulfilled') results.push(s.value);
                else results.push({ success: false, yahooSymbol: null, error: s.reason?.message || String(s.reason) });
            }
            // small delay between batches to be polite to upstream
            await new Promise(r => setTimeout(r, 250));
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
