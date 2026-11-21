// CartLab — deliberately buggy cart / checkout arithmetic.
// PLANTED BUGS: qty string concat; double discount; free shipping always;
// tax on pre-discount subtotal; discount after tax; case-sensitive coupon;
// euro symbol at checkout; cart never cleared.
const ITEMS = [
  { id: 1, name: 'Notebook', art: '📓', price: 4.50 },
  { id: 2, name: 'Pen set', art: '🖊️', price: 3.25 },
  { id: 3, name: 'Sticky notes', art: '🗒️', price: 2.75 },
  { id: 4, name: 'Desk organizer', art: '🗂️', price: 12.00 },
];
let cart = [];
let couponApplied = false;
const money = (n) => '$' + Number(n).toFixed(2);

function renderProducts() {
  document.getElementById('products').innerHTML = ITEMS.map((p, i) => `<article class="item" style="animation-delay:${i * 50}ms">
    <div class="art">${p.art}</div><h3>${p.name}</h3><div class="price">${money(p.price)}</div>
    <button class="add" data-add="${p.id}"><i data-lucide="plus"></i> Add to cart</button></article>`).join('');
  window.lucide?.createIcons();
  document.querySelectorAll('[data-add]').forEach((b) => b.onclick = () => add(Number(b.dataset.add)));
}

function add(id) {
  const line = cart.find((l) => l.id === id);
  if (line) line.qty = (line.qty + 1).toString(); // BUG 1: string concatenation
  else cart.push({ ...ITEMS.find((x) => x.id === id), qty: 1 });
  update();
}
function subtotal() { return cart.reduce((s, l) => s + l.price * l.qty, 0); }
function shipping() { return 0; }                                  // BUG 3
function discount(sub) { return couponApplied ? sub * 0.1 * 2 : 0; } // BUG 2
function tax(sub) { return sub * 0.08; }                            // BUG 4

function update() {
  const sub = subtotal();
  const disc = discount(sub);
  const ship = shipping();
  const total = sub + ship + tax(sub) - disc; // BUG 5: discount after tax
  const count = cart.reduce((s, l) => s + Number(l.qty), 0);
  document.getElementById('count').textContent = String(count);
  document.getElementById('subtotal').textContent = money(sub);
  document.getElementById('shipping').textContent = money(ship);
  document.getElementById('discount').textContent = '-' + money(disc);
  document.getElementById('tax').textContent = money(tax(sub));
  document.getElementById('total').textContent = money(total);
}

document.addEventListener('DOMContentLoaded', () => {
  window.lucide?.createIcons();
  renderProducts(); update();
  document.getElementById('apply').onclick = () => {
    const code = document.getElementById('coupon').value;
    if (code === 'SAVE10') { // BUG 6: case-sensitive
      couponApplied = true;
      document.getElementById('couponMsg').textContent = 'Coupon applied — 10% off.';
    } else {
      document.getElementById('couponMsg').textContent = 'Invalid code.';
    }
    update();
  };
  document.getElementById('checkout').onclick = () => {
    alert('Total charged: €' + document.getElementById('total').textContent); // BUG 7
    // BUG 8: cart is never cleared.
  };
  const build = window.BUGSHIELD_BUILD_INFO || {};
  document.getElementById('buildTag').textContent = build.commit || 'local';
  // Always render the widget. Fall back to the deployed dashboard when config.js
  // still contains the local/placeholder value (otherwise HTTPS blocks the script).
  const configuredEndpoint = window.BUGSHIELD_ENDPOINT || '';
  const endpoint = (!configuredEndpoint || /localhost|127\.0\.0\.1|REPLACE/i.test(configuredEndpoint))
    ? (['localhost', '127.0.0.1'].includes(location.hostname)
        ? 'http://localhost:10000/sdk/bugshield.js'
        : 'https://multiagentnew.onrender.com/sdk/bugshield.js')
    : configuredEndpoint;
  const widgetKey = /REPLACE/i.test(window.BUGSHIELD_KEY || '') ? '' : (window.BUGSHIELD_KEY || '');
  const s = document.createElement('script');
  s.src = endpoint;
  if (widgetKey) s.setAttribute('data-key', widgetKey);
  s.async = true;
  document.body.appendChild(s);
});
