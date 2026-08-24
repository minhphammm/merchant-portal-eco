/**
 * Ecopay Merchant Portal - Dynamic Mock Data Generator
 * FinViet Eco System Mock Data v2.0 - Fully Populated Specs
 */

const MockData = {
  // Store Multipliers
  storeMultipliers: {
    all: 1.0,
    storeQ1: 0.45,
    storeQ3: 0.35,
    storeTB: 0.20
  },

  // Get KPI Metrics based on Store and Period
  getMetrics(storeId = 'all', period = 'thisWeek') {
    const mult = this.storeMultipliers[storeId] || 1.0;
    
    let baseRevenue = 1245000000;
    let baseSuccess = 12458;
    let baseFailed = 8752;

    if (period === 'today') {
      baseRevenue = 185000000;
      baseSuccess = 1820;
      baseFailed = 112;
    } else if (period === 'thisMonth') {
      baseRevenue = 4850000000;
      baseSuccess = 48200;
      baseFailed = 2310;
    }

    return {
      revenue: Math.round(baseRevenue * mult),
      revenueDelta: 12.5,
      successCount: Math.round(baseSuccess * mult),
      successDelta: 10.4,
      failedCount: Math.round(baseFailed * mult),
      failedDelta: -10.8
    };
  },

  // Chart Data Generator for Revenue Trend
  getChartData(storeId = 'all', rangeDays = 7) {
    const mult = this.storeMultipliers[storeId] || 1.0;

    let labels = [];
    let revenueData = [];
    let successData = [];
    let failedData = [];

    if (rangeDays === 7) {
      labels = ['14/08', '15/08', '16/08', '17/08', '18/08', '19/08', '20/08'];
      revenueData = [140000000, 185000000, 160000000, 210000000, 195000000, 230000000, 245000000].map(v => Math.round(v * mult));
      successData = [1400, 1850, 1600, 2100, 1950, 2300, 2458].map(v => Math.round(v * mult));
      failedData = [80, 120, 95, 110, 85, 90, 70].map(v => Math.round(v * mult));
    } else {
      labels = ['22/07', '26/07', '30/07', '03/08', '07/08', '11/08', '15/08', '20/08'];
      revenueData = [110000000, 135000000, 150000000, 175000000, 190000000, 210000000, 225000000, 245000000].map(v => Math.round(v * mult));
      successData = [1100, 1350, 1500, 1750, 1900, 2100, 2250, 2458].map(v => Math.round(v * mult));
      failedData = [150, 130, 120, 110, 100, 90, 80, 70].map(v => Math.round(v * mult));
    }

    return { labels, revenueData, successData, failedData };
  },

  // Donut Channel Distribution Data
  getChannelDistribution(storeId = 'all') {
    const mult = this.storeMultipliers[storeId] || 1.0;
    const totalGmv = Math.round(1245000000 * mult);

    return {
      totalGmv: totalGmv,
      channels: [
        { nameKey: 'channelVietQR', name: 'VietQR / QR Pay', value: Math.round(totalGmv * 0.45), percent: 45, color: '#00C853' },
        { nameKey: 'channelATM', name: 'Thẻ ATM Nội Địa', value: Math.round(totalGmv * 0.30), percent: 30, color: '#0A66C2' },
        { nameKey: 'channelVisa', name: 'Thẻ Quốc Tế (Visa/Master)', value: Math.round(totalGmv * 0.15), percent: 15, color: '#6C5CE7' },
        { nameKey: 'channelPayLink', name: 'Payment Link & E-Wallet', value: Math.round(totalGmv * 0.10), percent: 10, color: '#FF9F43' }
      ]
    };
  },

  // Top Stores
  getTopStores(storeFilter = 'all') {
    const stores = [
      { id: 'storeQ1', rank: 1, name: 'Chi nhánh Quận 1 - Hồ Chí Minh', amount: 450000000, percent: 88 },
      { id: 'storeQ3', rank: 2, name: 'Chi nhánh Hoàn Kiếm - Hà Nội', amount: 320000000, percent: 65 },
      { id: 'storeTB', rank: 3, name: 'Chi nhánh Hải Châu - Đà Nẵng', amount: 210000000, percent: 45 },
      { id: 'storeCG', rank: 4, name: 'Chi nhánh Cầu Giấy - Hà Nội', amount: 145000000, percent: 30 },
      { id: 'storeBT', rank: 5, name: 'Chi nhánh Bình Thạnh - TP.HCM', amount: 120000000, percent: 25 }
    ];

    if (storeFilter !== 'all') {
      return stores.filter(s => s.id === storeFilter);
    }
    return stores;
  },

  // Recent Transactions
  getRecentTransactions(storeFilter = 'all') {
    const txns = [
      {
        id: 'GD2026082000101',
        time: '20/08/2026 15:32:08',
        store: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        payer: 'Nguyễn Văn Minh (0909****88)',
        method: 'VietQR Pay',
        methodColor: '#00C853',
        amount: 120000,
        status: 'success',
        device: 'SoftPOS DEV-8821'
      },
      {
        id: 'GD2026082000102',
        time: '20/08/2026 15:12:08',
        store: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        payer: 'Trần Thị Mai (0918****12)',
        method: 'Thẻ ATM Nội Địa',
        methodColor: '#0A66C2',
        amount: 250000,
        status: 'success',
        device: 'EDC Terminal DEV-9942'
      },
      {
        id: 'GD2026082000103',
        time: '20/08/2026 14:45:12',
        store: 'Chi nhánh Hải Châu - Đà Nẵng',
        payer: 'Lê Hoàng Nam (0935****99)',
        method: 'Thẻ Visa / Master',
        methodColor: '#6C5CE7',
        amount: 1500000,
        status: 'success',
        device: 'EDC Terminal DEV-7711'
      },
      {
        id: 'GD2026082000104',
        time: '20/08/2026 14:10:00',
        store: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        payer: 'Phạm Thị Lan (0977****33)',
        method: 'VietQR Pay',
        methodColor: '#00C853',
        amount: 350000,
        status: 'failed',
        device: 'Payment Link'
      },
      {
        id: 'GD2026082000105',
        time: '20/08/2026 13:55:40',
        store: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        payer: 'Vũ Đức Anh (0982****44)',
        method: 'Chuyển Khoản QR Bank',
        methodColor: '#FF9F43',
        amount: 890000,
        status: 'success',
        device: 'QR Tĩnh MB'
      }
    ];

    if (storeFilter === 'storeQ1') return txns.filter(t => t.store.includes('Quận 1'));
    if (storeFilter === 'storeQ3') return txns.filter(t => t.store.includes('Hoàn Kiếm'));
    if (storeFilter === 'storeTB') return txns.filter(t => t.store.includes('Hải Châu'));

    return txns;
  },

  // Full Payment Transactions Data with all 17 fields populated
  getFullTransactions() {
    return [
      {
        stt: 1,
        id: 'GD2026082000101',
        merchantOrderId: 'ORD-20268891',
        createdDate: '20/08/2026 15:30:00',
        customerName: 'Nguyễn Văn Minh',
        customerPhoneAccount: '0909 123 456 / VCB',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        amount: 120000,
        fee: 1200,
        userFee: 0,
        voucherCode: 'ECOPAY10',
        promotion: 'Giảm 10% VietQR',
        paymentSource: 'VietQR Pay',
        paymentType: 'Thanh toán trực tiếp',
        partnerPayTime: '20/08/2026 15:32:05',
        merchantPayTime: '20/08/2026 15:32:08',
        status: 'success',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      },
      {
        stt: 2,
        id: 'GD2026082000102',
        merchantOrderId: 'ORD-20268892',
        createdDate: '20/08/2026 15:10:00',
        customerName: 'Trần Thị Mai',
        customerPhoneAccount: '0918 887 766 / TCB',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        amount: 250000,
        fee: 2500,
        userFee: 0,
        voucherCode: '-',
        promotion: 'Không áp dụng',
        paymentSource: 'Thẻ ATM Nội Địa',
        paymentType: 'Thanh toán trực tiếp',
        partnerPayTime: '20/08/2026 15:12:00',
        merchantPayTime: '20/08/2026 15:12:08',
        status: 'success',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      },
      {
        stt: 3,
        id: 'GD2026082000103',
        merchantOrderId: 'ORD-20268893',
        createdDate: '20/08/2026 14:42:00',
        customerName: 'Lê Hoàng Nam',
        customerPhoneAccount: '0935 998 877 / Visa',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        amount: 1500000,
        fee: 18000,
        userFee: 5000,
        voucherCode: 'SUMMER2026',
        promotion: 'Ưu đãi Thẻ Quốc Tế',
        paymentSource: 'Thẻ Visa / Master',
        paymentType: 'Thanh toán trực tiếp',
        partnerPayTime: '20/08/2026 14:45:00',
        merchantPayTime: '20/08/2026 14:45:12',
        status: 'paid',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 4,
        id: 'GD2026082000104',
        merchantOrderId: 'ORD-20268894',
        createdDate: '20/08/2026 14:05:00',
        customerName: 'Phạm Thu Trang',
        customerPhoneAccount: '0977 112 233 / MB',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        amount: 350000,
        fee: 3500,
        userFee: 0,
        voucherCode: '-',
        promotion: 'Không áp dụng',
        paymentSource: 'Payment Link',
        paymentType: 'Thanh toán qua Link',
        partnerPayTime: '20/08/2026 14:09:50',
        merchantPayTime: '20/08/2026 14:10:00',
        status: 'failed',
        statusText: 'Thất bại',
        statusClass: 'badge-failed'
      },
      {
        stt: 5,
        id: 'GD2026082000105',
        merchantOrderId: 'ORD-20268895',
        createdDate: '20/08/2026 13:50:00',
        customerName: 'Vũ Đức Anh',
        customerPhoneAccount: '0982 445 566 / MB',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        amount: 890000,
        fee: 4450,
        userFee: 0,
        voucherCode: 'ECOPAY50',
        promotion: 'Giảm 50K QR Bank',
        paymentSource: 'QR Bank (MB)',
        paymentType: 'Thanh toán qua QR',
        partnerPayTime: '20/08/2026 13:55:30',
        merchantPayTime: '20/08/2026 13:55:40',
        status: 'processing',
        statusText: 'Đang xử lý',
        statusClass: 'badge-processing'
      },
      {
        stt: 6,
        id: 'GD2026082000106',
        merchantOrderId: 'ORD-20268896',
        createdDate: '20/08/2026 12:28:00',
        customerName: 'Đặng Ngọc Bích',
        customerPhoneAccount: '0903 667 788 / VPB',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        amount: 620000,
        fee: 6200,
        userFee: 0,
        voucherCode: '-',
        promotion: 'Không áp dụng',
        paymentSource: 'VietQR Pay',
        paymentType: 'Thanh toán qua QR',
        partnerPayTime: '20/08/2026 12:30:10',
        merchantPayTime: '20/08/2026 12:30:15',
        status: 'approved',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-success'
      },
      {
        stt: 7,
        id: 'GD2026082000107',
        merchantOrderId: 'ORD-20268897',
        createdDate: '20/08/2026 11:10:00',
        customerName: 'Ngô Tấn Tài',
        customerPhoneAccount: '0912 334 455 / VCB',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        amount: 2400000,
        fee: 28800,
        userFee: 0,
        voucherCode: '-',
        promotion: 'Không áp dụng',
        paymentSource: 'Thẻ Quốc Tế (Master)',
        paymentType: 'Thanh toán trực tiếp',
        partnerPayTime: '20/08/2026 11:15:18',
        merchantPayTime: '20/08/2026 11:15:22',
        status: 'rejected',
        statusText: 'Đã từ chối',
        statusClass: 'badge-failed'
      },
      {
        stt: 8,
        id: 'GD2026082000108',
        merchantOrderId: 'ORD-20268898',
        createdDate: '20/08/2026 10:05:00',
        customerName: 'Hoàng Hải Yến',
        customerPhoneAccount: '0944 556 677 / BIDV',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        amount: 450000,
        fee: 4500,
        userFee: 0,
        voucherCode: 'NEWYEAR',
        promotion: 'Khuyến mãi Khách mới',
        paymentSource: 'VietQR Pay',
        paymentType: 'Thanh toán định kỳ',
        partnerPayTime: '-',
        merchantPayTime: '-',
        status: 'created',
        statusText: 'Khởi tạo',
        statusClass: 'badge-processing'
      },
      {
        stt: 9,
        id: 'GD2026082000109',
        merchantOrderId: 'ORD-20268899',
        createdDate: '20/08/2026 09:15:00',
        customerName: 'Bùi Phương Thảo',
        customerPhoneAccount: '0988 990 011 / ACB',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        amount: 1100000,
        fee: 11000,
        userFee: 0,
        voucherCode: '-',
        promotion: 'Không áp dụng',
        paymentSource: 'Ví điện tử MoMo',
        paymentType: 'Thanh toán qua Link',
        partnerPayTime: '20/08/2026 09:20:00',
        merchantPayTime: '-',
        status: 'pending',
        statusText: 'Đang chờ duyệt',
        statusClass: 'badge-warning'
      }
    ];
  },

  // Full Refund Transactions Data with 24 fields
  getRefundTransactions() {
    return [
      {
        stt: 1,
        refundId: 'HT202608200001',
        originalTxnId: 'GD2026082000101',
        originalPartnerTxnId: 'PTXN-MB-881923',
        partnerRefundReconcileId: 'REC-RF-BVB-001',
        partnerRefundTxnId: 'PRF-MB-90901',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        customerName: 'Nguyễn Văn Minh',
        customerPhoneAccount: '0909 123 456 / VCB',
        amount: 120000,
        penaltyAmount: 0,
        paymentPartnerCode: 'FINVIET_PAY',
        paymentSource: 'VietQR Pay',
        paymentMethod: 'Thanh toán trực tiếp',
        refundContent: 'Hoàn tiền đơn hàng lỗi kỹ thuật',
        rejectReason: '-',
        createdDate: '20/08/2026 15:40:00',
        approvedBy: 'Trần Văn Quản Lý',
        approvedTime: '20/08/2026 15:45:00',
        rejectedTime: '-',
        createdBy: 'Lê Thị Thu Ngân',
        paymentType: 'Thanh toán trực tiếp',
        merchantPayTime: '20/08/2026 15:50:00',
        status: 'success',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      },
      {
        stt: 2,
        refundId: 'HT202608200002',
        originalTxnId: 'GD2026082000102',
        originalPartnerTxnId: 'PTXN-VCB-771822',
        partnerRefundReconcileId: 'REC-RF-VCB-002',
        partnerRefundTxnId: 'PRF-VCB-90902',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        customerName: 'Trần Thị Mai',
        customerPhoneAccount: '0918 887 766 / TCB',
        amount: 250000,
        penaltyAmount: 10000,
        paymentPartnerCode: 'FINVIET_PAY',
        paymentSource: 'Thẻ ATM Nội Địa',
        paymentMethod: 'Thanh toán trực tiếp',
        refundContent: 'Khách đổi trả hàng hóa',
        rejectReason: '-',
        createdDate: '20/08/2026 15:20:00',
        approvedBy: 'Trần Văn Quản Lý',
        approvedTime: '20/08/2026 15:25:00',
        rejectedTime: '-',
        createdBy: 'Phạm Văn Minh',
        paymentType: 'Thanh toán trực tiếp',
        merchantPayTime: '20/08/2026 15:30:00',
        status: 'paid',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 3,
        refundId: 'HT202608200003',
        originalTxnId: 'GD2026082000103',
        originalPartnerTxnId: 'PTXN-TCB-554109',
        partnerRefundReconcileId: 'REC-RF-TCB-003',
        partnerRefundTxnId: 'PRF-TCB-90903',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        customerName: 'Lê Hoàng Nam',
        customerPhoneAccount: '0935 998 877 / Visa',
        amount: 500000,
        penaltyAmount: 0,
        paymentPartnerCode: 'NAPAS',
        paymentSource: 'Thẻ Visa / Master',
        paymentMethod: 'Thanh toán qua Link',
        refundContent: 'Thanh toán trùng đơn',
        rejectReason: '-',
        createdDate: '20/08/2026 14:50:00',
        approvedBy: 'Nguyễn Thị Hoa',
        approvedTime: '20/08/2026 14:55:00',
        rejectedTime: '-',
        createdBy: 'Lê Thị Thu Ngân',
        paymentType: 'Thanh toán qua Link',
        merchantPayTime: '20/08/2026 15:00:00',
        status: 'approved',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-success'
      },
      {
        stt: 4,
        refundId: 'HT202608200004',
        originalTxnId: 'GD2026082000104',
        originalPartnerTxnId: 'PTXN-BVB-339011',
        partnerRefundReconcileId: 'REC-RF-BVB-004',
        partnerRefundTxnId: 'PRF-BVB-90904',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        customerName: 'Phạm Thu Trang',
        customerPhoneAccount: '0977 112 233 / MB',
        amount: 350000,
        penaltyAmount: 0,
        paymentPartnerCode: 'MB_BANK',
        paymentSource: 'Payment Link',
        paymentMethod: 'Thanh toán qua QR',
        refundContent: 'Hủy đơn hàng trước khi giao',
        rejectReason: 'Hồ sơ thiếu chứng từ xác nhận',
        createdDate: '20/08/2026 14:15:00',
        approvedBy: '-',
        approvedTime: '-',
        rejectedTime: '20/08/2026 14:30:00',
        createdBy: 'Phạm Văn Minh',
        paymentType: 'Thanh toán qua QR',
        merchantPayTime: '-',
        status: 'rejected',
        statusText: 'Đã từ chối',
        statusClass: 'badge-failed'
      },
      {
        stt: 5,
        refundId: 'HT202608200005',
        originalTxnId: 'GD2026082000105',
        originalPartnerTxnId: 'PTXN-MB-990123',
        partnerRefundReconcileId: 'REC-RF-MB-005',
        partnerRefundTxnId: 'PRF-MB-90905',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        customerName: 'Vũ Đức Anh',
        customerPhoneAccount: '0982 445 566 / MB',
        amount: 890000,
        penaltyAmount: 0,
        paymentPartnerCode: 'MB_BANK',
        paymentSource: 'QR Bank (MB)',
        paymentMethod: 'Thanh toán trực tiếp',
        refundContent: 'Khách hàng hủy dịch vụ',
        rejectReason: '-',
        createdDate: '20/08/2026 13:58:00',
        approvedBy: 'Trần Văn Quản Lý',
        approvedTime: '20/08/2026 14:02:00',
        rejectedTime: '-',
        createdBy: 'Trần Văn Nam',
        paymentType: 'Thanh toán trực tiếp',
        merchantPayTime: '20/08/2026 14:05:00',
        status: 'processing',
        statusText: 'Đang xử lý',
        statusClass: 'badge-processing'
      },
      {
        stt: 6,
        refundId: 'HT202608200006',
        originalTxnId: 'GD2026082000106',
        originalPartnerTxnId: 'PTXN-VPB-662310',
        partnerRefundReconcileId: 'REC-RF-VPB-006',
        partnerRefundTxnId: 'PRF-VPB-90906',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        customerName: 'Đặng Ngọc Bích',
        customerPhoneAccount: '0903 667 788 / VPB',
        amount: 620000,
        penaltyAmount: 0,
        paymentPartnerCode: 'VPBANK',
        paymentSource: 'VietQR Pay',
        paymentMethod: 'Thanh toán qua QR',
        refundContent: 'Giao nhầm mã hàng',
        rejectReason: '-',
        createdDate: '20/08/2026 12:35:00',
        approvedBy: '-',
        approvedTime: '-',
        rejectedTime: '-',
        createdBy: 'Lê Thị Thu Ngân',
        paymentType: 'Thanh toán qua QR',
        merchantPayTime: '-',
        status: 'pending',
        statusText: 'Đang chờ duyệt',
        statusClass: 'badge-warning'
      },
      {
        stt: 7,
        refundId: 'HT202608200007',
        originalTxnId: 'GD2026082000107',
        originalPartnerTxnId: 'PTXN-VCB-881290',
        partnerRefundReconcileId: 'REC-RF-VCB-007',
        partnerRefundTxnId: 'PRF-VCB-90907',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        customerName: 'Ngô Tấn Tài',
        customerPhoneAccount: '0912 334 455 / VCB',
        amount: 2400000,
        penaltyAmount: 50000,
        paymentPartnerCode: 'VIETCOMBANK',
        paymentSource: 'Thẻ Quốc Tế (Master)',
        paymentMethod: 'Thanh toán trực tiếp',
        refundContent: 'Số dư tài khoản đối tác không đủ',
        rejectReason: '-',
        createdDate: '20/08/2026 11:20:00',
        approvedBy: 'Phạm Văn Minh',
        approvedTime: '20/08/2026 11:25:00',
        rejectedTime: '-',
        createdBy: 'Nguyễn Thị Hoa',
        paymentType: 'Thanh toán trực tiếp',
        merchantPayTime: '-',
        status: 'failed',
        statusText: 'Thất bại',
        statusClass: 'badge-failed'
      },
      {
        stt: 8,
        refundId: 'HT202608200008',
        originalTxnId: 'GD2026082000108',
        originalPartnerTxnId: 'PTXN-BIDV-112233',
        partnerRefundReconcileId: 'REC-RF-BIDV-008',
        partnerRefundTxnId: 'PRF-BIDV-90908',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        customerName: 'Hoàng Hải Yến',
        customerPhoneAccount: '0944 556 677 / BIDV',
        amount: 450000,
        penaltyAmount: 0,
        paymentPartnerCode: 'BIDV',
        paymentSource: 'VietQR Pay',
        paymentMethod: 'Thanh toán định kỳ',
        refundContent: 'Yêu cầu hoàn tiền dịch vụ phát sinh mới',
        rejectReason: '-',
        createdDate: '20/08/2026 10:10:00',
        approvedBy: '-',
        approvedTime: '-',
        rejectedTime: '-',
        createdBy: 'Trần Văn Nam',
        paymentType: 'Thanh toán định kỳ',
        merchantPayTime: '-',
        status: 'created',
        statusText: 'Khởi tạo',
        statusClass: 'badge-processing'
      },
      {
        stt: 9,
        refundId: 'HT202608200009',
        originalTxnId: 'GD2026082000109',
        originalPartnerTxnId: 'PTXN-ACB-445566',
        partnerRefundReconcileId: 'REC-RF-ACB-009',
        partnerRefundTxnId: 'PRF-ACB-90909',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        customerName: 'Bùi Phương Thảo',
        customerPhoneAccount: '0988 990 011 / ACB',
        amount: 1100000,
        penaltyAmount: 0,
        paymentPartnerCode: 'MOMO',
        paymentSource: 'Ví điện tử MoMo',
        paymentMethod: 'Thanh toán qua Link',
        refundContent: 'Hoàn trả chi phí khuyến mãi',
        rejectReason: '-',
        createdDate: '20/08/2026 09:30:00',
        approvedBy: 'Phạm Văn Minh',
        approvedTime: '20/08/2026 09:35:00',
        rejectedTime: '-',
        createdBy: 'Lê Thị Thu Ngân',
        paymentType: 'Thanh toán qua Link',
        merchantPayTime: '20/08/2026 09:40:00',
        status: 'success',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      }
    ];
  },

  // Payment Requests Data (Payment Links)
  getPaymentRequestsData() {
    return [
      {
        id: 'PL-20260820-001',
        orderCode: 'DH2026082001',
        store: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0912345678',
        customerEmail: 'vana@gmail.com',
        amount: 500000,
        channel: 'SMS & Email',
        expiryText: '00 ngày 02:00',
        status: 'ACTIVE',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success',
        createdTime: '20/08/2026 14:00',
        resendCount: 0
      },
      {
        id: 'PL-20260820-002',
        orderCode: 'DH2026082002',
        store: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        customerName: 'Trần Thị Bích',
        customerPhone: '0988776655',
        customerEmail: 'bich.tran@yahoo.com',
        amount: 1250000,
        channel: 'Email',
        expiryText: '01 ngày 12:30',
        status: 'PAID',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success',
        createdTime: '20/08/2026 11:15',
        resendCount: 1
      },
      {
        id: 'PL-20260819-088',
        orderCode: 'DH2026081988',
        store: 'Chi nhánh Hải Châu - Đà Nẵng',
        customerName: 'Lê Hoàng Minh',
        customerPhone: '0933445566',
        customerEmail: 'minh.lh@outlook.com',
        amount: 350000,
        channel: 'SMS',
        expiryText: '00 ngày 00:00',
        status: 'EXPIRED',
        statusText: 'Đã hết hạn',
        statusClass: 'badge-failed',
        createdTime: '19/08/2026 09:30',
        resendCount: 0
      },
      {
        id: 'PL-20260819-042',
        orderCode: 'DH2026081942',
        store: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        customerName: 'Phạm Thu Trang',
        customerPhone: '0977112233',
        customerEmail: 'trang.pham@gmail.com',
        amount: 890000,
        channel: 'SMS & Email',
        expiryText: '00 ngày 00:00',
        status: 'CANCELLED',
        statusText: 'Đã hủy đơn',
        statusClass: 'badge-failed',
        createdTime: '19/08/2026 16:45',
        resendCount: 0
      },
      {
        id: 'PL-20260819-015',
        orderCode: 'DH2026081915',
        store: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        customerName: 'Vũ Quốc Huy',
        customerPhone: '0903112244',
        customerEmail: 'huy.vq@gmail.com',
        amount: 2100000,
        channel: 'Email',
        expiryText: '02 ngày 00:00',
        status: 'PAID',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success',
        createdTime: '19/08/2026 10:10',
        resendCount: 0
      }
    ];
  },

  // Bank QR Code Data
  getBankQrCodesData() {
    return [
      {
        id: 'QR-MB-2026-001',
        bankName: 'MB Bank (Ngân hàng Quân Đội)',
        bankCode: 'MB',
        accountNo: '990123884920',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        status: 'ACTIVE',
        statusText: 'Hoạt động (Đã mapping)',
        statusClass: 'badge-success',
        createdDate: '15/08/2026'
      },
      {
        id: 'QR-BVB-2026-002',
        bankName: 'BVB (Ngân hàng Bảo Việt)',
        bankCode: 'BVB',
        accountNo: '881099238102',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        status: 'ACTIVE',
        statusText: 'Hoạt động (Đã mapping)',
        statusClass: 'badge-success',
        createdDate: '16/08/2026'
      },
      {
        id: 'QR-MB-2026-003',
        bankName: 'MB Bank (Ngân hàng Quân Đội)',
        bankCode: 'MB',
        accountNo: '990123884921',
        storeName: 'Chưa liên kết',
        status: 'QR_CREATED',
        statusText: 'Mã QR đã tạo',
        statusClass: 'badge-processing',
        createdDate: '19/08/2026'
      },
      {
        id: 'QR-BVB-2026-004',
        bankName: 'BVB (Ngân hàng Bảo Việt)',
        bankCode: 'BVB',
        accountNo: '881099238105',
        storeName: 'Chi nhánh Quận 1 (Cũ)',
        status: 'DISABLED',
        statusText: 'Vô hiệu hóa',
        statusClass: 'badge-failed',
        createdDate: '10/08/2026'
      }
    ];
  },

  // SMS Quota Data
  getSmsQuotaData() {
    return [
      {
        storeId: 'storeQ1',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        allocated: 500,
        used: 120,
        available: 380,
        fee: 132000
      },
      {
        storeId: 'storeQ3',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        allocated: 300,
        used: 95,
        available: 205,
        fee: 104500
      },
      {
        storeId: 'storeTB',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        allocated: 200,
        used: 40,
        available: 160,
        fee: 44000
      }
    ];
  },

  // Reconciliation Reports Data
  getReconcileReportsData() {
    return [
      {
        period: 'Kỳ Tháng 08/2026 (T+1)',
        initialBalance: '1,200,000,000 đ',
        increase: '+3,735,000,000 đ',
        decrease: '-1,450,000,000 đ',
        finalBalance: '3,485,000,000 đ',
        statusText: 'Đã đối soát thành công',
        statusClass: 'badge-success'
      },
      {
        period: 'Kỳ Tháng 07/2026 (T+1)',
        initialBalance: '950,000,000 đ',
        increase: '+4,120,000,000 đ',
        decrease: '-3,870,000,000 đ',
        finalBalance: '1,200,000,000 đ',
        statusText: 'Đã đối soát thành công',
        statusClass: 'badge-success'
      },
      {
        period: 'Kỳ Tháng 06/2026 (T+1)',
        initialBalance: '800,000,000 đ',
        increase: '+3,550,000,000 đ',
        decrease: '-3,400,000,000 đ',
        finalBalance: '950,000,000 đ',
        statusText: 'Đã đối soát thành công',
        statusClass: 'badge-success'
      }
    ];
  },

  // Fee Difference Reports Data
  getFeeDiffReportsData() {
    return [
      {
        period: 'Kỳ Tháng 08/2026',
        merchantFee: '37,350,000 đ (1.0%)',
        partnerFee: '37,350,000 đ (1.0%)',
        diffAmount: '0 đ',
        note: 'Không có chênh lệch',
        statusText: 'Khớp 100%',
        statusClass: 'badge-success'
      },
      {
        period: 'Kỳ Tháng 07/2026',
        merchantFee: '41,200,000 đ',
        partnerFee: '41,180,000 đ',
        diffAmount: '+20,000 đ',
        note: 'Chênh lệch giao dịch hoàn 18/07',
        statusText: 'Đã xử lý chênh lệch',
        statusClass: 'badge-processing'
      }
    ];
  },

  // Reconcile Ecopay (Đối soát Giao dịch) Data
  getReconcileEcopayData() {
    return [
      {
        stt: 1,
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        reconcileCreatedTime: '22/08/2026 09:30:00',
        txnTimeRange: '21/08/2026 00:00 — 21/08/2026 23:59',
        totalPayable: '15,450,000 đ',
        txnFee: '154,500 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Nguyễn Văn A',
        totalDiscount: '50,000 đ',
        approvedBy: 'Trần Thị B (Kế toán)',
        partnerApprovedTime: '22/08/2026 10:15:00',
        description: 'Đối soát định kỳ giao dịch VietQR & POS ngày 21/08',
        reason: 'Hợp lệ & Khớp 100% dữ liệu',
        merchantPayTime: '22/08/2026 11:00:00',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      },
      {
        stt: 2,
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        reconcileCreatedTime: '22/08/2026 08:45:00',
        txnTimeRange: '21/08/2026 00:00 — 21/08/2026 23:59',
        totalPayable: '28,900,000 đ',
        txnFee: '289,000 đ',
        userFee: '0 đ',
        deductedAmount: '120,000 đ',
        createdBy: 'Phạm Thu Trang',
        totalDiscount: '100,000 đ',
        approvedBy: 'Trần Thị B (Kế toán)',
        partnerApprovedTime: '22/08/2026 09:30:00',
        description: 'Đối soát doanh thu QR Bank & Payment Link',
        reason: 'Đã cấn trừ phí duy trì hệ thống',
        merchantPayTime: '22/08/2026 10:00:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-processing'
      },
      {
        stt: 3,
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        reconcileCreatedTime: '21/08/2026 16:20:00',
        txnTimeRange: '20/08/2026 00:00 — 20/08/2026 23:59',
        totalPayable: '9,200,000 đ',
        txnFee: '92,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Vũ Đức Anh',
        totalDiscount: '20,000 đ',
        approvedBy: 'Lê Hoàng Nam (Giám đốc)',
        partnerApprovedTime: '21/08/2026 17:00:00',
        description: 'Đối soát ca chiều cửa hàng Hải Châu',
        reason: 'Dữ liệu khớp hoàn toàn',
        merchantPayTime: '21/08/2026 17:30:00',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-success'
      },
      {
        stt: 4,
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        reconcileCreatedTime: '21/08/2026 10:10:00',
        txnTimeRange: '20/08/2026 00:00 — 20/08/2026 23:59',
        totalPayable: '4,500,000 đ',
        txnFee: '45,000 đ',
        userFee: '0 đ',
        deductedAmount: '500,000 đ',
        createdBy: 'Nguyễn Văn A',
        totalDiscount: '0 đ',
        approvedBy: 'Trần Thị B (Kế toán)',
        partnerApprovedTime: '21/08/2026 11:00:00',
        description: 'Đối soát bổ sung giao dịch hoàn tiền',
        reason: 'Có 1 giao dịch lệch số tiền đối tác',
        merchantPayTime: '21/08/2026 11:30:00',
        statusText: 'Đang xử lý',
        statusClass: 'badge-warning'
      },
      {
        stt: 5,
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        reconcileCreatedTime: '20/08/2026 14:00:00',
        txnTimeRange: '19/08/2026 00:00 — 19/08/2026 23:59',
        totalPayable: '12,800,000 đ',
        txnFee: '128,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Phạm Thu Trang',
        totalDiscount: '30,000 đ',
        approvedBy: 'Trần Thị B (Kế toán)',
        partnerApprovedTime: '20/08/2026 15:00:00',
        description: 'Đối soát ca sáng chi nhánh Hoàn Kiếm',
        reason: 'Thanh toán đợt 1 thành công',
        merchantPayTime: '20/08/2026 15:30:00',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      }
    ];
  },

  // Reconcile v2 (Quản lý quyết toán) Data
  getReconcileV2Data() {
    return [
      {
        stt: 1,
        paymentId: 'PAY20260822001',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        paymentCreatedTime: '22/08/2026 17:30:00',
        paymentMethod: 'VietQR Pay (MB)',
        txnTimeRange: '21/08/2026 00:00 — 21/08/2026 23:59',
        totalPayable: '485,000,000 đ',
        txnFee: '4,850,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Nguyễn Văn A',
        totalDiscount: '1,500,000 đ',
        approvedBy: 'Trần Thị B (Kế toán trưởng)',
        partnerApprovedTime: '22/08/2026 18:00:00',
        description: 'Phiên quyết toán doanh thu T+0 ngày 22/08 Chi nhánh Quận 1',
        reason: 'Khớp 100% sao kê chuyển khoản ngân hàng đối tác',
        merchantPayTime: '22/08/2026 18:30:00',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      },
      {
        stt: 2,
        paymentId: 'PAY20260821002',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        paymentCreatedTime: '21/08/2026 18:00:00',
        paymentMethod: 'Thẻ ATM Nội địa',
        txnTimeRange: '20/08/2026 00:00 — 20/08/2026 23:59',
        totalPayable: '320,000,000 đ',
        txnFee: '3,200,000 đ',
        userFee: '0 đ',
        deductedAmount: '200,000 đ',
        createdBy: 'Phạm Thu Trang',
        totalDiscount: '800,000 đ',
        approvedBy: 'Trần Thị B (Kế toán trưởng)',
        partnerApprovedTime: '21/08/2026 18:45:00',
        description: 'Thanh toán quyết toán chu kỳ T+1 cho Chi nhánh Hoàn Kiếm',
        reason: 'Đã cấn trừ bù trừ chênh lệch phí kỳ trước',
        merchantPayTime: '21/08/2026 19:15:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-processing'
      },
      {
        stt: 3,
        paymentId: 'PAY20260821001',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        paymentCreatedTime: '21/08/2026 12:00:00',
        paymentMethod: 'QR Bank (MB)',
        txnTimeRange: '20/08/2026 00:00 — 20/08/2026 12:00',
        totalPayable: '175,000,000 đ',
        txnFee: '1,750,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Vũ Đức Anh',
        totalDiscount: '350,000 đ',
        approvedBy: 'Lê Hoàng Nam (Giám đốc)',
        partnerApprovedTime: '21/08/2026 12:45:00',
        description: 'Phiên quyết toán nhanh ca sáng chi nhánh Hải Châu',
        reason: 'Hồ sơ quyết toán đã được duyệt',
        merchantPayTime: '21/08/2026 13:15:00',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-success'
      },
      {
        stt: 4,
        paymentId: 'PAY20260820003',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        paymentCreatedTime: '20/08/2026 18:30:00',
        paymentMethod: 'Payment Link',
        txnTimeRange: '19/08/2026 00:00 — 19/08/2026 23:59',
        totalPayable: '240,000,000 đ',
        txnFee: '2,400,000 đ',
        userFee: '0 đ',
        deductedAmount: '1,000,000 đ',
        createdBy: 'Nguyễn Văn A',
        totalDiscount: '500,000 đ',
        approvedBy: 'Trần Thị B (Kế toán trưởng)',
        partnerApprovedTime: '20/08/2026 19:15:00',
        description: 'Quyết toán doanh thu Payment Link khách hàng VIP',
        reason: 'Đang kiểm tra khớp dữ liệu cổng Napas',
        merchantPayTime: '20/08/2026 19:45:00',
        statusText: 'Đang xử lý',
        statusClass: 'badge-warning'
      },
      {
        stt: 5,
        paymentId: 'PAY20260819001',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        paymentCreatedTime: '19/08/2026 17:00:00',
        paymentMethod: 'Thẻ Quốc Tế (Visa/Master)',
        txnTimeRange: '18/08/2026 00:00 — 18/08/2026 23:59',
        totalPayable: '95,000,000 đ',
        txnFee: '1,900,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Phạm Thu Trang',
        totalDiscount: '200,000 đ',
        approvedBy: 'Trần Thị B (Kế toán trưởng)',
        partnerApprovedTime: '19/08/2026 17:45:00',
        description: 'Quyết toán thẻ quốc tế định kỳ T+2',
        reason: 'Thanh toán thành công qua Vietcombank',
        merchantPayTime: '19/08/2026 18:15:00',
        statusText: 'Thành công',
        statusClass: 'badge-success'
      }
    ];
  }
};
