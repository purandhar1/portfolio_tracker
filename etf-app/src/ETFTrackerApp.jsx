import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================================
// ETF Tracker — Updated Frontend (connects to Express Proxy)
// Full 100 ETF List Included
// ============================================================

const API_BASE = '/api';

const ETF_LIST = [
  { symbol: 'ITBEES', yahooSymbol: 'ITBEES.NS', underlying: 'Nifty IT TRI' },
  { symbol: 'NIFTYBEES', yahooSymbol: 'NIFTYBEES.NS', underlying: 'Nifty 50' },
  { symbol: 'METALIETF', yahooSymbol: 'METALIETF.NS', underlying: 'Nifty Metal Index' },
  { symbol: 'PHARMABEES', yahooSymbol: 'PHARMABEES.NS', underlying: 'Nifty Pharma TRI' },
  { symbol: 'MIDCAPETF', yahooSymbol: 'MIDCAPETF.NS', underlying: 'Mirae Asset Nifty Midcap 150 ETF' },
  { symbol: 'PVTBANIETF', yahooSymbol: 'PVTBANIETF.NS', underlying: 'Nifty Private Bank Index' },
  { symbol: 'MODEFENCE', yahooSymbol: 'MODEFENCE.NS', underlying: 'Nifty India Defence TRI' },
  { symbol: 'SMALLCAP', yahooSymbol: 'SMALLCAP.NS', underlying: 'Mirae Asset Nifty Smallcap 250 Momentum Quality 100 ETF' },
  { symbol: 'HDFCSML250', yahooSymbol: 'HDFCSML250.NS', underlying: 'HDFC NIFTY Smallcap 250 ETF' },
  { symbol: 'PSUBNKBEES', yahooSymbol: 'PSUBNKBEES.NS', underlying: 'Nifty PSU Bank' },
  { symbol: 'ALPHA', yahooSymbol: 'ALPHA.NS', underlying: 'NIFTY Alpha 50 Index' },
  { symbol: 'QUAL30IETF', yahooSymbol: 'QUAL30IETF.NS', underlying: 'ICICI Prudential Nifty 200 Quality 30 ETF' },
  { symbol: 'ALPL30IETF', yahooSymbol: 'ALPL30IETF.NS', underlying: 'Nifty Alpha Low-Volatility 30 Index' },
  { symbol: 'SML100CASE', yahooSymbol: 'SML100CASE.NS', underlying: 'Nifty Smallcap 100 Index' },
  { symbol: 'NEXT50IETF', yahooSymbol: 'NEXT50IETF.NS', underlying: 'Nifty Next 50' },
  { symbol: 'MONIFTY500', yahooSymbol: 'MONIFTY500.NS', underlying: 'Motilal Oswal Nifty 500 ETF' },
  { symbol: 'TOP100CASE', yahooSymbol: 'TOP100CASE.NS', underlying: 'Zerodha Nifty 100 ETF' },
  { symbol: 'MOMENTUM50', yahooSymbol: 'MOMENTUM50.NS', underlying: 'Nifty 500 Momentum 50 TRI' },
  { symbol: 'BANKBEES', yahooSymbol: 'BANKBEES.NS', underlying: 'Nifty Bank' },
  { symbol: 'MOM30IETF', yahooSymbol: 'MOM30IETF.NS', underlying: 'ICICI Prudential Nifty 200 Momentum 30 ETF' },
  { symbol: 'FMCGIETF', yahooSymbol: 'FMCGIETF.NS', underlying: 'Nifty FMCG Index' },
  { symbol: 'CPSEETF', yahooSymbol: 'CPSEETF.NS', underlying: 'CPSE ETF' },
  { symbol: 'OILIETF', yahooSymbol: 'OILIETF.NS', underlying: 'Nifty Oil & Gas Index' },
  { symbol: 'GROWWPOWER', yahooSymbol: 'GROWWPOWER.NS', underlying: 'BSE Power Index - TRI' },
  { symbol: 'MON100', yahooSymbol: 'MON100.NS', underlying: 'Nasdaq100' },
  { symbol: 'MOM100', yahooSymbol: 'MOM100.NS', underlying: 'Nifty Midcap 100' },
  { symbol: 'MOREALTY', yahooSymbol: 'MOREALTY.NS', underlying: 'Motilal Oswal Nifty Realty ETF' },
  { symbol: 'LOWVOLIETF', yahooSymbol: 'LOWVOLIETF.NS', underlying: 'Nifty 100 Low Volatility 30 Index' },
  { symbol: 'MIDCAP', yahooSymbol: 'MIDCAP.NS', underlying: 'Nifty Midcap 50 Index' },
  { symbol: 'FINIETF', yahooSymbol: 'FINIETF.NS', underlying: 'ICICI Prudential Nifty Financial Services Ex-Bank ETF' },
  { symbol: 'AUTOIETF', yahooSymbol: 'AUTOIETF.NS', underlying: 'Nifty Auto Index' },
  { symbol: 'MULTICAP', yahooSymbol: 'MULTICAP.NS', underlying: 'Nifty500 Multicap 50:25:25 Index' },
  { symbol: 'ALPHAETF', yahooSymbol: 'ALPHAETF.NS', underlying: 'Mirae Asset Nifty 200 Alpha 30 ETF' },
  { symbol: 'MIDSMALL', yahooSymbol: 'MIDSMALL.NS', underlying: 'Mirae Asset Nifty MidSmallcap400 Momentum Quality 100 ETF' },
  { symbol: 'VAL30IETF', yahooSymbol: 'VAL30IETF.NS', underlying: 'Nifty200 Value 30 Index' },
  { symbol: 'MOCAPITAL', yahooSymbol: 'MOCAPITAL.NS', underlying: 'Nifty Capital Market TRI' },
  { symbol: 'TOP10ADD', yahooSymbol: 'TOP10ADD.NS', underlying: 'Nifty Top 10 Equal Weight Index' },
  { symbol: 'ICICIB22', yahooSymbol: 'ICICIB22.NS', underlying: 'S&P BSE BHARAT 22 index' },
  { symbol: 'BSE500IETF', yahooSymbol: 'BSE500IETF.NS', underlying: 'S&P BSE 500 index' },
  { symbol: 'HEALTHY', yahooSymbol: 'HEALTHY.NS', underlying: 'Nifty Healthcare TRI' },
  { symbol: 'GROWWRAIL', yahooSymbol: 'GROWWRAIL.NS', underlying: 'Nifty India Railways PSU Index' },
  { symbol: 'GROWWNET', yahooSymbol: 'GROWWNET.NS', underlying: 'Index' },
  { symbol: 'MOMENTUM30', yahooSymbol: 'MOMENTUM30.NS', underlying: 'Nifty 200 Momentum 30 Index' },
  { symbol: 'AONETOTAL', yahooSymbol: 'AONETOTAL.NS', underlying: 'Nifty Total Market Index' },
  { symbol: 'MASPTOP50', yahooSymbol: 'MASPTOP50.NS', underlying: 'S&P 500 Top 50 TRI' },
  { symbol: 'NIFTY100EW', yahooSymbol: 'NIFTY100EW.NS', underlying: 'Nifty 100 Equal Weight Index' },
  { symbol: 'INFRAIETF', yahooSymbol: 'INFRAIETF.NS', underlying: 'ICICI Prudential Nifty Infrastructure ETF' },
  { symbol: 'ENERGY', yahooSymbol: 'ENERGY.NS', underlying: 'Nifty Energy' },
  { symbol: 'MIDSELIETF', yahooSymbol: 'MIDSELIETF.NS', underlying: 'S&P BSE Midcap Select Index' },
  { symbol: 'MAFANG', yahooSymbol: 'MAFANG.NS', underlying: 'NYSE FANG+ TRI' },
  { symbol: 'NV20IETF', yahooSymbol: 'NV20IETF.NS', underlying: 'Nifty50 Value 20' },
  { symbol: 'MSCIINDIA', yahooSymbol: 'MSCIINDIA.NS', underlying: 'MSCI India Index' },
  { symbol: 'BFSI', yahooSymbol: 'BFSI.NS', underlying: 'Nifty Financial Services Index' },
  { symbol: 'SBINEQWETF', yahooSymbol: 'SBINEQWETF.NS', underlying: 'Nifty50 Equal Weight' },
  { symbol: 'TOP15IETF', yahooSymbol: 'TOP15IETF.NS', underlying: 'Nifty Top 15 Equal Weight Index' },
  { symbol: 'CHEMICAL', yahooSymbol: 'CHEMICAL.NS', underlying: 'Nifty Chemicals Index (TRI)' },
  { symbol: 'GROWWEV', yahooSymbol: 'GROWWEV.NS', underlying: 'Nifty EV and New Age Automotive Index' },
  { symbol: 'MONQ50', yahooSymbol: 'MONQ50.NS', underlying: 'Nasdaq Q-50 TRI' },
  { symbol: 'AXISVALUE', yahooSymbol: 'AXISVALUE.NS', underlying: 'Nifty500 Value 50 TRI' },
  { symbol: 'HDFCSENSEX', yahooSymbol: 'HDFCSENSEX.NS', underlying: 'SENSEX' },
  { symbol: 'MAHKTECH', yahooSymbol: 'MAHKTECH.NS', underlying: 'Hang Seng TECH TRI' },
  { symbol: 'CONSUMER', yahooSymbol: 'CONSUMER.NS', underlying: 'Nifty India New Age Consumption' },
  { symbol: 'AONETMMQ50', yahooSymbol: 'AONETMMQ50.NS', underlying: 'Nifty Total Market Momentum Quality 50 TRI' },
  { symbol: 'MOMIDMTM', yahooSymbol: 'MOMIDMTM.NS', underlying: 'Nifty Midcap 150 Momentum 50 TRI' },
  { symbol: 'MOVALUE', yahooSymbol: 'MOVALUE.NS', underlying: 'Motilal Oswal S&P BSE Enhanced Value ETF' },
  { symbol: 'GROWWN200', yahooSymbol: 'GROWWN200.NS', underlying: 'Nifty 200 Index- TRI' },
  { symbol: 'CONSUMBEES', yahooSymbol: 'CONSUMBEES.NS', underlying: 'Nifty India Consumption TRI' },
  { symbol: 'GROWWHOSPI', yahooSymbol: 'GROWWHOSPI.NS', underlying: 'BSE Hospitals Index' },
  { symbol: 'ABSLPSE', yahooSymbol: 'ABSLPSE.NS', underlying: 'Aditya Birla Sun Life Nifty PSE ETF' },
  { symbol: 'HNGSNGBEES', yahooSymbol: 'HNGSNGBEES.NS', underlying: 'Hang Seng Index' },
  { symbol: 'DEFENCE', yahooSymbol: 'DEFENCE.NS', underlying: 'BSE India Defence' },
  { symbol: 'MAKEINDIA', yahooSymbol: 'MAKEINDIA.NS', underlying: 'Nifty India Manufacturing TRI' },
  { symbol: 'FLEXIADD', yahooSymbol: 'FLEXIADD.NS', underlying: 'Nifty500 Flexicap Quality 30 TRI' },
  { symbol: 'TNIDETF', yahooSymbol: 'TNIDETF.NS', underlying: 'Nifty India Digital Index' },
  { symbol: 'ELM250', yahooSymbol: 'ELM250.NS', underlying: 'Nifty LargeMidcap 250 TRI' },
];


// ============================================================
// FORMATTING UTILITIES
// ============================================================

function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return num.toFixed(decimals);
}

function formatPercent(num) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
}

function formatCurrency(num) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return `₹${Number(num).toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function calculateMonthlyEMI(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) {
    return principal / months;
  }
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function buildAmortizationSchedule(principal, annualRate, months, stepUpPct, prepayments = []) {
  const baseEmi = calculateMonthlyEMI(principal, annualRate, months);
  const schedule = [];
  let balance = principal;
  let cumulativeInterestSaved = 0;
  const monthlyRate = annualRate / 100 / 12;

  // Build no-prepay schedule for comparison and use same step-ups if requested
  const noPrepaySchedule = [];
  let noBalance = principal;
  for (let i = 0; i < months; i += 1) {
    const yearIndex = Math.floor(i / 12);
    const scheduledEmi = baseEmi * Math.pow(1 + stepUpPct / 100, yearIndex);
    const interest = noBalance * monthlyRate;
    const principalEmi = scheduledEmi - interest;
    const ending = noBalance - principalEmi;
    noPrepaySchedule.push({
      month: i + 1,
      openingBalance: noBalance,
      scheduledEmi,
      interest,
      principalEmi,
      endingBalance: ending > 0 ? ending : 0,
    });
    noBalance = ending > 0 ? ending : 0;
  }

  let loanClosed = false;
  let actualMonths = months;
  let totalInterestWithPrepay = 0;
  let totalPrincipalPrepaid = 0;

  for (let i = 0; i < months; i += 1) {
    const yearIndex = Math.floor(i / 12);
    const scheduledEmi = baseEmi * Math.pow(1 + stepUpPct / 100, yearIndex);
    const openingBalance = balance;
    const interest = balance * monthlyRate;
    const principalEmi = scheduledEmi - interest;
    const rawPrepayment = Number(prepayments[i] || 0);
    const allowedPrepayment = Math.max(0, rawPrepayment);
    const maxPrepayment = Math.max(0, openingBalance - principalEmi);
    const prepayment = loanClosed ? 0 : Math.min(allowedPrepayment, maxPrepayment + 1e-8);
    const endingBalance = loanClosed
      ? 0
      : Math.max(0, openingBalance - principalEmi - prepayment);
    const interestSaved = noPrepaySchedule[i]?.interest - interest;
    cumulativeInterestSaved += loanClosed ? noPrepaySchedule[i]?.interest || 0 : interestSaved;

    if (!loanClosed && endingBalance <= 0.0001) {
      loanClosed = true;
      actualMonths = i + 1;
    }

    schedule.push({
      month: i + 1,
      openingBalance,
      scheduledEmi,
      interest,
      principalEmi,
      prepayment: loanClosed ? 0 : prepayment,
      totalPayment: loanClosed ? 0 : scheduledEmi + prepayment,
      endingBalance,
      cumulativeInterestSaved,
      monthsSaved: Math.max(0, months - actualMonths),
      closed: loanClosed,
      noPrepayInterest: noPrepaySchedule[i]?.interest || 0,
      noPrepayOpeningBalance: noPrepaySchedule[i]?.openingBalance || 0,
      noPrepayPrincipalEmi: noPrepaySchedule[i]?.principalEmi || 0,
      noPrepayEndingBalance: noPrepaySchedule[i]?.endingBalance || 0,
    });

    if (!loanClosed) {
      balance = endingBalance;
      totalInterestWithPrepay += interest;
      totalPrincipalPrepaid += prepayment;
    }
  }

  const originalTotalInterest = noPrepaySchedule.reduce((sum, row) => sum + row.interest, 0);
  const monthsUsed = schedule.findIndex((row) => row.closed) + 1 || months;
  const actualMonthsUsed = monthsUsed || months;
  const monthsSaved = Math.max(0, months - actualMonthsUsed);

  return {
    baseEmi,
    schedule,
    noPrepaySchedule,
    originalTotalInterest,
    totalInterestWithPrepay,
    totalPrincipalPrepaid,
    totalInterestSaved: originalTotalInterest - totalInterestWithPrepay,
    actualMonthsUsed,
    monthsSaved,
    effectiveYears: Math.floor(actualMonthsUsed / 12),
    effectiveMonths: actualMonthsUsed % 12,
    originalMonths: months,
  };
}

const PORTFOLIO_STORAGE_KEY = 'etf-tracker-portfolio';

function normalizeTicker(ticker) {
  return (ticker || '').trim().toUpperCase();
}

function loadPortfolioFromStorage() {
  try {
    const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!stored) return { holdings: [], sold: [] };
    const parsed = JSON.parse(stored);
    // Backwards compatibility: previously stored an array of holdings
    if (Array.isArray(parsed)) {
      return { holdings: parsed, sold: [] };
    }
    return {
      holdings: Array.isArray(parsed.holdings) ? parsed.holdings : [],
      sold: Array.isArray(parsed.sold) ? parsed.sold : [],
    };
  } catch (error) {
    console.warn('Unable to load portfolio from storage:', error.message);
    return { holdings: [], sold: [] };
  }
}

function savePortfolioToStorage(portfolioObj) {
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(portfolioObj));
  } catch (error) {
    console.warn('Unable to save portfolio to storage:', error.message);
  }
}

// Utility: days between two ISO dates
function daysBetween(startIso, endIso) {
  try {
    const s = new Date(startIso);
    const e = endIso ? new Date(endIso) : new Date();
    const diff = e - s;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  } catch (e) {
    return null;
  }
}

// Classify gain type for Indian tax: >365 days => LTCG else STCG
function classifyGain(daysHeld) {
  if (daysHeld === null || daysHeld === undefined) return 'unknown';
  return daysHeld > 365 ? 'LTCG' : 'STCG';
}

// XIRR implementation using Newton-Raphson
function xirr(cashFlows, guess = 0.1) {
  if (!cashFlows || cashFlows.length === 0) return null;
  const toDays = (d) => (new Date(d) - new Date(cashFlows[0].date)) / (1000 * 60 * 60 * 24);
  const npv = (rate) => cashFlows.reduce((sum, cf) => sum + cf.amount / Math.pow(1 + rate, toDays(cf.date) / 365), 0);
  const npvDeriv = (rate) => cashFlows.reduce((sum, cf) => sum - (toDays(cf.date) / 365) * cf.amount / Math.pow(1 + rate, toDays(cf.date) / 365 + 1), 0);
  let rate = guess;
  for (let i = 0; i < 50; i++) {
    const f = npv(rate);
    const fder = npvDeriv(rate);
    if (Math.abs(f) < 1e-6) return rate;
    if (fder === 0) break;
    rate -= f / fder;
    if (!isFinite(rate) || Math.abs(rate) > 1e6) return null;
  }
  return null;
}

async function fetchTickerData(symbol) {
  if (!symbol) return null;
  const ticker = normalizeTicker(symbol);
  try {
    const result = await fetchSingleETFFromBackend(ticker);
    if (result && result.success) {
      return result;
    }
    return { success: false, error: result?.error || 'Quote not found', yahooSymbol: ticker };
  } catch (error) {
    return { success: false, error: error.message, yahooSymbol: ticker };
  }
}

// ============================================================
// DATA FETCHING (via Backend Proxy)
// ============================================================

async function fetchAllETFsFromBackend(symbols) {
  try {
    const response = await fetch(`${API_BASE}/etfs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbols }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.warn('Backend fetch failed:', error.message);
    return null;
  }
}

async function fetchSingleETFFromBackend(symbol) {
  try {
    const response = await fetch(`${API_BASE}/etf/${symbol}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.warn(`Single fetch failed for ${symbol}:`, error.message);
    return null;
  }
}

// ============================================================
// COMPONENTS
// ============================================================

function Header({ title, subtitle }) {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <p style={styles.subtitle}>{subtitle}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ ...styles.statCard, borderLeft: `4px solid ${color}` }}>
      <div style={styles.statLabel}>{label}</div>
      <div style={{ ...styles.statValue, color }}>{value}</div>
    </div>
  );
}

function ProgressBar({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressLabel}>
        {label} <span style={styles.progressCount}>{current}/{total}</span>
      </div>
      <div style={styles.progressBarBg}>
        <div style={{ ...styles.progressBarFill, width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ETFTable({ data, title, rankKey, sortOrder = 'asc', limit, highlightColor, subtitle }) {
  const sorted = useMemo(() => {
    const base = Array.isArray(data) ? [...data] : [];
    if (!rankKey) {
      return limit ? base.slice(0, limit) : base;
    }

    const valid = base.filter(
      (d) => d[rankKey] !== null && d[rankKey] !== undefined
    );

    const sortedData = valid.sort((a, b) => {
      const aValue = a[rankKey];
      const bValue = b[rankKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue);
      }
      return Number(aValue) - Number(bValue);
    });

    if (sortOrder === 'desc') {
      sortedData.reverse();
    }

    return limit ? sortedData.slice(0, limit) : sortedData;
  }, [data, rankKey, sortOrder, limit]);

  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <h3 style={styles.tableTitle}>{title}</h3>
        {subtitle && <p style={styles.tableSubtitle}>{subtitle}</p>}
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Symbol</th>
              <th style={styles.th}>Underlying</th>
              <th style={styles.th}>CMP (₹)</th>
              <th style={styles.th}>20 DMA (₹)</th>
              <th style={styles.th}>% Chg (20DMA vs CMP)</th>
              <th style={styles.th}>52W Low (₹)</th>
              <th style={styles.th}>Dist to 52W Low</th>
              <th style={styles.th}>RSI (14)</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((etf, idx) => (
              <tr
                key={etf.symbol}
                style={{
                  ...styles.tableRow,
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                }}
              >
                <td
                  style={{
                    ...styles.td,
                    fontWeight: 700,
                    color: highlightColor,
                  }}
                >
                  #{idx + 1}
                </td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{etf.symbol}</td>
                <td style={styles.td}>{etf.underlying}</td>
                <td style={styles.td}>₹{formatNumber(etf.cmp)}</td>
                <td style={styles.td}>₹{formatNumber(etf.ma20)}</td>
                <td
                  style={{
                    ...styles.td,
                    color: etf.ma20Change >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  {formatPercent(etf.ma20Change)}
                </td>
                <td style={styles.td}>₹{formatNumber(etf.week52Low)}</td>
                <td style={{ ...styles.td, color: '#2563eb', fontWeight: 600 }}>
                  {formatPercent(etf.distTo52WLow)}
                </td>
                <td style={styles.td}>{formatNumber(etf.rsi, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PortfolioSummary({ stats }) {
  return (
    <div style={styles.statsGrid}>
      <StatCard label="Holdings" value={stats.totalHoldings} color="#0f766e" />
      <StatCard label="Invested" value={`₹${formatNumber(stats.totalInvested)}`} color="#2563eb" />
      <StatCard label="Current Value" value={`₹${formatNumber(stats.totalCurrentValue)}`} color="#16a34a" />
      <StatCard label="Total P&L" value={`₹${formatNumber(stats.totalPL)} (${formatPercent(stats.totalPLPercent)})`} color={stats.totalPL >= 0 ? '#16a34a' : '#dc2626'} />
      <StatCard label="XIRR" value={stats.xirr != null ? formatPercent(stats.xirr * 100) : '—'} color="#8b5cf6" />
    </div>
  );
}

function SoldSummary({ sold }) {
  const totalSold = sold.length;
  const totalProceeds = sold.reduce((s, r) => s + (Number(r.proceeds) || 0), 0);
  const totalProfit = sold.reduce((s, r) => s + (Number(r.profit) || 0), 0);

  // build cashflows across all sold positions for XIRR
  const allCFs = [];
  for (const r of sold) {
    if (Array.isArray(r.transactions)) {
      for (const t of r.transactions) {
        if (t.type === 'buy') allCFs.push({ date: t.date, amount: -t.price * t.quantity });
      }
    }
    if (r.sellDate) allCFs.push({ date: r.sellDate, amount: Number(r.proceeds) || 0 });
  }
  const soldXirr = xirr(allCFs);

  return (
    <>
      <StatCard label="Sold Count" value={totalSold} color="#0f766e" />
      <StatCard label="Total Proceeds" value={`₹${formatNumber(totalProceeds)}`} color="#2563eb" />
      <StatCard label="Total Profit" value={`₹${formatNumber(totalProfit)}`} color={totalProfit >= 0 ? '#16a34a' : '#dc2626'} />
      <StatCard label="Sold XIRR" value={soldXirr != null ? formatPercent(soldXirr * 100) : '—'} color="#8b5cf6" />
    </>
  );
}

function SoldTable({ sold }) {
  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <h3 style={styles.tableTitle}>📦 Sold Positions</h3>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
              <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Ticker</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Buy Date</th>
              <th style={styles.th}>Sell Date</th>
              <th style={styles.th}>Proceeds</th>
              <th style={styles.th}>Profit</th>
              <th style={styles.th}>Days Held</th>
              <th style={styles.th}>Gain Type</th>
              <th style={styles.th}>Sold XIRR</th>
            </tr>
          </thead>
          <tbody>
            {sold.map((s, idx) => (
              <tr key={s.id || `${s.ticker}-${idx}`} style={{ ...styles.tableRow, backgroundColor: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.ticker}</td>
                <td style={styles.td}>{formatNumber(s.quantity, 2)}</td>
                <td style={styles.td}>{s.buyDate || (s.transactions && s.transactions[0] && s.transactions[0].date) || '—'}</td>
                <td style={styles.td}>{s.sellDate || '—'}</td>
                <td style={styles.td}>₹{formatNumber(s.proceeds, 2)}</td>
                <td style={{ ...styles.td, color: s.profit >= 0 ? '#16a34a' : '#dc2626', fontWeight: 600 }}>₹{formatNumber(s.profit, 2)}</td>
                <td style={styles.td}>{s.daysHeld != null ? s.daysHeld : '—'}</td>
                <td style={styles.td}>{s.gainType || '—'}</td>
                <td style={styles.td}>
                  {(() => {
                    const cfs = [];
                    if (Array.isArray(s.transactions)) {
                      for (const t of s.transactions) if (t.type === 'buy') cfs.push({ date: t.date, amount: -t.price * t.quantity });
                    }
                    if (s.sellDate) cfs.push({ date: s.sellDate, amount: Number(s.proceeds) || 0 });
                    const v = xirr(cfs);
                    return v != null ? formatPercent(v * 100) : '—';
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PortfolioForm({ formState, onChange, onSubmit, error, isSubmitting }) {
  return (
    <div style={styles.formCard}>
      <h3 style={styles.tableTitle}>➕ Add New Holding</h3>
      <div style={styles.formGrid}>
        <label style={styles.formLabel}>
          Name
          <input
            style={styles.formInput}
            value={formState.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Company or ETF name"
          />
        </label>
        <label style={styles.formLabel}>
          Ticker
          <input
            style={styles.formInput}
            value={formState.ticker}
            onChange={(e) => onChange('ticker', e.target.value)}
            placeholder="AAPL or NIFTYBEES.NS"
          />
        </label>
        <label style={styles.formLabel}>
          Type
          <select
            style={styles.formInput}
            value={formState.type}
            onChange={(e) => onChange('type', e.target.value)}
          >
            <option value="stock">Stock</option>
            <option value="etf">ETF</option>
          </select>
        </label>
        <label style={styles.formLabel}>
          Buy Price
          <input
            style={styles.formInput}
            type="number"
            min="0"
            step="0.01"
            value={formState.buyPrice}
            onChange={(e) => onChange('buyPrice', e.target.value)}
            placeholder="Buy price"
          />
        </label>
        <label style={styles.formLabel}>
          Buy Date
          <input
            style={styles.formInput}
            type="date"
            value={formState.buyDate}
            onChange={(e) => onChange('buyDate', e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </label>
        <label style={styles.formLabel}>
          Quantity
          <input
            style={styles.formInput}
            type="number"
            min="0"
            step="0.01"
            value={formState.quantity}
            onChange={(e) => onChange('quantity', e.target.value)}
            placeholder="Quantity held"
          />
        </label>
        <label style={styles.formLabelFull}>
          Note
          <textarea
            style={styles.formTextarea}
            value={formState.note}
            onChange={(e) => onChange('note', e.target.value)}
            placeholder="Strategy, entry thesis, or notes"
          />
        </label>
      </div>
      {error && <div style={styles.errorBanner}>{error}</div>}
      <button style={styles.primaryBtn} onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Add to Portfolio'}
      </button>
    </div>
  );
}

  function AverageModal({ visible, values, onChange, onCancel, onSubmit }) {
    if (!visible) return null;
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalCard}>
          <h3 style={{ marginTop: 0 }}>Add Averaging Buy</h3>
          <label style={styles.formLabel}>
            Buy Price
            <input type="number" step="0.01" style={styles.formInput} value={values.price} onChange={(e) => onChange('price', e.target.value)} />
          </label>
          <label style={styles.formLabel}>
            Quantity
            <input type="number" step="0.01" style={styles.formInput} value={values.qty} onChange={(e) => onChange('qty', e.target.value)} />
          </label>
          <label style={styles.formLabel}>
            Buy Date
            <input type="date" style={styles.formInput} value={values.date} onChange={(e) => onChange('date', e.target.value)} />
          </label>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
            <button style={styles.secondaryBtn} onClick={onCancel}>Cancel</button>
            <button style={styles.primaryBtn} onClick={onSubmit}>Add Buy</button>
          </div>
        </div>
      </div>
    );
  }

  function PortfolioTable({ holdings, onSell, onAverage }) {
  const [expanded, setExpanded] = React.useState({});

  const toggleExpanded = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={styles.tableContainer}>
      <div style={styles.tableHeader}>
        <h3 style={styles.tableTitle}>📈 Portfolio Holdings</h3>
      </div>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Ticker</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Days Held</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Avg Buy</th>
              <th style={styles.th}>Current Price</th>
              <th style={styles.th}>Invested</th>
              <th style={styles.th}>Current Value</th>
              <th style={styles.th}>P/L</th>
              <th style={styles.th}>P/L %</th>
              <th style={styles.th}>Note</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, idx) => (
              <tr
                key={holding.id}
                style={{
                  ...styles.tableRow,
                  backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                }}
              >
                <td style={styles.td}>{holding.name || holding.ticker}</td>
                <td style={styles.td}>{holding.ticker}</td>
                <td style={styles.td}>{holding.type}</td>
                <td style={styles.td}>{holding.daysHeld != null ? holding.daysHeld : '—'}</td>
                <td style={styles.td}>{formatNumber(holding.quantity, 2)}</td>
                <td style={styles.td}>
                  ₹{formatNumber(
                    (holding.costBasis && holding.quantity) ? holding.costBasis / holding.quantity : (holding.buyPrice || 0),
                    2
                  )}
                </td>
                <td style={styles.td}>₹{formatNumber(holding.currentPrice, 2)}</td>
                <td style={styles.td}>₹{formatNumber(holding.costBasis, 2)}</td>
                <td style={styles.td}>₹{formatNumber(holding.currentValue, 2)}</td>
                <td
                  style={{
                    ...styles.td,
                    color: holding.pnl >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  ₹{formatNumber(holding.pnl, 2)}
                </td>
                <td
                  style={{
                    ...styles.td,
                    color: holding.pnlPercent >= 0 ? '#16a34a' : '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  {formatPercent(holding.pnlPercent)}
                </td>
                <td style={styles.td}>{holding.note}</td>
                <td style={styles.td}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button style={styles.secondaryBtn} onClick={() => onAverage(holding.id)}>Average</button>
                    <button style={styles.deleteBtn} onClick={() => onSell(holding.id)}>Sell</button>
                    <button style={styles.refreshBtn} onClick={() => toggleExpanded(holding.id)}>{expanded[holding.id] ? 'Hide' : 'Details'}</button>
                  </div>
                  {expanded[holding.id] && (
                    <div style={{ marginTop: 8, background: '#f9fafb', padding: 8, borderRadius: 6 }}>
                      <strong>Transactions</strong>
                      <ul style={{ margin: '8px 0 0 16px' }}>
                        {(holding.transactions || []).map((t, i) => {
                          const avg = holding.costBasis && holding.quantity ? holding.costBasis / holding.quantity : (holding.buyPrice || 0);
                          const pct = avg ? ((t.price - avg) / avg) * 100 : 0;
                          return (
                            <li key={i}>{t.date} — {t.type.toUpperCase()}: ₹{formatNumber(t.price,2)} × {t.quantity} ({formatPercent(pct)})</li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={styles.spinnerContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.spinnerText}>Fetching live market data...</p>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================

export default function ETFTrackerApp() {
  const [etfData, setEtfData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [usingMock, setUsingMock] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);

  // Check if backend is running
  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => r.ok && setBackendConnected(true))
      .catch(() => setBackendConnected(false));
  }, []);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    setFetchProgress(0);

    const symbols = ETF_LIST.map((e) => e.yahooSymbol);

    // Try batch fetch from backend first
    let backendData = await fetchAllETFsFromBackend(symbols);

    if (backendData && backendData.length > 0) {
      // Backend responded — merge with ETF metadata
      const results = ETF_LIST.map((etf) => {
        const fetched = backendData.find(
          (d) => d.yahooSymbol === etf.yahooSymbol
        );
        if (fetched && fetched.success) {
          return {
            ...etf,
            cmp: fetched.cmp,
            ma20: fetched.ma20,
            week52Low: fetched.week52Low,
            rsi: fetched.rsi,
            ma20Change: fetched.ma20Change,
            distTo52WLow: fetched.distTo52WLow,
            source: 'live',
          };
        }
        return null;
      }).filter(Boolean);

      setEtfData(results);
      setFetchProgress(ETF_LIST.length);
      if (results.length < ETF_LIST.length) {
        setErrorMsg(
          `⚠️ Failed to fetch data for ${ETF_LIST.length - results.length} ETFs. Backend rate limit or symbol not found.`
        );
      }
    } else {
      setEtfData([]);
      setFetchProgress(ETF_LIST.length);
      setErrorMsg(
        '⚠️ Backend proxy not running (localhost:3001) or failed to fetch live data. Please start the backend to get data.'
      );
    }

    setUsingMock(false);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Summary stats
  const avgRSI = useMemo(() => {
    const valid = etfData.filter((d) => d.rsi !== null);
    if (valid.length === 0) return 0;
    return valid.reduce((s, d) => s + d.rsi, 0) / valid.length;
  }, [etfData]);

  const below20MA = useMemo(
    // ma20Change is now (CMP - MA20)/MA20; negative means CMP is below MA20
    () => etfData.filter((d) => d.ma20Change < 0).length,
    [etfData]
  );

  const liveCount = useMemo(
    () => etfData.filter((d) => d.source === 'live').length,
    [etfData]
  );

  const [view, setView] = useState('home');
  const [portfolio, setPortfolio] = useState({ holdings: [], sold: [] });
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState('');
  const [portfolioRefreshTime, setPortfolioRefreshTime] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    ticker: '',
    type: 'stock',
    buyPrice: '',
    quantity: '',
    buyDate: new Date().toISOString().split('T')[0],
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avgModal, setAvgModal] = useState({ open: false, id: null, price: '', qty: '', date: new Date().toISOString().split('T')[0] });
  const [loanSettings, setLoanSettings] = useState({
    loanAmount: 5000000,
    interestRate: 8,
    tenureYears: 20,
    stepUpPct: 0,
    oneTimeMonth: '1',
    oneTimeAmount: '1000000',
    recurringAmount: '0',
  });
  const [loanPrepayments, setLoanPrepayments] = useState(() => {
    const months = 20 * 12;
    const items = Array.from({ length: months }, () => 0);
    items[0] = 1000000;
    return items;
  });
  const [loanWarning, setLoanWarning] = useState('');
  const [loanPage, setLoanPage] = useState(0);

  useEffect(() => {
    const stored = loadPortfolioFromStorage();
    setPortfolio(stored);
  }, []);

  

  const portfolioStats = useMemo(() => {
    const holdings = portfolio.holdings || [];
    const totalHoldings = holdings.length;
    const totalInvested = holdings.reduce((sum, holding) => sum + (Number(holding.costBasis) || 0), 0);
    const totalCurrentValue = holdings.reduce((sum, holding) => sum + (Number(holding.currentValue) || 0), 0);
    const totalPL = totalCurrentValue - totalInvested;
    const totalPLPercent = totalInvested ? (totalPL / totalInvested) * 100 : 0;

    // build cashflows for XIRR: buys are negative, sells are positive, current value as final positive
    const cfs = [];
    for (const h of holdings) {
      if (Array.isArray(h.transactions)) {
        for (const t of h.transactions) {
          if (t.type === 'buy') cfs.push({ date: t.date, amount: -t.price * t.quantity });
        }
      } else {
        // backwards compat: single buyPrice/quantity
        if (h.buyPrice && h.quantity && h.buyDate) cfs.push({ date: h.buyDate, amount: -(Number(h.buyPrice) * Number(h.quantity)) });
      }
      // final inflow is current value at today
      cfs.push({ date: new Date().toISOString().split('T')[0], amount: Number(h.currentValue) || 0 });
    }

    const irr = xirr(cfs);

    return {
      totalHoldings,
      totalInvested,
      totalCurrentValue,
      totalPL,
      totalPLPercent,
      xirr: irr,
    };
  }, [portfolio]);

  const refreshPortfolioPrices = async () => {
    if (!((portfolio.holdings || []).length)) return;
    setPortfolioLoading(true);
    setPortfolioError('');

    try {
      const updatedHoldings = [];
      for (const holding of (portfolio.holdings || [])) {
        let ticker = normalizeTicker(holding.ticker);
        // derive quantity and cost basis from transactions if present (transactions-based holdings)
        let quantity = Number(holding.quantity) || 0;
        let costBasis = Number(holding.costBasis) || 0;
        if (Array.isArray(holding.transactions) && holding.transactions.length > 0) {
          quantity = holding.transactions.reduce((s, t) => s + (t.type === 'buy' ? Number(t.quantity) : -Number(t.quantity)), 0);
          costBasis = holding.transactions.reduce((s, t) => s + (t.type === 'buy' ? Number(t.price) * Number(t.quantity) : -Number(t.price) * Number(t.quantity)), 0);
        }

        if (!ticker) {
          updatedHoldings.push({
            ...holding,
            currentPrice: null,
            costBasis,
            currentValue: null,
            pnl: null,
            pnlPercent: null,
          });
          continue;
        }

        let quote = await fetchTickerData(ticker);
        if (!quote?.success && !ticker.endsWith('.NS')) {
          quote = await fetchTickerData(`${ticker}.NS`);
          if (quote?.success) {
            ticker = `${ticker}.NS`;
          }
        }

        const currentPrice = quote?.success ? quote.cmp || 0 : holding.currentPrice || 0;
        const currentValue = currentPrice * quantity;
        const pnl = currentValue - costBasis;
        const pnlPercent = costBasis ? (pnl / costBasis) * 100 : 0;

        const daysHeld = holding.transactions && holding.transactions.length > 0
          ? daysBetween(holding.transactions[0].date)
          : holding.buyDate ? daysBetween(holding.buyDate) : null;

        updatedHoldings.push({
          ...holding,
          ticker,
          currentPrice,
          costBasis,
          currentValue,
          pnl,
          pnlPercent,
          daysHeld,
          lastUpdated: new Date().toISOString(),
        });
        await new Promise((resolve) => setTimeout(resolve, 180));
      }

      const next = { ...portfolio, holdings: updatedHoldings };
      setPortfolio(next);
      savePortfolioToStorage(next);
      setPortfolioRefreshTime(new Date());
    } catch (error) {
      setPortfolioError('Unable to refresh portfolio prices.');
    }

    setPortfolioLoading(false);
  };

  useEffect(() => {
    if (view === 'portfolio' && (portfolio.holdings || []).length) {
      refreshPortfolioPrices();
    }
  }, [view, (portfolio.holdings || []).length]);

  const handleFormChange = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddHolding = async () => {
    setPortfolioError('');
    const ticker = normalizeTicker(formState.ticker);
    const buyPrice = Number(formState.buyPrice);
    const quantity = Number(formState.quantity);

    if (!formState.name.trim() && !ticker) {
      setPortfolioError('Enter a name or ticker for the holding.');
      return;
    }
    if (!ticker) {
      setPortfolioError('Ticker is required to fetch live prices.');
      return;
    }
    if (buyPrice <= 0 || quantity <= 0) {
      setPortfolioError('Buy price and quantity must be greater than zero.');
      return;
    }

    setIsSubmitting(true);

    const baseHolding = {
      id: `${Date.now()}-${ticker}`,
      name: formState.name.trim() || ticker,
      ticker,
      type: formState.type,
      note: formState.note.trim(),
      transactions: [
        { type: 'buy', price: buyPrice, quantity, date: formState.buyDate || new Date().toISOString().split('T')[0] },
      ],
      buyDate: formState.buyDate || new Date().toISOString().split('T')[0],
      costBasis: buyPrice * quantity,
      quantity: quantity,
      currentPrice: null,
      currentValue: null,
      pnl: null,
      pnlPercent: null,
      lastUpdated: null,
    };

    const quote = await fetchTickerData(ticker);
    if (quote?.success) {
      const currentPrice = quote.cmp || 0;
      const currentValue = currentPrice * quantity;
      const pnl = currentValue - baseHolding.costBasis;
      const pnlPercent = baseHolding.costBasis ? (pnl / baseHolding.costBasis) * 100 : 0;
      baseHolding.currentPrice = currentPrice;
      baseHolding.currentValue = currentValue;
      baseHolding.pnl = pnl;
      baseHolding.pnlPercent = pnlPercent;
      baseHolding.lastUpdated = new Date().toISOString();
    } else if (quote) {
      setPortfolioError(`Warning: ${quote.error || 'Unable to fetch ticker price.'}`);
    }

    const updatedPortfolio = { ...portfolio, holdings: [...(portfolio.holdings || []), baseHolding] };
    setPortfolio(updatedPortfolio);
    savePortfolioToStorage(updatedPortfolio);
    setFormState({
      name: '',
      ticker: '',
      type: 'stock',
      buyPrice: '',
      quantity: '',
      buyDate: new Date().toISOString().split('T')[0],
      note: '',
    });
    setIsSubmitting(false);
  };

  const handleSellHolding = (id) => {
    // Partial or full sell: prompt for sell price, qty and date; remove qty from transactions (FIFO)
    const holding = (portfolio.holdings || []).find((h) => h.id === id);
    if (!holding) return;

    const defaultSellPrice = holding.currentPrice || '';
    const defaultSellQty = holding.quantity || '';
    const defaultSellDate = new Date().toISOString().split('T')[0];

    const priceInput = prompt('Enter sell price (₹):', String(defaultSellPrice));
    if (priceInput === null) return;
    const sellPrice = Number(priceInput);
    const qtyInput = prompt('Enter quantity to sell:', String(defaultSellQty));
    if (qtyInput === null) return;
    const sellQty = Number(qtyInput);
    const dateInput = prompt('Enter sell date (YYYY-MM-DD):', defaultSellDate);
    if (dateInput === null) return;
    const sellDate = dateInput || defaultSellDate;

    if (!isFinite(sellPrice) || sellPrice <= 0 || !isFinite(sellQty) || sellQty <= 0) {
      alert('Invalid sell price or quantity');
      return;
    }

    const availableQty = Number(holding.quantity) || 0;
    if (sellQty > availableQty) {
      alert(`Sell quantity (${sellQty}) exceeds available quantity (${availableQty})`);
      return;
    }

    // Ensure transactions array exists for FIFO consumption
    let txs = Array.isArray(holding.transactions) ? [...holding.transactions] : [];
    if (txs.length === 0 && holding.buyPrice && holding.quantity) {
      txs = [{ type: 'buy', price: Number(holding.buyPrice), quantity: Number(holding.quantity), date: holding.buyDate || defaultSellDate }];
    }

    let remaining = sellQty;
    const removed = [];
    const newTxs = [];

    for (let i = 0; i < txs.length; i++) {
      const t = { ...txs[i] };
      if (remaining <= 0) {
        newTxs.push(t);
        continue;
      }
      if (t.type !== 'buy' || !t.quantity) {
        newTxs.push(t);
        continue;
      }
      const available = Number(t.quantity);
      if (available <= remaining) {
        removed.push({ ...t });
        remaining -= available;
        // drop this tx
      } else {
        // partially consume
        removed.push({ type: 'buy', price: t.price, quantity: remaining, date: t.date });
        t.quantity = available - remaining;
        newTxs.push(t);
        remaining = 0;
      }
    }

    if (remaining > 0) {
      alert('Not enough quantity in transactions to fulfill sell');
      return;
    }

    const realizedCost = removed.reduce((s, r) => s + (Number(r.price) * Number(r.quantity)), 0);
    const proceeds = sellPrice * sellQty;
    const profit = proceeds - realizedCost;
    const daysHeld = removed.length > 0 ? daysBetween(removed[0].date, sellDate) : null;
    const gainType = classifyGain(daysHeld);

    const soldRecord = {
      id: `${Date.now()}-${holding.ticker}-sold`,
      name: holding.name,
      ticker: holding.ticker,
      quantity: sellQty,
      transactions: removed,
      sellPrice,
      sellDate,
      proceeds,
      profit,
      daysHeld,
      gainType,
    };

    // Update holding with remaining transactions and adjust cost basis/quantity
    const prevQty = Number(holding.quantity) || 0;
    const prevCost = Number(holding.costBasis) || 0;
    const nextQty = prevQty - sellQty;
    const nextCost = Math.max(0, prevCost - realizedCost);

    const updatedHolding = { ...holding, transactions: newTxs, quantity: nextQty, costBasis: nextCost };

    let nextHoldings = (portfolio.holdings || []).map((h) => (h.id === id ? updatedHolding : h));
    // remove if zero quantity
    if (nextQty <= 0) nextHoldings = nextHoldings.filter((h) => h.id !== id);

    const nextSold = [...(portfolio.sold || []), soldRecord];
    const next = { holdings: nextHoldings, sold: nextSold };
    setPortfolio(next);
    savePortfolioToStorage(next);
  };

  const handleAverageBuy = (id) => {
    const existing = (portfolio.holdings || []).find((h) => h.id === id);
    if (!existing) return;
    setAvgModal({ open: true, id, price: '', qty: '', date: new Date().toISOString().split('T')[0] });
  };

  const submitAverage = async () => {
    const { id, price, qty, date } = avgModal;
    const existing = (portfolio.holdings || []).find((h) => h.id === id);
    if (!existing) return setAvgModal({ open: false, id: null, price: '', qty: '', date: new Date().toISOString().split('T')[0] });
    const p = Number(price);
    const q = Number(qty);
    const d = date || new Date().toISOString().split('T')[0];
    if (!isFinite(p) || p <= 0 || !isFinite(q) || q <= 0) {
      alert('Invalid price or quantity');
      return;
    }
    const tx = { type: 'buy', price: p, quantity: q, date: d };
    const updated = { ...existing };
    updated.transactions = Array.isArray(updated.transactions) ? [...updated.transactions, tx] : [tx];
    // recompute quantity and costBasis
    const totalQty = updated.transactions.reduce((s, t) => s + (t.type === 'buy' ? Number(t.quantity) : -Number(t.quantity)), 0);
    const totalCost = updated.transactions.reduce((s, t) => s + (t.type === 'buy' ? Number(t.price) * Number(t.quantity) : -Number(t.price) * Number(t.quantity)), 0);
    updated.quantity = totalQty;
    updated.costBasis = totalCost;
    const nextHoldings = (portfolio.holdings || []).map((h) => (h.id === id ? updated : h));
    const next = { ...portfolio, holdings: nextHoldings };
    setPortfolio(next);
    savePortfolioToStorage(next);
    setAvgModal({ open: false, id: null, price: '', qty: '', date: new Date().toISOString().split('T')[0] });
    await refreshPortfolioPrices();
  };

  useEffect(() => {
    if (view === 'loan') {
      setLoanPage(0);
    }
  }, [view]);

  const loanCalc = useMemo(() => {
    const months = Math.max(1, Math.round(Number(loanSettings.tenureYears) * 12));
    const principal = Math.max(0, Number(loanSettings.loanAmount));
    const rate = Math.max(0, Number(loanSettings.interestRate));
    const stepUpPct = Math.max(0, Number(loanSettings.stepUpPct));
    const prepayments = Array.from({ length: months }, (_, idx) => Number(loanPrepayments[idx] || 0));
    return buildAmortizationSchedule(principal, rate, months, stepUpPct, prepayments);
  }, [loanSettings, loanPrepayments]);

  const loanPageCount = Math.max(1, Math.ceil(loanCalc.schedule.length / 20));

  const handleLoanSettingChange = (field, value) => {
    if (field === 'tenureYears') {
      const months = Math.max(1, Math.round(Number(value) * 12));
      setLoanPrepayments((prev) => {
        const next = [...prev.slice(0, months)];
        while (next.length < months) {
          next.push(0);
        }
        return next;
      });
    }
    setLoanSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoanPrepaymentCellChange = (idx, value) => {
    const amount = Number(value);
    if (Number.isNaN(amount) || amount < 0) return;
    setLoanPrepayments((prev) => {
      const next = [...prev];
      next[idx] = amount;
      return next;
    });
  };

  const applyOneTimePrepayment = () => {
    const month = Math.max(1, Math.min(loanCalc.originalMonths, Number(loanSettings.oneTimeMonth)));
    const amount = Math.max(0, Number(loanSettings.oneTimeAmount));
    setLoanPrepayments((prev) => {
      const next = [...prev];
      next[month - 1] = amount;
      return next;
    });
    setLoanWarning('');
  };

  const applyRecurringPrepayment = () => {
    const amount = Math.max(0, Number(loanSettings.recurringAmount));
    setLoanPrepayments((prev) => prev.map(() => amount));
    setLoanWarning('');
  };

  const clearLoanPrepayments = () => {
    setLoanPrepayments((prev) => prev.map(() => 0));
    setLoanWarning('');
  };

  const downloadLoanScheduleCSV = () => {
    const rows = [
      [
        'Month',
        'Opening Balance',
        'Scheduled EMI',
        'Interest',
        'Principal via EMI',
        'Extra Prepayment',
        'Total Payment',
        'Ending Balance',
        'Cumulative Interest Saved',
        'Months Saved',
      ],
    ];
    loanCalc.schedule.slice(0, loanCalc.originalMonths).forEach((row) => {
      rows.push([
        row.month,
        row.openingBalance.toFixed(2),
        row.scheduledEmi.toFixed(2),
        row.interest.toFixed(2),
        row.principalEmi.toFixed(2),
        row.prepayment.toFixed(2),
        row.totalPayment.toFixed(2),
        row.endingBalance.toFixed(2),
        row.cumulativeInterestSaved.toFixed(2),
        row.monthsSaved,
      ]);
    });
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'loan-amortization-schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={styles.container} className="app-root">
      <Header
        title={
          view === 'home'
            ? '📊 Tracker Hub'
            : view === 'etf'
            ? '📈 ETF Tracker'
            : view === 'portfolio'
            ? '💼 Portfolio Tracker'
            : view === 'sold'
            ? '📦 Sold Positions'
            : '🏦 Loan Calculator'
        }
        subtitle={
          view === 'home'
            ? 'Choose between the live ETF tracker and the saved portfolio tracker.'
            : view === 'etf'
            ? 'Live ETF metrics pulled from Yahoo Finance.'
            : view === 'portfolio'
            ? 'Track holdings, strategy notes, and P&L with local persistence.'
            : view === 'sold'
            ? 'Review sold positions, realized P&L, and sold XIRR.'
            : 'Build variable monthly prepayment schedules and compare amortization.'
        }
      />

      <AverageModal
        visible={avgModal.open}
        values={avgModal}
        onChange={(k, v) => setAvgModal((p) => ({ ...p, [k]: v }))}
        onCancel={() => setAvgModal({ open: false, id: null, price: '', qty: '', date: new Date().toISOString().split('T')[0] })}
        onSubmit={submitAverage}
      />

      {view !== 'home' && (
        <div style={styles.controls}>
          <button onClick={() => setView('home')} style={styles.secondaryBtn}>
            ← Back to Hub
          </button>

          {view === 'etf' && (
            <>
              <button
                onClick={fetchAllData}
                disabled={loading}
                style={styles.refreshBtn}
              >
                {loading ? '⏳ Refreshing...' : '🔄 Refresh Data'}
              </button>
              {lastUpdated && (
                <span style={styles.lastUpdated}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <span
                style={{
                  ...styles.statusBadge,
                  backgroundColor: backendConnected ? '#dcfce7' : '#fef2f2',
                  color: backendConnected ? '#166534' : '#991b1b',
                  borderColor: backendConnected ? '#86efac' : '#fecaca',
                }}
              >
                {backendConnected ? '🟢 Backend Online' : '🔴 Backend Offline'}
              </span>
            </>
          )}

          {view === 'portfolio' && (
            <>
              <button
                onClick={refreshPortfolioPrices}
                disabled={portfolioLoading}
                style={styles.refreshBtn}
              >
                {portfolioLoading ? '⏳ Updating prices...' : '🔄 Refresh Portfolio'}
              </button>
              {portfolioRefreshTime && (
                <span style={styles.lastUpdated}>
                  Prices refreshed: {portfolioRefreshTime.toLocaleTimeString()}
                </span>
              )}
              <button onClick={() => setView('sold')} style={{ ...styles.secondaryBtn, marginLeft: 12 }}>
                📦 Sold Positions
              </button>
            </>
          )}

          {view === 'sold' && (
            <>
              <button onClick={() => setView('portfolio')} style={styles.secondaryBtn}>
                ← Back to Portfolio
              </button>
            </>
          )}
        </div>
      )}

      {view === 'home' && (
        <>
          <div style={styles.homeIntro}>
            <p style={styles.homeText}>
              Welcome to your tracker hub. Use the ETF Tracker for live market metrics, or open the Portfolio Tracker to save holdings and monitor P&L with Yahoo Finance pricing.
            </p>
          </div>
          <div style={styles.panelGrid}>
            <button style={styles.panelCard} onClick={() => setView('etf')}>
              <h2>ETF Tracker</h2>
              <p>Live ETF metrics, strategy signals, and ranked ETF insights.</p>
            </button>
            <button style={styles.panelCard} onClick={() => setView('portfolio')}>
              <h2>Portfolio Tracker</h2>
              <p>Save holdings, buy price, quantity, notes, and track live P&L.</p>
            </button>
            <button style={styles.panelCard} onClick={() => setView('loan')}>
              <h2>Loan Calculator</h2>
              <p>Advanced variable monthly prepayment calculator with amortization insights.</p>
            </button>
          </div>
        </>
      )}

      {view === 'etf' && (
        <>
          {loading && (
            <ProgressBar
              current={fetchProgress}
              total={ETF_LIST.length}
              label="Fetching ETFs"
            />
          )}

          {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}

          {loading && etfData.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              <div style={styles.statsGrid}>
                <StatCard label="ETFs Tracked" value={etfData.length} color="#0f766e" />
                <StatCard label="Live Data" value={liveCount} color="#16a34a" />
                <StatCard label="Below 20 DMA" value={below20MA} color="#dc2626" />
                <StatCard label="Avg RSI" value={formatNumber(avgRSI, 1)} color="#2563eb" />
              </div>

              <ETFTable
                data={etfData}
                title="📋 Consolidated ETF List"
                subtitle="Full consolidated view of all ETFs with live metrics."
                rankKey="symbol"
                sortOrder="asc"
              />

              <ETFTable
                data={etfData}
                title="🏆 Rank 1: Buy Signal — % Change (20 DMA vs CMP)"
                subtitle="Top 10 ETFs farthest below their 20 DMA (most negative % diff)."
                rankKey="ma20Change"
                sortOrder="asc"
                limit={10}
                highlightColor="#16a34a"
              />

              <ETFTable
                data={etfData}
                title="🏆 Rank 2: Value Signal — Distance from CMP to 52W Low"
                subtitle="Top 10 ETFs closest to their 52-week low."
                rankKey="distTo52WLow"
                sortOrder="asc"
                limit={10}
                highlightColor="#2563eb"
              />

              <ETFTable
                data={etfData}
                title="🏆 Rank 3: Momentum Signal — RSI (14)"
                subtitle="Top 10 ETFs with the lowest RSI readings."
                rankKey="rsi"
                sortOrder="asc"
                limit={10}
                highlightColor="#7c3aed"
              />

              <div style={styles.infoBox}>
                <h3 style={styles.infoTitle}>📖 Strategy Explained</h3>
                <div style={styles.infoGrid}>
                  <div style={styles.infoCard}>
                    <h4 style={styles.infoCardTitle}>20 DMA vs CMP</h4>
                    <p style={styles.infoText}>
                      If CMP is <strong>below</strong> 20 DMA, the ETF is in a short-term downtrend. The <strong>% diff</strong> shown is computed as <strong>(CMP - 20DMA) / 20DMA</strong>. Negative values indicate CMP is below the 20 DMA — more negative means farther below.
                    </p>
                  </div>
                  <div style={styles.infoCard}>
                    <h4 style={styles.infoCardTitle}>52-Week Low Distance</h4>
                    <p style={styles.infoText}>
                      ETFs trading <strong>closest to their 52-week low</strong> are potentially undervalued. Lower distance % = deeper discount from yearly bottom.
                    </p>
                  </div>
                  <div style={styles.infoCard}>
                    <h4 style={styles.infoCardTitle}>RSI (14)</h4>
                    <p style={styles.infoText}>
                      RSI below 30 = oversold (buy zone). RSI above 70 = overbought. <strong>Lower RSI ranks higher</strong> for contrarian buying strategy.
                    </p>
                  </div>
                </div>
              </div>

              <div style={styles.footer}>
                <p>
                  Backend is powered by <strong>Netlify Serverless Functions</strong>. The proxy fetches from Yahoo Finance and calculates all metrics server-side on the edge.
                </p>
              </div>
            </>
          )}
        </>
      )}

      {view === 'portfolio' && (
        <>
          {portfolioLoading && (
                <ProgressBar
                  current={(portfolio.holdings || []).length}
                  total={Math.max((portfolio.holdings || []).length, 1)}
                  label="Refreshing portfolio prices"
                />
              )}

          {portfolioError && <div style={styles.errorBanner}>{portfolioError}</div>}

          <PortfolioSummary stats={portfolioStats} />

          <PortfolioForm
            formState={formState}
            onChange={handleFormChange}
            onSubmit={handleAddHolding}
            error={portfolioError}
            isSubmitting={isSubmitting}
          />

          { (portfolio.holdings || []).length > 0 ? (
            <PortfolioTable
              holdings={portfolio.holdings || []}
              onSell={handleSellHolding}
              onAverage={handleAverageBuy}
            />
          ) : (
            <div style={styles.emptyState}>
              <h3>No holdings yet</h3>
              <p>Add a stock or ETF to start tracking your portfolio.</p>
            </div>
          )}
        </>
      )}

      {view === 'sold' && (
        <>
          <div style={styles.statsGrid}>
            {/* Sold summary */}
            <SoldSummary sold={portfolio.sold || []} />
          </div>

          {(portfolio.sold || []).length > 0 ? (
            <SoldTable sold={portfolio.sold || []} />
          ) : (
            <div style={styles.emptyState}>
              <h3>No sold positions yet</h3>
              <p>Sold positions will appear here after you mark them as sold.</p>
            </div>
          )}
        </>
      )}

      {view === 'loan' && (
        <>
          <div style={styles.statsGrid}>
            <StatCard label="Base EMI" value={formatCurrency(loanCalc.baseEmi)} color="#0f766e" />
            <StatCard label="Original Total Interest" value={formatCurrency(loanCalc.originalTotalInterest)} color="#2563eb" />
            <StatCard label="Interest After Prepay" value={formatCurrency(loanCalc.totalInterestWithPrepay)} color="#16a34a" />
            <StatCard label="Total Interest Saved" value={formatCurrency(loanCalc.totalInterestSaved)} color="#0ea5e9" />
            <StatCard label="Total Principal Prepaid" value={formatCurrency(loanCalc.totalPrincipalPrepaid)} color="#f97316" />
            <StatCard label="Effective Tenure" value={`${loanCalc.effectiveYears}y ${loanCalc.effectiveMonths}m`} color="#8b5cf6" />
          </div>

          <div style={styles.formCard}>
            <div style={styles.formGrid}>
              <label style={styles.formLabel}>
                Loan Amount (₹)
                <input
                  style={styles.formInput}
                  type="number"
                  min="0"
                  step="1000"
                  value={loanSettings.loanAmount}
                  onChange={(e) => handleLoanSettingChange('loanAmount', e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                Interest Rate (% p.a.)
                <input
                  style={styles.formInput}
                  type="number"
                  min="0"
                  step="0.01"
                  value={loanSettings.interestRate}
                  onChange={(e) => handleLoanSettingChange('interestRate', e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                Original Tenure (Years)
                <input
                  style={styles.formInput}
                  type="number"
                  min="1"
                  step="1"
                  value={loanSettings.tenureYears}
                  onChange={(e) => handleLoanSettingChange('tenureYears', e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                Annual EMI Step-up (%)
                <input
                  style={styles.formInput}
                  type="number"
                  min="0"
                  step="0.01"
                  value={loanSettings.stepUpPct}
                  onChange={(e) => handleLoanSettingChange('stepUpPct', e.target.value)}
                />
              </label>
            </div>
          </div>

          <div style={styles.formCard}>
            <div style={styles.formGrid}>
              <label style={styles.formLabel}>
                One-time Prepayment Month
                <input
                  style={styles.formInput}
                  type="number"
                  min="1"
                  max={loanCalc.originalMonths}
                  value={loanSettings.oneTimeMonth}
                  onChange={(e) => handleLoanSettingChange('oneTimeMonth', e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                One-time Prepayment Amount (₹)
                <input
                  style={styles.formInput}
                  type="number"
                  min="0"
                  step="1000"
                  value={loanSettings.oneTimeAmount}
                  onChange={(e) => handleLoanSettingChange('oneTimeAmount', e.target.value)}
                />
              </label>
              <label style={styles.formLabel}>
                Recurring Extra Prepayment (₹)
                <input
                  style={styles.formInput}
                  type="number"
                  min="0"
                  step="1000"
                  value={loanSettings.recurringAmount}
                  onChange={(e) => handleLoanSettingChange('recurringAmount', e.target.value)}
                />
              </label>
              <div style={styles.formLabelFull}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button onClick={applyOneTimePrepayment} style={styles.primaryBtn} type="button">
                    Apply One-time Prepayment
                  </button>
                  <button onClick={applyRecurringPrepayment} style={styles.secondaryBtn} type="button">
                    Set Recurring Monthly
                  </button>
                  <button onClick={clearLoanPrepayments} style={styles.deleteBtn} type="button">
                    Clear All Prepayments
                  </button>
                  <button onClick={downloadLoanScheduleCSV} style={styles.refreshBtn} type="button">
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
            {loanWarning && <div style={styles.errorBanner}>{loanWarning}</div>}
          </div>

          <div style={styles.tableContainer}>
            <div style={styles.tableHeader}>
              <h3 style={styles.tableTitle}>📊 Variable Monthly Prepayment Schedule</h3>
              <p style={styles.tableSubtitle}>
                Edit the extra prepayment for each month. The loan closes early when ending balance reaches zero.
              </p>
            </div>
            <div style={styles.loanTableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Month</th>
                    <th style={styles.th}>Opening Balance</th>
                    <th style={styles.th}>Scheduled EMI</th>
                    <th style={styles.th}>Interest</th>
                    <th style={styles.th}>Principal via EMI</th>
                    <th style={styles.th}>Extra Prepayment</th>
                    <th style={styles.th}>Total Payment</th>
                    <th style={styles.th}>Ending Balance</th>
                    <th style={styles.th}>Cumulative Interest Saved</th>
                    <th style={styles.th}>Months Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {loanCalc.schedule.slice(loanPage * 20, (loanPage + 1) * 20).map((row) => (
                    <tr
                      key={row.month}
                      style={{
                        ...styles.tableRow,
                        backgroundColor: row.closed ? '#f8fafc' : '#ffffff',
                      }}
                    >
                      <td style={styles.td}>{row.month}</td>
                      <td style={styles.td}>{formatCurrency(row.openingBalance)}</td>
                      <td style={styles.td}>{formatCurrency(row.scheduledEmi)}</td>
                      <td style={styles.td}>{formatCurrency(row.interest)}</td>
                      <td style={styles.td}>{formatCurrency(row.principalEmi)}</td>
                      <td style={{ ...styles.td, padding: '10px 14px' }}>
                        {row.closed ? (
                          'Loan Closed'
                        ) : (
                          <input
                            style={styles.prepayInput}
                            type="number"
                            min="0"
                            step="1000"
                            value={loanPrepayments[row.month - 1] || 0}
                            onChange={(e) => handleLoanPrepaymentCellChange(row.month - 1, e.target.value)}
                          />
                        )}
                      </td>
                      <td style={styles.td}>{row.closed ? '—' : formatCurrency(row.totalPayment)}</td>
                      <td style={styles.td}>{formatCurrency(row.endingBalance)}</td>
                      <td style={styles.td}>{formatCurrency(row.cumulativeInterestSaved)}</td>
                      <td style={styles.td}>{row.monthsSaved}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={styles.paginationControls}>
              <button
                style={styles.secondaryBtn}
                onClick={() => setLoanPage(Math.max(0, loanPage - 1))}
                disabled={loanPage === 0}
              >
                Previous
              </button>
              <span style={styles.paginationLabel}>
                Page {loanPage + 1} of {loanPageCount}
              </span>
              <button
                style={styles.secondaryBtn}
                onClick={() => setLoanPage(Math.min(loanPageCount - 1, loanPage + 1))}
                disabled={loanPage === loanPageCount - 1}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = {
  container: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#f1f5f9',
    minHeight: '100vh',
    color: '#1e293b',
  },
  header: {
    textAlign: 'center',
    marginBottom: '28px',
    padding: '32px 24px',
    background: 'linear-gradient(135deg, #0f766e 0%, #134e4a 100%)',
    borderRadius: '16px',
    color: 'white',
    boxShadow: '0 10px 40px rgba(15, 118, 110, 0.2)',
  },
  title: {
    fontSize: '2.4rem',
    fontWeight: 800,
    margin: '0 0 8px 0',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    fontSize: '1.05rem',
    margin: 0,
    opacity: 0.9,
    fontWeight: 400,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  refreshBtn: {
    background: 'linear-gradient(135deg, #0f766e, #115e59)',
    color: 'white',
    border: 'none',
    padding: '12px 28px',
    fontSize: '1rem',
    fontWeight: 600,
    borderRadius: '10px',
    boxShadow: '0 4px 14px rgba(15, 118, 110, 0.3)',
    transition: 'all 0.2s',
  },
  lastUpdated: {
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
    border: '1px solid',
  },
  mockBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
    border: '1px solid #fbbf24',
  },
  progressContainer: {
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '16px 20px',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  progressLabel: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#475569',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  progressCount: {
    color: '#0f766e',
  },
  progressBarBg: {
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #0f766e, #14b8a6)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    padding: '14px 20px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid #fecaca',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: '#64748b',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '6px',
  },
  statValue: {
    fontSize: '1.6rem',
    fontWeight: 800,
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  tableHeader: {
    marginBottom: '18px',
  },
  tableTitle: {
    margin: '0 0 6px 0',
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  tableSubtitle: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#64748b',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  tableHeaderRow: {
    backgroundColor: '#f8fafc',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontWeight: 700,
    color: '#475569',
    fontSize: '0.78rem',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderBottom: '2px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },
  tableRow: {
    transition: 'background-color 0.15s',
  },
  td: {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155',
    whiteSpace: 'nowrap',
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #0f766e',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  spinnerText: {
    marginTop: '16px',
    color: '#64748b',
    fontSize: '1rem',
    fontWeight: 500,
  },
  infoBox: {
    backgroundColor: 'white',
    borderRadius: '14px',
    padding: '28px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  infoTitle: {
    margin: '0 0 20px 0',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#0f172a',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: '#f8fafc',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
  },
  infoCardTitle: {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#0f766e',
  },
  infoText: {
    margin: 0,
    fontSize: '0.9rem',
    lineHeight: 1.6,
    color: '#475569',
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    padding: '12px 22px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  homeIntro: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '16px',
    boxShadow: '0 2px 15px rgba(15, 23, 42, 0.08)',
    marginBottom: '24px',
  },
  homeText: {
    margin: 0,
    fontSize: '1.05rem',
    color: '#334155',
    lineHeight: 1.7,
  },
  panelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  },
  panelCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '30px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    minHeight: '180px',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 15px rgba(15, 23, 42, 0.08)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px',
    marginBottom: '18px',
  },
  formLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem',
    color: '#334155',
    gap: '8px',
    fontWeight: 600,
  },
  formLabelFull: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.9rem',
    color: '#334155',
    gap: '8px',
    fontWeight: 600,
    gridColumn: '1 / -1',
  },
  formInput: {
    width: '100%',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
  },
  formTextarea: {
    width: '100%',
    minHeight: '116px',
    resize: 'vertical',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    padding: '12px 14px',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
  },
  loanTableWrapper: {
    overflowX: 'auto',
    maxHeight: '560px',
  },
  prepayInput: {
    width: '120px',
    borderRadius: '12px',
    border: '1px solid #3b82f6',
    padding: '10px 12px',
    fontSize: '0.95rem',
    color: '#0f172a',
    outline: 'none',
    backgroundColor: '#eff6ff',
  },
  paginationControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
  },
  paginationLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#334155',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(2,6,23,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalCard: {
    background: 'white',
    padding: 20,
    borderRadius: 12,
    width: 420,
    boxShadow: '0 10px 30px rgba(2,6,23,0.3)',
  },
  primaryBtn: {
    background: 'linear-gradient(135deg, #0f766e, #115e59)',
    color: 'white',
    border: 'none',
    padding: '14px 28px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#f8d7da',
    color: '#9f1239',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '28px',
    borderRadius: '16px',
    border: '1px dashed #cbd5e1',
    textAlign: 'center',
    color: '#475569',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    color: '#64748b',
    fontSize: '0.85rem',
    borderTop: '1px solid #e2e8f0',
  },
};

// Inject keyframes for spinner
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}
