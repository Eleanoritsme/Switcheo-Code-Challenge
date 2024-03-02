(async function populateSelects() {
  if (typeof ccxt === 'undefined') {
    console.log('ccxt not loaded');
    return;
  }

  let exchangeId = 'binance';
  let exchangeClass = ccxt[exchangeId];
  let exchange = new exchangeClass({
    'timeout': 30000,
    'enableRateLimit': true,
  });

  try {
    await exchange.loadMarkets();

    let currencies = Object.keys(exchange.currencies);

    let paySelect = document.getElementById('currencySelect');
    let receiveSelect = document.getElementById('receiveCurrencySelect');
    currencies.forEach((currency) => {
      let payOption = document.createElement('option');
      payOption.value = currency;
      payOption.text = currency;
      paySelect.appendChild(payOption);

      let receiveOption = document.createElement('option');
      receiveOption.value = currency;
      receiveOption.text = currency;
      receiveSelect.appendChild(receiveOption);
    });
  } catch (error) {
    console.error('Error loading markets: ', error);
  }
})();

async function getExchangeRate(baseCurrency, quoteCurrency) {
  let exchangeId = 'binance';
  let exchangeClass = ccxt[exchangeId];

  
  let exchange = new exchangeClass({
    'timeout': 30000,
    'enableRateLimit': true,
  });

  await exchange.loadMarkets();
  const symbol = `${baseCurrency}/${quoteCurrency}`;
  try {
    const ticker = await exchange.fetchTicker(symbol);
    return ticker.last;
  } catch (error) {
    console.error(`Error fetching ticker for ${symbol}: `, error);
    throw error;
  }
}

async function calculateSwapValue() {
  const payCurrency = document.getElementById('currencySelect').value;
  const receiveCurrency = document.getElementById('receiveCurrencySelect').value;
  const payAmount = parseFloat(document.getElementById('amountInput').value);
  
  if (isNaN(payAmount)) {
    alert('Please enter a valid amount to pay.');
    return;
  }

  const payCurrencyPriceInUSDT = await getExchangeRate(payCurrency, 'USDT');
  const receiveCurrencyPriceInUSDT = await getExchangeRate(receiveCurrency, 'USDT');

  const exchangeRate = payCurrencyPriceInUSDT / receiveCurrencyPriceInUSDT;

  const receiveAmount = payAmount * exchangeRate;

  document.getElementById('receiveAmountInput').value = receiveAmount.toFixed(6); // Adjust the precision as needed
}

async function calculateAndDisplayRates() {
  const payCurrency = document.getElementById('currencySelect').value;
  const receiveCurrency = document.getElementById('receiveCurrencySelect').value;
  
  try {
    const payCurrencyPriceInUSDT = await getExchangeRate(payCurrency, 'USDT');
    const receiveCurrencyPriceInUSDT = await getExchangeRate(receiveCurrency, 'USDT');
    const exchangeRate = payCurrencyPriceInUSDT / receiveCurrencyPriceInUSDT;
    
    document.querySelector('.exchange_rate').textContent = `1 ${payCurrency} = ${exchangeRate.toFixed(6)} ${receiveCurrency}`;
  } catch (error) {
    console.error('Error calculating or displaying rates: ', error);
    document.querySelector('.exchange_rate').textContent = 'Error getting exchange rate.';
  }
}

document.getElementById('getExchangeRateButton').addEventListener('click', async () => {
  await calculateSwapValue();
  await calculateAndDisplayRates();
});

function resetForm() {
  document.getElementById('amountInput').value = '';
  document.getElementById('receiveAmountInput').value = '';
  
  document.getElementById('currencySelect').selectedIndex = 0;
  document.getElementById('receiveCurrencySelect').selectedIndex = 0;

  document.querySelector('.exchange_rate').textContent = '';
  
  const detailsSelect = document.getElementById('swapDetails');
  if (detailsSelect) {
    detailsSelect.innerHTML = '';
  }
}

document.getElementById('resetButton').addEventListener('click', resetForm);

function swapCurrencies() {
  const currencySelect = document.getElementById('currencySelect');
  const receiveCurrencySelect = document.getElementById('receiveCurrencySelect');
  
  const tempCurrency = currencySelect.value;
  
  currencySelect.value = receiveCurrencySelect.value;
  receiveCurrencySelect.value = tempCurrency;

  if (currencySelect.value === receiveCurrencySelect.value) {
      console.warn("Swap was ineffective, currencies might be identical or an error occurred.");
  }
}

document.getElementById('exchangeButton').addEventListener('click', async () => {
  await swapCurrencies();
  await calculateSwapValue();
  await calculateAndDisplayRates()});
