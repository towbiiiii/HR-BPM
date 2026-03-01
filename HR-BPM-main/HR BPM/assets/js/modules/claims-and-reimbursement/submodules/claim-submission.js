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

    registry.renderClaimSubmission = function (container) {
        let claims = getStorageList(CLAIMS_RECORDS_KEY, defaultClaims);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 claim-submission-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-file-circle-plus text-primary me-2"></i>Submit Claim Request</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="claimEmp" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-2">',
                '        <select id="claimCategory" class="form-select">',
                '          <option>Medical</option><option>Transportation</option><option>Training</option><option>Meal</option><option>Other</option>',
                '        </select>',
                '      </div>',
                '      <div class="col-md-2"><input id="claimAmount" type="number" min="1" class="form-control" placeholder="Amount"></div>',
                '      <div class="col-md-2"><input id="claimDate" type="date" class="form-control"></div>',
                '      <div class="col-md-2"><input id="claimNotes" class="form-control" placeholder="Notes"></div>',
                '      <div class="col-md-1"><button id="claimAddBtn" class="btn btn-primary w-100">File</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-receipt text-primary me-2"></i>Claim Submission Queue</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>',
                '      <tbody>',
                claims.slice(0, 8).map(function (item) {
                    const badge = item.status === 'Approved'
                        ? 'bg-success-subtle text-success'
                        : item.status === 'Rejected'
                            ? 'bg-danger-subtle text-danger'
                            : item.status === 'Under Review'
                                ? 'bg-info-subtle text-info'
                                : 'bg-warning-subtle text-warning';
                    return '<tr><td>' + item.id + '</td><td>' + item.employee + '</td><td>' + item.category + '</td><td>₱' + Number(item.amount).toLocaleString() + '</td><td>' + item.date + '</td><td><span class="badge ' + badge + '">' + item.status + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('claimAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const employee = (document.getElementById('claimEmp').value || '').trim();
                const category = (document.getElementById('claimCategory').value || 'Other').trim();
                const amount = Number(document.getElementById('claimAmount').value || 0);
                const date = (document.getElementById('claimDate').value || '').trim();
                const notes = (document.getElementById('claimNotes').value || '').trim();

                if (!employee || !amount || !date || !notes) {
                    return;
                }

                const nextNumber = 800 + claims.length + 1;
                claims.unshift({
                    id: 'CLM-' + nextNumber,
                    employee: employee,
                    category: category,
                    amount: amount,
                    date: date,
                    notes: notes,
                    status: 'Submitted',
                    reimbursed: false
                });

                setStorageList(CLAIMS_RECORDS_KEY, claims);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
