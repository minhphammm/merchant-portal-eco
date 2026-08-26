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

  // Global Icon Refresh helper using Lucide Icons
  window.refreshIcons = function() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  };

  // Smart Topbar Scroll Behavior:
  // Cố định ở top, khi scroll xuống qua khỏi screen đầu tiên (1st screen) thì biến mất, scroll lên mới hiện trở lại
  let lastScrollY = window.scrollY || document.documentElement.scrollTop;

  window.addEventListener('scroll', function() {
    const topbar = document.querySelector('.topbar');
    if (!topbar) return;

    const currentScrollY = window.scrollY || document.documentElement.scrollTop;
    const firstScreenHeight = window.innerHeight;

    // Khi ở vùng top gần đầu trang (<= 80px), luôn giữ hiển thị topbar
    if (currentScrollY <= 80) {
      topbar.classList.remove('topbar-hidden');
      lastScrollY = currentScrollY;
      return;
    }

    // Khi cuộn xuống qua khỏi screen đầu tiên -> Ẩn topbar
    if (currentScrollY > lastScrollY && currentScrollY > (firstScreenHeight * 0.4)) {
      topbar.classList.add('topbar-hidden');
    }
    // Khi cuộn ngược lên -> Hiện lại topbar lập tức
    else if (currentScrollY < lastScrollY) {
      topbar.classList.remove('topbar-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });

  // Global Ant Design Custom Select Component Enhancer
  window.initAntdSelects = function(container = document) {
    const nativeSelects = container.querySelectorAll('select:not(.ant-select-enhanced)');
    nativeSelects.forEach(select => {
      select.classList.add('ant-select-enhanced');
      select.style.display = 'none';

      // Create Custom Ant Design Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'ant-select-custom-wrapper';

      const selectedOption = select.options[select.selectedIndex] || select.options[0];
      const selectedText = selectedOption ? selectedOption.text : '';

      wrapper.innerHTML = `
        <div class="ant-select-custom-trigger">
          <span class="ant-select-custom-value">${selectedText}</span>
          <span class="ant-select-custom-arrow"><i data-lucide="chevron-down" style="width:14px; height:14px;"></i></span>
        </div>
        <div class="ant-select-custom-dropdown" style="display:none;"></div>
      `;

      const dropdown = wrapper.querySelector('.ant-select-custom-dropdown');
      Array.from(select.options).forEach(opt => {
        const item = document.createElement('div');
        item.className = 'ant-select-custom-option' + (opt.selected ? ' selected' : '');
        item.setAttribute('data-value', opt.value);
        item.innerHTML = `<span>${opt.text}</span>` + (opt.selected ? '<i data-lucide="check" style="width:14px; height:14px; color:#1677ff;"></i>' : '');
        
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));

          // Update trigger label
          wrapper.querySelector('.ant-select-custom-value').innerText = opt.text;

          // Update selected item highlighting
          dropdown.querySelectorAll('.ant-select-custom-option').forEach(el => {
            el.classList.remove('selected');
            const check = el.querySelector('[data-lucide="check"]');
            if (check) check.remove();
          });
          item.classList.add('selected');

          // Close panel
          wrapper.classList.remove('open');
          dropdown.style.display = 'none';

          if (window.refreshIcons) window.refreshIcons();
        });

        dropdown.appendChild(item);
      });

      // Toggle dropdown open
      const trigger = wrapper.querySelector('.ant-select-custom-trigger');
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('open');

        // Close all other open antd selects
        document.querySelectorAll('.ant-select-custom-wrapper.open').forEach(w => {
          if (w !== wrapper) {
            w.classList.remove('open');
            w.querySelector('.ant-select-custom-dropdown').style.display = 'none';
          }
        });

        if (isOpen) {
          wrapper.classList.remove('open');
          dropdown.style.display = 'none';
        } else {
          wrapper.classList.add('open');
          dropdown.style.display = 'block';
        }

        if (window.refreshIcons) window.refreshIcons();
      });

      select.parentNode.insertBefore(wrapper, select);
    });

    if (window.refreshIcons) window.refreshIcons();
  };

  // Close all antd select dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.ant-select-custom-wrapper')) {
      document.querySelectorAll('.ant-select-custom-wrapper.open').forEach(w => {
        w.classList.remove('open');
        const dd = w.querySelector('.ant-select-custom-dropdown');
        if (dd) dd.style.display = 'none';
      });
    }
  });

  // Initialize Dashboard, Icons & Ant Design Selects
  renderDashboard();
  initAntdSelects();
  refreshIcons();

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

    setupToolbarControls();
    renderDashboardData();
  }

  /**
   * Render Dashboard metrics, tables, top stores, and update charts
   */
  function renderDashboardData() {
    // Update active class on time filter buttons
    document.querySelectorAll('.time-btn[data-period]').forEach(btn => {
      if (btn.getAttribute('data-period') === AppState.currentPeriod) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    if (AppState.currentPeriod === 'custom') {
      const customBtn = document.getElementById('btnDateFilter');
      if (customBtn) customBtn.classList.add('active');
    }

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

    const revTitleEl = document.getElementById('kpiRevenueTitleText');
    if (revTitleEl) revTitleEl.textContent = 'Doanh Thu';

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
        const isUp = metrics.failedDelta >= 0;
        failDeltaEl.className = `delta-badge ${isUp ? 'up-green' : 'down-red'}`;
        failDeltaEl.innerHTML = `${isUp ? '▲ +' : '▼ '}${metrics.failedDelta}%`;
      }
    }

    // Update ECO Wallet Balance Card
    const ecoBalEl = document.getElementById('dashEcoWalletBalanceVal');
    if (ecoBalEl && MockData.cashlessState) {
      ecoBalEl.textContent = (MockData.cashlessState.ecoWalletBalance || 350000000).toLocaleString('vi-VN') + ' đ';
    }

    // Update Cashless Available Balance Card
    const cashlessBalEl = document.getElementById('dashAvailableBalanceVal');
    if (cashlessBalEl && MockData.cashlessState) {
      cashlessBalEl.textContent = (MockData.cashlessState.availableBalance || 1245000000).toLocaleString('vi-VN') + ' đ';
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
    if (window.refreshIcons) window.refreshIcons();
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
   * Setup Dashboard Toolbar Controls & Ant Design Dual-Month RangePicker
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

    // Initialize Ant Design Dual-Month RangePicker Component
    setupAntdRangePicker();

    document.querySelectorAll('.time-btn[data-period]:not(#btnDateFilter)').forEach(btn => {
      btn.onclick = function() {
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const period = btn.getAttribute('data-period');
        AppState.currentPeriod = period;

        if (period === 'today') AppState.chartRangeDays = 1;
        else if (period === 'thisWeek') AppState.chartRangeDays = 7;
        else if (period === 'thisMonth') AppState.chartRangeDays = 30;

        renderDashboardData();
        showToast(`Đã lọc dữ liệu theo: ${btn.textContent.trim()}`);
      };
    });
  }

  /**
   * Ant Design Dual-Month RangePicker Component Controller
   */
  function setupAntdRangePicker() {
    const triggerBtn = document.getElementById('btnDateFilter');
    const popover = document.getElementById('antdRangePickerPopover');
    const wrapper = document.getElementById('antdRangePickerWrapper');
    const btnText = document.getElementById('rangePickerBtnText');

    if (!triggerBtn || !popover) return;

    // RangePicker State
    const state = {
      viewYear: 2026,
      viewMonth: 7, // August (0-indexed)
      startDate: new Date(2026, 7, 25),
      endDate: new Date(2026, 7, 25),
      selectingStep: 'start'
    };

    function formatDateStr(d) {
      if (!d) return '';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    }

    function formatTitleStr(year, month) {
      const monthNum = String(month + 1).padStart(2, '0');
      return `Th${monthNum}  ${year}`;
    }

    function isSameDay(d1, d2) {
      if (!d1 || !d2) return false;
      return d1.getFullYear() === d2.getFullYear() &&
             d1.getMonth() === d2.getMonth() &&
             d1.getDate() === d2.getDate();
    }

    function isBetweenDays(target, start, end) {
      if (!target || !start || !end) return false;
      const t = target.getTime();
      const s = Math.min(start.getTime(), end.getTime());
      const e = Math.max(start.getTime(), end.getTime());
      return t > s && t < e;
    }

    function renderCalendars() {
      // Month 1 (current viewMonth)
      const m1Year = state.viewYear;
      const m1Month = state.viewMonth;

      // Month 2 (next month)
      let m2Year = m1Year;
      let m2Month = m1Month + 1;
      if (m2Month > 11) {
        m2Month = 0;
        m2Year += 1;
      }

      const title1 = document.getElementById('calMonth1Title');
      const title2 = document.getElementById('calMonth2Title');
      if (title1) title1.textContent = formatTitleStr(m1Year, m1Month);
      if (title2) title2.textContent = formatTitleStr(m2Year, m2Month);

      const inputStart = document.getElementById('rangeInputStart');
      const inputEnd = document.getElementById('rangeInputEnd');
      if (inputStart) inputStart.value = formatDateStr(state.startDate);
      if (inputEnd) inputEnd.value = formatDateStr(state.endDate);

      renderMonthBody('calBodyMonth1', m1Year, m1Month);
      renderMonthBody('calBodyMonth2', m2Year, m2Month);
    }

    function renderMonthBody(tbodyId, year, month) {
      const tbody = document.getElementById(tbodyId);
      if (!tbody) return;

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      // Day of week offset: Mon=0, Sun=6
      let startDayOfWeek = firstDay.getDay() - 1;
      if (startDayOfWeek === -1) startDayOfWeek = 6;

      const daysInMonth = lastDay.getDate();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      let cells = [];

      // 1. Previous month trailing days
      for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = prevMonthLastDay - i;
        const prevM = month === 0 ? 11 : month - 1;
        const prevY = month === 0 ? year - 1 : year;
        cells.push({ dateObj: new Date(prevY, prevM, d), isCurrent: false });
      }

      // 2. Current month days
      for (let d = 1; d <= daysInMonth; d++) {
        cells.push({ dateObj: new Date(year, month, d), isCurrent: true });
      }

      // 3. Next month leading days
      const totalCellsNeeded = cells.length > 35 ? 42 : 35;
      let nextD = 1;
      while (cells.length < totalCellsNeeded) {
        const nextM = month === 11 ? 0 : month + 1;
        const nextY = month === 11 ? year + 1 : year;
        cells.push({ dateObj: new Date(nextY, nextM, nextD++), isCurrent: false });
      }

      // Build HTML rows (7 days per row)
      let html = '';
      const today = new Date(2026, 7, 25); // Today reference

      for (let r = 0; r < cells.length; r += 7) {
        html += '<tr>';
        for (let c = 0; c < 7; c++) {
          const item = cells[r + c];
          const dObj = item.dateObj;

          let classes = ['cal-day-cell'];
          if (!item.isCurrent) classes.push('day-other-month');
          if (isSameDay(dObj, today)) classes.push('day-today');
          if (isSameDay(dObj, state.startDate)) classes.push('day-selected-start');
          if (isSameDay(dObj, state.endDate)) classes.push('day-selected-end');
          if (isBetweenDays(dObj, state.startDate, state.endDate)) classes.push('day-in-range');

          const timestamp = dObj.getTime();
          html += `<td><div class="${classes.join(' ')}" data-time="${timestamp}">${dObj.getDate()}</div></td>`;
        }
        html += '</tr>';
      }

      tbody.innerHTML = html;

      // Bind day click events
      tbody.querySelectorAll('.cal-day-cell').forEach(cell => {
        cell.onclick = function(e) {
          e.stopPropagation();
          const time = parseInt(cell.getAttribute('data-time'));
          const clickedDate = new Date(time);

          if (state.selectingStep === 'start' || clickedDate < state.startDate) {
            state.startDate = clickedDate;
            state.endDate = clickedDate;
            state.selectingStep = 'end';
          } else {
            state.endDate = clickedDate;
            state.selectingStep = 'start';
          }

          renderCalendars();
        };
      });
    }

    // Toggle Popover
    triggerBtn.onclick = function(e) {
      e.stopPropagation();
      const isOpen = popover.style.display === 'block';

      // Close all other open popovers
      document.querySelectorAll('.antd-rangepicker-popover').forEach(p => p.style.display = 'none');

      if (isOpen) {
        popover.style.display = 'none';
      } else {
        popover.style.display = 'block';
        renderCalendars();
      }
    };

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (wrapper && !wrapper.contains(e.target)) {
        popover.style.display = 'none';
      }
    });

    // Navigation Buttons
    const btnPrevYear = document.getElementById('calPrevYear');
    const btnPrevMonth = document.getElementById('calPrevMonth');
    const btnNextMonth = document.getElementById('calNextMonth');
    const btnNextYear = document.getElementById('calNextYear');

    if (btnPrevYear) btnPrevYear.onclick = (e) => { e.stopPropagation(); state.viewYear -= 1; renderCalendars(); };
    if (btnPrevMonth) btnPrevMonth.onclick = (e) => {
      e.stopPropagation();
      state.viewMonth -= 1;
      if (state.viewMonth < 0) { state.viewMonth = 11; state.viewYear -= 1; }
      renderCalendars();
    };
    if (btnNextMonth) btnNextMonth.onclick = (e) => {
      e.stopPropagation();
      state.viewMonth += 1;
      if (state.viewMonth > 11) { state.viewMonth = 0; state.viewYear += 1; }
      renderCalendars();
    };
    if (btnNextYear) btnNextYear.onclick = (e) => { e.stopPropagation(); state.viewYear += 1; renderCalendars(); };

    // Clear Button
    const clearBtn = document.getElementById('rangeClearBtn');
    if (clearBtn) {
      clearBtn.onclick = (e) => {
        e.stopPropagation();
        state.startDate = new Date(2026, 7, 25);
        state.endDate = new Date(2026, 7, 25);
        state.selectingStep = 'start';
        renderCalendars();
      };
    }

    // Presets
    popover.querySelectorAll('.preset-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const preset = btn.getAttribute('data-preset');
        const now = new Date(2026, 7, 25);

        if (preset === 'today') {
          state.startDate = new Date(now);
          state.endDate = new Date(now);
        } else if (preset === 'last7') {
          state.startDate = new Date(2026, 7, 18);
          state.endDate = new Date(now);
        } else if (preset === 'last30') {
          state.startDate = new Date(2026, 6, 25);
          state.endDate = new Date(now);
        } else if (preset === 'thisMonth') {
          state.startDate = new Date(2026, 7, 1);
          state.endDate = new Date(now);
        }

        renderCalendars();
      };
    });

    // Apply Button
    const applyBtn = document.getElementById('btnApplyRangePicker');
    if (applyBtn) {
      applyBtn.onclick = (e) => {
        e.stopPropagation();
        const startStr = formatDateStr(state.startDate);
        const endStr = formatDateStr(state.endDate);

        AppState.startDate = startStr;
        AppState.endDate = endStr;
        AppState.currentPeriod = 'custom';

        if (btnText) btnText.textContent = `${startStr} → ${endStr}`;
        triggerBtn.classList.add('has-value');

        popover.style.display = 'none';

        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        triggerBtn.classList.add('active');

        renderDashboardData();
        showToast(`🎉 Đã áp dụng khoảng thời gian: ${startStr} → ${endStr}`);
      };
    }

    renderCalendars();
  }

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

  // Global Document Preview Modal Controller
  let currentDocZoom = 1.0;

  window.zoomDocPreview = function(delta) {
    currentDocZoom = Math.min(Math.max(0.6, currentDocZoom + delta), 1.8);
    const canvas = document.getElementById('docSheetCanvas');
    if (canvas) {
      canvas.style.transform = `scale(${currentDocZoom})`;
    }
  };

  window.openDocPreviewModal = function(docTitle = 'Hồ sơ tài liệu pháp lý') {
    currentDocZoom = 1.0;
    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = `Xem Trước Hồ Sơ: ${docTitle}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:0;">
          <!-- Toolbar -->
          <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:#F1F5F9; border:1px solid var(--border-color); border-radius:8px 8px 0 0;">
            <div style="display:flex; align-items:center; gap:8px; font-weight:700; font-size:13px; color:var(--text-main);">
              <i data-lucide="file-text" style="width:16px; height:16px; color:var(--color-primary);"></i>
              <span>${docTitle}</span>
              <span class="status-badge badge-success" style="font-size:11px; padding:2px 8px;">✔ Verified System</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <button class="btn-secondary" style="font-size:12px; padding:4px 10px;" onclick="zoomDocPreview(0.15)" title="Phóng to">🔍 +</button>
              <button class="btn-secondary" style="font-size:12px; padding:4px 10px;" onclick="zoomDocPreview(-0.15)" title="Thu nhỏ">🔍 -</button>
              <button class="btn-primary" style="font-size:12px; padding:4px 12px;" onclick="showToast('🎉 Tải xuống file PDF thành công!')">📥 Tải File PDF</button>
            </div>
          </div>

          <!-- Document Viewer Paper Canvas -->
          <div style="background:#334155; padding:20px; display:flex; justify-content:center; overflow:auto; max-height:500px; border:1px solid var(--border-color); border-top:none; border-radius:0 0 8px 8px;">
            <div id="docSheetCanvas" style="width:520px; min-height:620px; background:#FFFFFF; padding:32px; border-radius:4px; box-shadow:0 10px 25px rgba(0,0,0,0.3); font-family:'Plus Jakarta Sans', serif; color:#0F172A; transform-origin:top center; transition:transform 0.2s ease; text-align:left;">
              <div style="text-align:center; border-bottom:2px solid #0F172A; padding-bottom:12px; margin-bottom:16px;">
                <div style="font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div style="font-size:10px; font-weight:600; margin-bottom:6px;">Độc lập - Tự do - Hạnh phúc</div>
                <div style="width:100px; height:1px; background:#0F172A; margin:0 auto 10px auto;"></div>
                <h2 style="font-size:15px; font-weight:800; color:#0A66C2; margin-top:8px; text-transform:uppercase;">${docTitle.toUpperCase()}</h2>
                <div style="font-size:11px; color:#64748B;">Mã lưu trữ chứng thực: ECO-DOC-2026-99128</div>
              </div>

              <div style="display:flex; flex-direction:column; gap:10px; font-size:12px; line-height:1.6;">
                <div><strong>Tên Doanh Nghiệp:</strong> CÔNG TY TNHH GF CAPITAL VIỆT NAM</div>
                <div><strong>Mã Số Doanh Nghiệp / MST:</strong> 0101234567</div>
                <div><strong>Địa Chỉ Trụ Sở Chính:</strong> Tầng 12, Tòa nhà Bitexco Financial Tower, Số 2 Hải Triều, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</div>
                <div><strong>Người Đại Diện Theo Pháp Luật:</strong> NGUYỄN VĂN A (Chức danh: Giám đốc)</div>
                <div><strong>Vốn Điều Lệ:</strong> 810,000,000,000 VNĐ (Tám trăm mười tỷ đồng)</div>
                <div><strong>Ngày Đăng Ký Lần Đầu:</strong> 15/03/2022</div>
                <div><strong>Ghi Chú Đơn Vị Thẩm Định:</strong> Hồ sơ đã được kiểm duyệt, mã hóa dữ liệu bảo mật SSL và lưu trữ trên hệ sinh thái Ecopay FinViet.</div>
              </div>

              <!-- Stamp & QR Section -->
              <div style="margin-top:32px; display:flex; justify-content:space-between; align-items:flex-end;">
                <div style="text-align:center;">
                  <div style="font-size:10px; color:#64748B;">Mã QR Mã Hóa</div>
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://finviet.com.vn/verify/ECO-DOC-2026-99128" style="width:70px; height:70px; margin-top:4px; border:1px solid #CBD5E1; padding:2px;">
                </div>

                <div style="text-align:center; position:relative;">
                  <div style="font-size:10.5px; font-weight:700;">TP.Hồ Chí Minh, Ngày 20 tháng 08 năm 2026</div>
                  <div style="font-size:11px; font-weight:800; margin-top:4px;">CƠ QUAN PHÊ DUYỆT / SYSTEM VERIFIED</div>
                  
                  <div style="margin-top:8px; display:inline-block; border:3px double #EF4444; color:#EF4444; font-weight:900; font-size:10px; padding:6px 12px; border-radius:50%; transform:rotate(-12deg); text-transform:uppercase; box-shadow:0 0 0 2px rgba(239,68,68,0.2);">
                    ★ ECOPAY FINVIET ★<br>ĐÃ XÁC THỰC<br>VERIFIED DOC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (btnAction) {
      btnAction.style.display = 'none';
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

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

  // =========================================================================
  // In-line Field Error Validation Helpers
  // =========================================================================
  window.clearFieldErrors = function(containerId) {
    const container = containerId ? (document.getElementById(containerId) || document) : document;
    container.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    container.querySelectorAll('.field-error-msg').forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
  };

  window.setFieldError = function(fieldId, errorMsg) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    field.classList.add('has-error');

    let errDiv = document.getElementById(`err_${fieldId}`);
    if (!errDiv) {
      errDiv = document.createElement('div');
      errDiv.id = `err_${fieldId}`;
      errDiv.className = 'field-error-msg';
      if (field.parentNode) {
        field.parentNode.appendChild(errDiv);
      }
    }

    errDiv.innerHTML = `⚠️ ${errorMsg}`;
    errDiv.style.display = 'flex';
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
      </div>
    `;

    const btnAction = document.getElementById('btnFooterAction');
    btnAction.style.display = 'inline-block';
    btnAction.textContent = 'Phát Hành Link';

    btnAction.onclick = function() {
      clearFieldErrors('modalBodyContent');

      const name = document.getElementById('plCreateCustomerName')?.value.trim();
      const phone = document.getElementById('plCreatePhone')?.value.trim();
      const email = document.getElementById('plCreateEmail')?.value.trim();
      const orderCode = document.getElementById('plCreateOrderCode')?.value.trim();
      const amount = parseFloat(document.getElementById('plCreateAmount')?.value);

      let hasError = false;

      if (!name) {
        setFieldError('plCreateCustomerName', 'Vui lòng nhập Họ và tên khách hàng.');
        hasError = true;
      }
      if (!phone || !/^0[0-9]{9}$/.test(phone)) {
        setFieldError('plCreatePhone', 'Số điện thoại không hợp lệ (bắt buộc 10 chữ số, bắt đầu từ 0).');
        if (!hasError) { document.getElementById('plCreatePhone')?.focus(); hasError = true; }
      }
      if (!email || !email.includes('@')) {
        setFieldError('plCreateEmail', 'Email khách hàng không đúng định dạng (VD: name@domain.com).');
        if (!hasError) { document.getElementById('plCreateEmail')?.focus(); hasError = true; }
      }
      if (!orderCode) {
        setFieldError('plCreateOrderCode', 'Vui lòng nhập Mã đơn hàng DN.');
        if (!hasError) { document.getElementById('plCreateOrderCode')?.focus(); hasError = true; }
      }
      if (isNaN(amount) || amount < 1000 || amount > 1000000000) {
        setFieldError('plCreateAmount', 'Số tiền phải nằm trong khoảng từ 1.000 VNĐ đến 100.000.000 VNĐ (BR-001).');
        if (!hasError) { document.getElementById('plCreateAmount')?.focus(); hasError = true; }
      }

      if (hasError) return;

      const description = name || 'Yêu cầu thanh toán đơn lẻ';
      showToast(`Tạo Yêu cầu thanh toán thành công! Mã đơn: ${orderCode}.`);
      ViewRenderer.renderPage('pay-requests');
      setTimeout(() => {
        showQrCodeResultModal({
          orderCode: orderCode,
          amount: amount,
          customerName: name,
          phone: phone,
          email: email,
          expiryText: '00 ngày 02:00',
          description: 'Thanh toán đơn hàng đơn lẻ'
        });
      }, 200);
    };

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
      if (isHidden && window.initAntdSelects) {
        window.initAntdSelects(extraDiv);
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
      if (isHidden && window.initAntdSelects) {
        window.initAntdSelects(extraDiv);
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
        </div>
      `;
    }

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Tạo Link Thanh Toán';
      btnAction.onclick = function() {
        clearFieldErrors('modalBodyContent');

        const orderCode = document.getElementById('plModalOrderCode')?.value.trim();
        const amount = parseFloat(document.getElementById('plModalAmount')?.value);
        const name = document.getElementById('plModalCustomerName')?.value.trim();
        const email = document.getElementById('plModalCustomerEmail')?.value.trim();
        const phone = document.getElementById('plModalCustomerPhone')?.value.trim();
        const expiryType = document.getElementById('plModalExpiryType')?.value;

        let hasError = false;

        if (!orderCode) {
          setFieldError('plModalOrderCode', 'Vui lòng nhập Mã đơn hàng.');
          hasError = true;
        }
        if (isNaN(amount) || amount <= 0) {
          setFieldError('plModalAmount', 'Vui lòng nhập Số tiền thanh toán hợp lệ (> 0 VNĐ).');
          if (!hasError) { document.getElementById('plModalAmount')?.focus(); hasError = true; }
        }
        if (!name) {
          setFieldError('plModalCustomerName', 'Vui lòng nhập Họ và tên khách hàng.');
          if (!hasError) { document.getElementById('plModalCustomerName')?.focus(); hasError = true; }
        }
        if (!email || !email.includes('@')) {
          setFieldError('plModalCustomerEmail', 'Vui lòng nhập Email khách hàng hợp lệ (VD: name@domain.com).');
          if (!hasError) { document.getElementById('plModalCustomerEmail')?.focus(); hasError = true; }
        }
        if (!phone || !/^0[0-9]{9}$/.test(phone)) {
          setFieldError('plModalCustomerPhone', 'Vui lòng nhập Số điện thoại 10 chữ số hợp lệ (bắt đầu 0).');
          if (!hasError) { document.getElementById('plModalCustomerPhone')?.focus(); hasError = true; }
        }

        if (expiryType === 'CUSTOM') {
          const d = document.getElementById('plModalExpiryDate')?.value;
          const t = document.getElementById('plModalExpiryTime')?.value;
          if (!d) {
            setFieldError('plModalExpiryDate', 'Vui lòng chọn Ngày hết hạn.');
            if (!hasError) { document.getElementById('plModalExpiryDate')?.focus(); hasError = true; }
          }
          if (!t) {
            setFieldError('plModalExpiryTime', 'Vui lòng chọn Giờ hết hạn.');
            if (!hasError) { document.getElementById('plModalExpiryTime')?.focus(); hasError = true; }
          }
        }

        if (hasError) return;

        const desc = document.getElementById('plModalDescription')?.value || '';
        const expiryText = expiryType === 'CUSTOM' ? 
          `${document.getElementById('plModalExpiryDate').value} ${document.getElementById('plModalExpiryTime').value}` : '24 giờ (Mặc định)';

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

  /**
   * Generates exact HTML layout as requested in user screenshots for Tùy chỉnh modals
   */
  function getReconcileCustomDetailViewHTML(item) {
    const storeName = item.storeName || 'Kamura';
    const paymentMethod = item.paymentMethod || 'Quẹt thẻ';
    const createdTime = item.reconcileCreatedTime || item.paymentCreatedTime || '24-08-2026 16:00:52';
    const approvedTime = item.partnerApprovedTime || '24-08-2026 16:01:29';
    const totalPayable = item.totalPayable || '8.126.948,03 đ';
    const txnFee = item.txnFee || '172.571,974 đ';
    const statusText = item.statusText || 'Từ chối';

    return `
      <div class="reconcile-custom-detail-view" style="display:flex; flex-direction:column; gap:20px; font-family:inherit; text-align:left;">
        
        <!-- 1. THÔNG TIN THANH TOÁN CARD -->
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; padding:18px; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="font-size:15px; font-weight:700; color:#1E293B; margin-bottom:16px;">Thông tin thanh toán</div>
          
          <!-- Thông tin doanh nghiệp -->
          <div style="margin-bottom:16px;">
            <div style="font-size:13.5px; font-weight:700; color:#334155; margin-bottom:10px;">Thông tin doanh nghiệp</div>
            <div style="display:flex; flex-wrap:wrap; align-items:center; gap:24px; font-size:13px;">
              <div>
                <span style="color:#64748B;">Mã doanh nghiệp:</span> 
                <span style="background:#f6ffed; border:1px solid #b7eb8f; color:#52c41a; font-weight:700; padding:2px 8px; border-radius:4px; font-size:12px; margin-left:4px;">GFCAPITAL</span>
              </div>
              <div>
                <span style="color:#64748B;">Tên doanh nghiệp:</span> 
                <span style="background:#F8FAFC; border:1px solid #E2E8F0; padding:3px 10px; border-radius:4px; font-weight:600; color:#1E293B; margin-left:4px;">Công ty TNHH GF Capital Việt Nam</span>
              </div>
              <div>
                <span style="color:#64748B;">Phương thức thanh toán:</span> 
                <span style="background:#e6f7ff; border:1px solid #91d5ff; color:#1890ff; font-weight:600; padding:2px 8px; border-radius:4px; font-size:12px; margin-left:4px;">${paymentMethod}</span>
              </div>
            </div>
          </div>

          <hr style="border:0; border-top:1px solid #F1F5F9; margin:14px 0;">

          <!-- Thông tin cửa hàng -->
          <div>
            <div style="font-size:13.5px; font-weight:700; color:#334155; margin-bottom:12px;">Thông tin cửa hàng</div>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px 24px; font-size:12.5px; color:#334155;">
              <div><span style="color:#64748B;">Mã cửa hàng:</span> <strong>GFCAPITAL5</strong></div>
              <div><span style="color:#64748B;">Tên cửa hàng:</span> <strong>${storeName}</strong></div>
              <div><span style="color:#64748B;">Ví ECO:</span> <span>-</span></div>

              <div><span style="color:#64748B;">Tên chủ tài khoản:</span> <strong>DDKD CT TNHH GF CAPITAL (VIET NAM)</strong></div>
              <div><span style="color:#64748B;">Số tài khoản:</span> <strong style="font-family:monospace;">1038834115</strong></div>
              <div><span style="color:#64748B;">Ngân hàng:</span> <strong>Vietcombank</strong></div>

              <div><span style="color:#64748B;">Chi nhánh:</span> <strong>Hồ Chí Minh</strong></div>
              <div><span style="color:#64748B;">Mã sao kê:</span> <span>-</span></div>
            </div>
          </div>
        </div>

        <!-- 2. LƯỚI 24 Ô CHỈ SỐ TÀI CHÍNH (4 Columns Grid) -->
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:1px; background:#CBD5E1; border:1px solid #CBD5E1; border-radius:8px; overflow:hidden;">
          
          <!-- Row 1 -->
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Thời gian thanh toán được tạo</div>
            <div style="font-size:11px; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:4px; color:#334155;">${createdTime}</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Thời gian thanh toán được duyệt</div>
            <div style="font-size:11px; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:4px; color:#334155;">${approvedTime}</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Thời gian từ chối duyệt thanh toán</div>
            <div style="font-size:11px; background:#F8FAFC; border:1px solid #E2E8F0; padding:2px 6px; border-radius:4px; display:inline-block; margin-top:4px; color:#334155;">${approvedTime}</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Tổng số giao dịch</div>
            <div style="font-size:13px; font-weight:800; color:#1E293B; margin-top:4px;">11</div>
          </div>

          <!-- Row 2 -->
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Tổng số tiền giao dịch gốc</div>
            <div style="font-size:13.5px; font-weight:800; color:#52C41A; margin-top:4px;">8.299.520 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Tổng số tiền đơn hàng</div>
            <div style="font-size:13.5px; font-weight:800; color:#52C41A; margin-top:4px;">8.299.520 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Tổng số tiền hoàn</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí người dùng</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>

          <!-- Row 3 -->
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí hoàn</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí giao dịch</div>
            <div style="font-size:13.5px; font-weight:800; color:#FF4D4F; margin-top:4px;">${txnFee}</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí trả sau áp dụng cho doanh nghiệp</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí dịch vụ trả sau áp dụng cho doanh nghiệp</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>

          <!-- Row 4 -->
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí trả sau áp dụng cho người dùng</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí dịch vụ trả sau áp dụng cho người dùng</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí BNPL áp dụng cho doanh nghiệp</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí BNPL áp dụng cho người dùng</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>

          <!-- Row 5 -->
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí dịch vụ BNPL áp dụng cho người dùng</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Số tiền hoàn cấn trừ</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí hoàn cấn trừ</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Tổng số tiền phải trả</div>
            <div style="font-size:14px; font-weight:800; color:#52C41A; margin-top:4px;">${totalPayable}</div>
          </div>

          <!-- Row 6 -->
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Tổng số tiền khuyến mãi</div>
            <div style="font-size:13px; font-weight:700; color:#FF4D4F; margin-top:4px;">0 đ</div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Trạng thái</div>
            <div style="margin-top:4px;"><span style="background:#fff2f0; border:1px solid #ffccc7; color:#ff4d4f; font-weight:700; font-size:11px; padding:2px 8px; border-radius:4px;">${statusText}</span></div>
          </div>
          <div style="background:#fff; padding:12px 8px; text-align:center; grid-column: span 2;">
            <div style="font-size:11.5px; font-weight:700; color:#475569;">Phí bổ sung</div>
            <div style="font-size:13px; color:#64748B; margin-top:4px;">-</div>
          </div>
        </div>

        <!-- Mô tả field -->
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; padding:14px;">
          <div style="font-size:13px; font-weight:700; color:#334155; margin-bottom:6px;">Mô tả</div>
          <input type="text" placeholder="Vui lòng nhập mô tả" value="Vui lòng nhập mô tả" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:12.5px; color:#334155;">
        </div>

        <!-- 3. DANH SÁCH GIAO DỊCH THANH TOÁN (Blue Header Table) -->
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:14px 16px; font-size:14px; font-weight:700; color:#1E293B; border-bottom:1px solid #F1F5F9;">
            Danh sách giao dịch thanh toán
          </div>

          <!-- Filter Bar -->
          <div style="padding:12px 16px; background:#F8FAFC; border-bottom:1px solid #E2E8F0; display:flex; gap:12px; align-items:center; flex-wrap:wrap; font-size:12.5px;">
            <div style="flex:1; min-width:160px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Mã GD ⓘ</label>
              <input type="text" placeholder="Nhập mã giao dịch" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
            </div>
            <div style="flex:1; min-width:180px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Mã đơn hàng DN ⓘ</label>
              <input type="text" placeholder="Vui lòng nhập mã đơn hàng doanh nghiệp" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
            </div>
            <div style="flex:1; min-width:180px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Mã GD của đối tác ⓘ</label>
              <input type="text" placeholder="Nhập mã giao dịch của đối tác" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
            </div>
            <div style="display:flex; gap:8px; align-self:flex-end;">
              <button class="btn-secondary" style="padding:6px 12px; font-size:12px;" onclick="showToast('Đã làm lại bộ lọc giao dịch thanh toán')">Làm lại</button>
              <button class="btn-primary" style="padding:6px 14px; font-size:12px;" onclick="showToast('Đã lọc danh sách giao dịch thanh toán')">Tìm kiếm</button>
              <span style="color:#1890ff; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:2px; margin-left:4px;">Mở rộng ∨</span>
            </div>
          </div>

          <!-- Blue Header Data Table -->
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="background:#4B86CF; color:#FFF; font-weight:700;">
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">STT</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã GD ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã đơn hàng DN ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã đối soát với đối tác</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã GD của đối tác ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên doanh nghiệp</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã doanh nghiệp</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên khách hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Số điện thoại/Tài khoản khách hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên cửa hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã cửa hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 12px;">1</td>
                  <td style="padding:10px 12px; font-family:monospace; font-weight:600; color:#1E293B;">7391421483599660</td>
                  <td style="padding:10px 12px; font-family:monospace; font-size:11.5px;">GFCAPITAL5_KMR20260822_0011_Tqr9yzBoZF</td>
                  <td style="padding:10px 12px; font-family:monospace;">EP623499DD34A</td>
                  <td style="padding:10px 12px; font-family:monospace; font-size:11.5px;">20260822163701_1493707797</td>
                  <td style="padding:10px 12px;">Công ty TNHH GF Capital Việt Nam</td>
                  <td style="padding:10px 12px; font-weight:700;">GFCAPITAL</td>
                  <td style="padding:10px 12px;">-</td>
                  <td style="padding:10px 12px; font-family:monospace;">458761******9295</td>
                  <td style="padding:10px 12px; font-weight:600;">${storeName}</td>
                  <td style="padding:10px 12px; font-weight:600;">GFCAPITAL5</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0; background:#F8FAFC;">
                  <td style="padding:10px 12px;">2</td>
                  <td style="padding:10px 12px; font-family:monospace; font-weight:600; color:#1E293B;">7391128709700648</td>
                  <td style="padding:10px 12px; font-family:monospace; font-size:11.5px;">GFCAPITAL5_KMR20260822_0012_TZAgpZTQMa</td>
                  <td style="padding:10px 12px; font-family:monospace;">EP62348F600FE</td>
                  <td style="padding:10px 12px; font-family:monospace; font-size:11.5px;">20260822163208_1493707797</td>
                  <td style="padding:10px 12px;">Công ty TNHH GF Capital Việt Nam</td>
                  <td style="padding:10px 12px; font-weight:700;">GFCAPITAL</td>
                  <td style="padding:10px 12px;">-</td>
                  <td style="padding:10px 12px; font-family:monospace;">444418******7116</td>
                  <td style="padding:10px 12px; font-weight:600;">${storeName}</td>
                  <td style="padding:10px 12px; font-weight:600;">GFCAPITAL5</td>
                </tr>
                <tr style="border-bottom:1px solid #E2E8F0;">
                  <td style="padding:10px 12px;">3</td>
                  <td style="padding:10px 12px; font-family:monospace; font-weight:600; color:#1E293B;">7388824517216825</td>
                  <td style="padding:10px 12px; font-family:monospace; font-size:11.5px;">GFCAPITAL5_KMR20260822_0010_THDk0JRolX</td>
                  <td style="padding:10px 12px; font-family:monospace;">EP62341D3C10E</td>
                  <td style="padding:10px 12px; font-family:monospace; font-size:11.5px;">20260822155344_1493707797</td>
                  <td style="padding:10px 12px;">Công ty TNHH GF Capital Việt Nam</td>
                  <td style="padding:10px 12px; font-weight:700;">GFCAPITAL</td>
                  <td style="padding:10px 12px;">-</td>
                  <td style="padding:10px 12px; font-family:monospace;">532750******3293</td>
                  <td style="padding:10px 12px; font-weight:600;">${storeName}</td>
                  <td style="padding:10px 12px; font-weight:600;">GFCAPITAL5</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 4. DANH SÁCH GIAO DỊCH BỔ SUNG ⓘ -->
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:14px 16px; font-size:14px; font-weight:700; color:#1E293B; border-bottom:1px solid #F1F5F9; display:flex; align-items:center; gap:4px;">
            Danh sách giao dịch bổ sung <span style="color:#64748B; font-weight:400; font-size:12px;">ⓘ</span>
          </div>

          <!-- Filter Bar -->
          <div style="padding:12px 16px; background:#F8FAFC; border-bottom:1px solid #E2E8F0; display:flex; gap:12px; align-items:center; flex-wrap:wrap; font-size:12.5px;">
            <div style="flex:1; min-width:140px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Mã GD ⓘ</label>
              <input type="text" placeholder="Nhập mã giao dịch" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
            </div>
            <div style="flex:1; min-width:160px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Mã đơn hàng DN ⓘ</label>
              <input type="text" placeholder="Vui lòng nhập mã đơn hàng doanh nghiệp" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
            </div>
            <div style="flex:1; min-width:160px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Mã GD của đối tác ⓘ</label>
              <input type="text" placeholder="Nhập mã giao dịch của đối tác" style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
            </div>
            <div style="flex:1; min-width:160px;">
              <label style="font-size:11.5px; color:#64748B; display:block; margin-bottom:2px;">Phương thức thanh toán</label>
              <select style="width:100%; padding:6px 10px; border-radius:4px; border:1px solid #CBD5E1;">
                <option value="">Vui lòng chọn</option>
              </select>
            </div>
            <div style="display:flex; gap:8px; align-self:flex-end;">
              <button class="btn-secondary" style="padding:6px 12px; font-size:12px;">Làm lại</button>
              <button class="btn-primary" style="padding:6px 14px; font-size:12px;">Tìm kiếm</button>
              <span style="color:#1890ff; font-size:12px; cursor:pointer; display:flex; align-items:center; gap:2px; margin-left:4px;">Thu gọn ∧</span>
            </div>
          </div>

          <!-- Empty Table -->
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="background:#4B86CF; color:#FFF; font-weight:700;">
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">STT</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã GD ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã đơn hàng DN ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã đối soát với đối tác</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã GD của đối tác ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên doanh nghiệp</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã doanh nghiệp</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên khách hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Số điện thoại/Tài khoản khách hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên cửa hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã cửa hàng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="11" style="padding:30px; text-align:center; color:#94A3B8;">
                    <div style="font-size:28px; margin-bottom:6px;">📥</div>
                    <div>Trống</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. DANH SÁCH GIAO DỊCH HOÀN CÓ CẤN TRỪ -->
        <div style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <div style="padding:14px 16px; font-size:14px; font-weight:700; color:#1E293B; border-bottom:1px solid #F1F5F9; display:flex; justify-content:space-between; align-items:center;">
            <span>Danh sách giao dịch hoàn có cấn trừ</span>
            <div style="display:flex; gap:10px; color:#64748B; font-size:14px; cursor:pointer;">
              <span>🔄</span> <span>⚙️</span> <span>⛶</span>
            </div>
          </div>

          <!-- Empty Table -->
          <div style="overflow-x:auto;">
            <table style="width:100%; border-collapse:collapse; font-size:12px; text-align:left;">
              <thead>
                <tr style="background:#4B86CF; color:#FFF; font-weight:700;">
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">STT</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã hoàn tiền</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã GD gốc ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã đối soát hoàn tiền với đối tác</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã GD gốc của đối tác ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên khách hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">SĐT/TK GD ⓘ</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Số tiền hoàn</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên cửa hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Mã cửa hàng</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Tên doanh nghiệp</th>
                  <th style="padding:10px 12px; border:1px solid #3B74BD; white-space:nowrap;">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="12" style="padding:30px; text-align:center; color:#94A3B8;">
                    <div style="font-size:28px; margin-bottom:6px;">📥</div>
                    <div>Trống</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;
  }

  /**
   * Modal Tùy Chỉnh - Hiển thị Chi Tiết Giao Dịch Đối Soát Ecopay
   */
  window.openReconcileDetailModal = function(stt) {
    const list = MockData.getReconcileEcopayData ? MockData.getReconcileEcopayData() : [];
    const item = list.find(r => r.stt === stt) || list[0];
    if (!item) return;

    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = `Chi Tiết Giao Dịch Đối Soát Ecopay — ${item.storeName}`;
    if (modalBody) modalBody.innerHTML = getReconcileCustomDetailViewHTML(item);

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Phê Duyệt Thanh Toán';
      btnAction.onclick = function() {
        showToast(`Đã phê duyệt thanh toán đối soát cho ${item.storeName}`);
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  /**
   * Modal Tùy Chỉnh - Hiển thị Chi Tiết GD Quyết Toán v2
   */
  window.openReconcileV2DetailModal = function(stt) {
    const list = MockData.getReconcileV2Data ? MockData.getReconcileV2Data() : [];
    const item = list.find(r => r.stt === stt) || list[0];
    if (!item) return;

    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = `Chi Tiết GD Quyết Toán v2 — ${item.paymentId || item.storeName}`;
    if (modalBody) modalBody.innerHTML = getReconcileCustomDetailViewHTML(item);

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Xác Nhận Giải Ngân';
      btnAction.onclick = function() {
        showToast(`Đã xác nhận giải ngân thành công mã thanh toán ${item.paymentId || item.storeName}`);
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  /**
   * Modal Tùy Chỉnh - Hiển thị Chi Tiết & Cấu Hình Cửa Hàng (Quản trị cửa hàng - PRD UC-3 Specs)
   */
  window.switchStoreModalTab = function(tabName) {
    const tabBasic = document.getElementById('storeTabBasicContent');
    const tabAgent = document.getElementById('storeTabAgentContent');
    const btnBasic = document.getElementById('btnStoreTabBasic');
    const btnAgent = document.getElementById('btnStoreTabAgent');

    if (tabName === 'basic') {
      if (tabBasic) tabBasic.style.display = 'block';
      if (tabAgent) tabAgent.style.display = 'none';
      if (btnBasic) { btnBasic.style.borderBottom = '2px solid var(--color-primary)'; btnBasic.style.color = 'var(--color-primary)'; btnBasic.style.fontWeight = '700'; }
      if (btnAgent) { btnAgent.style.borderBottom = 'none'; btnAgent.style.color = 'var(--text-muted)'; btnAgent.style.fontWeight = '600'; }
    } else {
      if (tabBasic) tabBasic.style.display = 'none';
      if (tabAgent) tabAgent.style.display = 'block';
      if (btnBasic) { btnBasic.style.borderBottom = 'none'; btnBasic.style.color = 'var(--text-muted)'; btnBasic.style.fontWeight = '600'; }
      if (btnAgent) { btnAgent.style.borderBottom = '2px solid var(--color-primary)'; btnAgent.style.color = 'var(--color-primary)'; btnAgent.style.fontWeight = '700'; }
    }
  };

  window.handleEditProvinceChange = function(provinceVal) {
    const wardSelect = document.getElementById('editStoreWard');
    if (!wardSelect) return;
    
    if (!provinceVal) {
      wardSelect.innerHTML = '<option value="">Vui lòng tìm và chọn phường/xã</option>';
      return;
    }

    if (provinceVal === 'HCM') {
      wardSelect.innerHTML = `
        <option value="BenThanh" selected>Phường Bến Thành (Quận 1)</option>
        <option value="BenNghe">Phường Bến Nghé (Quận 1)</option>
        <option value="Phuong6Q3">Phường 6 (Quận 3)</option>
        <option value="Phuong11Q10">Phường 11 (Quận 10)</option>
      `;
    } else if (provinceVal === 'HN') {
      wardSelect.innerHTML = `
        <option value="HangBac" selected>Phường Hàng Bạc (Q. Hoàn Kiếm)</option>
        <option value="TrangTien">Phường Tràng Tiền (Q. Hoàn Kiếm)</option>
        <option value="KimLien">Phường Kim Liên (Q. Đống Đa)</option>
      `;
    } else if (provinceVal === 'DN') {
      wardSelect.innerHTML = `
        <option value="HaiChau1" selected>Phường Hải Châu 1 (Q. Hải Châu)</option>
        <option value="PhuocNinh">Phường Phước Ninh (Q. Hải Châu)</option>
      `;
    } else {
      wardSelect.innerHTML = `
        <option value="TanAn" selected>Phường Tân An (Q. Ninh Kiều)</option>
        <option value="AnCu">Phường An Cư (Q. Ninh Kiều)</option>
      `;
    }
  };

  window.openStoreDetailModal = function(stt) {
    const list = MockData.getStoresData ? MockData.getStoresData() : [];
    const item = list.find(r => r.stt === stt) || list[0];
    if (!item) return;

    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = `Tùy Chỉnh & Cấu Hình Cửa Hàng — ${item.storeName}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px; text-align:left; font-size:13px;">
          <!-- TAB SWITCHER NAVIGATION (PRD UC-3 Specs) -->
          <div style="display:flex; gap:20px; border-bottom:1px solid var(--border-color); padding-bottom:2px;">
            <button id="btnStoreTabBasic" style="background:none; border:none; padding:8px 12px; cursor:pointer; font-size:13.5px; border-bottom:2px solid var(--color-primary); color:var(--color-primary); font-weight:700;" onclick="switchStoreModalTab('basic')">🏪 Thông Tin Cơ Bản Cửa Hàng</button>
            <button id="btnStoreTabAgent" style="background:none; border:none; padding:8px 12px; cursor:pointer; font-size:13.5px; color:var(--text-muted); font-weight:600;" onclick="switchStoreModalTab('agent')">🏦 Cấu Hình Agent Banking: Mật Khẩu & Két Ca</button>
          </div>

          <!-- TAB 1: THÔNG TIN CƠ BẢN CỬA HÀNG -->
          <div id="storeTabBasicContent" style="display:block;">
            <div style="background:var(--bg-app); border:1px solid var(--border-color); padding:16px; border-radius:10px; display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
              <div class="form-group-field" style="grid-column: 1 / -1;">
                <label style="font-weight:700;">Tên doanh nghiệp *</label>
                <input type="text" id="editStoreEnterprise" value="Công ty TNHH GF Capital Việt Nam" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px; background:#F1F5F9; color:#475569; cursor:not-allowed;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Mã cửa hàng</label>
                <input type="text" id="editStoreCode" value="${item.storeCode}" readonly style="background:#F1F5F9; font-weight:700; color:var(--color-primary); cursor:not-allowed;">
              </div>
              <div class="form-group-field" style="grid-column: 1 / -1;">
                <label style="font-weight:700;">Tên cửa hàng *</label>
                <input type="text" id="editStoreName" value="${item.storeName}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Số điện thoại quản lý cửa hàng</label>
                <input type="text" id="editStorePhone" value="${item.storePhone}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Tỉnh / Thành phố *</label>
                <select id="editStoreProvince" onchange="handleEditProvinceChange(this.value)" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
                  <option value="HCM" selected>Thành phố Hồ Chí Minh</option>
                  <option value="HN">Thành phố Hà Nội</option>
                  <option value="DN">Thành phố Đà Nẵng</option>
                  <option value="CT">Thành phố Cần Thơ</option>
                </select>
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Phường / Xã *</label>
                <select id="editStoreWard" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
                  <option value="BenThanh" selected>Phường Bến Thành (Quận 1)</option>
                  <option value="BenNghe">Phường Bến Nghé (Quận 1)</option>
                  <option value="Phuong6Q3">Phường 6 (Quận 3)</option>
                </select>
              </div>
              <div class="form-group-field" style="grid-column: 1 / -1;">
                <label style="font-weight:700;">Địa chỉ chi tiết *</label>
                <input type="text" id="editStoreAddress" value="${item.address}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Mã định danh QR code</label>
                <input type="text" id="editStoreQr" value="${item.qrIdentifierCode}" style="font-family:monospace; width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Mã thiết bị POS/EDC</label>
                <input type="text" id="editStoreDevice" value="${item.deviceCode}" style="font-family:monospace; width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Loại hình kinh doanh</label>
                <input type="text" id="editStoreBizType" value="${item.businessType}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Hình thức thanh toán</label>
                <input type="text" id="editStorePayMethod" value="${item.paymentMethodType}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Tài khoản thanh toán</label>
                <input type="text" id="editStorePayAccount" value="${item.paymentAccount}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Số ví ECO</label>
                <input type="text" id="editStoreEcoWallet" value="${item.ecoWalletNumber}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Số điện thoại sale phụ trách</label>
                <input type="text" id="editStoreSalesPhone" value="${item.salesPhone}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
              <div class="form-group-field">
                <label style="font-weight:700;">Phương thức đối soát</label>
                <input type="text" id="editStoreReconcileMethod" value="${item.reconciliationMethod}" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
              </div>
            </div>
          </div>

          <!-- TAB 2: CẤU HÌNH AGENT BANKING: MẬT KHẨU & KÉT CA (PRD UC-3 Specs) -->
          <div id="storeTabAgentContent" style="display:none;">
            <div style="display:flex; flex-direction:column; gap:16px;">
              <!-- 1. Mật khẩu cửa hàng -->
              <div style="background:#FFF; border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                <div style="font-size:14px; font-weight:700; color:var(--text-main); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
                  <i data-lucide="lock" style="width:16px; height:16px; color:var(--color-primary);"></i> Mật Khẩu Cửa Hàng (Mật khẩu 6 số dùng các tính năng bảo mật)
                </div>
                <div style="display:flex; align-items:center; gap:14px;">
                  <input type="password" value="123456" maxlength="6" style="width:180px; text-align:center; letter-spacing:4px; font-size:16px; font-weight:800; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color);">
                  <span style="font-size:12px; color:var(--text-muted);">Mật khẩu 6 số bắt buộc khi cửa hàng thực hiện tính năng Agent Banking</span>
                </div>
              </div>

              <!-- 2. Cấu hình Phiên hoạt động (Két ca) -->
              <div style="background:#FFF; border:1px solid var(--border-color); padding:16px; border-radius:10px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                  <div style="font-size:14px; font-weight:700; color:var(--text-main); display:flex; align-items:center; gap:6px;">
                    <i data-lucide="clock" style="width:16px; height:16px; color:var(--color-primary);"></i> Cấu Hình Phiên Hoạt Động Két Ca (Tối đa 3 phiên)
                  </div>
                  <button type="button" class="btn-secondary" style="padding:4px 10px; font-size:12px;" onclick="showToast('Đã thêm 1 phiên hoạt động mới (Tối đa 3 phiên)')">+ Thêm phiên hoạt động</button>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px;">
                  <!-- Phiên 1 -->
                  <div style="display:flex; align-items:center; gap:12px; background:var(--bg-app); padding:10px 14px; border-radius:6px; border:1px solid var(--border-color);">
                    <strong style="width:70px;">Phiên 1:</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Bắt đầu:</span>
                    <input type="time" value="08:00" style="padding:4px 8px; border-radius:4px; border:1px solid var(--border-color);">
                    <span style="font-size:12px; color:var(--text-muted);">— Kết thúc:</span>
                    <input type="time" value="12:00" style="padding:4px 8px; border-radius:4px; border:1px solid var(--border-color);">
                    <span class="status-badge badge-success" style="margin-left:auto;">Đang hoạt động</span>
                  </div>

                  <!-- Phiên 2 -->
                  <div style="display:flex; align-items:center; gap:12px; background:var(--bg-app); padding:10px 14px; border-radius:6px; border:1px solid var(--border-color);">
                    <strong style="width:70px;">Phiên 2:</strong>
                    <span style="font-size:12px; color:var(--text-muted);">Bắt đầu:</span>
                    <input type="time" value="13:00" style="padding:4px 8px; border-radius:4px; border:1px solid var(--border-color);">
                    <span style="font-size:12px; color:var(--text-muted);">— Kết thúc:</span>
                    <input type="time" value="18:00" style="padding:4px 8px; border-radius:4px; border:1px solid var(--border-color);">
                    <span class="status-badge badge-success" style="margin-left:auto;">Đang hoạt động</span>
                  </div>
                </div>

                <div style="font-size:11.5px; color:var(--text-muted); margin-top:10px; line-height:1.5;">
                  ⚠️ <em>Business Rule (BR1 & BR2): Thời gian các phiên không được chồng chéo (kè nhau) và bắt buộc nhập đầy đủ Giờ bắt đầu - Giờ kết thúc.</em>
                </div>
              </div>

              <!-- 3. Ca làm việc trên App -->
              <div style="background:#FFF; border:1px solid var(--border-color); padding:16px; border-radius:10px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-main);">Ca làm việc trên App di động</div>
                  <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Cho phép nhân viên điểm danh & khởi tạo ca làm việc trên App Agent Banking</div>
                </div>
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="status-badge badge-success">BẬT (ON)</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Lưu Cập Nhật Thông Tin & Cấu Hình';
      btnAction.onclick = function() {
        const newName = document.getElementById('editStoreName')?.value?.trim();
        const newPhone = document.getElementById('editStorePhone')?.value?.trim();
        const newAddress = document.getElementById('editStoreAddress')?.value?.trim();
        const newQr = document.getElementById('editStoreQr')?.value?.trim();
        const newDevice = document.getElementById('editStoreDevice')?.value?.trim();
        const newBizType = document.getElementById('editStoreBizType')?.value?.trim();
        const newPayMethod = document.getElementById('editStorePayMethod')?.value?.trim();
        const newPayAccount = document.getElementById('editStorePayAccount')?.value?.trim();
        const newEcoWallet = document.getElementById('editStoreEcoWallet')?.value?.trim();
        const newSalesPhone = document.getElementById('editStoreSalesPhone')?.value?.trim();
        const newReconcileMethod = document.getElementById('editStoreReconcileMethod')?.value?.trim();

        if (newName) item.storeName = newName;
        if (newPhone) item.storePhone = newPhone;
        if (newAddress) item.address = newAddress;
        if (newQr) item.qrIdentifierCode = newQr;
        if (newDevice) item.deviceCode = newDevice;
        if (newBizType) item.businessType = newBizType;
        if (newPayMethod) item.paymentMethodType = newPayMethod;
        if (newPayAccount) item.paymentAccount = newPayAccount;
        if (newEcoWallet) item.ecoWalletNumber = newEcoWallet;
        if (newSalesPhone) item.salesPhone = newSalesPhone;
        if (newReconcileMethod) item.reconciliationMethod = newReconcileMethod;

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');

        showToast(`🎉 Đã lưu cập nhật thông tin cửa hàng "${item.storeName}" thành công!`);
        if (window.renderPage) window.renderPage('stores');
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  /**
   * Modal Tạo Mới Cửa Hàng - Chuẩn PRD UC-3 Specs (Màn hình tạo cửa hàng)
   */
  window.handleProvinceChange = function(provinceVal) {
    const wardSelect = document.getElementById('createStoreWard');
    if (!wardSelect) return;
    
    if (!provinceVal) {
      wardSelect.innerHTML = '<option value="">Vui lòng tìm và chọn phường/xã</option>';
      wardSelect.disabled = true;
      return;
    }

    wardSelect.disabled = false;
    if (provinceVal === 'HCM') {
      wardSelect.innerHTML = `
        <option value="">Vui lòng tìm và chọn phường/xã</option>
        <option value="BenThanh" selected>Phường Bến Thành (Quận 1)</option>
        <option value="BenNghe">Phường Bến Nghé (Quận 1)</option>
        <option value="Phuong6Q3">Phường 6 (Quận 3)</option>
        <option value="Phuong11Q10">Phường 11 (Quận 10)</option>
      `;
    } else if (provinceVal === 'HN') {
      wardSelect.innerHTML = `
        <option value="">Vui lòng tìm và chọn phường/xã</option>
        <option value="HangBac" selected>Phường Hàng Bạc (Q. Hoàn Kiếm)</option>
        <option value="TrangTien">Phường Tràng Tiền (Q. Hoàn Kiếm)</option>
        <option value="KimLien">Phường Kim Liên (Q. Đống Đa)</option>
      `;
    } else if (provinceVal === 'DN') {
      wardSelect.innerHTML = `
        <option value="">Vui lòng tìm và chọn phường/xã</option>
        <option value="HaiChau1" selected>Phường Hải Châu 1 (Q. Hải Châu)</option>
        <option value="PhuocNinh">Phường Phước Ninh (Q. Hải Châu)</option>
      `;
    } else {
      wardSelect.innerHTML = `
        <option value="">Vui lòng tìm và chọn phường/xã</option>
        <option value="TanAn" selected>Phường Tân An (Q. Ninh Kiều)</option>
        <option value="AnCu">Phường An Cư (Q. Ninh Kiều)</option>
      `;
    }
  };

  window.openCreateStoreModal = function() {
    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = 'Tạo mới cửa hàng';

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px; text-align:left; font-size:13px;">
          <!-- Form Fields Grid -->
          <div style="background:var(--bg-app); border:1px solid var(--border-color); padding:18px; border-radius:10px; display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
            <div class="form-group-field" style="grid-column: 1 / -1;">
              <label style="font-weight:700;">Tên doanh nghiệp <span style="color:#FF4D4F;">*</span></label>
              <input type="text" id="createStoreEnterprise" value="Công ty TNHH GF Capital Việt Nam" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px; background:#F1F5F9; color:#475569; cursor:not-allowed;">
            </div>

            <div class="form-group-field">
              <label style="font-weight:700;">Tên cửa hàng <span style="color:#FF4D4F;">*</span></label>
              <input type="text" id="createStoreName" placeholder="Vui lòng nhập tên cửa hàng" maxlength="200" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
            </div>

            <div class="form-group-field">
              <label style="font-weight:700;">Số điện thoại quản lý</label>
              <input type="text" id="createStoreManagerPhone" placeholder="Vui lòng nhập số điện thoại" maxlength="11" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
            </div>

            <div class="form-group-field">
              <label style="font-weight:700;">Tỉnh / Thành phố <span style="color:#FF4D4F;">*</span></label>
              <select id="createStoreProvince" onchange="handleProvinceChange(this.value)" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
                <option value="">Vui lòng tìm và chọn tỉnh/thành phố</option>
                <option value="HCM">Thành phố Hồ Chí Minh</option>
                <option value="HN">Thành phố Hà Nội</option>
                <option value="DN">Thành phố Đà Nẵng</option>
                <option value="CT">Thành phố Cần Thơ</option>
              </select>
            </div>

            <div class="form-group-field">
              <label style="font-weight:700;">Phường / Xã <span style="color:#FF4D4F;">*</span></label>
              <select id="createStoreWard" disabled style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
                <option value="">Vui lòng tìm và chọn phường/xã</option>
              </select>
            </div>

            <div class="form-group-field" style="grid-column: 1 / -1;">
              <label style="font-weight:700;">Địa chỉ chi tiết <span style="color:#FF4D4F;">*</span></label>
              <input type="text" id="createStoreAddress" placeholder="VD: tên tòa nhà, số nhà, tên đường" maxlength="200" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:13px;">
            </div>
          </div>
        </div>
      `;
    }

    if (btnAction) {
      btnAction.style.display = 'inline-block';
      btnAction.textContent = 'Tạo mới';
      btnAction.onclick = function() {
        const enterprise = document.getElementById('createStoreEnterprise')?.value;
        const storeName = document.getElementById('createStoreName')?.value?.trim();
        const managerPhone = document.getElementById('createStoreManagerPhone')?.value?.trim() || '0903 123 456';
        const province = document.getElementById('createStoreProvince')?.value;
        const ward = document.getElementById('createStoreWard')?.value;
        const address = document.getElementById('createStoreAddress')?.value?.trim();

        if (!enterprise) {
          showToast('⚠️ Vui lòng chọn Tên doanh nghiệp!');
          return;
        }
        if (!storeName) {
          showToast('⚠️ Vui lòng nhập Tên cửa hàng!');
          return;
        }
        if (!province) {
          showToast('⚠️ Vui lòng chọn Tỉnh/Thành phố!');
          return;
        }
        if (!ward) {
          showToast('⚠️ Vui lòng chọn Phường/Xã!');
          return;
        }
        if (!address) {
          showToast('⚠️ Vui lòng nhập Địa chỉ chi tiết!');
          return;
        }

        // Add new store into MockData with status 'Không hoạt động'
        const list = MockData.getStoresData();
        const newStt = list.length + 1;
        const storeCodeNum = (newStt < 10 ? '00' : '0') + newStt;
        const now = new Date();
        const dateStr = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN');

        const newStoreItem = {
          stt: newStt,
          storeName: storeName,
          storeCode: `ST-NEW-${storeCodeNum}`,
          qrIdentifierCode: `QR-GFCAPITAL5-N${newStt}`,
          deviceCode: `EDC-POS-900${newStt}`,
          businessType: 'Nhà hàng & F&B',
          storePhone: managerPhone,
          paymentMethodType: 'VietQR / Thẻ ATM / QR Bank',
          paymentAccount: '1905 8888 9999 (Techcombank)',
          address: address,
          ecoWalletNumber: managerPhone.replace(/\s+/g, ''),
          salesPhone: '0988 777 666 (Nguyễn Văn Nam)',
          createdDate: dateStr,
          approvedDate: '—',
          reconciliationMethod: 'T+1 Tự động (MB Bank)',
          statusText: 'Không hoạt động',
          statusClass: 'badge-warning'
        };

        list.unshift(newStoreItem);

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');

        showToast(`🎉 Tạo mới cửa hàng "${storeName}" thành công! Trạng thái: Không hoạt động`);
        if (window.renderPage) window.renderPage('stores');
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  // Interactive Dual-Month Ant Design RangePicker Popover Handler for date-range-input-box
  document.addEventListener('click', function(e) {
    const rangeBox = e.target.closest('.date-range-input-box');
    
    // Close existing global popover if clicked outside
    const existingPopover = document.getElementById('globalAntdRangePickerPopover');
    if (!rangeBox && existingPopover && !e.target.closest('#globalAntdRangePickerPopover')) {
      existingPopover.remove();
      document.querySelectorAll('.date-range-input-box.open').forEach(b => b.classList.remove('open'));
      return;
    }

    if (rangeBox) {
      e.stopPropagation();
      
      const isOpen = rangeBox.classList.contains('open');
      if (existingPopover) existingPopover.remove();
      document.querySelectorAll('.date-range-input-box.open').forEach(b => b.classList.remove('open'));

      if (isOpen) return; // Toggle close

      rangeBox.classList.add('open');

      const startInput = rangeBox.querySelector('input[type="date"]:first-of-type');
      const endInput = rangeBox.querySelector('input[type="date"]:last-of-type');

      const startVal = startInput ? startInput.value : '2025-06-01';
      const endVal = endInput ? endInput.value : '2025-08-22';

      const popover = document.createElement('div');
      popover.id = 'globalAntdRangePickerPopover';
      popover.className = 'antd-rangepicker-popover-global';

      popover.innerHTML = `
        <div class="rangepicker-inputs-bar">
          <input type="text" id="popoverStartDisplay" value="${startVal}" readonly>
          <span class="range-arrow">→</span>
          <input type="text" id="popoverEndDisplay" value="${endVal}" readonly>
          <button type="button" class="range-clear-btn" onclick="clearPopoverRange()" title="Xóa chọn">⨂</button>
        </div>

        <div class="rangepicker-calendars-container">
          <!-- Month 1: Th08 2025 -->
          <div class="calendar-month-panel">
            <div class="calendar-header">
              <div>
                <button type="button" class="cal-nav-btn" title="Năm trước">«</button>
                <button type="button" class="cal-nav-btn" title="Tháng trước">‹</button>
              </div>
              <span class="cal-title">Th08 2025</span>
              <div></div>
            </div>
            <table class="calendar-table">
              <thead><tr><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th><th>T7</th><th>CN</th></tr></thead>
              <tbody>
                <tr><td class="calendar-day-cell muted">28</td><td class="calendar-day-cell muted">29</td><td class="calendar-day-cell muted">30</td><td class="calendar-day-cell muted">31</td><td class="calendar-day-cell normal">1</td><td class="calendar-day-cell normal">2</td><td class="calendar-day-cell normal">3</td></tr>
                <tr><td class="calendar-day-cell normal">4</td><td class="calendar-day-cell normal">5</td><td class="calendar-day-cell normal">6</td><td class="calendar-day-cell normal">7</td><td class="calendar-day-cell selected-start">8</td><td class="calendar-day-cell in-range">9</td><td class="calendar-day-cell in-range">10</td></tr>
                <tr><td class="calendar-day-cell in-range">11</td><td class="calendar-day-cell in-range">12</td><td class="calendar-day-cell in-range">13</td><td class="calendar-day-cell in-range">14</td><td class="calendar-day-cell in-range">15</td><td class="calendar-day-cell in-range">16</td><td class="calendar-day-cell in-range">17</td></tr>
                <tr><td class="calendar-day-cell in-range">18</td><td class="calendar-day-cell in-range">19</td><td class="calendar-day-cell in-range">20</td><td class="calendar-day-cell in-range">21</td><td class="calendar-day-cell selected-end">22</td><td class="calendar-day-cell normal">23</td><td class="calendar-day-cell normal">24</td></tr>
                <tr><td class="calendar-day-cell normal">25</td><td class="calendar-day-cell normal">26</td><td class="calendar-day-cell normal">27</td><td class="calendar-day-cell normal">28</td><td class="calendar-day-cell normal">29</td><td class="calendar-day-cell normal">30</td><td class="calendar-day-cell normal">31</td></tr>
              </tbody>
            </table>
          </div>

          <!-- Month 2: Th09 2025 -->
          <div class="calendar-month-panel">
            <div class="calendar-header">
              <div></div>
              <span class="cal-title">Th09 2025</span>
              <div>
                <button type="button" class="cal-nav-btn" title="Tháng sau">›</button>
                <button type="button" class="cal-nav-btn" title="Năm sau">»</button>
              </div>
            </div>
            <table class="calendar-table">
              <thead><tr><th>T2</th><th>T3</th><th>T4</th><th>T5</th><th>T6</th><th>T7</th><th>CN</th></tr></thead>
              <tbody>
                <tr><td class="calendar-day-cell normal">1</td><td class="calendar-day-cell normal">2</td><td class="calendar-day-cell normal">3</td><td class="calendar-day-cell normal">4</td><td class="calendar-day-cell normal">5</td><td class="calendar-day-cell normal">6</td><td class="calendar-day-cell normal">7</td></tr>
                <tr><td class="calendar-day-cell normal">8</td><td class="calendar-day-cell normal">9</td><td class="calendar-day-cell normal">10</td><td class="calendar-day-cell normal">11</td><td class="calendar-day-cell normal">12</td><td class="calendar-day-cell normal">13</td><td class="calendar-day-cell normal">14</td></tr>
                <tr><td class="calendar-day-cell normal">15</td><td class="calendar-day-cell normal">16</td><td class="calendar-day-cell normal">17</td><td class="calendar-day-cell normal">18</td><td class="calendar-day-cell normal">19</td><td class="calendar-day-cell normal">20</td><td class="calendar-day-cell normal">21</td></tr>
                <tr><td class="calendar-day-cell normal">22</td><td class="calendar-day-cell normal">23</td><td class="calendar-day-cell normal">24</td><td class="calendar-day-cell normal">25</td><td class="calendar-day-cell normal">26</td><td class="calendar-day-cell normal">27</td><td class="calendar-day-cell normal">28</td></tr>
                <tr><td class="calendar-day-cell normal">29</td><td class="calendar-day-cell normal">30</td><td class="calendar-day-cell muted">1</td><td class="calendar-day-cell muted">2</td><td class="calendar-day-cell muted">3</td><td class="calendar-day-cell muted">4</td><td class="calendar-day-cell muted">5</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="rangepicker-footer">
          <div class="preset-links">
            <button type="button" class="preset-btn" onclick="applyPresetRange('today')">Hôm nay</button>
            <button type="button" class="preset-btn" onclick="applyPresetRange('last7')">7 ngày qua</button>
            <button type="button" class="preset-btn" onclick="applyPresetRange('last30')">30 ngày qua</button>
            <button type="button" class="preset-btn" onclick="applyPresetRange('thisMonth')">Tháng này</button>
          </div>
          <button type="button" class="btn-primary" style="padding:5px 16px; font-weight:700; font-size:12.5px;" onclick="applyPopoverDateRange()">Áp Dụng</button>
        </div>
      `;

      document.body.appendChild(popover);

      // Position popover relative to rangeBox
      const rect = rangeBox.getBoundingClientRect();
      const popoverWidth = 580;
      let left = rect.left + window.scrollX;
      if (left + popoverWidth > window.innerWidth - 20) {
        left = window.innerWidth - popoverWidth - 20;
      }
      if (left < 10) left = 10;

      popover.style.left = left + 'px';
      popover.style.top = (rect.bottom + window.scrollY + 6) + 'px';

      window.clearPopoverRange = function() {
        document.getElementById('popoverStartDisplay').value = '';
        document.getElementById('popoverEndDisplay').value = '';
      };

      window.applyPresetRange = function(preset) {
        if (startInput && endInput) {
          if (preset === 'today') {
            startInput.value = '2025-08-25'; endInput.value = '2025-08-25';
          } else if (preset === 'last7') {
            startInput.value = '2025-08-18'; endInput.value = '2025-08-25';
          } else if (preset === 'last30') {
            startInput.value = '2025-07-25'; endInput.value = '2025-08-25';
          } else if (preset === 'thisMonth') {
            startInput.value = '2025-08-01'; endInput.value = '2025-08-25';
          }
        }
        popover.remove();
        rangeBox.classList.remove('open');
        showToast('📅 Đã chọn khoảng thời gian đối soát (Tối đa 3 tháng)');
      };

      window.applyPopoverDateRange = function() {
        popover.remove();
        rangeBox.classList.remove('open');
        showToast('📅 Đã áp dụng khoảng thời gian (Tối đa 3 tháng)');
      };
    }
  });

  // =========================================================
  // BRD EMPLOYEE & ACCOUNT MANAGEMENT INTERACTIVE MODULE
  // =========================================================
  window.switchStaffBRDTab = function(tabId) {
    document.querySelectorAll('.enterprise-tabs-nav .ent-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('staffTabStaffContainer').style.display = 'none';
    document.getElementById('staffTabAccountsContainer').style.display = 'none';
    document.getElementById('staffTabActivitiesContainer').style.display = 'none';

    const mainAddStaffBtn = document.getElementById('btnMainAddStaff');
    const mainAddAccountBtn = document.getElementById('btnMainAddAccount');

    if (tabId === 'staff') {
      document.getElementById('tabBtnStaff').classList.add('active');
      document.getElementById('staffTabStaffContainer').style.display = 'block';
      if (mainAddStaffBtn) mainAddStaffBtn.style.display = 'inline-block';
      if (mainAddAccountBtn) mainAddAccountBtn.style.display = 'none';
    } else if (tabId === 'accounts') {
      document.getElementById('tabBtnAccounts').classList.add('active');
      document.getElementById('staffTabAccountsContainer').style.display = 'block';
      if (mainAddStaffBtn) mainAddStaffBtn.style.display = 'none';
      if (mainAddAccountBtn) mainAddAccountBtn.style.display = 'inline-block';
    } else if (tabId === 'activities') {
      document.getElementById('tabBtnActivities').classList.add('active');
      document.getElementById('staffTabActivitiesContainer').style.display = 'block';
      if (mainAddStaffBtn) mainAddStaffBtn.style.display = 'none';
      if (mainAddAccountBtn) mainAddAccountBtn.style.display = 'none';
    }
    if (window.refreshIcons) window.refreshIcons();
  };

  window.openCreateStaffModalBRD = function() {
    openStaffFormModalBRD(null);
  };

  window.openEditStaffModalBRD = function(staffId) {
    const list = MockData.getStaffListBRD ? MockData.getStaffListBRD() : [];
    const staff = list.find(s => s.id === staffId);
    openStaffFormModalBRD(staff);
  };

  function openStaffFormModalBRD(staff = null) {
    const isEdit = !!staff;
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${isEdit ? '✍️ Chỉnh Sửa Thông Tin Nhân Viên BRD' : '➕ Tạo Mới Nhân Viên BRD'}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>

      <div style="padding:20px; max-height:75vh; overflow-y:auto;">
        <form id="formBRDStaff" onsubmit="event.preventDefault(); submitStaffFormBRD('${isEdit ? staff.id : ''}');">
          
          <!-- 1. Thông tin nhân viên -->
          <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:#1677ff; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
            1. Thông tin nhân viên
          </div>
          <div style="display:grid; grid-template-columns:1fr 2fr; gap:16px; margin-bottom:16px;">
            <div>
              <label style="font-size:12px; font-weight:600; color:var(--text-muted);">Ảnh nhân viên</label>
              <div style="width:100px; height:100px; border:2px dashed #cbd5e1; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; background:#f8fafc;" onclick="showToast('Chọn ảnh đại diện nhân viên')">
                <span style="font-size:24px;">👤</span>
                <span style="font-size:11px; color:#64748b;">Tải ảnh lên</span>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="form-group-field">
                <label>Họ (H)</label>
                <input type="text" id="staffLastName" value="${isEdit ? staff.lastName || '' : ''}" placeholder="Nhập họ">
              </div>
              <div class="form-group-field">
                <label>Tên đệm (m)</label>
                <input type="text" id="staffMiddleName" value="${isEdit ? staff.middleName || '' : ''}" placeholder="Nhập tên đệm">
              </div>
              <div class="form-group-field" style="grid-column: span 2;">
                <label>Tên * (Bắt buộc)</label>
                <input type="text" id="staffFirstName" value="${isEdit ? staff.firstName || staff.name : ''}" required placeholder="Nhập tên nhân viên">
              </div>
              <div class="form-group-field">
                <label>Chức vụ</label>
                <select id="staffRole">
                  <option value="Quản lý Doanh nghiệp" ${isEdit && staff.role === 'Quản lý Doanh nghiệp' ? 'selected' : ''}>Quản lý Doanh nghiệp</option>
                  <option value="Cửa hàng trưởng" ${isEdit && staff.role === 'Cửa hàng trưởng' ? 'selected' : ''}>Cửa hàng trưởng</option>
                  <option value="Thu ngân / Bán hàng" ${isEdit && staff.role === 'Thu ngân / Bán hàng' ? 'selected' : ''}>Thu ngân / Bán hàng</option>
                  <option value="Kiểm kho / Giao nhận" ${isEdit && staff.role === 'Kiểm kho / Giao nhận' ? 'selected' : ''}>Kiểm kho / Giao nhận</option>
                </select>
              </div>
              <div class="form-group-field">
                <label>Ngày sinh</label>
                <input type="date" id="staffDob" value="${isEdit && staff.dob ? '1992-08-20' : '1995-05-15'}">
              </div>
            </div>
          </div>

          <!-- 2. Thông tin liên hệ -->
          <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:#1677ff; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
            2. Thông tin liên hệ
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
            <div class="form-group-field">
              <label>Email</label>
              <input type="email" id="staffEmail" value="${isEdit ? staff.email : ''}" placeholder="vd: nhanvien@finviet.com.vn">
            </div>
            <div class="form-group-field">
              <label>Số di động</label>
              <input type="text" id="staffMobile" value="${isEdit ? staff.mobile : ''}" placeholder="vd: 0909 123 456">
            </div>
            <div class="form-group-field">
              <label>Số điện thoại nhà</label>
              <input type="text" id="staffHomePhone" value="${isEdit ? staff.homePhone || '' : ''}" placeholder="vd: 028 3811 2233">
            </div>
            <div class="form-group-field">
              <label>Số điện thoại công ty</label>
              <input type="text" id="staffWorkPhone" value="${isEdit ? staff.workPhone || '' : ''}" placeholder="vd: 0909 123 456">
            </div>
          </div>

          <!-- 3. Địa chỉ -->
          <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:#1677ff; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
            3. Địa chỉ cư trú
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
            <div class="form-group-field" style="grid-column: span 2;">
              <label>Đường/Phố</label>
              <input type="text" id="staffStreet" value="${isEdit && staff.address ? staff.address.street : ''}" placeholder="Tên đường, số nhà...">
            </div>
            <div class="form-group-field">
              <label>Thành phố</label>
              <input type="text" id="staffCity" value="${isEdit && staff.address ? staff.address.city : ''}" placeholder="TP. Hồ Chí Minh / Hà Nội">
            </div>
            <div class="form-group-field">
              <label>Bang / Tỉnh</label>
              <input type="text" id="staffState" value="${isEdit && staff.address ? staff.address.state : ''}" placeholder="Quận 1 / Hoàn Kiếm">
            </div>
          </div>

          <!-- 4. Ghi chú & Phân bổ Chi nhánh -->
          <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:#1677ff; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
            4. Phân bổ Chi nhánh làm việc
          </div>
          <div style="margin-bottom:16px;">
            <div style="display:flex; gap:20px; margin-bottom:10px;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                <input type="radio" name="branchOpt" value="all" ${!isEdit || staff.branchOption === 'all' ? 'checked' : ''} onchange="toggleBranchListBRD(false)">
                <span>Làm việc tại tất cả các chi nhánh</span>
              </label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                <input type="radio" name="branchOpt" value="custom" ${isEdit && staff.branchOption === 'custom' ? 'checked' : ''} onchange="toggleBranchListBRD(true)">
                <span>Chỉ một số chi nhánh</span>
              </label>
            </div>

            <div id="branchSelectBoxBRD" style="display:${isEdit && staff.branchOption === 'custom' ? 'block' : 'none'}; padding:10px; background:#f8fafc; border-radius:6px; border:1px solid #e2e8f0;">
              <label style="display:block; margin-bottom:4px; font-weight:600;"><input type="checkbox" checked> Chi nhánh Quận 1 - HCM</label>
              <label style="display:block; margin-bottom:4px; font-weight:600;"><input type="checkbox"> Chi nhánh Hoàn Kiếm - Hà Nội</label>
              <label style="display:block; font-weight:600;"><input type="checkbox"> Chi nhánh Hải Châu - Đà Nẵng</label>
            </div>
          </div>

          <!-- 5. Phân quyền hạn chi tiết -->
          <div style="font-weight:700; font-size:14px; margin-bottom:10px; color:#1677ff; border-bottom:1px solid #e2e8f0; padding-bottom:4px;">
            5. Phân quyền hạn chi tiết (Bật/Tắt theo BRD)
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12.5px; margin-bottom:20px;">
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể đăng nhập và Sử dụng App</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" ${isEdit && staff.permissions && staff.permissions.isAdmin ? 'checked' : ''}> Có quyền Quản trị</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Yêu cầu mã PIN khi thao tác</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể Quản lý Sản phẩm / Dịch vụ</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể điều chỉnh số lượng tồn kho</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể quản lý Chiết khấu & Khuyến mãi</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể thanh toán đơn hàng</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể Thu/Chi Tiền mặt & Két tiền</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Có thể đối soát Doanh số</label>
            <label style="display:flex; align-items:center; gap:6px;"><input type="checkbox" checked> Nhân viên làm tất cả các dịch vụ</label>
          </div>

          <div style="display:flex; justify-content:end; gap:10px; margin-top:20px;">
            <button type="button" class="btn-secondary" onclick="closeModal()">Hủy Bỏ</button>
            <button type="submit" class="btn-primary" style="padding:8px 24px;">Lưu Nhân Viên</button>
          </div>
        </form>
      </div>
    `;

    modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  }

  window.toggleBranchListBRD = function(show) {
    const box = document.getElementById('branchSelectBoxBRD');
    if (box) box.style.display = show ? 'block' : 'none';
  };

  window.submitStaffFormBRD = function(staffId) {
    const firstName = document.getElementById('staffFirstName').value;
    const role = document.getElementById('staffRole').value;
    closeModal();
    showToast(`🎉 ${staffId ? 'Cập nhật' : 'Tạo mới'} nhân viên "${firstName}" (${role}) thành công!`);
  };

  window.deleteStaffBRD = function(staffId) {
    if (confirm(`Bạn có chắc chắn muốn xóa nhân viên ${staffId} không?`)) {
      showToast(`🗑️ Đã xóa nhân viên ${staffId} khỏi hệ thống.`);
    }
  };

  window.openCreateAccountModalBRD = function() {
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('modalOverlay');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">🔑 Tạo Mới Tài Khoản Đăng Nhập BRD</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div style="padding:20px;">
        <form onsubmit="event.preventDefault(); submitAccountFormBRD();">
          <div class="form-group-field" style="margin-bottom:14px;">
            <label>Chọn nhân viên</label>
            <select id="accStaffSelect" required>
              <option value="">Vui lòng chọn nhân viên từ danh sách</option>
              <option value="NV000001">Phạm Văn Minh (Quản lý Doanh nghiệp)</option>
              <option value="NV000002">Nguyễn Thị Hoa (Cửa hàng trưởng)</option>
              <option value="NV000004">Lê Thị Mai (Thu ngân)</option>
            </select>
          </div>
          <div class="form-group-field" style="margin-bottom:14px;">
            <label>Email đăng nhập tài khoản</label>
            <input type="email" id="accEmailInput" placeholder="vd: nhanvien@finviet.com.vn" required>
          </div>
          <div class="form-group-field" style="margin-bottom:14px;">
            <label>Mật khẩu</label>
            <input type="password" id="accPassInput" placeholder="Mật khẩu tối thiểu 8 ký tự" required>
          </div>
          <div class="form-group-field" style="margin-bottom:20px;">
            <label>Xác nhận mật khẩu</label>
            <input type="password" placeholder="Nhập lại mật khẩu" required>
          </div>
          <div style="display:flex; justify-content:end; gap:10px;">
            <button type="button" class="btn-secondary" onclick="closeModal()">Hủy Bỏ</button>
            <button type="submit" class="btn-primary" style="padding:8px 24px;">Tạo Tài Khoản</button>
          </div>
        </form>
      </div>
    `;

    modalOverlay.classList.add('show');
  };

  window.submitAccountFormBRD = function() {
    const email = document.getElementById('accEmailInput').value;
    closeModal();
    showToast(`🎉 Đã tạo thành công tài khoản đăng nhập cho email "${email}"`);
  };

  window.resetAccountPasswordBRD = function(accId) {
    if (confirm(`Bạn có muốn đặt lại mật khẩu cho tài khoản ${accId} không?`)) {
      showToast(`🔑 Đã gửi link đặt lại mật khẩu về email của tài khoản ${accId}`);
    }
  };

  window.toggleAccountStatusBRD = function(accId, targetStatus) {
    const isDisable = targetStatus === 'disabled';
    if (confirm(`Bạn có chắc chắn muốn ${isDisable ? 'vô hiệu hóa' : 'cấp quyền lại cho'} tài khoản ${accId}?`)) {
      showToast(`⚡ Đã ${isDisable ? 'vô hiệu hóa' : 'kích hoạt lại'} tài khoản ${accId}`);
    }
  };

  window.filterStaffBRDTable = function() {
    showToast('🔍 Đã lọc danh sách nhân viên theo từ khóa tìm kiếm');
  };

  window.filterAccountsBRDTable = function() {
    showToast('🔍 Đã lọc danh sách tài khoản theo bộ lọc');
  };

  window.filterActivitiesBRDTable = function() {
    showToast('🔍 Đã lọc nhật ký hoạt động của nhân viên');
  };

  // Chatbot AI & Contact Support Functions
  window.toggleChatbotWidget = function() {
    const drawer = document.getElementById('chatbotDrawer');
    if (!drawer) return;
    if (drawer.style.display === 'none' || !drawer.style.display) {
      drawer.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    } else {
      drawer.style.display = 'none';
    }
  };

  window.sendChatbotMsg = function() {
    const input = document.getElementById('chatbotInput');
    const container = document.getElementById('chatbotMsgContainer');
    if (!input || !container || !input.value.trim()) return;

    const val = input.value.trim();
    input.value = '';

    // Add user msg
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'display:flex; justify-content:flex-end; margin-top:6px;';
    userMsg.innerHTML = `<div style="background:#0284C7; color:#fff; padding:8px 12px; border-radius:12px; border-top-right-radius:2px; font-size:12.5px; max-width:85%; line-height:1.4;">${val}</div>`;
    container.appendChild(userMsg);
    container.scrollTop = container.scrollHeight;

    // Simulate bot reply
    setTimeout(() => {
      const botMsg = document.createElement('div');
      botMsg.style.cssText = 'display:flex; gap:8px; align-items:flex-start; margin-top:8px;';
      botMsg.innerHTML = `
        <div style="width:28px; height:28px; border-radius:50%; background:#0284C7; color:#fff; display:flex; align-items:center; justify-content:center; font-size:12px; flex-shrink:0;">🤖</div>
        <div style="background:#fff; border:1px solid #E2E8F0; padding:10px 12px; border-radius:12px; border-top-left-radius:2px; font-size:12.5px; color:#334155; max-width:85%; line-height:1.4;">
          Cảm ơn bạn đã hỏi về <strong>"${val}"</strong>. Bộ phận hỗ trợ kỹ thuật Finviet Ecopay đang tự động xử lý yêu cầu của bạn! Hotline 1900 636 652 luôn sẵn sàng 24/7.
        </div>
      `;
      container.appendChild(botMsg);
      container.scrollTop = container.scrollHeight;
    }, 600);
  };

  window.sendQuickChatMsg = function(text) {
    const input = document.getElementById('chatbotInput');
    if (input) {
      input.value = text;
      sendChatbotMsg();
    }
  };

  window.openContactModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.style.display = 'flex';
      if (window.lucide) lucide.createIcons();
    }
  };

  window.closeContactModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) modal.style.display = 'none';
  };

  window.toggleStatementDownloadMenu = function(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('statementDownloadMenu');
    if (menu) {
      const isVisible = menu.style.display === 'block';
      menu.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && window.refreshIcons) window.refreshIcons();
    }
  };

  document.addEventListener('click', function(e) {
    const menu = document.getElementById('statementDownloadMenu');
    if (menu && !e.target.closest('.download-dropdown-wrapper')) {
      menu.style.display = 'none';
    }
  });

  // ==========================================
  // AUTHENTICATION & LOGIN FLOW LOGIC
  // ==========================================
  window.checkAuthStatus = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginContainer = document.getElementById('loginViewContainer');
    if (loginContainer) {
      if (isLoggedIn === 'true') {
        loginContainer.style.display = 'none';
      } else {
        loginContainer.style.display = 'flex';
        if (window.refreshIcons) window.refreshIcons();
      }
    }
  };

  // Run initial Auth Check
  checkAuthStatus();

  window.fillDemoAccount = function() {
    const phoneInput = document.getElementById('loginPhoneInput');
    const pwdInput = document.getElementById('loginPasswordInput');
    if (phoneInput) phoneInput.value = '0909123456';
    if (pwdInput) pwdInput.value = '123456';
    if (window.showToast) window.showToast('🚀 Đã điền tự động tài khoản Demo: 0909123456 / 123456');
  };

  window.handleLoginSubmit = function(e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('btnLoginSubmit');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" class="spin-animation" style="width:18px; height:18px;"></i> Đang xác thực...`;
      if (window.refreshIcons) window.refreshIcons();
    }

    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      const loginContainer = document.getElementById('loginViewContainer');
      if (loginContainer) loginContainer.style.display = 'none';

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i data-lucide="log-in" style="width:18px; height:18px;"></i> Đăng Nhập Hệ Thống`;
      }

      if (window.showToast) {
        window.showToast('🎉 Đăng nhập thành công! Chào mừng Nguyễn Văn Minh đến với FinViet Ecopay Merchant Portal.');
      }
      if (window.refreshIcons) window.refreshIcons();
    }, 800);
  };

  window.handleLogout = function() {
    localStorage.setItem('isLoggedIn', 'false');
    const popover = document.getElementById('userProfilePopover');
    if (popover) popover.style.display = 'none';

    const loginContainer = document.getElementById('loginViewContainer');
    if (loginContainer) {
      loginContainer.style.display = 'flex';
      if (window.refreshIcons) window.refreshIcons();
    }

    if (window.showToast) {
      window.showToast('🔒 Đã đăng xuất khỏi tài khoản an toàn thành công!');
    }
  };

  window.togglePasswordVisibility = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (input) {
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      if (btn) {
        btn.innerHTML = isPwd ? `<i data-lucide="eye-off" style="width:16px; height:16px;"></i>` : `<i data-lucide="eye" style="width:16px; height:16px;"></i>`;
        if (window.refreshIcons) window.refreshIcons();
      }
    }
  };

  window.toggleUserProfileMenu = function(e) {
    if (e) e.stopPropagation();
    const popover = document.getElementById('userProfilePopover');
    if (popover) {
      const isVisible = popover.style.display === 'block';
      popover.style.display = isVisible ? 'none' : 'block';
      if (!isVisible && window.refreshIcons) window.refreshIcons();
    }
  };

  window.openForgotPasswordModal = function() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
      modal.style.display = 'flex';
      if (window.refreshIcons) window.refreshIcons();
    }
  };

  window.closeForgotPasswordModal = function() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) modal.style.display = 'none';
  };

  window.handleForgotPasswordSubmit = function(e) {
    if (e) e.preventDefault();
    closeForgotPasswordModal();
    if (window.showToast) {
      window.showToast('✅ Đã đặt lại mật khẩu mới thành công! Vui lòng đăng nhập lại.');
    }
  };

  window.openRegisterMerchantModal = function() {
    const modal = document.getElementById('registerMerchantModal');
    if (modal) {
      modal.style.display = 'flex';
      if (window.refreshIcons) window.refreshIcons();
    }
  };

  window.closeRegisterMerchantModal = function() {
    const modal = document.getElementById('registerMerchantModal');
    if (modal) modal.style.display = 'none';
  };

  window.handleRegisterMerchantSubmit = function(e) {
    if (e) e.preventDefault();
    closeRegisterMerchantModal();
    if (window.showToast) {
      window.showToast('🎉 Đăng ký Merchant thành công! Chào mừng Doanh nghiệp mới gia nhập FinViet Ecopay.');
    }
  };

  window.handleQuickAuth = function(method) {
    if (window.showToast) {
      window.showToast(`Đang kết nối phương thức ${method}... Đăng nhập thành công!`);
    }
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      const loginContainer = document.getElementById('loginViewContainer');
      if (loginContainer) loginContainer.style.display = 'none';
      if (window.refreshIcons) window.refreshIcons();
    }, 600);
  };

  document.addEventListener('click', function(e) {
    const userPopover = document.getElementById('userProfilePopover');
    if (userPopover && !e.target.closest('.topbar-user-profile')) {
      userPopover.style.display = 'none';
    }
  });

  // ----------------------------------------------------
  // BẢNG PHÂN QUYỀN THEO VAI TRÒ (EDIT PERMISSIONS BY ROLE - ADMIN MODE)
  // ----------------------------------------------------
  // BẢNG PHÂN QUYỀN THEO VAI TRÒ (EDIT ROLE MODAL - 3 CARD SELECTION DESIGN)
  // ----------------------------------------------------

  window.openEditStaffModalBRD = function(staffId) {
    const list = MockData.getStaffListBRD ? MockData.getStaffListBRD() : [];
    const staff = list.find(s => s.id === (staffId || 'NV000001')) || list[0] || {
      id: 'NV000001',
      name: 'Phạm Văn Minh',
      role: 'Quản lý cửa hàng',
      email: 'minh.pham@finviet.com.vn',
      mobile: '0909 123 456'
    };

    let selectedRoleVal = staff.role.includes('Quản lý') ? 'store_manager' : (staff.role.includes('Kế toán') ? 'accountant' : 'employee');

    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = `Phân Quyền Vai Trò: ${staff.name}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:20px; font-size:13px; text-align:left;">
          <!-- Card Header Thông tin Nhân sự -->
          <div style="background:linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%); border:1px solid #BFDBFE; border-radius:10px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:14px;">
              <div style="width:46px; height:46px; border-radius:50%; background:#0284C7; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:18px;">
                ${staff.name ? staff.name.charAt(0) : 'P'}
              </div>
              <div>
                <div style="font-weight:800; font-size:15px; color:#0F172A;">${staff.name} <span style="font-size:11px; background:#DCFCE7; color:#15803D; padding:2px 8px; border-radius:12px; font-weight:700; margin-left:6px;">Admin Authorized</span></div>
                <div style="font-size:12px; color:#64748B; margin-top:2px;">Email: <strong>${staff.email || 'minh.pham@finviet.com.vn'}</strong> | SĐT: <strong>${staff.mobile || '0909 123 456'}</strong></div>
              </div>
            </div>
            <div>
              <span style="font-size:12px; font-weight:600; color:#475569; background:#fff; padding:4px 12px; border-radius:16px; border:1px solid #CBD5E1;">Vai trò hiện tại: <strong style="color:#0284C7;">${staff.role}</strong></span>
            </div>
          </div>

          <!-- SECTION TITLE -->
          <div>
            <div style="font-weight:800; font-size:14px; color:#0F172A; display:flex; align-items:center; gap:6px;">
              <i data-lucide="shield" style="width:18px; height:18px; color:#0284C7;"></i> Chọn Vai Trò Vận Hành Cho Nhân Viên:
            </div>
            <div style="font-size:12px; color:#64748B; margin-top:2px;">Vui lòng nhấp chọn 1 trong 3 vai trò chính bên dưới để gán quyền hạn làm việc.</div>
          </div>

          <!-- 3-CARD INTERACTIVE ROLE PICKER GRID -->
          <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:14px;" id="roleCardPickerGrid">

            <!-- Card 1: Quản lý cửa hàng -->
            <div class="role-picker-card ${selectedRoleVal === 'store_manager' ? 'active' : ''}" data-role="store_manager" onclick="window.selectRoleCard('store_manager')" style="background:${selectedRoleVal === 'store_manager' ? '#F0F9FF' : '#fff'}; border:${selectedRoleVal === 'store_manager' ? '2px solid #0284C7' : '1px solid #E2E8F0'}; border-radius:10px; padding:16px; cursor:pointer; position:relative; transition:all 0.2s ease;">
              <div style="position:absolute; top:12px; right:12px;" class="card-check-icon">
                ${selectedRoleVal === 'store_manager' ? '<span style="background:#0284C7; color:#fff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">✓ Đã chọn</span>' : '<span style="width:18px; height:18px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>'}
              </div>
              <div style="font-size:28px; margin-bottom:8px;">👑</div>
              <div style="font-weight:800; font-size:14px; color:#1E293B;">Quản lý cửa hàng</div>
              <div style="font-size:11.5px; font-weight:700; color:#16A34A; margin-top:2px;">Store Manager</div>
              <div style="margin-top:10px; font-size:11.5px; color:#475569; display:flex; flex-direction:column; gap:4px;">
                <div>✓ Quản trị chi nhánh toàn diện</div>
                <div>✓ Phê duyệt tồn kho & khuyến mãi</div>
                <div>✓ Hủy đơn hàng & xuất hóa đơn</div>
              </div>
            </div>

            <!-- Card 2: Kế toán -->
            <div class="role-picker-card ${selectedRoleVal === 'accountant' ? 'active' : ''}" data-role="accountant" onclick="window.selectRoleCard('accountant')" style="background:${selectedRoleVal === 'accountant' ? '#F0F9FF' : '#fff'}; border:${selectedRoleVal === 'accountant' ? '2px solid #0284C7' : '1px solid #E2E8F0'}; border-radius:10px; padding:16px; cursor:pointer; position:relative; transition:all 0.2s ease;">
              <div style="position:absolute; top:12px; right:12px;" class="card-check-icon">
                ${selectedRoleVal === 'accountant' ? '<span style="background:#0284C7; color:#fff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">✓ Đã chọn</span>' : '<span style="width:18px; height:18px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>'}
              </div>
              <div style="font-size:28px; margin-bottom:8px;">📊</div>
              <div style="font-weight:800; font-size:14px; color:#1E293B;">Kế toán</div>
              <div style="font-size:11.5px; font-weight:700; color:#0284C7; margin-top:2px;">Accountant</div>
              <div style="margin-top:10px; font-size:11.5px; color:#475569; display:flex; flex-direction:column; gap:4px;">
                <div>✓ Đối soát doanh số ca/ngày</div>
                <div>✓ Xử lý giao dịch hoàn tiền</div>
                <div>✓ Xuất Hóa đơn Điện tử VAT</div>
              </div>
            </div>

            <!-- Card 3: Nhân viên -->
            <div class="role-picker-card ${selectedRoleVal === 'employee' ? 'active' : ''}" data-role="employee" onclick="window.selectRoleCard('employee')" style="background:${selectedRoleVal === 'employee' ? '#F0F9FF' : '#fff'}; border:${selectedRoleVal === 'employee' ? '2px solid #0284C7' : '1px solid #E2E8F0'}; border-radius:10px; padding:16px; cursor:pointer; position:relative; transition:all 0.2s ease;">
              <div style="position:absolute; top:12px; right:12px;" class="card-check-icon">
                ${selectedRoleVal === 'employee' ? '<span style="background:#0284C7; color:#fff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">✓ Đã chọn</span>' : '<span style="width:18px; height:18px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>'}
              </div>
              <div style="font-size:28px; margin-bottom:8px;">👤</div>
              <div style="font-weight:800; font-size:14px; color:#1E293B;">Nhân viên</div>
              <div style="font-size:11.5px; font-weight:700; color:#EA580C; margin-top:2px;">Staff / Employee</div>
              <div style="margin-top:10px; font-size:11.5px; color:#475569; display:flex; flex-direction:column; gap:4px;">
                <div>✓ Thu ngân bán hàng điểm bán</div>
                <div>✓ Thanh toán VietQR / Thẻ / Tiền mặt</div>
                <div>✓ Tự động mở két tiền mặt</div>
              </div>
            </div>

          </div>
        </div>
      `;

      window.currentSelectedRoleVal = selectedRoleVal;
    }

    if (btnAction) {
      btnAction.textContent = '💾 Lưu Thay Đổi Vai Trò';
      btnAction.onclick = function() {
        const roleVal = window.currentSelectedRoleVal || 'store_manager';
        let newRoleText = 'Quản lý cửa hàng';
        if (roleVal === 'accountant') newRoleText = 'Kế toán';
        if (roleVal === 'employee') newRoleText = 'Nhân viên';

        staff.role = newRoleText;

        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');
        if (window.showToast) {
          window.showToast(`🎉 Đã cập nhật vai trò "${newRoleText}" cho nhân viên ${staff.name} thành công!`);
        }
        if (window.renderPage) window.renderPage('hr-mgmt');
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  window.selectRoleCard = function(roleVal) {
    window.currentSelectedRoleVal = roleVal;
    const cards = document.querySelectorAll('#roleCardPickerGrid .role-picker-card');
    cards.forEach(card => {
      const isTarget = card.getAttribute('data-role') === roleVal;
      card.style.background = isTarget ? '#F0F9FF' : '#fff';
      card.style.border = isTarget ? '2px solid #0284C7' : '1px solid #E2E8F0';
      const checkIcon = card.querySelector('.card-check-icon');
      if (checkIcon) {
        checkIcon.innerHTML = isTarget ? '<span style="background:#0284C7; color:#fff; font-size:11px; font-weight:800; padding:2px 8px; border-radius:10px;">✓ Đã chọn</span>' : '<span style="width:18px; height:18px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>';
      }
    });

    let roleName = 'Quản lý cửa hàng';
    if (roleVal === 'accountant') roleName = 'Kế toán';
    if (roleVal === 'employee') roleName = 'Nhân viên';
    if (window.showToast) window.showToast(`Đã chọn vai trò: ${roleName}`);
  };

  // ----------------------------------------------------
  // THÊM NHÂN VIÊN MỚI (ADD NEW STAFF MODAL)
  // ----------------------------------------------------

  window.openAddStaffModalBRD = window.openCreateStaffModalBRD = function() {
    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = '➕ Thêm Nhân Viên / Tài Khoản Mới';

    window.addStaffSelectedRole = 'store_manager'; // default

    if (modalBody) {
      modalBody.innerHTML = `
        <form id="formAddStaff" onsubmit="window.handleAddStaffSubmit(event)" style="display:flex; flex-direction:column; gap:16px; font-size:13px; text-align:left;">
          <!-- Section 1: Thông tin cơ bản -->
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:14px;">
            <div style="font-weight:700; font-size:13.5px; color:#1E293B; margin-bottom:12px; display:flex; align-items:center; gap:6px;">
              <i data-lucide="user-plus" style="width:16px; height:16px; color:#0284C7;"></i> THÔNG TIN NHÂN SỰ CƠ BẢN
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">HỌ VÀ TÊN (<span style="color:#EF4444;">*</span>):</label>
                <input type="text" id="newStaffName" placeholder="Ví dụ: Nguyễn Văn An" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:12.5px;">
              </div>
              
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">SỐ ĐIỆN THOẠI (<span style="color:#EF4444;">*</span>):</label>
                <input type="tel" id="newStaffMobile" placeholder="Ví dụ: 0912 345 678" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:12.5px;">
              </div>

              <div>
                <label style="font-size:11.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">EMAIL TÀI KHOẢN (<span style="color:#EF4444;">*</span>):</label>
                <input type="email" id="newStaffEmail" placeholder="an.nguyen@finviet.com.vn" required style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:12.5px;">
              </div>

              <div>
                <label style="font-size:11.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">CỬA HÀNG PHỤ TRÁCH:</label>
                <select id="newStaffBranch" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:12.5px; background:#fff;">
                  <option value="Tất cả chi nhánh">Toàn hệ thống (Tất cả chi nhánh)</option>
                  <option value="Chi nhánh Quận 1 - HCM">Chi nhánh Quận 1 - Hồ Chí Minh</option>
                  <option value="Chi nhánh Hoàn Kiếm - Hà Nội">Chi nhánh Hoàn Kiếm - Hà Nội</option>
                  <option value="Chi nhánh Hải Châu - Đà Nẵng">Chi nhánh Hải Châu - Đà Nẵng</option>
                  <option value="Chi nhánh Hồng Bàng - Hải Phòng">Chi nhánh Hồng Bàng - Hải Phòng</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2: Chọn Vai Trò Phân Quyền -->
          <div>
            <label style="font-size:12px; font-weight:800; color:#0F172A; display:block; margin-bottom:8px;">VAI TRÒ PHÂN QUYỀN VẬN HÀNH (<span style="color:#EF4444;">*</span>):</label>
            
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;" id="addRoleCardPickerGrid">
              <!-- Card 1: Quản lý cửa hàng -->
              <div class="add-role-card active" data-role="store_manager" onclick="window.selectAddRoleCard('store_manager')" style="background:#F0F9FF; border:2px solid #0284C7; border-radius:8px; padding:12px; cursor:pointer; position:relative; transition:all 0.2s ease;">
                <div style="position:absolute; top:8px; right:8px;" class="card-check-icon">
                  <span style="background:#0284C7; color:#fff; font-size:10.5px; font-weight:800; padding:1px 6px; border-radius:8px;">✓ Chọn</span>
                </div>
                <div style="font-size:22px;">👑</div>
                <div style="font-weight:800; font-size:13px; color:#1E293B; margin-top:4px;">Quản lý cửa hàng</div>
                <div style="font-size:11px; color:#475569; margin-top:2px;">Store Manager</div>
              </div>

              <!-- Card 2: Kế toán -->
              <div class="add-role-card" data-role="accountant" onclick="window.selectAddRoleCard('accountant')" style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; padding:12px; cursor:pointer; position:relative; transition:all 0.2s ease;">
                <div style="position:absolute; top:8px; right:8px;" class="card-check-icon">
                  <span style="width:16px; height:16px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>
                </div>
                <div style="font-size:22px;">📊</div>
                <div style="font-weight:800; font-size:13px; color:#1E293B; margin-top:4px;">Kế toán</div>
                <div style="font-size:11px; color:#475569; margin-top:2px;">Accountant</div>
              </div>

              <!-- Card 3: Nhân viên -->
              <div class="add-role-card" data-role="employee" onclick="window.selectAddRoleCard('employee')" style="background:#fff; border:1px solid #E2E8F0; border-radius:8px; padding:12px; cursor:pointer; position:relative; transition:all 0.2s ease;">
                <div style="position:absolute; top:8px; right:8px;" class="card-check-icon">
                  <span style="width:16px; height:16px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>
                </div>
                <div style="font-size:22px;">👤</div>
                <div style="font-weight:800; font-size:13px; color:#1E293B; margin-top:4px;">Nhân viên</div>
                <div style="font-size:11px; color:#475569; margin-top:2px;">Staff / Employee</div>
              </div>
            </div>
          </div>

          <!-- Section 3: Ghi chú khởi tạo -->
          <div>
            <label style="font-size:11.5px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">GHI CHÚ / MÔ TẢ PHÂN CÔNG:</label>
            <textarea id="newStaffNotes" placeholder="Nhập ghi chú chi tiết công việc hoặc chi nhánh phân công..." rows="2" style="width:100%; padding:8px 12px; border-radius:6px; border:1px solid #CBD5E1; font-size:12.5px; font-family:inherit;"></textarea>
          </div>
        </form>
      `;
    }

    if (btnAction) {
      btnAction.textContent = '➕ Thêm Nhân Viên Mới';
      btnAction.onclick = function() {
        const form = document.getElementById('formAddStaff');
        if (form) form.requestSubmit ? form.requestSubmit() : window.handleAddStaffSubmit();
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  window.selectAddRoleCard = function(roleVal) {
    window.addStaffSelectedRole = roleVal;
    const cards = document.querySelectorAll('#addRoleCardPickerGrid .add-role-card');
    cards.forEach(card => {
      const isTarget = card.getAttribute('data-role') === roleVal;
      card.style.background = isTarget ? '#F0F9FF' : '#fff';
      card.style.border = isTarget ? '2px solid #0284C7' : '1px solid #E2E8F0';
      const checkIcon = card.querySelector('.card-check-icon');
      if (checkIcon) {
        checkIcon.innerHTML = isTarget ? '<span style="background:#0284C7; color:#fff; font-size:10.5px; font-weight:800; padding:1px 6px; border-radius:8px;">✓ Chọn</span>' : '<span style="width:16px; height:16px; border-radius:50%; border:2px solid #CBD5E1; display:inline-block;"></span>';
      }
    });
  };

  window.handleAddStaffSubmit = function(e) {
    if (e) e.preventDefault();
    const name = document.getElementById('newStaffName')?.value.trim();
    const mobile = document.getElementById('newStaffMobile')?.value.trim();
    const email = document.getElementById('newStaffEmail')?.value.trim();
    const branch = document.getElementById('newStaffBranch')?.value || 'Tất cả chi nhánh';
    const notes = document.getElementById('newStaffNotes')?.value.trim() || 'Nhân viên mới khởi tạo';
    const roleVal = window.addStaffSelectedRole || 'store_manager';

    if (!name || !mobile || !email) {
      if (window.showToast) window.showToast('⚠️ Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Email!');
      return;
    }

    let roleText = 'Quản lý cửa hàng';
    if (roleVal === 'accountant') roleText = 'Kế toán';
    if (roleVal === 'employee') roleText = 'Nhân viên';

    const staffList = MockData.getStaffListBRD ? MockData.getStaffListBRD() : [];
    const newId = `NV${String(staffList.length + 1).padStart(6, '0')}`;

    const newStaff = {
      id: newId,
      group: roleVal,
      groupName: roleText,
      name: name,
      firstName: name.split(' ').pop() || name,
      lastName: name.split(' ')[0] || '',
      role: roleText,
      email: email,
      mobile: mobile,
      notes: notes,
      branches: [branch],
      status: 'active',
      statusText: 'Đang làm việc',
      statusClass: 'badge-success'
    };

    staffList.unshift(newStaff);

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.remove('show');

    if (window.showToast) {
      window.showToast(`🎉 Đã thêm thành công nhân viên "${name}" với vai trò ${roleText}!`);
    }

    if (window.renderPage) window.renderPage('hr-mgmt');
  };

  // ----------------------------------------------------
  // CHI TIẾT BÁO CÁO ĐỐI SOÁT THANH TOÁN (BRD SECTION 2)
  // ----------------------------------------------------

  window.openReconcileReportDetailModal = function(reconcileCode) {
    const list = MockData.getReconcileReportV1Data ? MockData.getReconcileReportV1Data() : [];
    const item = list.find(r => r.reconcileCode === (reconcileCode || 'R_16566_22072025_131523_772')) || list[0] || {
      reconcileCode: reconcileCode || 'R_16566_22072025_131523_772',
      payMethod: 'VietQR',
      storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
      storeCode: 'ST-Q1-001',
      periodRange: '26/08/2026 00:00:00 - 26/08/2026 23:59:59',
      totalPayout: '185,450,000 đ',
      txnFee: '500,000 đ',
      statusText: 'Đã phê duyệt',
      statusClass: 'badge-success'
    };

    const code = item.reconcileCode;
    const modalTitle = document.getElementById('modalTitleText');
    const modalBody = document.getElementById('modalBodyContent');
    const btnAction = document.getElementById('btnFooterAction');

    if (modalTitle) modalTitle.textContent = `Chi Tiết Báo Cáo Đối Soát Thanh Toán: ${code}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:16px; font-size:13px; text-align:left;">
          <!-- Action Header: Top Export Button (Khớp hình BRD) -->
          <div style="display:flex; justify-content:flex-end; align-items:center; border-bottom:1px solid #E2E8F0; padding-bottom:10px;">
            <button type="button" class="btn-primary" style="background:#00B4D8; border-color:#00B4D8; font-size:12.5px; padding:6px 14px; display:inline-flex; align-items:center; gap:6px;" onclick="showToast('Đã xuất file báo cáo đối soát thành công!')">
              <i data-lucide="download" style="width:14px; height:14px;"></i> Xuất dữ liệu
            </button>
          </div>

          <!-- 4 TABS NAV (KHỚP BRD MỤC 2) -->
          <div style="display:flex; border-bottom:2px solid #E2E8F0; gap:4px;" id="reconcileDetailTabsNav">
            <button type="button" class="recon-tab-btn active" data-tab="tabDvcntt" onclick="window.switchReconcileDetailTab('tabDvcntt')" style="padding:10px 16px; font-weight:700; border:none; background:none; border-bottom:3px solid #00B4D8; color:#00B4D8; cursor:pointer; font-size:13px;">
              Thông tin DVCNTT
            </button>
            <button type="button" class="recon-tab-btn" data-tab="tabReportInfo" onclick="window.switchReconcileDetailTab('tabReportInfo')" style="padding:10px 16px; font-weight:700; border:none; background:none; border-bottom:3px solid transparent; color:#64748B; cursor:pointer; font-size:13px;">
              Thông tin báo cáo
            </button>
            <button type="button" class="recon-tab-btn" data-tab="tabTxnList" onclick="window.switchReconcileDetailTab('tabTxnList')" style="padding:10px 16px; font-weight:700; border:none; background:none; border-bottom:3px solid transparent; color:#64748B; cursor:pointer; font-size:13px;">
              Danh sách giao dịch
            </button>
            <button type="button" class="recon-tab-btn" data-tab="tabHistory" onclick="window.switchReconcileDetailTab('tabHistory')" style="padding:10px 16px; font-weight:700; border:none; background:none; border-bottom:3px solid transparent; color:#64748B; cursor:pointer; font-size:13px;">
              Lịch sử đối soát
            </button>
          </div>

          <!-- TAB 1: THÔNG TIN DVCNTT (KHỚP PAGE 6 BRD) -->
          <div id="tabDvcntt" class="recon-tab-pane" style="display:block;">
            <div style="display:flex; flex-direction:column; gap:16px;">
              <!-- 1. Thông tin doanh nghiệp -->
              <div style="border:1px solid #E2E8F0; border-radius:8px; overflow:hidden;">
                <div style="background:#F8FAFC; padding:10px 14px; font-weight:700; color:#334155; border-bottom:1px solid #E2E8F0;">
                  Thông tin doanh nghiệp
                </div>
                <table class="portal-table" style="margin:0;">
                  <tbody>
                    <tr><td style="width:220px; color:#64748B;">1. Mã doanh nghiệp</td><td style="font-weight:700; color:#0F172A;">FINVIET_ECO</td></tr>
                    <tr><td style="color:#64748B;">2. Tên doanh nghiệp</td><td style="font-weight:700; color:#0F172A;">CÔNG TY TNHH ABC (ECOPAY MERCHANT)</td></tr>
                  </tbody>
                </table>
              </div>

              <!-- 2. Thông tin cửa hàng -->
              <div style="border:1px solid #E2E8F0; border-radius:8px; overflow:hidden;">
                <div style="background:#F8FAFC; padding:10px 14px; font-weight:700; color:#334155; border-bottom:1px solid #E2E8F0;">
                  Thông tin cửa hàng
                </div>
                <table class="portal-table" style="margin:0;">
                  <tbody>
                    <tr><td style="width:220px; color:#64748B;">1. Mã cửa hàng</td><td style="font-weight:700; color:#0F172A;">${item.storeCode || 'ST-Q1-001'}</td></tr>
                    <tr><td style="color:#64748B;">2. Tên cửa hàng</td><td style="font-weight:700; color:#0F172A;">${item.storeName || 'Chi nhánh Quận 1'}</td></tr>
                    <tr><td style="color:#64748B;">3. Ví ECO</td><td style="color:#64748B;">-</td></tr>
                    <tr><td style="color:#64748B;">4. Tên chủ tài khoản</td><td style="font-weight:700; color:#0F172A;">PHẠM VĂN MINH</td></tr>
                    <tr><td style="color:#64748B;">5. Số tài khoản</td><td style="font-family:monospace; font-weight:700; color:#0F172A;">666888688688</td></tr>
                    <tr><td style="color:#64748B;">6. Ngân hàng</td><td style="font-weight:700; color:#0F172A;">MB Bank</td></tr>
                    <tr><td style="color:#64748B;">7. Chi nhánh</td><td style="font-weight:700; color:#0F172A;">HỒ CHÍ MINH</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- TAB 2: THÔNG TIN BÁO CÁO (KHỚP PAGE 7 BRD - 20 FIELDS - 1 PHƯƠNG THỨC THANH TOÁN) -->
          <div id="tabReportInfo" class="recon-tab-pane" style="display:none;">
            <div style="border:1px solid #E2E8F0; border-radius:8px; overflow:hidden; max-height:420px; overflow-y:auto;">
              <table class="portal-table" style="margin:0;">
                <tbody>
                  <tr><td style="width:260px; color:#64748B;">1. Mã thanh toán</td><td style="font-weight:700; color:#0284C7;">${code}</td></tr>
                  <tr><td style="color:#64748B;">2. Khoảng thời gian giao dịch</td><td style="color:#0F172A;">${item.periodRange || '26/08/2026 00:00:00 - 26/08/2026 23:59:59'}</td></tr>
                  <tr><td style="color:#64748B;">3. Phương thức thanh toán</td><td><span style="background:#EFF6FF; color:#0284C7; padding:3px 10px; border-radius:4px; font-weight:800; border:1px solid #BFDBFE;">${item.payMethod}</span></td></tr>
                  <tr><td style="color:#64748B;">4. Tổng số giao dịch</td><td style="font-weight:700;">88</td></tr>
                  <tr><td style="color:#64748B;">5. Tổng số tiền giao dịch gốc</td><td style="font-weight:700; color:#16A34A;">${item.totalPayout || '185,450,000 đ'}</td></tr>
                  <tr><td style="color:#64748B;">6. Tổng số tiền đơn hàng</td><td style="font-weight:700; color:#16A34A;">${item.totalPayout || '185,450,000 đ'}</td></tr>
                  <tr><td style="color:#64748B;">7. Tổng số tiền hoàn</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">8. Phí hoàn</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">9. Phí giao dịch</td><td style="font-weight:700; color:#EF4444;">${item.txnFee || '500,000 đ'}</td></tr>
                  <tr><td style="color:#64748B;">10. Phí trả sau áp dụng cho doanh nghiệp</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">11. Phí dịch vụ trả sau áp dụng cho doanh nghiệp</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">12. Phí trả sau áp dụng cho người dùng</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">13. Phí dịch vụ trả sau áp dụng cho người dùng</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">14. Phí BNPL áp dụng cho doanh nghiệp</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">15. Phí BNPL áp dụng cho người dùng</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">16. Phí dịch vụ BNPL áp dụng cho người dùng</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">17. Số tiền hoàn cấn trừ</td><td style="color:#64748B;">${item.deductedRefundAmount || '0 đ'}</td></tr>
                  <tr><td style="color:#64748B;">18. Phí hoàn cấn trừ</td><td style="color:#64748B;">0 đ</td></tr>
                  <tr><td style="color:#64748B;">19. Tổng số tiền phải trả</td><td style="font-weight:800; color:#16A34A; font-size:14px;">${item.closingBalance || item.totalPayout}</td></tr>
                  <tr><td style="color:#64748B;">20. Phí bổ sung</td><td style="color:#64748B;">-</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 3: DANH SÁCH GIAO DỊCH (KHỚP PAGE 7 BRD - SINGLE PAY METHOD) -->
          <div id="tabTxnList" class="recon-tab-pane" style="display:none;">
            <div style="border:1px solid #E2E8F0; border-radius:8px; overflow-x:auto;">
              <table class="portal-table" style="margin:0;">
                <thead>
                  <tr style="background:#F8FAFC;">
                    <th>STT</th>
                    <th>Mã giao dịch</th>
                    <th>Mã tham chiếu</th>
                    <th>Approve Code</th>
                    <th>Thời gian phát sinh</th>
                    <th>Phương thức</th>
                    <th>Thông tin thanh toán</th>
                    <th style="text-align:right;">Số tiền gốc</th>
                    <th style="text-align:right;">Phí giao dịch</th>
                    <th style="text-align:right;">Số tiền hoàn</th>
                    <th style="text-align:right;">Thực nhận</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td style="font-weight:700; color:#0284C7;">GD20260826001</td>
                    <td>REF99882211</td>
                    <td>APP883311</td>
                    <td style="font-size:12px;">26/08/2026 06:15:22</td>
                    <td><span style="background:#F0FDF4; color:#16A34A; padding:2px 8px; border-radius:4px; font-weight:700;">${item.payMethod}</span></td>
                    <td style="font-family:monospace; color:#64748B;">9704****1234</td>
                    <td style="text-align:right; font-weight:700;">15.450.000 đ</td>
                    <td style="text-align:right; color:#EF4444;">45.000 đ</td>
                    <td style="text-align:right;">0 đ</td>
                    <td style="text-align:right; font-weight:800; color:#16A34A;">15.405.000 đ</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td style="font-weight:700; color:#0284C7;">GD20260826002</td>
                    <td>REF99882212</td>
                    <td>APP883312</td>
                    <td style="font-size:12px;">26/08/2026 09:30:15</td>
                    <td><span style="background:#F0FDF4; color:#16A34A; padding:2px 8px; border-radius:4px; font-weight:700;">${item.payMethod}</span></td>
                    <td style="font-family:monospace; color:#64748B;">9704****5678</td>
                    <td style="text-align:right; font-weight:700;">8.200.000 đ</td>
                    <td style="text-align:right; color:#EF4444;">24.000 đ</td>
                    <td style="text-align:right;">0 đ</td>
                    <td style="text-align:right; font-weight:800; color:#16A34A;">8.176.000 đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB 4: LỊCH SỬ ĐỐI SOÁT (KHỚP PAGE 7, 8, 9 BRD) -->
          <div id="tabHistory" class="recon-tab-pane" style="display:none;">
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:13px; font-weight:700; color:#475569;">Trạng thái hiện tại:</span>
                <span class="status-badge ${item.statusClass}">${item.statusText}</span>
              </div>

              <div style="border:1px solid #E2E8F0; border-radius:8px; overflow:hidden;">
                <table class="portal-table" style="margin:0;">
                  <tbody>
                    <tr><td style="width:260px; color:#64748B;">1. Thời gian thanh toán được tạo</td><td style="font-weight:600; color:#0F172A;">${item.createdAt || '26/08/2026 00:05:00'}</td></tr>
                    <tr><td style="color:#64748B;">2. Thời gian thanh toán được duyệt</td><td style="font-weight:600; color:#0F172A;">${item.merchantPayTime || '26/08/2026 12:00:00'}</td></tr>
                    <tr><td style="color:#64748B;">3. Thời gian thanh toán được chấp nhận duyệt</td><td style="font-weight:600; color:#0F172A;">${item.merchantPayTime || '26/08/2026 12:00:00'}</td></tr>
                    <tr><td style="color:#64748B;">4. Thời gian thanh toán duyệt trả tiền</td><td style="font-weight:600; color:#16A34A;">${item.merchantPayTime || '26/08/2026 23:59:59'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    if (btnAction) {
      btnAction.textContent = 'Đóng';
      btnAction.onclick = function() {
        const modalOverlay = document.getElementById('modalOverlay');
        if (modalOverlay) modalOverlay.classList.remove('show');
      };
    }

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay.classList.add('show');
    if (window.refreshIcons) window.refreshIcons();
  };

  window.switchReconcileDetailTab = function(tabId) {
    const tabBtns = document.querySelectorAll('#reconcileDetailTabsNav .recon-tab-btn');
    tabBtns.forEach(btn => {
      const isTarget = btn.getAttribute('data-tab') === tabId;
      btn.style.borderBottom = isTarget ? '3px solid #00B4D8' : '3px solid transparent';
      btn.style.color = isTarget ? '#00B4D8' : '#64748B';
    });

    const panes = document.querySelectorAll('.recon-tab-pane');
    panes.forEach(pane => {
      pane.style.display = pane.id === tabId ? 'block' : 'none';
    });
  };

  window.switchV1ReportTab = function(mode) {
    const btnWithDash = document.getElementById('v1TabWithDashBtn');
    const btnNoDash = document.getElementById('v1TabNoDashBtn');
    const dashCards = document.getElementById('v1DashboardCardsRow');

    if (mode === 'noDashboard') {
      if (dashCards) dashCards.style.display = 'none';
      if (btnWithDash) btnWithDash.classList.remove('active');
      if (btnNoDash) btnNoDash.classList.add('active');
      if (window.showToast) window.showToast('Chuyển sang chế độ xem Bảng danh sách (Không có Dashboard)');
    } else {
      if (dashCards) dashCards.style.display = 'grid';
      if (btnWithDash) btnWithDash.classList.add('active');
      if (btnNoDash) btnNoDash.classList.remove('active');
      if (window.showToast) window.showToast('Chuyển sang chế độ xem Báo cáo tổng quan (Có Dashboard)');
    }
  };
});
