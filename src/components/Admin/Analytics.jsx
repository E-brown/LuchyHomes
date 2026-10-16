import React, { useState, useEffect } from 'react';
import { getAnalytics, getOrders } from '../../db/mockDb';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);

  const loadAnalyticsData = () => {
    setStats(getAnalytics());
    setRecentOrders(getOrders().slice(-5).reverse()); // Last 5 orders
  };

  useEffect(() => {
    loadAnalyticsData();
    window.addEventListener('db-updated', loadAnalyticsData);
    return () => window.removeEventListener('db-updated', loadAnalyticsData);
  }, []);

  if (!stats) return <p>Loading reports...</p>;

  // Convert UTM stats object to array
  const utmSourcesArray = Object.keys(stats.utmStats).map(key => {
    const data = stats.utmStats[key];
    const conversionRate = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;
    return {
      source: key,
      ...data,
      conversionRate
    };
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Attribution &amp; Sales Dashboard</h1>

      {/* KPI Cards */}
      <div style={styles.kpiRow}>
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Total Revenue</span>
          <span style={styles.kpiValue}>${stats.totalRevenue.toFixed(2)} CAD</span>
          <span style={styles.kpiSub}>Item sales + paid shipping fees</span>
        </div>
        
        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Total Orders</span>
          <span style={styles.kpiValue}>{stats.totalOrders}</span>
          <span style={styles.kpiSub}>Completed checkouts</span>
        </div>

        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Average Order Value</span>
          <span style={styles.kpiValue}>${stats.averageOrderValue.toFixed(2)} CAD</span>
          <span style={styles.kpiSub}>Excluding delivery fee</span>
        </div>

        <div style={styles.kpiCard}>
          <span style={styles.kpiLabel}>Delivery Revenue</span>
          <span style={styles.kpiValue}>${stats.deliveryRevenue.toFixed(2)} CAD</span>
          <span style={styles.kpiSub}>From {stats.deliveryRate.toFixed(0)}% of orders</span>
        </div>
      </div>

      {/* UTM Attribution Table */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Social Channel Attribution (UTM Parameters)</h3>
        <p style={styles.sectionDesc}>
          Tracks which marketing link brought the user to the store based on `?utm_source` URLs.
        </p>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableTh}>Traffic Source</th>
              <th style={{ ...styles.tableTh, textAlign: 'center' }}>Ad Views</th>
              <th style={{ ...styles.tableTh, textAlign: 'center' }}>Site Clicks</th>
              <th style={{ ...styles.tableTh, textAlign: 'center' }}>Paid Orders</th>
              <th style={{ ...styles.tableTh, textAlign: 'center' }}>Conversion Rate</th>
              <th style={{ ...styles.tableTh, textAlign: 'right' }}>Revenue Generated</th>
            </tr>
          </thead>
          <tbody>
            {utmSourcesArray.map(item => (
              <tr key={item.source} style={styles.tableRow}>
                <td style={{ ...styles.tableTd, textTransform: 'capitalize', fontWeight: '600' }}>
                  {item.source === 'direct' ? 'Direct / Search' : item.source}
                </td>
                <td style={{ ...styles.tableTd, textAlign: 'center' }}>{item.views.toLocaleString()}</td>
                <td style={{ ...styles.tableTd, textAlign: 'center' }}>{item.clicks.toLocaleString()}</td>
                <td style={{ ...styles.tableTd, textAlign: 'center', fontWeight: '600' }}>{item.conversions}</td>
                <td style={{ ...styles.tableTd, textAlign: 'center' }}>
                  <span style={styles.rateValue}>
                    {item.conversionRate.toFixed(1)}%
                  </span>
                </td>
                <td style={{ ...styles.tableTd, textAlign: 'right', fontWeight: '600', color: 'var(--color-primary)' }}>
                  ${item.revenue.toFixed(2)} CAD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Orders Attribution Feed */}
      <div style={styles.sectionCard}>
        <h3 style={styles.sectionTitle}>Recent Orders &amp; Referral Path</h3>
        <div style={styles.feed}>
          {recentOrders.map(order => (
            <div key={order.id} style={styles.feedRow}>
              <div style={styles.feedOrderMeta}>
                <strong>Order #{order.id}</strong>
                <span style={styles.feedCustomer}>{order.customerName}</span>
              </div>
              <div style={styles.feedStatus}>
                <span style={styles.feedTotal}>${order.itemTotal.toFixed(2)} CAD</span>
                <span style={styles.feedDate}>on {order.date}</span>
              </div>
              <div style={styles.feedSource}>
                <span 
                  style={{
                    ...styles.sourceTag,
                    backgroundColor: order.utmSource === 'tiktok' ? '#e5edf5' : order.utmSource === 'instagram' ? '#f5ede5' : '#f0f0f2',
                    color: order.utmSource === 'tiktok' ? '#2b5797' : order.utmSource === 'instagram' ? '#b85a14' : '#52525c'
                  }}
                >
                  utm_source={order.utmSource || 'direct'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    marginBottom: '32px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px',
  },
  kpiRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '40px',
  },
  kpiCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '24px',
    borderRadius: 'var(--border-radius)',
    display: 'flex',
    flexDirection: 'column',
  },
  kpiLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    fontWeight: '600',
    color: 'var(--color-muted)',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  kpiValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-dark)',
    marginBottom: '6px',
  },
  kpiSub: {
    fontSize: '11px',
    color: 'var(--color-muted)',
  },
  sectionCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    padding: '32px',
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  sectionDesc: {
    fontSize: '13px',
    color: 'var(--color-muted)',
    marginBottom: '24px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  tableHeaderRow: {
    borderBottom: '2px solid var(--color-border)',
  },
  tableTh: {
    padding: '12px 16px',
    textAlign: 'left',
    color: 'var(--color-muted)',
    fontWeight: '600',
  },
  tableRow: {
    borderBottom: '1px solid var(--color-border)',
  },
  tableTd: {
    padding: '16px',
  },
  rateValue: {
    backgroundColor: 'var(--color-light)',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '600',
    fontSize: '12px',
  },
  feed: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  feedRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--color-light)',
    flexWrap: 'wrap',
    gap: '12px',
  },
  feedOrderMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  feedCustomer: {
    fontSize: '12px',
    color: 'var(--color-muted)',
  },
  feedStatus: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
  },
  feedTotal: {
    fontSize: '14px',
    fontWeight: '600',
  },
  feedDate: {
    fontSize: '11px',
    color: 'var(--color-muted)',
  },
  feedSource: {
    marginLeft: 'auto',
  },
  sourceTag: {
    display: 'inline-block',
    padding: '6px 12px',
    fontSize: '11px',
    borderRadius: '12px',
    fontFamily: 'monospace',
    fontWeight: '600',
  }
};
