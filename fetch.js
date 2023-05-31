const fs = require('fs');
const request = require('request-promise');

async function scrapeProxies(urls, outputFile) {
  try {
    const proxies = [];

    for (const url of urls) {
      const response = await request.get(url);
      const data = response.trim();

      const extractedProxies = data.split('\n');

      proxies.push(...extractedProxies);
    }

    fs.writeFileSync(outputFile, proxies.join('\n'), 'utf-8');

    console.log(`Proxies saved to: ${outputFile}`);
    return proxies;
  } catch (error) {
    console.error('Error scraping proxies:', error);
    return [];
  }
}

const urls = [
  'https://raw.githubusercontent.com/ALIILAPRO/Proxy/main/http.txt',
  'https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt',
  'https://raw.githubusercontent.com/prxchk/proxy-list/main/http.txt',
  'https://raw.githubusercontent.com/officialputuid/KangProxy/KangProxy/http/http.txt',
  'https://raw.githubusercontent.com/UptimerBot/proxy-list/master/proxies/http.txt',
  'https://raw.githubusercontent.com/Bardiafa/Proxy-Leecher/main/proxies.txt'
];
//we'll add more sources soon
const proxyFile = 'proxies.txt';

scrapeProxies(urls, proxyFile)
  .then((proxies) => {
    console.log(proxies);
  });
