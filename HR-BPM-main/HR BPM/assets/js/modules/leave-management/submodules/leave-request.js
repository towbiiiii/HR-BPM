window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const LEAVE_REQUESTS_KEY = 'hospitalHrLeaveRequests';

    function defaultRequests() {
        return [
            { id: 'LV-701', employee: 'Anna Santos', type: 'Vacation', from: '2026-03-10', to: '2026-03-12', days: 3, reason: 'Family trip', status: 'Approved' },
            { id: 'LV-702', employee: 'Jude Molina', type: 'Sick', from: '2026-03-04', to: '2026-03-05', days: 2, reason: 'Flu recovery', status: 'Pending' },
            { id: 'LV-703', employee: 'Leah Gomez', type: 'Emergency', from: '2026-03-02', to: '2026-03-02', days: 1, reason: 'Family emergency', status: 'Pending' }
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

    function calcDays(fromValue, toValue) {
        const fromDate = new Date(fromValue);
        const toDate = new Date(toValue);
        if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || toDate < fromDate) {
            return 0;
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.floor((toDate - fromDate) / msPerDay) + 1;
    }

    registry.renderLeaveRequest = function (container) {
        let requests = getStorageList(LEAVE_REQUESTS_KEY, defaultRequests);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 leave-request-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-calendar-plus text-primary me-2"></i>Create Leave Request</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="lvEmp" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-2">',
                '        <select id="lvType" class="form-select">',
                '          <option>Vacation</option><option>Sick</option><option>Emergency</option>',
                '        </select>',
                '      </div>',
                '      <div class="col-md-2"><input id="lvFrom" type="date" class="form-control"></div>',
                '      <div class="col-md-2"><input id="lvTo" type="date" class="form-control"></div>',
                '      <div class="col-md-2"><input id="lvReason" class="form-control" placeholder="Reason"></div>',
                '      <div class="col-md-1"><button id="lvAddBtn" class="btn btn-primary w-100">File</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-inbox text-primary me-2"></i>Leave Filing Queue</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>',
                '      <tbody>',
                requests.map(function (item) {
                    const badge = item.status === 'Approved' ? 'bg-success-subtle text-success' : item.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning';
                    return '<tr><td>' + item.id + '</td><td>' + item.employee + '</td><td>' + item.type + '</td><td>' + item.from + '</td><td>' + item.to + '</td><td>' + item.days + '</td><td><span class="badge ' + badge + '">' + item.status + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('lvAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const employee = (document.getElementById('lvEmp').value || '').trim();
                const type = (document.getElementById('lvType').value || 'Vacation').trim();
                const from = (document.getElementById('lvFrom').value || '').trim();
                const to = (document.getElementById('lvTo').value || '').trim();
                const reason = (document.getElementById('lvReason').value || '').trim();
                const days = calcDays(from, to);

                if (!employee || !from || !to || !reason || !days) {
                    return;
                }

                const nextNumber = 700 + requests.length + 1;
                requests.unshift({
                    id: 'LV-' + nextNumber,
                    employee: employee,
                    type: type,
                    from: from,
                    to: to,
                    days: days,
                    reason: reason,
                    status: 'Pending'
                });

                setStorageList(LEAVE_REQUESTS_KEY, requests);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
