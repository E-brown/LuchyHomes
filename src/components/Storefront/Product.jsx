import React, { useState, useEffect } from 'react';

export default function Product({ product, setView, addToCart, openDmModal }) {
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const [qty, setQty] = useState(Math.max(1, product.moq || 1));
  const [activeImage, setActiveImage] = useState(productImages[0] || product.image);
  const [selectedColor, setSelectedColor] = useState('');
  const [colorError, setColorError] = useState(false);
  const isOutOfStock = product.stock <= 0;

  // Sync state variables when product item changes
  useEffect(() => {
    const nextImages = product.images && product.images.length > 0 
      ? product.images 
      : [product.image];
    setQty(Math.max(1, product.moq || 1));
    setActiveImage(nextImages[0] || product.image);
    setSelectedColor('');
    setColorError(false);
  }, [product]);

  const handleIncrement = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const handleDecrement = () => {
    if (qty > Math.max(1, product.moq || 1)) {
      setQty(qty - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setColorError(true);
      alert('Please select an available color option before adding to your cart.');
      return;
    }
    if (qty <= product.stock) {
      addToCart(product, qty, selectedColor);
      setColorError(false);
    }
  };

  return (
    <div className="container" style={styles.container}>
      {/* Back Link */}
      <button style={styles.backLink} onClick={() => setView('catalogue')}>
        &larr; Back to Catalogue
      </button>

      {/* Main product view grid */}
      <div className="product-detail-grid">
        {/* Left Side: Product Image & Gallery */}
        <div style={styles.imageColumn}>
          <div style={styles.imageCard}>
            <img src={activeImage} alt={product.name} style={styles.image} />
            {isOutOfStock && <span style={styles.soldOutOverlay}>Sold Out</span>}
          </div>
          
          {productImages.length > 1 && (
            <div style={styles.galleryThumbsRow}>
              {productImages.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  style={{
                    ...styles.galleryThumbBtn,
                    border: activeImage === img ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                  }}
                >
                  <img src={img} alt="" style={styles.galleryThumbImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div style={styles.detailsColumn}>
          <span style={styles.category}>{product.category}</span>
          <h1>{product.name}</h1>
          <span style={styles.price}>${product.price.toFixed(2)} CAD</span>

          {/* Stock status */}
          <div style={styles.stockRow}>
            {isOutOfStock ? (
              <span style={styles.stockOut}>Sold Out - Sourcing New Batch</span>
            ) : product.stock <= 5 ? (
              <span style={styles.stockLow}>Low Stock: Only {product.stock} items remaining in Canada</span>
            ) : (
              <span style={styles.stockIn}>In Stock (Ready to ship from Canadian warehouse)</span>
            )}
          </div>

          {/* Description */}
          <p style={styles.description}>{product.description}</p>

          {!isOutOfStock && (
            <>
              {/* MOQ Badge Notification */}
              {product.moq > 1 && (
                <div style={styles.moqBadge}>
                  ⚠️ Minimum Order Quantity: <strong>{product.moq} units</strong>
                </div>
              )}

              {/* Color Selection Dropdown */}
              {product.colors && product.colors.length > 0 && (
                <div style={styles.colorSection}>
                  <label style={styles.colorLabel}>Select Color</label>
                  <select 
                    value={selectedColor} 
                    onChange={(e) => {
                      setSelectedColor(e.target.value);
                      setColorError(false);
                    }}
                    className="form-input"
                    style={{
                      ...styles.colorSelect,
                      borderColor: colorError ? 'var(--color-primary)' : 'var(--color-border)',
                      backgroundColor: colorError ? '#faf0f0' : 'var(--color-white)'
                    }}
                  >
                    <option value="">-- Choose a color --</option>
                    {product.colors.map((color, idx) => (
                      <option key={idx} value={color}>{color}</option>
                    ))}
                  </select>
                  {colorError && <p style={styles.colorErrorText}>* Please select a color from the choices above.</p>}
                </div>
              )}

              {/* Quantity Selector */}
              <div style={styles.quantitySection}>
                <span style={styles.quantityLabel}>Quantity</span>
                <div style={styles.qtyCounter}>
                  <button 
                    style={styles.qtyBtn} 
                    onClick={handleDecrement}
                    disabled={qty <= Math.max(1, product.moq || 1)}
                  >
                    &minus;
                  </button>
                  <span style={styles.qtyValue}>{qty}</span>
                  <button 
                    style={styles.qtyBtn} 
                    onClick={handleIncrement}
                    disabled={qty >= product.stock}
                  >
                    &#43;
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="product-actions-row">
                <button 
                  className="btn btn-primary" 
                  style={styles.addBtn}
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <button 
                  className="btn btn-secondary" 
                  style={styles.dmBtn}
                  onClick={() => openDmModal(product)}
                >
                  Message us to order
                </button>
              </div>
            </>
          )}

          {isOutOfStock && (
            <div className="product-actions-row">
              <button 
                className="btn btn-secondary" 
                style={styles.dmBtnFull}
                onClick={() => openDmModal(product)}
              >
                Inquire about next shipment
              </button>
            </div>
          )}

          {/* Delivery Policy Note */}
          <div style={styles.deliveryNotice}>
            <div style={styles.noticeIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div style={styles.noticeContent}>
              <h4 style={styles.noticeTitle}>Flexible Delivery Payment</h4>
              <p style={styles.noticeText}>
                You only pay for items now. Delivery cost is calculated after checkout based on your address and package size. 
                You can pay the delivery fee via Interac e-Transfer before dispatch, or in cash/card on arrival, by arrangement.
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
    paddingTop: '40px',
    paddingBottom: '100px',
  },
  backLink: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-muted)',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: '40px',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'var(--transition)',
    padding: '4px 0',
  },
  imageColumn: {
    width: '100%',
  },
  imageCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '24px',
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
  },
  soldOutOverlay: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-light)',
    padding: '6px 12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  detailsColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  category: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-primary)',
    fontWeight: '600',
    marginBottom: '12px',
  },
  title: {
    fontSize: '44px',
    fontWeight: '400',
    lineHeight: '1.2',
    marginBottom: '16px',
  },
  price: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--color-primary)',
    marginBottom: '24px',
  },
  stockRow: {
    marginBottom: '32px',
  },
  stockIn: {
    fontSize: '12px',
    color: 'var(--color-success)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#edf5ee',
    padding: '6px 12px',
    borderRadius: '2px',
  },
  stockLow: {
    fontSize: '12px',
    color: 'var(--color-warning)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#faf2e6',
    padding: '6px 12px',
    borderRadius: '2px',
  },
  stockOut: {
    fontSize: '12px',
    color: 'var(--color-primary)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    backgroundColor: '#faf0f0',
    padding: '6px 12px',
    borderRadius: '2px',
  },
  description: {
    fontSize: '15px',
    lineHeight: '1.7',
    color: '#4a4a4d',
    marginBottom: '40px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '32px',
    width: '100%',
  },
  quantitySection: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '32px',
  },
  quantityLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--color-muted)',
  },
  qtyCounter: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    overflow: 'hidden',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    width: '40px',
    height: '40px',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'var(--transition)',
  },
  qtyValue: {
    width: '40px',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: '15px',
  },
  addBtn: {
    flex: '1.3',
    padding: '16px',
  },
  dmBtn: {
    flex: '1',
    padding: '16px',
  },
  dmBtnFull: {
    width: '100%',
    padding: '16px',
  },
  deliveryNotice: {
    display: 'flex',
    gap: '16px',
    padding: '24px',
    backgroundColor: 'var(--color-white)',
    borderLeft: '3px solid var(--color-primary)',
    borderTop: '1px solid var(--color-border)',
    borderRight: '1px solid var(--color-border)',
    borderBottom: '1px solid var(--color-border)',
    width: '100%',
  },
  noticeIcon: {
    color: 'var(--color-primary)',
    marginTop: '2px',
  },
  noticeContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  noticeTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '8px',
  },
  noticeText: {
    fontSize: '13px',
    lineHeight: '1.6',
    color: 'var(--color-muted)',
  },
  galleryThumbsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '16px',
    justifyContent: 'flex-start',
  },
  galleryThumbBtn: {
    width: '64px',
    height: '64px',
    padding: '4px',
    backgroundColor: 'var(--color-white)',
    cursor: 'pointer',
    borderRadius: '4px',
    overflow: 'hidden',
    transition: 'var(--transition)',
  },
  galleryThumbImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  colorSection: {
    marginBottom: '24px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  colorLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--color-muted)',
    marginBottom: '8px',
  },
  colorSelect: {
    width: '100%',
    maxWidth: '300px',
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid var(--color-border)',
    transition: 'var(--transition)',
  },
  colorErrorText: {
    fontSize: '11px',
    color: 'var(--color-primary)',
    fontWeight: '600',
    marginTop: '6px',
  },
  moqBadge: {
    fontSize: '12px',
    color: 'var(--color-primary)',
    backgroundColor: '#faf0f0',
    padding: '8px 16px',
    borderRadius: 'var(--border-radius)',
    border: '1px solid rgba(156, 32, 32, 0.1)',
    marginBottom: '20px',
    alignSelf: 'stretch',
    textAlign: 'left',
  }
};
