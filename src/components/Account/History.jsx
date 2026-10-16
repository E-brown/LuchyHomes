import React, { useState, useEffect } from 'react';
import { getOrders } from '../../db/mockDb';

export default function History({ setView, setSelectedOrderId, reorderItems }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // orders, address, details

  useEffect(() => {
    const loadAccountData = () => {
      const savedProfile = localStorage.getItem('luchy_current_user');
      const profile = savedProfile ? JSON.parse(savedProfile) : {
        fullName: 'Amara O.',
        email: 'amara@email.com',
        phone: '+1 416-555-0198',
        address: '124 Maple St, Toronto, ON, M5V 2T6'
      };
      
      setCurrentUser(profile);

      // Fetch all orders matching this email, or fallback to all orders for mock demonstration
      const allOrders = getOrders();
      const matchingOrders = allOrders.filter(o => o.email.toLowerCase() === profile.email.toLowerCase());
      
      // If no matching orders, show all for demonstration purposes (so they can see the default mock orders)
      setUserOrders(matchingOrders.length > 0 ? matchingOrders : allOrders);
    };

    loadAccountData();
    window.addEventListener('db-updated', loadAccountData);
    return () => window.removeEventListener('db-updated', loadAccountData);
  }, []);

  const handleReorder = (order) => {
    reorderItems(order.items);
  };

  return (
    <div className="account-container">
      {/* Profile Header */}
      {currentUser && (
        <div className="account-profile-header">
          <div style={styles.avatar}>
            {currentUser.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h1 style={styles.profileName}>{currentUser.fullName}</h1>
            <span style={styles.profileEmail}>{currentUser.email}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="account-tabs">
        <button 
          className="account-tab-btn"
          style={{
            borderBottom: activeTab === 'orders' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'orders' ? 'var(--color-primary)' : 'var(--color-muted)'
          }}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button 
          className="account-tab-btn"
          style={{
            borderBottom: activeTab === 'address' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'address' ? 'var(--color-primary)' : 'var(--color-muted)'
          }}
          onClick={() => setActiveTab('address')}
        >
          Saved Address
        </button>
        <button 
          className="account-tab-btn"
          style={{
            borderBottom: activeTab === 'details' ? '2px solid var(--color-primary)' : '2px solid transparent',
            color: activeTab === 'details' ? 'var(--color-primary)' : 'var(--color-muted)'
          }}
          onClick={() => setActiveTab('details')}
        >
          Account Details
        </button>
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'orders' && (
          <div style={styles.ordersSection}>
            <div className="account-orders-header">
              <h2 style={styles.sectionTitle}>Order History</h2>
              {userOrders.length > 0 && (
                <button 
                  className="btn btn-secondary" 
                  style={styles.reorderBtn}
                  onClick={() => handleReorder(userOrders[0])}
                >
                  Reorder last order
                </button>
              )}
            </div>

            {userOrders.length > 0 ? (
              <div style={styles.ordersList}>
                {userOrders.map(order => (
                  <div key={order.id} className="account-order-card">
                    <div className="account-order-header">
                      <div>
                        <h4 style={styles.orderId}>Order #{order.id}</h4>
                        <span style={styles.orderCardDate}>Placed on {order.date}</span>
                      </div>
                      <span 
                        className={`badge ${order.status === 'Delivered' ? 'badge-delivered' : 'badge-pending'}`}
                        style={styles.statusBadge}
                      >
                        {order.status === 'Paid' ? 'Paid (Items)' : order.status}
                      </span>
                    </div>

                    <div className="account-order-body">
                      <div style={styles.itemsSummary}>
                        {order.items.map((item, idx) => (
                          <span key={`${item.id}-${idx}`} style={styles.itemSummaryText}>
                            {item.name} {item.selectedColor ? `(${item.selectedColor})` : ''} &times; {item.qty}
                            {idx < order.items.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                      <div className="account-pricing-summary" style={styles.pricingSummary}>
                        <div style={styles.priceDetail}>
                          <span>Items Total:</span>
                          <span>${order.itemTotal.toFixed(2)} CAD</span>
                        </div>
                        {order.deliveryCost > 0 && (
                          <div style={styles.priceDetail}>
                            <span>Delivery Fee:</span>
                            <span>${order.deliveryCost.toFixed(2)} CAD</span>
                          </div>
                        )}
                        <div style={styles.grandTotal}>
                          <span>Total:</span>
                          <span>${(order.itemTotal + order.deliveryCost).toFixed(2)} CAD</span>
                        </div>
                      </div>
                    </div>

                    <div className="account-order-actions">
                      <button 
                        className="btn btn-secondary" 
                        style={styles.actionBtn}
                        onClick={() => {
                          setSelectedOrderId(order.id);
                          setView('order-status');
                        }}
                      >
                        Track &amp; View Details
                      </button>
                      <button 
                        className="btn btn-link" 
                        style={styles.inlineReorderBtn}
                        onClick={() => handleReorder(order)}
                      >
                        Reorder Items
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={styles.emptyState}>
                <p>You haven't placed any orders yet.</p>
                <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setView('catalogue')}>
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'address' && currentUser && (
          <div style={styles.subSection}>
            <h2 style={styles.sectionTitle}>Default Shipping Address</h2>
            <div style={styles.infoCard}>
              <div className="account-info-row">
                <span>Address:</span>
                <strong>{currentUser.address}</strong>
              </div>
              <div className="account-info-row">
                <span>Country:</span>
                <strong>Canada</strong>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '16px' }}
                onClick={() => alert('Address editing is simulated via the checkout form.')}
              >
                Edit Address
              </button>
            </div>
          </div>
        )}

        {activeTab === 'details' && currentUser && (
          <div style={styles.subSection}>
            <h2 style={styles.sectionTitle}>Profile Details</h2>
            <div style={styles.infoCard}>
              <div className="account-info-row">
                <span>Full Name:</span>
                <strong>{currentUser.fullName}</strong>
              </div>
              <div className="account-info-row">
                <span>Email:</span>
                <strong>{currentUser.email}</strong>
              </div>
              <div className="account-info-row">
                <span>Phone:</span>
                <strong>{currentUser.phone}</strong>
              </div>
              <button 
                className="btn btn-secondary" 
                style={{ marginTop: '16px' }}
                onClick={() => alert('Details editing is simulated via the checkout form.')}
              >
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-light)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: 'var(--font-sans)',
  },
  profileName: {
    fontSize: '28px',
    fontWeight: '500',
  },
  profileEmail: {
    color: 'var(--color-muted)',
    fontSize: '14px',
  },
  tabContent: {
    minHeight: '240px',
  },
  ordersSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '500',
  },
  reorderBtn: {
    fontSize: '11px',
    padding: '8px 16px',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  orderId: {
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    fontWeight: '600',
  },
  orderCardDate: {
    fontSize: '12px',
    color: 'var(--color-muted)',
  },
  statusBadge: {
    fontSize: '10px',
    padding: '4px 8px',
  },
  itemsSummary: {
    flex: '1',
    minWidth: '240px',
    color: 'var(--color-muted)',
    fontSize: '14px',
    lineHeight: '1.5',
  },
  itemSummaryText: {
    fontFamily: 'var(--font-serif)',
    fontWeight: '600',
    color: 'var(--color-dark)',
  },
  pricingSummary: {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '13px',
  },
  priceDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--color-muted)',
  },
  grandTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: '700',
    marginTop: '6px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '6px',
    color: 'var(--color-dark)',
  },
  actionBtn: {
    fontSize: '12px',
    padding: '10px 20px',
  },
  inlineReorderBtn: {
    borderBottom: 'none',
    fontSize: '11px',
    cursor: 'pointer',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px 0',
    color: 'var(--color-muted)',
  },
  subSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '24px',
    borderRadius: 'var(--border-radius)',
  }
};
