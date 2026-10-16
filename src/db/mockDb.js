const INITIAL_PRODUCTS = [
  // --- Cookware (8 items) ---
  {
    id: '1',
    name: 'Cast-iron cooking pot',
    price: 48.00,
    category: 'Cookware',
    stock: 15,
    description: 'Durable, heavy-duty traditional black cast-iron pot designed for slow cooking, stews, and roasting. Sourced internationally and stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c2',
    name: 'Clay cooking pot',
    price: 42.00,
    category: 'Cookware',
    stock: 10,
    description: 'Traditional earthenware clay pot, perfect for cooking slow, aromatic dishes. Retains moisture and flavor natively. Sourced internationally and stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c3',
    name: 'Stainless steel stockpot',
    price: 55.00,
    category: 'Cookware',
    stock: 12,
    description: 'Large-capacity premium stainless steel stockpot with triple-ply base for even heating. Ideal for family soups and grains. Stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c4',
    name: 'Pre-seasoned cast-iron griddle',
    price: 38.00,
    category: 'Cookware',
    stock: 8,
    description: 'Heavy-duty cast-iron griddle plate for grilling, searing, and stovetop baking. Dual-handle design. Stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c5',
    name: 'Non-stick frying pan',
    price: 32.00,
    category: 'Cookware',
    stock: 20,
    description: 'Professional-grade aluminum frying pan with scratch-resistant non-stick coating. Ergonomic cool-touch handle. Stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c6',
    name: 'Premium copper sauté pan',
    price: 89.00,
    category: 'Cookware',
    stock: 6,
    description: 'Premium copper sauté pan with stainless steel interior. Outstanding thermal conductivity for precise temperature control. Stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c7',
    name: 'Enameled Dutch oven',
    price: 68.00,
    category: 'Cookware',
    stock: 14,
    description: 'Stunning crimson enameled cast-iron Dutch oven. Transitions beautifully from oven to tabletop. Stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },
  {
    id: 'c8',
    name: 'Ceramic casserole dish',
    price: 45.00,
    category: 'Cookware',
    stock: 11,
    description: 'Elegant ceramic baking and casserole dish with lid. Scratch-resistant glaze and thermal-shock resistant. Stocked locally in Canada.',
    image: '/images/cast_iron_pot.jpg'
  },

  // --- Kitchenware (8 items) ---
  {
    id: '2',
    name: 'Granite mortar & pestle',
    price: 35.00,
    category: 'Kitchenware',
    stock: 22,
    description: 'Heavy granite mortar and pestle for crushing spices, herbs, and garlic. Traditional textured interior and smooth exterior. Sourced internationally and stocked locally in Canada.',
    image: '/images/mortar_pestle.jpg'
  },
  {
    id: '4',
    name: 'Enamel bowls (set of 4)',
    price: 29.00,
    category: 'Kitchenware',
    stock: 18,
    description: 'Stack of 4 vintage-inspired enamel serving bowls with a durable steel core and classic blue rim. Highly durable and versatile. Sourced internationally and stocked locally in Canada.',
    image: '/images/enamel_bowls.jpg'
  },
  {
    id: 'k3',
    name: 'Masala spice box',
    price: 38.00,
    category: 'Kitchenware',
    stock: 16,
    description: 'Traditional stainless steel spice container (Masala Dabba) with 7 individual compartments and airtight outer lid. Stocked locally in Canada.',
    image: '/images/mortar_pestle.jpg'
  },
  {
    id: 'k4',
    name: 'Ceramic serving platter',
    price: 26.00,
    category: 'Kitchenware',
    stock: 25,
    description: 'Handcrafted rustic ceramic serving plate, finished with a beautiful crackle glaze. Perfect for appetizers and pastries. Stocked locally in Canada.',
    image: '/images/enamel_bowls.jpg'
  },
  {
    id: 'k5',
    name: 'Glass spice jar set (set of 6)',
    price: 18.00,
    category: 'Kitchenware',
    stock: 30,
    description: 'Six elegant glass jars with bamboo lids and chalkboard labels. Organize spices beautifully on kitchen shelves. Stocked locally in Canada.',
    image: '/images/mortar_pestle.jpg'
  },
  {
    id: 'k6',
    name: 'Marble rolling pin',
    price: 24.00,
    category: 'Kitchenware',
    stock: 15,
    description: 'Cool, heavy polished marble rolling pin with comfortable wooden handles. Ideal for rolling pastry dough effortlessly. Stocked locally in Canada.',
    image: '/images/mortar_pestle.jpg'
  },
  {
    id: 'k7',
    name: 'Bread storage tin',
    price: 34.00,
    category: 'Kitchenware',
    stock: 9,
    description: 'Vintage-inspired steel bread bin with wooden lid that doubles as a cutting board. Keeps bread fresh. Stocked locally in Canada.',
    image: '/images/enamel_bowls.jpg'
  },
  {
    id: 'k8',
    name: 'Teak wood serving bowl',
    price: 42.00,
    category: 'Kitchenware',
    stock: 7,
    description: 'Beautiful, solid teak wood bowl carved from a single piece of root wood. Perfect for salads and fresh fruit display. Stocked locally in Canada.',
    image: '/images/enamel_bowls.jpg'
  },

  // --- Utensils (8 items) ---
  {
    id: '3',
    name: 'Handcrafted wooden spoon set',
    price: 22.00,
    category: 'Utensils',
    stock: 45,
    description: 'Set of 3 organic, hand-carved wooden spoons. Heat-resistant and non-scratch, perfect for traditional slow-cooked sauces and grains. Sourced internationally and stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u2',
    name: 'Stainless steel tongs',
    price: 14.00,
    category: 'Utensils',
    stock: 35,
    description: 'Heavy-duty locking kitchen tongs with silicone tips. Heat-resistant up to 480°F, ideal for cooking and serving. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u3',
    name: 'Silicone spatula set (set of 4)',
    price: 16.00,
    category: 'Utensils',
    stock: 40,
    description: 'Set of 4 flexible, one-piece hygienic food-grade silicone spatulas. Heat-resistant and perfect for scraping bowls. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u4',
    name: 'Traditional brass soup ladle',
    price: 28.00,
    category: 'Utensils',
    stock: 12,
    description: 'Beautiful, heavy hand-forged brass soup ladle. Adds a classy heritage touch to serving slow-cooked stews and soups. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u5',
    name: 'Kitchen knife set (set of 3)',
    price: 65.00,
    category: 'Utensils',
    stock: 18,
    description: 'Three essential chef knives: Chef knife, utility knife, and paring knife, made of high-carbon stainless steel. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u6',
    name: 'Potato masher',
    price: 12.00,
    category: 'Utensils',
    stock: 24,
    description: 'Classic stainless steel mashing tool with ergonomic handle. Ideal for root vegetables, beans, and baby food. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u7',
    name: 'Salad tongs set',
    price: 19.00,
    category: 'Utensils',
    stock: 28,
    description: 'Elegant wooden salad serving hands, handcrafted from sustainable bamboo. Fits comfortably in any serving bowl. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  },
  {
    id: 'u8',
    name: 'Stainless steel whisk',
    price: 10.00,
    category: 'Utensils',
    stock: 50,
    description: 'Professional 12-inch balloon whisk with a comfortable wire handle. Perfect for beating eggs and whipping sauces. Stocked locally in Canada.',
    image: '/images/wooden_spoons.jpg'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'LH-1042',
    customerName: 'Amara O.',
    email: 'amara@email.com',
    phone: '+1 416-555-0198',
    address: '124 Maple St, Toronto, ON',
    contactMethod: 'DM',
    contactDetail: 'Instagram: @amara_cooks',
    items: [
      { id: '1', name: 'Cast-iron cooking pot', price: 48.00, qty: 1 },
      { id: '3', name: 'Handcrafted wooden spoon set', price: 22.00, qty: 1 }
    ],
    itemTotal: 70.00,
    deliveryCost: 18.00,
    status: 'Delivery Cost Set',
    date: '2026-08-01',
    utmSource: 'instagram',
    paymentMethod: '',
    deliveryPaid: false
  },
  {
    id: 'LH-1031',
    customerName: 'K. Mensah',
    email: 'mensah@email.com',
    phone: '+1 587-555-0144',
    address: '782 17 Ave SW, Calgary, AB',
    contactMethod: 'Email',
    contactDetail: 'mensah@email.com',
    items: [
      { id: '2', name: 'Granite mortar & pestle', price: 35.00, qty: 1 }
    ],
    itemTotal: 35.00,
    deliveryCost: 19.00,
    status: 'Delivered',
    date: '2026-07-28',
    utmSource: 'tiktok',
    paymentMethod: 'Cash on delivery',
    deliveryPaid: true
  },
  {
    id: 'LH-1018',
    customerName: 'T. Alabi',
    email: 'alabi@email.com',
    phone: '+1 613-555-0112',
    address: '45 Rideau St, Ottawa, ON',
    contactMethod: 'Call',
    contactDetail: '+1 613-555-0112',
    items: [
      { id: '4', name: 'Enamel bowls (set of 4)', price: 29.00, qty: 3 }
    ],
    itemTotal: 87.00,
    deliveryCost: 15.00,
    status: 'Delivered',
    date: '2026-07-20',
    utmSource: 'tiktok',
    paymentMethod: 'Card at door',
    deliveryPaid: true
  }
];

// In-memory cache for ultra-reliable session access
let memoryProducts = null;

// IndexedDB Helper for high-capacity browser persistence (bypassing 5MB LocalStorage limit)
const IDB_NAME = 'luchy_commerce_db';
const IDB_VERSION = 1;
const IDB_STORE = 'products';

const openIDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
};

const saveProductsToIDB = async (products) => {
  try {
    const db = await openIDB();
    if (!db) return;
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    products.forEach(p => store.put(p));
  } catch (err) {
    console.warn('IndexedDB saveProducts error:', err);
  }
};

const loadProductsFromIDB = async () => {
  try {
    const db = await openIDB();
    if (!db) return [];
    return new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('IndexedDB loadProducts error:', err);
    return [];
  }
};

// Background sync from IndexedDB on startup
if (typeof window !== 'undefined') {
  loadProductsFromIDB().then(idbProducts => {
    if (idbProducts && idbProducts.length > 0) {
      const current = memoryProducts || getProducts();
      let changed = false;
      const merged = [...current];

      idbProducts.forEach(idbItem => {
        const idx = merged.findIndex(p => p.id === idbItem.id);
        if (idx === -1) {
          merged.unshift(idbItem);
          changed = true;
        } else {
          // If IDB version has more images or more recent data, merge
          const currentImgCount = merged[idx].images?.length || 0;
          const idbImgCount = idbItem.images?.length || 0;
          if (idbImgCount > currentImgCount) {
            merged[idx] = { ...merged[idx], ...idbItem };
            changed = true;
          }
        }
      });

      if (changed) {
        memoryProducts = merged;
        saveProducts(merged);
        window.dispatchEvent(new Event('db-updated'));
      }
    }
  });
}

// Helper to load/save data
const loadFromStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error('LocalStorage load error', e);
    return fallback;
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`LocalStorage quota reached for ${key}, applying compression fallback...`, e);
    if (key === 'luchy_products' && Array.isArray(data)) {
      try {
        // Safe fallback: keep primary image in localStorage to fit quota
        const compact = data.map(p => {
          const imgs = (p.images && p.images.length > 0) ? [p.images[0]] : (p.image ? [p.image] : []);
          return {
            ...p,
            image: imgs[0] || '',
            images: imgs
          };
        });
        localStorage.setItem(key, JSON.stringify(compact));
      } catch (innerE) {
        console.warn('LocalStorage secondary fallback failed:', innerE);
      }
    }
  }

  // Also persist to IndexedDB asynchronously (handles large images seamlessly)
  if (key === 'luchy_products' && Array.isArray(data)) {
    saveProductsToIDB(data);
  }

  // Always notify listeners so UI updates immediately
  window.dispatchEvent(new Event('db-updated'));
};

export const getProducts = () => {
  if (memoryProducts && memoryProducts.length > 0) {
    return memoryProducts;
  }

  const stored = loadFromStorage('luchy_products', null);
  let loaded;

  if (stored && Array.isArray(stored) && stored.length > 0) {
    loaded = stored;
  } else {
    loaded = INITIAL_PRODUCTS;
    saveProducts(loaded);
  }

  let migrated = false;
  const migratedProducts = loaded.map(p => {
    let updated = { ...p };
    const isCustom = Boolean(updated.isCustom || String(updated.id).startsWith('custom-') || String(updated.id).length > 3);
    if (isCustom && !updated.isCustom) {
      updated.isCustom = true;
      migrated = true;
    }
    if (!updated.images || !Array.isArray(updated.images)) {
      updated.images = updated.image ? [updated.image] : [];
      migrated = true;
    }
    if (updated.moq === undefined || updated.moq === null) {
      updated.moq = 1;
      migrated = true;
    }
    if (!updated.colors || !Array.isArray(updated.colors)) {
      updated.colors = [];
      migrated = true;
    }
    return updated;
  });

  memoryProducts = migrated ? migratedProducts : loaded;

  if (migrated) {
    saveProducts(memoryProducts);
  }

  return memoryProducts;
};

export const saveProducts = (products) => {
  memoryProducts = products;
  saveToStorage('luchy_products', products);
};

export const getOrders = () => {
  return loadFromStorage('luchy_orders', INITIAL_ORDERS);
};

export const saveOrders = (orders) => {
  saveToStorage('luchy_orders', orders);
};

export const getAnalytics = () => {
  const orders = getOrders();
  
  // Total Revenue: sum of item totals + delivery fee (only if delivery fee paid)
  let totalRevenue = 0;
  let itemsRevenue = 0;
  let deliveryRevenue = 0;
  
  // UTM Stats
  const utmStats = {
    tiktok: { views: 1200, clicks: 350, conversions: 0, revenue: 0 },
    instagram: { views: 950, clicks: 280, conversions: 0, revenue: 0 },
    direct: { views: 400, clicks: 120, conversions: 0, revenue: 0 }
  };
  
  orders.forEach(order => {
    itemsRevenue += order.itemTotal;
    if (order.deliveryPaid && order.deliveryCost) {
      deliveryRevenue += order.deliveryCost;
    }
    totalRevenue += order.itemTotal; // Items are always paid at checkout
    
    const source = order.utmSource || 'direct';
    if (utmStats[source]) {
      utmStats[source].conversions += 1;
      utmStats[source].revenue += order.itemTotal;
    }
  });

  const totalConversions = orders.length;
  
  return {
    totalRevenue,
    itemsRevenue,
    deliveryRevenue,
    totalOrders: orders.length,
    utmStats,
    averageOrderValue: orders.length > 0 ? (itemsRevenue / orders.length) : 0,
    deliveryRate: orders.length > 0 
      ? (orders.filter(o => o.deliveryCost > 0).length / orders.length) * 100 
      : 0
  };
};

export const addProduct = (product) => {
  const products = getProducts();
  const timestamp = Date.now();
  const newProduct = {
    ...product,
    id: product.id || `custom-${timestamp}`,
    isCustom: true,
    createdAt: timestamp,
    price: parseFloat(product.price) || 0,
    stock: parseInt(product.stock) || 0,
    moq: Math.max(1, parseInt(product.moq) || 1),
    colors: Array.isArray(product.colors) ? product.colors : [],
    images: Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.image || '/images/cast_iron_pot.jpg'],
    image: product.image || (product.images && product.images[0]) || '/images/cast_iron_pot.jpg'
  };

  // Place new product at the VERY TOP of the catalog list
  const updated = [newProduct, ...products.filter(p => p.id !== newProduct.id)];
  memoryProducts = updated;
  saveProducts(updated);
  return newProduct;
};

export const updateProduct = (updatedProduct) => {
  let products = getProducts();
  const updated = products.map(p => p.id === updatedProduct.id ? {
    ...p,
    ...updatedProduct,
    isCustom: p.isCustom || true,
    price: parseFloat(updatedProduct.price) || 0,
    stock: parseInt(updatedProduct.stock) || 0,
    moq: Math.max(1, parseInt(updatedProduct.moq) || 1),
    image: (updatedProduct.images && updatedProduct.images[0]) || updatedProduct.image || p.image,
    images: (updatedProduct.images && updatedProduct.images.length > 0) ? updatedProduct.images : p.images
  } : p);
  memoryProducts = updated;
  saveProducts(updated);
  return updated;
};

export const deleteProduct = (id) => {
  let products = getProducts();
  const updated = products.filter(p => p.id !== id);
  memoryProducts = updated;
  saveProducts(updated);
  
  // Also clean from IndexedDB
  openIDB().then(db => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(id);
    } catch {}
  });

  return updated;
};

export const createOrder = (orderData) => {
  const orders = getOrders();
  const newOrder = {
    ...orderData,
    id: `LH-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'Paid',
    date: new Date().toISOString().split('T')[0],
    deliveryPaid: false,
    deliveryCost: 0
  };
  orders.push(newOrder);
  saveOrders(orders);
  
  // Deduct inventory
  let products = getProducts();
  newOrder.items.forEach(orderItem => {
    products = products.map(p => {
      if (p.id === orderItem.id) {
        const newStock = Math.max(0, p.stock - orderItem.qty);
        return { ...p, stock: newStock };
      }
      return p;
    });
  });
  saveProducts(products);
  
  return newOrder;
};

export const updateOrderStatus = (orderId, status) => {
  let orders = getOrders();
  orders = orders.map(o => o.id === orderId ? { ...o, status } : o);
  saveOrders(orders);
};

export const setOrderDeliveryCost = (orderId, cost, notify = true) => {
  let orders = getOrders();
  orders = orders.map(o => o.id === orderId ? { 
    ...o, 
    deliveryCost: parseFloat(cost) || 0,
    status: 'Delivery Cost Set'
  } : o);
  saveOrders(orders);
  
  if (notify) {
    // In a real app this would trigger an email or SMS webhook
    console.log(`Notification sent to customer: Order ${orderId} delivery cost is CAD $${cost}`);
  }
};

export const payOrderDelivery = (orderId, paymentMethod) => {
  let orders = getOrders();
  orders = orders.map(o => o.id === orderId ? { 
    ...o, 
    paymentMethod,
    deliveryPaid: true,
    status: 'Packed'
  } : o);
  saveOrders(orders);
};
