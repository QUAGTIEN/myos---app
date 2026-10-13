const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() { nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Mở menu'); }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; nav.classList.toggle('open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 800) closeMenu(); });

const cards = [...document.querySelectorAll('.product-card')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
  document.querySelector('.product-count').textContent = `${String(cards.filter(c => !c.hidden).length).padStart(2, '0')} nhóm sản phẩm`;
}));

const products = {
  labels: { name: 'Tem nhãn sản phẩm', image: 'assets/labels.png', description: 'Nhãn thể hiện thông tin sản phẩm và nhận diện thương hiệu. Hình minh hoạ gợi ý cách trình bày tem dạng cuộn.', specs: ['Trao đổi bề mặt và môi trường sử dụng.', 'Cung cấp kích thước, hình dạng và số lượng.', 'Thống nhất nội dung, màu sắc và cách đóng gói.'] },
  boxes: { name: 'Hộp giấy & bao bì', image: 'assets/boxes.png', description: 'Bao bì kết hợp nhận diện thương hiệu và công năng đóng gói. Mẫu hộp trong ảnh dùng để minh hoạ giao diện.', specs: ['Trao đổi kích thước và đặc điểm sản phẩm bên trong.', 'Thống nhất vật liệu và kết cấu phù hợp.', 'Cung cấp file thiết kế hoặc hình ảnh tham khảo.'] },
  bags: { name: 'Túi giấy thương hiệu', image: 'assets/bags.png', description: 'Túi giấy giúp đồng bộ trải nghiệm đóng gói tại điểm bán hoặc khi tặng quà. Ảnh minh hoạ cho nhóm giải pháp này.', specs: ['Trao đổi kích thước, trọng lượng và nhu cầu sử dụng.', 'Thống nhất chất liệu, kiểu quai và nội dung in.', 'Cung cấp số lượng và thời điểm cần hàng dự kiến.'] }
};
const productDialog = document.querySelector('#product-dialog');
const quoteProduct = document.querySelector('#quote-product');
let selectedProduct = null;
document.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
  selectedProduct = products[button.dataset.product];
  document.querySelector('#dialog-title').textContent = selectedProduct.name;
  document.querySelector('#dialog-description').textContent = selectedProduct.description;
  const image = document.querySelector('#dialog-image'); image.src = selectedProduct.image; image.alt = `Ảnh minh hoạ ${selectedProduct.name.toLowerCase()}`;
  const list = document.querySelector('#dialog-specs'); list.replaceChildren(...selectedProduct.specs.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  productDialog.showModal();
}));
document.querySelector('#dialog-quote').addEventListener('click', () => { quoteProduct.value = selectedProduct.name; productDialog.close(); document.querySelector('#bao-gia').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); quoteProduct.focus({preventScroll:true}); });
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { const r = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom)) dialog.close(); });
});

const summaryDialog = document.querySelector('#summary-dialog');
const summary = document.querySelector('#quote-summary');
document.querySelector('#quote-form').addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  summary.textContent = `YÊU CẦU TƯ VẤN / BÁO GIÁ SUNFLOWER\n\nHọ và tên: ${String(data.get('name')).trim()}\nĐiện thoại: ${String(data.get('phone')).trim()}\nDoanh nghiệp: ${String(data.get('company')).trim() || 'Chưa cung cấp'}\nSản phẩm: ${data.get('product')}\nSố lượng dự kiến: ${data.get('quantity') || 'Cần tư vấn'}\nYêu cầu: ${String(data.get('details')).trim() || 'Cần trao đổi thêm'}\n\nBản tóm tắt demo — chưa gửi đến Sunflower.`;
  document.querySelector('#copy-status').textContent = '';
  summaryDialog.showModal();
});
document.querySelector('#copy-summary').addEventListener('click', async () => {
  const status = document.querySelector('#copy-status');
  try { await navigator.clipboard.writeText(summary.textContent); status.textContent = 'Đã sao chép bản tóm tắt. Yêu cầu chưa được gửi.'; }
  catch { const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents(summary); selection.removeAllRanges(); selection.addRange(range); status.textContent = 'Vui lòng nhấn Ctrl+C hoặc sao chép nội dung đã chọn.'; }
});
