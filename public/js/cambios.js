function optimalExchange(N, denominations) {
  denominations.sort((a, b) => a - b);
  const maxCoin = Math.max(...denominations);
  const maxAmount = N + maxCoin;

  const dp = Array(maxAmount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= maxAmount; i++) {
    for (const coin of denominations) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  let totalCoins = 0;
  let maxCoins = 0;

  for (let amount = 1; amount <= N; amount++) {
    let minCoins = Infinity;

    for (let pay = amount; pay <= maxAmount; pay++) {
      const coinsToPay = dp[pay];
      const change = pay - amount;
      const coinsToChange = dp[change];

      const total = coinsToPay + coinsToChange;
      if (total < minCoins) {
        minCoins = total;
      }
    }

    totalCoins += minCoins;
    if (minCoins > maxCoins) {
      maxCoins = minCoins;
    }
  }

  const average = (totalCoins / N).toFixed(2);
  return `${average} ${maxCoins}`;
}

function handleOptimalExchange() {
  const input = document.getElementById('inputText').value.trim();
  const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
  const T = parseInt(lines[0]);

  if (T > (lines.length - 1)) {
    alert('No coincide el numero de pruebas...')
  }

  const output = [];

  for (let i = 1; i <= T; i++) {
    const [N, K, ...coins] = lines[i].split(' ').map(Number);
    output.push(optimalExchange(N, coins));
  }

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = output.map(r => `<div>${r}</div>`).join('');
  outputDiv.classList.remove('d-none');
}
