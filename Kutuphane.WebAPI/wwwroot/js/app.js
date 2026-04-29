/**
 * KÜTÜPHANE ZEKÂSİ — Tam Çalışan Sistem
 * LocalStorage tabanlı, backend-hazır frontend
 */

// ═══════════════════════════════════════════════════════
// VERİ KATMANI  (backend bağlantısında burası API'ye döner)
// ═══════════════════════════════════════════════════════
const Store = {
  _prefix: 'kz_',
  get(key) {
    try { return JSON.parse(localStorage.getItem(this._prefix + key)); } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem(this._prefix + key, JSON.stringify(val));
    return val;
  },
  del(key) { localStorage.removeItem(this._prefix + key); },

  // Koleksiyon yardımcıları
  getAll(col) { return this.get(col) || []; },
  save(col, arr) { return this.set(col, arr); },
  findById(col, id) { return this.getAll(col).find(r => r.id === id); },
  insert(col, obj) {
    const arr = this.getAll(col);
    obj.id = obj.id || Date.now();
    arr.unshift(obj);
    this.save(col, arr);
    return obj;
  },
  update(col, id, patch) {
    const arr = this.getAll(col);
    const i = arr.findIndex(r => r.id === id);
    if (i !== -1) { arr[i] = { ...arr[i], ...patch }; this.save(col, arr); return arr[i]; }
    return null;
  },
  remove(col, id) {
    const arr = this.getAll(col).filter(r => r.id !== id);
    this.save(col, arr);
  },
};

// ═══════════════════════════════════════════════════════
// BAŞLANGIÇ VERİSİ
// ═══════════════════════════════════════════════════════
function seedData() {
  
}

// ═══════════════════════════════════════════════════════
// YARDIMCI FONKSİYONLAR
// ═══════════════════════════════════════════════════════
function addLog(action, detail, type) {
  Store.insert('logs', {
    date: new Date().toLocaleString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    user: 'Dr. Selim Yılmaz',
    action, detail, type
  });
}

function toast(msg, type = 'success') {
  const existing = document.getElementById('kz-toast');
  if (existing) existing.remove();

  const colors = { success: '#22c55e', error: '#ef4444', warning: '#f59e0b', info: '#6366f1' };
  const icons = { success: 'check_circle', error: 'error', warning: 'warning', info: 'info' };

  const el = document.createElement('div');
  el.id = 'kz-toast';
  el.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:9999;
    display:flex; align-items:center; gap:10px;
    background:${colors[type]}; color:#fff;
    padding:14px 20px; border-radius:14px;
    font-size:14px; font-weight:600; font-family:Inter,sans-serif;
    box-shadow:0 8px 32px rgba(0,0,0,.18);
    transform:translateY(10px); opacity:0;
    transition:all .25s cubic-bezier(.34,1.56,.64,1);
    max-width: 360px;
  `;
  el.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px">${icons[type]}</span>${msg}`;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.transform = 'translateY(0)'; el.style.opacity = '1'; });
  setTimeout(() => { el.style.transform = 'translateY(10px)'; el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3500);
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function daysOverdue(dueDate) {
  const diff = Math.floor((Date.now() - new Date(dueDate)) / 86400000);
  return diff > 0 ? diff : 0;
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function avatarColor(name) {
  const colors = ['bg-indigo-100 text-indigo-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600', 'bg-green-100 text-green-600', 'bg-rose-100 text-rose-600', 'bg-blue-100 text-blue-600'];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) % colors.length;
  return colors[h];
}

function statusBadge(status) {
  const map = {
    'Aktif': 'bg-green-50 text-green-700 ring-green-600/20',
    'Dondurulmuş': 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'Pasif': 'bg-slate-100 text-slate-600 ring-slate-400/20',
    'Borçlu': 'bg-amber-50 text-amber-700 ring-amber-600/20',
    'Gecikmiş': 'bg-red-50 text-red-700 ring-red-600/20',
    'İade Edildi': 'bg-blue-50 text-blue-700 ring-blue-600/20',
    'Mevcut': 'bg-green-50 text-green-700 ring-green-600/20',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-600 ring-slate-400/20';
  return `<span class="px-2.5 py-1 rounded-full text-xs font-semibold ring-1 ring-inset ${cls}">${status}</span>`;
}


function kzConfirm(msg, cb) {
    const overlay = document.createElement('div');
    overlay.id = 'kz-overlay'; // ID ekledik ki kolay bulalım
    overlay.style = 'position:fixed;inset:0;background:rgba(15,23,42,.6);backdrop-filter:blur(4px);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = `
        <div style="background:#fff;border-radius:16px;padding:32px;max-width:400px;width:90%;box-shadow:0 24px 64px rgba(0,0,0,.2);font-family:Inter,sans-serif;">
            <div style="font-size:16px;font-weight:600;color:#0f172a;margin-bottom:8px;">Onay Gerekiyor</div>
            <div style="font-size:14px;color:#64748b;margin-bottom:24px;">${msg}</div>
            <div style="display:flex;gap:12px;justify-content:flex-end;">
                <button id="kz-cancel" style="padding:10px 20px;border-radius:10px;border:1px solid #e2e8f0;background:#f8fafc;font-size:14px;font-weight:600;color:#64748b;cursor:pointer;">İptal</button>
                <button id="kz-confirm" style="padding:10px 20px;border-radius:10px;border:none;background:#ef4444;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">Sil</button>
            </div>
        </div>`;

    document.body.appendChild(overlay);

    overlay.querySelector('#kz-cancel').onclick = () => overlay.remove();

    overlay.querySelector('#kz-confirm').onclick = () => {
        overlay.remove();
        if (cb) cb(); // Callback fonksiyonunu güvenli çağırıyoruz
    };
}

// Modal aç/kapat
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.remove('hidden'); m.classList.add('flex'); }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.classList.add('hidden'); m.classList.remove('flex'); }
}

// ═══════════════════════════════════════════════════════
// SIDEBAR — ortak render (ekrandaki tasarıma göre)
// ═══════════════════════════════════════════════════════
function renderSidebar(activePage) {
  const aside = document.getElementById('sidebar');
  if (!aside) return;

  const navItems = [
    { key: 'dashboard', icon: 'dashboard', label: 'Panel', href: 'dashboard.html' },
    { key: 'kitaplar', icon: 'menu_book', label: 'Kitaplar', href: 'kitaplar.html' },
    { key: 'uyeler', icon: 'group', label: 'Üyeler', href: 'uyeler.html' },
    { key: 'odunc', icon: 'swap_horiz', label: 'Ödünç İşlemleri', href: 'odunc.html' },
    { key: 'loglar', icon: 'bar_chart', label: 'Sistem Logları', href: 'loglar.html' },
    { key: 'ayarlar', icon: 'settings', label: 'Ayarlar', href: 'javascript:void(0)' },
  ];

  aside.innerHTML = `
    <!-- Logo -->
    <div class="px-4 py-6 flex items-center gap-3 border-b border-slate-800/50 mb-2">
      <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/40">
        <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1">local_library</span>
      </div>
      <div>
        <div class="text-white font-bold text-base leading-none">Kütüphane</div>
        <div class="text-indigo-400 text-[10px] font-semibold uppercase tracking-widest mt-0.5">Zekâsı</div>
      </div>
    </div>

    <!-- Yönetim Paneli label -->
    <div class="px-4 mb-2">
      <span class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Yönetim Paneli</span>
    </div>

    <!-- Nav items -->
    <nav class="flex-1 px-2 space-y-0.5">
      ${navItems.map(item => {
        const isActive = activePage === item.key;
        return `
          <a href="${item.href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group
            ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'}">
            <span class="material-symbols-outlined text-[20px] ${isActive ? '' : 'group-hover:scale-110 transition-transform'}"
              style="font-variation-settings:'FILL' ${isActive ? '1' : '0'}">${item.icon}</span>
            <span>${item.label}</span>
            ${isActive ? '<span class="ml-auto w-1.5 h-1.5 rounded-full bg-white/60"></span>' : ''}
          </a>`;
      }).join('')}
    </nav>

    <!-- Yeni Kitap Ekle shortcut -->
    <div class="px-3 py-3">
      <button onclick="window.location.href='kitaplar.html'" class="w-full flex items-center gap-2 px-3 py-2.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 hover:text-indigo-300 rounded-lg text-sm font-medium transition-all border border-indigo-600/20">
        <span class="material-symbols-outlined text-[18px]">add</span>
        + Yeni Kitap Ekle
      </button>
    </div>

    <!-- Bottom: user + logout -->
    <div class="px-3 pb-4 pt-3 border-t border-slate-800/50 space-y-1">
      <a href="javascript:void(0)" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 text-sm font-medium transition-all">
        <span class="material-symbols-outlined text-[20px]">help</span>Yardım
      </a>
      <a href="index.html" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 text-sm font-medium transition-all">
        <span class="material-symbols-outlined text-[20px]">logout</span>Çıkış Yap
      </a>
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
// ÜYELER SAYFASI
// ═══════════════════════════════════════════════════════
let memberState = {
  members: [],
  filtered: [],
  page: 1,
  pageSize: 10,
  search: '',
  statusFilter: 'all',
  editingId: null,
};

function initMembersPage() {
  memberState.members = Store.getAll('members');
  memberState.filtered = [...memberState.members];

  updateMemberStats();
  renderMembersTable();
  setupMemberSearch();
  setupMemberModal();
  setupMemberFilters();
}

function updateMemberStats() {
  const m = memberState.members;
  const total = m.length;
  const active = m.filter(x => x.status === 'Aktif').length;
  const loans = Store.getAll('loans');
  const overdue = loans.filter(l => l.status === 'Gecikmiş').length;
  const newMonth = m.filter(x => new Date(x.joinDate) > new Date(Date.now() - 30 * 86400000)).length;

  const el = (id) => document.getElementById(id);
  if (el('stat-total')) el('stat-total').textContent = total.toLocaleString('tr-TR');
  if (el('stat-new')) el('stat-new').textContent = newMonth;
  if (el('stat-overdue')) el('stat-overdue').textContent = overdue;
  if (el('stat-active')) el('stat-active').textContent = active.toLocaleString('tr-TR');
}

function renderMembersTable() {
  const tbody = document.getElementById('members-tbody');
  if (!tbody) return;

  const start = (memberState.page - 1) * memberState.pageSize;
  const pageData = memberState.filtered.slice(start, start + memberState.pageSize);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="px-8 py-12 text-center text-slate-400 text-sm">Üye bulunamadı.</td></tr>`;
  } else {
    tbody.innerHTML = pageData.map(m => `
      <tr class="hover:bg-slate-50/60 transition-colors" data-member-id="${m.id}">
        <td class="px-6 py-4 font-mono text-sm text-indigo-600 font-semibold whitespace-nowrap">${m.cardNo}</td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(m.fullName)}">${initials(m.fullName)}</div>
            <div>
              <div class="font-semibold text-slate-900 text-sm">${m.fullName}</div>
              <div class="text-xs text-slate-400">${m.occupation || ''}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4 text-sm font-mono text-slate-600 whitespace-nowrap">${m.tc ? m.tc.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3') : '—'}</td>
        <td class="px-6 py-4">
          <div class="text-sm text-slate-700">${m.phone || '—'}</div>
          <div class="text-xs text-slate-400">${m.email || ''}</div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">${formatDate(m.joinDate)}</td>
        <td class="px-6 py-4">${statusBadge(m.status)}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="editMember(${m.id})" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Düzenle">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onclick="deleteMember(${m.id})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Sil">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Sayfalama
  renderMemberPagination();

  const countEl = document.getElementById('member-count-text');
  if (countEl) {
    const total = memberState.filtered.length;
    const s = start + 1, e = Math.min(start + memberState.pageSize, total);
    countEl.textContent = total > 0 ? `Toplam ${total.toLocaleString('tr-TR')} üyeden ${s}-${e} arası gösteriliyor` : '0 üye bulunamadı';
  }
}

function renderMemberPagination() {
  const el = document.getElementById('member-pagination');
  if (!el) return;
  const total = memberState.filtered.length;
  const pages = Math.ceil(total / memberState.pageSize);
  if (pages <= 1) { el.innerHTML = ''; return; }

  let html = `<button onclick="memberGoPage(${memberState.page - 1})" ${memberState.page === 1 ? 'disabled' : ''} class="p-1 hover:bg-white rounded border border-slate-200 disabled:opacity-40"><span class="material-symbols-outlined">chevron_left</span></button>`;
  for (let i = 1; i <= Math.min(pages, 5); i++) {
    html += `<button onclick="memberGoPage(${i})" class="w-8 h-8 rounded ${i === memberState.page ? 'bg-indigo-600 text-white' : 'hover:bg-white border border-transparent hover:border-slate-200'} font-medium text-sm">${i}</button>`;
  }
  if (pages > 5) html += `<span class="px-1 text-slate-400">...</span><button onclick="memberGoPage(${pages})" class="w-8 h-8 rounded hover:bg-white border hover:border-slate-200 font-medium text-sm">${pages}</button>`;
  html += `<button onclick="memberGoPage(${memberState.page + 1})" ${memberState.page === pages ? 'disabled' : ''} class="p-1 hover:bg-white rounded border border-slate-200 disabled:opacity-40"><span class="material-symbols-outlined">chevron_right</span></button>`;
  el.innerHTML = html;
}

window.memberGoPage = function(p) {
  const pages = Math.ceil(memberState.filtered.length / memberState.pageSize);
  if (p < 1 || p > pages) return;
  memberState.page = p;
  renderMembersTable();
};

function filterMembers() {
  const q = memberState.search.toLowerCase();
  memberState.filtered = memberState.members.filter(m => {
    const matchSearch = !q || m.fullName.toLowerCase().includes(q) || m.cardNo.toLowerCase().includes(q) || (m.tc || '').includes(q) || (m.phone || '').includes(q) || (m.email || '').toLowerCase().includes(q);
    const matchStatus = memberState.statusFilter === 'all' || m.status === memberState.statusFilter;
    return matchSearch && matchStatus;
  });
  memberState.page = 1;
  renderMembersTable();
}

function setupMemberSearch() {
  const inp = document.getElementById('member-search');
  if (inp) inp.addEventListener('input', e => { memberState.search = e.target.value; filterMembers(); });
}

function setupMemberFilters() {
  document.querySelectorAll('[data-status-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
      btn.classList.add('bg-indigo-600', 'text-white');
      memberState.statusFilter = btn.dataset.statusFilter;
      filterMembers();
    });
  });
}

function setupMemberModal() {
  const form = document.getElementById('member-form');
  if (!form) return;

  // Açma butonları
  document.querySelectorAll('[data-open-member-modal]').forEach(btn => {
    btn.addEventListener('click', () => openMemberModal(null));
  });

  // Kapat
  document.querySelectorAll('[data-close-member-modal]').forEach(btn => {
    btn.addEventListener('click', () => closeModal('member-modal'));
  });

  // Kaydet
  document.getElementById('member-save-btn').addEventListener('click', saveMember);

  // Overlay kapat
  const modal = document.getElementById('member-modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal('member-modal'); });
}

function openMemberModal(memberId) {
  memberState.editingId = memberId;
  const modal = document.getElementById('member-modal');
  const title = document.getElementById('member-modal-title');
  const form = document.getElementById('member-form');

  form.reset();

  // Otomatik kart no
  const members = Store.getAll('members');
  const lastId = members.length > 0 ? Math.max(...members.map(m => parseInt(m.cardNo.replace('LIB-', '')) || 0)) : 4000;
  document.getElementById('member-cardno').value = `LIB-${lastId + 1}`;
  document.getElementById('member-joindate').value = new Date().toISOString().split('T')[0];

  if (memberId) {
    const m = Store.findById('members', memberId);
    if (!m) return;
    title.textContent = 'Üye Düzenle';
    document.getElementById('member-fullname').value = m.fullName || '';
    document.getElementById('member-tc').value = m.tc || '';
    document.getElementById('member-phone').value = m.phone || '';
    document.getElementById('member-email').value = m.email || '';
    document.getElementById('member-address').value = m.address || '';
  
    document.getElementById('member-joindate').value = m.joinDate || '';
    document.getElementById('member-cardno').value = m.cardNo || '';
    document.getElementById('member-status').value = m.status || 'Aktif';
  } else {
    title.textContent = 'Yeni Üye Kaydı';
  }

  openModal('member-modal');
}

function saveMember() {
  const fullName = document.getElementById('member-fullname').value.trim();
  const tc = document.getElementById('member-tc').value.trim();
  const phone = document.getElementById('member-phone').value.trim();
  const email = document.getElementById('member-email').value.trim();
  const address = document.getElementById('member-address').value.trim();
  
  const joinDate = document.getElementById('member-joindate').value;
  const cardNo = document.getElementById('member-cardno').value;
  const status = document.getElementById('member-status').value;

  if (!fullName) { toast('Ad Soyad alanı zorunludur.', 'warning'); return; }
  if (tc && tc.length !== 11) { toast('TC Kimlik No 11 haneli olmalıdır.', 'warning'); return; }

  if (memberState.editingId) {
    Store.update('members', memberState.editingId, { fullName, tc, phone, email, address,  joinDate, status });
    addLog('Üye Güncellendi', `${fullName} bilgileri güncellendi`, 'member');
    toast(`${fullName} güncellendi.`, 'success');
  } else {
    const newMember = { cardNo, fullName, tc, phone, email, address,  joinDate, status, booksRead: 0, activeLoans: 0 };
    Store.insert('members', newMember);
    addLog('Yeni Üye', `${fullName} sisteme kaydedildi (${cardNo})`, 'member');
    toast(`${fullName} başarıyla eklendi!`, 'success');
  }

  memberState.members = Store.getAll('members');
  memberState.filtered = [...memberState.members];
  filterMembers();
  updateMemberStats();
  closeModal('member-modal');
}

window.editMember = function(id) { openMemberModal(id); };

window.deleteMember = function(id) {
  const m = Store.findById('members', id);
  if (!m) return;
  const activeLoans = Store.getAll('loans').filter(l => l.memberId === id && l.status === 'Aktif');
  if (activeLoans.length > 0) {
    toast('Aktif ödüncü olan üye silinemez!', 'error'); return;
  }
  confirm(`"${m.fullName}" adlı üyeyi silmek istediğinize emin misiniz?`, () => {
    Store.remove('members', id);
    addLog('Üye Silindi', `${m.fullName} (${m.cardNo}) sistemden silindi`, 'warning');
    memberState.members = Store.getAll('members');
    memberState.filtered = [...memberState.members];
    filterMembers();
    updateMemberStats();
    toast(`${m.fullName} silindi.`, 'info');
  });
};

// ═══════════════════════════════════════════════════════
// KİTAPLAR SAYFASI
// ═══════════════════════════════════════════════════════
let bookState = { books: [], filtered: [], page: 1, pageSize: 10, search: '', editingId: null };

function initBooksPage() {
  bookState.books = Store.getAll('books');
  bookState.filtered = [...bookState.books];
  renderBooksTable();
  setupBookModal();

  const inp = document.getElementById('book-search');
  if (inp) inp.addEventListener('input', e => {
    bookState.search = e.target.value.toLowerCase();
    bookState.filtered = bookState.books.filter(b =>
      b.title.toLowerCase().includes(bookState.search) ||
      b.author.toLowerCase().includes(bookState.search) ||
      (b.isbn || '').includes(bookState.search) ||
      (b.category || '').toLowerCase().includes(bookState.search)
    );
    bookState.page = 1;
    renderBooksTable();
  });

  const totalEl = document.getElementById('book-total-count');
  if (totalEl) totalEl.textContent = bookState.books.reduce((s, b) => s + b.copies, 0).toLocaleString('tr-TR');
  const availEl = document.getElementById('book-avail-count');
  if (availEl) availEl.textContent = bookState.books.reduce((s, b) => s + b.available, 0).toLocaleString('tr-TR');
}

function renderBooksTable() {
  const tbody = document.getElementById('books-tbody');
  if (!tbody) return;
  const start = (bookState.page - 1) * bookState.pageSize;
  const pageData = bookState.filtered.slice(start, start + bookState.pageSize);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="px-8 py-12 text-center text-slate-400 text-sm">Kitap bulunamadı.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageData.map(b => {
    const loanedPct = Math.round((1 - b.available / b.copies) * 100);
    const statusLabel = b.available === 0 ? 'Tükendi' : b.available <= 2 ? 'Az Kopya' : 'Mevcut';
    return `
      <tr class="hover:bg-slate-50/60 transition-colors">
        <td class="px-6 py-4">
          <div class="font-semibold text-slate-900 text-sm">${b.title}</div>
          <div class="text-xs text-slate-400 mt-0.5">${b.author}</div>
        </td>
        <td class="px-6 py-4 text-xs text-slate-500 font-mono">${b.isbn || '—'}</td>
        <td class="px-6 py-4"><span class="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg font-medium">${b.category || '—'}</span></td>
        <td class="px-6 py-4 text-sm text-slate-700">${b.publisher || '—'}</td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold text-slate-900">${b.available}</span>
            <span class="text-slate-400 text-xs">/ ${b.copies}</span>
          </div>
          <div class="w-20 bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div class="h-full rounded-full ${b.available === 0 ? 'bg-red-500' : b.available <= 2 ? 'bg-amber-500' : 'bg-indigo-500'}" style="width:${100 - loanedPct}%"></div>
          </div>
        </td>
        <td class="px-6 py-4 text-xs text-slate-500">${b.location || '—'}</td>
        <td class="px-6 py-4">${statusBadge(statusLabel)}</td>
        <td class="px-6 py-4 text-right">
          <div class="flex items-center justify-end gap-1">
            <button onclick="editBook(${b.id})" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Düzenle">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onclick="deleteBook(${b.id})" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Sil">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');

  const countEl = document.getElementById('book-count-text');
  if (countEl) {
    const total = bookState.filtered.length;
    const s = start + 1, e = Math.min(start + bookState.pageSize, total);
    countEl.textContent = `Toplam ${total.toLocaleString('tr-TR')} kitaptan ${s}-${e} arası`;
  }

  renderBookPagination();
}

function renderBookPagination() {
  const el = document.getElementById('book-pagination');
  if (!el) return;
  const pages = Math.ceil(bookState.filtered.length / bookState.pageSize);
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = `<button onclick="bookGoPage(${bookState.page-1})" ${bookState.page===1?'disabled':''} class="p-1 hover:bg-white rounded border border-slate-200 disabled:opacity-40"><span class="material-symbols-outlined">chevron_left</span></button>`;
  for (let i=1;i<=Math.min(pages,5);i++) html+=`<button onclick="bookGoPage(${i})" class="w-8 h-8 rounded ${i===bookState.page?'bg-indigo-600 text-white':'hover:bg-white border border-transparent hover:border-slate-200'} font-medium text-sm">${i}</button>`;
  if(pages>5) html+=`<span class="text-slate-400">...</span><button onclick="bookGoPage(${pages})" class="w-8 h-8 rounded hover:bg-white border hover:border-slate-200 text-sm">${pages}</button>`;
  html+=`<button onclick="bookGoPage(${bookState.page+1})" ${bookState.page===pages?'disabled':''} class="p-1 hover:bg-white rounded border border-slate-200 disabled:opacity-40"><span class="material-symbols-outlined">chevron_right</span></button>`;
  el.innerHTML = html;
}
window.bookGoPage = p => { const pg=Math.ceil(bookState.filtered.length/bookState.pageSize); if(p<1||p>pg)return; bookState.page=p; renderBooksTable(); };

function setupBookModal() {
  document.querySelectorAll('[data-open-book-modal]').forEach(btn => btn.addEventListener('click', () => openBookModal(null)));
  document.querySelectorAll('[data-close-book-modal]').forEach(btn => btn.addEventListener('click', () => closeModal('book-modal')));
  const saveBtn = document.getElementById('book-save-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveBook);
  const modal = document.getElementById('book-modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal('book-modal'); });
}

function openBookModal(bookId) {
  bookState.editingId = bookId;
  const form = document.getElementById('book-form');
  if (form) form.reset();
  const title = document.getElementById('book-modal-title');

  if (bookId) {
    const b = Store.findById('books', bookId);
    if (!b) return;
    if (title) title.textContent = 'Kitap Düzenle';
    document.getElementById('book-title').value = b.title || '';
    document.getElementById('book-author').value = b.author || '';
    document.getElementById('book-isbn').value = b.isbn || '';
    document.getElementById('book-category').value = b.category || '';
    document.getElementById('book-publisher').value = b.publisher || '';
    document.getElementById('book-year').value = b.year || '';
    document.getElementById('book-copies').value = b.copies || 1;
    document.getElementById('book-location').value = b.location || '';
  } else {
    if (title) title.textContent = 'Yeni Kitap Ekle';
    const yearEl = document.getElementById('book-year');
    if (yearEl) yearEl.value = new Date().getFullYear();
    const copiesEl = document.getElementById('book-copies');
    if (copiesEl) copiesEl.value = 1;
  }
  openModal('book-modal');
}

function saveBook() {
  const title = document.getElementById('book-title').value.trim();
  const author = document.getElementById('book-author').value.trim();
  const isbn = document.getElementById('book-isbn').value.trim();
  const category = document.getElementById('book-category').value.trim();
  const publisher = document.getElementById('book-publisher').value.trim();
  const year = parseInt(document.getElementById('book-year').value) || new Date().getFullYear();
  const copies = parseInt(document.getElementById('book-copies').value) || 1;
  const location = document.getElementById('book-location').value.trim();

  if (!title) { toast('Kitap adı zorunludur.', 'warning'); return; }
  if (!author) { toast('Yazar adı zorunludur.', 'warning'); return; }

  if (bookState.editingId) {
    Store.update('books', bookState.editingId, { title, author, isbn, category, publisher, year, copies, location });
    addLog('Kitap Güncellendi', `"${title}" bilgileri güncellendi`, 'book');
    toast(`"${title}" güncellendi.`, 'success');
  } else {
    Store.insert('books', { title, author, isbn, category, publisher, year, copies, available: copies, location });
    addLog('Kitap Eklendi', `"${title}" kataloğa eklendi`, 'book');
    toast(`"${title}" eklendi!`, 'success');
  }

  bookState.books = Store.getAll('books');
  bookState.filtered = [...bookState.books];
  renderBooksTable();
  closeModal('book-modal');
}

window.editBook = id => openBookModal(id);
window.deleteBook = id => {
  const b = Store.findById('books', id);
  if (!b) return;
  confirm(`"${b.title}" kitabını silmek istediğinize emin misiniz?`, () => {
    Store.remove('books', id);
    addLog('Kitap Silindi', `"${b.title}" katalogdan silindi`, 'warning');
    bookState.books = Store.getAll('books');
    bookState.filtered = [...bookState.books];
    renderBooksTable();
    toast(`"${b.title}" silindi.`, 'info');
  });
};

// ═══════════════════════════════════════════════════════
// ÖDÜNÇ İŞLEMLERİ
// ═══════════════════════════════════════════════════════
let loanState = { loans: [], filtered: [], page: 1, pageSize: 10, filter: 'all' };

function initLoansPage() {
  loanState.loans = Store.getAll('loans');
  loanState.filtered = [...loanState.loans];
  renderLoansTable();
  renderOverdueList();
  setupLoanModal();
  setupLoanFilters();
  updateLoanStats();
}

function updateLoanStats() {
  const loans = loanState.loans;
  const active = loans.filter(l => l.status === 'Aktif').length;
  const overdue = loans.filter(l => l.status === 'Gecikmiş').length;
  const returned = loans.filter(l => l.status === 'İade Edildi').length;

  const el = id => document.getElementById(id);
  if (el('stat-active-loans')) el('stat-active-loans').textContent = active;
  if (el('stat-overdue-loans')) el('stat-overdue-loans').textContent = overdue;
  if (el('stat-returned-loans')) el('stat-returned-loans').textContent = returned;
}

function renderLoansTable() {
  const tbody = document.getElementById('loans-tbody');
  if (!tbody) return;
  const start = (loanState.page - 1) * loanState.pageSize;
  const pageData = loanState.filtered.slice(start, start + loanState.pageSize);

  if (pageData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-8 py-12 text-center text-slate-400 text-sm">Ödünç kaydı bulunamadı.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageData.map(l => {
    const isOverdue = l.status === 'Gecikmiş';
    const days = isOverdue ? daysOverdue(l.dueDate) : 0;
    return `
      <tr class="hover:bg-slate-50/60 transition-colors ${isOverdue ? 'bg-red-50/30' : ''}">
        <td class="px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor(l.memberName)}">${initials(l.memberName)}</div>
            <div>
              <div class="font-semibold text-slate-900 text-sm">${l.memberName}</div>
              <div class="text-xs text-slate-400 font-mono">${l.memberCard}</div>
            </div>
          </div>
        </td>
        <td class="px-6 py-4">
          <div class="font-medium text-slate-900 text-sm">${l.bookTitle}</div>
          <div class="text-xs text-slate-400">${l.bookAuthor}</div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">${formatDate(l.loanDate)}</td>
        <td class="px-6 py-4 text-sm whitespace-nowrap ${isOverdue ? 'text-red-600 font-bold' : 'text-slate-600'}">
          ${formatDate(l.dueDate)}
          ${isOverdue ? `<div class="text-xs font-bold text-red-500">${days} gün gecikmiş</div>` : ''}
        </td>
        <td class="px-6 py-4">${statusBadge(l.status)}</td>
        <td class="px-6 py-4 text-right">
          ${l.status !== 'İade Edildi' ? `
            <button onclick="returnLoan(${l.id})" class="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all group" title="İade Al">
              <span class="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">check_circle</span>
            </button>` : `<span class="text-xs text-slate-400">${formatDate(l.returnDate)}</span>`}
        </td>
      </tr>`;
  }).join('');
}

function renderOverdueList() {
  const container = document.getElementById('overdue-list');
  if (!container) return;
  const overdue = Store.getAll('loans').filter(l => l.status === 'Gecikmiş');
  if (overdue.length === 0) {
    container.innerHTML = '<p class="text-slate-400 text-sm text-center py-4">Gecikmiş iade yok 🎉</p>';
    return;
  }
  container.innerHTML = overdue.map(l => {
    const days = daysOverdue(l.dueDate);
    return `
      <div class="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 group hover:border-red-500/30 transition-all">
        <div class="flex justify-between items-start mb-2">
          <div class="max-w-[160px]">
            <p class="text-sm font-bold text-white truncate">${l.bookTitle}</p>
            <p class="text-xs text-slate-400">${l.memberName}</p>
          </div>
          <span class="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold flex-shrink-0">${days} GÜN</span>
        </div>
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-1 text-xs text-slate-500">
            <span class="material-symbols-outlined text-sm">schedule</span>${formatDate(l.dueDate)}
          </div>
          <button onclick="returnLoan(${l.id})" class="text-indigo-400 hover:text-indigo-300 text-xs font-bold flex items-center gap-1 transition-colors">
            İade Al <span class="material-symbols-outlined text-sm">check</span>
          </button>
        </div>
      </div>`;
  }).join('');
}

window.returnLoan = function(id) {
  const loan = Store.findById('loans', id);
  if (!loan) return;
  Store.update('loans', id, { status: 'İade Edildi', returnDate: new Date().toISOString().split('T')[0] });
  // Kitap available sayısını artır
  const book = Store.findById('books', loan.bookId);
  if (book) Store.update('books', loan.bookId, { available: book.available + 1 });
  // Member activeLoans azalt
  const member = Store.findById('members', loan.memberId);
  if (member) Store.update('members', loan.memberId, { activeLoans: Math.max(0, (member.activeLoans || 1) - 1) });

  addLog('Kitap İadesi', `"${loan.bookTitle}" ← ${loan.memberName}`, 'return');
  loanState.loans = Store.getAll('loans');
  loanState.filtered = filterLoansByStatus(loanState.filter);
  renderLoansTable();
  renderOverdueList();
  updateLoanStats();
  toast(`"${loan.bookTitle}" iade alındı!`, 'success');
};

function filterLoansByStatus(filter) {
  if (filter === 'all') return [...loanState.loans];
  return loanState.loans.filter(l => l.status === filter);
}

function setupLoanFilters() {
  document.querySelectorAll('[data-loan-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-loan-filter]').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white');
        b.classList.add('text-slate-600', 'bg-slate-100');
      });
      btn.classList.add('bg-indigo-600', 'text-white');
      btn.classList.remove('text-slate-600', 'bg-slate-100');
      loanState.filter = btn.dataset.loanFilter;
      loanState.filtered = filterLoansByStatus(loanState.filter);
      loanState.page = 1;
      renderLoansTable();
    });
  });
}

function setupLoanModal() {
  document.querySelectorAll('[data-open-loan-modal]').forEach(btn => btn.addEventListener('click', () => {
    // Üye ve kitap dropdownlarını doldur
    const memberSel = document.getElementById('loan-member');
    const bookSel = document.getElementById('loan-book');
    if (memberSel) {
      const members = Store.getAll('members').filter(m => m.status === 'Aktif');
      memberSel.innerHTML = `<option value="">Üye seçin...</option>` + members.map(m => `<option value="${m.id}" data-card="${m.cardNo}">${m.fullName} (${m.cardNo})</option>`).join('');
    }
    if (bookSel) {
      const books = Store.getAll('books').filter(b => b.available > 0);
      bookSel.innerHTML = `<option value="">Kitap seçin...</option>` + books.map(b => `<option value="${b.id}">${b.title} — ${b.author} (${b.available} mevcut)</option>`).join('');
    }
    const dueDateEl = document.getElementById('loan-duedate');
    if (dueDateEl) {
      const d = new Date(Date.now() + 14 * 86400000);
      dueDateEl.value = d.toISOString().split('T')[0];
    }
    openModal('loan-modal');
  }));

  document.querySelectorAll('[data-close-loan-modal]').forEach(btn => btn.addEventListener('click', () => closeModal('loan-modal')));
  const saveBtn = document.getElementById('loan-save-btn');
  if (saveBtn) saveBtn.addEventListener('click', saveLoan);
  const modal = document.getElementById('loan-modal');
  if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal('loan-modal'); });
}

function saveLoan() {
  const memberSel = document.getElementById('loan-member');
  const bookSel = document.getElementById('loan-book');
  const dueDate = document.getElementById('loan-duedate').value;

  const memberId = parseInt(memberSel.value);
  const bookId = parseInt(bookSel.value);

  if (!memberId) { toast('Üye seçiniz.', 'warning'); return; }
  if (!bookId) { toast('Kitap seçiniz.', 'warning'); return; }
  if (!dueDate) { toast('Teslim tarihi seçiniz.', 'warning'); return; }

  const member = Store.findById('members', memberId);
  const book = Store.findById('books', bookId);
  if (!member || !book) return;

  if (book.available <= 0) { toast('Bu kitabın mevcut kopyası kalmadı.', 'error'); return; }

  const loan = {
    memberId, memberName: member.fullName, memberCard: member.cardNo,
    bookId, bookTitle: book.title, bookAuthor: book.author,
    loanDate: new Date().toISOString().split('T')[0],
    dueDate, returnDate: null, status: 'Aktif'
  };

  Store.insert('loans', loan);
  Store.update('books', bookId, { available: book.available - 1 });
  Store.update('members', memberId, { activeLoans: (member.activeLoans || 0) + 1 });

  addLog('Ödünç Verme', `"${book.title}" → ${member.fullName}`, 'loan');
  loanState.loans = Store.getAll('loans');
  loanState.filtered = filterLoansByStatus(loanState.filter);
  renderLoansTable();
  renderOverdueList();
  updateLoanStats();
  closeModal('loan-modal');
  toast(`"${book.title}" ${member.fullName} adına verildi!`, 'success');
}

// ═══════════════════════════════════════════════════════
// LOGLAR SAYFASI
// ═══════════════════════════════════════════════════════
function initLogsPage() {
  renderLogsTable();

  const clearBtn = document.getElementById('clear-logs-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      confirm('Tüm log kayıtları silinecek. Emin misiniz?', () => {
        Store.save('logs', []);
        renderLogsTable();
        toast('Log kayıtları temizlendi.', 'info');
      });
    });
  }
}

function renderLogsTable() {
  const tbody = document.getElementById('logs-tbody');
  if (!tbody) return;

  const logs = Store.getAll('logs');
  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="px-8 py-12 text-center text-slate-400 text-sm">Log kaydı bulunmuyor.</td></tr>`;
    return;
  }

  const typeMap = {
    loan: { cls: 'bg-green-100 text-green-700', icon: 'swap_horiz' },
    return: { cls: 'bg-blue-100 text-blue-700', icon: 'assignment_return' },
    member: { cls: 'bg-purple-100 text-purple-700', icon: 'person_add' },
    book: { cls: 'bg-indigo-100 text-indigo-700', icon: 'auto_stories' },
    warning: { cls: 'bg-amber-100 text-amber-700', icon: 'warning' },
  };

  tbody.innerHTML = logs.map(l => {
    const t = typeMap[l.type] || { cls: 'bg-slate-100 text-slate-600', icon: 'info' };
    return `
      <tr class="hover:bg-slate-50/50 transition-colors">
        <td class="px-6 py-4 text-sm text-slate-500 whitespace-nowrap font-mono">${l.date}</td>
        <td class="px-6 py-4 text-sm font-semibold text-slate-800">${l.user}</td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${t.cls}">
            <span class="material-symbols-outlined text-[14px]">${t.icon}</span>${l.action}
          </span>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600 max-w-xs">${l.detail}</td>
        <td class="px-6 py-4">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
            <span class="material-symbols-outlined text-[12px]">check_circle</span>Başarılı
          </span>
        </td>
      </tr>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════
function initDashboard() {
  const members = Store.getAll('members');
  const loans = Store.getAll('loans');
  const books = Store.getAll('books');

  const totalBooks = books.reduce((s, b) => s + b.copies, 0);
  const activeLoans = loans.filter(l => l.status === 'Aktif').length;
  const newMembers = members.filter(m => new Date(m.joinDate) > new Date(Date.now() - 30 * 86400000)).length;
  const overdue = loans.filter(l => l.status === 'Gecikmiş').length;

  const el = id => document.getElementById(id);
  if (el('dash-books')) el('dash-books').textContent = totalBooks.toLocaleString('tr-TR');
  if (el('dash-loans')) el('dash-loans').textContent = activeLoans.toLocaleString('tr-TR');
  if (el('dash-newmembers')) el('dash-newmembers').textContent = newMembers;
  if (el('dash-overdue')) el('dash-overdue').textContent = overdue;

  // Son işlemler
  const tbody = document.getElementById('recent-loans-tbody');
  if (tbody) {
    const recent = [...loans].slice(0, 5);
    tbody.innerHTML = recent.map(l => `
      <tr class="hover:bg-slate-50/50 transition-colors">
        <td class="px-6 py-4">
          <div class="font-semibold text-slate-900 text-sm">${l.bookTitle}</div>
          <div class="text-xs text-slate-400">${l.bookAuthor}</div>
        </td>
        <td class="px-6 py-4">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(l.memberName)}">${initials(l.memberName)}</div>
            <span class="text-sm font-medium text-slate-700">${l.memberName}</span>
          </div>
        </td>
        <td class="px-6 py-4 text-sm text-slate-600">${l.status === 'İade Edildi' ? 'İade' : 'Ödünç Alma'}</td>
        <td class="px-6 py-4">${statusBadge(l.status)}</td>
      </tr>`).join('');
  }
}

// ═══════════════════════════════════════════════════════
// GİRİŞ SAYFASI
// ═══════════════════════════════════════════════════════
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;
    const btn = document.getElementById('login-btn');

    if (!email || !pass) { toast('E-posta ve şifre zorunludur.', 'warning'); return; }
    if (pass.length < 3) { toast('Şifre çok kısa.', 'warning'); return; }

    btn.disabled = true;
    btn.innerHTML = `<svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Giriş yapılıyor...`;

    setTimeout(() => window.location.href = 'dashboard.html', 800);
  });
}

// ═══════════════════════════════════════════════════════
// BAŞLATICI
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  seedData();

  const page = location.pathname.split('/').pop().replace('.html', '') || 'index';

  // ESC ile modal kapat
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('[id$="-modal"]:not(.hidden)').forEach(m => { m.classList.add('hidden'); m.classList.remove('flex'); });
  });

  switch (page) {
    case 'index': case '': initLoginPage(); break;
    case 'dashboard': renderSidebar('dashboard'); initDashboard(); break;
    case 'kitaplar': renderSidebar('kitaplar'); initBooksPage(); break;
    case 'uyeler': renderSidebar('uyeler'); initMembersPage(); break;
    case 'odunc': renderSidebar('odunc'); initLoansPage(); break;
    case 'loglar': renderSidebar('loglar'); initLogsPage(); break;
  }
});


