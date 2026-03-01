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

    function setStorageList(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    registry.renderPayslipGeneration = function (container) {
        let payroll = getStorageList(PAYROLL_KEY, defaultPayroll);

        function render() {
            const readyForPayslip = payroll.filter(function (item) {
                return item.status === 'Processed' && item.payslip !== true;
            });

            const generatedCount = payroll.filter(function (item) { return item.payslip === true; }).length;

            container.innerHTML = [
                '<div class="row g-3 mb-3 payslip-generation-submodule">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Ready for Payslip</p><h5 class="mb-0">' + readyForPayslip.length + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Generated Payslips</p><h5 class="mb-0">' + generatedCount + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Distribution Status</p><h5 class="mb-0">Ready</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-file-invoice-dollar text-primary me-2"></i>Payslip Generation</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Payroll ID</th><th>Employee</th><th>Period</th><th>Net Pay</th><th>Payslip</th><th>Action</th></tr></thead>',
                '      <tbody>',
                payroll.map(function (item) {
                    const payslipBadge = item.payslip === true
                        ? '<span class="badge bg-success-subtle text-success">Generated</span>'
                        : '<span class="badge bg-warning-subtle text-warning">Pending</span>';
                    const disabled = item.status !== 'Processed' || item.payslip === true ? ' disabled' : '';

                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.period + '</td>'
                        + '<td>₱' + Number(item.net).toLocaleString() + '</td>'
                        + '<td>' + payslipBadge + '</td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="generate" data-id="' + item.id + '"' + disabled + '>Generate</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="generate"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = button.getAttribute('data-id');
                    payroll = payroll.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            period: item.period,
                            base: item.base,
                            overtime: item.overtime,
                            deductions: item.deductions,
                            net: item.net,
                            status: item.status,
                            payslip: true
                        };
                    });
                    setStorageList(PAYROLL_KEY, payroll);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
