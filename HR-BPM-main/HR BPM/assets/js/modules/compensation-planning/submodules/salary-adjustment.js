window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const COMPENSATION_KEY = 'hospitalHrCompensationRecords';

    function defaultCompensation() {
        return [
            { id: 'CMP-7001', employee: 'Anna Santos', adjustmentType: 'Merit Increase', amount: 2500, effectiveDate: '2026-03-10', status: 'Pending', incentive: 0, bonus: 0 },
            { id: 'CMP-7002', employee: 'Jude Molina', adjustmentType: 'Promotion Increase', amount: 4000, effectiveDate: '2026-03-15', status: 'Approved', incentive: 1500, bonus: 3000 },
            { id: 'CMP-7003', employee: 'Leah Gomez', adjustmentType: 'Market Alignment', amount: 1800, effectiveDate: '2026-03-20', status: 'Pending', incentive: 800, bonus: 0 }
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

    registry.renderSalaryAdjustment = function (container) {
        let records = getStorageList(COMPENSATION_KEY, defaultCompensation);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 salary-adjustment-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-money-check text-primary me-2"></i>Salary Adjustment Entry</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="cmpEmpName" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-3"><input id="cmpAdjType" class="form-control" placeholder="Adjustment Type"></div>',
                '      <div class="col-md-2"><input id="cmpAdjAmount" type="number" min="1" class="form-control" placeholder="Amount"></div>',
                '      <div class="col-md-2"><input id="cmpAdjDate" type="date" class="form-control"></div>',
                '      <div class="col-md-2"><button id="cmpAdjAddBtn" class="btn btn-primary w-100">Submit</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-chart-line text-primary me-2"></i>Salary Adjustment Pipeline</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>Amount</th><th>Effective Date</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                records.map(function (item) {
                    const badge = item.status === 'Approved' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning';
                    const disabled = item.status === 'Approved' ? ' disabled' : '';
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.adjustmentType + '</td>'
                        + '<td>₱' + Number(item.amount).toLocaleString() + '</td>'
                        + '<td>' + item.effectiveDate + '</td>'
                        + '<td><span class="badge ' + badge + '">' + item.status + '</span></td>'
                        + '<td><button class="btn btn-sm btn-outline-success" data-action="approve" data-id="' + item.id + '"' + disabled + '>Approve</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('cmpAdjAddBtn');
            if (addButton) {
                addButton.addEventListener('click', function () {
                    const employee = (document.getElementById('cmpEmpName').value || '').trim();
                    const adjustmentType = (document.getElementById('cmpAdjType').value || '').trim();
                    const amount = Number(document.getElementById('cmpAdjAmount').value || 0);
                    const effectiveDate = (document.getElementById('cmpAdjDate').value || '').trim();

                    if (!employee || !adjustmentType || !amount || !effectiveDate) {
                        return;
                    }

                    const nextId = 'CMP-' + (7000 + records.length + 1);
                    records.unshift({
                        id: nextId,
                        employee: employee,
                        adjustmentType: adjustmentType,
                        amount: amount,
                        effectiveDate: effectiveDate,
                        status: 'Pending',
                        incentive: 0,
                        bonus: 0
                    });

                    setStorageList(COMPENSATION_KEY, records);
                    render();
                });
            }

            container.querySelectorAll('button[data-action="approve"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = button.getAttribute('data-id');
                    records = records.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            adjustmentType: item.adjustmentType,
                            amount: item.amount,
                            effectiveDate: item.effectiveDate,
                            status: 'Approved',
                            incentive: item.incentive,
                            bonus: item.bonus
                        };
                    });
                    setStorageList(COMPENSATION_KEY, records);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
