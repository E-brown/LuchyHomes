import React, { useState, useEffect } from 'react';
import { getOrders, setOrderDeliveryCost, updateOrderStatus, payOrderDelivery } from '../../db/mockDb';

export default function OrderQueue() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('needs-quote'); // needs-quote, active, completed, all
  const [deliveryInput, setDeliveryInput] = useState('');
  const [notifyToggle, setNotifyToggle] = useState(true);
  const [statusSelector, setStatusSelector] = useState('');
  const [adminDeliveryPaymentMethod, setAdminDeliveryPaymentMethod] = useState('E-transfer');

  const fetchOrders = () => {
    const allOrders = getOrders();
    setOrders(allOrders);
    
    // Maintain selection if possible
    if (selectedOrder) {
      const refreshedSelected = allOrders.find(o => o.id === selectedOrder.id);
      setSelectedOrder(refreshedSelected || null);
    } else if (allOrders.length > 0) {
      // Find the first order matching the active sub-tab filter
      const filtered = filterOrders(allOrders, activeSubTab);
      if (filtered.length > 0) {
        setSelectedOrder(filtered[0]);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
    window.addEventListener('db-updated', fetchOrders);
    return () => window.removeEventListener('db-updated', fetchOrders);
  }, [activeSubTab]);

  const filterOrders = (orderList, tab) => {
    if (tab === 'needs-quote') {
      return orderList.filter(o => o.deliveryCost === 0 && o.status === 'Paid');
    }
    if (tab === 'active') {
      return orderList.filter(o => o.deliveryCost > 0 && o.status !== 'Delivered');
    }
    if (tab === 'completed') {
      return orderList.filter(o => o.status === 'Delivered');
    }
    return orderList;
  };

  const currentFilteredOrders = filterOrders(orders, activeSubTab);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setDeliveryInput(order.deliveryCost > 0 ? String(order.deliveryCost) : '');
    setStatusSelector(order.status);
  };

  const handleSetDelivery = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    
    const cost = parseFloat(deliveryInput);
    if (isNaN(cost) || cost < 0) {
      alert('Please enter a valid positive delivery cost.');
      return;
    }

    setOrderDeliveryCost(selectedOrder.id, cost, notifyToggle);
    alert(`Delivery cost of $${cost.toFixed(2)} CAD set for order ${selectedOrder.id}.`);
    
    // Automatically trigger notification simulation log
    if (notifyToggle) {
      console.log(`SIMULATION: Notified customer via ${selectedOrder.contactMethod} (${selectedOrder.contactDetail}) about delivery cost.`);
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatusSelector(newStatus);
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, newStatus);
    }
  };

  const handleRecordDeliveryPayment = () => {
    if (!selectedOrder) return;
    payOrderDelivery(selectedOrder.id, adminDeliveryPaymentMethod);
    alert(`Delivery payment recorded via ${adminDeliveryPaymentMethod} for order ${selectedOrder.id}.`);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Order Fulfillment Queue</h1>
      
      {/* Sub tabs */}
      <div style={styles.subTabs}>
        <button 
          style={{
            ...styles.subTabBtn,
            backgroundColor: activeSubTab === 'needs-quote' ? 'var(--color-dark)' : 'transparent',
            color: activeSubTab === 'needs-quote' ? 'var(--color-light)' : 'var(--color-dark)',
          }}
          onClick={() => {
            setActiveSubTab('needs-quote');
            setSelectedOrder(null);
          }}
        >
          Needs Quote ({filterOrders(orders, 'needs-quote').length})
        </button>
        <button 
          style={{
            ...styles.subTabBtn,
            backgroundColor: activeSubTab === 'active' ? 'var(--color-dark)' : 'transparent',
            color: activeSubTab === 'active' ? 'var(--color-light)' : 'var(--color-dark)',
          }}
          onClick={() => {
            setActiveSubTab('active');
            setSelectedOrder(null);
          }}
        >
          Active / In Progress ({filterOrders(orders, 'active').length})
        </button>
        <button 
          style={{
            ...styles.subTabBtn,
            backgroundColor: activeSubTab === 'completed' ? 'var(--color-dark)' : 'transparent',
            color: activeSubTab === 'completed' ? 'var(--color-light)' : 'var(--color-dark)',
          }}
          onClick={() => {
            setActiveSubTab('completed');
            setSelectedOrder(null);
          }}
        >
          Completed ({filterOrders(orders, 'completed').length})
        </button>
        <button 
          style={{
            ...styles.subTabBtn,
            backgroundColor: activeSubTab === 'all' ? 'var(--color-dark)' : 'transparent',
            color: activeSubTab === 'all' ? 'var(--color-light)' : 'var(--color-dark)',
          }}
          onClick={() => {
            setActiveSubTab('all');
            setSelectedOrder(null);
          }}
        >
          All ({orders.length})
        </button>
      </div>

      <div className="admin-order-queue-grid">
        {/* Left Side: Orders List */}
        <div style={styles.listColumn}>
          {currentFilteredOrders.length > 0 ? (
            <div style={styles.list}>
              {currentFilteredOrders.map(order => {
                const isSelected = selectedOrder && selectedOrder.id === order.id;
                return (
                  <div 
                    key={order.id}
                    style={{
                      ...styles.orderItem,
                      borderLeft: isSelected ? '4px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-white)' : 'transparent'
                    }}
                    onClick={() => handleSelectOrder(order)}
                  >
                    <div style={styles.itemHeader}>
                      <span style={styles.itemId}>#{order.id}</span>
                      <span style={styles.itemDate}>{order.date}</span>
                    </div>
                    <div style={styles.itemMeta}>
                      <span style={styles.itemCustomer}>{order.customerName} &bull; {order.address.split(',')[1] || order.address}</span>
                      <span style={styles.itemTotal}>${order.itemTotal.toFixed(2)} CAD</span>
                    </div>
                    <div style={styles.itemFooter}>
                      <span 
                        className={`badge ${order.status === 'Delivered' ? 'badge-delivered' : 'badge-pending'}`}
                        style={{ fontSize: '9px' }}
                      >
                        {order.status}
                      </span>
                      {order.deliveryCost > 0 ? (
                        <span style={styles.deliveryBadge}>Delivery: ${order.deliveryCost.toFixed(2)}</span>
                      ) : (
                        <span style={styles.needsCostTag}>NEEDS QUOTE</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={styles.emptyList}>
              <p>No orders in this category.</p>
            </div>
          )}
        </div>

        {/* Right Side: Selected Order Details */}
        <div className="admin-order-detail-column" style={styles.detailColumn}>
          {selectedOrder ? (
            <div style={styles.detailCard}>
              <div style={styles.detailHeader}>
                <div>
                  <span style={styles.detailDate}>Placed on {selectedOrder.date}</span>
                  <h2 style={styles.detailTitle}>Order #{selectedOrder.id}</h2>
                </div>
                <span className="badge badge-paid" style={{ padding: '8px 12px' }}>
                  Items Paid
                </span>
              </div>

              {/* Recipient details */}
              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>Customer &amp; Contact</h4>
                <div style={styles.detailsGrid}>
                  <span>Name:</span> <strong>{selectedOrder.customerName}</strong>
                  <span>Email:</span> <strong>{selectedOrder.email}</strong>
                  <span>Phone:</span> <strong>{selectedOrder.phone}</strong>
                  <span>Address:</span> <strong>{selectedOrder.address}</strong>
                  <span>Contact Route:</span> <strong>{selectedOrder.contactMethod} ({selectedOrder.contactDetail})</strong>
                </div>
              </div>

              {/* Items Table */}
              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>Items Purchased</h4>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableTh}>Product</th>
                      <th style={{ ...styles.tableTh, textAlign: 'center' }}>Qty</th>
                      <th style={{ ...styles.tableTh, textAlign: 'right' }}>Price</th>
                      <th style={{ ...styles.tableTh, textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={`${item.id}-${idx}`} style={styles.tableRow}>
                        <td style={styles.tableTd}>
                          <span>{item.name}</span>
                          {item.selectedColor && (
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                              Color: <strong>{item.selectedColor}</strong>
                            </span>
                          )}
                        </td>
                        <td style={{ ...styles.tableTd, textAlign: 'center' }}>{item.qty}</td>
                        <td style={{ ...styles.tableTd, textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                        <td style={{ ...styles.tableTd, textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr style={{ ...styles.tableRow, fontWeight: '700' }}>
                      <td colSpan="3" style={styles.tableTd}>Subtotal</td>
                      <td style={{ ...styles.tableTd, textAlign: 'right' }}>${selectedOrder.itemTotal.toFixed(2)} CAD</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Step 1: Set Delivery cost */}
              <div style={styles.actionCard}>
                <h4 style={styles.actionCardTitle}>Fulfillment Step 1: Set Delivery Quote</h4>
                <form onSubmit={handleSetDelivery} style={styles.deliveryForm}>
                  <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                    <label className="form-label">Delivery Cost (CAD)</label>
                    <div style={styles.inputWrapper}>
                      <span style={styles.inputPrefix}>$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={deliveryInput}
                        onChange={(e) => setDeliveryInput(e.target.value)}
                        placeholder="15.00"
                        className="form-input"
                        style={{ paddingLeft: '28px' }}
                      />
                    </div>
                  </div>
                  
                  <div style={styles.notifyToggleWrapper}>
                    <label style={styles.toggleLabel}>
                      <input 
                        type="checkbox" 
                        checked={notifyToggle}
                        onChange={(e) => setNotifyToggle(e.target.checked)}
                        style={{ marginRight: '8px', accentColor: 'var(--color-primary)' }}
                      />
                      Notify customer
                    </label>
                  </div>
                  
                  <button type="submit" className="btn btn-accent" style={styles.submitCostBtn}>
                    {selectedOrder.deliveryCost > 0 ? 'Update Quote' : 'Confirm Quote & Notify'}
                  </button>
                </form>
              </div>

              {/* Step 2: Record Delivery Payment */}
              {selectedOrder.deliveryCost > 0 && (
                <div style={styles.actionCard}>
                  <h4 style={styles.actionCardTitle}>Fulfillment Step 2: Record Delivery Payment</h4>
                  {selectedOrder.deliveryPaid ? (
                    <div style={styles.paymentRecordedBox}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--color-success)', marginRight: '8px' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <strong>Delivery fee paid via: {selectedOrder.paymentMethod} (${selectedOrder.deliveryCost.toFixed(2)} CAD)</strong>
                    </div>
                  ) : (
                    <div style={styles.recordPaymentRow}>
                      <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                        <label className="form-label">Payment Method</label>
                        <select 
                          value={adminDeliveryPaymentMethod} 
                          onChange={(e) => setAdminDeliveryPaymentMethod(e.target.value)}
                          className="form-input"
                        >
                          <option value="E-transfer before dispatch">E-transfer (Interac)</option>
                          <option value="Cash on delivery">Cash (Doorstep)</option>
                          <option value="Card link at the door">Card (Stripe link)</option>
                        </select>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        style={styles.recordBtn}
                        onClick={handleRecordDeliveryPayment}
                      >
                        Record Payment
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Change Status */}
              <div style={styles.actionCard}>
                <h4 style={styles.actionCardTitle}>Fulfillment Step 3: Log Status Tracker</h4>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Current Tracker State</label>
                  <select 
                    value={statusSelector} 
                    onChange={handleStatusChange}
                    className="form-input"
                  >
                    <option value="Paid">Paid (Items)</option>
                    <option value="Delivery Cost Set">Delivery Cost Set</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

            </div>
          ) : (
            <div style={styles.selectPrompt}>
              <h3>Select an order from the list to manage fulfillment.</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  title: {
    fontSize: '28px',
    marginBottom: '24px',
  },
  subTabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
  },
  subTabBtn: {
    border: '1px solid var(--color-border)',
    borderRadius: '16px',
    padding: '8px 18px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'var(--transition)',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.3fr',
    gap: '32px',
    alignItems: 'start',
  },
  listColumn: {
    minHeight: '400px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  orderItem: {
    backgroundColor: '#faf8f5',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    padding: '20px',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  emptyList: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--color-muted)',
    border: '1px dashed var(--color-border)',
    backgroundColor: '#faf8f5',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  itemId: {
    fontWeight: '700',
  },
  itemDate: {
    fontSize: '11px',
    color: 'var(--color-muted)',
  },
  itemMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    marginBottom: '12px',
  },
  itemCustomer: {
    color: '#4a4a4d',
  },
  itemTotal: {
    fontWeight: '600',
  },
  itemFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '10px',
  },
  deliveryBadge: {
    fontSize: '11px',
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  needsCostTag: {
    fontSize: '9px',
    color: 'var(--color-primary)',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  detailColumn: {
    position: 'sticky',
    top: '48px',
  },
  detailCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    padding: '32px',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px',
    marginBottom: '24px',
  },
  detailDate: {
    fontSize: '11px',
    textTransform: 'uppercase',
    color: 'var(--color-muted)',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: '28px',
    fontWeight: '500',
  },
  section: {
    marginBottom: '28px',
  },
  sectionLabel: {
    fontSize: '11px',
    textTransform: 'uppercase',
    fontWeight: '600',
    color: 'var(--color-muted)',
    letterSpacing: '0.08em',
    marginBottom: '12px',
  },
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: '100px 1fr',
    gap: '10px',
    fontSize: '13px',
    color: '#4a4a4d',
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
    padding: '8px 0',
    textAlign: 'left',
    color: 'var(--color-muted)',
    fontWeight: '600',
  },
  tableRow: {
    borderBottom: '1px solid var(--color-border)',
  },
  tableTd: {
    padding: '12px 0',
  },
  actionCard: {
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '20px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '20px',
  },
  actionCardTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: 'var(--color-primary)',
    marginBottom: '16px',
  },
  deliveryForm: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  inputWrapper: {
    position: 'relative',
    marginTop: '6px',
  },
  inputPrefix: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-muted)',
    fontSize: '14px',
  },
  notifyToggleWrapper: {
    display: 'flex',
    alignItems: 'center',
    height: '42px',
  },
  toggleLabel: {
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'var(--color-muted)',
  },
  submitCostBtn: {
    padding: '10px 20px',
    fontSize: '12px',
    textTransform: 'none',
    height: '42px',
  },
  paymentRecordedBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#edf5ee',
    border: '1px solid #c2dec8',
    color: 'var(--color-success)',
    padding: '12px 16px',
    fontSize: '13px',
    borderRadius: 'var(--border-radius)',
  },
  recordPaymentRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-end',
  },
  recordBtn: {
    fontSize: '12px',
    padding: '10px 20px',
    textTransform: 'none',
    height: '42px',
  },
  selectPrompt: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    padding: '80px 32px',
    textAlign: 'center',
    color: 'var(--color-muted)',
  }
};
