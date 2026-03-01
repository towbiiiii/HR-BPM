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

    function setStorageList(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    registry.renderReimbursementProcessing = function (container) {
        let claims = getStorageList(CLAIMS_RECORDS_KEY, defaultClaims);

        function render() {
            const approvedPending = claims.filter(function (item) {
                return item.status === 'Approved' && item.reimbursed !== true;
            });

            const processedAmount = claims
                .filter(function (item) { return item.reimbursed === true; })
                .reduce(function (sum, item) { return sum + Number(item.amount || 0); }, 0);

            container.innerHTML = [
                '<div class="row g-3 mb-3 reimbursement-processing-submodule">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved Pending Payout</p><h5 class="mb-0">' + approvedPending.length + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Processed Amount</p><h5 class="mb-0">₱' + processedAmount.toLocaleString() + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Processing Queue</p><h5 class="mb-0">' + approvedPending.length + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-money-check-dollar text-primary me-2"></i>Reimbursement Processing</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Category</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                approvedPending.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.category + '</td>'
                        + '<td>₱' + Number(item.amount).toLocaleString() + '</td>'
                        + '<td><span class="badge bg-success-subtle text-success">Approved</span></td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="pay" data-id="' + item.id + '">Mark Paid</button></td>'
                        + '</tr>';
                }).join(''),
                approvedPending.length ? '' : '<tr><td colspan="6" class="text-center text-muted py-3">No approved claims waiting for payout.</td></tr>',
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="pay"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = button.getAttribute('data-id');

                    claims = claims.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            category: item.category,
                            amount: item.amount,
                            date: item.date,
                            notes: item.notes,
                            status: item.status,
                            reimbursed: true
                        };
                    });

                    setStorageList(CLAIMS_RECORDS_KEY, claims);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
