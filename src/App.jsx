import React, { useState, useEffect } from 'react';
import { getProducts } from './db/mockDb';
import Header from './components/Header';
import Home from './components/Storefront/Home';
import Catalogue from './components/Storefront/Catalogue';
import Product from './components/Storefront/Product';
import Cart from './components/Storefront/Cart';
import Checkout from './components/Storefront/Checkout';
import OrderStatus from './components/Storefront/OrderStatus';
import History from './components/Account/History';

import AdminLayout from './components/Admin/AdminLayout';
import OrderQueue from './components/Admin/OrderQueue';
import Inventory from './components/Admin/Inventory';
import Analytics from './components/Admin/Analytics';

export default function App() {
  // Routing State
  const [route, setRoute] = useState({ view: 'storefront', orderId: null });
  
  // Storefront Sub-views: 'home', 'catalogue', 'product', 'checkout', 'order-status', 'account'
  const [storefrontView, setStorefrontView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Admin Sub-tabs: 'orders', 'inventory', 'analytics'
  const [adminTab, setAdminTab] = useState('orders');

  // Shared Storefront state
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // DM Fallback Modal state
  const [dmModal, setDmModal] = useState({ isOpen: false, product: null });

  // Load products and parse initial route
  useEffect(() => {
    setProducts(getProducts());
    
    const handleRouteChange = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setRoute({ view: 'admin', orderId: null });
      } else {
        const orderMatch = path.match(/^\/order-status\/([^/]+)/);
        if (orderMatch) {
          setRoute({ view: 'storefront', orderId: orderMatch[1] });
          setStorefrontView('order-status');
          setSelectedOrderId(orderMatch[1]);
        } else {
          setRoute({ view: 'storefront', orderId: null });
          // If returning from admin, default back to home or keep sub-view
        }
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    
    // Listen for database changes to refresh product catalog
    const handleDbUpdate = () => {
      setProducts(getProducts());
    };
    window.addEventListener('db-updated', handleDbUpdate);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('db-updated', handleDbUpdate);
    };
  }, []);

  // Sync cart from session/local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('luchy_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('luchy_cart', JSON.stringify(newCart));
  };

  // Cart operations
  const addToCart = (product, qty, selectedColor = '') => {
    const existing = cart.find(item => item.id === product.id && (item.selectedColor || '') === selectedColor);
    let newCart;
    if (existing) {
      newCart = cart.map(item => 
        (item.id === product.id && (item.selectedColor || '') === selectedColor)
          ? { ...item, qty: Math.min(product.stock, item.qty + qty) } 
          : item
      );
    } else {
      newCart = [...cart, { ...product, qty, selectedColor }];
    }
    saveCart(newCart);
    setIsCartOpen(true); // Open cart drawer on add
  };

  const updateCartQty = (id, selectedColor, qty) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const minQty = Math.max(1, product.moq || 1);
    const newCart = cart.map(item => 
      (item.id === id && (item.selectedColor || '') === selectedColor)
        ? { ...item, qty: Math.max(minQty, Math.min(product.stock, qty)) } 
        : item
    );
    saveCart(newCart);
  };

  const removeFromCart = (id, selectedColor) => {
    const newCart = cart.filter(item => !(item.id === id && (item.selectedColor || '') === selectedColor));
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const reorderItems = (orderItems) => {
    const newCart = [...cart];
    orderItems.forEach(orderItem => {
      const product = products.find(p => p.id === orderItem.id);
      if (product && product.stock > 0) {
        const existing = newCart.find(item => item.id === orderItem.id);
        if (existing) {
          existing.qty = Math.min(product.stock, existing.qty + orderItem.qty);
        } else {
          newCart.push({ ...product, qty: Math.min(product.stock, orderItem.qty) });
        }
      }
    });
    saveCart(newCart);
    setStorefrontView('catalogue');
    setIsCartOpen(true);
  };

  // View Navigation helper
  const navigateToStorefrontView = (view) => {
    setStorefrontView(view);
    // If we are currently in admin view, navigate back to base path
    if (route.view === 'admin') {
      window.history.pushState(null, '', '/');
      setRoute({ view: 'storefront', orderId: null });
    }
  };

  // Open Social DM helper
  const openDmModal = (product = null) => {
    setDmModal({ isOpen: true, product });
  };

  const closeDmModal = () => {
    setDmModal({ isOpen: false, product: null });
  };

  // Custom DM redirection link builders
  const getWhatsAppLink = () => {
    const phone = '15483984595'; // Luchyhomes official WhatsApp number
    let text = "Hi Luchyhomes, I'm interested in placing an order.";
    if (dmModal.product) {
      text = `Hi Luchyhomes, I'd like to inquire about ordering the "${dmModal.product.name}" (CAD $${dmModal.product.price.toFixed(2)}).`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const getInstagramLink = () => {
    return 'https://www.instagram.com/luchyhomeitemscanada?igsh=MWhyNHV3ajNzdHNpZw==';
  };

  const getTikTokLink = () => {
    return 'https://www.tiktok.com/@luchyhomeitems.ca?_r=1&_t=ZS-97ZM9ImRUIP';
  };

  // RENDER CONTROLLER
  if (route.view === 'admin') {
    return (
      <AdminLayout activeTab={adminTab} setActiveTab={setAdminTab}>
        {adminTab === 'orders' && <OrderQueue />}
        {adminTab === 'inventory' && <Inventory />}
        {adminTab === 'analytics' && <Analytics />}
      </AdminLayout>
    );
  }

  // Else Storefront Render
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        currentView={storefrontView} 
        setView={navigateToStorefrontView} 
        cartItemsCount={cartCount} 
        toggleCart={() => setIsCartOpen(!isCartOpen)} 
      />

      <main style={{ flex: 1 }}>
        {storefrontView === 'home' && (
          <Home 
            products={products} 
            setView={navigateToStorefrontView} 
            setSelectedProduct={setSelectedProduct} 
            openDmModal={() => openDmModal()}
          />
        )}
        {storefrontView === 'catalogue' && (
          <Catalogue 
            products={products} 
            setView={navigateToStorefrontView} 
            setSelectedProduct={setSelectedProduct} 
          />
        )}
        {storefrontView === 'product' && selectedProduct && (
          <Product 
            product={selectedProduct} 
            setView={navigateToStorefrontView} 
            addToCart={addToCart}
            openDmModal={openDmModal}
          />
        )}
        {storefrontView === 'checkout' && (
          <Checkout 
            cart={cart} 
            clearCart={clearCart} 
            setView={navigateToStorefrontView} 
            setCreatedOrderId={setSelectedOrderId}
          />
        )}
        {storefrontView === 'order-status' && (
          <OrderStatus orderId={selectedOrderId} />
        )}
        {storefrontView === 'account' && (
          <History 
            setView={navigateToStorefrontView} 
            setSelectedOrderId={setSelectedOrderId}
            reorderItems={reorderItems}
          />
        )}
      </main>

      {/* Classy Editorial Footer */}
      <footer style={styles.footer}>
        <div className="container" style={styles.footerContainer}>
          <div style={styles.footerBrand}>
            <h3 style={styles.footerBrandName}>LUCHYHOMES</h3>
            <p style={styles.footerBrandTagline}>Premium household items imported and stocked locally in Canada.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubTitle}>Contact Details</h4>
            <p style={styles.footerText}>📞 Phone: <a href="tel:+15483984595" style={styles.footerContactLink}>+1 (548) 398-4595</a></p>
            <p style={styles.footerText}>✉️ Email: <a href="mailto:Luchyhomeitemscanada@gmail.com" style={styles.footerContactLink}>Luchyhomeitemscanada@gmail.com</a></p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubTitle}>Social Connections</h4>
            <div style={styles.footerSocialsRow}>
              <a href="https://www.instagram.com/luchyhomeitemscanada?igsh=MWhyNHV3ajNzdHNpZw==" target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>Instagram</a>
              <a href="https://www.tiktok.com/@luchyhomeitems.ca?_r=1&_t=ZS-97ZM9ImRUIP" target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>TikTok</a>
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" style={styles.footerSocialLink}>WhatsApp</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Luchyhomes. Sourced internationally, delivered Canada-wide.</p>
        </div>
      </footer>

      {/* Slide-over Cart Panel */}
      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateCartQty={updateCartQty} 
        removeFromCart={removeFromCart} 
        setView={navigateToStorefrontView}
      />

      {/* Floating WhatsApp/DM Button */}
      <button 
        style={styles.floatingMessageBtn} 
        onClick={() => openDmModal()}
        aria-label="Message to Order"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Classy DM Overlay Modal */}
      {dmModal.isOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBackdrop} onClick={closeDmModal}></div>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Message us to Order</h3>
              <button style={styles.modalCloseBtn} onClick={closeDmModal}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            
            <p style={styles.modalText}>
              Prefer direct communication? You can place your order or ask questions directly by messaging our team on WhatsApp, Instagram, or TikTok.
            </p>

            {dmModal.product && (
              <div style={styles.modalProductCard}>
                <img src={dmModal.product.image} alt="" style={styles.modalProductImg} />
                <div>
                  <h4 style={styles.modalProductName}>{dmModal.product.name}</h4>
                  <span style={styles.modalProductPrice}>${dmModal.product.price.toFixed(2)} CAD</span>
                </div>
              </div>
            )}

            <div style={styles.modalButtons}>
              <a 
                href={getWhatsAppLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ ...styles.socialBtn, backgroundColor: '#25D366', color: '#fff', fontSize: '11px', flex: '1', minWidth: '100px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.459h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                </svg>
                WhatsApp
              </a>
              <a 
                href={getInstagramLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ ...styles.socialBtn, backgroundColor: '#E1306C', color: '#fff', fontSize: '11px', flex: '1', minWidth: '100px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Instagram
              </a>
              <a 
                href={getTikTokLink()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn" 
                style={{ ...styles.socialBtn, backgroundColor: '#000000', color: '#fff', fontSize: '11px', flex: '1', minWidth: '100px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px' }}>
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.94-1.78-.22-.21-.42-.45-.61-.69-.01 3.56-.01 7.11-.02 10.67-.18 2.22-1.23 4.38-3.08 5.66-2.11 1.45-5.01 1.83-7.46 1-2.43-.81-4.4-2.79-5.12-5.26-.81-2.77-.22-5.91 1.58-8.15 1.79-2.25 4.74-3.32 7.55-2.82.02 1.39.02 2.78.02 4.17-1.68-.46-3.56-.12-4.93.99-1.22.99-1.84 2.62-1.61 4.19.2 1.45 1.17 2.76 2.53 3.29 1.34.53 2.97.35 4.14-.51.98-.73 1.54-1.88 1.58-3.11.02-6.52.01-13.04.02-19.56z" />
                </svg>
                TikTok
              </a>
            </div>

            <div style={{ marginTop: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', fontSize: '12px', color: 'var(--color-muted)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p>📞 Phone: <a href="tel:+15483984595" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>+1 (548) 398-4595</a></p>
              <p>✉️ Email: <a href="mailto:Luchyhomeitemscanada@gmail.com" style={{ textDecoration: 'underline', color: 'var(--color-dark)' }}>Luchyhomeitemscanada@gmail.com</a></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  floatingMessageBtn: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-light)',
    border: 'none',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(156, 32, 32, 0.3)',
    zIndex: 90,
    transition: 'var(--transition)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  },
  modalBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(22, 23, 26, 0.5)',
    backdropFilter: 'blur(3px)',
  },
  modalContent: {
    position: 'relative',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    width: '100%',
    maxWidth: '460px',
    padding: '32px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    animation: 'fadeIn 0.25s ease-out',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '500',
  },
  modalCloseBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--color-dark)',
  },
  modalText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'var(--color-muted)',
    marginBottom: '24px',
  },
  modalProductCard: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    marginBottom: '24px',
    alignItems: 'center',
  },
  modalProductImg: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
  },
  modalProductName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '15px',
    fontWeight: '600',
  },
  modalProductPrice: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-primary)',
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  socialBtn: {
    width: '100%',
    padding: '14px',
    fontSize: '13px',
    textTransform: 'none',
  },
  footer: {
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-light)',
    padding: '64px 0 24px 0',
    marginTop: '80px',
    borderTop: '1px solid var(--color-border)',
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '40px',
  },
  footerBrand: {
    flex: '1.5',
    minWidth: '260px',
  },
  footerBrandName: {
    fontFamily: 'var(--font-serif)',
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--color-light)',
    letterSpacing: '3px',
    marginBottom: '16px',
  },
  footerBrandTagline: {
    color: 'var(--color-muted)',
    fontSize: '14px',
    lineHeight: '1.6',
    maxWidth: '300px',
  },
  footerSection: {
    flex: '1',
    minWidth: '200px',
  },
  footerSubTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-muted)',
    marginBottom: '16px',
  },
  footerText: {
    fontSize: '13px',
    color: 'rgba(250, 248, 245, 0.8)',
    marginBottom: '8px',
  },
  footerContactLink: {
    color: 'var(--color-light)',
    textDecoration: 'underline',
  },
  footerSocialsRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  footerSocialLink: {
    fontSize: '13px',
    color: 'rgba(250, 248, 245, 0.8)',
    textDecoration: 'underline',
    transition: 'var(--transition)',
  },
  footerBottom: {
    textAlign: 'center',
    borderTop: '1px solid rgba(250, 248, 245, 0.1)',
    paddingTop: '24px',
    marginTop: '48px',
    fontSize: '11px',
    color: 'var(--color-muted)',
  }
};
