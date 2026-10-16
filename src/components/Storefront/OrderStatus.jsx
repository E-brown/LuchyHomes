import React, { useState, useEffect } from 'react';
import { getOrders, payOrderDelivery } from '../../db/mockDb';

export default function OrderStatus({ orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayOption, setSelectedPayOption] = useState(''); // eTransfer, onDelivery
  const [isPaying, setIsPaying] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    const fetchOrder = () => {
      const orders = getOrders();
      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setLoading(false);
    };

    fetchOrder();
    
    // Listen for database updates (like admin changing delivery cost)
    window.addEventListener('db-updated', fetchOrder);
    return () => window.removeEventListener('db-updated', fetchOrder);
  }, [orderId]);

  if (loading) {
    return (
      <div className="container" style={styles.center}>
        <div style={styles.spinner}></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={styles.center}>
        <h2 style={styles.errorTitle}>Order Not Found</h2>
        <p style={styles.errorSub}>We couldn't locate order ID "{orderId}". Check the ID or contact support.</p>
      </div>
    );
  }

  // Define steps
  const steps = [
    { label: 'Paid', statusKey: 'Paid' },
    { label: 'Delivery set', statusKey: 'Delivery Cost Set' },
    { label: 'Packed', statusKey: 'Packed' },
    { label: 'Shipped', statusKey: 'Shipped' },
    { label: 'Out for delivery', statusKey: 'Out for delivery' },
    { label: 'Delivered', statusKey: 'Delivered' }
  ];

  // Determine current active step index
  const statusOrder = ['Paid', 'Delivery Cost Set', 'Packed', 'Shipped', 'Out for delivery', 'Delivered'];
  const currentStepIndex = statusOrder.indexOf(order.status);

  const handleDeliveryPayment = (paymentMethod) => {
    setIsPaying(true);
    setTimeout(() => {
      payOrderDelivery(order.id, paymentMethod);
      setIsPaying(false);
    }, 1200);
  };

  return (
    <div className="container" style={styles.container}>
      {/* Order Title and Header */}
      <div style={styles.header}>
        <div>
          <span style={styles.orderDate}>Placed on {order.date}</span>
          <h1>Order #{order.id}</h1>
        </div>
        <div style={styles.badgeWrapper}>
          <span className="badge badge-paid" style={styles.badge}>
            PAID &bull; ITEMS
          </span>
          {order.deliveryPaid && (
            <span className="badge badge-paid" style={{ ...styles.badge, backgroundColor: '#e2ede5', color: 'var(--color-success)', marginLeft: '12px' }}>
              PAID &bull; DELIVERY
            </span>
          )}
        </div>
      </div>

      {/* Email Confirmation Alert Banner */}
      <div style={styles.emailBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={styles.emailBannerIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <p style={styles.emailBannerText}>
              Confirmation email sent to <strong>{order.email}</strong>. Check your inbox (or spam) for receipt details.
            </p>
          </div>
        </div>
        <button 
          className="btn btn-secondary" 
          style={styles.emailPreviewBtn}
          onClick={() => setShowEmailModal(true)}
        >
          Preview Confirmation Email
        </button>
      </div>

      {/* Newsletter Email Mockup Modal */}
      {showEmailModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBackdrop} onClick={() => setShowEmailModal(false)}></div>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>📧 confirmation_email_preview.eml</h3>
              <button style={styles.modalCloseBtn} onClick={() => setShowEmailModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <div style={styles.emailWrapper}>
              {/* Simulated Email Client Headers */}
              <div style={styles.emailHeaders}>
                <p style={{ margin: '0 0 4px 0' }}><strong>From:</strong> Luchyhomes Canada &lt;no-reply@luchyhomeitems.ca&gt;</p>
                <p style={{ margin: '0 0 4px 0' }}><strong>To:</strong> {order.customerName} &lt;{order.email}&gt;</p>
                <p style={{ margin: '0 0 4px 0' }}><strong>Subject:</strong> Your Luchyhomes Order #{order.id} is Confirmed!</p>
                <p style={{ margin: 0 }}><strong>Date:</strong> {order.date}</p>
              </div>

              {/* Email Content Frame */}
              <div style={styles.emailBody}>
                {/* Brand Banner */}
                <div style={styles.emailBrandHeader}>
                  <h1 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '4px', margin: 0, fontSize: '24px', color: 'var(--color-light)' }}>LUCHYHOMES</h1>
                  <p style={{ margin: '4px 0 0 0', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8, color: 'var(--color-light)' }}>diaspora household items &bull; canada</p>
                </div>

                <div style={styles.emailBodyContent}>
                  <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: 'var(--color-dark)' }}>Hi {order.customerName},</h2>
                  <p style={{ lineHeight: '1.6', fontSize: '13px', color: '#4a4a4d', margin: '0 0 20px 0' }}>
                    Thank you for shopping with us! We have received your order payment and are preparing your items for packaging in our Canadian warehouse. 
                  </p>
                  
                  <div style={styles.emailOrderCard}>
                    <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--color-muted)', letterSpacing: '0.05em', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '6px', marginTop: 0 }}>Order Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-dark)' }}>
                          <span>{item.name} {item.selectedColor ? `(${item.selectedColor})` : ''} &times; {item.qty}</span>
                          <strong>${(item.price * item.qty).toFixed(2)} CAD</strong>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', color: 'var(--color-dark)' }}>
                      <span>Items Subtotal:</span>
                      <span style={{ color: 'var(--color-primary)' }}>${order.itemTotal.toFixed(2)} CAD</span>
                    </div>
                  </div>

                  <div style={styles.emailNextStepsBox}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#3b5c46' }}>📦 What Happens Next?</h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#3b5c46', lineHeight: '1.6' }}>
                      1. <strong>Delivery Quote:</strong> We are calculating the lowest shipping rate based on your address.<br />
                      2. <strong>Confirmation:</strong> Our founder will update your Order Status page and contact you directly ({order.contactMethod}) with the final delivery cost.<br />
                      3. <strong>Payment &amp; Dispatch:</strong> You can pay the delivery fee via e-Transfer or cash-on-arrival, after which your package will ship immediately.
                    </p>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--color-muted)', textAlign: 'center', marginTop: '32px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: 0 }}>
                    Need help? Contact us at Luchyhomeitemscanada@gmail.com or call +1 (548) 398-4595.
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.modalInfoNote}>
              💡 <em>In production, this HTML email receipt is triggered automatically via a backend SMTP handler (like SendGrid or AWS SES) to the client's inbox immediately upon successful payment.</em>
            </div>
          </div>
        </div>
      )}

      {/* Progress Timeline */}
      <div style={styles.timelineCard}>
        <h3 style={styles.cardTitle}>Fulfillment Status</h3>
        <div className="order-status-timeline">
          {steps.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isActive = idx === currentStepIndex;
            
            return (
              <div key={step.label} style={styles.timelineStep}>
                <div style={styles.stepIndicatorWrapper}>
                  <div 
                    style={{
                      ...styles.stepIndicator,
                      backgroundColor: isCompleted ? 'var(--color-primary)' : 'var(--color-border)',
                      border: isActive ? '3px solid #f2cfcf' : 'none'
                    }}
                  >
                    {isCompleted && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {idx < steps.length - 1 && (
                    <div 
                      style={{
                        ...styles.stepLine,
                        backgroundColor: idx < currentStepIndex ? 'var(--color-primary)' : 'var(--color-border)'
                      }}
                    ></div>
                  )}
                </div>
                <span 
                  style={{
                    ...styles.stepLabel,
                    fontWeight: isCompleted ? '600' : '400',
                    color: isCompleted ? 'var(--color-dark)' : 'var(--color-muted)'
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="order-status-grid">
        {/* Left Column: Delivery Cost & Payment */}
        <div style={styles.leftColumn}>
          {/* Case 1: Delivery Cost not set yet */}
          {order.deliveryCost === 0 && (
            <div style={styles.deliveryPendingCard}>
              <h3 style={styles.columnTitle}>Delivery Quote Calculation</h3>
              <p style={styles.cardText}>
                We are calculating the delivery cost for your address: <br />
                <strong>{order.address}</strong>
              </p>
              <div style={styles.waitingAlert}>
                <span style={styles.alertPulse}></span>
                <span style={styles.alertText}>
                  Our operator is reviewing current freight routes. We will update this page and notify you via{' '}
                  <strong>{order.contactMethod} ({order.contactDetail})</strong> as soon as the quote is ready.
                </span>
              </div>
            </div>
          )}

          {/* Case 2: Delivery Cost Set but unpaid */}
          {order.deliveryCost > 0 && !order.deliveryPaid && (
            <div style={styles.deliveryActionCard}>
              <h3 style={styles.columnTitle}>Delivery Payment Required</h3>
              <div style={styles.costBox}>
                <span style={styles.costLabel}>Delivery Quote:</span>
                <span style={styles.costValue}>${order.deliveryCost.toFixed(2)} CAD</span>
              </div>
              
              <p style={styles.cardText}>
                Your items are paid. Delivery is <strong>${order.deliveryCost.toFixed(2)}</strong> — pay before dispatch or on receipt, by arrangement.
              </p>

              {/* Payment selector */}
              <div style={styles.paymentOptions}>
                <label 
                  style={{
                    ...styles.paymentOption,
                    borderColor: selectedPayOption === 'eTransfer' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: selectedPayOption === 'eTransfer' ? 'var(--color-light)' : 'transparent'
                  }}
                >
                  <input 
                    type="radio" 
                    name="payOption" 
                    value="eTransfer"
                    checked={selectedPayOption === 'eTransfer'}
                    onChange={() => setSelectedPayOption('eTransfer')}
                    style={styles.radio}
                  />
                  <div>
                    <strong>Pay now via Interac e-Transfer</strong>
                    <span style={styles.optionSub}>Instant verification, recommended for fast shipping</span>
                  </div>
                </label>

                <label 
                  style={{
                    ...styles.paymentOption,
                    borderColor: selectedPayOption === 'onDelivery' ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: selectedPayOption === 'onDelivery' ? 'var(--color-light)' : 'transparent'
                  }}
                >
                  <input 
                    type="radio" 
                    name="payOption" 
                    value="onDelivery"
                    checked={selectedPayOption === 'onDelivery'}
                    onChange={() => setSelectedPayOption('onDelivery')}
                    style={styles.radio}
                  />
                  <div>
                    <strong>Pay cash / card on arrival</strong>
                    <span style={styles.optionSub}>Pay the courier driver directly at your doorstep</span>
                  </div>
                </label>
              </div>

              {/* Payment Details / CTAs */}
              {selectedPayOption === 'eTransfer' && (
                <div style={styles.paymentDetailsBox}>
                  <h4 style={styles.boxTitle}>Interac e-Transfer Instructions</h4>
                  <p style={styles.boxText}>
                    Please send an e-Transfer of <strong>${order.deliveryCost.toFixed(2)} CAD</strong> to:
                  </p>
                  <div style={styles.instructionsGrid}>
                    <span>Recipient Email:</span> <strong>payments@luchyhomeitems.ca</strong>
                    <span>Security Message:</span> <strong>{order.id}</strong>
                  </div>
                  <button 
                    className="btn btn-accent" 
                    style={styles.payBtn}
                    onClick={() => handleDeliveryPayment('e-Transfer before dispatch')}
                    disabled={isPaying}
                  >
                    {isPaying ? 'Submitting payment...' : 'Confirm e-Transfer Sent'}
                  </button>
                </div>
              )}

              {selectedPayOption === 'onDelivery' && (
                <div style={styles.paymentDetailsBox}>
                  <h4 style={styles.boxTitle}>Doorstep Cash/Card Agreement</h4>
                  <p style={styles.boxText}>
                    Confirm that you will pay the delivery fee of <strong>${order.deliveryCost.toFixed(2)} CAD</strong> in cash or card directly to the driver upon receipt.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    style={styles.payBtn}
                    onClick={() => handleDeliveryPayment('Cash/Card on delivery')}
                    disabled={isPaying}
                  >
                    {isPaying ? 'Saving preference...' : 'Confirm Delivery Payment Method'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Case 3: Delivery Cost Set and Paid */}
          {order.deliveryCost > 0 && order.deliveryPaid && (
            <div style={styles.deliveryPaidCard}>
              <h3 style={styles.columnTitle}>Delivery Secured</h3>
              <div style={styles.successBox}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={styles.successIcon}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <h4 style={styles.successTitle}>Delivery Paid via {order.paymentMethod}</h4>
                  <p style={styles.successText}>Amount: ${order.deliveryCost.toFixed(2)} CAD. Your order is queued for packaging.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tracking Logs */}
          <div style={styles.trackingLogsCard}>
            <h3 style={styles.columnTitle}>Delivery Tracking</h3>
            {['Shipped', 'Out for delivery', 'Delivered'].includes(order.status) ? (
              <div style={styles.logs}>
                {order.status === 'Delivered' && (
                  <div style={styles.logRow}>
                    <span style={styles.logTime}>Delivered</span>
                    <span style={styles.logDesc}>Package delivered to doorstep. Delivery payment verified.</span>
                  </div>
                )}
                {['Out for delivery', 'Delivered'].includes(order.status) && (
                  <div style={styles.logRow}>
                    <span style={styles.logTime}>Out for Delivery</span>
                    <span style={styles.logDesc}>Package loaded on local courier vehicle. Courier will contact before arrival.</span>
                  </div>
                )}
                <div style={styles.logRow}>
                  <span style={styles.logTime}>Shipped</span>
                  <span style={styles.logDesc}>Package departed Canadian sorting facility. Transit ID: LH-TRK-{order.id.slice(3)}</span>
                </div>
                <div style={styles.logRow}>
                  <span style={styles.logTime}>Packed</span>
                  <span style={styles.logDesc}>Items packaged and prepared for shipping label.</span>
                </div>
              </div>
            ) : (
              <p style={styles.noTrackingText}>Tracking updates and carrier logs will appear here once shipped.</p>
            )}
          </div>
        </div>

        {/* Right Column: Order Items Summary & Shipping Info */}
        <div style={styles.rightColumn}>
          <div style={styles.detailsCard}>
            <h3 style={styles.columnTitle}>Items Ordered</h3>
            <div style={styles.itemsList}>
              {order.items.map((item, idx) => (
                <div key={`${item.id}-${idx}`} style={styles.itemRow}>
                  <div>
                    <span>
                      {item.name} <strong style={styles.itemQty}>&times; {item.qty}</strong>
                    </span>
                    {item.selectedColor && (
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>
                        Color: {item.selectedColor}
                      </span>
                    )}
                  </div>
                  <span>${(item.price * item.qty).toFixed(2)} CAD</span>
                </div>
              ))}
            </div>
            
            <div style={styles.totalBox}>
              <div style={styles.totalRow}>
                <span>Items Cost</span>
                <span>${order.itemTotal.toFixed(2)} CAD</span>
              </div>
              <div style={styles.totalRow}>
                <span>Delivery Cost</span>
                <span>{order.deliveryCost > 0 ? `$${order.deliveryCost.toFixed(2)} CAD` : 'TBD'}</span>
              </div>
              <div style={{ ...styles.totalRow, fontWeight: '700', fontSize: '15px', color: 'var(--color-primary)', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '12px' }}>
                <span>Total Cost</span>
                <span>${(order.itemTotal + order.deliveryCost).toFixed(2)} CAD</span>
              </div>
            </div>
          </div>

          <div style={styles.detailsCard}>
            <h3 style={styles.columnTitle}>Shipping Details</h3>
            <div style={styles.shippingDetailsGrid}>
              <span>Recipient:</span> <strong>{order.customerName}</strong>
              <span>Address:</span> <strong>{order.address}</strong>
              <span>Contact:</span> <strong>{order.phone} / {order.email}</strong>
              <span>Attribution:</span> <span>Source: {order.utmSource || 'direct'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '60px',
    paddingBottom: '100px',
  },
  center: {
    padding: '100px 0',
    textAlign: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid var(--color-border)',
    borderTopColor: 'var(--color-primary)',
    borderRadius: '50%',
    margin: '0 auto 16px auto',
    animation: 'spin 1s linear infinite',
  },
  errorTitle: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  errorSub: {
    color: 'var(--color-muted)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '24px',
  },
  orderDate: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    color: 'var(--color-muted)',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '6px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '500',
  },
  badgeWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  badge: {
    padding: '6px 12px',
    fontSize: '11px',
  },
  timelineCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '40px',
  },
  cardTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--color-muted)',
    marginBottom: '24px',
  },
  timeline: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    width: '100%',
    flexWrap: 'wrap',
    gap: '20px 0',
  },
  timelineStep: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    minWidth: '90px',
  },
  stepIndicatorWrapper: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: '12px',
  },
  stepIndicator: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepLine: {
    height: '2px',
    position: 'absolute',
    left: '50%',
    right: '-50%',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
  },
  stepLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '40px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  deliveryPendingCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  columnTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--color-dark)',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px',
  },
  cardText: {
    fontSize: '14px',
    color: 'var(--color-dark)',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  waitingAlert: {
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '20px',
    borderRadius: 'var(--border-radius)',
    display: 'flex',
    gap: '12px',
    alignItems: 'start',
  },
  alertPulse: {
    width: '8px',
    height: '8px',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '50%',
    marginTop: '6px',
    animation: 'pulse 1.5s infinite',
    flexShrink: 0,
  },
  alertText: {
    fontSize: '13px',
    lineHeight: '1.5',
    color: 'var(--color-muted)',
  },
  deliveryActionCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  costBox: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '16px 24px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '20px',
  },
  costLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    color: 'var(--color-muted)',
  },
  costValue: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'var(--color-primary)',
  },
  paymentOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    margin: '24px 0',
  },
  paymentOption: {
    display: 'flex',
    alignItems: 'start',
    gap: '16px',
    padding: '18px',
    border: '1px solid',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  radio: {
    accentColor: 'var(--color-primary)',
    marginTop: '3px',
    cursor: 'pointer',
  },
  optionSub: {
    display: 'block',
    fontSize: '12px',
    color: 'var(--color-muted)',
    marginTop: '4px',
    fontWeight: '400',
  },
  paymentDetailsBox: {
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px',
    marginTop: '24px',
  },
  boxTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
    marginBottom: '12px',
  },
  boxText: {
    fontSize: '13px',
    color: 'var(--color-muted)',
    marginBottom: '16px',
  },
  instructionsGrid: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '10px',
    fontSize: '13px',
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '16px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '24px',
  },
  payBtn: {
    width: '100%',
    padding: '14px',
  },
  deliveryPaidCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  successBox: {
    display: 'flex',
    gap: '16px',
    backgroundColor: '#edf5ee',
    border: '1px solid #c2dec8',
    padding: '20px',
    borderRadius: 'var(--border-radius)',
  },
  successIcon: {
    color: 'var(--color-success)',
    flexShrink: 0,
    marginTop: '2px',
  },
  successTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--color-success)',
    marginBottom: '4px',
  },
  successText: {
    fontSize: '13px',
    color: '#3b5c46',
  },
  trackingLogsCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  logs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  logRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '16px',
    fontSize: '13px',
    borderLeft: '2px solid var(--color-primary)',
    paddingLeft: '16px',
    marginLeft: '6px',
  },
  logTime: {
    fontWeight: '600',
    color: 'var(--color-primary)',
    textTransform: 'uppercase',
    fontSize: '11px',
    letterSpacing: '0.05em',
  },
  logDesc: {
    color: 'var(--color-muted)',
  },
  noTrackingText: {
    fontSize: '13px',
    color: 'var(--color-muted)',
    fontStyle: 'italic',
  },
  detailsCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  itemQty: {
    color: 'var(--color-muted)',
  },
  totalBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: 'var(--color-muted)',
  },
  shippingDetailsGrid: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '12px 10px',
    fontSize: '13px',
    color: 'var(--color-muted)',
  },
  emailBanner: {
    backgroundColor: '#edf5ee',
    border: '1px solid #c2dec8',
    borderRadius: 'var(--border-radius)',
    padding: '16px 24px',
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  },
  emailBannerIcon: {
    color: 'var(--color-success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  emailBannerText: {
    margin: 0,
    fontSize: '13px',
    color: '#3b5c46'
  },
  emailPreviewBtn: {
    padding: '8px 16px',
    fontSize: '11px',
    textTransform: 'none',
    backgroundColor: 'var(--color-white)',
    border: '1px solid #c2dec8',
    color: '#3b5c46'
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(22, 23, 26, 0.6)',
    backdropFilter: 'blur(4px)',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px'
  },
  modalTitle: {
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'monospace',
    color: 'var(--color-muted)'
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-dark)',
  },
  emailWrapper: {
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    textAlign: 'left'
  },
  emailHeaders: {
    padding: '16px',
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '12px',
    color: 'var(--color-muted)',
    lineHeight: '1.5',
    margin: 0
  },
  emailBody: {
    backgroundColor: '#f2f0eb',
    padding: '24px',
  },
  emailBrandHeader: {
    textAlign: 'center',
    padding: '24px 0',
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-light)',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px'
  },
  emailBodyContent: {
    backgroundColor: 'var(--color-white)',
    padding: '32px 24px',
    borderBottomLeftRadius: '4px',
    borderBottomRightRadius: '4px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
  },
  emailOrderCard: {
    backgroundColor: '#faf8f5',
    border: '1px solid var(--color-border)',
    padding: '16px',
    borderRadius: '4px',
    margin: '24px 0'
  },
  emailNextStepsBox: {
    backgroundColor: '#edf5ee',
    borderLeft: '3px solid var(--color-success)',
    padding: '16px',
    borderRadius: '4px',
    marginTop: '20px'
  },
  modalInfoNote: {
    fontSize: '11px',
    color: 'var(--color-muted)',
    textAlign: 'center',
    marginTop: '20px',
    fontStyle: 'italic',
    lineHeight: '1.4'
  }
};
