import React from 'react';

export default function Home({ products, setView, setSelectedProduct, openDmModal }) {
  // Select a diverse set of featured products: prioritize custom uploaded items, plus category representatives
  const getFeatured = () => {
    if (products.length === 0) return [];
    
    const customProducts = products.filter(p => Boolean(p.isCustom || String(p.id).startsWith('custom-') || String(p.id).length > 3));
    const cookware = products.find(p => p.category === 'Cookware');
    const kitchenware = products.find(p => p.category === 'Kitchenware');
    const utensils = products.find(p => p.category === 'Utensils');
    
    const featured = [];
    
    // Put uploaded custom items first!
    customProducts.forEach(cp => {
      if (featured.length < 2 && !featured.some(f => f.id === cp.id)) {
        featured.push(cp);
      }
    });

    if (cookware && !featured.some(f => f.id === cookware.id)) featured.push(cookware);
    if (kitchenware && !featured.some(f => f.id === kitchenware.id)) featured.push(kitchenware);
    if (utensils && !featured.some(f => f.id === utensils.id)) featured.push(utensils);
    
    // Fallback to fill up to 4 items
    while (featured.length < 4 && featured.length < products.length) {
      const next = products.find(p => !featured.some(f => f.id === p.id));
      if (next) featured.push(next);
      else break;
    }
    
    return featured.slice(0, 4);
  };
  
  const featuredProducts = getFeatured();

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section className="hero-section">
        <div style={styles.heroContent}>
          <span style={styles.preTitle}>Luchy Home Items Canada</span>
          <h1 className="hero-title">
            Home goods from <br />
            <span style={styles.titleItalic}>back home</span> — delivered.
          </h1>
          <p style={styles.subtitle}>
            Every item listed is already imported and in stock in Canada. 
            We calculate delivery cost after your order, keeping checkout instant while keeping shipping flexible.
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn btn-primary hero-action-btn" 
              onClick={() => setView('catalogue')}
            >
              Shop the Catalogue
            </button>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges-row">
            <div style={styles.badgeItem}>
              <span style={styles.badgeDot}></span>
              <span style={styles.badgeText}>Managed Delivery</span>
            </div>
            <div style={styles.badgeItem}>
              <span style={styles.badgeDot}></span>
              <span style={styles.badgeText}>Global Sourcing</span>
            </div>
            <div style={styles.badgeItem}>
              <span style={styles.badgeDot}></span>
              <span style={styles.badgeText}>Pay Flexibly</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image Container */}
        <div style={styles.heroImageWrapper}>
          <div style={styles.heroImageCard}>
            <img 
              src="/images/cast_iron_pot.jpg" 
              alt="Luchyhomes Cast-iron pot" 
              style={styles.heroImage}
            />
            <div style={styles.heroImageCaption}>
              <span style={styles.heroImageTitle}>Featured: Cast-Iron cooking pot</span>
              <span style={styles.heroImagePrice}>$48.00 CAD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section style={styles.featuredSection}>
        <div className="container">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Items</h2>
            <button className="btn-link" onClick={() => setView('catalogue')}>
              View all products &rarr;
            </button>
          </div>
          
          <div className="grid-4" style={styles.featuredGrid}>
            {featuredProducts.map(product => (
              <div 
                key={product.id} 
                style={styles.productCard}
                onClick={() => {
                  setSelectedProduct(product);
                  setView('product');
                }}
              >
                <div style={styles.imageContainer}>
                  <img 
                    src={product.image || '/images/cast_iron_pot.jpg'} 
                    alt={product.name} 
                    style={styles.productImage} 
                    onError={(e) => { e.target.src = '/images/cast_iron_pot.jpg'; }}
                  />
                  <div style={styles.productOverlay}>
                    <span style={styles.viewLabel}>View Details</span>
                  </div>
                </div>
                <div style={styles.productInfo}>
                  <div>
                    <span style={styles.productCategory}>{product.category}</span>
                    <h3 style={styles.productName}>{product.name}</h3>
                  </div>
                  <span style={styles.productPrice}>${product.price.toFixed(2)} CAD</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Promise Info Section */}
      <section style={styles.promiseSection}>
        <div className="container" style={styles.promiseContainer}>
          <div style={styles.promiseCard}>
            <h2 style={styles.promiseTitle}>Why Diaspora Households Trust Us</h2>
            <div style={styles.promiseGrid}>
              <div style={styles.promiseItem}>
                <h4 style={styles.promiseItemTitle}>01 / Locally Stocked</h4>
                <p style={styles.promiseItemText}>No waiting months for international freight shipments. We pre-import and store everything in our Canadian warehouse so your order ships immediately.</p>
              </div>
              <div style={styles.promiseItem}>
                <h4 style={styles.promiseItemTitle}>02 / Splitted Payment</h4>
                <p style={styles.promiseItemText}>Pay for items upfront via Stripe securely. We calculate the exact delivery fee for your address afterwards, which you can pay before dispatch or upon arrival.</p>
              </div>
              <div style={styles.promiseItem}>
                <h4 style={styles.promiseItemTitle}>03 / Personal Support</h4>
                <p style={styles.promiseItemText}>Prefer to order through social media? Call or DM us anytime. We link your order details directly to your phone number for seamless manual order processing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  container: {
    minHeight: 'calc(100vh - 80px)',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '48px',
    alignItems: 'center',
    padding: '80px 8% 100px 8%',
    backgroundColor: 'var(--color-white)',
    borderBottom: '1px solid var(--color-border)',
  },
  heroContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  preTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: 'var(--color-primary)',
    marginBottom: '16px',
  },
  title: {
    fontSize: '56px',
    lineHeight: '1.15',
    color: 'var(--color-dark)',
    marginBottom: '24px',
    fontWeight: '400',
  },
  titleItalic: {
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  subtitle: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: 'var(--color-muted)',
    maxWidth: '540px',
    marginBottom: '40px',
  },
  heroActions: {
    display: 'flex',
    gap: '16px',
    marginBottom: '56px',
    width: '100%',
  },
  heroBtn: {
    padding: '16px 36px',
    fontSize: '13px',
  },
  heroBtnSecondary: {
    padding: '16px 36px',
    fontSize: '13px',
  },
  trustBadges: {
    display: 'flex',
    gap: '32px',
    borderTop: '1px solid var(--color-border)',
    paddingTop: '24px',
    width: '100%',
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    backgroundColor: 'var(--color-primary)',
    borderRadius: '50%',
  },
  badgeText: {
    fontSize: '12px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
    color: 'var(--color-dark)',
  },
  heroImageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImageCard: {
    backgroundColor: 'var(--color-light)',
    border: '1px solid var(--color-border)',
    padding: '16px',
    width: '100%',
    maxWidth: '380px',
  },
  heroImage: {
    width: '100%',
    aspectRatio: '1',
    objectFit: 'cover',
    marginBottom: '16px',
  },
  heroImageCaption: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  heroImageTitle: {
    fontFamily: 'var(--font-serif)',
    fontWeight: '600',
  },
  heroImagePrice: {
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  featuredSection: {
    padding: '100px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '48px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '16px',
  },
  sectionTitle: {
    fontSize: '32px',
  },
  featuredGrid: {
    gap: '40px',
  },
  productCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'var(--transition)',
  },
  imageContainer: {
    position: 'relative',
    overflow: 'hidden',
    aspectRatio: '1.2',
    backgroundColor: 'var(--color-light)',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition)',
  },
  productOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(22, 23, 26, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'var(--transition)',
  },
  viewLabel: {
    color: 'var(--color-light)',
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: '12px',
    letterSpacing: '0.1em',
    borderBottom: '1px solid var(--color-light)',
    paddingBottom: '4px',
  },
  productInfo: {
    padding: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productCategory: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--color-muted)',
    fontWeight: '600',
    letterSpacing: '0.08em',
    display: 'block',
    marginBottom: '4px',
  },
  productName: {
    fontSize: '18px',
    fontWeight: '500',
  },
  productPrice: {
    fontWeight: '600',
    color: 'var(--color-primary)',
  },
  promiseSection: {
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-light)',
    padding: '100px 0',
  },
  promiseContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  promiseCard: {
    maxWidth: '1000px',
    width: '100%',
  },
  promiseTitle: {
    fontSize: '36px',
    color: 'var(--color-light)',
    marginBottom: '56px',
    textAlign: 'center',
  },
  promiseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '40px',
  },
  promiseItem: {
    borderTop: '1px solid rgba(250, 248, 245, 0.2)',
    paddingTop: '24px',
  },
  promiseItemTitle: {
    fontSize: '16px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.08em',
    color: 'var(--color-primary)',
    marginBottom: '16px',
    fontFamily: 'var(--font-sans)',
  },
  promiseItemText: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'rgba(250, 248, 245, 0.7)',
  },
};
// Responsive adjustments logic is integrated via CSS in main.css
