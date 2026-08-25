/**
 * Eco Merchant Portal - Sub-View Renderer Module
 * Renders rich interactive views matching PRD-ECOPAY-PAYLINK-01 v2.0
 */

const ViewRenderer = {
  renderPage(pageId) {
    const mainContent = document.querySelector('.content-area');
    if (!mainContent) return;

    let html = '';
    switch (pageId) {
      case 'enterprise':
        html = this.getEnterpriseView();
        break;
      case 'stores':
        html = this.getStoresView();
        break;
      case 'hr-mgmt':
      case 'accounts':
      case 'staff':
        html = this.getHrMgmtView();
        break;
      case 'devices-edc':
        html = this.getDevicesView('EDC');
        break;
      case 'devices-softpos':
        html = this.getDevicesView('SoftPOS');
        break;
      case 'devices-speaker':
        html = this.getDevicesView('Soundbox Speaker');
        break;
      case 'pay-txns':
        html = this.getPayTxnsView();
        break;
      case 'refund-txns':
        html = this.getRefundTxnsView();
        break;
      case 'pay-requests':
        html = this.getPayRequestsView();
        break;
      case 'ab-mgmt':
      case 'ab-history':
      case 'ab-shift':
        html = this.getAgentBankingView();
        break;
      case 'reconcile-ecopay':
      case 'reconcile-report':
        html = this.getReconcileEcopayView();
        break;
      case 'reconcile-v2':
      case 'statement':
        html = this.getReconcileV2View();
        break;
      case 'reconcile':
      case 'fee-diff':
      case 'balance-rpt':
      case 'statement':
        html = this.getSettlementView(pageId);
        break;
      case 'analytics':
        html = this.getAnalyticsView();
        break;
      default:
        html = `<div style="padding:40px; text-align:center;"><h2>Màn hình đang được cập nhật</h2></div>`;
    }

    mainContent.innerHTML = html;
    if (typeof i18n !== 'undefined' && i18n.updateDOM) i18n.updateDOM();
    if (window.initAntdSelects) window.initAntdSelects();
    if (window.refreshIcons) window.refreshIcons();
  },

  /**
   * Enterprise Management View (MC - Quản trị Doanh nghiệp PDF Spec)
   */
  getEnterpriseView() {
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Doanh nghiệp / <strong>Quản trị Doanh nghiệp</strong></div>
          <h1 class="subpage-title">Quản Trị Doanh Nghiệp</h1>
        </div>
        <button class="btn-primary" onclick="openRequestAdjustModal()">✍️ Yêu Cầu Điều Chỉnh Thông Tin</button>
      </div>

      <div class="enterprise-tabs-nav">
        <button class="ent-tab-btn active" onclick="switchEntTab('info')">Thông tin doanh nghiệp</button>
        <button class="ent-tab-btn" onclick="switchEntTab('history')">Lịch sử yêu cầu điều chỉnh</button>
      </div>

      <div id="entTabInfoContainer">
        <div class="table-card" style="margin-bottom:20px;">
          <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:var(--text-main);">1. Thông Tin Nhận Diện Doanh Nghiệp</div>
          <table class="portal-table">
            <thead>
              <tr>
                <th>MÃ DOANH NGHIỆP</th>
                <th>TÊN DOANH NGHIỆP</th>
                <th>LOGO</th>
                <th>MÃ QR</th>
                <th>MST / MÃ SỐ DN</th>
                <th>ĐỊA CHỈ TRỤ SỞ</th>
                <th>NGÀY ĐĂNG KÝ</th>
                <th>TRẠNG THÁI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="txn-code">DN000001</span></td>
                <td><strong>CÔNG TY TNHH ABC</strong></td>
                <td><div style="width:32px; height:32px; background:var(--color-primary-light); color:var(--color-primary); border-radius:6px; display:flex; align-items:center; justify-content:center; font-weight:800;">ABC</div></td>
                <td><span style="font-size:11px; background:#F1F5F9; padding:4px 8px; border-radius:4px; font-family:monospace;">[QR ECOPAY]</span></td>
                <td><strong>0101234567</strong></td>
                <td style="max-width:220px;">Tầng 10, Tòa nhà ABC, 123 Đường Lăng, Đống Đa, Hà Nội</td>
                <td>15/03/2022</td>
                <td><span class="status-badge badge-success">Hoạt động</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="enterprise-cards-grid">
          <div class="table-card">
            <h3 class="card-section-title"><i data-lucide="building-2" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> Thông Tin Doanh Nghiệp (Pháp Nhân)</h3>
            <div class="detail-row"><span class="detail-label">Loại hình doanh nghiệp:</span><span class="detail-val">Công ty TNHH 2 TV trở lên</span></div>
            <div class="detail-row"><span class="detail-label">Mã số thuế:</span><span class="detail-val">0101234567</span></div>
            <div class="detail-row"><span class="detail-label">Vốn điều lệ:</span><span class="detail-val" style="color:var(--color-primary);">810,000,000,000 VNĐ</span></div>
            <div class="detail-row"><span class="detail-label">Người đại diện pháp luật:</span><span class="detail-val">Nguyễn Văn A (Giám đốc)</span></div>
            <div class="detail-row"><span class="detail-label">Lĩnh vực kinh doanh:</span><span class="detail-val">Bán lẻ, Dịch vụ công nghệ</span></div>
            <div class="detail-row"><span class="detail-label">Ngày thành lập:</span><span class="detail-val">15/03/2022</span></div>

            <div class="info-banner-blue">
              <i data-lucide="info" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary); flex-shrink:0;"></i> Thông tin doanh nghiệp được quản lý bởi Finviet. Để cập nhật, vui lòng gửi yêu cầu điều chỉnh thông tin.
            </div>
          </div>

          <div class="table-card">
            <h3 class="card-section-title"><i data-lucide="user-check" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> Người Liên Hệ Chính</h3>
            <div class="detail-row"><span class="detail-label">Họ và tên:</span><span class="detail-val">Nguyễn Văn A</span></div>
            <div class="detail-row"><span class="detail-label">Chức vụ:</span><span class="detail-val">Giám đốc</span></div>
            <div class="detail-row"><span class="detail-label">Số điện thoại:</span><span class="detail-val">0901234567</span></div>
            <div class="detail-row"><span class="detail-label">Email liên hệ:</span><span class="detail-val">minh.pham@finviet.com.vn</span></div>
          </div>

          <div class="table-card">
            <h3 class="card-section-title"><i data-lucide="file-text" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> Hồ Sơ Pháp Lý</h3>
            <div class="legal-docs-list">
              <div class="doc-file-item" onclick="openDocPreviewModal('Giấy chứng nhận đăng ký doanh nghiệp')">
                <span class="file-icon"><i data-lucide="file" style="width:15px; height:15px; margin-right:6px; color:var(--color-primary);"></i></span>
                <span class="doc-name">1. Giấy chứng nhận đăng ký doanh nghiệp</span>
                <a href="javascript:void(0)" class="link-doc-view">Xem</a>
              </div>
              <div class="doc-file-item" onclick="openDocPreviewModal('Giấy chứng nhận mã số thuế')">
                <span class="file-icon"><i data-lucide="file" style="width:15px; height:15px; margin-right:6px; color:var(--color-primary);"></i></span>
                <span class="doc-name">2. Giấy chứng nhận mã số thuế</span>
                <a href="javascript:void(0)" class="link-doc-view">Xem</a>
              </div>
              <div class="doc-file-item" onclick="openDocPreviewModal('Điều lệ công ty')">
                <span class="file-icon"><i data-lucide="file" style="width:15px; height:15px; margin-right:6px; color:var(--color-primary);"></i></span>
                <span class="doc-name">3. Điều lệ công ty</span>
                <a href="javascript:void(0)" class="link-doc-view">Xem</a>
              </div>
              <div class="doc-file-item" onclick="openDocPreviewModal('Giấy ủy quyền đại diện')">
                <span class="file-icon"><i data-lucide="file" style="width:15px; height:15px; margin-right:6px; color:var(--color-primary);"></i></span>
                <span class="doc-name">4. Giấy ủy quyền (nếu có)</span>
                <a href="javascript:void(0)" class="link-doc-view">Xem</a>
              </div>
              <div class="doc-file-item" onclick="openDocPreviewModal('CMND/CCCD người đại diện pháp luật')">
                <span class="file-icon"><i data-lucide="file" style="width:15px; height:15px; margin-right:6px; color:var(--color-primary);"></i></span>
                <span class="doc-name">5. CMND/CCCD người đại diện</span>
                <a href="javascript:void(0)" class="link-doc-view">Xem</a>
              </div>
            </div>
          </div>
        </div>

        <div class="table-card" style="margin-top:20px;">
          <div class="table-header">
            <h3 class="table-title"><i data-lucide="landmark" style="width:16px; height:16px; margin-right:6px; color:var(--color-primary);"></i> Tài Khoản Nhận Tiền</h3>
          </div>
          <table class="portal-table">
            <thead>
              <tr>
                <th>TÊN TÀI KHOẢN</th>
                <th>SỐ TÀI KHOẢN</th>
                <th>NGÂN HÀNG</th>
                <th>MẶC ĐỊNH</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>TK chính - Techcombank</strong></td>
                <td><span class="txn-code">1905 **** **** 1234</span></td>
                <td><i data-lucide="building" style="width:14px; height:14px; margin-right:4px; color:var(--text-muted);"></i> Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)</td>
                <td><span class="status-badge badge-success">Mặc định</span></td>
              </tr>
              <tr>
                <td><strong>TK phụ - Vietcombank</strong></td>
                <td><span class="txn-code">0011 **** **** 5678</span></td>
                <td><i data-lucide="building" style="width:14px; height:14px; margin-right:4px; color:var(--text-muted);"></i> Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)</td>
                <td><span class="status-badge badge-processing">Tài khoản phụ</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="entTabHistoryContainer" style="display:none;">
        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Lịch Sử Yêu Cầu Điều Chỉnh Thông Tin</h3>
          </div>
          <table class="portal-table">
            <thead>
              <tr>
                <th>MÃ YÊU CẦU</th>
                <th>NGÀY GỬI</th>
                <th>PHÂN LOẠI THÔNG TIN</th>
                <th>TRẠNG THÁI</th>
                <th>GHI CHÚ / LÝ DO TỪ CHỐI</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span class="txn-code">REQ-20260817-0001</span></td>
                <td>17/08/2026 14:30</td>
                <td>Thay đổi Người đại diện pháp luật</td>
                <td><span class="status-badge badge-processing">Chờ xử lý</span></td>
                <td>Đang được nhân viên Finviet hỗ trợ rà soát hồ sơ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Stores View
   */
  getStoresView() {
    const list = MockData.getStoresData ? MockData.getStoresData() : [];
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Doanh nghiệp / <strong>Quản trị cửa hàng</strong></div>
          <h1 class="subpage-title">Quản Trị Cửa Hàng</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Danh sách cửa hàng, điểm bán và quản lý cấu hình thanh toán trong hệ thống Doanh nghiệp.</p>
        </div>
        <button class="btn-primary" onclick="openCreateStoreModal()">+ Thêm Cửa Hàng Mới</button>
      </div>

      <!-- BẢNG HIỂN THỊ DANH SÁCH CỬA HÀNG (17 COLUMNS EXACT) -->
      <div class="table-card">
        <div class="table-header" style="padding:14px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
          <span style="font-weight:700; font-size:14px; color:var(--text-main);">Hiển thị Danh sách cửa hàng (${list.length} cửa hàng)</span>
          <span class="status-badge badge-success">Đang hoạt động ổn định</span>
        </div>
        <div class="table-responsive" style="overflow-x:auto;">
          <table class="portal-table">
            <thead>
              <tr>
                <th style="white-space:nowrap;">stt</th>
                <th style="white-space:nowrap;">tên cửa hàng</th>
                <th style="white-space:nowrap;">mã cửa hàng</th>
                <th style="white-space:nowrap;">Mã định danh QR code</th>
                <th style="white-space:nowrap;">Mã thiết bị</th>
                <th style="white-space:nowrap;">Loại hình kinh doanh</th>
                <th style="white-space:nowrap;">Số điện thoại cửa hàng</th>
                <th style="white-space:nowrap;">Hình thức thanh toán</th>
                <th style="white-space:nowrap;">Tài khoản thanh toán</th>
                <th style="white-space:nowrap;">Địa chỉ</th>
                <th style="white-space:nowrap;">số ví Eco</th>
                <th style="white-space:nowrap;">Số điện thoại sale</th>
                <th style="white-space:nowrap;">Ngày tạo</th>
                <th style="white-space:nowrap;">ngày duyệt</th>
                <th style="white-space:nowrap;">Phương thức đối soát</th>
                <th style="white-space:nowrap;">Trạng thái</th>
                <th style="white-space:nowrap;">tùy chỉnh</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(item => `
                <tr>
                  <td><strong>${item.stt}</strong></td>
                  <td style="font-weight:700; color:var(--text-main); white-space:nowrap;">${item.storeName}</td>
                  <td><span class="txn-code">${item.storeCode}</span></td>
                  <td><span style="font-family:monospace; font-weight:600; color:var(--color-primary);">${item.qrIdentifierCode}</span></td>
                  <td><span style="font-family:monospace;">${item.deviceCode}</span></td>
                  <td style="font-size:12.5px; white-space:nowrap;">${item.businessType}</td>
                  <td style="font-family:monospace; white-space:nowrap;">${item.storePhone}</td>
                  <td style="font-size:12px; white-space:nowrap;">${item.paymentMethodType}</td>
                  <td style="font-size:12px; font-weight:600; white-space:nowrap;">${item.paymentAccount}</td>
                  <td style="font-size:12px; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.address}">${item.address}</td>
                  <td style="font-family:monospace; white-space:nowrap;">${item.ecoWalletNumber}</td>
                  <td style="font-size:12px; white-space:nowrap;">${item.salesPhone}</td>
                  <td style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${item.createdDate}</td>
                  <td style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${item.approvedDate}</td>
                  <td style="font-size:12px; font-weight:600; color:var(--color-secondary); white-space:nowrap;">${item.reconciliationMethod}</td>
                  <td><span class="status-badge ${item.statusClass}">${item.statusText}</span></td>
                  <td style="white-space:nowrap;">
                    <button class="btn-primary" style="padding:4px 10px; font-size:12px;" onclick="openStoreDetailModal(${item.stt})">Tùy chỉnh</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Human Resources Management View (Quản trị Nhân Lực - Merged Accounts & Staff)
   */
  getHrMgmtView() {
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Doanh nghiệp / <strong>Quản trị Nhân lực</strong></div>
          <h1 class="subpage-title">Quản Trị Nhân Lực</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Quản lý hợp nhất Tài khoản truy cập hệ thống và Danh sách Nhân viên phụ trách các cửa hàng.</p>
        </div>
        <button class="btn-primary" onclick="showToast('Mở form tạo Nhân viên / Tài khoản mới')">+ Thêm Nhân Viên / Tài Khoản Mới</button>
      </div>

      <div class="enterprise-cards-grid" style="margin-bottom:20px;">
        <div class="table-card">
          <h3 class="card-section-title">👥 Tổng Quan Nhân Sự</h3>
          <div class="detail-row"><span class="detail-label">Tổng số tài khoản:</span><span class="detail-val" style="color:var(--color-primary); font-weight:800;">12 tài khoản</span></div>
          <div class="detail-row"><span class="detail-label">Quản lý Doanh nghiệp:</span><span class="detail-val">2 tài khoản</span></div>
          <div class="detail-row"><span class="detail-label">Cửa hàng trưởng:</span><span class="detail-val">3 nhân sự</span></div>
          <div class="detail-row"><span class="detail-label">Thu ngân / Nhân viên:</span><span class="detail-val">7 nhân sự</span></div>
        </div>
        <div class="table-card">
          <h3 class="card-section-title">🔑 Phân Quyền & Hạn Mức</h3>
          <div class="detail-row"><span class="detail-label">Phân quyền vai trò:</span><span class="detail-val">Theo Cửa hàng & Doanh nghiệp</span></div>
          <div class="detail-row"><span class="detail-label">Quyền tạo Link thanh toán:</span><span class="detail-val">Quản lý & Cửa hàng trưởng</span></div>
          <div class="detail-row"><span class="detail-label">Trạng thái bảo mật:</span><span class="detail-val" style="color:var(--color-secondary); font-weight:700;">Đã bật 2FA</span></div>
        </div>
        <div class="table-card">
          <h3 class="card-section-title">⚡ Thao Tác Nhanh</h3>
          <div style="display:flex; flex-direction:column; gap:8px; margin-top:6px;">
            <button class="btn-secondary" onclick="showToast('Mở bảng phân quyền tài khoản')">🔑 Cấu Hình Phân Quyền Vai Trò</button>
            <button class="btn-secondary" onclick="showToast('Gửi link kích hoạt tài khoản hàng loạt')">📧 Gửi Link Kích Hoạt Hàng Loạt</button>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Danh Sách Tài Khoản & Nhân Viên Trong Hệ Thống</h3>
          <input type="text" placeholder="Tìm kiếm theo tên, email, sĐT..." style="padding:8px 14px; border-radius:6px; border:1px solid var(--border-color); width:280px;">
        </div>
        <table class="portal-table">
          <thead>
            <tr>
              <th>HỌ VÀ TÊN</th>
              <th>EMAIL TÀI KHOẢN</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th>VAI TRÒ PHÂN QUYỀN</th>
              <th>CỬA HÀNG PHỤ TRÁCH</th>
              <th>TRẠNG THÁI</th>
              <th>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Phạm Văn Minh</strong></td>
              <td>minh.pham@finviet.com.vn</td>
              <td style="font-family:monospace;">0909 123 456</td>
              <td><span class="status-badge badge-success">Quản lý DN</span></td>
              <td>Toàn hệ thống (3 Chi nhánh)</td>
              <td><span class="status-badge badge-success">Kích hoạt</span></td>
              <td><a href="javascript:void(0)" class="link-doc-view" onclick="showToast('Chỉnh sửa thông tin tài khoản Phạm Văn Minh')">Sửa</a></td>
            </tr>
            <tr>
              <td><strong>Nguyễn Thị Hoa</strong></td>
              <td>hoa.nguyen@finviet.com.vn</td>
              <td style="font-family:monospace;">0918 887 766</td>
              <td><span class="status-badge badge-processing">Cửa hàng trưởng</span></td>
              <td>Chi nhánh Quận 1 - Hồ Chí Minh</td>
              <td><span class="status-badge badge-success">Kích hoạt</span></td>
              <td><a href="javascript:void(0)" class="link-doc-view" onclick="showToast('Chỉnh sửa thông tin Nguyễn Thị Hoa')">Sửa</a></td>
            </tr>
            <tr>
              <td><strong>Trần Văn Nam</strong></td>
              <td>nam.tran@finviet.com.vn</td>
              <td style="font-family:monospace;">0933 112 233</td>
              <td><span class="status-badge badge-processing">Cửa hàng trưởng</span></td>
              <td>Chi nhánh Hoàn Kiếm - Hà Nội</td>
              <td><span class="status-badge badge-success">Kích hoạt</span></td>
              <td><a href="javascript:void(0)" class="link-doc-view" onclick="showToast('Chỉnh sửa thông tin Trần Văn Nam')">Sửa</a></td>
            </tr>
            <tr>
              <td><strong>Lê Thị Mai</strong></td>
              <td>mai.le@finviet.com.vn</td>
              <td style="font-family:monospace;">0977 445 566</td>
              <td><span class="status-badge badge-processing">Thu ngân / Nhân viên</span></td>
              <td>Chi nhánh Hải Châu - Đà Nẵng</td>
              <td><span class="status-badge badge-success">Kích hoạt</span></td>
              <td><a href="javascript:void(0)" class="link-doc-view" onclick="showToast('Chỉnh sửa thông tin Lê Thị Mai')">Sửa</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },

  /**
   * Payment Requests View (PRD-ECOPAY-PAYLINK-01 v2.0 Specification)
   */
  getPayRequestsView() {
    const payRequests = MockData.getPaymentRequestsData();
    const qrCodes = MockData.getBankQrCodesData();
    const smsQuotas = MockData.getSmsQuotaData();

    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Payment / <strong>Quản lý Yêu cầu Thanh toán (PRD v2.0)</strong></div>
          <h1 class="subpage-title">Quản Lý Yêu Cầu Thanh Toán & QR Bank</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Tạo & phát hành Payment Link đơn lẻ / hàng loạt, Quản lý QR Code MB/BVB và Hạn mức SMS.</p>
        </div>
      </div>

      <!-- Tab Navigation PRD v2.0 -->
      <div class="paylink-tabs-nav">
        <button class="paylink-tab-btn active" onclick="switchPaylinkTab('links')">📋 Danh sách Yêu cầu Thanh toán</button>
        <button class="paylink-tab-btn" onclick="switchPaylinkTab('qrbank')">🏦 Quản lý QR Code Ngân Hàng (MB & BVB)</button>
        <button class="paylink-tab-btn" onclick="switchPaylinkTab('smsquota')">💬 Quản lý Hạn mức SMS & Đối soát</button>
      </div>

      <!-- TAB 1: Danh sách Yêu cầu Thanh toán (Payment Link) -->
      <div id="paylinkTabLinks">
        <div class="table-card" style="margin-bottom:20px;">
          <div class="filter-grid-4col">
            <div class="form-group-field">
              <label>Mã đơn hàng / Mã YCTT</label>
              <input type="text" id="plFilterOrderCode" placeholder="Nhập mã đơn hàng...">
            </div>
            <div class="form-group-field">
              <label>Khách hàng (Tên / SĐT)</label>
              <input type="text" id="plFilterCustomer" placeholder="Nhập tên hoặc số điện thoại...">
            </div>
            <div class="form-group-field">
              <label>Cửa hàng phụ trách</label>
              <select id="plFilterStore">
                <option value="all">Tất cả cửa hàng</option>
                <option value="storeQ1">Chi nhánh Quận 1 - Hồ Chí Minh</option>
                <option value="storeQ3">Chi nhánh Hoàn Kiếm - Hà Nội</option>
                <option value="storeTB">Chi nhánh Hải Châu - Đà Nẵng</option>
              </select>
            </div>
            <div class="form-group-field">
              <label>Trạng thái yêu cầu</label>
              <select id="plFilterStatus">
                <option value="all">Tất cả trạng thái</option>
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="EXPIRED">Đã hết hạn</option>
                <option value="CANCELLED">Đã hủy đơn</option>
              </select>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px;">
            <button class="btn-secondary" onclick="showToast('Đã làm mới bộ lọc')">Làm lại</button>
            <button class="btn-primary" onclick="showToast('Đã áp dụng bộ lọc tìm kiếm Payment Link')">Tìm kiếm</button>
          </div>
        </div>

        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Danh Sách Yêu Cầu Thanh Toán</h3>
            <div style="display:flex; gap:10px;">
              <button class="btn-secondary" onclick="showToast('Xuất báo cáo 03 tháng gần nhất thành công')">📥 Xuất Excel (3T)</button>
              <button class="btn-secondary" onclick="openImportBatchModal()">📥 Import File Hàng Loạt</button>
              <button class="btn-primary" onclick="openCreateSinglePaylinkModal()">+ Tạo Yêu Cầu Đơn Lẻ</button>
            </div>
          </div>

          <table class="portal-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>MÃ ĐƠN HÀNG</th>
                <th>CỬA HÀNG</th>
                <th>KHÁCH HÀNG (SĐT / EMAIL)</th>
                <th>SỐ TIỀN</th>
                <th>KÊNH GỬI</th>
                <th>HẠN THANH TOÁN</th>
                <th>TRẠNG THÁI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              ${payRequests.map((item, index) => `
                <tr>
                  <td><strong>${index + 1}</strong></td>
                  <td><span class="txn-code">${item.orderCode}</span><br><span style="font-size:11px; color:var(--text-muted);">${item.id}</span></td>
                  <td style="font-size:12.5px;">${item.store}</td>
                  <td>
                    <strong>${item.customerName}</strong><br>
                    <span style="font-size:12px; color:var(--text-muted);">${item.customerPhone} | ${item.customerEmail}</span>
                  </td>
                  <td style="font-weight:800; color:var(--color-primary);">${item.amount.toLocaleString('vi-VN')} đ</td>
                  <td><span class="status-badge badge-processing">${item.channel}</span></td>
                  <td><strong style="color:${item.status === 'EXPIRED' ? 'var(--color-danger)' : 'var(--text-main)'}">${item.expiryText}</strong></td>
                  <td><span class="status-badge ${item.statusClass}">${item.statusText}</span></td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      <button class="btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="showToast('Đã sao chép link thanh toán: https://ecopay.finviet.com.vn/paylink/${item.id}')">📋 Sao chép</button>
                      ${item.status === 'ACTIVE' ? `<button class="btn-secondary" style="padding:4px 8px; font-size:11px;" onclick="resendEmail('${item.id}')">📧 Gửi lại Email (${item.resendCount})</button>` : ''}
                      ${item.status === 'ACTIVE' ? `<button class="btn-secondary" style="padding:4px 8px; font-size:11px; color:var(--color-danger);" onclick="cancelPaylink('${item.id}')">❌ Hủy đơn</button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 2: Quản lý QR Code Ngân Hàng (MB Bank & BVB) -->
      <div id="paylinkTabQrBank" style="display:none;">
        <div class="table-card" style="margin-bottom:20px;">
          <div class="info-banner-blue" style="margin-top:0;">
            ℹ️ <strong>Quản lý vòng đời mã QR Tĩnh Ngân hàng (MB Bank & BVB - PRD v2.0):</strong> Mã QR mới được kết nối với Cửa hàng sẽ tự động <strong>Vô hiệu hóa</strong> mã QR cũ của Cửa hàng đó để đảm bảo an toàn thu ngân.
          </div>
        </div>

        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Danh Sách Mã QR Ngân Hàng Được Cấp Phát</h3>
            <div style="display:flex; gap:10px;">
              <button class="btn-secondary" onclick="showToast('Đồng bộ dữ liệu mã QR từ Ngân hàng MB / BVB...')">🔄 Đồng Bộ MB / BVB</button>
              <button class="btn-primary" onclick="openCreateBankQrModal()">+ Thêm Mã QR Ngân Hàng Mới</button>
            </div>
          </div>

          <table class="portal-table">
            <thead>
              <tr>
                <th>MÃ QR (SERIAL)</th>
                <th>NGÂN HÀNG</th>
                <th>SỐ TÀI KHOẢN</th>
                <th>CỬA HÀNG MAPPING</th>
                <th>NGÀY TẠO</th>
                <th>TRẠNG THÁI VÒNG ĐỜI</th>
                <th>THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              ${qrCodes.map(qr => `
                <tr>
                  <td><span class="txn-code">${qr.id}</span></td>
                  <td><strong>${qr.bankName}</strong></td>
                  <td style="font-family:monospace; font-weight:700;">${qr.accountNo}</td>
                  <td><strong>${qr.storeName}</strong></td>
                  <td style="font-size:12px; color:var(--text-muted);">${qr.createdDate}</td>
                  <td><span class="status-badge ${qr.statusClass}">${qr.statusText}</span></td>
                  <td>
                    ${qr.status === 'QR_CREATED' ? `<button class="btn-primary" style="padding:4px 10px; font-size:11px;" onclick="openMappingQrModal('${qr.id}')">🔗 Mapping Cửa Hàng</button>` : ''}
                    ${qr.status === 'ACTIVE' ? `<button class="btn-secondary" style="padding:4px 10px; font-size:11px;" onclick="showToast('Xem chi tiết và tải ảnh VietQR 2.0')">🖼️ Xem Mã QR</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 3: Quản lý Hạn mức SMS & Báo cáo Đối soát -->
      <div id="paylinkTabSmsQuota" style="display:none;">
        <div class="enterprise-cards-grid" style="margin-bottom:20px;">
          <div class="table-card">
            <h3 class="card-section-title">💬 Hạn Mức SMS Doanh Nghiệp</h3>
            <div class="detail-row"><span class="detail-label">Tổng quota đã mua:</span><span class="detail-val" style="color:var(--color-primary);">1,000 tin</span></div>
            <div class="detail-row"><span class="detail-label">Đã phân bổ cho CH:</span><span class="detail-val">1,000 tin</span></div>
            <div class="detail-row"><span class="detail-label">Còn lại tại Doanh nghiệp:</span><span class="detail-val">0 tin</span></div>
          </div>
          <div class="table-card">
            <h3 class="card-section-title">📊 Đơn Giá & Quy Tắc Đối Soát</h3>
            <div class="detail-row"><span class="detail-label">Đơn giá tin nhắn SMS:</span><span class="detail-val" style="color:var(--color-primary); font-weight:800;">1,100 VNĐ / tin</span></div>
            <div class="detail-row"><span class="detail-label">Điều kiện tính phí:</span><span class="detail-val">Gửi tin thành công</span></div>
            <div class="detail-row"><span class="detail-label">Quy tắc gửi:</span><span class="detail-val">Gửi 1 lần duy nhất khi tạo đơn</span></div>
          </div>
        </div>

        <div class="table-card">
          <div class="table-header">
            <h3 class="table-title">Bảng Phân Bổ Hạn Mức SMS Theo Cửa Hàng</h3>
            <button class="btn-primary" onclick="openTransferSmsQuotaModal()">🔄 Điều Chuyển Hạn Mức SMS</button>
          </div>

          <table class="portal-table">
            <thead>
              <tr>
                <th>CỬA HÀNG</th>
                <th>HẠN MỨC ĐÃ CẤP</th>
                <th>ĐÃ SỬ DỤNG</th>
                <th>HẠN MỨC KHẢ DỤNG</th>
                <th>TỔNG PHÍ DỰ KIẾN (1.100 Đ/TIN)</th>
              </tr>
            </thead>
            <tbody>
              ${smsQuotas.map(sq => `
                <tr>
                  <td><strong>${sq.storeName}</strong></td>
                  <td style="font-weight:700;">${sq.allocated} tin</td>
                  <td style="color:var(--color-warning); font-weight:700;">${sq.used} tin</td>
                  <td style="color:var(--color-secondary); font-weight:800;">${sq.available} tin</td>
                  <td style="font-weight:800; color:var(--color-primary);">${sq.fee.toLocaleString('vi-VN')} đ</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getDevicesView(deviceType) {
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Thiết bị / <strong>Thiết bị ${deviceType}</strong></div>
          <h1 class="subpage-title">Danh Sách Thiết Bị ${deviceType}</h1>
        </div>
        <button class="btn-primary" onclick="showToast('Gửi yêu cầu gắn thiết bị ${deviceType}')">+ Yêu Cầu Gắn Thiết Bị</button>
      </div>
      <div class="table-card">
        <table class="portal-table">
          <thead>
            <tr>
              <th>Mã Thiết Bị (Serial)</th>
              <th>Loại Thiết Bị</th>
              <th>Cửa Hàng Gán</th>
              <th>Lần Cuối Hoạt Động</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="txn-code">DEV-${deviceType}-8821</span></td>
              <td>${deviceType} Standard</td>
              <td>Chi nhánh Quận 1 - Hồ Chí Minh</td>
              <td>18/08/2026 15:35:00</td>
              <td><span class="status-badge badge-success">Online (Hoạt động)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  },

  getPayTxnsView() {
    const txns = MockData.getFullTransactions ? MockData.getFullTransactions() : [];
    
    // Dynamic summary calculations
    const totalCount = txns.length;
    const createdCount = txns.filter(t => t.status === 'created').length;
    const processingCount = txns.filter(t => t.status === 'processing').length;
    const approvedCount = txns.filter(t => t.status === 'approved').length;
    const rejectedCount = txns.filter(t => t.status === 'rejected').length;
    const failedCount = txns.filter(t => t.status === 'failed').length;
    const paidCount = txns.filter(t => t.status === 'paid').length;
    const successCount = txns.filter(t => t.status === 'success').length;
    const pendingCount = txns.filter(t => t.status === 'pending').length;

    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Payment / <strong>Giao dịch thanh toán</strong></div>
          <h1 class="subpage-title">Giao Dịch Thanh Toán</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Quản lý và tra cứu chi tiết danh sách các giao dịch thanh toán thuộc hệ thống Ecopay FinViet.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" onclick="showToast('Xuất file Báo cáo giao dịch thanh toán Excel...')"><i data-lucide="download" style="width:15px; height:15px; margin-right:4px;"></i> Xuất Excel</button>
        </div>
      </div>

      <!-- MỤC TÌM KIẾM -->
      <div class="table-card" style="margin-bottom:20px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:var(--text-main); display:flex; align-items:center; gap:8px;">
          <i data-lucide="search" style="width:16px; height:16px; color:var(--color-primary);"></i> Mục Tìm Kiếm
        </div>
        <form id="txnFilterForm" onsubmit="return false;">
          <!-- 5 Primary Search Fields (1 Full Row - 5 Columns) -->
          <div class="filter-grid-5col">
            <!-- 1. Mã giao dịch -->
            <div class="form-group-field">
              <label>Mã giao dịch</label>
              <input type="text" id="filterTxnId" placeholder="Nhập mã giao dịch">
            </div>

            <!-- 2. Mã đơn hàng DN -->
            <div class="form-group-field">
              <label>Mã đơn hàng DN</label>
              <input type="text" id="filterMerchantOrderId" placeholder="Nhập mã đơn hàng DN">
            </div>

            <!-- 3. Tên cửa hàng (đối với account có role là chủ DN) -->
            <div class="form-group-field">
              <label>Tên cửa hàng (dành cho Chủ DN)</label>
              <select id="filterStoreName">
                <option value="all">Tất cả cửa hàng</option>
                <option value="storeQ1">Chi nhánh Quận 1 - Hồ Chí Minh</option>
                <option value="storeQ3">Chi nhánh Hoàn Kiếm - Hà Nội</option>
                <option value="storeTB">Chi nhánh Hải Châu - Đà Nẵng</option>
              </select>
            </div>

            <!-- 4. Mã đối tác ngân hàng -->
            <div class="form-group-field">
              <label>Mã đối tác ngân hàng</label>
              <select id="filterBankPartnerCode">
                <option value="all">Tất cả ngân hàng đối tác</option>
                <option value="MB">MB Bank (Quân Đội)</option>
                <option value="BVB">BVB (Bảo Việt Bank)</option>
                <option value="VCB">Vietcombank</option>
                <option value="TCB">Techcombank</option>
                <option value="VPB">VPBank</option>
                <option value="BIDV">BIDV</option>
                <option value="ACB">ACB</option>
              </select>
            </div>

            <!-- 5. Trạng thái -->
            <div class="form-group-field">
              <label>Trạng thái</label>
              <select id="filterStatus">
                <option value="all">Tất cả trạng thái</option>
                <option value="created">Khởi tạo</option>
                <option value="processing">Đang xử lý</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="rejected">Đã từ chối</option>
                <option value="failed">Thất bại</option>
                <option value="paid">Đã thanh toán</option>
                <option value="success">Thành công</option>
                <option value="pending">Đang chờ duyệt</option>
              </select>
            </div>
          </div>

          <!-- MỤC MỞ RỘNG (EXPANDABLE DROPDOWN - 6 REMAINING FIELDS IN 2 FULL ROWS OF 3 COLUMNS) -->
          <div id="extraTxnFilterFields" class="filter-grid-3col" style="display:none; margin-top:14px; padding-top:14px; border-top:1px dashed var(--border-color);">
            <!-- Row 1: Nguồn thanh toán & Phương thức & Loại hình -->
            <!-- 6. Nguồn thanh toán -->
            <div class="form-group-field">
              <label>Nguồn thanh toán</label>
              <select id="filterPaymentSource">
                <option value="all">Tất cả nguồn thanh toán</option>
                <option value="VietQR Pay">VietQR Pay</option>
                <option value="Thẻ ATM Nội Địa">Thẻ ATM Nội Địa</option>
                <option value="Thẻ Quốc Tế">Thẻ Quốc Tế (Visa/Master)</option>
                <option value="Payment Link">Payment Link</option>
                <option value="QR Bank">QR Bank</option>
                <option value="Ví điện tử">Ví điện tử MoMo / ZaloPay</option>
              </select>
            </div>

            <!-- 7. Phương thức đối soát -->
            <div class="form-group-field">
              <label>Phương thức đối soát</label>
              <select id="filterReconcileMethod">
                <option value="all">Tất cả phương thức</option>
                <option value="T+0">Đối soát T+0 (Trong ngày)</option>
                <option value="T+1">Đối soát T+1 (Ngày làm việc tiếp theo)</option>
                <option value="DAILY">Quyết toán hàng ngày</option>
                <option value="AUTO">Khấu trừ tự động</option>
              </select>
            </div>

            <!-- 8. Loại hình thanh toán -->
            <div class="form-group-field">
              <label>Loại hình thanh toán</label>
              <select id="filterPaymentType">
                <option value="all">Tất cả loại hình</option>
                <option value="DIRECT">Thanh toán trực tiếp</option>
                <option value="QR">Thanh toán qua QR</option>
                <option value="LINK">Thanh toán qua Link</option>
                <option value="RECURRING">Thanh toán định kỳ</option>
              </select>
            </div>

            <!-- Row 2: Các mốc thời gian -->
            <!-- 9. Ngày tạo -->
            <div class="form-group-field">
              <label>Ngày tạo</label>
              <div class="date-range-input-box">
                <input type="date" id="filterCreatedDateStart" value="2026-08-01">
                <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                <input type="date" id="filterCreatedDateEnd" value="2026-08-25">
                <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
              </div>
            </div>

            <!-- 10. Thời gian đối tác thanh toán -->
            <div class="form-group-field">
              <label>Thời gian đối tác thanh toán</label>
              <div class="date-range-input-box">
                <input type="date" id="filterPartnerPayTimeStart" value="2026-08-01">
                <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                <input type="date" id="filterPartnerPayTimeEnd" value="2026-08-25">
                <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
              </div>
            </div>

            <!-- 11. Thời gian thanh toán doanh nghiệp -->
            <div class="form-group-field">
              <label>Thời gian thanh toán doanh nghiệp</label>
              <div class="date-range-input-box">
                <input type="date" id="filterMerchantPayTimeStart" value="2026-08-01">
                <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                <input type="date" id="filterMerchantPayTimeEnd" value="2026-08-25">
                <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
              </div>
            </div>
          </div>

          <div class="filter-actions-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button type="button" class="btn-secondary" id="btnToggleExtraTxnFilters" onclick="toggleExtraTxnFilters()">Mở rộng tìm kiếm ∨</button>
            <div style="display:flex; gap:10px;">
              <button type="button" class="btn-secondary" onclick="resetTxnFilters()">Làm lại</button>
              <button type="button" class="btn-primary" onclick="applyTxnFilters()">Tìm kiếm</button>
            </div>
          </div>
        </form>
      </div>

      <!-- TỔNG HỢP CÁC GD (COMPACT SINGLE ROW WITHOUT TITLE HEADER) -->
      <div class="table-card" style="margin-bottom:20px; padding:12px 16px;">
        <div class="txn-summary-cards-single-row">
          <!-- Số lượng giao dịch -->
          <div class="txn-stat-card-compact card-total">
            <div class="stat-label">Số lượng giao dịch</div>
            <div class="stat-value" id="statTotalCount">${totalCount}</div>
          </div>
          <!-- Khởi tạo -->
          <div class="txn-stat-card-compact card-created">
            <div class="stat-label">Khởi tạo</div>
            <div class="stat-value" id="statCreatedCount">${createdCount}</div>
          </div>
          <!-- Đang xử lý -->
          <div class="txn-stat-card-compact card-processing">
            <div class="stat-label">Đang xử lý</div>
            <div class="stat-value" id="statProcessingCount">${processingCount}</div>
          </div>
          <!-- Đã phê duyệt -->
          <div class="txn-stat-card-compact card-approved">
            <div class="stat-label">Đã phê duyệt</div>
            <div class="stat-value" id="statApprovedCount">${approvedCount}</div>
          </div>
          <!-- Đã từ chối -->
          <div class="txn-stat-card-compact card-rejected">
            <div class="stat-label">Đã từ chối</div>
            <div class="stat-value" id="statRejectedCount">${rejectedCount}</div>
          </div>
          <!-- Thất bại -->
          <div class="txn-stat-card-compact card-failed">
            <div class="stat-label">Thất bại</div>
            <div class="stat-value" id="statFailedCount">${failedCount}</div>
          </div>
          <!-- Đã thanh toán -->
          <div class="txn-stat-card-compact card-paid">
            <div class="stat-label">Đã thanh toán</div>
            <div class="stat-value" id="statPaidCount">${paidCount}</div>
          </div>
          <!-- Thành công -->
          <div class="txn-stat-card-compact card-success">
            <div class="stat-label">Thành công</div>
            <div class="stat-value" id="statSuccessCount">${successCount}</div>
          </div>
          <!-- Đang chờ duyệt -->
          <div class="txn-stat-card-compact card-pending">
            <div class="stat-label">Đang chờ duyệt</div>
            <div class="stat-value" id="statPendingCount">${pendingCount}</div>
          </div>
        </div>
      </div>

      <!-- BẢNG DANH SÁCH GIAO DỊCH THANH TOÁN (17 COLUMNS) -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Danh Sách Giao Dịch Thanh Toán</h3>
          <span style="font-size:12.5px; color:var(--text-muted);">Hiển thị <strong id="displayedTxnCount">${totalCount} / ${totalCount}</strong> giao dịch</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="portal-table">
            <thead>
              <tr>
                <th style="white-space:nowrap;">Stt</th>
                <th style="white-space:nowrap;">Mã giao dịch</th>
                <th style="white-space:nowrap;">Mã đơn hàng DN</th>
                <th style="white-space:nowrap;">Ngày tạo</th>
                <th class="col-customer" style="white-space:nowrap; min-width:220px; width:250px;">Tên khách hàng</th>
                <th style="white-space:nowrap;">SĐT/ TK thanh toán</th>
                <th style="white-space:nowrap;">Tên cửa hàng (Chủ DN)</th>
                <th style="white-space:nowrap;">Số tiền GD</th>
                <th style="white-space:nowrap;">Phí GD</th>
                <th style="white-space:nowrap;">Phí người dùng</th>
                <th style="white-space:nowrap;">Mã voucher</th>
                <th style="white-space:nowrap;">CTKM</th>
                <th style="white-space:nowrap;">Nguồn thanh toán</th>
                <th style="white-space:nowrap;">Loại hình thanh toán</th>
                <th style="white-space:nowrap;">Thời gian đối tác thanh toán</th>
                <th style="white-space:nowrap;">Thời gian thanh toán doanh nghiệp</th>
                <th style="white-space:nowrap;">Trạng thái</th>
              </tr>
            </thead>
            <tbody id="payTxnsFullTbody">
              ${txns.map(t => `
                <tr onclick="openTxnModal('${t.id}')">
                  <td><strong>${t.stt}</strong></td>
                  <td><span class="txn-code">${t.id}</span></td>
                  <td><span class="txn-code">${t.merchantOrderId}</span></td>
                  <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${t.createdDate}</td>
                  <td class="col-customer" style="min-width:220px; white-space:nowrap;"><strong>${t.customerName}</strong></td>
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
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getRefundTxnsView() {
    const txns = MockData.getRefundTransactions ? MockData.getRefundTransactions() : [];
    
    // Dynamic summary calculations
    const totalCount = txns.length;
    const createdCount = txns.filter(t => t.status === 'created').length;
    const processingCount = txns.filter(t => t.status === 'processing').length;
    const approvedCount = txns.filter(t => t.status === 'approved').length;
    const rejectedCount = txns.filter(t => t.status === 'rejected').length;
    const failedCount = txns.filter(t => t.status === 'failed').length;
    const paidCount = txns.filter(t => t.status === 'paid').length;
    const successCount = txns.filter(t => t.status === 'success').length;
    const pendingCount = txns.filter(t => t.status === 'pending').length;

    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Payment / <strong>Giao dịch hoàn tiền</strong></div>
          <h1 class="subpage-title">GD Hoàn Tiền</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Quản lý và tra cứu thông tin chi tiết các yêu cầu hoàn tiền trong hệ thống.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" onclick="showToast('Xuất file Báo cáo giao dịch hoàn tiền Excel...')"><i data-lucide="download" style="width:15px; height:15px; margin-right:4px;"></i> Xuất Excel</button>
        </div>
      </div>

      <!-- MỤC TÌM KIẾM -->
      <div class="table-card" style="margin-bottom:20px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:var(--text-main); display:flex; align-items:center; gap:8px;">
          <i data-lucide="search" style="width:16px; height:16px; color:var(--color-primary);"></i> Mục Tìm Kiếm
        </div>
        <form id="refundFilterForm" onsubmit="return false;">
          <!-- HÀNG 1: 5 PRIMARY SEARCH FIELDS (CHƯA DROPDOWN - LƯỚI 5 CỘT) -->
          <div class="filter-grid-5col">
            <!-- 1. Mã GD gốc -->
            <div class="form-group-field">
              <label>Mã GD gốc</label>
              <input type="text" id="filterOriginalTxnId" placeholder="Nhập mã GD gốc">
            </div>

            <!-- 2. Mã hoàn tiền -->
            <div class="form-group-field">
              <label>Mã hoàn tiền</label>
              <input type="text" id="filterRefundId" placeholder="Nhập mã hoàn tiền">
            </div>

            <!-- 3. Mã GD gốc của đối tác -->
            <div class="form-group-field">
              <label>Mã GD gốc của đối tác</label>
              <input type="text" id="filterOriginalPartnerTxnId" placeholder="Nhập mã GD gốc đối tác">
            </div>

            <!-- 4. Mã đối soát hoàn tiền với đối tác -->
            <div class="form-group-field">
              <label>Mã đối soát hoàn tiền đối tác</label>
              <input type="text" id="filterPartnerRefundReconcileId" placeholder="Nhập mã đối soát hoàn tiền">
            </div>

            <!-- 5. Mã GD hoàn tiền của đối tác -->
            <div class="form-group-field">
              <label>Mã GD hoàn tiền đối tác</label>
              <input type="text" id="filterPartnerRefundTxnId" placeholder="Nhập mã GD hoàn tiền đối tác">
            </div>
          </div>

          <!-- MỤC MỞ RỘNG (KHI DROPDOWN - FORMAT 5 - 5 - 4) -->
          <div id="extraRefundFilterFields" style="display:none; margin-top:14px; padding-top:14px; border-top:1px dashed var(--border-color);">
            <!-- HÀNG 2: 5 FIELDS (LƯỚI 5 CỘT) -->
            <div class="filter-grid-5col" style="margin-bottom:14px;">
              <!-- 6. Mã đối tác thanh toán -->
              <div class="form-group-field">
                <label>Mã đối tác thanh toán</label>
                <select id="filterPaymentPartnerCode">
                  <option value="all">Tất cả đối tác thanh toán</option>
                  <option value="FINVIET_PAY">FINVIET_PAY</option>
                  <option value="NAPAS">NAPAS</option>
                  <option value="MB_BANK">MB_BANK</option>
                  <option value="VPBANK">VPBANK</option>
                  <option value="VIETCOMBANK">VIETCOMBANK</option>
                  <option value="BIDV">BIDV</option>
                  <option value="MOMO">MOMO</option>
                </select>
              </div>

              <!-- 7. Mã đối tác ngân hàng -->
              <div class="form-group-field">
                <label>Mã đối tác ngân hàng</label>
                <select id="filterRefundBankPartnerCode">
                  <option value="all">Tất cả ngân hàng</option>
                  <option value="MB">MB Bank</option>
                  <option value="BVB">BVB</option>
                  <option value="VCB">Vietcombank</option>
                  <option value="TCB">Techcombank</option>
                  <option value="VPB">VPBank</option>
                  <option value="BIDV">BIDV</option>
                </select>
              </div>

              <!-- 8. Người tạo -->
              <div class="form-group-field">
                <label>Người tạo</label>
                <input type="text" id="filterRefundCreatedBy" placeholder="Nhập tên người tạo">
              </div>

              <!-- 9. Loại hoàn tiền -->
              <div class="form-group-field">
                <label>Loại hoàn tiền</label>
                <select id="filterRefundType">
                  <option value="all">Tất cả loại hoàn tiền</option>
                  <option value="FULL">Hoàn tiền toàn phần</option>
                  <option value="PARTIAL">Hoàn tiền một phần</option>
                </select>
              </div>

              <!-- 10. Trạng thái -->
              <div class="form-group-field">
                <label>Trạng thái</label>
                <select id="filterRefundStatus">
                  <option value="all">Tất cả trạng thái</option>
                  <option value="created">Khởi tạo</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="approved">Đã phê duyệt</option>
                  <option value="rejected">Đã từ chối</option>
                  <option value="failed">Thất bại</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="success">Thành công</option>
                  <option value="pending">Đang chờ duyệt</option>
                </select>
              </div>
            </div>

            <!-- HÀNG 3: 4 FIELDS / 3 THỜI GIAN + PHƯƠNG THỨC HOÀN TIỀN (LƯỚI 4 CỘT) -->
            <div class="filter-grid-4col">
              <!-- 11. Phương thức hoàn tiền -->
              <div class="form-group-field">
                <label>Phương thức hoàn tiền</label>
                <select id="filterRefundMethod">
                  <option value="all">Tất cả phương thức</option>
                  <option value="BANK">Hoàn về tài khoản ngân hàng</option>
                  <option value="CARD">Hoàn về thẻ thanh toán</option>
                  <option value="WALLET">Hoàn về ví điện tử</option>
                </select>
              </div>

              <!-- 12. Ngày tạo -->
              <div class="form-group-field">
                <label>Ngày tạo</label>
                <div class="date-range-input-box">
                  <input type="date" id="filterRefundCreatedStart" value="2026-08-01">
                  <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                  <input type="date" id="filterRefundCreatedEnd" value="2026-08-25">
                  <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
                </div>
              </div>

              <!-- 13. Thời gian phê duyệt -->
              <div class="form-group-field">
                <label>Thời gian phê duyệt</label>
                <div class="date-range-input-box">
                  <input type="date" id="filterRefundApprovedStart" value="2026-08-01">
                  <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                  <input type="date" id="filterRefundApprovedEnd" value="2026-08-25">
                  <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
                </div>
              </div>

              <!-- 14. Thời gian thanh toán doanh nghiệp -->
              <div class="form-group-field">
                <label>Thời gian thanh toán doanh nghiệp</label>
                <div class="date-range-input-box">
                  <input type="date" id="filterRefundMerchantPayStart" value="2026-08-01">
                  <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                  <input type="date" id="filterRefundMerchantPayEnd" value="2026-08-25">
                  <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
                </div>
              </div>
            </div>
          </div>

          <div class="filter-actions-bar" style="display:flex; justify-content:space-between; align-items:center; margin-top:16px;">
            <button type="button" class="btn-secondary" id="btnToggleExtraRefundFilters" onclick="toggleExtraRefundFilters()">Mở rộng tìm kiếm ∨</button>
            <div style="display:flex; gap:10px;">
              <button type="button" class="btn-secondary" onclick="resetRefundFilters()">Làm lại</button>
              <button type="button" class="btn-primary" onclick="applyRefundFilters()">Tìm kiếm</button>
            </div>
          </div>
        </form>
      </div>

      <!-- TỔNG HỢP CÁC GD (COMPACT SINGLE ROW WITHOUT TITLE HEADER) -->
      <div class="table-card" style="margin-bottom:20px; padding:12px 16px;">
        <div class="txn-summary-cards-single-row">
          <!-- Số lượng giao dịch -->
          <div class="txn-stat-card-compact card-total">
            <div class="stat-label">Số lượng giao dịch</div>
            <div class="stat-value" id="statRefundTotalCount">${totalCount}</div>
          </div>
          <!-- Khởi tạo -->
          <div class="txn-stat-card-compact card-created">
            <div class="stat-label">Khởi tạo</div>
            <div class="stat-value" id="statRefundCreatedCount">${createdCount}</div>
          </div>
          <!-- Đang xử lý -->
          <div class="txn-stat-card-compact card-processing">
            <div class="stat-label">Đang xử lý</div>
            <div class="stat-value" id="statRefundProcessingCount">${processingCount}</div>
          </div>
          <!-- Đã phê duyệt -->
          <div class="txn-stat-card-compact card-approved">
            <div class="stat-label">Đã phê duyệt</div>
            <div class="stat-value" id="statRefundApprovedCount">${approvedCount}</div>
          </div>
          <!-- Đã từ chối -->
          <div class="txn-stat-card-compact card-rejected">
            <div class="stat-label">Đã từ chối</div>
            <div class="stat-value" id="statRefundRejectedCount">${rejectedCount}</div>
          </div>
          <!-- Thất bại -->
          <div class="txn-stat-card-compact card-failed">
            <div class="stat-label">Thất bại</div>
            <div class="stat-value" id="statRefundFailedCount">${failedCount}</div>
          </div>
          <!-- Đã thanh toán -->
          <div class="txn-stat-card-compact card-paid">
            <div class="stat-label">Đã thanh toán</div>
            <div class="stat-value" id="statRefundPaidCount">${paidCount}</div>
          </div>
          <!-- Thành công -->
          <div class="txn-stat-card-compact card-success">
            <div class="stat-label">Thành công</div>
            <div class="stat-value" id="statRefundSuccessCount">${successCount}</div>
          </div>
          <!-- Đang chờ duyệt -->
          <div class="txn-stat-card-compact card-pending">
            <div class="stat-label">Đang chờ duyệt</div>
            <div class="stat-value" id="statRefundPendingCount">${pendingCount}</div>
          </div>
        </div>
      </div>

      <!-- BẢNG DANH SÁCH GIAO DỊCH HOÀN TIỀN (24 COLUMNS) -->
      <div class="table-card">
        <div class="table-header">
          <h3 class="table-title">Danh Sách Giao Dịch Hoàn Tiền</h3>
          <span style="font-size:12.5px; color:var(--text-muted);">Hiển thị <strong id="displayedRefundCount">${totalCount} / ${totalCount}</strong> giao dịch</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="portal-table">
            <thead>
              <tr>
                <th style="white-space:nowrap;">Stt</th>
                <th style="white-space:nowrap;">Mã hoàn tiền</th>
                <th style="white-space:nowrap;">Mã GD gốc</th>
                <th style="white-space:nowrap;">Mã GD gốc của đối tác</th>
                <th style="white-space:nowrap;">Mã đối soát hoàn tiền đối tác</th>
                <th style="white-space:nowrap;">Mã GD hoàn tiền đối tác</th>
                <th style="white-space:nowrap;">Tên cửa hàng/ NPP (Chủ DN)</th>
                <th class="col-customer" style="white-space:nowrap; min-width:220px; width:250px;">Tên khách hàng</th>
                <th style="white-space:nowrap;">SĐT/ TK GD</th>
                <th style="white-space:nowrap;">Số tiền GD</th>
                <th style="white-space:nowrap;">Số tiền phạt</th>
                <th style="white-space:nowrap;">Mã đối tác thanh toán</th>
                <th style="white-space:nowrap;">Nguồn thanh toán</th>
                <th style="white-space:nowrap;">Phương thức thanh toán</th>
                <th style="white-space:nowrap;">Nội dung hoàn</th>
                <th style="white-space:nowrap;">Lý do từ chối</th>
                <th style="white-space:nowrap;">Ngày tạo</th>
                <th style="white-space:nowrap;">Người phê duyệt</th>
                <th style="white-space:nowrap;">Thời gian phê duyệt</th>
                <th style="white-space:nowrap;">Thời gian từ chối</th>
                <th style="white-space:nowrap;">Người tạo</th>
                <th style="white-space:nowrap;">Loại hình thanh toán</th>
                <th style="white-space:nowrap;">Thời gian thanh toán doanh nghiệp</th>
                <th style="white-space:nowrap;">Trạng thái</th>
              </tr>
            </thead>
            <tbody id="refundTxnsFullTbody">
              ${txns.map(t => `
                <tr onclick="showToast('Xem chi tiết đơn hoàn tiền: ${t.refundId}')">
                  <td><strong>${t.stt}</strong></td>
                  <td><span class="txn-code">${t.refundId}</span></td>
                  <td><span class="txn-code">${t.originalTxnId}</span></td>
                  <td><span class="txn-code">${t.originalPartnerTxnId}</span></td>
                  <td><span class="txn-code">${t.partnerRefundReconcileId}</span></td>
                  <td><span class="txn-code">${t.partnerRefundTxnId}</span></td>
                  <td style="font-size:12px;">${t.storeName}</td>
                  <td class="col-customer" style="min-width:220px; white-space:nowrap;"><strong>${t.customerName}</strong></td>
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
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  getAgentBankingView() {
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Agent Banking / <strong>Quản trị & Báo cáo</strong></div>
          <h1 class="subpage-title">Phân Hệ Agent Banking</h1>
        </div>
      </div>
      <div class="table-card">
        <div style="padding:20px; font-size:14px;">
          <p><strong>Thông tin két ca hôm nay:</strong> Đã kết ca lúc 12:00 (Số dư két: 5,450,000 đ)</p>
        </div>
      </div>
    `;
  },

  getSettlementView(type) {
    const titles = {
      reconcile: 'Báo Cáo Đối Soát',
      'fee-diff': 'Báo Cáo Chênh Lệch Phí'
    };

    if (type === 'fee-diff') {
      const feeDiffList = MockData.getFeeDiffReportsData ? MockData.getFeeDiffReportsData() : [];
      return `
        <div class="subpage-header">
          <div>
            <div class="subpage-breadcrumb">Quyết toán & Đối soát / <strong>Báo Cáo Chênh Lệch Phí</strong></div>
            <h1 class="subpage-title">Báo Cáo Chênh Lệch Phí</h1>
          </div>
          <button class="btn-secondary" onclick="showToast('Tải file báo cáo chênh lệch phí PDF/Excel')">Tải Báo Cáo File PDF</button>
        </div>
        <div class="table-card">
          <table class="portal-table">
            <thead>
              <tr>
                <th>Kỳ Báo Cáo</th>
                <th>Phí Hệ Thống DN</th>
                <th>Phí Khai Báo Đối Tác</th>
                <th>Chênh Lệch</th>
                <th>Ghi Chú</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              ${feeDiffList.map(item => `
                <tr>
                  <td><strong>${item.period}</strong></td>
                  <td>${item.merchantFee}</td>
                  <td>${item.partnerFee}</td>
                  <td style="font-weight:700; color:var(--color-primary);">${item.diffAmount}</td>
                  <td style="font-size:12px; color:var(--text-muted);">${item.note}</td>
                  <td><span class="status-badge ${item.statusClass}">${item.statusText}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    const reconcileList = MockData.getReconcileReportsData ? MockData.getReconcileReportsData() : [];
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Quyết toán & Đối soát / <strong>Báo Cáo Đối Soát</strong></div>
          <h1 class="subpage-title">Báo Cáo Đối Soát (T+1)</h1>
        </div>
        <button class="btn-secondary" onclick="showToast('Tải file sao kê PDF/Excel')">Tải Sao Kê File PDF</button>
      </div>
      <div class="table-card">
        <table class="portal-table">
          <thead>
            <tr>
              <th>Kỳ Báo Cáo</th>
              <th>Số Dư Đầu Kỳ</th>
              <th>Phát Sinh Tăng</th>
              <th>Phát Sinh Giảm</th>
              <th>Số Dư Cuối Kỳ</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            ${reconcileList.map(item => `
              <tr>
                <td><strong>${item.period}</strong></td>
                <td>${item.initialBalance}</td>
                <td style="color:var(--color-secondary); font-weight:700;">${item.increase}</td>
                <td style="color:var(--color-danger); font-weight:700;">${item.decrease}</td>
                <td style="font-weight:800; color:var(--color-primary);">${item.finalBalance}</td>
                <td><span class="status-badge ${item.statusClass}">${item.statusText}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  getAnalyticsView() {
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Analytics / <strong>Báo cáo phân tích</strong></div>
          <h1 class="subpage-title">Analytics & Báo Cáo Chuyên Sâu</h1>
        </div>
      </div>
      <div class="table-card" style="padding:30px; text-align:center;">
        <h2><i data-lucide="bar-chart-2" style="width:24px; height:24px; color:var(--color-primary);"></i> Công cụ phân tích xu hướng kinh doanh & hành vi khách hàng</h2>
        <p style="color:var(--text-muted); margin-top:10px;">Dữ liệu truy cập và hiệu suất kinh doanh đang hoạt động ổn định 100%.</p>
      </div>
    `;
  },

  /**
   * Báo cáo đối soát thanh toán View (Matching ECOPAY PRD Specification)
   */
  getReconcileEcopayView() {
    const list = MockData.getReconcileEcopayData ? MockData.getReconcileEcopayData() : [];
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Báo cáo / <strong>Báo cáo đối soát thanh toán</strong></div>
          <h1 class="subpage-title">Báo Cáo Đối Soát Thanh Toán</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Tổng hợp và theo dõi báo cáo đối soát thanh toán tập trung từ tất cả các phiên bản giữa FINVIET và Doanh nghiệp / Cửa hàng.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" onclick="showToast('Xuất file Báo cáo đối soát thanh toán Excel...')"><i data-lucide="download" style="width:15px; height:15px; margin-right:4px;"></i> Xuất dữ liệu</button>
        </div>
      </div>

      <!-- MỤC TÌM KIẾM BỘ LỌC BÁO CÁO ĐỐI SOÁT THANH TOÁN (PRD EXACT SPECIFICATION) -->
      <div class="table-card" style="margin-bottom:20px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:var(--text-main); display:flex; align-items:center; justify-content:space-between;">
          <div style="display:flex; align-items:center; gap:8px;">
            <i data-lucide="filter" style="width:16px; height:16px; color:var(--color-primary);"></i> Bộ Lọc Tìm Kiếm Đối Soát
          </div>
          <button type="button" class="btn-secondary" style="font-size:12px; padding:4px 10px;" onclick="toggleFilterExpand(this)">
            <i data-lucide="chevron-up" style="width:14px; height:14px; margin-right:4px;"></i> Thu gọn
          </button>
        </div>
        <form id="reconcileReportFilterForm" onsubmit="return false;">
          <div class="filter-panel-content">
            <div class="filter-grid-4col" style="row-gap:14px;">
              <!-- 1. Tên doanh nghiệp -->
              <div class="form-group-field">
                <label>Tên doanh nghiệp</label>
                <select id="filterReportMerchantName">
                  <option value="all">Tìm và chọn doanh nghiệp</option>
                  <option value="finviet">CÔNG TY CỔ PHẦN CÔNG NGHIỆP FINVIET</option>
                  <option value="ngantruong">CÔNG TY CP TNHH NGÂN TRƯỜNG</option>
                  <option value="mcn1">CÔNG TY TNHH MERCHANTUNGA</option>
                </select>
              </div>

              <!-- 2. Tên cửa hàng -->
              <div class="form-group-field">
                <label>Tên cửa hàng</label>
                <select id="filterReportStoreName">
                  <option value="all">Tìm theo tên/mã/SĐT cửa hàng</option>
                  <option value="storeHS">Như thế học sinh (FINVIET4917.T)</option>
                  <option value="storeHK">Chi nhánh Hoàn Kiếm (FINVIET0812)</option>
                  <option value="storeSP">Cửa hàng SmartPOS Cửa NGÂN</option>
                  <option value="storeQ1">Chi nhánh Quận 1 - Hồ Chí Minh</option>
                </select>
              </div>

              <!-- 3. Mã thanh toán -->
              <div class="form-group-field">
                <label>Mã thanh toán</label>
                <input type="text" id="filterReportCode" placeholder="Vui lòng nhập mã thanh toán (VD: R_102107...)">
              </div>

              <!-- 4. Thời gian tạo (Tối đa 3 tháng + Tooltip) -->
              <div class="form-group-field">
                <label style="display:flex; align-items:center; gap:4px;">
                  Thời gian tạo
                  <span class="info-tooltip-icon" title="Khoảng thời gian tối đa là 3 tháng" style="cursor:pointer; color:var(--text-muted); display:inline-flex; align-items:center;">
                    <i data-lucide="help-circle" style="width:13px; height:13px;"></i>
                  </span>
                </label>
                <div class="date-range-input-box" title="Khoảng thời gian tối đa là 3 tháng">
                  <input type="date" id="filterReportCreatedStart" value="2025-06-01">
                  <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                  <input type="date" id="filterReportCreatedEnd" value="2025-08-22">
                  <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
                </div>
              </div>

              <!-- 5. Phương thức thanh toán -->
              <div class="form-group-field">
                <label>Phương thức thanh toán</label>
                <select id="filterReportPayMethod">
                  <option value="all">Vui lòng chọn phương thức thanh toán</option>
                  <option value="card">Thẻ học sinh</option>
                  <option value="qrcode">QR Code (VietQR / QR Bank)</option>
                  <option value="bnpl">BNPL (Trả chậm)</option>
                  <option value="pos">SoftPOS / Thẻ Ngân hàng</option>
                </select>
              </div>

              <!-- 6. Thời gian thanh toán doanh nghiệp -->
              <div class="form-group-field">
                <label>Thời gian thanh toán doanh nghiệp</label>
                <div class="date-range-input-box">
                  <input type="date" id="filterReportMerchantPayStart" value="2025-08-01">
                  <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                  <input type="date" id="filterReportMerchantPayEnd" value="2025-08-22">
                  <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
                </div>
              </div>

              <!-- 7. Trạng thái -->
              <div class="form-group-field">
                <label>Trạng thái</label>
                <select id="filterReportStatus">
                  <option value="all">Vui lòng chọn trạng thái</option>
                  <option value="approved">Đã phê duyệt</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="rejected">Từ chối</option>
                  <option value="cancelled">Hủy</option>
                </select>
              </div>
            </div>

            <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
              <button type="button" class="btn-secondary" onclick="showToast('Đã làm mới bộ lọc báo cáo đối soát')">Làm mới</button>
              <button type="button" class="btn-primary" onclick="showToast('Đã lọc báo cáo đối soát thanh toán')"><i data-lucide="search" style="width:14px; height:14px; margin-right:4px;"></i> Tìm kiếm</button>
            </div>
          </div>
        </form>
      </div>

      <!-- BẢNG DANH SÁCH BÁO CÁO ĐỐI SOÁT THANH TOÁN (17 COLUMNS EXACT MATCHING USER SPECIFICATION) -->
      <div class="table-card">
        <div class="table-header" style="padding:14px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); background:var(--bg-card-subtle, #F8FAFC);">
          <div>
            <span style="font-weight:800; font-size:14px; color:var(--text-main);">Danh sách báo cáo đối soát thanh toán</span>
            <span style="font-size:12px; color:var(--text-muted); margin-left:8px;">(Hiển thị <strong>${list.length}</strong> báo cáo)</span>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-size:13px; color:var(--text-muted);">
              Tổng số tiền phải trả (Tổng cộng): <strong style="font-size:15px; color:#10B981; font-weight:800; margin-left:4px;">665,710,886 đ</strong>
            </div>
            <button class="btn-primary" style="font-size:12px; padding:6px 12px;" onclick="exportReconcileReportExcel()"><i data-lucide="download" style="width:14px; height:14px; margin-right:4px;"></i> Xuất danh sách đối soát thanh toán</button>
          </div>
        </div>

        <div class="table-responsive" style="overflow-x:auto;">
          <table class="portal-table">
            <thead>
              <tr>
                <th style="white-space:nowrap; text-align:center; width:50px;">STT</th>
                <th style="white-space:nowrap;">Mã thanh toán</th>
                <th style="white-space:nowrap;">Thời gian tạo</th>
                <th style="white-space:nowrap;">Khoảng thời gian giao dịch</th>
                <th style="white-space:nowrap;">Phương thức thanh toán</th>
                <th style="white-space:nowrap;">Tên cửa hàng</th>
                <th style="white-space:nowrap;">Mã cửa hàng</th>
                <th style="white-space:nowrap; text-align:right;">Tổng số tiền phải trả (Tổng cộng)</th>
                <th style="white-space:nowrap; text-align:right;">Phí giao dịch</th>
                <th style="white-space:nowrap; text-align:right;">Phí người dùng</th>
                <th style="white-space:nowrap; text-align:right;">Số tiền hoàn cấn trừ</th>
                <th style="white-space:nowrap;">Mô tả</th>
                <th style="white-space:nowrap;">Lý do hủy/từ chối</th>
                <th style="white-space:nowrap;">Thời gian thanh toán doanh nghiệp</th>
                <th style="white-space:nowrap; text-align:center;">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(item => `
                <tr>
                  <td style="text-align:center; font-weight:600;">${item.stt}</td>
                  <td>
                    <a href="javascript:void(0)" onclick="openReconcileReportDetailModal('${item.reconcileCode}')" style="font-weight:700; color:var(--color-primary); text-decoration:underline;">
                      ${item.reconcileCode}
                    </a>
                  </td>
                  <td style="font-size:12.5px;">${item.createdAt}</td>
                  <td style="font-size:12px; color:var(--text-muted);">${item.periodRange}</td>
                  <td>
                    <span class="badge-neutral" style="background:#E2E8F0; color:#334155; padding:3px 8px; border-radius:4px; font-size:11.5px; font-weight:600;">
                      ${item.paymentMethod}
                    </span>
                  </td>
                  <td style="font-size:12.5px;">${item.storeName}</td>
                  <td><code style="font-size:11.5px; background:#F1F5F9; padding:2px 6px; border-radius:4px; color:#475569;">${item.storeCode}</code></td>
                  <td style="text-align:right; font-weight:800; color:${(item.totalPayout || '').startsWith('-') ? '#EF4444' : '#10B981'}; font-size:13.5px;">
                    ${item.totalPayout}
                  </td>
                  <td style="text-align:right; font-size:12.5px;">${item.txnFee || '0 đ'}</td>
                  <td style="text-align:right; font-size:12.5px;">${item.userFee || '0 đ'}</td>
                  <td style="text-align:right; font-weight:600; color:var(--color-danger); font-size:12.5px;">${item.deductedRefundAmount || '0 đ'}</td>
                  <td style="font-size:12px; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.description || ''}">${item.description || '-'}</td>
                  <td style="font-size:12px; color:var(--text-muted); max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.rejectReason || ''}">${item.rejectReason || '-'}</td>
                  <td style="font-size:12.5px; color:var(--text-muted);">${item.merchantPayTime || '-'}</td>
                  <td style="text-align:center;">
                    <span class="status-badge ${item.statusClass}">${item.statusText}</span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  /**
   * Đối soát v2 (Quản lý quyết toán) View
   */
  getReconcileV2View() {
    const list = MockData.getReconcileV2Data ? MockData.getReconcileV2Data() : [];
    return `
      <div class="subpage-header">
        <div>
          <div class="subpage-breadcrumb">Đối soát / <strong>Sao Kê Tài Khoản</strong></div>
          <h1 class="subpage-title">Sao Kê Tài Khoản</h1>
          <p style="font-size:13px; color:var(--text-muted); margin-top:2px;">Quản lý phiên quyết toán doanh thu T+0 / T+1, sao kê chi tiết số dư giải ngân và luồng tiền chuyển về ngân hàng.</p>
        </div>
        <div style="display:flex; gap:10px;">
          <button class="btn-primary" onclick="showToast('Yêu cầu tạo phiên quyết toán mới...')">+ Tạo Phiên Quyết Toán</button>
          <button class="btn-secondary" onclick="showToast('Tải file báo cáo tổng hợp quyết toán v2...')"><i data-lucide="download" style="width:15px; height:15px; margin-right:4px;"></i> Xuất PDF/Excel</button>
        </div>
      </div>

      <!-- MỤC TÌM KIẾM BỘ LỌC QUYẾT TOÁN V2 (7 FIELDS EXACT) -->
      <div class="table-card" style="margin-bottom:20px;">
        <div style="font-size:15px; font-weight:700; margin-bottom:14px; color:var(--text-main); display:flex; align-items:center; gap:8px;">
          <i data-lucide="search" style="width:16px; height:16px; color:var(--color-primary);"></i> Mục Tìm Kiếm
        </div>
        <form id="reconcileV2FilterForm" onsubmit="return false;">
          <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:14px;">
            <!-- 1. Tên cửa hàng -->
            <div class="form-group-field">
              <label>Tên cửa hàng</label>
              <select id="filterV2StoreName">
                <option value="all">Tất cả cửa hàng</option>
                <option value="storeQ1">Chi nhánh Quận 1 - Hồ Chí Minh</option>
                <option value="storeQ3">Chi nhánh Hoàn Kiếm - Hà Nội</option>
                <option value="storeTB">Chi nhánh Hải Châu - Đà Nẵng</option>
              </select>
            </div>

            <!-- 2. Mã thanh toán -->
            <div class="form-group-field">
              <label>Mã thanh toán</label>
              <input type="text" id="filterV2PaymentId" placeholder="Nhập mã thanh toán">
            </div>

            <!-- 3. Thời gian tạo thanh toán -->
            <div class="form-group-field">
              <label>Thời gian tạo thanh toán</label>
              <div class="date-range-input-box">
                <input type="date" id="filterV2CreatedStart" value="2026-08-01">
                <span style="font-size:11px; color:var(--text-muted); margin:0 2px;">đến</span>
                <input type="date" id="filterV2CreatedEnd" value="2026-08-25">
                <span style="margin-left:auto; color:var(--color-primary);"><i data-lucide="calendar" style="width:14px; height:14px;"></i></span>
              </div>
            </div>

            <!-- 4. Phương thức thanh toán -->
            <div class="form-group-field">
              <label>Phương thức thanh toán</label>
              <select id="filterV2PaymentMethod">
                <option value="all">Tất cả phương thức</option>
                <option value="VietQR">VietQR Pay</option>
                <option value="ATM">Thẻ ATM Nội Địa</option>
                <option value="CARD">Thẻ Quốc Tế (Visa/Master)</option>
                <option value="LINK">Payment Link</option>
                <option value="QR_BANK">QR Bank</option>
                <option value="WALLET">Ví điện tử</option>
              </select>
            </div>

            <!-- 5. Người tạo -->
            <div class="form-group-field">
              <label>Người tạo</label>
              <select id="filterV2CreatedBy">
                <option value="all">Tất cả người tạo</option>
                <option value="userA">Nguyễn Văn A</option>
                <option value="userTrang">Phạm Thu Trang</option>
                <option value="userAnh">Vũ Đức Anh</option>
              </select>
            </div>

            <!-- 6. Người phê duyệt -->
            <div class="form-group-field">
              <label>Người phê duyệt</label>
              <select id="filterV2ApprovedBy">
                <option value="all">Tất cả người phê duyệt</option>
                <option value="approverB">Trần Thị B (Kế toán)</option>
                <option value="approverNam">Lê Hoàng Nam (Giám đốc)</option>
              </select>
            </div>

            <!-- 7. Trạng thái -->
            <div class="form-group-field">
              <label>Trạng thái</label>
              <select id="filterV2Status">
                <option value="all">Tất cả trạng thái</option>
                <option value="created">Khởi tạo</option>
                <option value="processing">Đang xử lý</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="rejected">Đã từ chối</option>
                <option value="failed">Thất bại</option>
                <option value="paid">Đã thanh toán</option>
                <option value="success">Thành công</option>
                <option value="pending">Đang chờ duyệt</option>
              </select>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
            <button type="button" class="btn-secondary" onclick="showToast('Đã làm lại bộ lọc quyết toán v2')">Làm lại</button>
            <button type="button" class="btn-primary" onclick="showToast('Đã áp dụng bộ lọc quyết toán v2')">Tìm kiếm</button>
          </div>
        </form>
      </div>

      <!-- BẢNG HIỂN THỊ THÔNG TIN QUYẾT TOÁN V2 (18 COLUMNS EXACT) -->
      <div class="table-card">
        <div class="table-header" style="padding:14px 16px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color);">
          <span style="font-weight:700; font-size:14px; color:var(--text-main);">Hiển thị thông tin quyết toán v2 (${list.length} bản ghi)</span>
          <span class="status-badge badge-success">Đã hoàn tất quyết toán gần nhất</span>
        </div>
        <div class="table-responsive" style="overflow-x:auto;">
          <table class="portal-table">
            <thead>
              <tr>
                <th style="white-space:nowrap;">STT</th>
                <th style="white-space:nowrap;">Mã thanh toán</th>
                <th style="white-space:nowrap;">Tên cửa hàng</th>
                <th style="white-space:nowrap;">Thời gian tạo thanh toán</th>
                <th style="white-space:nowrap;">Phương thức thanh toán</th>
                <th style="white-space:nowrap;">Khoảng thời gian giao dịch</th>
                <th style="white-space:nowrap;">Tổng số tiền phải trả</th>
                <th style="white-space:nowrap;">Phí Giao dịch</th>
                <th style="white-space:nowrap;">Phí người dùng</th>
                <th style="white-space:nowrap;">Số tiền cấn trừ</th>
                <th style="white-space:nowrap;">Người tạo</th>
                <th style="white-space:nowrap;">Tổng số tiền khuyến mãi</th>
                <th style="white-space:nowrap;">Người phê duyệt</th>
                <th style="white-space:nowrap;">Thời gian đối tác được duyệt</th>
                <th style="white-space:nowrap;">Mô tả</th>
                <th style="white-space:nowrap;">Lý do</th>
                <th style="white-space:nowrap;">Thời gian thanh toán doanh nghiệp</th>
                <th style="white-space:nowrap;">Trạng thái</th>
                <th style="white-space:nowrap;">Tùy chỉnh</th>
              </tr>
            </thead>
            <tbody>
              ${list.map(item => `
                <tr>
                  <td><strong>${item.stt}</strong></td>
                  <td><span class="txn-code">${item.paymentId}</span></td>
                  <td style="font-weight:600; white-space:nowrap;">${item.storeName}</td>
                  <td style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${item.paymentCreatedTime}</td>
                  <td style="font-size:12.5px; white-space:nowrap;">${item.paymentMethod}</td>
                  <td style="font-size:11.5px; color:var(--text-muted); white-space:nowrap;">${item.txnTimeRange}</td>
                  <td style="font-weight:700; color:var(--color-primary); white-space:nowrap;">${item.totalPayable}</td>
                  <td style="font-size:12px; white-space:nowrap;">${item.txnFee}</td>
                  <td style="font-size:12px; white-space:nowrap;">${item.userFee}</td>
                  <td style="font-weight:600; color:var(--color-danger); white-space:nowrap;">${item.deductedAmount}</td>
                  <td style="font-size:12.5px; white-space:nowrap;">${item.createdBy}</td>
                  <td style="font-weight:600; color:var(--color-secondary); white-space:nowrap;">${item.totalDiscount}</td>
                  <td style="font-size:12.5px; white-space:nowrap;">${item.approvedBy}</td>
                  <td style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${item.partnerApprovedTime}</td>
                  <td style="font-size:12px; max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.description}">${item.description}</td>
                  <td style="font-size:12px; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${item.reason}">${item.reason}</td>
                  <td style="font-size:12px; color:var(--text-muted); white-space:nowrap;">${item.merchantPayTime}</td>
                  <td><span class="status-badge ${item.statusClass}">${item.statusText}</span></td>
                  <td style="white-space:nowrap;">
                    <button class="btn-primary" style="padding:4px 10px; font-size:12px;" onclick="openReconcileV2DetailModal(${item.stt})">Tùy chỉnh</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
};
