import React, { useState } from 'react';
import { createOrder } from '../../db/mockDb';

export default function Checkout({ cart, clearCart, setView, setCreatedOrderId }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    contactMethod: 'Email', // Email, DM, Call
    dmPlatform: 'Instagram', // Instagram, TikTok
    dmUsername: '',
  });

  const [cardData, setCardData] = useState({
    cardNumber: '',
    expDate: '',
    cvc: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemTotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    let formattedValue = value;
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expDate') {
      formattedValue = value.replace(/\s?/g, '').replace(/(\d{2})/g, '$1/').substring(0, 5);
      if (formattedValue.endsWith('/')) {
        formattedValue = formattedValue.slice(0, -1);
      }
    }
    
    setCardData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    
    if (formData.contactMethod === 'DM' && !formData.dmUsername.trim()) {
      newErrors.dmUsername = 'Username or profile link is required';
    }

    // Card validations
    const cleanCard = cardData.cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 16) newErrors.cardNumber = 'Card number must be 16 digits';
    if (cardData.expDate.length < 5) newErrors.expDate = 'Expiration date is required (MM/YY)';
    if (cardData.cvc.length < 3) newErrors.cvc = 'CVC is required (3 digits)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      // Capture UTM source from current URL
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get('utm_source') || 'direct';

      const orderPayload = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        contactMethod: formData.contactMethod,
        contactDetail: formData.contactMethod === 'DM' 
          ? `${formData.dmPlatform}: ${formData.dmUsername}` 
          : formData.contactMethod === 'Call' ? formData.phone : formData.email,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          selectedColor: item.selectedColor || ''
        })),
        itemTotal: itemTotal,
        utmSource: utmSource
      };

      const newOrder = createOrder(orderPayload);
      setCreatedOrderId(newOrder.id);
      
      // Update local storage user profile so we can show address history
      const profile = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };
      localStorage.setItem('luchy_current_user', JSON.stringify(profile));

      setIsSubmitting(false);
      clearCart();
      
      // Navigate to order status path
      window.history.pushState(null, '', `/order-status/${newOrder.id}`);
      window.dispatchEvent(new Event('popstate'));
    }, 1500);
  };

  return (
    <div className="container" style={styles.container}>
      <h1>Checkout</h1>
      
      <div className="checkout-grid">
        {/* Left: Checkout Form */}
        <form onSubmit={handleSubmit} style={styles.formColumn}>
          {/* Section 1: Customer Contact Info */}
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>1. Customer Details</h3>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input" 
                placeholder="Amara Obi"
              />
              {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
            </div>

            <div className="checkout-form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Email Address (required)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="amara@email.com"
                />
                {errors.email && <span style={styles.errorText}>{errors.email}</span>}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input" 
                  placeholder="+1 (416) 555-0198"
                />
                {errors.phone && <span style={styles.errorText}>{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Address in Canada</label>
              <input 
                type="text" 
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-input" 
                placeholder="124 Maple St, Toronto, ON, M5V 2T6"
              />
              {errors.address && <span style={styles.errorText}>{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Contact Method</label>
              <div style={styles.contactChips}>
                {['Email', 'DM', 'Call'].map(method => (
                  <button
                    key={method}
                    type="button"
                    style={{
                      ...styles.contactChip,
                      backgroundColor: formData.contactMethod === method ? 'var(--color-dark)' : 'var(--color-white)',
                      color: formData.contactMethod === method ? 'var(--color-light)' : 'var(--color-dark)',
                      borderColor: formData.contactMethod === method ? 'var(--color-dark)' : 'var(--color-border)'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, contactMethod: method }))}
                  >
                    {method === 'DM' ? 'Social DM (Instagram/TikTok)' : method}
                  </button>
                ))}
              </div>
            </div>

            {formData.contactMethod === 'DM' && (
              <div style={styles.dmFieldsCard}>
                <label className="form-label">Which Platform?</label>
                <div style={styles.platformRow}>
                  {['Instagram', 'TikTok'].map(platform => (
                    <label key={platform} style={styles.platformOption}>
                      <input 
                        type="radio" 
                        name="dmPlatform"
                        checked={formData.dmPlatform === platform}
                        onChange={() => setFormData(prev => ({ ...prev, dmPlatform: platform }))}
                        style={styles.radioInput}
                      />
                      <span style={{ fontSize: '13px' }}>{platform}</span>
                    </label>
                  ))}
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Your @username or profile link</label>
                  <input 
                    type="text" 
                    name="dmUsername"
                    value={formData.dmUsername}
                    onChange={handleInputChange}
                    className="form-input" 
                    placeholder="@amara_cooks"
                  />
                  {errors.dmUsername && <span style={styles.errorText}>{errors.dmUsername}</span>}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Stripe Mock Payment */}
          <div style={styles.sectionCard}>
            <h3 style={styles.sectionTitle}>2. Item Payment (via Stripe)</h3>
            
            <div className="form-group">
              <label className="form-label">Card Number</label>
              <div style={styles.cardInputWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={styles.cardIcon}>
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <input 
                  type="text" 
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleCardChange}
                  maxLength="19"
                  className="form-input" 
                  placeholder="4242 4242 4242 4242"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
              {errors.cardNumber && <span style={styles.errorText}>{errors.cardNumber}</span>}
            </div>

            <div className="checkout-form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Expiration Date</label>
                <input 
                  type="text" 
                  name="expDate"
                  value={cardData.expDate}
                  onChange={handleCardChange}
                  maxLength="5"
                  className="form-input" 
                  placeholder="MM/YY"
                />
                {errors.expDate && <span style={styles.errorText}>{errors.expDate}</span>}
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">CVC Security Code</label>
                <input 
                  type="password" 
                  name="cvc"
                  value={cardData.cvc}
                  onChange={handleCardChange}
                  maxLength="3"
                  className="form-input" 
                  placeholder="123"
                />
                {errors.cvc && <span style={styles.errorText}>{errors.cvc}</span>}
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={styles.payBtn}
            disabled={isSubmitting || cart.length === 0}
          >
            {isSubmitting ? 'Processing Payment...' : `Pay $${itemTotal.toFixed(2)} CAD • Stripe`}
          </button>

          <p style={styles.deliveryNotice}>
            * Delivery fee is NOT charged at this step. It is calculated and billed separately after checkout by agreement.
          </p>
        </form>

        {/* Right: Order Summary */}
        <div className="checkout-summary-column" style={styles.summaryColumn}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            
            <div style={styles.itemsList}>
              {cart.map((item, idx) => (
                <div key={`${item.id}-${item.selectedColor || idx}`} style={styles.itemRow}>
                  <div>
                    <span style={styles.itemName}>
                      {item.name} <span style={styles.itemQty}>&times; {item.qty}</span>
                    </span>
                    {item.selectedColor && (
                      <span style={{ fontSize: '11px', color: 'var(--color-muted)', display: 'block', marginTop: '2px' }}>
                        Color: {item.selectedColor}
                      </span>
                    )}
                  </div>
                  <span style={styles.itemPrice}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={styles.pricingSection}>
              <div style={styles.pricingRow}>
                <span>Items Subtotal</span>
                <span>${itemTotal.toFixed(2)} CAD</span>
              </div>
              <div style={styles.pricingRow}>
                <span>Delivery (Canada-wide)</span>
                <span style={styles.deliveryQuote}>Quoted Later</span>
              </div>
              <div style={{ ...styles.pricingRow, borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px', fontWeight: '700', fontSize: '16px' }}>
                <span>Paid Now</span>
                <span style={{ color: 'var(--color-primary)' }}>${itemTotal.toFixed(2)} CAD</span>
              </div>
            </div>

            <div style={styles.separateNotice}>
              <h4 style={styles.separateTitle}>Separate Delivery Calculation</h4>
              <p style={styles.separateText}>
                Our system calculates shipping cost separately based on exact coordinates and package weight to get you the lowest rate. 
                Our founder will confirm the delivery cost and update your Order Status page (typically within 12 hours).
              </p>
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
  pageTitle: {
    fontSize: '44px',
    fontWeight: '400',
    marginBottom: '48px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '24px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '48px',
    alignItems: 'start',
  },
  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  sectionCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: 'var(--font-sans)',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
  },
  contactChips: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  contactChip: {
    padding: '12px 20px',
    border: '1px solid',
    borderRadius: 'var(--border-radius)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'var(--transition)',
  },
  dmFieldsCard: {
    marginTop: '20px',
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '20px',
    borderRadius: 'var(--border-radius)',
  },
  platformRow: {
    display: 'flex',
    gap: '24px',
    marginBottom: '20px',
  },
  platformOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  radioInput: {
    accentColor: 'var(--color-primary)',
    cursor: 'pointer',
  },
  cardInputWrapper: {
    position: 'relative',
  },
  cardIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-muted)',
  },
  errorText: {
    display: 'block',
    color: 'var(--color-primary)',
    fontSize: '12px',
    marginTop: '6px',
    fontWeight: '500',
  },
  payBtn: {
    width: '100%',
    padding: '18px',
    fontSize: '14px',
  },
  deliveryNotice: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    textAlign: 'center',
  },
  summaryColumn: {
    position: 'sticky',
    top: '120px',
  },
  summaryCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
  },
  summaryTitle: {
    fontSize: '22px',
    fontWeight: '500',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '24px',
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  itemName: {
    fontFamily: 'var(--font-serif)',
    fontWeight: '600',
  },
  itemQty: {
    color: 'var(--color-muted)',
    marginLeft: '6px',
  },
  itemPrice: {
    fontWeight: '500',
  },
  pricingSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '32px',
  },
  pricingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: 'var(--color-dark)',
  },
  deliveryQuote: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    color: 'var(--color-primary)',
  },
  separateNotice: {
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '20px',
    borderRadius: 'var(--border-radius)',
  },
  separateTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
    marginBottom: '8px',
    color: 'var(--color-primary)',
  },
  separateText: {
    fontSize: '12px',
    lineHeight: '1.6',
    color: 'var(--color-muted)',
  }
};
