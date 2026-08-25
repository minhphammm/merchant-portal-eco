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

  // Reconcile Ecopay (Đối soát Giao dịch) Data - 20 Rich Mock Records
  getReconcileEcopayData() {
    return [
      {
        stt: 1,
        reconcileCode: 'R_1021078891',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        storeCode: 'ST-Q1-001',
        reconcileCreatedTime: '25/08/2026 09:30:00',
        txnTimeRange: '24/08/2026 00:00 — 24/08/2026 23:59',
        payMethod: 'QR Code (VietQR / QR Bank)',
        totalPayable: '45,850,000 đ',
        txnFee: '458,500 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Nguyễn Văn A',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát định kỳ giao dịch VietQR & POS ngày 24/08',
        reason: 'Hợp lệ & Khớp 100% dữ liệu',
        merchantPayTime: '25/08/2026 11:00:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 2,
        reconcileCode: 'R_1021078892',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        storeCode: 'ST-HK-002',
        reconcileCreatedTime: '25/08/2026 08:45:00',
        txnTimeRange: '24/08/2026 00:00 — 24/08/2026 23:59',
        payMethod: 'Thẻ học sinh',
        totalPayable: '128,900,000 đ',
        txnFee: '1,289,000 đ',
        userFee: '0 đ',
        deductedAmount: '1,200,000 đ',
        createdBy: 'Phạm Thu Trang',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát thu phí thẻ học sinh & bán canteen',
        reason: 'Đã cấn trừ phí quản lý hệ thống tháng 8',
        merchantPayTime: '25/08/2026 10:30:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 3,
        reconcileCode: 'R_1021078893',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        storeCode: 'ST-HC-003',
        reconcileCreatedTime: '24/08/2026 16:20:00',
        txnTimeRange: '23/08/2026 00:00 — 23/08/2026 23:59',
        payMethod: 'BNPL (Trả chậm)',
        totalPayable: '32,400,000 đ',
        txnFee: '648,000 đ',
        userFee: '15,000 đ',
        deductedAmount: '0 đ',
        createdBy: 'Vũ Đức Anh',
        approvedBy: 'Lê Hoàng Nam (Giám đốc)',
        description: 'Đối soát đợt 2 gói trả chậm BNPL Kredivo/Fundiin',
        reason: 'Dữ liệu khớp hoàn toàn với cổng ngân hàng',
        merchantPayTime: '24/08/2026 17:30:00',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-processing'
      },
      {
        stt: 4,
        reconcileCode: 'R_1021078894',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        storeCode: 'ST-Q1-001',
        reconcileCreatedTime: '24/08/2026 10:10:00',
        txnTimeRange: '23/08/2026 00:00 — 23/08/2026 23:59',
        payMethod: 'SoftPOS / Thẻ Ngân hàng',
        totalPayable: '18,500,000 đ',
        txnFee: '185,000 đ',
        userFee: '0 đ',
        deductedAmount: '500,000 đ',
        createdBy: 'Nguyễn Văn A',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát bổ sung giao dịch SoftPOS chạm thẻ Tap to Phone',
        reason: 'Có 1 giao dịch bị trùng mã tra soát, đang xử lý cấn trừ',
        merchantPayTime: '24/08/2026 11:30:00',
        statusText: 'Đang xử lý',
        statusClass: 'badge-warning'
      },
      {
        stt: 5,
        reconcileCode: 'R_1021078895',
        storeName: 'Chi nhánh Ninh Kiều - Cần Thơ',
        storeCode: 'ST-NK-004',
        reconcileCreatedTime: '23/08/2026 14:00:00',
        txnTimeRange: '22/08/2026 00:00 — 22/08/2026 23:59',
        payMethod: 'QR Code (VietQR / QR Bank)',
        totalPayable: '22,800,000 đ',
        txnFee: '228,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Đặng Văn Hùng',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát doanh thu QR Code MB Bank chi nhánh Ninh Kiều',
        reason: 'Thanh toán tự động T+1 thành công',
        merchantPayTime: '23/08/2026 15:30:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 6,
        reconcileCode: 'R_1021078896',
        storeName: 'Chi nhánh Hồng Bàng - Hải Phòng',
        storeCode: 'ST-HP-005',
        reconcileCreatedTime: '23/08/2026 09:15:00',
        txnTimeRange: '22/08/2026 00:00 — 22/08/2026 23:59',
        payMethod: 'Thẻ học sinh',
        totalPayable: '64,200,000 đ',
        txnFee: '642,000 đ',
        userFee: '0 đ',
        deductedAmount: '350,000 đ',
        createdBy: 'Nguyễn Minh Hoàng',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát nạp tiền thẻ học sinh trường THPT Hồng Bàng',
        reason: 'Khớp sao kê VietinBank',
        merchantPayTime: '23/08/2026 10:45:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 7,
        reconcileCode: 'R_1021078897',
        storeName: 'Chi nhánh Thủ Đức - Hồ Chí Minh',
        storeCode: 'ST-TD-007',
        reconcileCreatedTime: '22/08/2026 17:40:00',
        txnTimeRange: '21/08/2026 00:00 — 21/08/2026 23:59',
        payMethod: 'BNPL (Trả chậm)',
        totalPayable: '85,000,000 đ',
        txnFee: '1,700,000 đ',
        userFee: '50,000 đ',
        deductedAmount: '0 đ',
        createdBy: 'Trần Văn Bình',
        approvedBy: 'Lê Hoàng Nam (Giám đốc)',
        description: 'Đối soát giao dịch mua trả chậm đồ công nghệ',
        reason: 'Hồ sơ tài chính đã xác nhận duyệt',
        merchantPayTime: '22/08/2026 18:20:00',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-processing'
      },
      {
        stt: 8,
        reconcileCode: 'R_1021078898',
        storeName: 'Chi nhánh Tây Hồ - Hà Nội',
        storeCode: 'ST-TH-008',
        reconcileCreatedTime: '22/08/2026 11:05:00',
        txnTimeRange: '21/08/2026 00:00 — 21/08/2026 23:59',
        payMethod: 'SoftPOS / Thẻ Ngân hàng',
        totalPayable: '14,350,000 đ',
        txnFee: '143,500 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Hoàng Thị Yến',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát giao dịch thẻ Visa/Master qua POS di động',
        reason: 'Số liệu chênh lệch do ngân hàng treo tiền hủy giao dịch',
        merchantPayTime: '—',
        statusText: 'Từ chối',
        statusClass: 'badge-danger'
      },
      {
        stt: 9,
        reconcileCode: 'R_1021078899',
        storeName: 'Chi nhánh Cầu Giấy - Hà Nội',
        storeCode: 'ST-CG-009',
        reconcileCreatedTime: '21/08/2026 15:30:00',
        txnTimeRange: '20/08/2026 00:00 — 20/08/2026 23:59',
        payMethod: 'QR Code (VietQR / QR Bank)',
        totalPayable: '53,100,000 đ',
        txnFee: '531,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Đỗ Tiến Dũng',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát doanh số bán vé sự kiện qua VietQR',
        reason: 'Đã chuyển tiền về tài khoản MB Bank',
        merchantPayTime: '21/08/2026 16:45:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 10,
        reconcileCode: 'R_1021078900',
        storeName: 'Chi nhánh Quận 3 - Hồ Chí Minh',
        storeCode: 'ST-Q3-010',
        reconcileCreatedTime: '21/08/2026 08:20:00',
        txnTimeRange: '20/08/2026 00:00 — 20/08/2026 23:59',
        payMethod: 'Thẻ học sinh',
        totalPayable: '91,500,000 đ',
        txnFee: '915,000 đ',
        userFee: '0 đ',
        deductedAmount: '450,000 đ',
        createdBy: 'Nguyễn Văn An',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát quẹt thẻ điểm danh & ăn trưa học sinh',
        reason: 'Đã cấn trừ chi phí in lại thẻ lỗi',
        merchantPayTime: '21/08/2026 09:30:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 11,
        reconcileCode: 'R_1021078901',
        storeName: 'Chi nhánh Thanh Xuân - Hà Nội',
        storeCode: 'ST-TX-011',
        reconcileCreatedTime: '20/08/2026 16:50:00',
        txnTimeRange: '19/08/2026 00:00 — 19/08/2026 23:59',
        payMethod: 'BNPL (Trả chậm)',
        totalPayable: '41,000,000 đ',
        txnFee: '820,000 đ',
        userFee: '20,000 đ',
        deductedAmount: '0 đ',
        createdBy: 'Lê Minh Tuấn',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát kỳ 1 đơn hàng điện máy trả chậm',
        reason: 'Hồ sơ chờ đối tác bổ sung chứng từ',
        merchantPayTime: '—',
        statusText: 'Đang xử lý',
        statusClass: 'badge-warning'
      },
      {
        stt: 12,
        reconcileCode: 'R_1021078902',
        storeName: 'Chi nhánh Quận 5 - Hồ Chí Minh',
        storeCode: 'ST-Q5-012',
        reconcileCreatedTime: '20/08/2026 10:15:00',
        txnTimeRange: '19/08/2026 00:00 — 19/08/2026 23:59',
        payMethod: 'SoftPOS / Thẻ Ngân hàng',
        totalPayable: '27,600,000 đ',
        txnFee: '276,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Đỗ Quốc Huy',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát thanh toán quẹt thẻ máy SoftPOS Android',
        reason: 'Đã hoàn tất thanh toán doanh nghiệp',
        merchantPayTime: '20/08/2026 11:30:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 13,
        reconcileCode: 'R_1021078903',
        storeName: 'Chi nhánh Sơn Trà - Đà Nẵng',
        storeCode: 'ST-ST-013',
        reconcileCreatedTime: '19/08/2026 14:40:00',
        txnTimeRange: '18/08/2026 00:00 — 18/08/2026 23:59',
        payMethod: 'QR Code (VietQR / QR Bank)',
        totalPayable: '38,900,000 đ',
        txnFee: '389,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Phan Văn Phú',
        approvedBy: 'Lê Hoàng Nam (Giám đốc)',
        description: 'Đối soát dịch vụ lưu trú du lịch QR Code',
        reason: 'Hợp lệ & Đã duyệt chi',
        merchantPayTime: '19/08/2026 15:45:00',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-processing'
      },
      {
        stt: 14,
        reconcileCode: 'R_1021078904',
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        storeCode: 'ST-Q1-001',
        reconcileCreatedTime: '19/08/2026 09:00:00',
        txnTimeRange: '18/08/2026 00:00 — 18/08/2026 23:59',
        payMethod: 'Thẻ học sinh',
        totalPayable: '115,000,000 đ',
        txnFee: '1,150,000 đ',
        userFee: '0 đ',
        deductedAmount: '800,000 đ',
        createdBy: 'Nguyễn Văn A',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát định kỳ mua thiết bị học tập qua thẻ học sinh',
        reason: 'Khớp dữ liệu cổng thanh toán Ecopay',
        merchantPayTime: '19/08/2026 10:15:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 15,
        reconcileCode: 'R_1021078905',
        storeName: 'Chi nhánh Ba Đình - Hà Nội',
        storeCode: 'ST-BD-015',
        reconcileCreatedTime: '18/08/2026 17:10:00',
        txnTimeRange: '17/08/2026 00:00 — 17/08/2026 23:59',
        payMethod: 'SoftPOS / Thẻ Ngân hàng',
        totalPayable: '8,400,000 đ',
        txnFee: '84,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Bùi Thị Hà',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát hủy giao dịch do đơn hàng bị hủy bỏ',
        reason: 'Yêu cầu hủy phiếu đối soát từ phía doanh nghiệp',
        merchantPayTime: '—',
        statusText: 'Hủy',
        statusClass: 'badge-danger'
      },
      {
        stt: 16,
        reconcileCode: 'R_1021078906',
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        storeCode: 'ST-HK-002',
        reconcileCreatedTime: '18/08/2026 11:30:00',
        txnTimeRange: '17/08/2026 00:00 — 17/08/2026 23:59',
        payMethod: 'QR Code (VietQR / QR Bank)',
        totalPayable: '76,500,000 đ',
        txnFee: '765,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Phạm Thu Trang',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát chuyển khoản QR Code cửa hàng Hoàn Kiếm',
        reason: 'Đã chuyển khoản giải ngân T+1',
        merchantPayTime: '18/08/2026 13:00:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 17,
        reconcileCode: 'R_1021078907',
        storeName: 'Chi nhánh Bình Thạnh - Hồ Chí Minh',
        storeCode: 'ST-BT-017',
        reconcileCreatedTime: '17/08/2026 16:00:00',
        txnTimeRange: '16/08/2026 00:00 — 16/08/2026 23:59',
        payMethod: 'BNPL (Trả chậm)',
        totalPayable: '62,000,000 đ',
        txnFee: '1,240,000 đ',
        userFee: '30,000 đ',
        deductedAmount: '0 đ',
        createdBy: 'Võ Minh Triết',
        approvedBy: 'Lê Hoàng Nam (Giám đốc)',
        description: 'Đối soát hợp đồng trả chậm chu kỳ 15 ngày',
        reason: 'Đã phê duyệt hồ sơ quyết toán',
        merchantPayTime: '17/08/2026 17:15:00',
        statusText: 'Đã phê duyệt',
        statusClass: 'badge-processing'
      },
      {
        stt: 18,
        reconcileCode: 'R_1021078908',
        storeName: 'Chi nhánh Ngô Quyền - Vinh',
        storeCode: 'ST-VI-006',
        reconcileCreatedTime: '17/08/2026 10:20:00',
        txnTimeRange: '16/08/2026 00:00 — 16/08/2026 23:59',
        payMethod: 'QR Code (VietQR / QR Bank)',
        totalPayable: '19,750,000 đ',
        txnFee: '197,500 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Phạm Hoàng Yến',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát chuyển tiền loa báo giao dịch VietQR',
        reason: 'Thanh toán thành công qua VietinBank',
        merchantPayTime: '17/08/2026 11:30:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 19,
        reconcileCode: 'R_1021078909',
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        storeCode: 'ST-HC-003',
        reconcileCreatedTime: '16/08/2026 15:10:00',
        txnTimeRange: '15/08/2026 00:00 — 15/08/2026 23:59',
        payMethod: 'Thẻ học sinh',
        totalPayable: '88,300,000 đ',
        txnFee: '883,000 đ',
        userFee: '0 đ',
        deductedAmount: '200,000 đ',
        createdBy: 'Vũ Đức Anh',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát nạp tiền thẻ trả trước học sinh cuối tuần',
        reason: 'Khớp 100% sao kê ngân hàng đối tác',
        merchantPayTime: '16/08/2026 16:30:00',
        statusText: 'Đã thanh toán',
        statusClass: 'badge-success'
      },
      {
        stt: 20,
        reconcileCode: 'R_1021078910',
        storeName: 'Chi nhánh Hồng Bàng - Hải Phòng',
        storeCode: 'ST-HP-005',
        reconcileCreatedTime: '16/08/2026 09:45:00',
        txnTimeRange: '15/08/2026 00:00 — 15/08/2026 23:59',
        payMethod: 'SoftPOS / Thẻ Ngân hàng',
        totalPayable: '31,500,000 đ',
        txnFee: '315,000 đ',
        userFee: '0 đ',
        deductedAmount: '0 đ',
        createdBy: 'Nguyễn Minh Hoàng',
        approvedBy: 'Trần Thị B (Kế toán)',
        description: 'Đối soát máy POS cầm tay Hải Phòng',
        reason: 'Đang tra soát với ngân hàng Sacombank',
        merchantPayTime: '—',
        statusText: 'Đang xử lý',
        statusClass: 'badge-warning'
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
  },

  // Danh Sách Cửa Hàng (Quản trị cửa hàng) Data - 17 Fields Exact
  getStoresData() {
    return [
      {
        stt: 1,
        storeName: 'Chi nhánh Quận 1 - Hồ Chí Minh',
        storeCode: 'ST-Q1-001',
        qrIdentifierCode: 'QR-GFCAPITAL5-Q1',
        deviceCode: 'EDC-POS-8891',
        businessType: 'Nhà hàng & F&B',
        storePhone: '0903 123 456',
        paymentMethodType: 'VietQR / Thẻ ATM / Payment Link',
        paymentAccount: '1905 8888 9999 (Techcombank)',
        address: 'Chợ Bến Thành, Quận 1, TP. Hồ Chí Minh',
        ecoWalletNumber: '0903123456',
        salesPhone: '0988 777 666 (Nguyễn Văn Nam)',
        createdDate: '15/01/2026 09:00:00',
        approvedDate: '15/01/2026 14:30:00',
        reconciliationMethod: 'T+1 Tự động (MB Bank)',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success'
      },
      {
        stt: 2,
        storeName: 'Chi nhánh Hoàn Kiếm - Hà Nội',
        storeCode: 'ST-HK-002',
        qrIdentifierCode: 'QR-GFCAPITAL5-HK',
        deviceCode: 'EDC-POS-8892',
        businessType: 'Bán lẻ & Siêu thị mini',
        storePhone: '0912 345 678',
        paymentMethodType: 'VietQR / QR Bank',
        paymentAccount: '0011 2233 4455 (Vietcombank)',
        address: 'Phố Cổ, Q. Hoàn Kiếm, Hà Nội',
        ecoWalletNumber: '0912345678',
        salesPhone: '0977 112 233 (Lê Thu Hà)',
        createdDate: '20/02/2026 10:15:00',
        approvedDate: '20/02/2026 15:00:00',
        reconciliationMethod: 'T+0 Tức thì (Vietcombank)',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success'
      },
      {
        stt: 3,
        storeName: 'Chi nhánh Hải Châu - Đà Nẵng',
        storeCode: 'ST-HC-003',
        qrIdentifierCode: 'QR-GFCAPITAL5-HC',
        deviceCode: 'EDC-POS-8893',
        businessType: 'Khách sạn & Du lịch',
        storePhone: '0935 999 888',
        paymentMethodType: 'Thẻ Quốc Tế (Visa/Master)',
        paymentAccount: '0400 5566 7788 (Sacombank)',
        address: 'Đường Bạch Đằng, Q. Hải Châu, Đà Nẵng',
        ecoWalletNumber: '0935999888',
        salesPhone: '0905 443 322 (Trần Quốc Bảo)',
        createdDate: '10/03/2026 08:30:00',
        approvedDate: '10/03/2026 11:45:00',
        reconciliationMethod: 'T+1 Tự động (VPBank)',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success'
      },
      {
        stt: 4,
        storeName: 'Chi nhánh Ninh Kiều - Cần Thơ',
        storeCode: 'ST-NK-004',
        qrIdentifierCode: 'QR-GFCAPITAL5-NK',
        deviceCode: 'EDC-POS-8894',
        businessType: 'Dịch vụ Spa & Làm đẹp',
        storePhone: '0949 111 222',
        paymentMethodType: 'VietQR / Payment Link',
        paymentAccount: '1020 3040 5060 (MB Bank)',
        address: 'Đại lộ Hòa Bình, Q. Ninh Kiều, Cần Thơ',
        ecoWalletNumber: '0949111222',
        salesPhone: '0939 887 766 (Đặng Văn Hùng)',
        createdDate: '05/04/2026 14:00:00',
        approvedDate: '05/04/2026 16:30:00',
        reconciliationMethod: 'T+1 Tự động (Techcombank)',
        statusText: 'Đang chờ duyệt',
        statusClass: 'badge-warning'
      },
      {
        stt: 5,
        storeName: 'Chi nhánh Hồng Bàng - Hải Phòng',
        storeCode: 'ST-HP-005',
        qrIdentifierCode: 'QR-GFCAPITAL5-HP',
        deviceCode: 'EDC-POS-8895',
        businessType: 'Thời trang & Mỹ phẩm',
        storePhone: '0904 555 666',
        paymentMethodType: 'VietQR / Thẻ ATM / QR Bank',
        paymentAccount: '1903 6677 8899 (Techcombank)',
        address: 'Phố Trần Hưng Đạo, Q. Hồng Bàng, Hải Phòng',
        ecoWalletNumber: '0904555666',
        salesPhone: '0913 221 100 (Nguyễn Minh Hoàng)',
        createdDate: '12/05/2026 11:20:00',
        approvedDate: '12/05/2026 15:10:00',
        reconciliationMethod: 'T+1 Tự động (MB Bank)',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success'
      },
      {
        stt: 6,
        storeName: 'Chi nhánh Ngô Quyền - Vinh',
        storeCode: 'ST-VI-006',
        qrIdentifierCode: 'QR-GFCAPITAL5-VI',
        deviceCode: 'EDC-POS-8896',
        businessType: 'Quán Cafe & Trà sữa',
        storePhone: '0983 444 333',
        paymentMethodType: 'VietQR / Loa thông báo GD',
        paymentAccount: '1088 9900 1122 (VietinBank)',
        address: 'Đường Nguyễn Văn Cừ, TP. Vinh, Nghệ An',
        ecoWalletNumber: '0983444333',
        salesPhone: '0968 554 433 (Phạm Hoàng Yến)',
        createdDate: '18/06/2026 09:40:00',
        approvedDate: '18/06/2026 13:20:00',
        reconciliationMethod: 'T+0 Tức thì (Vietcombank)',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success'
      },
      {
        stt: 7,
        storeName: 'Chi nhánh Thủ Dầu Một - Bình Dương',
        storeCode: 'ST-BD-007',
        qrIdentifierCode: 'QR-GFCAPITAL5-BD',
        deviceCode: 'EDC-POS-8897',
        businessType: 'Siêu thị điện máy',
        storePhone: '0908 777 999',
        paymentMethodType: 'VietQR / Thẻ Visa / Payment Link',
        paymentAccount: '0601 2233 4455 (ACB)',
        address: 'Đại lộ Bình Dương, TP. Thủ Dầu Một, Bình Dương',
        ecoWalletNumber: '0908777999',
        salesPhone: '0909 332 211 (Trịnh Quốc Tuấn)',
        createdDate: '22/07/2026 15:30:00',
        approvedDate: '22/07/2026 17:00:00',
        reconciliationMethod: 'T+1 Tự động (ACB)',
        statusText: 'Đang hoạt động',
        statusClass: 'badge-success'
      },
      {
        stt: 8,
        storeName: 'Chi nhánh Biên Hòa - Đồng Nai',
        storeCode: 'ST-BH-008',
        qrIdentifierCode: 'QR-GFCAPITAL5-BH',
        deviceCode: 'EDC-POS-8898',
        businessType: 'Trung tâm Vui chơi & Giải trí',
        storePhone: '0918 222 333',
        paymentMethodType: 'VietQR / QR Bank',
        paymentAccount: '0500 8899 0011 (Sacombank)',
        address: 'Đường Phạm Văn Thuận, TP. Biên Hòa, Đồng Nai',
        ecoWalletNumber: '0918222333',
        salesPhone: '0978 990 011 (Lương Văn Phúc)',
        createdDate: '10/08/2026 10:00:00',
        approvedDate: '10/08/2026 14:15:00',
        reconciliationMethod: 'T+1 Tự động (VPBank)',
        statusText: 'Tạm ngưng',
        statusClass: 'badge-warning'
      }
    ];
  },

  // ----------------------------------------------------
  // ECOPAY CASHLESS & ECO WALLET DATA
  // ----------------------------------------------------
  cashlessState: {
    availableBalance: 1245000000,
    ecoWalletBalance: 350000000,
    pendingFrozenAmount: 55000000,
    totalBalance: 1595000000,
    lastUpdated: '18/06/2026 14:00'
  },

  recentDisbursementRequests: [
    { id: 'YC25061809120001', time: '18/06/2026 09:12', amount: 120000000, type: 'Rút tiền', recipient: 'TK chính - Techcombank (1905...1234)', method: 'IBFT Tự động', status: 'success', statusText: 'Thành công', statusClass: 'badge-success' },
    { id: 'YC25061715280001', time: '17/06/2026 15:28', amount: 80000000, type: 'Chi hộ', recipient: 'Ví ECO - 0988 777 666 (Nguyễn Văn Hùng)', method: 'Ví ECO', status: 'failed', statusText: 'Thất bại', statusClass: 'badge-danger' },
    { id: 'YC25061711030001', time: '17/06/2026 11:03', amount: 150000000, type: 'Rút tiền', recipient: 'TK phụ - Vietcombank (0011...5678)', method: 'IBFT Tự động', status: 'success', statusText: 'Thành công', statusClass: 'badge-success' },
    { id: 'YC25061610210001', time: '16/06/2026 10:21', amount: 200000000, type: 'Chi hộ theo lô', recipient: 'File Excel (15 giao dịch chi)', method: 'IBFT Batch', status: 'init', statusText: 'Khởi tạo', statusClass: 'badge-gray' },
    { id: 'YC25061409450001', time: '14/06/2026 09:45', amount: 100000000, type: 'Rút tiền', recipient: 'TK chính - Techcombank (1905...1234)', method: 'IBFT Tự động', status: 'processing', statusText: 'Đang xử lý', statusClass: 'badge-warning' }
  ],

  linkedAccounts: [
    { id: 1, accountName: 'TK chính - Techcombank', cardHolder: 'CÔNG TY TNHH ABC', accountNumber: '1905 **** **** 1234', bankName: 'Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)', bankLogo: 'https://img.vietqr.io/image/TCB-logo.png', type: 'Bank', isDefault: true },
    { id: 2, accountName: 'TK phụ - Vietcombank', cardHolder: 'CÔNG TY TNHH ABC', accountNumber: '0011 **** **** 5678', bankName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)', bankLogo: 'https://img.vietqr.io/image/VCB-logo.png', type: 'Bank', isDefault: false },
    { id: 3, accountName: 'Ví ECO Mở Rộng', cardHolder: 'CÔNG TY TNHH ABC', accountNumber: '8888 **** **** 9999', bankName: 'Ngân hàng TMCP Á Châu (ACB)', bankLogo: 'https://img.vietqr.io/image/ACB-logo.png', type: 'Bank', isDefault: false }
  ],

  legalDocs: [
    { stt: 1, title: 'Giấy chứng nhận đăng ký doanh nghiệp', fileType: 'PDF', status: 'Đã duyệt', date: '15/03/2022' },
    { stt: 2, title: 'Giấy chứng nhận mã số thuế', fileType: 'PDF', status: 'Đã duyệt', date: '15/03/2022' },
    { stt: 3, title: 'Điều lệ công ty', fileType: 'PDF', status: 'Đã duyệt', date: '15/03/2022' },
    { stt: 4, title: 'Giấy ủy quyền người đại diện', fileType: 'PDF', status: 'Đã duyệt', date: '15/03/2022' },
    { stt: 5, title: 'CMND/CCCD người đại diện pháp luật', fileType: 'JPG', status: 'Đã duyệt', date: '15/03/2022' }
  ],

  userAccounts: [
    { stt: 1, name: 'Nguyễn Văn An', username: 'mvanan', phone: '0901 234 567', email: 'an.nguyen@abc.com', store: 'Cửa hàng Q1', createdTime: '20/05/2024 09:15', status: 'active', statusText: 'Hoạt động', statusClass: 'badge-success' },
    { stt: 2, name: 'Trần Thị Bích Ngọc', username: 'ttbngoc', phone: '0902 345 678', email: 'ngoc.tran@abc.com', store: 'Cửa hàng Q3', createdTime: '18/04/2024 14:30', status: 'active', statusText: 'Hoạt động', statusClass: 'badge-success' },
    { stt: 3, name: 'Lê Minh Tuấn', username: 'lmtuan', phone: '0903 456 789', email: 'tuan.le@abc.com', store: 'Cửa hàng Q3', createdTime: '12/03/2024 10:05', status: 'temp_locked', statusText: 'Tạm khóa', statusClass: 'badge-warning' },
    { stt: 4, name: 'Phạm Hoàng Yến', username: 'phyen', phone: '0904 567 890', email: 'yen.pham@abc.com', store: 'Cửa hàng Q1', createdTime: '05/02/2024 16:45', status: 'active', statusText: 'Hoạt động', statusClass: 'badge-success' },
    { stt: 5, name: 'Đỗ Quốc Huy', username: 'dqhuy', phone: '0905 678 901', email: 'huy.do@abc.com', store: 'Cửa hàng Q5', createdTime: '15/01/2024 11:20', status: 'inactive', statusText: 'Ngưng hoạt động', statusClass: 'badge-danger' }
  ],

  getStatementLedger() {
    return [
      { stt: 1, time: '20/08/2026 15:32:08', txnId: 'GD2026082000101', partnerTxnId: 'FT20268891001', payerInfo: '079****1000 - Nguyễn Thị Huỳnh Như', customerName: 'Nguyễn Thị Huỳnh Như', credit: 60000, debit: 0, fee: 870, balanceBefore: 161425826951, balanceAfter: 161364156951 },
      { stt: 2, time: '20/08/2026 15:12:08', txnId: 'GD2026082000102', partnerTxnId: 'FT20268891002', payerInfo: '079****1000 - Nguyễn Thị Huỳnh Như', customerName: 'Nguyễn Thị Huỳnh Như', credit: 15000, debit: 0, fee: 217.5, balanceBefore: 161440826951, balanceAfter: 161424805451 },
      { stt: 3, time: '20/08/2026 14:45:12', txnId: 'YC25061809120001', partnerTxnId: 'IBFT2026082099', payerInfo: 'TK chính - Techcombank', customerName: 'Rút tiền tài khoản ECOPAY', credit: 0, debit: 120000000, fee: 0, balanceBefore: 161560826951, balanceAfter: 161440826951 },
      { stt: 4, time: '20/08/2026 14:10:00', txnId: 'GD2026082000103', partnerTxnId: 'FT20268891003', payerInfo: '079****1000 - Nguyễn Thị Huỳnh Như', customerName: 'Nguyễn Thị Huỳnh Như', credit: 10000, debit: 0, fee: 114.5, balanceBefore: 161450826951, balanceAfter: 161440826951 },
      { stt: 5, time: '20/08/2026 13:55:40', txnId: 'GD2026082000104', partnerTxnId: 'FT20268891004', payerInfo: '079****1000 - Nguyễn Thị Huỳnh Như', customerName: 'Nguyễn Thị Huỳnh Như', credit: 50000, debit: 0, fee: 10000, balanceBefore: 161500826951, balanceAfter: 161450826951 }
    ];
  },

  createDisbursementRequest(reqData) {
    const amount = Number(reqData.amount) || 0;
    if (amount > this.cashlessState.availableBalance) {
      return { success: false, message: 'Số tiền yêu cầu vượt quá số dư khả dụng hiện tại (' + this.cashlessState.availableBalance.toLocaleString('vi-VN') + ' đ)' };
    }
    const now = new Date();
    const timeStr = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const reqId = 'YC' + now.getFullYear().toString().substr(2) + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') + Math.floor(100000 + Math.random()*900000);

    const newReq = { id: reqId, time: timeStr, amount: amount, type: reqData.type || 'Rút tiền', recipient: reqData.recipient || 'Tài khoản ngân hàng', method: reqData.method || 'IBFT Tự động', status: 'success', statusText: 'Thành công', statusClass: 'badge-success' };

    this.cashlessState.availableBalance -= amount;
    this.cashlessState.totalBalance -= amount;
    this.recentDisbursementRequests.unshift(newReq);
    return { success: true, request: newReq, newBalance: this.cashlessState.availableBalance };
  },

  setDefaultLinkedAccount(accountId) {
    this.linkedAccounts.forEach(acc => { acc.isDefault = (acc.id === accountId); });
    return true;
  },

  createUserAccount(userObj) {
    const newStt = this.userAccounts.length + 1;
    const now = new Date();
    const timeStr = now.toLocaleDateString('vi-VN') + ' ' + now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const newUser = { stt: newStt, name: userObj.name, username: userObj.username, phone: userObj.phone, email: userObj.email, store: userObj.store || 'Tất cả cửa hàng', createdTime: timeStr, status: 'active', statusText: 'Hoạt động', statusClass: 'badge-success' };
    this.userAccounts.unshift(newUser);
    return newUser;
  },

  // ----------------------------------------------------
  // BRD STAFF MANAGEMENT & ACCOUNT AUDIT LOG MOCK DATA
  // ----------------------------------------------------
  getStaffListBRD() {
    return [
      {
        id: 'NV000001',
        group: 'manager',
        groupName: 'Nhóm Quản lý',
        name: 'Phạm Văn Minh',
        firstName: 'Minh',
        middleName: 'Văn',
        lastName: 'Phạm',
        role: 'Quản lý Doanh nghiệp',
        dob: '15/05/1990',
        email: 'minh.pham@finviet.com.vn',
        mobile: '0909 123 456',
        homePhone: '028 3811 2233',
        workPhone: '0909 123 456',
        address: { street: '123 Nguyễn Huệ', street2: 'Tầng 10 Tòa nhà ABC', region: 'Miền Nam', city: 'TP. Hồ Chí Minh', state: 'Quận 1', zip: '700000' },
        notes: 'Quản lý cấp cao phụ trách toàn bộ hệ thống chi nhánh',
        branchOption: 'all',
        branches: ['Tất cả chi nhánh'],
        status: 'active',
        statusText: 'Đang làm việc',
        statusClass: 'badge-success',
        permissions: { appLogin: true, isAdmin: true, reqPin: true, manageProducts: true, adjustInventory: true, manageDiscounts: true, deleteCustomer: true }
      },
      {
        id: 'NV000002',
        group: 'manager',
        groupName: 'Nhóm Quản lý',
        name: 'Nguyễn Thị Hoa',
        firstName: 'Hoa',
        middleName: 'Thị',
        lastName: 'Nguyễn',
        role: 'Cửa hàng trưởng',
        dob: '20/08/1992',
        email: 'hoa.nguyen@finviet.com.vn',
        mobile: '0918 887 766',
        homePhone: '',
        workPhone: '0918 887 766',
        address: { street: '45 Lê Lợi', street2: '', region: 'Miền Nam', city: 'TP. Hồ Chí Minh', state: 'Quận 1', zip: '700000' },
        notes: 'Cửa hàng trưởng chi nhánh Quận 1',
        branchOption: 'custom',
        branches: ['Chi nhánh Quận 1 - HCM'],
        status: 'active',
        statusText: 'Đang làm việc',
        statusClass: 'badge-success',
        permissions: { appLogin: true, isAdmin: false, reqPin: true, manageProducts: true, adjustInventory: true }
      },
      {
        id: 'NV000003',
        group: 'manager',
        groupName: 'Nhóm Quản lý',
        name: 'Trần Văn Nam',
        firstName: 'Nam',
        middleName: 'Văn',
        lastName: 'Trần',
        role: 'Cửa hàng trưởng',
        dob: '10/11/1991',
        email: 'nam.tran@finviet.com.vn',
        mobile: '0933 112 233',
        homePhone: '',
        workPhone: '0933 112 233',
        address: { street: '88 Tràng Tiền', street2: '', region: 'Miền Bắc', city: 'Hà Nội', state: 'Hoàn Kiếm', zip: '100000' },
        notes: 'Cửa hàng trưởng chi nhánh Hoàn Kiếm',
        branchOption: 'custom',
        branches: ['Chi nhánh Hoàn Kiếm - Hà Nội'],
        status: 'active',
        statusText: 'Đang làm việc',
        statusClass: 'badge-success',
        permissions: { appLogin: true, isAdmin: false, reqPin: true, manageProducts: true }
      },
      {
        id: 'NV000004',
        group: 'staff',
        groupName: 'Nhóm Nhân viên',
        name: 'Lê Thị Mai',
        firstName: 'Mai',
        middleName: 'Thị',
        lastName: 'Lê',
        role: 'Thu ngân / Bán hàng',
        dob: '05/04/1995',
        email: 'mai.le@finviet.com.vn',
        mobile: '0977 445 566',
        homePhone: '',
        workPhone: '0977 445 566',
        address: { street: '12 Nguyễn Văn Linh', street2: '', region: 'Miền Trung', city: 'Đà Nẵng', state: 'Hải Châu', zip: '550000' },
        notes: 'Thu ngân chính chi nhánh Đà Nẵng',
        branchOption: 'custom',
        branches: ['Chi nhánh Hải Châu - Đà Nẵng'],
        status: 'active',
        statusText: 'Đang làm việc',
        statusClass: 'badge-success',
        permissions: { appLogin: true, isAdmin: false, reqPin: false }
      },
      {
        id: 'NV000005',
        group: 'staff',
        groupName: 'Nhóm Nhân viên',
        name: 'Hoàng Văn Dũng',
        firstName: 'Dũng',
        middleName: 'Văn',
        lastName: 'Hoàng',
        role: 'Kiểm kho / Giao nhận',
        dob: '18/09/1996',
        email: 'dung.hoang@finviet.com.vn',
        mobile: '0988 334 455',
        homePhone: '',
        workPhone: '0988 334 455',
        address: { street: '99 Võ Văn Tần', street2: '', region: 'Miền Nam', city: 'TP. Hồ Chí Minh', state: 'Quận 3', zip: '700000' },
        notes: 'Nhân viên kiểm kho tổng',
        branchOption: 'all',
        branches: ['Tất cả chi nhánh'],
        status: 'active',
        statusText: 'Đang làm việc',
        statusClass: 'badge-success',
        permissions: { appLogin: true, isAdmin: false }
      }
    ];
  },

  getAccountsBRD() {
    return [
      { id: 'ACC001', staffId: 'NV000001', name: 'Phạm Văn Minh', role: 'Quản lý Doanh nghiệp', email: 'minh.pham@finviet.com.vn', group: 'manager', groupName: 'Nhóm Quản lý', status: 'active', statusText: 'Còn hiệu lực', statusClass: 'badge-success', createdDate: '15/03/2022' },
      { id: 'ACC002', staffId: 'NV000002', name: 'Nguyễn Thị Hoa', role: 'Cửa hàng trưởng', email: 'hoa.nguyen@finviet.com.vn', group: 'manager', groupName: 'Nhóm Quản lý', status: 'active', statusText: 'Còn hiệu lực', statusClass: 'badge-success', createdDate: '10/05/2023' },
      { id: 'ACC003', staffId: 'NV000003', name: 'Trần Văn Nam', role: 'Cửa hàng trưởng', email: 'nam.tran@finviet.com.vn', group: 'manager', groupName: 'Nhóm Quản lý', status: 'active', statusText: 'Còn hiệu lực', statusClass: 'badge-success', createdDate: '12/08/2023' },
      { id: 'ACC004', staffId: 'NV000004', name: 'Lê Thị Mai', role: 'Thu ngân / Bán hàng', email: 'mai.le@finviet.com.vn', group: 'staff', groupName: 'Nhóm Nhân viên', status: 'active', statusText: 'Còn hiệu lực', statusClass: 'badge-success', createdDate: '01/02/2024' },
      { id: 'ACC005', staffId: 'NV000005', name: 'Hoàng Văn Dũng', role: 'Kiểm kho', email: 'dung.hoang@finviet.com.vn', group: 'staff', groupName: 'Nhóm Nhân viên', status: 'disabled', statusText: 'Đã vô hiệu hóa', statusClass: 'badge-danger', createdDate: '15/04/2024' }
    ];
  },

  getStaffActivitiesBRD() {
    return [
      { id: 'ACT001', time: '25/08/2026 11:20:15', staffName: 'Nguyễn Thị Hoa (Cửa hàng trưởng)', action: 'Hoàn tất thanh toán', actionClass: 'badge-success', entity: 'Đơn hàng #DH20260825001', entityType: 'order', orderId: 'GD2026082000101', detail: 'Thanh toán đơn hàng 1,250,000đ qua VietQR' },
      { id: 'ACT002', time: '25/08/2026 10:45:00', staffName: 'Phạm Văn Minh (Quản lý)', action: 'Đối soát Doanh số', actionClass: 'badge-primary', entity: 'Báo cáo đối soát #DS25082026', entityType: 'reconcile', detail: 'Thực hiện phê duyệt đối soát doanh số tuần' },
      { id: 'ACT003', time: '25/08/2026 09:30:12', staffName: 'Lê Thị Mai (Thu ngân)', action: 'Thu/Chi Tiền mặt', actionClass: 'badge-warning', entity: 'Ngăn đựng tiền (Két #01)', entityType: 'cashbox', detail: 'Rút 500,000đ tiền lẻ nộp tiền mặt đầu ca' },
      { id: 'ACT004', time: '24/08/2026 16:15:40', staffName: 'Nguyễn Thị Hoa (Cửa hàng trưởng)', action: 'Tạo mới Thẻ trả trước', actionClass: 'badge-success', entity: 'Khách hàng Nguyễn Văn A', entityType: 'customer', detail: 'Tạo thẻ trả trước VIP hạn mức 5,000,000đ' },
      { id: 'ACT005', time: '24/08/2026 14:00:22', staffName: 'Trần Văn Nam (Cửa hàng trưởng)', action: 'Sửa giá bán', actionClass: 'badge-processing', entity: 'Mặt hàng SP-0024 (Áo thun Eco)', entityType: 'item', detail: 'Điều chỉnh giá bán từ 250,000đ sang 220,000đ' },
      { id: 'ACT006', time: '24/08/2026 11:10:05', staffName: 'Hoàng Văn Dũng (Kiểm kho)', action: 'Điều chỉnh kho', actionClass: 'badge-gray', entity: 'Kho tổng Quận 1', entityType: 'inventory', detail: 'Cập nhật tồn kho thêm +50 sản phẩm' }
    ];
  }
};

