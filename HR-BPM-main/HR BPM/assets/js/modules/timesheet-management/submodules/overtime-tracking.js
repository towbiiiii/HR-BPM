window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const OVERTIME_TRACKING_KEY = 'hospitalHrOvertimeTracking';

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

    registry.renderOvertimeTracking = function (container) {
        const fallback = [
            { id: 'OT-501', employee: 'Mark Rivera', date: '2026-03-01', hours: 2, reason: 'Payroll close', status: 'Approved' },
            { id: 'OT-502', employee: 'Jude Molina', date: '2026-03-01', hours: 3, reason: 'System migration', status: 'Pending' }
        ];

        let overtime = getStorageList(OVERTIME_TRACKING_KEY, fallback);

        function render() {
            const totalHours = overtime.reduce(function (sum, item) { return sum + Number(item.hours || 0); }, 0);

            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 overtime-track-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-business-time text-primary me-2"></i>Log Overtime</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="otEmp" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-2"><input id="otDate" type="date" class="form-control"></div>',
                '      <div class="col-md-2"><input id="otHours" type="number" min="1" max="12" class="form-control" placeholder="Hours"></div>',
                '      <div class="col-md-3"><input id="otReason" class="form-control" placeholder="Reason"></div>',
                '      <div class="col-md-2"><button id="otAddBtn" class="btn btn-primary w-100">Log</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="row g-3 mb-3">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Overtime Entries</p><h5 class="mb-0">' + overtime.length + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total OT Hours</p><h5 class="mb-0">' + totalHours + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Pending Approval</p><h5 class="mb-0">' + overtime.filter(function (item) { return item.status === 'Pending'; }).length + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-stopwatch text-primary me-2"></i>Overtime Tracker</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Date</th><th>Hours</th><th>Reason</th><th>Status</th></tr></thead>',
                '      <tbody>',
                overtime.map(function (item) {
                    const badge = item.status === 'Approved' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning';
                    return '<tr><td>' + item.id + '</td><td>' + item.employee + '</td><td>' + item.date + '</td><td>' + item.hours + '</td><td>' + item.reason + '</td><td><span class="badge ' + badge + '">' + item.status + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('otAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const employee = (document.getElementById('otEmp').value || '').trim();
                const date = (document.getElementById('otDate').value || '').trim();
                const hours = Number(document.getElementById('otHours').value || 0);
                const reason = (document.getElementById('otReason').value || '').trim();

                if (!employee || !date || !hours || !reason) {
                    return;
                }

                const nextNumber = 500 + overtime.length + 1;
                overtime.unshift({
                    id: 'OT-' + nextNumber,
                    employee: employee,
                    date: date,
                    hours: hours,
                    reason: reason,
                    status: 'Pending'
                });

                setStorageList(OVERTIME_TRACKING_KEY, overtime);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
