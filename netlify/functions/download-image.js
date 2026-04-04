const { schedule } = require('@netlify/functions');
const { getStore } = require('@netlify/blobs');
const fetch = require('node-fetch');

const IMAGE_URL = 'https://www.kanostar.top/holidays/img';

exports.handler = schedule('1 0 * * *', async () => {
  console.log('开始下载图片...');
  try {
    const res = await fetch(IMAGE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = await res.buffer();

    const store = getStore('holiday-images');
    await store.set('original.jpg', buffer);
    console.log(`保存成功，大小 ${buffer.length} 字节`);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('下载失败', err);
    return { statusCode: 500, body: 'Failed' };
  }
});
