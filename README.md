Where Agent 47 acts as the ultimate protective shield, The Morning Sword is the offensive blade—slicing through market noise across Crypto, Gold, Oil, and Stocks using GetClaw multi-timeframe confluence.

# The Morning Sword

**Track:** Track 1 - Trading Agent  
**Venue:** Bitget Playbook  
**SDK:** `@bitget-ai/getagent-skill`  
**Requested Symbols:** `BITGET:BTCUSDT`, `BITGET:XAUUSDT`, `BITGET:OILUSDT`, `BITGET:SPX500USDT`  
**Confirmed Playbook Symbols:** `BTCUSDT`, `XAUUSDT`, `AXTIUSDT`, `SP500USDT`

## Executive Summary

The Morning Sword is an offensive, multi-asset asymmetric yield generator. It waits for the 1D trend to align, attacks only 4H pullbacks with participation and RSI confirmation, and then turns winners into protected runners through a 2R partial profit, immediate breakeven stop, and Parabolic SAR trailing logic.

The system is designed around precision rather than trade frequency. Every position is sized from a fixed 1.0% equity risk budget against a 1.5x 4H ATR stop. A hard -2.0% daily equity loss circuit breaker cancels orders, flattens active exposure, and locks execution for 24 hours.

## 策略 / Strategy

The strategy scans confirmed Bitget contract symbols and emits signal-only Playbook decisions. It uses 1D EMA 20/50/200 alignment for higher-timeframe bias and only considers 4H pullbacks when participation and RSI confirm that the pullback is orderly rather than broken.

## 开仓 / Entry

Long entries require 1D EMA 20 > EMA 50 > EMA 200, a 4H pullback into the EMA 20/50 zone, three consecutive volume-spike candles, and RSI between 40 and 60. BTC additionally requires absolute funding below 0.05%; Gold is gated to London and New York sessions; Oil proxy exposure requires Parabolic SAR confirmation.

## 平仓 / Exit

The first exit harvests 50% of the position at 1:2 R:R. Immediately after that partial fill, the stop loss moves to entry and the remaining position becomes a Free Trade. The runner is trailed with Parabolic SAR toward 1:4+ R:R.

## 风险 / Risk

Each trade is sized from a strict 1.0% equity risk budget using a 1.5x ATR stop. If reported daily equity loss reaches -2.0%, the circuit breaker emits a portfolio hold signal, cancels new entries, and marks execution as locked for 24 hours.

## GetClaw Multi-Asset Rules Table

| Asset | Symbol | Trend Bias | Entry Trigger | Asset Adaptation |
| --- | --- | --- | --- | --- |
| Bitcoin | `BITGET:BTCUSDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | 1.5x 4H ATR stop; funding filter requires `abs(rate) < 0.05%` |
| Gold | `BITGET:XAUUSDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | Trade London and New York opens only; skip Asian session |
| WTI Oil proxy | `BITGET:AXTIUSDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | Require Parabolic SAR trend confirmation; requested `OILUSDT` was not found in Bitget public contracts |
| S&P 500 | `BITGET:SP500USDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | Require 1D EMA 50 bounce; requested `SPX500USDT` was not found in Bitget public contracts |

## Risk Management Matrix

| Risk Control | Rule | Action |
| --- | --- | --- |
| Position sizing | Fixed 1.0% account equity risk per trade | Size from stop distance: equity x 1.0% / 1.5x ATR risk |
| Initial stop | 1.5x 4H ATR | Place stop at volatility-adjusted invalidation |
| Partial profit | First target at 1:2 R:R | Harvest 50% of the position |
| Breakeven lock | Immediately after 2R partial fill | Move stop loss to entry and mark the trade as a Free Trade |
| Runner management | Remaining 50% | Trail with Parabolic SAR toward 1:4+ R:R |
| Daily circuit breaker | -2.0% daily equity loss | Cancel orders, flatten positions, lock execution for 24 hours |

## Local Deployment

Install dependencies:

```powershell
npm install
```

Validate the JavaScript wrapper:

```powershell
npm run check
```

Validate the Playbook package:

```powershell
$env:PYTHONIOENCODING='utf-8'
python node_modules\@bitget-ai\getagent-skill\skills\getagent\scripts\validate.py .
```

Run the JavaScript wrapper:

```powershell
node index.js
```

## Deployment Notes

The Playbook package is defined by `manifest.yaml` and `src/main.py`. The JavaScript wrapper remains in the repository for the original hackathon deployment shape, but the installable GetAgent package itself is the Python Playbook package.

Trading is risky. This project is a hackathon strategy implementation and should be reviewed with isolated credentials, exchange permissions, and conservative execution limits before live use.
