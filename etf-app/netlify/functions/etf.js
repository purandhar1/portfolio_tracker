const { fetchETFData } = require('./utils');

exports.handler = async (event, context) => {
    const symbol = event.queryStringParameters.symbol;
    
    if (!symbol) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ success: false, error: 'Symbol is required in query string parameters' })
        };
    }
    
    console.log(`[${new Date().toLocaleTimeString()}] Fetching: ${symbol}`);
    const data = await fetchETFData(symbol);
    
    return {
        statusCode: data.success ? 200 : 500,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
    };
};
