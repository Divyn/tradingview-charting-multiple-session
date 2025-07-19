import { ohlcCache } from "./ohlcCache";

/**
 * Fetch historical OHLC data from the local in-memory cache.
 *
 * @param {string} baseMint - Mint address of the base token
 * @param {string} quoteMint - Mint address of the quote token
 * @param {number} intervalInSeconds - Candle resolution in seconds (default: 60s)
 * @returns {Promise<Array>} - Array of bar objects
 */
export async function fetchHistoricalData(
  baseMint,
  quoteMint,
  intervalInSeconds = 60
) {
  const [tokenA, tokenB] = [baseMint, quoteMint].sort(); // ensures consistent key
  const pairKey = `${tokenA}/${tokenB}`;

  console.log(`[fetchHistoricalData] Fetching data for pair ${pairKey}`);
  const bars = ohlcCache[pairKey];

  if (!bars || bars.length === 0) {
    console.warn(`[fetchHistoricalData] No data found for pair ${pairKey}`);
    return [];
  }

  // Convert from milliseconds to seconds
  const normalizedBars = bars
  .map(bar => {
    const isMilliseconds = bar.time > 1e12; // epoch in ms is > 1,000,000,000,000
    const normalizedTime = isMilliseconds ? Math.floor(bar.time / 1000) : bar.time;

    return {
      ...bar,
      time: normalizedTime,
    };
  })
  .reverse();

  return normalizedBars;
}
