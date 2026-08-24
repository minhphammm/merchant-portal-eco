/**
 * Eco Merchant Portal - Internationalization (i18n) Dictionary
 * Supports Vietnamese (VIE) and English (EN)
 */

const i18n = {
  currentLang: 'vie',

  dict: {
    vie: {
      // Portal Branding & Header
      portalName: 'Ecopay Merchant',
      brandSub: 'FinViet Merchant System',
      storeLabel: 'Hệ thống cửa hàng:',
      allStores: 'CÔNG TY TNHH ABC',
      storeQ1: 'Chi nhánh Quận 1 - Hồ Chí Minh',
      storeQ3: 'Chi nhánh Hoàn Kiếm - Hà Nội',
      storeTB: 'Chi nhánh Hải Châu - Đà Nẵng',
      userRole: 'Quản lý Doanh nghiệp',
      userName: 'Phạm Văn Minh',

      // Navigation Menu
      navDashboard: 'Tổng quan',
      navEnterprise: 'Doanh nghiệp',
      navEnterpriseOverview: 'Quản trị Doanh nghiệp',
      navStoresMgmt: 'Quản trị cửa hàng',
      navAccountsMgmt: 'Quản trị tài khoản',
      navStaffMgmt: 'Quản trị nhân viên',
      navHrMgmt: 'Quản trị nhân lực',
      navDevices: 'Thiết bị',
      navEdc: 'Thiết bị EDC',
      navSoftpos: 'Thiết bị SoftPOS',
      navSpeaker: 'Loa thông báo GD',
      navPayment: 'Payment',
      navPayTxns: 'Giao dịch thanh toán',
      navRefundTxns: 'Giao dịch hoàn tiền',
      navPayRequests: 'Quản lý yêu cầu thanh toán',
      navAgentBanking: 'Agent Banking',
      navAbMgmt: 'Quản trị DN / Cửa hàng',
      navAbHistory: 'Lịch sử giao dịch',
      navAbShift: 'Báo cáo két ca',
      navSettlement: 'Quyết toán & Đối soát',
      navReconcileReport: 'Báo cáo đối soát',
      navFeeDiffReport: 'Báo cáo chênh lệch phí',
      navBalanceReport: 'Báo cáo số dư',
      navStatement: 'Sao kê tài khoản',
      navAnalytics: 'Analytics',

      // Header Actions & User Menu
      notifications: 'Thông báo',
      profileSettings: 'Cài đặt cá nhân',
      changePassword: 'Đổi mật khẩu',
      logout: 'Đăng xuất',
      langSwitch: 'VIE / EN',

      // Dashboard Header
      dashboardTitle: 'Tổng quan',
      merchantInfo: 'Doanh nghiệp: CÔNG TY TNHH ABC (MC: MC20268899)',
      lastUpdated: 'Cập nhật lúc:',
      btnRefresh: 'Làm mới dữ liệu',

      // Filters
      filterToday: 'Hôm nay',
      filterThisWeek: 'Tuần này',
      filterThisMonth: 'Tháng này',
      filterCustom: 'Tùy chọn',
      selectDateRange: 'Chọn khoảng thời gian',
      startDate: 'Từ ngày:',
      endDate: 'Đến ngày:',
      applyFilter: 'Áp dụng',
      closeModal: 'Đóng',

      // KPI Metric Cards
      kpiRevenueTitle: 'Doanh Thu Tuần Này',
      kpiSuccessTitle: 'Giao Dịch Thành Công',
      kpiFailedTitle: 'Giao Dịch Thất Bại',
      vsPreviousPeriod: 'so với kỳ trước',

      // Chart Labels
      chartRevenueTitle: 'Xu Hướng Doanh Thu Theo Thời Gian',
      chartChannelTitle: 'Phân Bổ Doanh Thu Theo Kênh',
      chart7Days: '7 ngày',
      chart30Days: '30 ngày',
      centerTotalGmv: 'Tổng GMV',
      channelVietQR: 'VietQR / QR Pay',
      channelATM: 'Thẻ ATM Nội Địa',
      channelVisa: 'Thẻ Quốc Tế (Visa/Master)',
      channelPayLink: 'Payment Link & E-Wallet',

      // Recent Transactions & Top Stores Tables
      recentTxnsTitle: 'Giao Dịch Gần Đây',
      topStoresTitle: 'Top Cửa Hàng Theo Doanh Thu',
      viewAll: 'Xem tất cả >',

      colTime: 'THỜI GIAN',
      colTxnId: 'MÃ GIAO DỊCH',
      colMethod: 'PHƯƠNG THỨC',
      colAmount: 'SỐ TIỀN',
      colStatus: 'TRẠNG THÁI',

      statusSuccess: 'Thành công',
      statusFailed: 'Thất bại',
      statusProcessing: 'Đang xử lý',

      // Modal Titles & Texts
      modalTxnDetailTitle: 'Chi Tiết Giao Dịch Thanh Toán',
      modalSettingsTitle: 'Cài Đặt Tài Khoản',
      btnClose: 'Đóng',

      // Error Messages & Toasts
      errDateRequired: 'Vui lòng chọn đầy đủ Từ ngày và Đến ngày.',
      errStartAfterEnd: 'Từ ngày không được lớn hơn Đến ngày.',
      errEndAfterCurrent: 'Đến ngày không được lớn hơn ngày hiện tại.',
      errMax365Days: 'Khoảng thời gian chọn không được vượt quá 365 ngày.',
      toastStoreChanged: 'Đã chuyển dữ liệu sang cửa hàng:',
      toastRefreshed: 'Đã làm mới dữ liệu hệ thống thành công!'
    },

    en: {
      // Portal Branding & Header
      portalName: 'Ecopay Merchant',
      brandSub: 'FinViet Merchant System',
      storeLabel: 'Store System:',
      allStores: 'ABC COMPANY LTD',
      storeQ1: 'District 1 Branch - HCMC',
      storeQ3: 'Hoan Kiem Branch - Hanoi',
      storeTB: 'Hai Chau Branch - Da Nang',
      userRole: 'Enterprise Manager',
      userName: 'Pham Van Minh',

      // Navigation Menu
      navDashboard: 'Dashboard',
      navEnterprise: 'Enterprise',
      navEnterpriseOverview: 'Enterprise Management',
      navStoresMgmt: 'Store Management',
      navAccountsMgmt: 'Account Management',
      navStaffMgmt: 'Staff Management',
      navHrMgmt: 'Human Resources',
      navDevices: 'Devices',
      navEdc: 'EDC Terminals',
      navSoftpos: 'SoftPOS Apps',
      navSpeaker: 'Speaker Soundbox',
      navPayment: 'Payment',
      navPayTxns: 'Payment Transactions',
      navRefundTxns: 'Refund Transactions',
      navPayRequests: 'Payment Link Requests',
      navAgentBanking: 'Agent Banking',
      navAbMgmt: 'Merchant & Store Mgmt',
      navAbHistory: 'Banking History',
      navAbShift: 'Shift Settlement',
      navSettlement: 'Settlement & Reconciliation',
      navReconcileReport: 'Reconciliation Report',
      navFeeDiffReport: 'Fee Difference Report',
      navBalanceReport: 'Balance Statement',
      navStatement: 'Bank Statement',
      navAnalytics: 'Analytics',

      // Header Actions & User Menu
      notifications: 'Notifications',
      profileSettings: 'Profile Settings',
      changePassword: 'Change Password',
      logout: 'Logout',
      langSwitch: 'VIE / EN',

      // Dashboard Header
      dashboardTitle: 'Business Overview',
      merchantInfo: 'Merchant: ABC COMPANY LTD (MC: MC20268899)',
      lastUpdated: 'Last updated:',
      btnRefresh: 'Refresh Data',

      // Filters
      filterToday: 'Today',
      filterThisWeek: 'This Week',
      filterThisMonth: 'This Month',
      filterCustom: 'Custom',
      selectDateRange: 'Select Date Range',
      startDate: 'Start Date:',
      endDate: 'End Date:',
      applyFilter: 'Apply',
      closeModal: 'Close',

      // KPI Metric Cards
      kpiRevenueTitle: 'This Week Revenue',
      kpiSuccessTitle: 'Successful Transactions',
      kpiFailedTitle: 'Failed Transactions',
      vsPreviousPeriod: 'vs previous period',

      // Chart Labels
      chartRevenueTitle: 'Revenue Trend Over Time',
      chartChannelTitle: 'Revenue Share by Channel',
      chart7Days: '7 days',
      chart30Days: '30 days',
      centerTotalGmv: 'Total GMV',
      channelVietQR: 'VietQR / QR Pay',
      channelATM: 'Domestic ATM Card',
      channelVisa: 'International Card',
      channelPayLink: 'Payment Link & E-Wallet',

      // Recent Transactions & Top Stores Tables
      recentTxnsTitle: 'Recent Transactions',
      topStoresTitle: 'Top Stores by Revenue',
      viewAll: 'View all >',

      colTime: 'TIME',
      colTxnId: 'TRANSACTION ID',
      colMethod: 'METHOD',
      colAmount: 'AMOUNT',
      colStatus: 'STATUS',

      statusSuccess: 'Successful',
      statusFailed: 'Failed',
      statusProcessing: 'Processing',

      // Modal Titles & Texts
      modalTxnDetailTitle: 'Payment Transaction Details',
      modalSettingsTitle: 'Account Settings',
      btnClose: 'Close',

      // Error Messages & Toasts
      errDateRequired: 'Please select both Start Date and End Date.',
      errStartAfterEnd: 'Start Date cannot be later than End Date.',
      errEndAfterCurrent: 'End Date cannot be in the future.',
      errMax365Days: 'Date range cannot exceed 365 days.',
      toastStoreChanged: 'Switched store context to:',
      toastRefreshed: 'Data refreshed successfully!'
    }
  },

  t(key) {
    const lang = this.currentLang;
    return this.dict[lang][key] || key;
  },

  setLanguage(lang) {
    if (this.dict[lang]) {
      this.currentLang = lang;
      this.updateDOM();
    }
  },

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key && this.dict[this.currentLang][key]) {
        el.textContent = this.dict[this.currentLang][key];
      }
    });
  }
};
