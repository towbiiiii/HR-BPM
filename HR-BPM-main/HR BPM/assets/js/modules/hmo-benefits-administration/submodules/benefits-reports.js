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

    registry.renderBenefitsReports = function (container) {
        const records = getStorageList(BENEFITS_KEY, defaultBenefits);

        const totalCoverage = records.reduce(function (sum, item) { return sum + Number(item.coverage || 0); }, 0);
        const totalClaims = records.reduce(function (sum, item) { return sum + Number(item.claimAmount || 0); }, 0);
        const approvedClaims = records.filter(function (item) { return item.claimStatus === 'Approved'; }).length;

        container.innerHTML = [
            '<div class="d-flex justify-content-between align-items-center mb-3 benefits-reports-submodule"><h6 class="mb-0"><i class="fas fa-chart-pie text-primary me-2"></i>Benefits Reports</h6></div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Profiles</p><h5 class="mb-0">' + records.length + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Coverage</p><h5 class="mb-0">₱' + totalCoverage.toLocaleString() + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Claims</p><h5 class="mb-0">₱' + totalClaims.toLocaleString() + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved Claims</p><h5 class="mb-0">' + approvedClaims + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-table-list text-primary me-2"></i>Benefits Utilization Report</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>ID</th><th>Employee</th><th>Plan</th><th>Coverage</th><th>Claim Amount</th><th>Claim Status</th></tr></thead>',
            '      <tbody>',
            records.map(function (item) {
                const badge = item.claimStatus === 'Approved'
                    ? 'bg-success-subtle text-success'
                    : item.claimStatus === 'Pending'
                        ? 'bg-warning-subtle text-warning'
                        : 'bg-secondary-subtle text-secondary';
                return '<tr>'
                    + '<td>' + item.id + '</td>'
                    + '<td>' + item.employee + '</td>'
                    + '<td>' + item.hmoPlan + '</td>'
                    + '<td>₱' + Number(item.coverage || 0).toLocaleString() + '</td>'
                    + '<td>₱' + Number(item.claimAmount || 0).toLocaleString() + '</td>'
                    + '<td><span class="badge ' + badge + '">' + item.claimStatus + '</span></td>'
                    + '</tr>';
            }).join(''),
            '      </tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');
    };
})(window.HRSubmodules);
