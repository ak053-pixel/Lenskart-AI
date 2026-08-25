async function run() {
  const res = await fetch('https://jeeliz.com/sunglasses/');
  const text = await res.text();
  console.log('HTML length:', text.length);
  const regex = /<script[^>]+src=["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    console.log('Script:', match[1]);
  }
}
run().catch(console.error);
