import { ohlcCache } from "./ohlcCache";

export const getBars = async (
  symbolInfo,
  resolution,
  periodParams,
  onHistoryCallback,
  onErrorCallback
) => {
  try {
    const [baseMint, quoteMint] = symbolInfo.name.split("/");
    const pairKey = `${baseMint}/${quoteMint}`;
    const allBars = ohlcCache[pairKey] || [];
    allBars.forEach(bar => {
      if (bar.time < 10000000000) { // rough check: if it's in seconds
        bar.time = bar.time * 1000;
      }
    });
    console.log(`[getBars]: Total bars in cache: ${allBars.length}`);

    // Assume bars are sorted oldest to newest
    const newestBarTimeSec = Math.floor(allBars[allBars.length - 1]?.time / 1000 || 0);
    if (periodParams.to < newestBarTimeSec) {
      // Requested time is older than data, no point continuing
      console.log("Returning noData: true (past requested)");
      setTimeout(() => onHistoryCallback([], { noData: true }), 0);
      return;
    }

    // Return full data once
    setTimeout(() => {
      onHistoryCallback(allBars, { noData: false });
    }, 0);
  } catch (err) {
    console.error("[getBars] Error:", err);
    onErrorCallback(err);
  }
};


export const subscribeBars = (
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscriberUID,
  onResetCacheNeededCallback
) => {
  //  Implement real-time updates here if needed
};

export const unsubscribeBars = (subscriberUID) => {
  //  Clean up if you add subscriptions
};
