window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const PAYROLL_KEY = 'hospitalHrPayrollRecords';

    function defaultPayroll() {
        return [
            { id: 'PAY-9001', employee: 'Anna Santos', period: '2026-03-15', base: 32000, overtime: 1800, deductions: 2400, net: 31400, status: 'Ready', payslip: false },
            { id: 'PAY-9002', employee: 'Jude Molina', period: '2026-03-15', base: 28500, overtime: 950, deductions: 2100, net: 27350, status: 'Processed', payslip: true },
            { id: 'PAY-9003', employee: 'Leah Gomez', period: '2026-03-15', base: 30000, overtime: 1200, deductions: 2200, net: 29000, status: 'Ready', payslip: false }
        ];
    }

    function getStorageList(key, fallbackFn) {
        const raw = localStorage.getItem(key);
        const fallback = fallbackFn();
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(fallback));
            return fallback;
        }

        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
        }

        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
    }

    registry.renderPayrollReports = function (container) {
        const payroll = getStorageList(PAYROLL_KEY, defaultPayroll);
        const totalNet = payroll.reduce(function (sum, item) { return sum + Number(item.net || 0); }, 0);
        const totalBase = payroll.reduce(function (sum, item) { return sum + Number(item.base || 0); }, 0);
        const totalDeductions = payroll.reduce(function (sum, item) { return sum + Number(item.deductions || 0); }, 0);
        const processedCount = payroll.filter(function (item) { return item.status === 'Processed'; }).length;

        container.innerHTML = [
            '<div class="d-flex justify-content-between align-items-center mb-3 payroll-reports-submodule"><h6 class="mb-0"><i class="fas fa-chart-column text-primary me-2"></i>Payroll Reports</h6></div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Payroll Runs</p><h5 class="mb-0">' + payroll.length + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Processed</p><h5 class="mb-0">' + processedCount + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Net Pay</p><h5 class="mb-0">₱' + totalNet.toLocaleString() + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Deductions</p><h5 class="mb-0">₱' + totalDeductions.toLocaleString() + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-table text-primary me-2"></i>Payroll Summary Report</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>Payroll ID</th><th>Employee</th><th>Period</th><th>Gross (Base+OT)</th><th>Deductions</th><th>Net Pay</th><th>Status</th></tr></thead>',
            '      <tbody>',
            payroll.map(function (item) {
                const gross = Number(item.base || 0) + Number(item.overtime || 0);
                const badge = item.status === 'Processed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning';

                return '<tr>'
                    + '<td>' + item.id + '</td>'
                    + '<td>' + item.employee + '</td>'
                    + '<td>' + item.period + '</td>'
                    + '<td>₱' + gross.toLocaleString() + '</td>'
                    + '<td>₱' + Number(item.deductions || 0).toLocaleString() + '</td>'
                    + '<td class="fw-semibold">₱' + Number(item.net || 0).toLocaleString() + '</td>'
                    + '<td><span class="badge ' + badge + '">' + item.status + '</span></td>'
                    + '</tr>';
            }).join(''),
            '      </tbody>',
            '      <tfoot><tr><th colspan="3">Totals</th><th>₱' + (totalBase + payroll.reduce(function (sum, item) { return sum + Number(item.overtime || 0); }, 0)).toLocaleString() + '</th><th>₱' + totalDeductions.toLocaleString() + '</th><th>₱' + totalNet.toLocaleString() + '</th><th></th></tr></tfoot>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');
    };
})(window.HRSubmodules);
