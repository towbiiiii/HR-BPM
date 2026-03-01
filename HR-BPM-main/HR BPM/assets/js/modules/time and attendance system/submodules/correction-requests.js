window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const CORRECTION_REQUESTS_KEY = 'hospitalHrCorrectionRequests';

    function getStorageList(key, fallback) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            localStorage.setItem(key, JSON.stringify(fallback));
            return fallback.slice();
        }

        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
        }

        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback.slice();
    }

    function setStorageList(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    registry.renderCorrectionRequests = function (container) {
        const fallback = [
            { id: 'CR-1042', employee: 'Anna Santos', issue: 'Missing Time Out', status: 'Pending' },
            { id: 'CR-1041', employee: 'Miguel Reyes', issue: 'Wrong Shift Tag', status: 'Approved' },
            { id: 'CR-1038', employee: 'Leah Gomez', issue: 'Late Log Adjustment', status: 'Rejected' }
        ];
        let requests = getStorageList(CORRECTION_REQUESTS_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 corr-req-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-pen-to-square text-primary me-2"></i>Submit New Correction Request</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-4"><input id="corrEmployee" class="form-control" placeholder="Employee name"></div>',
                '      <div class="col-md-5"><input id="corrIssue" class="form-control" placeholder="Issue description"></div>',
                '      <div class="col-md-3"><button id="corrAddBtn" class="btn btn-primary w-100">Add Request</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-list-check text-primary me-2"></i>Correction Request Tracker</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Request ID</th><th>Employee</th><th>Issue</th><th>Status</th></tr></thead>',
                '      <tbody>',
                requests.map(function (item) {
                    const badge = item.status === 'Approved'
                        ? 'bg-success-subtle text-success'
                        : item.status === 'Rejected'
                            ? 'bg-danger-subtle text-danger'
                            : 'bg-warning-subtle text-warning';
                    return '<tr><td>' + item.id + '</td><td>' + item.employee + '</td><td>' + item.issue + '</td><td><span class="badge ' + badge + '">' + item.status + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('corrAddBtn');
            if (addButton) {
                addButton.addEventListener('click', function () {
                    const employee = (document.getElementById('corrEmployee').value || '').trim();
                    const issue = (document.getElementById('corrIssue').value || '').trim();
                    if (!employee || !issue) {
                        return;
                    }

                    const nextNumber = 1000 + requests.length + 1;
                    requests.unshift({
                        id: 'CR-' + nextNumber,
                        employee: employee,
                        issue: issue,
                        status: 'Pending'
                    });
                    setStorageList(CORRECTION_REQUESTS_KEY, requests);
                    render();
                });
            }
        }

        render();
    };
})(window.HRSubmodules);
