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

    registry.renderClaimReview = function (container) {
        let claims = getStorageList(CLAIMS_RECORDS_KEY, defaultClaims);

        function render() {
            const reviewQueue = claims.filter(function (item) {
                return item.status === 'Submitted' || item.status === 'Under Review';
            });

            container.innerHTML = [
                '<div class="card border-0 shadow-sm claim-review-submodule">',
                '  <div class="card-header bg-white d-flex justify-content-between align-items-center">',
                '    <h5 class="mb-0"><i class="fas fa-clipboard-check text-primary me-2"></i>Claim Review Queue</h5>',
                '    <span class="badge bg-warning-subtle text-warning">' + reviewQueue.length + ' In Review</span>',
                '  </div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Category</th><th>Amount</th><th>Notes</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                reviewQueue.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.category + '</td>'
                        + '<td>₱' + Number(item.amount).toLocaleString() + '</td>'
                        + '<td>' + item.notes + '</td>'
                        + '<td><span class="badge bg-info-subtle text-info">' + item.status + '</span></td>'
                        + '<td>'
                        + '<button class="btn btn-sm btn-outline-primary me-1" data-action="review" data-id="' + item.id + '">Mark Review</button>'
                        + '<button class="btn btn-sm btn-outline-success me-1" data-action="approve" data-id="' + item.id + '">Approve</button>'
                        + '<button class="btn btn-sm btn-outline-danger" data-action="reject" data-id="' + item.id + '">Reject</button>'
                        + '</td>'
                        + '</tr>';
                }).join(''),
                reviewQueue.length ? '' : '<tr><td colspan="7" class="text-center text-muted py-3">No claims for review.</td></tr>',
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const action = button.getAttribute('data-action');
                    const id = button.getAttribute('data-id');

                    claims = claims.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }

                        const nextStatus = action === 'approve'
                            ? 'Approved'
                            : action === 'reject'
                                ? 'Rejected'
                                : 'Under Review';

                        return {
                            id: item.id,
                            employee: item.employee,
                            category: item.category,
                            amount: item.amount,
                            date: item.date,
                            notes: item.notes,
                            status: nextStatus,
                            reimbursed: item.reimbursed === true
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
