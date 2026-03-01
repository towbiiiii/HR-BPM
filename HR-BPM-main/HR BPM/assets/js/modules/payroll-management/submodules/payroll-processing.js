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

    registry.renderPayrollProcessing = function (container) {
        let payroll = getStorageList(PAYROLL_KEY, defaultPayroll);

        function render() {
            const readyCount = payroll.filter(function (item) { return item.status === 'Ready'; }).length;
            const processedCount = payroll.filter(function (item) { return item.status === 'Processed'; }).length;

            container.innerHTML = [
                '<div class="row g-3 mb-3 payroll-processing-submodule">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Ready for Processing</p><h5 class="mb-0">' + readyCount + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Processed</p><h5 class="mb-0">' + processedCount + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Current Cutoff</p><h5 class="mb-0">March 2026</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-gears text-primary me-2"></i>Payroll Processing Queue</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Payroll ID</th><th>Employee</th><th>Period</th><th>Net Pay</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                payroll.map(function (item) {
                    const badge = item.status === 'Processed' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning';
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.period + '</td>'
                        + '<td>₱' + Number(item.net).toLocaleString() + '</td>'
                        + '<td><span class="badge ' + badge + '">' + item.status + '</span></td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="process" data-id="' + item.id + '">Process</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="process"]').forEach(function (button) {
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
                            status: 'Processed',
                            payslip: item.payslip === true
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
