# TradingView Charting For Crypto Data with Multiple Tabs

This project uses the TradingView charting library with a custom datafeed built using the Bitquery OHLC API. It supports multiple trading sessions and displays historical OHLC data using a local cache mechanism.

## Features

📊 Custom TradingView chart setup

🔁 Multi-session trading support (24x7)

⏱️ Supports multiple time resolutions: 1, 5, 15, 30, 60, 1D, 1W, 1M

🧠 Caching of historical OHLC data using in-memory ohlcCache

🧪 JSON-based data loading from `/ohlc.json`

## File Structure

src/
├── App.js # Entry point with chart container
├── TVChartContainer.js # Chart initialization and layout
├── custom_datafeed.js # Core TradingView-compatible datafeed
├── getBars.js # Handles bar retrieval and real-time update stubs
├── histOHLC.js # Loads historical OHLC data from cache
├── ohlcCache.js # Global in-memory cache for OHLC data
├── resolveSymbol.js # Symbol resolution using URL params
└── onReady.js # TradingView datafeed's onReady implementation

## Installation & Setup

1.  Clone this repository:

    ```bash
    git clone https://github.com/your-username/tradingview-bitquery-chart.git
    cd tradingview-bitquery-chart

    ```

2.  Install dependencies:

    ```bash
    npm install

    ```

3.  Add `ohlc.json` in the public folder:

    - The file should contain OHLC bars keyed by trading pairs:

      ```json
      {
        "TOKENA/TOKENB": [
          { "time": 1620000000, "open": 1.23, "high": 1.5, "low": 1.1, "close": 1.4, "volume": 1000 },
          ...
        ]
      }

      ```

4.  Start the development server:

    ```bash
    npm start

    ```

5.  Open your browser at:

    ```
    http://localhost:3000/?base=TOKENA&quote=TOKENB

    ```
