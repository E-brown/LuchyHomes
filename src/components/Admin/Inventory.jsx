import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../../db/mockDb';

const PRESET_COLORS = ['Black', 'White', 'Slate Grey', 'Crimson Red', 'Emerald Green', 'Teak Wood', 'Brass/Gold', 'Silver'];

const compressImage = (base64Str, maxWidth = 640, maxHeight = 640, quality = 0.65) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } catch (err) {
        console.warn('Canvas optimization error:', err);
        resolve(base64Str.length > 80000 ? base64Str.slice(0, 80000) : base64Str);
      }
    };
    img.onerror = () => {
      // Safe lightweight placeholder fallback
      resolve('/images/cast_iron_pot.jpg');
    };
  });
};

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [statusBanner, setStatusBanner] = useState(null);
  
  const [newUrl, setNewUrl] = useState('');
  const [editUrl, setEditUrl] = useState('');

  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    price: '',
    category: 'Cookware',
    stock: '',
    description: '',
    image: '',
    images: [],
    colors: [],
    customColor: '',
    moq: '1'
  });

  const [newForm, setNewForm] = useState({
    name: '',
    price: '',
    category: 'Cookware',
    stock: '',
    description: '',
    image: '',
    images: [],
    colors: [],
    customColor: '',
    moq: '1'
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProducts = () => {
    setProducts(getProducts());
  };

  useEffect(() => {
    fetchProducts();
    window.addEventListener('db-updated', fetchProducts);
    return () => window.removeEventListener('db-updated', fetchProducts);
  }, []);

  const handleExportDatabase = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `luchy_catalog_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDatabase = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          localStorage.setItem('luchy_products', JSON.stringify(imported));
          localStorage.setItem('luchy_db_version', '2.0');
          setProducts(imported);
          window.dispatchEvent(new Event('db-updated'));
          setStatusBanner(`✅ Successfully imported ${imported.length} products into your inventory!`);
          setTimeout(() => setStatusBanner(null), 6000);
        } else {
          alert('Invalid file format. Please upload a valid exported JSON catalog.');
        }
      } catch (err) {
        alert('Failed to parse file. Ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleEditClick = (product) => {
    setEditingId(product.id);
    const pColors = product.colors || [];
    const presets = pColors.filter(c => PRESET_COLORS.includes(c));
    const customs = pColors.filter(c => !PRESET_COLORS.includes(c));

    setEditForm({
      id: product.id,
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      description: product.description,
      image: product.image,
      images: product.images || (product.image ? [product.image] : []),
      colors: presets,
      customColor: customs.join(', '),
      moq: String(product.moq || 1)
    });
    setEditUrl('');
  };

  const handleImageUpload = async (e, formType) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    setIsCompressing(true);

    try {
      const readAndCompress = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const rawBase64 = reader.result;
            compressImage(rawBase64).then((compressed) => resolve(compressed));
          };
          reader.readAsDataURL(file);
        });
      };

      const compressedImages = await Promise.all(files.map(readAndCompress));

      if (formType === 'new') {
        setNewForm(prev => {
          const nextImages = [...(prev.images || []), ...compressedImages];
          return {
            ...prev,
            images: nextImages,
            image: nextImages[0] || ''
          };
        });
      } else {
        setEditForm(prev => {
          const nextImages = [...(prev.images || []), ...compressedImages];
          return {
            ...prev,
            images: nextImages,
            image: nextImages[0] || ''
          };
        });
      }
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = (formType) => {
    if (formType === 'new') {
      if (!newUrl.trim()) return;
      setNewForm(prev => {
        const nextImages = [...(prev.images || []), newUrl.trim()];
        return {
          ...prev,
          images: nextImages,
          image: nextImages[0] || ''
        };
      });
      setNewUrl('');
    } else {
      if (!editUrl.trim()) return;
      setEditForm(prev => {
        const nextImages = [...(prev.images || []), editUrl.trim()];
        return {
          ...prev,
          images: nextImages,
          image: nextImages[0] || ''
        };
      });
      setEditUrl('');
    }
  };

  const handleRemoveImage = (index, formType) => {
    if (formType === 'new') {
      setNewForm(prev => {
        const nextImages = (prev.images || []).filter((_, idx) => idx !== index);
        return {
          ...prev,
          images: nextImages,
          image: nextImages[0] || ''
        };
      });
    } else {
      setEditForm(prev => {
        const nextImages = (prev.images || []).filter((_, idx) => idx !== index);
        return {
          ...prev,
          images: nextImages,
          image: nextImages[0] || ''
        };
      });
    }
  };

  const handleToggleColor = (color, formType) => {
    if (formType === 'new') {
      setNewForm(prev => {
        const activeColors = prev.colors || [];
        const nextColors = activeColors.includes(color)
          ? activeColors.filter(c => c !== color)
          : [...activeColors, color];
        return { ...prev, colors: nextColors };
      });
    } else {
      setEditForm(prev => {
        const activeColors = prev.colors || [];
        const nextColors = activeColors.includes(color)
          ? activeColors.filter(c => c !== color)
          : [...activeColors, color];
        return { ...prev, colors: nextColors };
      });
    }
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editForm.name.trim() || !editForm.price || !editForm.stock) {
      alert('Please fill out all required fields.');
      return;
    }
    const combinedColors = [
      ...(editForm.colors || []),
      ...(editForm.customColor ? editForm.customColor.split(',').map(c => c.trim()).filter(Boolean) : [])
    ];
    const updated = {
      ...editForm,
      price: parseFloat(editForm.price) || 0,
      stock: parseInt(editForm.stock) || 0,
      moq: parseInt(editForm.moq) || 1,
      colors: combinedColors,
      image: editForm.images[0] || '/images/cast_iron_pot.jpg',
      images: editForm.images.length > 0 ? editForm.images : ['/images/cast_iron_pot.jpg']
    };
    updateProduct(updated);
    setProducts(getProducts());
    setEditingId(null);
    setStatusBanner(`✅ Product "${updated.name}" updated successfully.`);
    setTimeout(() => setStatusBanner(null), 5000);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (isCompressing) {
      alert('Please wait for product images to finish optimizing.');
      return;
    }
    if (!newForm.name.trim() || !newForm.price || !newForm.stock) {
      alert('Please fill out all required fields.');
      return;
    }
    const combinedColors = [
      ...(newForm.colors || []),
      ...(newForm.customColor ? newForm.customColor.split(',').map(c => c.trim()).filter(Boolean) : [])
    ];
    const added = {
      ...newForm,
      price: parseFloat(newForm.price) || 0,
      stock: parseInt(newForm.stock) || 0,
      moq: parseInt(newForm.moq) || 1,
      colors: combinedColors,
      image: newForm.images[0] || '/images/cast_iron_pot.jpg',
      images: newForm.images.length > 0 ? newForm.images : ['/images/cast_iron_pot.jpg']
    };
    const created = addProduct(added);
    
    // Immediately refresh inventory list in local state
    const refreshed = getProducts();
    setProducts(refreshed);
    setRecentlyAddedId(created.id);
    setFilterCategory('All');
    setSearchTerm('');
    
    setNewForm({
      name: '',
      price: '',
      category: 'Cookware',
      stock: '',
      description: '',
      image: '',
      images: [],
      colors: [],
      customColor: '',
      moq: '1'
    });
    setNewUrl('');
    setShowAddForm(false);
    
    setStatusBanner(`✨ "${created.name}" was successfully added to your inventory! It is now visible at the very top of the catalog.`);
    setTimeout(() => {
      setStatusBanner(null);
    }, 8000);
  };

  const handleDelete = (id) => {
    const prod = products.find(p => p.id === id);
    const prodName = prod ? prod.name : 'this item';
    if (window.confirm(`Are you sure you want to delete "${prodName}" from the inventory?`)) {
      deleteProduct(id);
      setProducts(getProducts());
      setStatusBanner(`🗑️ Removed "${prodName}" from inventory.`);
      setTimeout(() => setStatusBanner(null), 4000);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Inventory Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel Add Product' : 'Add New Product'}
        </button>
      </div>

      {/* Database Backup Section */}
      <div style={styles.backupSection}>
        <h4 style={styles.backupTitle}>📋 Database Backup &amp; Porting (For Live Production Launch)</h4>
        <p style={styles.backupText}>
          Use these tools to carry over your custom uploaded products from this branch test URL to the live production URL. 
          Export the file from here, then import it on the live site's admin panel.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={styles.backupBtn}
            onClick={handleExportDatabase}
          >
            📥 Export Catalog (.json)
          </button>
          
          <label className="btn btn-primary" style={styles.importLabel}>
            📤 Import Catalog (.json)
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportDatabase} 
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} style={styles.addCard}>
          <h3 style={styles.formTitle}>Add New Item to Inventory</h3>
          <div style={styles.formGrid}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Name</label>
              <input 
                type="text" 
                value={newForm.name}
                onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                placeholder="e.g. Traditional Clay Cooking Pot"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Price (CAD)</label>
              <input 
                type="number" 
                step="0.01"
                value={newForm.price}
                onChange={(e) => setNewForm(prev => ({ ...prev, price: e.target.value }))}
                className="form-input"
                placeholder="39.99"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Initial Stock Count</label>
              <input 
                type="number" 
                value={newForm.stock}
                onChange={(e) => setNewForm(prev => ({ ...prev, stock: e.target.value }))}
                className="form-input"
                placeholder="10"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select 
                value={newForm.category}
                onChange={(e) => setNewForm(prev => ({ ...prev, category: e.target.value }))}
                className="form-input"
              >
                <option value="Cookware">Cookware</option>
                <option value="Kitchenware">Kitchenware</option>
                <option value="Utensils">Utensils</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Order Qty (MOQ)</label>
              <input 
                type="number" 
                min="1"
                value={newForm.moq}
                onChange={(e) => setNewForm(prev => ({ ...prev, moq: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            {/* Colors presets selector */}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Choose Available Colors</label>
              <div style={styles.presetColorGrid}>
                {PRESET_COLORS.map(color => {
                  const isSelected = (newForm.colors || []).includes(color);
                  return (
                    <button
                      key={color}
                      type="button"
                      style={{
                        ...styles.colorSelectionChip,
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-white)',
                        color: isSelected ? 'var(--color-light)' : 'var(--color-dark)',
                        borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      }}
                      onClick={() => handleToggleColor(color, 'new')}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
              <input 
                type="text" 
                value={newForm.customColor}
                onChange={(e) => setNewForm(prev => ({ ...prev, customColor: e.target.value }))}
                className="form-input"
                style={{ marginTop: '10px' }}
                placeholder="Or type custom colors separated by commas (e.g. Copper, Matte Charcoal)..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Pictures (Upload or paste URLs)</label>
              <input 
                type="file" 
                accept="image/*" 
                multiple
                onChange={(e) => handleImageUpload(e, 'new')} 
                className="form-input"
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Or paste external image URL..." 
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="form-input"
                  style={{ flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={() => handleAddUrl('new')}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '11px', whiteSpace: 'nowrap' }}
                >
                  Add URL
                </button>
              </div>

              {newForm.images && newForm.images.length > 0 && (
                <div style={styles.thumbnailContainer}>
                  {newForm.images.map((img, idx) => (
                    <div key={idx} style={styles.thumbnailWrapper}>
                      <img src={img} alt="" style={styles.formThumbnail} />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx, 'new')} 
                        style={styles.removeImgBtn}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Product Description</label>
              <textarea 
                value={newForm.description}
                onChange={(e) => setNewForm(prev => ({ ...prev, description: e.target.value }))}
                className="form-input"
                placeholder="Write detailed product information..."
                rows="3"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {isCompressing && (
            <div style={styles.compressingNotice}>
              ⏳ Optimizing uploaded images to keep the database lightweight and fast... please wait.
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-accent" 
            style={{ ...styles.submitBtn, opacity: isCompressing ? 0.6 : 1, cursor: isCompressing ? 'not-allowed' : 'pointer' }}
            disabled={isCompressing}
          >
            {isCompressing ? 'Optimizing Pictures...' : 'Add Item to Inventory'}
          </button>
        </form>
      )}

      {/* Real-time Status Alert Banner */}
      {statusBanner && (
        <div style={styles.statusAlert}>
          {statusBanner}
        </div>
      )}

      {/* Toolbar: Search & Category Filter Tabs */}
      <div style={styles.inventoryToolbar}>
        {/* Search Bar */}
        <div style={styles.searchWrapper}>
          <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input 
            type="text" 
            placeholder="Search inventory by name, category, or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button 
              type="button" 
              onClick={() => setSearchTerm('')} 
              style={styles.clearSearchBtn}
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div style={styles.filterTabsRow}>
          {(() => {
            const isCustomProduct = (p) => Boolean(p.isCustom || String(p.id).startsWith('custom-') || String(p.id).length > 3);
            const customCount = products.filter(isCustomProduct).length;
            const cookwareCount = products.filter(p => p.category === 'Cookware').length;
            const kitchenwareCount = products.filter(p => p.category === 'Kitchenware').length;
            const utensilsCount = products.filter(p => p.category === 'Utensils').length;

            return (
              <>
                <button
                  type="button"
                  style={{
                    ...styles.filterChip,
                    backgroundColor: filterCategory === 'All' ? 'var(--color-dark)' : 'var(--color-white)',
                    color: filterCategory === 'All' ? 'var(--color-light)' : 'var(--color-dark)',
                    borderColor: filterCategory === 'All' ? 'var(--color-dark)' : 'var(--color-border)',
                  }}
                  onClick={() => setFilterCategory('All')}
                >
                  All Items ({products.length})
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.filterChip,
                    backgroundColor: filterCategory === 'Custom' ? '#8a2b16' : '#fff5f2',
                    color: filterCategory === 'Custom' ? '#ffffff' : '#8a2b16',
                    borderColor: '#8a2b16',
                    fontWeight: '600'
                  }}
                  onClick={() => setFilterCategory('Custom')}
                >
                  🌟 Custom / Uploaded ({customCount})
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.filterChip,
                    backgroundColor: filterCategory === 'Cookware' ? 'var(--color-dark)' : 'var(--color-white)',
                    color: filterCategory === 'Cookware' ? 'var(--color-light)' : 'var(--color-dark)',
                    borderColor: filterCategory === 'Cookware' ? 'var(--color-dark)' : 'var(--color-border)',
                  }}
                  onClick={() => setFilterCategory('Cookware')}
                >
                  Cookware ({cookwareCount})
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.filterChip,
                    backgroundColor: filterCategory === 'Kitchenware' ? 'var(--color-dark)' : 'var(--color-white)',
                    color: filterCategory === 'Kitchenware' ? 'var(--color-light)' : 'var(--color-dark)',
                    borderColor: filterCategory === 'Kitchenware' ? 'var(--color-dark)' : 'var(--color-border)',
                  }}
                  onClick={() => setFilterCategory('Kitchenware')}
                >
                  Kitchenware ({kitchenwareCount})
                </button>

                <button
                  type="button"
                  style={{
                    ...styles.filterChip,
                    backgroundColor: filterCategory === 'Utensils' ? 'var(--color-dark)' : 'var(--color-white)',
                    color: filterCategory === 'Utensils' ? 'var(--color-light)' : 'var(--color-dark)',
                    borderColor: filterCategory === 'Utensils' ? 'var(--color-dark)' : 'var(--color-border)',
                  }}
                  onClick={() => setFilterCategory('Utensils')}
                >
                  Utensils ({utensilsCount})
                </button>
              </>
            );
          })()}
        </div>
      </div>

      {/* Inventory List */}
      <div style={styles.tableCard}>
        {(() => {
          const isCustomProduct = (p) => Boolean(p.isCustom || String(p.id).startsWith('custom-') || String(p.id).length > 3);
          
          // Sort custom / newly uploaded items to the TOP of the inventory list
          const displayProducts = [...products]
            .sort((a, b) => {
              const aCustom = isCustomProduct(a);
              const bCustom = isCustomProduct(b);
              if (aCustom && !bCustom) return -1;
              if (!aCustom && bCustom) return 1;
              if (aCustom && bCustom) return String(b.id).localeCompare(String(a.id));
              return 0;
            })
            .filter(product => {
              const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                                    product.category.toLowerCase().includes(searchTerm.toLowerCase());
              if (!matchesSearch) return false;

              if (filterCategory === 'All') return true;
              if (filterCategory === 'Custom') return isCustomProduct(product);
              return product.category === filterCategory;
            });

          return (
            <>
              <div style={styles.tableMetaRow}>
                <span style={styles.tableCountText}>
                  Showing <strong>{displayProducts.length}</strong> of {products.length} products
                  {filterCategory === 'Custom' && ' (Filtered: Uploaded Items Only)'}
                </span>
                {filterCategory !== 'All' && (
                  <button 
                    type="button" 
                    onClick={() => { setFilterCategory('All'); setSearchTerm(''); }}
                    style={styles.resetFilterBtn}
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              {displayProducts.length === 0 ? (
                <div style={styles.emptyState}>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-muted)' }}>
                    {filterCategory === 'Custom' 
                      ? 'No custom uploaded products yet. Click "Add New Product" above to upload your first item!' 
                      : 'No products found matching your current filter.'}
                  </p>
                  {filterCategory !== 'All' && (
                    <button 
                      type="button" 
                      onClick={() => setFilterCategory('All')} 
                      className="btn btn-secondary" 
                      style={{ marginTop: '12px' }}
                    >
                      View All Products
                    </button>
                  )}
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableHeaderRow}>
                      <th style={styles.tableTh}>Image</th>
                      <th style={styles.tableTh}>Product Name</th>
                      <th style={styles.tableTh}>Category</th>
                      <th style={{ ...styles.tableTh, textAlign: 'right' }}>Price</th>
                      <th style={{ ...styles.tableTh, textAlign: 'center' }}>Stock</th>
                      <th style={{ ...styles.tableTh, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayProducts.map(product => {
                      const isEditing = editingId === product.id;
                      const isCustom = isCustomProduct(product);
                      const isJustAdded = product.id === recentlyAddedId;
                      
                      if (isEditing) {
                        return (
                          <tr key={product.id} style={styles.tableRowEditing}>
                            <td style={styles.tableTd}>
                              <img src={editForm.images[0] || product.image} alt="" style={styles.tableImg} />
                            </td>
                            <td style={styles.tableTd} colSpan="5">
                              <form onSubmit={handleEditSave} style={styles.inlineEditForm}>
                                <div style={styles.inlineInputsGrid}>
                                  <input 
                                    type="text" 
                                    value={editForm.name} 
                                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                    className="form-input"
                                    style={styles.inlineInput}
                                    placeholder="Name"
                                    required
                                  />
                                  <select 
                                    value={editForm.category}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                    className="form-input"
                                    style={styles.inlineInput}
                                  >
                                    <option value="Cookware">Cookware</option>
                                    <option value="Kitchenware">Kitchenware</option>
                                    <option value="Utensils">Utensils</option>
                                  </select>
                                  <input 
                                    type="number" 
                                    step="0.01"
                                    value={editForm.price} 
                                    onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                                    className="form-input"
                                    style={styles.inlineInput}
                                    placeholder="Price"
                                    required
                                  />
                                  <input 
                                    type="number" 
                                    value={editForm.stock} 
                                    onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
                                    className="form-input"
                                    style={styles.inlineInput}
                                    placeholder="Stock"
                                    required
                                  />
                                  <div style={styles.inlineActions}>
                                    <button type="submit" className="btn btn-accent" style={styles.inlineSaveBtn}>
                                      Save
                                    </button>
                                    <button 
                                      type="button" 
                                      className="btn btn-secondary" 
                                      style={styles.inlineCancelBtn}
                                      onClick={() => setEditingId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>

                                {/* Extended Details Edit Grid */}
                                <div style={{ marginTop: '12px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                  <div style={{ flex: '1', minWidth: '120px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-muted)' }}>Min Order Qty (MOQ)</label>
                                    <input 
                                      type="number" 
                                      min="1"
                                      value={editForm.moq} 
                                      onChange={(e) => setEditForm(prev => ({ ...prev, moq: e.target.value }))}
                                      className="form-input"
                                      style={{ fontSize: '12px', padding: '6px 10px', width: '100%', marginTop: '4px' }}
                                      required
                                    />
                                  </div>
                                  
                                  {/* Presets color selector inside edit form */}
                                  <div style={{ flex: '3', minWidth: '200px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-muted)', display: 'block', marginBottom: '6px' }}>
                                      Choose Available Colors
                                    </label>
                                    <div style={styles.presetColorGrid}>
                                      {PRESET_COLORS.map(color => {
                                        const isSelected = (editForm.colors || []).includes(color);
                                        return (
                                          <button
                                            key={color}
                                            type="button"
                                            style={{
                                              ...styles.colorSelectionChip,
                                              padding: '4px 8px',
                                              fontSize: '11px',
                                              backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-white)',
                                              color: isSelected ? 'var(--color-light)' : 'var(--color-dark)',
                                              borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                                            }}
                                            onClick={() => handleToggleColor(color, 'edit')}
                                          >
                                            {color}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <input 
                                      type="text" 
                                      value={editForm.customColor} 
                                      onChange={(e) => setEditForm(prev => ({ ...prev, customColor: e.target.value }))}
                                      className="form-input"
                                      style={{ fontSize: '12px', padding: '6px 10px', width: '100%', marginTop: '8px' }}
                                      placeholder="Or type custom colors separated by commas..."
                                    />
                                  </div>
                                </div>

                                <div style={{ marginTop: '12px' }}>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-muted)' }}>Description</label>
                                  <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="form-input"
                                    placeholder="Description"
                                    rows="2"
                                    style={{ fontSize: '12px', marginTop: '4px' }}
                                  />
                                </div>

                                <div style={{ marginTop: '12px' }}>
                                  <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-muted)', display: 'block', marginBottom: '4px' }}>
                                    Product Images (Upload or paste URLs)
                                  </label>
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    multiple
                                    onChange={(e) => handleImageUpload(e, 'edit')} 
                                    className="form-input"
                                    style={{ fontSize: '11px', padding: '4px 8px' }}
                                  />
                                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                    <input 
                                      type="text" 
                                      placeholder="Or paste external image URL..." 
                                      value={editUrl}
                                      onChange={(e) => setEditUrl(e.target.value)}
                                      className="form-input"
                                      style={{ flex: 1, fontSize: '11px', padding: '6px 10px' }}
                                    />
                                    <button 
                                      type="button" 
                                      onClick={() => handleAddUrl('edit')}
                                      className="btn btn-secondary"
                                      style={{ padding: '6px 10px', fontSize: '11px', whiteSpace: 'nowrap' }}
                                    >
                                      Add URL
                                    </button>
                                  </div>
                                  {editForm.images && editForm.images.length > 0 && (
                                    <div style={styles.thumbnailContainer}>
                                      {editForm.images.map((img, idx) => (
                                        <div key={idx} style={styles.thumbnailWrapper}>
                                          <img src={img} alt="" style={styles.formThumbnail} />
                                          <button 
                                            type="button" 
                                            onClick={() => handleRemoveImage(idx, 'edit')} 
                                            style={styles.removeImgBtn}
                                          >
                                            &times;
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </form>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr 
                          key={product.id} 
                          style={{
                            ...styles.tableRow,
                            backgroundColor: isJustAdded ? '#f0fdf4' : (isCustom ? '#fffdfa' : 'transparent'),
                            borderLeft: isJustAdded ? '4px solid #16a34a' : (isCustom ? '4px solid #8a2b16' : '4px solid transparent'),
                          }}
                        >
                          <td style={styles.tableTd}>
                            <img 
                              src={product.image || '/images/cast_iron_pot.jpg'} 
                              alt={product.name} 
                              style={styles.tableImg} 
                              onError={(e) => { e.target.src = '/images/cast_iron_pot.jpg'; }}
                            />
                          </td>
                          <td style={styles.tableTd}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <strong style={styles.productName}>{product.name}</strong>
                              {isCustom && (
                                <span style={styles.customBadge}>
                                  🌟 Custom Upload
                                </span>
                              )}
                              {isJustAdded && (
                                <span style={styles.newBadge}>
                                  Just Added!
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--color-muted)', marginBottom: '4px' }}>
                              {product.moq > 1 && <span style={{ marginRight: '8px', color: 'var(--color-primary)', fontWeight: '600' }}>MOQ: {product.moq}</span>}
                              {product.colors && product.colors.length > 0 && <span>Colors: {product.colors.join(', ')}</span>}
                            </div>
                            <p style={styles.productDesc}>{product.description ? product.description.substring(0, 100) : ''}...</p>
                          </td>
                          <td style={styles.tableTd}>{product.category}</td>
                          <td style={{ ...styles.tableTd, textAlign: 'right', fontWeight: '600' }}>
                            ${product.price ? product.price.toFixed(2) : '0.00'} CAD
                          </td>
                          <td style={{ ...styles.tableTd, textAlign: 'center' }}>
                            <span 
                              style={{
                                ...styles.stockCount,
                                color: product.stock === 0 ? 'var(--color-primary)' : 'var(--color-dark)',
                                fontWeight: product.stock <= 5 ? '600' : '400'
                              }}
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td style={{ ...styles.tableTd, textAlign: 'right' }}>
                            <div style={styles.actionsCell}>
                              <button 
                                className="btn btn-secondary" 
                                style={styles.editBtn}
                                onClick={() => handleEditClick(product)}
                              >
                                Edit
                              </button>
                              <button 
                                className="btn btn-link" 
                                style={styles.deleteBtn}
                                onClick={() => handleDelete(product.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
  },
  addCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '32px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '40px',
  },
  formTitle: {
    fontSize: '18px',
    marginBottom: '24px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--color-primary)',
    fontWeight: '600',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  submitBtn: {
    marginTop: '24px',
    padding: '12px 24px',
    fontSize: '12px',
  },
  tableCard: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    padding: '24px',
    overflowX: 'auto',
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
    padding: '12px 16px',
    textAlign: 'left',
    color: 'var(--color-muted)',
    fontWeight: '600',
  },
  tableRow: {
    borderBottom: '1px solid var(--color-border)',
    transition: 'var(--transition)',
  },
  tableRowEditing: {
    backgroundColor: 'var(--color-light)',
    borderBottom: '1px solid var(--color-border)',
  },
  tableTd: {
    padding: '16px',
    verticalAlign: 'middle',
  },
  tableImg: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-light)',
  },
  productName: {
    fontSize: '14px',
    display: 'block',
    marginBottom: '4px',
  },
  productDesc: {
    fontSize: '11px',
    color: 'var(--color-muted)',
    lineHeight: '1.4',
  },
  stockCount: {
    fontSize: '14px',
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '12px',
  },
  editBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    textTransform: 'none',
  },
  deleteBtn: {
    borderBottom: 'none',
    color: 'var(--color-primary)',
    fontSize: '11px',
    padding: 0,
  },
  inlineEditForm: {
    width: '100%',
    padding: '8px 0',
  },
  inlineInputsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 1fr 1fr 2fr',
    gap: '12px',
    alignItems: 'center',
  },
  inlineInput: {
    padding: '8px 12px',
    fontSize: '12px',
  },
  inlineActions: {
    display: 'flex',
    gap: '8px',
  },
  inlineSaveBtn: {
    padding: '8px 14px',
    fontSize: '11px',
    textTransform: 'none',
  },
  inlineCancelBtn: {
    padding: '8px 14px',
    fontSize: '11px',
    textTransform: 'none',
  },
  thumbnailContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '12px',
  },
  thumbnailWrapper: {
    position: 'relative',
    width: '64px',
    height: '64px',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  formThumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeImgBtn: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    backgroundColor: 'rgba(156, 32, 32, 0.8)',
    color: '#fff',
    border: 'none',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '11px',
    lineHeight: '1',
    padding: 0,
  },
  presetColorGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '6px',
  },
  colorSelectionChip: {
    border: '1px solid var(--color-border)',
    borderRadius: '12px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'var(--transition)',
    fontWeight: '500'
  },
  backupSection: {
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    padding: '20px 24px',
    borderRadius: 'var(--border-radius)',
    marginBottom: '32px',
    textAlign: 'left'
  },
  backupTitle: {
    margin: '0 0 6px 0',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--color-dark)'
  },
  backupText: {
    margin: '0 0 16px 0',
    fontSize: '12px',
    color: 'var(--color-muted)',
    lineHeight: '1.5'
  },
  backupBtn: {
    padding: '8px 16px',
    fontSize: '11px',
    textTransform: 'none',
    backgroundColor: 'var(--color-white)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-dark)',
    cursor: 'pointer'
  },
  importLabel: {
    padding: '8px 16px',
    fontSize: '11px',
    textTransform: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    margin: 0
  },
  compressingNotice: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    border: '1px solid #bfdbfe',
    borderRadius: 'var(--border-radius)',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '12px',
    display: 'inline-block'
  },
  statusAlert: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
    borderRadius: 'var(--border-radius)',
    padding: '14px 20px',
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  inventoryToolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '20px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    maxWidth: '500px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--color-muted)'
  },
  searchInput: {
    width: '100%',
    padding: '10px 36px 10px 36px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '13px',
    backgroundColor: 'var(--color-white)',
    outline: 'none',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)'
  },
  clearSearchBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '18px',
    color: 'var(--color-muted)',
    cursor: 'pointer',
    padding: '0 4px',
    lineHeight: '1'
  },
  filterTabsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  filterChip: {
    padding: '7px 14px',
    fontSize: '12px',
    borderRadius: '20px',
    border: '1px solid var(--color-border)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap'
  },
  tableMetaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--color-border)'
  },
  tableCountText: {
    fontSize: '12px',
    color: 'var(--color-muted)'
  },
  resetFilterBtn: {
    background: 'none',
    border: 'none',
    fontSize: '11px',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    textDecoration: 'underline'
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  customBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid #fde68a',
    letterSpacing: '0.02em',
    textTransform: 'uppercase'
  },
  newBadge: {
    backgroundColor: '#dcfce7',
    color: '#15803d',
    fontSize: '10px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid #bbf7d0',
    animation: 'pulse 2s infinite'
  }
};
