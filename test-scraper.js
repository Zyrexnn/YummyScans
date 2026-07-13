const cheerio = require('cheerio');

async function test() {
  try {
    const res = await fetch('https://mangaku.guru/manga/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    console.log('Status:', res.status);
    
    if (!res.ok) {
      const text = await res.text();
      console.log('Error body:', text.substring(0, 200));
      return;
    }
    
    const html = await res.text();
    const $ = cheerio.load(html);
    const items = $('.bge');
    console.log('Found .bge elements:', items.length);
    
    items.each((i, el) => {
      const title = $(el).find('.kan > a h3').text().trim();
      const cover = $(el).find('.bgei > a img').attr('src') || $(el).find('.bgei > a img').attr('data-src') || '';
      console.log(i + ':', title.substring(0, 40), '|', cover.substring(0, 80));
    });
  } catch (e) {
    console.error('Error:', e.message);
  }
}

test();