process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function run() {
  const res = await fetch('https://jeeliz.com/sunglasses/scripts/bundle.js');
  const text = await res.text();
  console.log('Bundle length:', text.length);

  const modelMatches = text.match(/[a-zA-Z0-9_\/.-]+\.json/g);
  console.log('JSON files referenced in bundle:', Array.from(new Set(modelMatches)).slice(0, 30));

  const urlMatches = text.match(/https?:\/\/[a-zA-Z0-9_./-]+/g);
  console.log('URLs in bundle:', Array.from(new Set(urlMatches)).slice(0, 30));
}

run().catch(console.error);
