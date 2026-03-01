window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const ANALYTICS_KEY = 'hospitalHrAnalyticsMetrics';

    function defaultAnalytics() {
        return [
            { department: 'Human Resources', headcount: 42, active: 40, attrition: 2.4, attendance: 95, performance: 4.2 },
            { department: 'Finance', headcount: 36, active: 34, attrition: 3.1, attendance: 93, performance: 4.0 },
            { department: 'Operations', headcount: 88, active: 84, attrition: 4.7, attendance: 91, performance: 3.8 },
            { department: 'Nursing', headcount: 82, active: 79, attrition: 3.5, attendance: 94, performance: 4.3 }
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

    registry.renderWorkforceReports = function (container) {
        let metrics = getStorageList(ANALYTICS_KEY, defaultAnalytics);

        function render() {
            const totalHeadcount = metrics.reduce(function (sum, item) { return sum + Number(item.headcount || 0); }, 0);
            const totalActive = metrics.reduce(function (sum, item) { return sum + Number(item.active || 0); }, 0);

            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 workforce-reports-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-users-viewfinder text-primary me-2"></i>Add Workforce Snapshot</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="wfDept" class="form-control" placeholder="Department"></div>',
                '      <div class="col-md-2"><input id="wfHeadcount" type="number" min="1" class="form-control" placeholder="Headcount"></div>',
                '      <div class="col-md-2"><input id="wfActive" type="number" min="0" class="form-control" placeholder="Active"></div>',
                '      <div class="col-md-2"><input id="wfAttendance" type="number" min="0" max="100" class="form-control" placeholder="Attendance %"></div>',
                '      <div class="col-md-2"><input id="wfPerformance" type="number" min="1" max="5" step="0.1" class="form-control" placeholder="Perf (1-5)"></div>',
                '      <div class="col-md-1"><button id="wfAddBtn" class="btn btn-primary w-100">Add</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="row g-3 mb-3">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Departments</p><h5 class="mb-0">' + metrics.length + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Headcount</p><h5 class="mb-0">' + totalHeadcount + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Active Employees</p><h5 class="mb-0">' + totalActive + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-table text-primary me-2"></i>Workforce Reports</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Department</th><th>Headcount</th><th>Active</th><th>Attendance</th><th>Attrition</th><th>Performance</th></tr></thead>',
                '      <tbody>',
                metrics.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.department + '</td>'
                        + '<td>' + item.headcount + '</td>'
                        + '<td>' + item.active + '</td>'
                        + '<td>' + item.attendance + '%</td>'
                        + '<td>' + Number(item.attrition || 0).toFixed(1) + '%</td>'
                        + '<td>' + Number(item.performance || 0).toFixed(1) + '</td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('wfAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const department = (document.getElementById('wfDept').value || '').trim();
                const headcount = Number(document.getElementById('wfHeadcount').value || 0);
                const active = Number(document.getElementById('wfActive').value || 0);
                const attendance = Number(document.getElementById('wfAttendance').value || 0);
                const performance = Number(document.getElementById('wfPerformance').value || 0);

                if (!department || !headcount || !attendance || !performance) {
                    return;
                }

                metrics.unshift({
                    department: department,
                    headcount: headcount,
                    active: active > headcount ? headcount : active,
                    attendance: attendance,
                    attrition: 0,
                    performance: performance
                });

                setStorageList(ANALYTICS_KEY, metrics);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
