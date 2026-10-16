import React from 'react';

export default function Cart({ isOpen, onClose, cart, updateCartQty, removeFromCart, setView }) {
  if (!isOpen) return null;

  const itemTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  return (
    <div style={styles.overlay}>
      {/* Background click dismiss */}
      <div style={styles.backdrop} onClick={onClose}></div>

      {/* Drawer Panel */}
      <div className="cart-drawer-panel">
        {/* Drawer Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Your Cart</h2>
          <button style={styles.closeBtn} onClick={onClose} aria-label="Close Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Body (Items List) */}
        <div style={styles.body}>
          {cart.length > 0 ? (
            <div style={styles.itemsList}>
              {cart.map((item, idx) => (
                <div key={`${item.id}-${item.selectedColor || idx}`} style={styles.itemRow}>
                  <img src={item.image} alt={item.name} style={styles.itemImage} />
                  <div style={styles.itemInfo}>
                    <h4 style={styles.itemName}>{item.name}</h4>
                    {item.selectedColor && (
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', margin: '2px 0 6px 0' }}>
                        Color: <strong>{item.selectedColor}</strong>
                      </span>
                    )}
                    <span style={styles.itemPrice}>${item.price.toFixed(2)} CAD</span>
                    
                    {/* Quantity Selector */}
                    <div style={styles.qtyRow}>
                      <div style={styles.qtyControls}>
                        <button 
                          style={styles.qtyBtn} 
                          onClick={() => updateCartQty(item.id, item.selectedColor || '', item.qty - 1)}
                          disabled={item.qty <= Math.max(1, item.moq || 1)}
                        >
                          &minus;
                        </button>
                        <span style={styles.qtyVal}>{item.qty}</span>
                        <button 
                          style={styles.qtyBtn} 
                          onClick={() => updateCartQty(item.id, item.selectedColor || '', item.qty + 1)}
                          disabled={item.qty >= item.stock}
                        >
                          &#43;
                        </button>
                      </div>
                      <button 
                        style={styles.removeBtn}
                        onClick={() => removeFromCart(item.id, item.selectedColor || '')}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={styles.emptyIcon}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <h3 style={styles.emptyTitle}>Your cart is empty</h3>
              <p style={styles.emptyText}>Add some premium household items from our catalogue to get started.</p>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '24px' }}
                onClick={() => {
                  setView('catalogue');
                  onClose();
                }}
              >
                Browse Catalogue
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout) */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Item Total</span>
              <span style={styles.summaryValue}>${itemTotal.toFixed(2)} CAD</span>
            </div>
            
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Delivery</span>
              <span style={styles.summaryValueItalic}>Billed after order</span>
            </div>

            {/* Split payment notice */}
            <div style={styles.splitNotice}>
              <p>
                <strong>Important Notice:</strong> You pay for items now. Delivery is calculated after your order 
                based on your address and paid separately — before dispatch or on receipt, by arrangement.
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              style={styles.checkoutBtn}
              onClick={() => {
                setView('checkout');
                onClose();
              }}
            >
              Checkout &bull; Pay for items
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 110,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(22, 23, 26, 0.4)',
    backdropFilter: 'blur(2px)',
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '24px',
    fontWeight: '500',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-dark)',
    padding: '4px',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  itemRow: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
  },
  itemInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  itemName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  itemPrice: {
    fontWeight: '600',
    color: 'var(--color-primary)',
    fontSize: '14px',
    marginBottom: '12px',
  },
  qtyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyVal: {
    width: '28px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '13px',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-primary)',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlign: 'center',
    padding: '40px 0',
  },
  emptyIcon: {
    color: 'var(--color-border)',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '20px',
    marginBottom: '8px',
  },
  emptyText: {
    fontSize: '14px',
    color: 'var(--color-muted)',
    maxWidth: '260px',
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-light)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  summaryLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--color-muted)',
  },
  summaryValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--color-dark)',
  },
  summaryValueItalic: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '15px',
    color: 'var(--color-primary)',
  },
  splitNotice: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '14px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '20px',
    fontSize: '12px',
    lineHeight: '1.5',
    color: 'var(--color-muted)',
  },
  checkoutBtn: {
    width: '100%',
    padding: '16px',
    fontSize: '13px',
  }
};
