// mockData.js

const invoices = {
  '12345': {
    invoiceNumber: '12345',
    date: '2025-10-31',
    customerName: 'Ahmad Al-Khouri',
    customerInfo: {
      phone: '+966 50 123 4567',
      email: 'ahmad@example.com',
      address: 'Riyadh, Saudi Arabia',
    },
    items: [
      { name: { ar: 'منتج أ - كاميرا', en: 'Product A - Camera' }, qty: 1, price: 1500, total: 1500 },
      { name: { ar: 'منتج ب - حامل ثلاثي', en: 'Product B - Tripod' }, qty: 2, price: 250, total: 500 },
    ],
    subtotal: 2000,
    taxRate: 0.15,
    tax: 300,
    shipping: 50,
    total: 2350,
  },
  // يمكنك إضافة فواتير أخرى هنا
};

export const fetchInvoiceData = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (invoices[id]) {
        resolve(invoices[id]);
      } else {
        reject(new Error('Invoice not found'));
      }
    }, 500); // محاكاة لـ API call
  });
};