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
    const response = await fetch(`${API_BASE}/etf?symbol=${symbol}`);
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

function Header() {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>📊 ETF Tracker</h1>
      <p style={styles.subtitle}>
        Live Data via Express Proxy — 100 Indian ETFs Ranked
      </p>
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

function ETFTable({ data, title, rankKey, highlightColor, subtitle }) {
  const sorted = useMemo(() => {
    const valid = data.filter(
      (d) => d[rankKey] !== null && !isNaN(d[rankKey])
    );
    return [...valid].sort((a, b) => a[rankKey] - b[rankKey]);
  }, [data, rankKey]);

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
    () => etfData.filter((d) => d.ma20Change > 0).length,
    [etfData]
  );

  const liveCount = useMemo(
    () => etfData.filter((d) => d.source === 'live').length,
    [etfData]
  );

  return (
    <div style={styles.container}>
      <Header />

      {/* Controls */}
      <div style={styles.controls}>
        <button
          onClick={fetchAllData}
          disabled={loading}
          style={{
            ...styles.refreshBtn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
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
        {usingMock && (
          <span style={styles.mockBadge}>📡 MOCK DATA MODE</span>
        )}
      </div>

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
          {/* Summary Cards */}
          <div style={styles.statsGrid}>
            <StatCard
              label="ETFs Tracked"
              value={etfData.length}
              color="#0f766e"
            />
            <StatCard
              label="Live Data"
              value={liveCount}
              color="#16a34a"
            />
            <StatCard
              label="Below 20 DMA"
              value={below20MA}
              color="#dc2626"
            />
            <StatCard
              label="Avg RSI"
              value={formatNumber(avgRSI, 1)}
              color="#2563eb"
            />
          </div>

          {/* Ranking 1: By 20DMA vs CMP */}
          <ETFTable
            data={etfData}
            title="🏆 Rank 1: Buy Signal — % Change (20 DMA vs CMP)"
            subtitle="Positive % = CMP is below 20 DMA (potential buy). Ranked lowest to highest."
            rankKey="ma20Change"
            highlightColor="#dc2626"
          />

          {/* Ranking 2: By Distance to 52W Low */}
          <ETFTable
            data={etfData}
            title="🏆 Rank 2: Value Signal — Distance from CMP to 52W Low"
            subtitle="Lower % = closer to 52-week low (deeper discount). Ranked closest first."
            rankKey="distTo52WLow"
            highlightColor="#2563eb"
          />

          {/* Ranking 3: By RSI */}
          <ETFTable
            data={etfData}
            title="🏆 Rank 3: Momentum Signal — RSI (14)"
            subtitle="RSI < 30 = oversold (buy zone). Ranked lowest RSI first."
            rankKey="rsi"
            highlightColor="#7c3aed"
          />

          {/* How It Works */}
          <div style={styles.infoBox}>
            <h3 style={styles.infoTitle}>📖 Strategy Explained</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>20 DMA vs CMP</h4>
                <p style={styles.infoText}>
                  If CMP is <strong>below</strong> 20 DMA, the ETF is in a
                  short-term downtrend. A <strong>positive % change</strong>{' '}
                  (20DMA {'>'} CMP) signals potential buying opportunity as price
                  may revert to mean.
                </p>
              </div>
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>52-Week Low Distance</h4>
                <p style={styles.infoText}>
                  ETFs trading <strong>closest to their 52-week low</strong> are
                  potentially undervalued. Lower distance % = deeper discount
                  from yearly bottom.
                </p>
              </div>
              <div style={styles.infoCard}>
                <h4 style={styles.infoCardTitle}>RSI (14)</h4>
                <p style={styles.infoText}>
                  RSI below 30 = oversold (buy zone). RSI above 70 = overbought.
                  <strong> Lower RSI ranks higher</strong> for contrarian buying
                  strategy.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p>
              Backend is powered by <strong>Netlify Serverless Functions</strong>. The proxy fetches
              from Yahoo Finance and calculates all metrics server-side on the edge.
            </p>
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
