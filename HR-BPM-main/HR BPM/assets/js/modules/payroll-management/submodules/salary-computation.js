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

    registry.renderSalaryComputation = function (container) {
        let payroll = getStorageList(PAYROLL_KEY, defaultPayroll);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 salary-computation-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-calculator text-primary me-2"></i>Compute Salary Entry</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="salaryEmployee" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-2"><input id="salaryBase" type="number" class="form-control" placeholder="Base"></div>',
                '      <div class="col-md-2"><input id="salaryOvertime" type="number" class="form-control" placeholder="Overtime"></div>',
                '      <div class="col-md-2"><input id="salaryDeduction" type="number" class="form-control" placeholder="Deductions"></div>',
                '      <div class="col-md-2"><input id="salaryPeriod" type="date" class="form-control"></div>',
                '      <div class="col-md-1"><button id="salaryComputeBtn" class="btn btn-primary w-100">Add</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-receipt text-primary me-2"></i>Salary Computation Ledger</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Payroll ID</th><th>Employee</th><th>Base</th><th>Overtime</th><th>Deductions</th><th>Net Pay</th></tr></thead>',
                '      <tbody>',
                payroll.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>₱' + Number(item.base).toLocaleString() + '</td>'
                        + '<td>₱' + Number(item.overtime).toLocaleString() + '</td>'
                        + '<td>₱' + Number(item.deductions).toLocaleString() + '</td>'
                        + '<td class="fw-semibold">₱' + Number(item.net).toLocaleString() + '</td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const computeButton = document.getElementById('salaryComputeBtn');
            if (!computeButton) {
                return;
            }

            computeButton.addEventListener('click', function () {
                const employee = (document.getElementById('salaryEmployee').value || '').trim();
                const base = Number(document.getElementById('salaryBase').value || 0);
                const overtime = Number(document.getElementById('salaryOvertime').value || 0);
                const deductions = Number(document.getElementById('salaryDeduction').value || 0);
                const period = (document.getElementById('salaryPeriod').value || '').trim();

                if (!employee || !base || !period) {
                    return;
                }

                const net = base + overtime - deductions;
                const nextId = 'PAY-' + (9000 + payroll.length + 1);
                payroll.unshift({
                    id: nextId,
                    employee: employee,
                    period: period,
                    base: base,
                    overtime: overtime,
                    deductions: deductions,
                    net: net,
                    status: 'Ready',
                    payslip: false
                });

                setStorageList(PAYROLL_KEY, payroll);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
