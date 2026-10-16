import React, { useState } from 'react';

export default function Catalogue({ products, setView, setSelectedProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // popular, price-asc, price-desc, name

  // Extract unique categories
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    
    // Default 'popular' sort: place newly added custom products (timestamp IDs or isCustom) at the top
    const isCustomA = Boolean(a.isCustom || String(a.id).startsWith('custom-') || String(a.id).length > 3);
    const isCustomB = Boolean(b.isCustom || String(b.id).startsWith('custom-') || String(b.id).length > 3);
    if (isCustomA && !isCustomB) return -1;
    if (!isCustomA && isCustomB) return 1;
    if (isCustomA && isCustomB) return String(b.id).localeCompare(String(a.id)); // newest custom first
    
    return 0; // maintain original layout catalog order
  });

  return (
    <div className="container" style={styles.container}>
      {/* Page Title */}
      <div style={styles.header}>
        <span style={styles.subtitle}>Canadian Local Stock</span>
        <h1 style={styles.title}>The Catalogue</h1>
      </div>

      {/* Toolbar: Search, Filters, Sort */}
      <div className="catalogue-toolbar">
        {/* Search */}
        <div className="catalogue-search">
          <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        {/* Categories (Chips) */}
        <div className="catalogue-chips">
          {categories.map(category => (
            <button
              key={category}
              style={{
                ...styles.chip,
                backgroundColor: selectedCategory === category ? 'var(--color-dark)' : 'transparent',
                color: selectedCategory === category ? 'var(--color-light)' : 'var(--color-dark)',
                borderColor: selectedCategory === category ? 'var(--color-dark)' : 'var(--color-border)'
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="catalogue-sort">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="popular">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Grid items list */}
      <div style={styles.metaRow}>
        <span style={styles.itemsCount}>{sortedProducts.length} items found</span>
      </div>

      {sortedProducts.length > 0 ? (
        <div className="grid-4" style={styles.grid}>
          {sortedProducts.map(product => {
            const isOutOfStock = product.stock <= 0;
            return (
              <div 
                key={product.id} 
                style={{
                  ...styles.productCard,
                  opacity: isOutOfStock ? 0.7 : 1
                }}
                onClick={() => {
                  setSelectedProduct(product);
                  setView('product');
                }}
              >
                <div style={styles.imageWrapper}>
                  <img 
                    src={product.image || '/images/cast_iron_pot.jpg'} 
                    alt={product.name} 
                    style={styles.productImage} 
                    onError={(e) => { e.target.src = '/images/cast_iron_pot.jpg'; }}
                  />
                  {isOutOfStock ? (
                    <div style={styles.outOfStockBadge}>Sold Out</div>
                  ) : (
                    <div style={styles.hoverOverlay}>
                      <span style={styles.hoverText}>View Item</span>
                    </div>
                  )}
                </div>
                
                <div style={styles.productInfo}>
                  <span style={styles.productCategory}>{product.category}</span>
                  <h3 style={styles.productName}>{product.name}</h3>
                  <div style={styles.priceRow}>
                    <span style={styles.productPrice}>${product.price.toFixed(2)} CAD</span>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span style={styles.lowStockWarning}>Only {product.stock} left</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.noResults}>
          <h3 style={styles.noResultsTitle}>No items match your search.</h3>
          <p style={styles.noResultsSub}>Try adjusting your filters or search keywords.</p>
          <button className="btn btn-secondary" style={{ marginTop: '24px' }} onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    paddingTop: '60px',
    paddingBottom: '100px',
  },
  header: {
    marginBottom: '48px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '24px',
  },
  subtitle: {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--color-primary)',
    fontWeight: '600',
    display: 'block',
    marginBottom: '8px',
  },
  title: {
    fontSize: '44px',
    fontWeight: '400',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--color-muted)',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-dark)',
    transition: 'var(--transition)',
  },
  chip: {
    padding: '8px 18px',
    fontSize: '12px',
    fontWeight: '500',
    borderRadius: '16px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'var(--transition)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  sortSelect: {
    width: '100%',
    padding: '10px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'var(--color-white)',
    color: 'var(--color-dark)',
    outline: 'none',
  },
  metaRow: {
    marginBottom: '24px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '12px',
  },
  itemsCount: {
    fontSize: '12px',
    color: 'var(--color-muted)',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  grid: {
    gap: '32px 24px',
  },
  productCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'var(--transition)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  imageWrapper: {
    position: 'relative',
    aspectRatio: '1',
    backgroundColor: 'var(--color-light)',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'var(--transition)',
  },
  hoverOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(22, 23, 26, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'var(--transition)',
  },
  hoverText: {
    color: 'var(--color-light)',
    textTransform: 'uppercase',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.1em',
    borderBottom: '1px solid var(--color-light)',
    paddingBottom: '2px',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: 'var(--color-dark)',
    color: 'var(--color-light)',
    padding: '4px 10px',
    fontSize: '10px',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  productInfo: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  productCategory: {
    fontSize: '10px',
    textTransform: 'uppercase',
    color: 'var(--color-muted)',
    fontWeight: '600',
    letterSpacing: '0.05em',
    marginBottom: '4px',
    display: 'block',
  },
  productName: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '12px',
    lineHeight: '1.4',
    flexGrow: 1,
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  productPrice: {
    fontWeight: '600',
    color: 'var(--color-primary)',
  },
  lowStockWarning: {
    fontSize: '10px',
    color: 'var(--color-primary)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  noResults: {
    textAlign: 'center',
    padding: '80px 0',
  },
  noResultsTitle: {
    fontSize: '24px',
    marginBottom: '8px',
  },
  noResultsSub: {
    color: 'var(--color-muted)',
  }
};
