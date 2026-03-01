window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const CLAIMS_RECORDS_KEY = 'hospitalHrClaimsRecords';

    function defaultClaims() {
        return [
            { id: 'CLM-801', employee: 'Anna Santos', category: 'Medical', amount: 2500, date: '2026-02-25', notes: 'Outpatient consultation', status: 'Submitted', reimbursed: false },
            { id: 'CLM-802', employee: 'Jude Molina', category: 'Transportation', amount: 850, date: '2026-02-26', notes: 'Official field visit', status: 'Approved', reimbursed: true },
            { id: 'CLM-803', employee: 'Leah Gomez', category: 'Training', amount: 3200, date: '2026-02-28', notes: 'Certification course', status: 'Under Review', reimbursed: false }
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

    registry.renderClaimHistory = function (container) {
        const claims = getStorageList(CLAIMS_RECORDS_KEY, defaultClaims);

        const submitted = claims.filter(function (item) { return item.status === 'Submitted' || item.status === 'Under Review'; }).length;
        const approved = claims.filter(function (item) { return item.status === 'Approved'; }).length;
        const reimbursed = claims.filter(function (item) { return item.reimbursed === true; }).length;
        const totalAmount = claims.reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0);

        const rows = claims.map(function (item) {
            const statusBadge = item.status === 'Approved'
                ? 'bg-success-subtle text-success'
                : item.status === 'Rejected'
                    ? 'bg-danger-subtle text-danger'
                    : item.status === 'Under Review'
                        ? 'bg-info-subtle text-info'
                        : 'bg-warning-subtle text-warning';
            const payoutBadge = item.reimbursed === true
                ? '<span class="badge bg-success-subtle text-success">Paid</span>'
                : '<span class="badge bg-secondary-subtle text-secondary">Pending Payout</span>';

            return '<tr>'
                + '<td>' + item.id + '</td>'
                + '<td>' + item.employee + '</td>'
                + '<td>' + item.category + '</td>'
                + '<td>₱' + Number(item.amount).toLocaleString() + '</td>'
                + '<td><span class="badge ' + statusBadge + '">' + item.status + '</span></td>'
                + '<td>' + payoutBadge + '</td>'
                + '</tr>';
        }).join('');

        container.innerHTML = [
            '<div class="d-flex justify-content-between align-items-center mb-3 claim-history-submodule"><h6 class="mb-0"><i class="fas fa-clock-rotate-left text-primary me-2"></i>Claim History</h6></div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">For Processing</p><h5 class="mb-0">' + submitted + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved</p><h5 class="mb-0">' + approved + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Reimbursed</p><h5 class="mb-0">' + reimbursed + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Claimed</p><h5 class="mb-0">₱' + totalAmount.toLocaleString() + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-folder-open text-primary me-2"></i>Claims Master History</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>ID</th><th>Employee</th><th>Category</th><th>Amount</th><th>Status</th><th>Reimbursement</th></tr></thead>',
            '      <tbody>' + rows + '</tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');
    };
})(window.HRSubmodules);
