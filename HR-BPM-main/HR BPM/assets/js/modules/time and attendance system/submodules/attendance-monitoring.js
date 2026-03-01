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

    registry.renderAttendanceMonitoring = function (container) {
        const records = getStorageList(ATTENDANCE_RECORDS_KEY, getAttendanceSeedData());
        container.innerHTML = [
            '<div class="card border-0 shadow-sm att-mon-submodule">',
            '  <div class="card-body">',
            '    <div class="d-flex align-items-center gap-2 mb-3"><i class="fas fa-user-check text-primary"></i><h6 class="mb-0">Attendance Monitoring</h6></div>',
            '    <div class="row g-3 mb-3">',
            '      <div class="col-md-4"><input id="attMonSearch" class="form-control" placeholder="Search employee"></div>',
            '      <div class="col-md-3">',
            '        <select id="attMonStatus" class="form-select">',
            '          <option value="All">All Status</option>',
            '          <option value="Present">Present</option>',
            '          <option value="Late">Late</option>',
            '          <option value="On Leave">On Leave</option>',
            '          <option value="No Log-in">No Log-in</option>',
            '        </select>',
            '      </div>',
            '    </div>',
            '    <div id="attMonKpis" class="row g-3 mb-3"></div>',
            '    <div class="table-responsive">',
            '      <table class="table table-sm align-middle mb-0">',
            '        <thead><tr><th>Employee</th><th>Department</th><th>Time In</th><th>Status</th></tr></thead>',
            '        <tbody id="attMonRows"></tbody>',
            '      </table>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');

        const searchInput = document.getElementById('attMonSearch');
        const statusSelect = document.getElementById('attMonStatus');
        const rowsEl = document.getElementById('attMonRows');
        const kpisEl = document.getElementById('attMonKpis');

        function render() {
            const query = (searchInput.value || '').toLowerCase().trim();
            const status = statusSelect.value;
            const filtered = records.filter(function (row) {
                const matchesStatus = status === 'All' || row.status === status;
                const matchesQuery = !query || row.employee.toLowerCase().indexOf(query) !== -1 || row.department.toLowerCase().indexOf(query) !== -1;
                return matchesStatus && matchesQuery;
            });

            const present = filtered.filter(function (row) { return row.status === 'Present'; }).length;
            const late = filtered.filter(function (row) { return row.status === 'Late'; }).length;
            const onLeave = filtered.filter(function (row) { return row.status === 'On Leave'; }).length;
            const noLogin = filtered.filter(function (row) { return row.status === 'No Log-in'; }).length;

            kpisEl.innerHTML = [
                '<div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Present</p><h5 class="mb-0">' + present + '</h5></div></div>',
                '<div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Late</p><h5 class="mb-0">' + late + '</h5></div></div>',
                '<div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">On Leave</p><h5 class="mb-0">' + onLeave + '</h5></div></div>',
                '<div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">No Log-in</p><h5 class="mb-0">' + noLogin + '</h5></div></div>'
            ].join('');

            rowsEl.innerHTML = filtered.map(function (row) {
                const badgeClass = row.status === 'Present'
                    ? 'bg-success-subtle text-success'
                    : row.status === 'Late'
                        ? 'bg-warning-subtle text-warning'
                        : row.status === 'On Leave'
                            ? 'bg-info-subtle text-info'
                            : 'bg-danger-subtle text-danger';
                return '<tr><td>' + row.employee + '</td><td>' + row.department + '</td><td>' + row.timeIn + '</td><td><span class="badge ' + badgeClass + '">' + row.status + '</span></td></tr>';
            }).join('');
        }

        searchInput.addEventListener('input', render);
        statusSelect.addEventListener('change', render);
        render();
    };
})(window.HRSubmodules);
