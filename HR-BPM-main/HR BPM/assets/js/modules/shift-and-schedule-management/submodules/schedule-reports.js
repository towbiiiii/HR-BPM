window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const STAFF_SCHEDULE_KEY = 'hospitalHrStaffSchedule';

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

    registry.renderScheduleReports = function (container) {
        const fallback = [
            { employee: 'Anna Santos', unit: 'HR Ops', day: 'Monday', shift: 'AM-8' },
            { employee: 'Jude Molina', unit: 'Operations', day: 'Monday', shift: 'PM-8' },
            { employee: 'Liza De Leon', unit: 'Nursing', day: 'Monday', shift: 'NS-10' },
            { employee: 'Mark Rivera', unit: 'Finance', day: 'Tuesday', shift: 'AM-8' }
        ];

        const schedules = getStorageList(STAFF_SCHEDULE_KEY, fallback);
        const byShift = {};
        schedules.forEach(function (row) {
            byShift[row.shift] = (byShift[row.shift] || 0) + 1;
        });

        const summaryRows = Object.keys(byShift).map(function (shiftCode) {
            return '<tr><td>' + shiftCode + '</td><td>' + byShift[shiftCode] + '</td></tr>';
        }).join('');

        container.innerHTML = [
            '<div class="d-flex justify-content-between align-items-center mb-3 schedule-reports-submodule">',
            '  <h6 class="mb-0"><i class="fas fa-file-chart-column text-primary me-2"></i>Schedule Reports</h6>',
            '  <button id="exportScheduleCsv" class="btn btn-outline-secondary btn-sm">Export CSV</button>',
            '</div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Assignments</p><h5 class="mb-0">' + schedules.length + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Unique Shift Types</p><h5 class="mb-0">' + Object.keys(byShift).length + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Coverage Days</p><h5 class="mb-0">7</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-chart-simple text-primary me-2"></i>Shift Distribution</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>Shift Code</th><th>Assigned Staff</th></tr></thead>',
            '      <tbody>' + summaryRows + '</tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');

        const exportButton = document.getElementById('exportScheduleCsv');
        if (exportButton) {
            exportButton.addEventListener('click', function () {
                const csvLines = ['Employee,Unit,Day,Shift'];
                schedules.forEach(function (row) {
                    csvLines.push([row.employee, row.unit, row.day, row.shift].join(','));
                });

                const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'schedule-reports.csv';
                link.click();
                URL.revokeObjectURL(link.href);
            });
        }
    };
})(window.HRSubmodules);
