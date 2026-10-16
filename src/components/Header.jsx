import React, { useState } from 'react';
import Logo from './Logo';

export default function Header({ currentView, setView, cartItemsCount, toggleCart }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div style={styles.headerWrapper}>
      {/* Top Notice Bar */}
      <div style={styles.topNoticeBar}>
        <span>📢 Canadian Local Stock &bull; Item Payment Upfront &bull; Delivery Cost Billed Separately After Checkout</span>
      </div>
      
      <header className="site-header">
        <div className="container header-container">
          {/* Brand Logo & Name */}
          <div style={styles.logoContainer} onClick={() => setView('home')}>
            <Logo width="56px" height="56px" />
            <span style={styles.brandName} className="header-brand-name">LUCHYHOMES</span>
          </div>

          {/* Navigation Links (Desktop only) */}
          <nav className="header-nav">
            <button 
              style={{
                ...styles.navLink,
                borderBottom: currentView === 'home' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: currentView === 'home' ? 'var(--color-primary)' : 'var(--color-dark)'
              }}
              onClick={() => setView('home')}
            >
              Home
            </button>
            <button 
              style={{
                ...styles.navLink,
                borderBottom: currentView === 'catalogue' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: currentView === 'catalogue' ? 'var(--color-primary)' : 'var(--color-dark)'
              }}
              onClick={() => setView('catalogue')}
            >
              Catalogue
            </button>
            <button 
              style={{
                ...styles.navLink,
                borderBottom: currentView === 'account' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: currentView === 'account' ? 'var(--color-primary)' : 'var(--color-dark)'
              }}
              onClick={() => setView('account')}
            >
              Account
            </button>
          </nav>

          {/* Header Actions (Cart & Hamburger) */}
          <div className="header-actions" style={styles.actions}>
            <button style={styles.cartButton} onClick={toggleCart} aria-label="Shopping Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartItemsCount > 0 && (
                <span style={styles.cartBadge}>{cartItemsCount}</span>
              )}
            </button>

            {/* Hamburger Button (Mobile only) */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-nav-panel" onClick={e => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Navigation</span>
              <button className="mobile-nav-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <nav className="mobile-nav-links">
              <button 
                className={`mobile-nav-link ${currentView === 'home' ? 'active' : ''}`}
                onClick={() => { setView('home'); setIsMobileMenuOpen(false); }}
              >
                Home
              </button>
              <button 
                className={`mobile-nav-link ${currentView === 'catalogue' ? 'active' : ''}`}
                onClick={() => { setView('catalogue'); setIsMobileMenuOpen(false); }}
              >
                Catalogue
              </button>
              <button 
                className={`mobile-nav-link ${currentView === 'account' ? 'active' : ''}`}
                onClick={() => { setView('account'); setIsMobileMenuOpen(false); }}
              >
                Account
              </button>
            </nav>
            
            <div className="mobile-nav-footer">
              <div className="mobile-nav-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p>📍 Canadian Local Stock</p>
                <p>📞 Phone: <a href="tel:+15483984595" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>+1 (548) 398-4595</a></p>
                <p>✉️ Email: <a href="mailto:Luchyhomeitemscanada@gmail.com" style={{ textDecoration: 'underline' }}>Luchyhomeitemscanada@gmail.com</a></p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                  <a href="https://www.instagram.com/luchyhomeitemscanada?igsh=MWhyNHV3ajNzdHNpZw==" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontSize: '11px', color: 'var(--color-dark)' }}>Instagram</a>
                  <a href="https://www.tiktok.com/@luchyhomeitems.ca?_r=1&_t=ZS-97ZM9ImRUIP" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', fontSize: '11px', color: 'var(--color-dark)' }}>TikTok</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  headerWrapper: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    width: '100%',
  },
  topNoticeBar: {
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-light)',
    fontSize: '10px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    textAlign: 'center',
    padding: '8px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  brandName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '3px',
    color: 'var(--color-dark)',
  },
  navLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.1em',
    padding: '8px 4px',
    transition: 'var(--transition)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cartButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    color: 'var(--color-dark)',
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: '0',
    right: '0',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-white)',
    fontSize: '10px',
    fontWeight: '700',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};
