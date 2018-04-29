import axios from 'axios';

const btnMine = document.getElementById('start');
const btnIncrease = document.getElementById('increase');
const btnDecrease = document.getElementById('decrease');
const btnStop = document.getElementById('stop');
const speed = document.getElementById('speed');
const earned = document.getElementById('earned');
const credits = document.getElementById('credits');
const account = document.getElementById('_accid').value;
const key = document.getElementById('_key').value;
const minerDIV = document.getElementById('miner');
const work = document.getElementById('work');
const page = document.getElementById('workPage');
let interval;

obtainCredits().then((balance) => {
  credits.textContent = balance;
  page.classList.remove('hidden');

});

const miner = new CoinHive.User(key, `${account}@mueurus`, {
  threads: 4,
  throttle: 0.5,
  forceASMJS: false,
  theme: 'dark',
  language: 'auto'
});

miner.on('authed', () => {
  updateStats();
  minerDIV.classList.remove('hidden');
  work.classList.add('fa-spin');
});

miner.on('close', () => {
  updateStats();
  work.classList.remove('fa-spin');
});

miner.on('job', () => {
  updateStats();

});

miner.on('found', () => {
  updateStats();
  credits.textContent = Number(credits.textContent) + miner.getTotalHashes();
});

miner.on('accepted', () => {
  updateStats();
});

btnMine.onclick = () => {
  if (!miner.isRunning()) {
    miner.start(CoinHive.FORCE_EXCLUSIVE_TAB);
    interval = setInterval(updateStats, 1000);
  }
}

btnStop.onclick = () => {
  if (miner.isRunning()) {
    miner.stop();
    clearInterval(interval);
  }
}

btnIncrease.onclick = () => {
  const current = miner.getThrottle();
  if (current >= 0.1) {
    miner.setThrottle(Math.round((current - 0.1) * 10) / 10);
  }
  updateStats();
}

btnDecrease.onclick = () => {
  const current = miner.getThrottle();
  if (current <= 0.9) {
    miner.setThrottle(Math.round((current + 0.1) * 10) / 10);
  }
  updateStats();
}

function updateStats() {
  const count = 100 - (miner.getThrottle() * 100);
  speed.textContent = `${Math.floor(count) == 1 ? 0 : count}%`;
  earned.textContent = miner.getTotalHashes();
}

function obtainCredits() {
  return new Promise(async (resolve, reject) => {
    try {
      resolve((await axios.get('/api/credits')).data.credits);
    } catch (e) {
      reject(e);
    }
  });

}