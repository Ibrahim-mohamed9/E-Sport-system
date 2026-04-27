// ============================================
// API Utility & Auth Helpers
// All pages include this file
// ============================================

const API_BASE = '/api';

// ----------------------------------------
// TOKEN MANAGEMENT
// ----------------------------------------
function getToken() { return localStorage.getItem('esports_token'); }
function setToken(token) { localStorage.setItem('esports_token', token); }
function removeToken() { localStorage.removeItem('esports_token'); }

function getUser() {
    const u = localStorage.getItem('esports_user');
    return u ? JSON.parse(u) : null;
}

function setUser(user) { localStorage.setItem('esports_user', JSON.stringify(user)); }
function removeUser() { localStorage.removeItem('esports_user'); }

function isLoggedIn() { return !!getToken(); }
function isAdmin() { const u = getUser(); return u && u.role === 'admin'; }

function logout() {
    removeToken();
    removeUser();
    window.location.href = 'index.html';
}

// ----------------------------------------
// API FETCH WRAPPER
// Automatically attaches token to requests
// ----------------------------------------
async function api(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(options.headers || {})
    };

    try {
        const response = await fetch(API_BASE + endpoint, {
            ...options,
            headers
        });

        const data = await response.json();

        // Token expired - redirect to login
        if (response.status === 401 || response.status === 403) {
            if (data.error && data.error.includes('token')) {
                logout();
                return null;
            }
        }

        return { ok: response.ok, status: response.status, data };
    } catch (err) {
        console.error('API error:', err);
        return { ok: false, data: { error: 'Network error. Is the server running?' } };
    }
}

// Shorthand helpers
const GET = (endpoint) => api(endpoint, { method: 'GET' });
const POST = (endpoint, body) => api(endpoint, { method: 'POST', body: JSON.stringify(body) });
const PUT = (endpoint, body) => api(endpoint, { method: 'PUT', body: JSON.stringify(body) });
const DELETE = (endpoint) => api(endpoint, { method: 'DELETE' });

// ----------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------
function showToast(message, type = 'info', duration = 4000) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(120%)';
        toast.style.transition = '0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ----------------------------------------
// NAVBAR SETUP
// Called on every page to set up navigation
// ----------------------------------------
function setupNavbar() {
    const user = getUser();
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;

    if (user) {
        navActions.innerHTML = `
            <div style="position:relative">
                <button class="nav-bell" id="notif-btn" title="Notifications">🔔
                    <span class="notif-badge hidden" id="notif-badge">0</span>
                </button>
                <div class="notif-dropdown" id="notif-dropdown">
                    <div class="notif-dropdown-header">
                        <span>Notifications</span>
                        <button onclick="markAllRead()" style="background:none;border:none;color:var(--accent);font-size:0.8rem;cursor:pointer;">Mark all read</button>
                    </div>
                    <div id="notif-list"><div class="loading"><div class="spinner"></div></div></div>
                </div>
            </div>
            <span class="nav-user">👤 ${user.username}</span>
            ${user.role === 'admin' ? '<a href="/pages/admin.html" class="btn btn-sm btn-secondary">⚙️ Admin</a>' : ''}
            <a href="/pages/dashboard.html" class="btn btn-sm btn-secondary">Dashboard</a>
            <button onclick="logout()" class="btn btn-sm btn-danger">Logout</button>
        `;
        loadNotifCount();
        setupNotifDropdown();
    } else {
        navActions.innerHTML = `
            <a href="login.html" class="btn btn-sm btn-secondary">Login</a>
            <a href="register.html" class="btn btn-sm btn-primary">Register</a>
        `;
    }

    // Mobile menu toggle
    const toggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
        toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    }
}

async function loadNotifCount() {
    const res = await GET('/notifications/unread-count');
    if (res && res.ok) {
        const badge = document.getElementById('notif-badge');
        if (badge && res.data.count > 0) {
            badge.textContent = res.data.count;
            badge.classList.remove('hidden');
        }
    }
}

function setupNotifDropdown() {
    const btn = document.getElementById('notif-btn');
    const dropdown = document.getElementById('notif-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        if (dropdown.classList.contains('open')) {
            await loadNotifications();
        }
    });

    document.addEventListener('click', () => dropdown.classList.remove('open'));
    dropdown.addEventListener('click', e => e.stopPropagation());
}

async function loadNotifications() {
    const list = document.getElementById('notif-list');
    if (!list) return;

    const res = await GET('/notifications');
    if (!res || !res.ok) {
        list.innerHTML = '<div class="empty-state"><p>Could not load notifications</p></div>';
        return;
    }

    if (res.data.length === 0) {
        list.innerHTML = '<div class="empty-state" style="padding:1.5rem"><p>No notifications yet</p></div>';
        return;
    }

    list.innerHTML = res.data.slice(0, 8).map(n => `
        <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="markRead(${n.id}, this)">
            <div class="notif-item-title">${n.title}</div>
            <div class="notif-item-msg">${n.message}</div>
        </div>
    `).join('');
}

async function markRead(id, el) {
    await PUT(`/notifications/${id}/read`);
    el.classList.remove('unread');
    loadNotifCount();
}

async function markAllRead() {
    await api('/notifications/read-all', { method: 'PUT' });
    const badge = document.getElementById('notif-badge');
    if (badge) badge.classList.add('hidden');
    loadNotifications();
}

// ----------------------------------------
// TABS HELPER
// ----------------------------------------
function setupTabs(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const buttons = container.querySelectorAll('.tab-btn');
    const panes = document.querySelectorAll('.tab-pane');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const target = document.getElementById(btn.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ----------------------------------------
// DATE FORMATTING
// ----------------------------------------
function formatDate(dateStr) {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });
}

function formatDateTime(dateStr) {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

// ----------------------------------------
// STATUS BADGE HTML
// ----------------------------------------
function statusBadge(status) {
    const labels = {
        upcoming: '⏳ Upcoming',
        registration: '📝 Registration Open',
        ongoing: '🟢 Live',
        completed: '✅ Completed',
        approved: '✅ Approved',
        pending: '⏳ Pending',
        rejected: '❌ Rejected',
        scheduled: '📅 Scheduled',
        open: '🟢 Open',
        resolved: '✅ Resolved',
        in_progress: '🔄 In Progress'
    };
    return `<span class="badge badge-${status}">${labels[status] || status}</span>`;
}

// ----------------------------------------
// REQUIRE AUTH (redirect if not logged in)
// ----------------------------------------
function requireAuth(redirectTo = 'login.html') {
    if (!isLoggedIn()) {
        window.location.href = redirectTo;
        return false;
    }
    return true;
}

function requireAdminAuth() {
    if (!isLoggedIn() || !isAdmin()) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ----------------------------------------
// MODAL HELPERS
// ----------------------------------------
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// ----------------------------------------
// INIT ON EVERY PAGE
// ----------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    setupNavbar();
});
