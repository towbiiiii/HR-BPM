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

    registry.renderIncentiveManagement = function (container) {
        let records = getStorageList(COMPENSATION_KEY, defaultCompensation);

        function render() {
            const totalIncentive = records.reduce(function (sum, item) {
                return sum + Number(item.incentive || 0);
            }, 0);

            container.innerHTML = [
                '<div class="row g-3 mb-3 incentive-management-submodule">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Compensation Profiles</p><h5 class="mb-0">' + records.length + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Incentives</p><h5 class="mb-0">₱' + totalIncentive.toLocaleString() + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Average Incentive</p><h5 class="mb-0">₱' + (records.length ? Math.round(totalIncentive / records.length).toLocaleString() : '0') + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-hand-holding-dollar text-primary me-2"></i>Incentive Management</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Adjustment</th><th>Current Incentive</th><th>Action</th></tr></thead>',
                '      <tbody>',
                records.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.adjustmentType + '</td>'
                        + '<td>₱' + Number(item.incentive || 0).toLocaleString() + '</td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="add-incentive" data-id="' + item.id + '">+₱500</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="add-incentive"]').forEach(function (button) {
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
                            status: item.status,
                            incentive: Number(item.incentive || 0) + 500,
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
