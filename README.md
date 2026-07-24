Where Agent 47 acts as the ultimate protective shield, The Morning Sword is the offensive blade—slicing through market noise across Crypto, Gold, Oil, and Stocks using GetClaw multi-timeframe confluence.

# The Morning Sword

**Track:** Track 1 - Trading Agent  
**Venue:** Bitget Playbook  
**SDK:** `@bitget-ai/getagent-skill`  
**Symbols:** `BITGET:BTCUSDT`, `BITGET:XAUUSDT`, `BITGET:OILUSDT`, `BITGET:SPX500USDT`

## Executive Summary

The Morning Sword is an offensive, multi-asset asymmetric yield generator. It waits for the 1D trend to align, attacks only 4H pullbacks with participation and RSI confirmation, and then turns winners into protected runners through a 2R partial profit, immediate breakeven stop, and Parabolic SAR trailing logic.

The system is designed around precision rather than trade frequency. Every position is sized from a fixed 1.0% equity risk budget against a 1.5x 4H ATR stop. A hard -2.0% daily equity loss circuit breaker cancels orders, flattens active exposure, and locks execution for 24 hours.

## GetClaw Multi-Asset Rules Table

| Asset | Symbol | Trend Bias | Entry Trigger | Asset Adaptation |
| --- | --- | --- | --- | --- |
| Bitcoin | `BITGET:BTCUSDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | 1.5x 4H ATR stop; funding filter requires `abs(rate) < 0.05%` |
| Gold | `BITGET:XAUUSDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | Trade London and New York opens only; skip Asian session |
| WTI Oil | `BITGET:OILUSDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | Require Parabolic SAR trend confirmation; pause around EIA inventory events |
| S&P 500 | `BITGET:SPX500USDT` | 1D EMA 20 > EMA 50 > EMA 200 | 4H EMA 20/50 pullback + volume spike + RSI 40-60 | Require 1D EMA 50 bounce; block earnings and macro gap risk |

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

Validate the deployment script:

```powershell
npm run check
```

Backtest and publish to the Bitget Playbook ecosystem:

```powershell
npm run deploy
```

Direct execution:

```powershell
node index.js
```

## Deployment Notes

The deployment script imports `@bitget-ai/getagent-skill`, embeds the supplied Playbook API key, builds a full GetClaw strategy definition, and calls `getagent.createPlaybook` through compile, backtest, and publish phases.

Trading is risky. This project is a hackathon strategy implementation and should be reviewed with isolated credentials, exchange permissions, and conservative execution limits before live use.
