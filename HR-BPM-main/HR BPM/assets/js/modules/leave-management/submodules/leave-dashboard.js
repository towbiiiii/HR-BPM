window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const LEAVE_REQUESTS_KEY = 'hospitalHrLeaveRequests';
    const LEAVE_BALANCES_KEY = 'hospitalHrLeaveBalances';

    function defaultRequests() {
        return [
            { id: 'LV-701', employee: 'Anna Santos', type: 'Vacation', from: '2026-03-10', to: '2026-03-12', days: 3, reason: 'Family trip', status: 'Approved' },
            { id: 'LV-702', employee: 'Jude Molina', type: 'Sick', from: '2026-03-04', to: '2026-03-05', days: 2, reason: 'Flu recovery', status: 'Pending' },
            { id: 'LV-703', employee: 'Leah Gomez', type: 'Emergency', from: '2026-03-02', to: '2026-03-02', days: 1, reason: 'Family emergency', status: 'Pending' }
        ];
    }

    function defaultBalances() {
        return [
            { employee: 'Anna Santos', vacation: 9, sick: 8, emergency: 3 },
            { employee: 'Jude Molina', vacation: 10, sick: 6, emergency: 3 },
            { employee: 'Leah Gomez', vacation: 7, sick: 5, emergency: 2 }
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

    registry.renderLeaveDashboard = function (container) {
        const requests = getStorageList(LEAVE_REQUESTS_KEY, defaultRequests);
        const balances = getStorageList(LEAVE_BALANCES_KEY, defaultBalances);

        const pending = requests.filter(function (item) { return item.status === 'Pending'; }).length;
        const approved = requests.filter(function (item) { return item.status === 'Approved'; }).length;
        const rejected = requests.filter(function (item) { return item.status === 'Rejected'; }).length;
        const totalDays = requests.reduce(function (sum, item) { return sum + Number(item.days || 0); }, 0);

        const avgVacation = balances.length
            ? Math.round((balances.reduce(function (sum, item) { return sum + Number(item.vacation || 0); }, 0) / balances.length) * 10) / 10
            : 0;

        const latestRows = requests.slice(0, 5).map(function (item) {
            const badge = item.status === 'Approved'
                ? 'bg-success-subtle text-success'
                : item.status === 'Rejected'
                    ? 'bg-danger-subtle text-danger'
                    : 'bg-warning-subtle text-warning';
            return '<tr><td>' + item.id + '</td><td>' + item.employee + '</td><td>' + item.type + '</td><td>' + item.days + '</td><td><span class="badge ' + badge + '">' + item.status + '</span></td></tr>';
        }).join('');

        container.innerHTML = [
            '<div class="d-flex align-items-center gap-2 mb-3"><i class="fas fa-gauge-high text-primary"></i><h6 class="mb-0">Leave Dashboard</h6></div>',
            '<div class="row g-3 mb-3 leave-dashboard-submodule">',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Pending Requests</p><h5 class="mb-0">' + pending + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved Requests</p><h5 class="mb-0">' + approved + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Rejected Requests</p><h5 class="mb-0">' + rejected + '</h5></div></div>',
            '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Leave Days Filed</p><h5 class="mb-0">' + totalDays + '</h5></div></div>',
            '</div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-6"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Average Vacation Balance</p><h5 class="mb-0">' + avgVacation + ' days</h5></div></div>',
            '  <div class="col-md-6"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Active Employees in Leave Ledger</p><h5 class="mb-0">' + balances.length + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-list-check text-primary me-2"></i>Recent Leave Requests</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>Days</th><th>Status</th></tr></thead>',
            '      <tbody>' + latestRows + '</tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');
    };
})(window.HRSubmodules);
