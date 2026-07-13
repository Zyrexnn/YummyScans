import * as cheerio from 'cheerio';

async function testReader() {
  try {
    const res = await fetch('https://mangaku.guru/komik/ao-no-hako/chapter-245/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    console.log('=== READER PAGE ===');
    
    // Look for reader area / images
    const readerSelectors = [
      '.mk-reader', '.reader-area', '.chapter-content', 
      '#reader', '#readerarea', '.page-content',
      'img[loading="lazy"]', 'img[data-src]'
    ];
    
    for (const sel of readerSelectors) {
      const el = $(sel);
      if (el.length) {
        console.log(`Found ${sel}: count=${el.length}`);
        if (el.is('img')) {
          el.slice(0, 5).each((i, img) => {
            console.log(`  img[${i}] src=`, $(img).attr('src'));
            console.log(`  img[${i}] data-src=`, $(img).attr('data-src'));
          });
        } else {
          console.log(`  HTML:`, el.html()?.substring(0, 300));
        }
      }
    }
    
    // All images
    console.log('\n--- All images ---');
    $('img').each((i, img) => {
      const src = $(img).attr('src');
      const dataSrc = $(img).attr('data-src');
      const alt = $(img).attr('alt');
      if (src || dataSrc) {
        console.log(`img[${i}]: src=${src}, data-src=${dataSrc}, alt=${alt}`);
      }
    });
    
    // Navigation links
    console.log('\n--- Nav links ---');
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && (href.includes('chapter') || text.includes('Chapter') || text.includes('Prev') || text.includes('Next') || text.includes('Daftar'))) {
        console.log('Nav:', text, '|', href);
      }
    });
    
  } catch (e) {
    console.error('Error:', e.message);
  }
}

testReader();