/**
 * Eco Merchant Portal - Chart Management System
 * Uses Chart.js for high performance interactive charts with safe fallbacks
 */

const PortalCharts = {
  revenueChart: null,
  channelChart: null,

  init(storeId = 'all', rangeDays = 7) {
    try {
      this.renderRevenueChart(storeId, rangeDays);
      this.renderChannelChart(storeId);
    } catch (e) {
      console.warn('Chart initialization fallback:', e);
    }
  },

  update(storeId = 'all', rangeDays = 7) {
    try {
      const data = MockData.getChartData(storeId, rangeDays);
      const channelData = MockData.getChannelDistribution(storeId);

      // Update Revenue Chart
      if (this.revenueChart && typeof this.revenueChart.update === 'function') {
        this.revenueChart.data.labels = data.labels;
        this.revenueChart.data.datasets[0].data = data.revenueData;
        this.revenueChart.update('active');
      } else {
        this.renderRevenueChart(storeId, rangeDays);
      }

      // Update Donut Channel Chart
      if (this.channelChart && typeof this.channelChart.update === 'function') {
        this.channelChart.data.datasets[0].data = channelData.channels.map(c => c.value);
        this.channelChart.update('active');
      } else {
        this.renderChannelChart(storeId);
      }

      // Update Center Label
      const centerEl = document.getElementById('donutCenterAmount');
      if (centerEl) {
        centerEl.textContent = this.formatShortVnd(channelData.totalGmv);
      }
    } catch (e) {
      console.warn('Chart update fallback:', e);
    }
  },

  renderRevenueChart(storeId = 'all', rangeDays = 7) {
    const ctx = document.getElementById('revenueTrendChart');
    if (!ctx) return;

    if (typeof Chart === 'undefined') {
      this.renderRevenueFallbackSVG(ctx, storeId, rangeDays);
      return;
    }

    try {
      if (this.revenueChart) this.revenueChart.destroy();

      const data = MockData.getChartData(storeId, rangeDays);

      const chartCtx = ctx.getContext('2d');
      let gradient = '#0A66C2';
      if (chartCtx) {
        gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(10, 102, 194, 0.35)');
        gradient.addColorStop(1, 'rgba(10, 102, 194, 0.01)');
      }

      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: 'GMV Doanh thu (VNĐ)',
            data: data.revenueData,
            borderColor: '#0A66C2',
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#0A66C2',
            pointBorderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: '#64748B' } },
            y: {
              grid: { color: '#E2E8F0' },
              ticks: {
                color: '#64748B',
                callback: (val) => this.formatShortVnd(val)
              }
            }
          }
        }
      });
    } catch (err) {
      console.warn('Render revenue chart fallback:', err);
      this.renderRevenueFallbackSVG(ctx, storeId, rangeDays);
    }
  },

  renderChannelChart(storeId = 'all') {
    const ctx = document.getElementById('channelDonutChart');
    if (!ctx) return;

    const channelData = MockData.getChannelDistribution(storeId);
    this.renderCustomLegend(channelData);

    const centerEl = document.getElementById('donutCenterAmount');
    if (centerEl) {
      centerEl.textContent = this.formatShortVnd(channelData.totalGmv);
    }

    if (typeof Chart === 'undefined') {
      return;
    }

    try {
      const percentagePlugin = {
        id: 'percentagePlugin',
        afterDraw(chart) {
          const { ctx, data } = chart;
          const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
          if (!total) return;

          chart.getDatasetMeta(0).data.forEach((element, index) => {
            const val = data.datasets[0].data[index];
            const pct = Math.round((val / total) * 100);
            if (pct < 3) return; // Skip tiny slices

            const { x, y } = element.tooltipPosition();
            ctx.save();
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 3;
            ctx.fillText(`${pct}%`, x, y);
            ctx.restore();
          });
        }
      };

      this.channelChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: channelData.channels.map(c => c.name),
          datasets: [{
            data: channelData.channels.map(c => c.value),
            backgroundColor: channelData.channels.map(c => c.color),
            borderWidth: 3,
            borderColor: '#FFFFFF'
          }]
        },
        plugins: [percentagePlugin],
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const val = context.raw;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const pct = ((val / total) * 100).toFixed(1);
                  return ` ${context.label}: ${PortalCharts.formatShortVnd(val)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    } catch (err) {
      console.warn('Render channel chart fallback:', err);
    }
  },

  renderRevenueFallbackSVG(canvasEl, storeId, rangeDays) {
    const parent = canvasEl.parentElement;
    if (!parent) return;
    const data = MockData.getChartData(storeId, rangeDays);
    const maxVal = Math.max(...data.revenueData, 1);

    const barsHTML = data.revenueData.map((val, i) => {
      const pct = Math.round((val / maxVal) * 100);
      return `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%; justify-content:flex-end;">
          <span style="font-size:10px; font-weight:700; color:#0A66C2;">${this.formatShortVnd(val)}</span>
          <div style="width:70%; height:${pct}%; background:linear-gradient(180deg, #0A66C2 0%, #00C853 100%); border-radius:4px 4px 0 0;"></div>
          <span style="font-size:11px; color:#64748B; font-weight:600;">${data.labels[i]}</span>
        </div>
      `;
    }).join('');

    parent.innerHTML = `<div style="display:flex; align-items:flex-end; gap:10px; width:100%; height:240px; padding:20px 10px 0 10px;">${barsHTML}</div>`;
  },

  renderCustomLegend(channelData) {
    const legendEl = document.getElementById('channelLegendContainer');
    if (!legendEl) return;

    legendEl.innerHTML = channelData.channels.map(ch => `
      <div class="legend-item">
        <div class="legend-left">
          <span class="legend-dot" style="background-color: ${ch.color};"></span>
          <span class="legend-name">${ch.name}</span>
        </div>
        <div class="legend-right">
          <span class="legend-val">${this.formatShortVnd(ch.value)}</span>
          <span class="legend-pct">${ch.percent}%</span>
        </div>
      </div>
    `).join('');
  },

  formatShortVnd(amount) {
    if (amount >= 1000000000) return (amount / 1000000000).toFixed(2) + ' Tỷ';
    if (amount >= 1000000) return (amount / 1000000).toFixed(1) + ' Tr';
    if (amount >= 1000) return (amount / 1000).toFixed(0) + ' K';
    return amount.toLocaleString('vi-VN') + ' đ';
  }
};
