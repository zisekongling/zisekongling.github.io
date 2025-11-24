const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 处理 CORS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // 从查询参数获取目标 URL，或者使用默认的 JSON URL
    const targetUrl = event.queryStringParameters.url || 
                     'https://gitee.com/zisekongling/apk-automatic-update/raw/master/time-yiyan/yiyan.json';
    
    console.log('Fetching JSON from:', targetUrl);
    
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const jsonData = await response.json();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        success: true,
        contents: JSON.stringify(jsonData),
        originalData: jsonData
      })
    };
  } catch (error) {
    console.error('JSON Proxy error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: false,
        error: error.message,
        message: '无法从 Gitee 获取 JSON 数据'
      })
    };
  }
};
