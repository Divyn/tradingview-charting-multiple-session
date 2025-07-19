import React, { useEffect, useRef, useState } from "react";
import { widget } from "./charting_library";
import { ohlcCache } from "./ohlcCache";
import Datafeed from "./custom_datafeed";

const TVChartContainer = () => {
  const chartContainerRef = useRef(null);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    async function loadDataAndInitChart() {
      try {
        const res = await fetch("/ohlc.json");

        if (!res.ok) {
          throw new Error(`Failed to fetch ohlc.json: HTTP ${res.status}`);
        }

        const contentType = res.headers.get("Content-Type");
        if (!contentType?.includes("application/json")) {
          const html = await res.text();
          console.error(
            "Unexpected content. Got HTML instead of JSON:\n",
            html.slice(0, 200)
          );
          throw new Error("Expected JSON, got HTML");
        }

        const json = await res.json();
        for (const key in json) {
          json[key] = json[key].map((bar) => ({
            ...bar,
            time: Math.floor(bar.time / 1000),
          }));
        }
        Object.assign(ohlcCache, json);

        const urlParams = new URLSearchParams(window.location.search);
        const baseMint = urlParams.get("base");
        const quoteMint = urlParams.get("quote");
        const displaySymbol = `${baseMint}/${quoteMint}`;

        const container = chartContainerRef.current;
        if (!container) {
          console.error("Chart container not found.");
          return;
        }

        const widgetOptions = {
          symbol: displaySymbol,
          datafeed: {
            ...Datafeed,
            baseMint,
            quoteMint,
          },
          interval: "1",
          container,
          library_path: "/charting_library/",
          locale: "en",
          theme: "dark",
          fullscreen: false,
          autosize: true,

          disabled_features: [
            "header_symbol_search",
            "header_compare",
            "header_saveload",
            "timeframes_toolbar",
            "volume_force_overlay",
            "show_interval_dialog_on_key_press",
            "save_chart_properties_to_local_storage",
            "use_localstorage_for_settings",
            "chart_save_load",
          ],

          enabled_features: ["study_templates", "left_toolbar", "countdown"],

          overrides: {
            "paneProperties.background": "#1E1E1E",
            "symbolWatermarkProperties.color": "rgba(0, 0, 0, 0)",
            "scalesProperties.lineColor": "#555",
            "scalesProperties.textColor": "#FFFFFF",
            "mainSeriesProperties.candleStyle.upColor": "#26a69a",
            "mainSeriesProperties.candleStyle.downColor": "#ef5350",
          },

          supported_resolutions: ["1", "5", "15", "30", "60", "1D", "1W", "1M"],
        };

        const tvWidget = new widget(widgetOptions);

        setDataReady(true);

        return () => tvWidget.remove();
      } catch (err) {
        console.error("❌ Failed to load or initialize chart:", err);
      }
    }

    loadDataAndInitChart();
  }, []);

  return (
    <>
      {!dataReady && <div>Loading chart...</div>}
      <div ref={chartContainerRef} style={{ height: "600px", width: "100%" }} />
    </>
  );
};

export default TVChartContainer;
