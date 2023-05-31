const fs = require('fs');
const axios = require('axios');
const { Worker, isMainThread, workerData } = require('worker_threads');
const proxies = fs.readFileSync('proxies.txt', 'utf8').split('\n');
const worknum = 10; // adjust how many worker threads you want to use

const reset = '\x1b[0m';
const green = '\x1b[32m';
const red = '\x1b[31m';

let startTime, endTime;

async function checkProxy(proxy) {
  try {
    const response = await axios.get('http://example.com', {
      proxy: {
        host: proxy.split(':')[0],
        port: proxy.split(':')[1]
      }
    });

    fs.appendFileSync('p.txt', `${proxy}\n`);

    console.log(`${green}Proxy ${proxy} is working fine! Written to p.txt.${reset}`);
  } catch (error) {
    console.log(`${red}Proxy ${proxy} is not working.${reset}`);
  }
}

function proxyCheckWorker() {
  let index = workerData;
  while (index < proxies.length) {
    const proxy = proxies[index];
    checkProxy(proxy.trim());
    index += worknum;
  }
}

if (isMainThread) {
  const numWorkers = Math.min(worknum, proxies.length);
  for (let i = 0; i < numWorkers; i++) {
    const worker = new Worker(__filename, { workerData: i });
    worker.on('error', (err) => console.error(err));
    worker.on('exit', () => console.log(`Worker ${worker.threadId} finished.`));
  }
} else {
  proxyCheckWorker();
}


if (isMainThread) {
  startTime = new Date();
  console.log('Proxy checking started.');

  process.on('exit', () => {
    endTime = new Date();
    const totalTime = (endTime - startTime) / 1000; 
    console.log(`Proxy checking completed. Total time taken: ${totalTime} seconds.`);
  });
}
