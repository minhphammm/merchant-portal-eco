/**
 * Eco Merchant Portal - Core Application Logic
 * Supports Interactive Dashboard, Dynamic Navigation Routing & PRD-ECOPAY-PAYLINK-01 v2.0 Module
 */

document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const AppState = {
    currentPage: 'dashboard',
    currentStore: 'all',
    currentPeriod: 'thisWeek',
    chartRangeDays: 7,
    startDate: '2026-06-16',
    endDate: '2026-06-18',
    lang: 'vie'
  };

  // Cache Original Dashboard View HTML
  const dashboardHTML = document.getElementById('dashboardViewContainer')?.innerHTML || '';

  // Initialize Dashboard
  renderDashboard();

  // Setup Event Listeners
  setupSidebarCollapse();
  setupNavigation();
  setupTopbarControls();
  setupModals();

  /**
   * Sidebar Collapse Toggle Button
   */
  function setupSidebarCollapse() {
    const toggleBtn = document.getElementById('btnToggleSidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
      });
    }
  }

  /**
   * Render Dashboard Page
   */
  function renderDashboard() {
    const mainContent = document.querySelector('.content-area');
    if (!mainContent) return;

    mainContent.innerHTML = `<div id="dashboardViewContainer">${dashboardHTML}</div>`;
    if (typeof i18n !== 'undefined' && i18n.updateDOM) i18n.updateDOM();

    // Render Data & Init Charts safely
    renderDashboardData();
  }

  /**
   * Render Dashboard metrics, tables, top stores, and update charts
   */
  function renderDashboardData() {
    renderKPIs();
    renderRecentTransactions();
    renderTopStores();

    if (typeof PortalCharts !== 'undefined' && PortalCharts.init) {
      PortalCharts.init(AppState.currentStore, AppState.chartRangeDays);
      PortalCharts.update(AppState.currentStore, AppState.chartRangeDays);
    }
    updateLastUpdatedTime();
  }

  /**
   * Render KPI Metric Cards (UC-DB-03, 04, 05)
   */
  function renderKPIs() {
    const metrics = MockData.getMetrics(AppState.currentStore, AppState.currentPeriod);

    const periodTitles = {
      today: 'Hôm Nay',
      thisWeek: 'Tuần Này',
      thisMonth: 'Tháng Này',
      custom: 'Kỳ Đã Chọn'
    };
    const titleSuffix = periodTitles[AppState.currentPeriod] || 'Kỳ Đã Chọn';

    const revTitleEl = document.getElementById('kpiRevenueTitleText');
    if (revTitleEl) revTitleEl.textContent = `Doanh Thu ${titleSuffix}`;

    const revEl = document.getElementById('kpiRevenueVal');
    const revDeltaEl = document.getElementById('kpiRevenueDelta');
    if (revEl) revEl.textContent = metrics.revenue.toLocaleString('vi-VN') + ' đ';
    if (revDeltaEl) {
      const isUp = metrics.revenueDelta >= 0;
      revDeltaEl.className = `delta-badge ${isUp ? 'up-green' : 'down-red'}`;
      revDeltaEl.innerHTML = `${isUp ? '▲ +' : '▼ '}${metrics.revenueDelta}%`;
    }

    const succEl = document.getElementById('kpiSuccessVal');
    const succDeltaEl = document.getElementById('kpiSuccessDelta');
    if (succEl) succEl.textContent = metrics.successCount.toLocaleString('vi-VN');
    if (succDeltaEl) {
      const isUp = metrics.successDelta >= 0;
      succDeltaEl.className = `delta-badge ${isUp ? 'up-green' : 'down-red'}`;
      succDeltaEl.innerHTML = `${isUp ? '▲ +' : '▼ '}${metrics.successDelta}%`;
    }

    const failEl = document.getElementById('kpiFailedVal');
    const failDeltaEl = document.getElementById('kpiFailedDelta');
    if (failEl) failEl.textContent = metrics.failedCount.toLocaleString('vi-VN');
    if (failDeltaEl) {
      if (metrics.failedCount === 0) {
        failDeltaEl.style.display = 'none';
      } else {
        failDeltaEl.style.display = 'inline-flex';
        const isDecreaseGood = metrics.failedDelta < 0;
        failDeltaEl.className = `delta-badge ${isDecreaseGood ? 'up-green' : 'down-red'}`;
        failDeltaEl.innerHTML = `${isDecreaseGood ? '▼ ' : '▲ +'}${metrics.failedDelta}%`;
      }
    }
  }

  /**
   * Render Recent Transactions Table (UC-DB-06)
   */
  function renderRecentTransactions() {
    const txns = MockData.getRecentTransactions(AppState.currentStore);
    const tbody = document.getElementById('recentTxnsTbody');
    if (!tbody) return;

    if (!txns || txns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#94A3B8;">Chưa có giao dịch nào</td></tr>`;
      return;
    }

    tbody.innerHTML = txns.map(t => `
      <tr onclick="openTxnModal('${t.id}')">
        <td style="font-size:12px; color:#64748B;">${t.time}</td>
        <td><span class="txn-code">${t.id}</span></td>
        <td>
          <span class="method-tag">
            <span class="method-dot" style="background:${t.methodColor}"></span>
            ${t.method}
          </span>
        </td>
        <td style="font-weight:700;">${t.amount.toLocaleString('vi-VN')} đ</td>
      </tr>
    `).join('');
  }

  /**
   * Render Top 5 Stores by Revenue Widget (UC-DB-11)
   */
  function renderTopStores() {
    const stores = MockData.getTopStores(AppState.currentStore);
    const container = document.getElementById('topStoresListContainer');
    if (!container) return;

    if (!stores || stores.length === 0) {
      container.innerHTML = `<div style="text-align:center; color:#94A3B8; padding:20px;">Chưa có dữ liệu cửa hàng</div>`;
      return;
    }

    container.innerHTML = stores.map(s => `
      <div class="store-rank-item" onclick="navigateToPage('stores')">
        <div class="store-info-row">
          <div class="store-name-group">
            <span class="rank-badge ${s.rank <= 3 ? 'top-' + s.rank : ''}">${s.rank}</span>
            <span class="store-name-text">${s.name}</span>
          </div>
          <span class="store-amount-text">${formatShortVnd(s.amount)}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${s.percent}%;"></div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Setup Navigation
   */
  function setupNavigation() {
    document.querySelectorAll('.nav-item.has-dropdown > .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const parent = link.parentElement;
        parent.classList.toggle('open');
      });
    });

    document.querySelectorAll('.nav-dropdown-link[data-page]').forEach(subLink => {
      subLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const targetPage = subLink.getAttribute('data-page');
        navigateToPage(targetPage, subLink);
      });
    });

    document.querySelectorAll('.nav-item:not(.has-dropdown) > .nav-link[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPage = link.getAttribute('data-page');
        navigateToPage(targetPage, link);
      });
    });
  }

  // Global Page Navigation Function
  window.navigateToPage = function(targetPage, activeElement = null) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('.nav-dropdown-link').forEach(n => n.classList.remove('active'));

    AppState.currentPage = targetPage;

    const matchedSublink = document.querySelector(`.nav-dropdown-link[data-page="${targetPage}"]`);
    const matchedParentLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);

    if (matchedSublink) {
      matchedSublink.classList.add('active');
      const parentNavItem = matchedSublink.closest('.nav-item');
      if (parentNavItem) {
        parentNavItem.classList.add('active');
        parentNavItem.classList.add('open');
      }
    } else if (matchedParentLink) {
      const parentNavItem = matchedParentLink.closest('.nav-item');
      if (parentNavItem) {
        parentNavItem.classList.add('active');
      }
    }

    if (targetPage === 'dashboard') {
      renderDashboard();
    } else {
      ViewRenderer.renderPage(targetPage);
    }
  };

  /**
   * Setup Topbar Controls
   */
  function setupTopbarControls() {
    const storeSelect = document.getElementById('storeSelect');
    if (storeSelect) {
      storeSelect.addEventListener('change', (e) => {
        AppState.currentStore = e.target.value;
        const selectedText = storeSelect.options[storeSelect.selectedIndex].text;
        showToast(`${i18n.t('toastStoreChanged')} ${selectedText}`);
        if (AppState.currentPage === 'dashboard') {
          renderDashboardData();
        }
      });
    }

    // Language Dropdown Popover (Compact Globe Icon Button)
    const langBtn = document.getElementById('langDropdownBtn');
    const langPopover = document.getElementById('langDropdownPopover');

    if (langBtn && langPopover) {
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langPopover.classList.toggle('show');
        if (notiPopover) notiPopover.classList.remove('show');
      });

      document.querySelectorAll('.lang-option-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetLang = item.getAttribute('data-lang');
          
          document.querySelectorAll('.lang-option-item').forEach(i => i.classList.remove('active'));
          item.classList.add('active');

          if (typeof i18n !== 'undefined' && i18n.setLanguage) i18n.setLanguage(targetLang);
          AppState.lang = targetLang;
          langPopover.classList.remove('show');

          if (AppState.currentPage === 'dashboard') {
            renderDashboardData();
          }
          showToast(`Đã đổi ngôn ngữ sang: ${targetLang === 'vie' ? 'Tiếng Việt' : 'English'}`);
        });
      });
    }

    // Notification Dropdown Popover (2 Tabs: Cập nhật từ Finviet / Doanh nghiệp)
    const notiBtn = document.getElementById('notificationBtn');
    const notiPopover = document.getElementById('notificationPopover');

    if (notiBtn && notiPopover) {
      notiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notiPopover.classList.toggle('show');
        if (langPopover) langPopover.classList.remove('show');
      });

      document.addEventListener('click', (e) => {
        if (!notiPopover.contains(e.target) && e.target !== notiBtn) {
          notiPopover.classList.remove('show');
        }
        if (langPopover && !langPopover.contains(e.target) && e.target !== langBtn) {
          langPopover.classList.remove('show');
        }
      });
    }

    window.switchNotiTab = function(tabName) {
      document.querySelectorAll('.noti-tab-btn').forEach(b => b.classList.remove('active'));
      const tabFinviet = document.getElementById('notiTabFinviet');
      const tabEnterprise = document.getElementById('notiTabEnterprise');

      if (tabFinviet) tabFinviet.style.display = 'none';
      if (tabEnterprise) tabEnterprise.style.display = 'none';

      if (tabName === 'finviet' && tabFinviet) {
        document.querySelectorAll('.noti-tab-btn')[0]?.classList.add('active');
        tabFinviet.style.display = 'block';
      } else if (tabName === 'enterprise' && tabEnterprise) {
        document.querySelectorAll('.noti-tab-btn')[1]?.classList.add('active');
        tabEnterprise.style.display = 'block';
      }
    };

    window.markAllNotificationsRead = function() {
      document.querySelectorAll('.noti-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      const badge = document.getElementById('globalNotiBadge');
      if (badge) badge.style.display = 'none';
      document.querySelectorAll('.noti-tab-badge').forEach(b => b.style.display = 'none');
      showToast('Đã đánh dấu tất cả thông báo là đã đọc.');
    };

    // Switch to Legacy Portal (v1.0) Handler
    window.switchLegacyPortal = function() {
      document.getElementById('modalTitleText').textContent = '🔄 Chuyển Đổi Về Giao Diện Portal Cũ (v1.0)';
      document.getElementById('modalBodyContent').innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px; text-align:center; padding:10px 0;">
          <div style="font-size:42px;">🏛️</div>
          <h3 style="font-weight:800; color:var(--text-main);">Xác nhận chuyển sang phiên bản Portal Cũ (v1.0)?</h3>
          <p style="font-size:13px; color:var(--text-muted); line-height:1.5;">
            Giao diện Portal cũ (v1.0) vẫn được duy trì song song phục vụ người dùng. Bạn có thể quay lại giao diện Eco Portal v2.0 bất kỳ lúc nào.
          </p>
        </div>
      `;

      const btnAction = document.getElementById('btnFooterAction');
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Xác Nhận Chuyển Về Portal Cũ';

      btnAction.onclick = function() {
        document.getElementById('modalOverlay').classList.remove('show');
        showToast('Đang chuyển hướng sang giao diện Portal Cũ (v1.0)...');
        setTimeout(() => {
          alert('Đã chuyển sang giao diện Portal v1.0 thành công! Nhấp vào nút "Trở về Eco Portal v2.0" bất kỳ lúc nào để quay lại giao diện mới.');
        }, 400);
      };

      document.getElementById('modalOverlay').classList.add('show');
    };

    // User Profile Menu Popover in Sidebar Footer
    const userMenu = document.getElementById('userProfileMenu');
    const userPopover = document.getElementById('userDropdownPopover');
    if (userMenu && userPopover) {
      userMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        userPopover.classList.toggle('show');
      });

      document.addEventListener('click', () => {
        userPopover.classList.remove('show');
      });
    }
  }

  /**
   * Setup Dashboard Toolbar Controls
   */
  function setupToolbarControls() {
    const refreshBtn = document.getElementById('btnRefresh');
    if (refreshBtn) {
      refreshBtn.onclick = function() {
        refreshBtn.classList.add('spinning');
        setTimeout(() => {
          refreshBtn.classList.remove('spinning');
          renderDashboardData();
          showToast(i18n.t('toastRefreshed'));
        }, 600);
      };
    }

    const btnDateFilter = document.getElementById('btnDateFilter');
    if (btnDateFilter) {
      btnDateFilter.onclick = function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btnDateFilter.classList.add('active');
        openCustomDateModal();
      };
    }

    document.querySelectorAll('.time-btn[data-period]:not(#btnDateFilter)').forEach(btn => {
      btn.onclick = function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const period = btn.getAttribute('data-period');
        AppState.currentPeriod = period;
        renderDashboardData();
        showToast(`Đã lọc dữ liệu theo: ${btn.textContent.trim()}`);
      };
    });

    document.querySelectorAll('.chart-toggle-btn').forEach(btn => {
      btn.onclick = function() {
        document.querySelectorAll('.chart-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        AppState.chartRangeDays = parseInt(btn.getAttribute('data-days'));
        if (typeof PortalCharts !== 'undefined' && PortalCharts.update) {
          PortalCharts.update(AppState.currentStore, AppState.chartRangeDays);
        }
      };
    });
  }

  // =========================================================================
  // PRD-ECOPAY-PAYLINK-01 v2.0 - Payment Link & QR Code Handlers
  // =========================================================================

  /**
   * Tab Switcher inside PayRequests View (links, qrbank, smsquota)
   */
  window.switchPaylinkTab = function(tabName) {
    document.querySelectorAll('.paylink-tab-btn').forEach(b => b.classList.remove('active'));
    const tabLinks = document.getElementById('paylinkTabLinks');
    const tabQrBank = document.getElementById('paylinkTabQrBank');
    const tabSmsQuota = document.getElementById('paylinkTabSmsQuota');

    if (tabLinks) tabLinks.style.display = 'none';
    if (tabQrBank) tabQrBank.style.display = 'none';
    if (tabSmsQuota) tabSmsQuota.style.display = 'none';

    if (tabName === 'links' && tabLinks) {
      document.querySelectorAll('.paylink-tab-btn')[0]?.classList.add('active');
      tabLinks.style.display = 'block';
    } else if (tabName === 'qrbank' && tabQrBank) {
      document.querySelectorAll('.paylink-tab-btn')[1]?.classList.add('active');
      tabQrBank.style.display = 'block';
    } else if (tabName === 'smsquota' && tabSmsQuota) {
      document.querySelectorAll('.paylink-tab-btn')[2]?.classList.add('active');
      tabSmsQuota.style.display = 'block';
    }
  };

  /**
   * US-001 / FR-001: Modal Khởi tạo Yêu cầu thanh toán đơn lẻ
   */
  window.openCreateSinglePaylinkModal = function() {
    document.getElementById('modalTitleText').textContent = '➕ Khởi Tạo Yêu Cầu Thanh Toán Đơn Lẻ (US-001)';
    document.getElementById('modalBodyContent').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="form-group-field">
          <label>Cửa hàng phát hành *</label>
          <select id="plCreateStore">
            <option value="storeQ1">Chi nhánh Quận 1 - Hồ Chí Minh (Quota còn: 380 tin)</option>
            <option value="storeQ3">Chi nhánh Hoàn Kiếm - Hà Nội (Quota còn: 205 tin)</option>
            <option value="storeTB">Chi nhánh Hải Châu - Đà Nẵng (Quota còn: 160 tin)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Họ và tên khách hàng *</label>
          <input type="text" id="plCreateCustomerName" placeholder="Nhập tên khách hàng (VD: Nguyen Van A)">
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group-field">
            <label>Số điện thoại * (10 số, bắt đầu 0)</label>
            <input type="text" id="plCreatePhone" placeholder="VD: 0912345678">
          </div>
          <div class="form-group-field">
            <label>Email khách hàng *</label>
            <input type="email" id="plCreateEmail" placeholder="VD: vana@gmail.com">
          </div>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <div class="form-group-field">
            <label>Mã đơn hàng DN * (Unique)</label>
            <input type="text" id="plCreateOrderCode" value="DH20260820${Math.floor(10 + Math.random() * 89)}">
          </div>
          <div class="form-group-field">
            <label>Số tiền thanh toán * (1k - 100M VNĐ)</label>
            <input type="number" id="plCreateAmount" placeholder="VD: 500000">
          </div>
        </div>
        <div class="form-group-field">
          <label>Kênh thông báo gửi đi *</label>
          <select id="plCreateChannel">
            <option value="BOTH">SMS và Email (Trừ 1 Quota SMS)</option>
            <option value="SMS">Chỉ gửi SMS (Trừ 1 Quota SMS)</option>
            <option value="EMAIL">Chỉ gửi Email (Miễn phí)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Thời gian hết hạn thanh toán (Chuẩn XX ngày HH:MM)</label>
          <select id="plCreateExpiryType">
            <option value="DEFAULT">Mặc định (01 ngày 00:00 - 24 giờ)</option>
            <option value="2H">Tùy chỉnh: 00 ngày 02:00 (2 giờ)</option>
            <option value="6H">Tùy chỉnh: 00 ngày 06:00 (6 giờ)</option>
            <option value="48H">Tùy chỉnh: 02 ngày 00:00 (48 giờ)</option>
          </select>
        </div>
        <div id="plCreateErrorAlert" class="error-text-alert"></div>
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Phát Hành Link';

    btnAction.onclick = function() {
      const name = document.getElementById('plCreateCustomerName').value.trim();
      const phone = document.getElementById('plCreatePhone').value.trim();
      const email = document.getElementById('plCreateEmail').value.trim();
      const amount = parseFloat(document.getElementById('plCreateAmount').value);

      if (!name) {
        showError('Vui lòng nhập Họ và tên khách hàng.');
        return;
      }
      if (!/^0[0-9]{9}$/.test(phone)) {
        showError('Số điện thoại không hợp lệ (Bắt buộc 10 chữ số, bắt đầu từ 0).');
        return;
      }
      if (!email || !email.includes('@')) {
        showError('Email khách hàng không đúng định dạng.');
        return;
      }
      if (isNaN(amount) || amount < 1000 || amount > 1000000000) {
        showError('Số tiền thanh toán phải nằm trong khoảng từ 1.000 VNĐ đến 100.000.000 VNĐ (BR-001).');
        return;
      }

      const description = document.getElementById('plCreateCustomerName')?.value || 'Yêu cầu thanh toán đơn lẻ';
      showToast(`Tạo Yêu cầu thanh toán thành công! Mã đơn: DH2026082099.`);
      ViewRenderer.renderPage('pay-requests');
      setTimeout(() => {
        showQrCodeResultModal({
          orderCode: 'DH2026082099',
          amount: amount,
          customerName: name,
          phone: phone,
          email: email,
          expiryText: '00 ngày 02:00',
          description: 'Thanh toán đơn hàng đơn lẻ'
        });
      }, 200);
    };

    function showError(msg) {
      const alertEl = document.getElementById('plCreateErrorAlert');
      if (alertEl) {
        alertEl.textContent = `⚠️ ${msg}`;
        alertEl.style.display = 'block';
      }
    }

    document.getElementById('modalOverlay').classList.add('show');
  };

  /**
   * US-004 / FR-004 / FR-005: Modal Import Excel Hàng Loạt với Preview & Inline Edit
   */
  window.openImportBatchModal = function() {
    document.getElementById('modalTitleText').textContent = '📥 Import File Excel Tạo Yêu Cầu Thanh Toán Hàng Loạt (US-004)';
    document.getElementById('modalBodyContent').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Chọn file Excel (.xlsx, tối đa 50 dòng, <= 50MB):</label>
          <a href="javascript:void(0)" class="link-doc-view" onclick="showToast('Đã tải file mẫu Template_Paylink_50Rows.xlsx'); return false;">📥 Tải File Mẫu (.xlsx)</a>
        </div>
        <input type="file" id="batchFileInput" accept=".xlsx,.xls" onchange="simulateExcelPreview()">

        <div id="batchPreviewContainer" style="display:none; margin-top:8px;">
          <div style="font-size:13px; font-weight:700; color:var(--text-main); margin-bottom:4px;">
            Bảng Xem Trước Dữ Liệu (Preview): <span id="previewCountText">3 dòng dữ liệu (1 dòng có lỗi)</span>
          </div>
          <div class="preview-table-wrapper">
            <table class="preview-table">
              <thead>
                <tr>
                  <th>Dòng</th>
                  <th>Họ Tên KH</th>
                  <th>SĐT (10 số)</th>
                  <th>Email</th>
                  <th>Số Tiền (VNĐ)</th>
                  <th>Kênh Gửi</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Nguyễn Văn Bình</td>
                  <td>0918882233</td>
                  <td>binh.nv@gmail.com</td>
                  <td>750,000</td>
                  <td>SMS & Email</td>
                </tr>
                <tr class="row-error">
                  <td>2</td>
                  <td>Lê Thu Hà</td>
                  <td class="cell-error" title="Thiếu SĐT hợp lệ"><input type="text" id="inlineEditPhoneRow2" value="0912345" style="border:1px solid #FF4D4F; color:#FF4D4F; font-weight:700;"></td>
                  <td>ha.le@gmail.com</td>
                  <td>1,200,000</td>
                  <td>SMS</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Trần Đức Thắng</td>
                  <td>0933998877</td>
                  <td>thang.td@yahoo.com</td>
                  <td>500,000</td>
                  <td>Email</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="batchErrorAlert" class="error-text-alert" style="display:block; margin-top:10px;">
            ⚠️ Dòng số 2 bị tô màu vàng do Số điện thoại không hợp lệ (0912345). Bạn có thể chỉnh sửa trực tiếp tại ô màu đỏ ở trên.
          </div>
        </div>
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Phát Hành Hàng Loạt';
    btnAction.disabled = true;

    window.simulateExcelPreview = function() {
      document.getElementById('batchPreviewContainer').style.display = 'block';
      const inputPhone = document.getElementById('inlineEditPhoneRow2');
      if (inputPhone) {
        inputPhone.addEventListener('input', () => {
          if (/^0[0-9]{9}$/.test(inputPhone.value.trim())) {
            inputPhone.style.border = '1px solid var(--border-color)';
            inputPhone.style.color = 'var(--text-main)';
            inputPhone.closest('tr').classList.remove('row-error');
            document.getElementById('batchErrorAlert').style.display = 'none';
            btnAction.disabled = false;
          } else {
            btnAction.disabled = true;
          }
        });
      }
    };

    btnAction.onclick = function() {
      document.getElementById('modalOverlay').classList.remove('show');
      showToast('Đã khởi tạo thành công 3/3 yêu cầu thanh toán từ file Excel! Trừ 2 Quota SMS.');
      ViewRenderer.renderPage('pay-requests');
    };

    document.getElementById('modalOverlay').classList.add('show');
  };

  /**
   * US-006: Modal Mapping Mã QR Ngân Hàng với tự động vô hiệu hóa QR cũ
   */
  window.openMappingQrModal = function(qrId) {
    document.getElementById('modalTitleText').textContent = '🔗 Mapping Mã QR Code Ngân Hàng Vẫn Cửa Hàng (US-006)';
    document.getElementById('modalBodyContent').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <p style="font-size:13px; color:var(--text-muted);">
          Bạn đang chọn mapping mã QR <strong class="txn-code">${qrId}</strong> vào Cửa hàng. 
          <br><span style="color:var(--color-danger); font-weight:700;">Lưu ý (BR-010):</span> Mã QR cũ đang hoạt động của Cửa hàng đó sẽ lập tức chuyển sang trạng thái <strong>Vô hiệu hóa</strong>.
        </p>
        <div class="form-group-field">
          <label>Chọn Cửa hàng liên kết *</label>
          <select id="qrMappingStoreSelect">
            <option value="storeQ1">Chi nhánh Quận 1 - Hồ Chí Minh (Đang dùng mã QR-BVB-2026-004)</option>
            <option value="storeQ3">Chi nhánh Hoàn Kiếm - Hà Nội</option>
            <option value="storeTB">Chi nhánh Hải Châu - Đà Nẵng</option>
          </select>
        </div>
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Xác Nhận Mapping';

    btnAction.onclick = function() {
      document.getElementById('modalOverlay').classList.remove('show');
      showToast(`Mapping thành công mã ${qrId} vào Chi nhánh Quận 1! Mã QR cũ (QR-BVB-2026-004) đã được vô hiệu hóa an toàn.`);
      ViewRenderer.renderPage('pay-requests');
      setTimeout(() => switchPaylinkTab('qrbank'), 100);
    };

    document.getElementById('modalOverlay').classList.add('show');
  };

  /**
   * Modal Thêm Mã QR Ngân hàng Mới (MB / BVB)
   */
  window.openCreateBankQrModal = function() {
    document.getElementById('modalTitleText').textContent = '➕ Thêm Mã QR Ngân Hàng Mới (MB / BVB)';
    document.getElementById('modalBodyContent').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="form-group-field">
          <label>Chọn Ngân hàng kết nối *</label>
          <select id="bankSelect">
            <option value="MB">MB Bank (Ngân hàng TMCP Quân Đội)</option>
            <option value="BVB">BVB (Ngân hàng TMCP Bảo Việt)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Số tài khoản nhận tiền *</label>
          <input type="text" value="990123884922">
        </div>
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Tạo Mã QR';

    btnAction.onclick = function() {
      document.getElementById('modalOverlay').classList.remove('show');
      showToast('Đã khởi tạo thành công mã QR MB Bank mới (Mã: QR-MB-2026-005). Trạng thái: Mã chưa đồng bộ.');
      ViewRenderer.renderPage('pay-requests');
      setTimeout(() => switchPaylinkTab('qrbank'), 100);
    };

    document.getElementById('modalOverlay').classList.add('show');
  };

  /**
   * US-009: Modal Điều chuyển Hạn mức SMS giữa các Cửa hàng
   */
  window.openTransferSmsQuotaModal = function() {
    document.getElementById('modalTitleText').textContent = '🔄 Điều Chuyển Hạn Mức SMS Giữa Các Cửa Hàng (US-009)';
    document.getElementById('modalBodyContent').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:14px;">
        <div class="form-group-field">
          <label>Cửa hàng nguồn (Chuyển đi) *</label>
          <select id="smsSourceStore">
            <option value="storeQ1">Chi nhánh Quận 1 (Khả dụng: 380 tin)</option>
            <option value="storeQ3">Chi nhánh Hoàn Kiếm (Khả dụng: 205 tin)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Cửa hàng đích (Nhận thêm) *</label>
          <select id="smsTargetStore">
            <option value="storeTB">Chi nhánh Hải Châu (Khả dụng: 160 tin)</option>
            <option value="storeQ3">Chi nhánh Hoàn Kiếm (Khả dụng: 205 tin)</option>
          </select>
        </div>
        <div class="form-group-field">
          <label>Số lượng tin nhắn SMS cần chuyển * (d <= Quota khả dụng)</label>
          <input type="number" id="smsTransferAmount" placeholder="VD: 50">
        </div>
        <div id="smsTransferErrorAlert" class="error-text-alert"></div>
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Xác Nhận Chuyển';

    btnAction.onclick = function() {
      const amount = parseInt(document.getElementById('smsTransferAmount').value);
      if (isNaN(amount) || amount <= 0 || amount > 380) {
        const alertEl = document.getElementById('smsTransferErrorAlert');
        alertEl.textContent = '⚠️ Số tin điều chuyển không hợp lệ hoặc vượt quá số dư khả dụng của Cửa hàng nguồn (max 380 tin).';
        alertEl.style.display = 'block';
        return;
      }

      document.getElementById('modalOverlay').classList.remove('show');
      showToast(`Đã điều chuyển thành công ${amount} tin SMS từ Chi nhánh Quận 1 sang Chi nhánh Hải Châu!`);
      ViewRenderer.renderPage('pay-requests');
      setTimeout(() => switchPaylinkTab('smsquota'), 100);
    };

    document.getElementById('modalOverlay').classList.add('show');
  };

  /**
   * Action Handlers for Paylink List Items
   */
  window.resendEmail = function(id) {
    showToast(`Đã gửi lại Email thông báo thanh toán cho mã đơn ${id}. (Bộ đếm đếm số lần tăng +1).`);
  };

  window.cancelPaylink = function(id) {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${id} không? Link thanh toán sẽ lập tức bị vô hiệu hóa.`)) {
      showToast(`Đã hủy thành công đơn hàng ${id}. Trạng thái chuyển sang Đã hủy.`);
      ViewRenderer.renderPage('pay-requests');
    }
  };

  /**
   * Payment Transactions Filter Actions
   */
  window.toggleExtraTxnFilters = function() {
    const extraDiv = document.getElementById('extraTxnFilterFields');
    const btn = document.getElementById('btnToggleExtraTxnFilters');
    if (extraDiv) {
      const isHidden = extraDiv.style.display === 'none' || !extraDiv.style.display;
      extraDiv.style.display = isHidden ? 'grid' : 'none';
      if (btn) {
        btn.innerHTML = isHidden ? 'Thu gọn ∧' : 'Mở rộng tìm kiếm ∨';
      }
    }
  };

  window.resetTxnFilters = function() {
    const form = document.getElementById('txnFilterForm');
    if (form) {
      form.reset();
      showToast('Đã làm lại toàn bộ bộ lọc tìm kiếm.');
      window.applyTxnFilters();
    }
  };

  window.applyTxnFilters = function() {
    const txnId = document.getElementById('filterTxnId')?.value.trim().toLowerCase() || '';
    const merchantOrderId = document.getElementById('filterMerchantOrderId')?.value.trim().toLowerCase() || '';
    const storeName = document.getElementById('filterStoreName')?.value || 'all';
    const bankPartner = document.getElementById('filterBankPartnerCode')?.value || 'all';
    const paymentSource = document.getElementById('filterPaymentSource')?.value || 'all';
    const status = document.getElementById('filterStatus')?.value || 'all';

    let allTxns = MockData.getFullTransactions ? MockData.getFullTransactions() : [];
    
    let filtered = allTxns.filter(t => {
      if (txnId && !t.id.toLowerCase().includes(txnId)) return false;
      if (merchantOrderId && !t.merchantOrderId.toLowerCase().includes(merchantOrderId)) return false;
      if (storeName !== 'all') {
        if (storeName === 'storeQ1' && !t.storeName.includes('Quận 1')) return false;
        if (storeName === 'storeQ3' && !t.storeName.includes('Hoàn Kiếm')) return false;
        if (storeName === 'storeTB' && !t.storeName.includes('Hải Châu')) return false;
      }
      if (bankPartner !== 'all') {
        if (!t.customerPhoneAccount.includes(bankPartner) && !t.paymentSource.includes(bankPartner)) return false;
      }
      if (paymentSource !== 'all' && !t.paymentSource.includes(paymentSource)) return false;
      if (status !== 'all' && t.status !== status) return false;
      return true;
    });

    // Update table tbody
    const tbody = document.getElementById('payTxnsFullTbody');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="17" style="text-align:center; padding:30px; color:var(--text-muted);">Không tìm thấy giao dịch nào phù hợp với bộ lọc</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(t => `
          <tr onclick="openTxnModal('${t.id}')">
            <td><strong>${t.stt}</strong></td>
            <td><span class="txn-code">${t.id}</span></td>
            <td><span class="txn-code">${t.merchantOrderId}</span></td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.createdDate}</td>
            <td><strong>${t.customerName}</strong></td>
            <td style="font-size:12px; font-family:monospace; white-space:nowrap;">${t.customerPhoneAccount}</td>
            <td style="font-size:12px;">${t.storeName}</td>
            <td style="font-weight:800; color:var(--color-primary); white-space:nowrap;">${t.amount.toLocaleString('vi-VN')} đ</td>
            <td style="font-weight:600; white-space:nowrap;">${t.fee.toLocaleString('vi-VN')} đ</td>
            <td style="font-weight:600; white-space:nowrap;">${t.userFee ? t.userFee.toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>
            <td><span style="font-family:monospace; background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:11px;">${t.voucherCode}</span></td>
            <td style="font-size:12px;">${t.promotion}</td>
            <td><span class="status-badge badge-processing" style="font-size:11px;">${t.paymentSource}</span></td>
            <td style="font-size:12px; white-space:nowrap;">${t.paymentType}</td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.partnerPayTime}</td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.merchantPayTime}</td>
            <td><span class="status-badge ${t.statusClass}">${t.statusText}</span></td>
          </tr>
        `).join('');
      }
    }

    // Update Counts
    const elTotal = document.getElementById('statTotalCount');
    const elCreated = document.getElementById('statCreatedCount');
    const elProcessing = document.getElementById('statProcessingCount');
    const elApproved = document.getElementById('statApprovedCount');
    const elRejected = document.getElementById('statRejectedCount');
    const elFailed = document.getElementById('statFailedCount');
    const elPaid = document.getElementById('statPaidCount');
    const elSuccess = document.getElementById('statSuccessCount');
    const elPending = document.getElementById('statPendingCount');
    const elDisp = document.getElementById('displayedTxnCount');

    if (elTotal) elTotal.textContent = filtered.length;
    if (elCreated) elCreated.textContent = filtered.filter(t => t.status === 'created').length;
    if (elProcessing) elProcessing.textContent = filtered.filter(t => t.status === 'processing').length;
    if (elApproved) elApproved.textContent = filtered.filter(t => t.status === 'approved').length;
    if (elRejected) elRejected.textContent = filtered.filter(t => t.status === 'rejected').length;
    if (elFailed) elFailed.textContent = filtered.filter(t => t.status === 'failed').length;
    if (elPaid) elPaid.textContent = filtered.filter(t => t.status === 'paid').length;
    if (elSuccess) elSuccess.textContent = filtered.filter(t => t.status === 'success').length;
    if (elPending) elPending.textContent = filtered.filter(t => t.status === 'pending').length;
    if (elDisp) elDisp.textContent = `${filtered.length} / ${allTxns.length}`;

    showToast(`Đã tìm thấy ${filtered.length} giao dịch phù hợp.`);
  };

  /**
   * Refund Transactions Filter Actions
   */
  window.toggleExtraRefundFilters = function() {
    const extraDiv = document.getElementById('extraRefundFilterFields');
    const btn = document.getElementById('btnToggleExtraRefundFilters');
    if (extraDiv) {
      const isHidden = extraDiv.style.display === 'none' || !extraDiv.style.display;
      extraDiv.style.display = isHidden ? 'block' : 'none';
      if (btn) {
        btn.innerHTML = isHidden ? 'Thu gọn ∧' : 'Mở rộng tìm kiếm ∨';
      }
    }
  };

  window.resetRefundFilters = function() {
    const form = document.getElementById('refundFilterForm');
    if (form) {
      form.reset();
      showToast('Đã làm lại toàn bộ bộ lọc hoàn tiền.');
      window.applyRefundFilters();
    }
  };

  window.applyRefundFilters = function() {
    const originalTxnId = document.getElementById('filterOriginalTxnId')?.value.trim().toLowerCase() || '';
    const refundId = document.getElementById('filterRefundId')?.value.trim().toLowerCase() || '';
    const originalPartnerTxnId = document.getElementById('filterOriginalPartnerTxnId')?.value.trim().toLowerCase() || '';
    const paymentPartner = document.getElementById('filterPaymentPartnerCode')?.value || 'all';
    const status = document.getElementById('filterRefundStatus')?.value || 'all';

    let allTxns = MockData.getRefundTransactions ? MockData.getRefundTransactions() : [];
    
    let filtered = allTxns.filter(t => {
      if (originalTxnId && !t.originalTxnId.toLowerCase().includes(originalTxnId)) return false;
      if (refundId && !t.refundId.toLowerCase().includes(refundId)) return false;
      if (originalPartnerTxnId && !t.originalPartnerTxnId.toLowerCase().includes(originalPartnerTxnId)) return false;
      if (paymentPartner !== 'all' && t.paymentPartnerCode !== paymentPartner) return false;
      if (status !== 'all' && t.status !== status) return false;
      return true;
    });

    // Update table tbody
    const tbody = document.getElementById('refundTxnsFullTbody');
    if (tbody) {
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="24" style="text-align:center; padding:30px; color:var(--text-muted);">Không tìm thấy giao dịch hoàn tiền nào phù hợp với bộ lọc</td></tr>`;
      } else {
        tbody.innerHTML = filtered.map(t => `
          <tr onclick="showToast('Xem chi tiết đơn hoàn tiền: ${t.refundId}')">
            <td><strong>${t.stt}</strong></td>
            <td><span class="txn-code">${t.refundId}</span></td>
            <td><span class="txn-code">${t.originalTxnId}</span></td>
            <td><span class="txn-code">${t.originalPartnerTxnId}</span></td>
            <td><span class="txn-code">${t.partnerRefundReconcileId}</span></td>
            <td><span class="txn-code">${t.partnerRefundTxnId}</span></td>
            <td style="font-size:12px;">${t.storeName}</td>
            <td><strong>${t.customerName}</strong></td>
            <td style="font-size:12px; font-family:monospace; white-space:nowrap;">${t.customerPhoneAccount}</td>
            <td style="font-weight:800; color:var(--color-primary); white-space:nowrap;">${t.amount.toLocaleString('vi-VN')} đ</td>
            <td style="font-weight:600; color:var(--color-danger); white-space:nowrap;">${t.penaltyAmount ? t.penaltyAmount.toLocaleString('vi-VN') + ' đ' : '0 đ'}</td>
            <td><span style="font-family:monospace; font-size:11.5px; font-weight:700;">${t.paymentPartnerCode}</span></td>
            <td><span class="status-badge badge-processing" style="font-size:11px;">${t.paymentSource}</span></td>
            <td style="font-size:12px; white-space:nowrap;">${t.paymentMethod}</td>
            <td style="font-size:12px;">${t.refundContent}</td>
            <td style="font-size:12px; color:${t.rejectReason !== '-' ? 'var(--color-danger)' : 'var(--text-muted)'};">${t.rejectReason}</td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.createdDate}</td>
            <td style="font-size:12px;">${t.approvedBy}</td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.approvedTime}</td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.rejectedTime}</td>
            <td style="font-size:12px;">${t.createdBy}</td>
            <td style="font-size:12px; white-space:nowrap;">${t.paymentType}</td>
            <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.merchantPayTime}</td>
            <td><span class="status-badge ${t.statusClass}">${t.statusText}</span></td>
          </tr>
        `).join('');
      }
    }

    // Update Refund Counts
    const elTotal = document.getElementById('statRefundTotalCount');
    const elCreated = document.getElementById('statRefundCreatedCount');
    const elProcessing = document.getElementById('statRefundProcessingCount');
    const elApproved = document.getElementById('statRefundApprovedCount');
    const elRejected = document.getElementById('statRefundRejectedCount');
    const elFailed = document.getElementById('statRefundFailedCount');
    const elPaid = document.getElementById('statRefundPaidCount');
    const elSuccess = document.getElementById('statRefundSuccessCount');
    const elPending = document.getElementById('statRefundPendingCount');
    const elDisp = document.getElementById('displayedRefundCount');

    if (elTotal) elTotal.textContent = filtered.length;
    if (elCreated) elCreated.textContent = filtered.filter(t => t.status === 'created').length;
    if (elProcessing) elProcessing.textContent = filtered.filter(t => t.status === 'processing').length;
    if (elApproved) elApproved.textContent = filtered.filter(t => t.status === 'approved').length;
    if (elRejected) elRejected.textContent = filtered.filter(t => t.status === 'rejected').length;
    if (elFailed) elFailed.textContent = filtered.filter(t => t.status === 'failed').length;
    if (elPaid) elPaid.textContent = filtered.filter(t => t.status === 'paid').length;
    if (elSuccess) elSuccess.textContent = filtered.filter(t => t.status === 'success').length;
    if (elPending) elPending.textContent = filtered.filter(t => t.status === 'pending').length;
    if (elDisp) elDisp.textContent = `${filtered.length} / ${allTxns.length}`;

    showToast(`Đã tìm thấy ${filtered.length} giao dịch hoàn tiền phù hợp.`);
  };

  /**
   * Enterprise Screen Tab Switcher (UC-DN-007)
   */
  window.switchEntTab = function(tabName) {
    document.querySelectorAll('.ent-tab-btn').forEach(b => b.classList.remove('active'));
    if (tabName === 'info') {
      document.querySelectorAll('.ent-tab-btn')[0].classList.add('active');
      document.getElementById('entTabInfoContainer').style.display = 'block';
      document.getElementById('entTabHistoryContainer').style.display = 'none';
    } else {
      document.querySelectorAll('.ent-tab-btn')[1].classList.add('active');
      document.getElementById('entTabInfoContainer').style.display = 'none';
      document.getElementById('entTabHistoryContainer').style.display = 'block';
    }
  };

  /**
   * Modal Yêu cầu điều chỉnh thông tin (UC-DN-006)
   */
  window.openRequestAdjustModal = function() {
    document.getElementById('modalTitleText').textContent = '✍️ Yêu Cầu Điều Chỉnh Thông Tin Doanh Nghiệp';
    document.getElementById('modalBodyContent').innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div>
          <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Nội dung yêu cầu điều chỉnh * (10 - 500 ký tự):</label>
          <textarea id="reqContentInput" rows="4" placeholder="Mô tả chi tiết thông tin bạn muốn Finviet cập nhật (ví dụ: cập nhật người đại diện, địa chỉ trụ sở...)" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border-color); font-family:inherit; margin-top:4px;"></textarea>
        </div>
        <div>
          <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Tài liệu đính kèm minh chứng (PDF, JPG, PNG - tối đa 5MB):</label>
          <input type="file" id="reqFileInput" style="margin-top:6px;">
        </div>
        <div id="reqErrorAlert" class="error-text-alert"></div>
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Gửi Yêu Cầu';

    btnAction.onclick = function() {
      const content = document.getElementById('reqContentInput').value.trim();
      if (content.length < 10 || content.length > 500) {
        const alertEl = document.getElementById('reqErrorAlert');
        alertEl.textContent = '⚠️ Vui lòng nhập nội dung yêu cầu điều chỉnh (từ 10 - 500 ký tự).';
        alertEl.style.display = 'block';
        return;
      }

      document.getElementById('modalOverlay').classList.remove('show');
      showToast('Yêu cầu điều chỉnh đã được gửi thành công. Mã yêu cầu: REQ-20260820-0088. Finviet sẽ liên hệ trong thời gian sớm nhất.');
    };

    document.getElementById('modalOverlay').classList.add('show');
  };

  /**
   * Modal Windows Logic & Validation Rules (UC-DB-005)
   */
  function setupModals() {
    window.openTxnModal = function(txnId) {
      const txns = MockData.getRecentTransactions('all');
      const t = txns.find(item => item.id === txnId) || {
        id: txnId,
        time: '18/08/2026 15:32:08',
        store: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        payer: 'Nguyễn Văn Minh (0909****88)',
        method: 'VietQR Pay',
        methodColor: '#00C853',
        device: 'EDC Terminal DEV-8821',
        amount: 120000,
        status: 'success'
      };

      const modalBody = document.getElementById('modalBodyContent');
      document.getElementById('modalTitleText').textContent = i18n.t('modalTxnDetailTitle');

      modalBody.innerHTML = `
        <div class="detail-row"><span class="detail-label">${i18n.t('colTxnId')}:</span><span class="detail-val txn-code">${t.id}</span></div>
        <div class="detail-row"><span class="detail-label">${i18n.t('colTime')}:</span><span class="detail-val">${t.time}</span></div>
        <div class="detail-row"><span class="detail-label">Cửa hàng:</span><span class="detail-val">${t.store}</span></div>
        <div class="detail-row"><span class="detail-label">Khách hàng:</span><span class="detail-val">${t.payer}</span></div>
        <div class="detail-row"><span class="detail-label">${i18n.t('colMethod')}:</span><span class="detail-val" style="color:${t.methodColor}; font-weight:800;">${t.method}</span></div>
        <div class="detail-row"><span class="detail-label">Thiết bị:</span><span class="detail-val">${t.device}</span></div>
        <div class="detail-row"><span class="detail-label">${i18n.t('colAmount')}:</span><span class="detail-val" style="font-size:16px; color:var(--color-primary);">${t.amount.toLocaleString('vi-VN')} đ</span></div>
        <div class="detail-row"><span class="detail-label">${i18n.t('colStatus')}:</span><span class="detail-val"><span class="status-badge badge-${t.status}">${i18n.t('status' + t.status.charAt(0).toUpperCase() + t.status.slice(1))}</span></span></div>
      `;

      document.getElementById('btnFooterAction').style.display = 'none';
      document.getElementById('modalOverlay').classList.add('show');
    };

    window.openSettingsModal = function() {
      document.getElementById('modalTitleText').textContent = i18n.t('modalSettingsTitle');
      document.getElementById('modalBodyContent').innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Tên người dùng:</label>
            <input type="text" value="Phạm Văn Minh" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border-color); font-family:inherit; margin-top:4px;">
          </div>
          <div>
            <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Email liên hệ:</label>
            <input type="text" value="minh.pham@finviet.com.vn" disabled style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border-color); background:var(--bg-app); font-family:inherit; margin-top:4px;">
          </div>
        </div>
      `;
      document.getElementById('btnFooterAction').style.display = 'inline-block';
      document.getElementById('btnFooterAction').textContent = 'Lưu thay đổi';
      document.getElementById('modalOverlay').classList.add('show');
    };

    function openCustomDateModal() {
      document.getElementById('modalTitleText').textContent = i18n.t('selectDateRange');
      document.getElementById('modalBodyContent').innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div>
            <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Ngày bắt đầu (Start Date) *:</label>
            <input type="date" id="startDateInput" value="${AppState.startDate}" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border-color); font-family:inherit; margin-top:4px;">
          </div>
          <div>
            <label style="font-size:13px; font-weight:700; color:var(--text-muted);">Ngày kết thúc (End Date) *:</label>
            <input type="date" id="endDateInput" value="${AppState.endDate}" style="width:100%; padding:10px; border-radius:6px; border:1px solid var(--border-color); font-family:inherit; margin-top:4px;">
          </div>
          <div id="dateErrorAlert" class="error-text-alert"></div>
        </div>
      `;

      const btnAction = document.getElementById('btnFooterAction');
      btnAction.style.display = 'inline-block';
      btnAction.textContent = i18n.t('applyFilter');

      btnAction.onclick = function() {
        const startVal = document.getElementById('startDateInput').value;
        const endVal = document.getElementById('endDateInput').value;

        if (!startVal || !endVal) {
          showDateError(i18n.t('errDateRequired'));
          return;
        }

        const startDate = new Date(startVal);
        const endDate = new Date(endVal);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (startDate > endDate) {
          showDateError(i18n.t('errStartAfterEnd'));
          return;
        }

        if (endDate > today) {
          showDateError(i18n.t('errEndAfterCurrent'));
          return;
        }

        const diffDays = Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 365) {
          showDateError(i18n.t('errMax365Days'));
          return;
        }

        AppState.startDate = startVal;
        AppState.endDate = endVal;
        AppState.currentPeriod = 'custom';

        const displayStart = formatDateVN(startDate);
        const displayEnd = formatDateVN(endDate);

        closeModal();
        renderDashboardData();
        showToast(`Đã lọc dữ liệu từ ${displayStart} đến ${displayEnd}`);
      };

      document.getElementById('modalOverlay').classList.add('show');
    }

    function showDateError(msg) {
      const alertEl = document.getElementById('dateErrorAlert');
      if (alertEl) {
        alertEl.textContent = `⚠️ ${msg}`;
        alertEl.style.display = 'block';
      }
    }

    document.getElementById('btnCloseModal')?.addEventListener('click', closeModal);
    document.getElementById('btnFooterClose')?.addEventListener('click', closeModal);
    document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') closeModal();
    });

    function closeModal() {
      document.getElementById('modalOverlay').classList.remove('show');
    }
  }

  function formatDateVN(dateObj) {
    return `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
  }

  function formatShortVnd(amount) {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(2) + ' Tỷ';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' Tr';
    if (amount >= 1000) return (amount / 1000).toFixed(0) + ' K';
    return amount.toLocaleString('vi-VN') + ' đ';
  }

  function updateLastUpdatedTime() {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} ${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
    const el = document.querySelector('.merchant-subtitle');
    if (el) el.textContent = `Cập nhật lúc: ${timeStr} 🔄`;
  }

  window.showToast = function(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  /**
   * Modal Tạo Link Thanh Toán ngoài Màn hình Tổng Quan (Dashboard Overview)
   */
  window.openCreatePaylinkModalOverview = function() {
    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = '➕ Tạo Link Thanh Toán (Yêu Cầu Thanh Toán)';

    if (modalBody) {
      const autoOrderCode = 'DH20260821' + Math.floor(1000 + Math.random() * 9000);
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:14px;">
          <!-- Thông tin đơn hàng & thanh toán -->
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="form-group-field">
              <label>Mã đơn hàng *</label>
              <input type="text" id="plModalOrderCode" value="${autoOrderCode}" placeholder="VD: DH123456">
            </div>
            <div class="form-group-field">
              <label>Số tiền (VNĐ) *</label>
              <input type="number" id="plModalAmount" placeholder="VD: 250000">
            </div>
          </div>

          <!-- Thời gian hết hạn -->
          <div class="form-group-field">
            <label>Thời gian hết hạn *</label>
            <select id="plModalExpiryType" onchange="toggleCustomExpiryFields(this.value)">
              <option value="DEFAULT">Mặc định (24 giờ kể từ lúc khởi tạo)</option>
              <option value="CUSTOM">Tùy chỉnh (Chọn ngày và giờ cụ thể)</option>
            </select>
          </div>

          <!-- Field Ngày và Giờ (Show khi chọn Tùy chỉnh) -->
          <div id="customExpiryFieldsContainer" style="display:none; grid-template-columns: 1fr 1fr; gap:12px; background:var(--bg-app); padding:12px; border-radius:8px; border:1px solid var(--border-color);">
            <div class="form-group-field">
              <label>Ngày hết hạn *</label>
              <input type="date" id="plModalExpiryDate" value="2026-08-22">
            </div>
            <div class="form-group-field">
              <label>Giờ hết hạn *</label>
              <input type="time" id="plModalExpiryTime" value="23:59">
            </div>
          </div>

          <!-- Mô tả -->
          <div class="form-group-field">
            <label>Mô tả nội dung thanh toán</label>
            <textarea id="plModalDescription" rows="2" placeholder="Nhập ghi chú hoặc mô tả dịch vụ / sản phẩm..." style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-family:inherit; resize:vertical;"></textarea>
          </div>

          <!-- Block Thông tin khách hàng -->
          <div style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:4px;">
            <h4 style="font-size:14px; font-weight:700; color:var(--text-main); margin-bottom:10px;">👤 Thông Tin Khách Hàng</h4>
            
            <div class="form-group-field" style="margin-bottom:12px;">
              <label>Thông báo qua *</label>
              <select id="plModalNotifyVia">
                <option value="BOTH">Tất cả (Email & SMS)</option>
                <option value="EMAIL">Email</option>
                <option value="SMS">SMS</option>
              </select>
            </div>

            <div class="form-group-field" style="margin-bottom:12px;">
              <label>Họ và tên khách hàng *</label>
              <input type="text" id="plModalCustomerName" placeholder="VD: Nguyễn Văn A">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div class="form-group-field">
                <label>Email *</label>
                <input type="email" id="plModalCustomerEmail" placeholder="VD: vana@gmail.com">
              </div>
              <div class="form-group-field">
                <label>Số điện thoại *</label>
                <input type="tel" id="plModalCustomerPhone" placeholder="VD: 0912345678">
              </div>
            </div>
          </div>

          <div id="plModalErrorAlert" class="error-text-alert"></div>
        </div>
      `;
    }

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Tạo Link Thanh Toán';
      btnAction.onclick = function() {
        const orderCode = document.getElementById('plModalOrderCode').value.trim();
        const amount = parseFloat(document.getElementById('plModalAmount').value);
        const name = document.getElementById('plModalCustomerName').value.trim();
        const email = document.getElementById('plModalCustomerEmail').value.trim();
        const phone = document.getElementById('plModalCustomerPhone').value.trim();
        const expiryType = document.getElementById('plModalExpiryType').value;

        if (!orderCode) {
          showError('Vui lòng nhập Mã đơn hàng.');
          return;
        }
        if (isNaN(amount) || amount <= 0) {
          showError('Vui lòng nhập Số tiền thanh toán hợp lệ.');
          return;
        }
        if (!name) {
          showError('Vui lòng nhập Họ và tên khách hàng.');
          return;
        }
        if (!email || !email.includes('@')) {
          showError('Vui lòng nhập Email hợp lệ.');
          return;
        }
        if (!phone || !/^0[0-9]{9}$/.test(phone)) {
          showError('Vui lòng nhập Số điện thoại 10 chữ số hợp lệ.');
          return;
        }

        if (expiryType === 'CUSTOM') {
          const d = document.getElementById('plModalExpiryDate').value;
          const t = document.getElementById('plModalExpiryTime').value;
          if (!d || !t) {
            showError('Vui lòng chọn Ngày và Giờ hết hạn tùy chỉnh.');
            return;
          }
        }

        const desc = document.getElementById('plModalDescription')?.value || '';
        const expiryText = expiryType === 'CUSTOM' ? 
          `${document.getElementById('plModalExpiryDate').value} ${document.getElementById('plModalExpiryTime').value}` : '24 giờ (Mặc định)';

        showToast(`Tạo Link thanh toán thành công! Mã đơn: ${orderCode}`);
        setTimeout(() => {
          showQrCodeResultModal({
            orderCode: orderCode,
            amount: amount,
            customerName: name,
            email: email,
            phone: phone,
            expiryText: expiryText,
            description: desc
          });
        }, 200);
      };
    }

    function showError(msg) {
      const alertEl = document.getElementById('plModalErrorAlert');
      if (alertEl) {
        alertEl.textContent = `⚠️ ${msg}`;
        alertEl.style.display = 'block';
      }
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
  };

  window.toggleCustomExpiryFields = function(val) {
    const container = document.getElementById('customExpiryFieldsContainer');
    if (container) {
      container.style.display = val === 'CUSTOM' ? 'grid' : 'none';
    }
  };

  /**
   * Popup hiển thị Kết quả tạo Mã VietQR Code & Link Thanh Toán
   */
  window.showQrCodeResultModal = function(orderData) {
    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = 'Khởi Tạo Mã VietQR & Link Thanh Toán Thành Công';

    const amountStr = orderData.amount ? orderData.amount.toLocaleString('vi-VN') + ' VNĐ' : '0 VNĐ';
    const qrImageUrl = `https://api.vietqr.io/image/970422-990123884920-compact2.png?amount=${orderData.amount || 0}&addInfo=${encodeURIComponent(orderData.orderCode || 'DH123456')}`;
    const paylinkUrl = `https://ecopay.finviet.com.vn/paylink/${orderData.orderCode || 'DH123456'}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:16px; padding:6px 0;">
          <!-- Banner QR Code -->
          <div style="background: linear-gradient(135deg, #0A66C2 0%, #00C853 100%); padding: 18px; border-radius:16px; box-shadow: 0 8px 24px rgba(10,102,194,0.25); display:flex; flex-direction:column; align-items:center; gap:10px; width:100%; max-width:320px;">
            <div style="background:#FFF; padding:12px; border-radius:12px; display:inline-block;">
              <img src="${qrImageUrl}" alt="VietQR Code" style="width:220px; height:220px; object-fit:contain; display:block;" onerror="this.src='https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paylinkUrl)}'">
            </div>
            <div style="color:#FFF; font-weight:800; font-size:18px;">${amountStr}</div>
            <div style="color:rgba(255,255,255,0.9); font-size:12.5px; font-family:monospace;">Mã đơn hàng: ${orderData.orderCode}</div>
          </div>

          <!-- Chi tiết đơn hàng -->
          <div style="width:100%; background:var(--bg-app); padding:14px; border-radius:10px; border:1px solid var(--border-color); text-align:left; font-size:13px; display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Khách hàng:</span><strong>${orderData.customerName || 'Chưa cập nhật'}</strong></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Số điện thoại:</span><span style="font-family:monospace;">${orderData.phone || 'N/A'}</span></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Email:</span><span>${orderData.email || 'N/A'}</span></div>
            <div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Hạn thanh toán:</span><strong style="color:var(--color-primary);">${orderData.expiryText || '24 giờ'}</strong></div>
            ${orderData.description ? `<div style="display:flex; justify-content:space-between;"><span style="color:var(--text-muted);">Mô tả:</span><span>${orderData.description}</span></div>` : ''}
          </div>

          <!-- Đường dẫn Payment Link & Sao chép -->
          <div style="width:100%; display:flex; gap:8px; align-items:center;">
            <input type="text" value="${paylinkUrl}" readonly style="flex:1; padding:10px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:12.5px; font-family:monospace; background:#FFF;">
            <button class="btn-primary" style="white-space:nowrap; padding:10px 16px;" onclick="navigator.clipboard.writeText('${paylinkUrl}'); showToast('Đã sao chép link thanh toán vào bộ nhớ tạm!');">Sao chép Link</button>
          </div>
        </div>
      `;
    }

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Tải Ảnh QR Code';
      btnAction.onclick = function() {
        showToast('Đang tải ảnh VietQR Code về máy...');
        setTimeout(() => {
          showToast('Tải ảnh QR Code thành công!');
        }, 800);
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
  };
});
