window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const ATTENDANCE_RECORDS_KEY = 'hospitalHrAttendanceRecords';

    function getAttendanceSeedData() {
        return [
            { employee: 'Anna Santos', department: 'HR Operations', timeIn: '08:02 AM', status: 'Present' },
            { employee: 'Mark Rivera', department: 'Finance', timeIn: '08:21 AM', status: 'Late' },
            { employee: 'Liza De Leon', department: 'Nursing', timeIn: '-', status: 'No Log-in' },
            { employee: 'Paolo Cruz', department: 'HR Operations', timeIn: '-', status: 'On Leave' },
            { employee: 'Jude Molina', department: 'Operations', timeIn: '07:58 AM', status: 'Present' },
            { employee: 'Mara Lopez', department: 'Nursing', timeIn: '08:17 AM', status: 'Late' }
        ];
    }

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

    registry.renderAttendanceReports = function (container) {
        const records = getStorageList(ATTENDANCE_RECORDS_KEY, getAttendanceSeedData());
        const departments = {};
        records.forEach(function (row) {
            const current = departments[row.department] || { total: 0, late: 0, absences: 0 };
            current.total += 1;
            if (row.status === 'Late') {
                current.late += 1;
            }
            if (row.status === 'No Log-in') {
                current.absences += 1;
            }
            departments[row.department] = current;
        });

        const rows = Object.keys(departments).map(function (dept) {
            const info = departments[dept];
            const attendanceRate = Math.max(0, Math.round(((info.total - info.absences) / info.total) * 100));
            return '<tr><td>' + dept + '</td><td>' + attendanceRate + '%</td><td>' + info.late + '</td><td>' + info.absences + '</td></tr>';
        }).join('');

        container.innerHTML = [
            '<div class="d-flex justify-content-between align-items-center mb-3 att-reports-submodule"><h6 class="mb-0"><i class="fas fa-chart-column text-primary me-2"></i>Attendance Reports</h6><button id="attExportCsv" class="btn btn-outline-secondary btn-sm">Export CSV</button></div>',
            '<div class="row g-3 mb-3">',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Monthly Attendance Rate</p><h5 class="mb-0">93%</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Average Late Minutes</p><h5 class="mb-0">14 min</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Absence Incidents</p><h5 class="mb-0">8</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0">Department Attendance Summary</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>Department</th><th>Attendance Rate</th><th>Late Cases</th><th>Absences</th></tr></thead>',
            '      <tbody>' + rows + '</tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');

        const exportButton = document.getElementById('attExportCsv');
        if (exportButton) {
            exportButton.addEventListener('click', function () {
                const csvLines = ['Department,Attendance Rate,Late Cases,Absences'];
                Object.keys(departments).forEach(function (dept) {
                    const info = departments[dept];
                    const rate = Math.max(0, Math.round(((info.total - info.absences) / info.total) * 100));
                    csvLines.push([dept, rate + '%', info.late, info.absences].join(','));
                });

                const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'attendance-reports.csv';
                link.click();
                URL.revokeObjectURL(link.href);
            });
        }
    };
})(window.HRSubmodules);
