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

    registry.renderLeaveReports = function (container) {
        const requests = getStorageList(LEAVE_REQUESTS_KEY, defaultRequests);
        const typeSummary = { Vacation: 0, Sick: 0, Emergency: 0 };

        requests.forEach(function (item) {
            if (typeof typeSummary[item.type] !== 'number') {
                typeSummary[item.type] = 0;
            }
            typeSummary[item.type] += Number(item.days || 0);
        });

        const rows = Object.keys(typeSummary).map(function (type) {
            return '<tr><td>' + type + '</td><td>' + typeSummary[type] + '</td></tr>';
        }).join('');

        container.innerHTML = [
            '<div class="d-flex justify-content-between align-items-center mb-3 leave-reports-submodule"><h6 class="mb-0"><i class="fas fa-chart-pie text-primary me-2"></i>Leave Reports</h6><button id="leaveExportCsv" class="btn btn-outline-secondary btn-sm">Export CSV</button></div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Requests</p><h5 class="mb-0">' + requests.length + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved</p><h5 class="mb-0">' + requests.filter(function (item) { return item.status === 'Approved'; }).length + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Pending</p><h5 class="mb-0">' + requests.filter(function (item) { return item.status === 'Pending'; }).length + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-chart-column text-primary me-2"></i>Leave Days by Type</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>Leave Type</th><th>Total Days</th></tr></thead>',
            '      <tbody>' + rows + '</tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');

        const exportButton = document.getElementById('leaveExportCsv');
        if (exportButton) {
            exportButton.addEventListener('click', function () {
                const csvLines = ['ID,Employee,Type,From,To,Days,Status'];
                requests.forEach(function (item) {
                    csvLines.push([item.id, item.employee, item.type, item.from, item.to, item.days, item.status].join(','));
                });

                const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'leave-reports.csv';
                link.click();
                URL.revokeObjectURL(link.href);
            });
        }
    };
})(window.HRSubmodules);
