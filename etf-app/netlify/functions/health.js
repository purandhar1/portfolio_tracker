exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' // Adjust as needed
        },
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() })
    };
};
