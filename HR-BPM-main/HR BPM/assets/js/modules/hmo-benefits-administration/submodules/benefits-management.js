window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const BENEFITS_KEY = 'hospitalHrBenefitsRecords';

    function defaultBenefits() {
        return [
            { id: 'BEN-6001', employee: 'Anna Santos', hmoPlan: 'Premium Plus', benefitsType: 'Medical', coverage: 250000, claimAmount: 0, claimStatus: 'None', enrolled: true },
            { id: 'BEN-6002', employee: 'Jude Molina', hmoPlan: 'Standard Care', benefitsType: 'Medical', coverage: 180000, claimAmount: 12000, claimStatus: 'Approved', enrolled: true },
            { id: 'BEN-6003', employee: 'Leah Gomez', hmoPlan: 'Basic Care', benefitsType: 'Medical', coverage: 120000, claimAmount: 8000, claimStatus: 'Pending', enrolled: true }
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

    registry.renderBenefitsManagement = function (container) {
        let records = getStorageList(BENEFITS_KEY, defaultBenefits);

        function render() {
            const totalCoverage = records.reduce(function (sum, item) { return sum + Number(item.coverage || 0); }, 0);

            container.innerHTML = [
                '<div class="row g-3 mb-3 benefits-management-submodule">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Benefit Profiles</p><h5 class="mb-0">' + records.length + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Coverage</p><h5 class="mb-0">₱' + totalCoverage.toLocaleString() + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Medical Plans</p><h5 class="mb-0">' + records.filter(function (item) { return item.benefitsType === 'Medical'; }).length + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-shield-heart text-primary me-2"></i>Benefits Management</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Plan</th><th>Coverage</th><th>Benefit Type</th><th>Action</th></tr></thead>',
                '      <tbody>',
                records.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.hmoPlan + '</td>'
                        + '<td>₱' + Number(item.coverage || 0).toLocaleString() + '</td>'
                        + '<td>' + item.benefitsType + '</td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="upgrade" data-id="' + item.id + '">+₱10,000</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="upgrade"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = button.getAttribute('data-id');
                    records = records.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            hmoPlan: item.hmoPlan,
                            benefitsType: item.benefitsType,
                            coverage: Number(item.coverage || 0) + 10000,
                            claimAmount: item.claimAmount,
                            claimStatus: item.claimStatus,
                            enrolled: item.enrolled
                        };
                    });

                    setStorageList(BENEFITS_KEY, records);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
