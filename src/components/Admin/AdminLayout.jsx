import React from 'react';

export default function AdminLayout({ activeTab, setActiveTab, children }) {
  const handleStorefrontClick = () => {
    // Navigate back to home
    window.history.pushState(null, '', '/');
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="admin-view-container">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar-nav">
        <div className="brand" style={styles.brand}>
          <span style={styles.brandSubtitle}>Luchyhomes</span>
          <h2 style={styles.brandTitle}>ADMIN</h2>
        </div>
        
        <nav style={{ ...styles.nav, display: 'flex', flexDirection: 'column' }}>
          <button 
            style={{
              ...styles.navLink,
              backgroundColor: activeTab === 'orders' ? 'rgba(250, 248, 245, 0.08)' : 'transparent',
              color: activeTab === 'orders' ? 'var(--color-light)' : 'rgba(250, 248, 245, 0.6)'
            }}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.navIcon}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Order Queue
          </button>
          
          <button 
            style={{
              ...styles.navLink,
              backgroundColor: activeTab === 'inventory' ? 'rgba(250, 248, 245, 0.08)' : 'transparent',
              color: activeTab === 'inventory' ? 'var(--color-light)' : 'rgba(250, 248, 245, 0.6)'
            }}
            onClick={() => setActiveTab('inventory')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.navIcon}>
              <rect x="3" y="3" width="7" height="9" />
              <rect x="14" y="3" width="7" height="5" />
              <rect x="14" y="12" width="7" height="9" />
              <rect x="3" y="16" width="7" height="5" />
            </svg>
            Inventory Management
          </button>
          
          <button 
            style={{
              ...styles.navLink,
              backgroundColor: activeTab === 'analytics' ? 'rgba(250, 248, 245, 0.08)' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--color-light)' : 'rgba(250, 248, 245, 0.6)'
            }}
            onClick={() => setActiveTab('analytics')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.navIcon}>
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Analytics &amp; UTM
          </button>
        </nav>
        
        {/* Footer actions */}
        <div className="sidebar-footer" style={styles.sidebarFooter}>
          <button style={styles.storefrontBtn} onClick={handleStorefrontClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Customer Storefront
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-viewport">
        {children}
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f2f0eb',
  },
  sidebar: {
    width: '280px',
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-light)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    padding: '32px 24px',
    borderRight: '1px solid rgba(250, 248, 245, 0.1)',
  },
  brand: {
    marginBottom: '48px',
  },
  brandSubtitle: {
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: 'var(--color-primary)',
    fontWeight: '700',
    display: 'block',
    marginBottom: '4px',
  },
  brandTitle: {
    fontFamily: 'var(--font-serif)',
    fontSize: '24px',
    letterSpacing: '2px',
    fontWeight: '700',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '14px 18px',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '500',
    letterSpacing: '0.02em',
    transition: 'var(--transition)',
  },
  navIcon: {
    marginRight: '12px',
    opacity: 0.8,
  },
  sidebarFooter: {
    borderTop: '1px solid rgba(250, 248, 245, 0.1)',
    paddingTop: '24px',
  },
  storefrontBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(250, 248, 245, 0.3)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'transparent',
    color: 'var(--color-light)',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  storefrontBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '12px',
    border: '1px solid rgba(250, 248, 245, 0.3)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'transparent',
    color: 'var(--color-light)',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  mainContent: {
    flex: 1,
    padding: '48px',
    overflowY: 'auto',
  }
};
