import * as getagent from '@bitget-ai/getagent-skill';

const PLAYBOOK_API_KEY = '3aee01b2934d4afb9cf70e2f6fc3d28c';

const MARKETS = Object.freeze([
  {
    id: 'btc',
    symbol: 'BITGET:BTCUSDT',
    label: 'Bitcoin',
    class: 'crypto',
    adaptation: {
      stopLoss: '1.5x 4H ATR',
      filters: ['funding_rate_abs_pct < 0.05'],
    },
  },
  {
    id: 'xau',
    symbol: 'BITGET:XAUUSDT',
    label: 'Gold',
    class: 'cfd_metals',
    adaptation: {
      stopLoss: '1.5x 4H ATR',
      filters: ['trade_london_open', 'trade_new_york_open', 'skip_asian_session'],
    },
  },
  {
    id: 'oil',
    symbol: 'BITGET:OILUSDT',
    label: 'WTI Oil',
    class: 'cfd_energy',
    adaptation: {
      stopLoss: '1.5x 4H ATR',
      filters: ['parabolic_sar_confirms_trend', 'pause_during_eia_inventory_event_window'],
    },
  },
  {
    id: 'spx',
    symbol: 'BITGET:SPX500USDT',
    label: 'S&P 500 Index',
    class: 'stock_index',
    adaptation: {
      stopLoss: '1.5x 4H ATR',
      filters: ['daily_ema_50_bounce', 'earnings_gap_shield', 'macro_gap_shield'],
    },
  },
]);

const getClawConfluenceRules = Object.freeze({
  doctrine: 'GetClaw multi-timeframe confluence',
  trendAndEntryBias: {
    longBiasTimeframe: '1D',
    longBiasCondition: 'EMA_20 > EMA_50 > EMA_200',
    entryTimeframe: '4H',
    entryTrigger: [
      'price_pulls_back_to_ema_20_or_ema_50',
      'volume_spike_confirms_participation',
      'rsi_between_40_and_60',
    ],
    shortBias: 'disabled_for_hackathon_release',
  },
  riskAndPositionSizing: {
    equityRiskPerTradePct: 1.0,
    stopDistance: '1.5x_4H_ATR',
    positionSizingFormula:
      'position_size = account_equity * 0.01 / abs(entry_price - stop_loss_price)',
    maxConcurrentExposure: 'one_active_trade_per_asset',
    portfolioIntent: 'asymmetric_yield_generation_with_controlled_downside',
  },
  partialProfitAndBreakevenLock: {
    firstTarget: '2R',
    harvestPctAtFirstTarget: 50,
    breakevenAction: 'move_stop_loss_to_entry_immediately_after_2R_fill',
    stateAfterBreakeven: 'FREE_TRADE',
    runnerPct: 50,
    trailingStop: 'Parabolic_SAR',
    runnerTarget: '4R_or_better',
  },
  circuitBreaker: {
    enabled: true,
    dailyEquityLossLimitPct: 2.0,
    triggerCondition: 'daily_realized_and_unrealized_equity_pnl_pct <= -2.0',
    breachActions: [
      'cancel_open_orders',
      'flatten_active_positions',
      'lock_new_execution_for_24_hours',
      'write_circuit_breaker_audit_event',
    ],
    lockoutHours: 24,
  },
});

const assetSpecificAdaptations = Object.freeze({
  BTC: {
    symbol: 'BITGET:BTCUSDT',
    rules: [
      'use_1_5x_4H_ATR_stop_loss',
      'allow_entries_only_when_abs_funding_rate_pct_less_than_0_05',
    ],
  },
  XAU: {
    symbol: 'BITGET:XAUUSDT',
    rules: [
      'allow_entries_only_during_london_open_and_new_york_open',
      'skip_asian_session_entries',
    ],
  },
  OIL: {
    symbol: 'BITGET:OILUSDT',
    rules: [
      'require_parabolic_sar_trend_confirmation',
      'pause_entries_during_eia_inventory_event_window',
    ],
  },
  SPX: {
    symbol: 'BITGET:SPX500USDT',
    rules: [
      'require_1D_EMA_50_bounce_filter',
      'block_entries_when_earnings_or_macro_gap_shield_is_active',
    ],
  },
});

const playbookDefinition = Object.freeze({
  apiKey: PLAYBOOK_API_KEY,
  name: 'the-morning-sword',
  version: '1.0.0',
  track: 'Track 1 - Trading Agent',
  strategy: {
    codename: 'The Morning Sword',
    type: 'offensive_multi_asset_asymmetric_yield_generator',
    venue: 'Bitget Playbook',
    thesis:
      'Use GetClaw multi-timeframe confluence to attack only aligned, liquid pullbacks across crypto, gold, oil, and stock index exposure.',
    markets: MARKETS,
    rules: getClawConfluenceRules,
    assetSpecificAdaptations,
  },
  executionPlan: {
    scanCadence: '4H_close',
    signalValidation: [
      'confirm_1D_ema_stack',
      'confirm_4H_pullback_to_ema_20_or_ema_50',
      'confirm_volume_spike',
      'confirm_rsi_40_to_60',
      'apply_asset_specific_filters',
      'size_position_from_1pct_equity_risk_and_1_5x_ATR_stop',
      'place_bracket_order_with_2R_partial_and_4R_runner',
    ],
    orderManagement: [
      'take_50pct_profit_at_2R',
      'move_stop_loss_to_breakeven_after_first_target_fill',
      'trail_remaining_50pct_with_parabolic_sar',
      'respect_daily_negative_2pct_equity_circuit_breaker',
    ],
  },
  backtest: {
    enabled: true,
    mode: 'multi_asset_walk_forward',
    symbols: MARKETS.map((market) => market.symbol),
    objectives: [
      'validate_confluence_quality_by_asset_class',
      'measure_asymmetric_payoff_after_2R_partial_profit',
      'stress_test_2pct_daily_loss_lockout',
      'publish_per_asset_and_portfolio_level_metrics',
    ],
  },
  publish: {
    enabled: true,
    destination: 'Bitget Playbook ecosystem',
    visibility: 'public-hackathon-submission',
    tags: [
      'the-morning-sword',
      'getclaw',
      'bitget',
      'track-1',
      'trading-agent',
      'multi-asset',
      'asymmetric-yield',
    ],
  },
});

function resolveCreatePlaybook() {
  const createPlaybook = getagent.createPlaybook ?? getagent.default?.createPlaybook;

  if (typeof createPlaybook !== 'function') {
    const exportedNames = Object.keys(getagent).sort().join(', ') || 'none';
    throw new TypeError(
      `Expected getagent.createPlaybook from @bitget-ai/getagent-skill. Available exports: ${exportedNames}`,
    );
  }

  return createPlaybook;
}

async function createDeploymentPhase(createPlaybook, phase) {
  console.log(`[the-morning-sword] ${phase.toUpperCase()} started`);

  const result = await createPlaybook({
    ...playbookDefinition,
    deployment: {
      phase,
      requestedAt: new Date().toISOString(),
      requestedBy: 'lobias008',
    },
  });

  if (result?.ok === false || result?.status === 'failed' || result?.error) {
    throw new Error(`Bitget Playbook ${phase} failed: ${JSON.stringify(result)}`);
  }

  console.log(`[the-morning-sword] ${phase.toUpperCase()} completed`);
  return result;
}

async function deploy() {
  const createPlaybook = resolveCreatePlaybook();
  const phases = ['compile', 'backtest', 'publish'];
  let finalResult = null;

  console.log('The Morning Sword deployment initializing.');
  console.log(`Markets: ${MARKETS.map((market) => market.symbol).join(', ')}`);
  console.log('Core bias: 1D EMA 20 > EMA 50 > EMA 200; 4H EMA pullback + volume spike + RSI 40-60.');
  console.log('Risk: 1.0% equity per trade, 1.5x ATR stop, 2R half-profit, breakeven lock, SAR runner.');
  console.log('Circuit breaker: -2.0% daily equity loss creates a 24-hour execution lockout.');

  for (const phase of phases) {
    finalResult = await createDeploymentPhase(createPlaybook, phase);
  }

  return finalResult;
}

deploy()
  .then((result) => {
    console.log('[the-morning-sword] Bitget Playbook deployment completed.');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error('[the-morning-sword] deployment failed.');
    console.error(error instanceof Error ? error.stack : error);
    process.exitCode = 1;
  });
