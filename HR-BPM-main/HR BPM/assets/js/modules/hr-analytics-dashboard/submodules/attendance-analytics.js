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

    registry.renderAttendanceAnalytics = function (container) {
        let metrics = getStorageList(ANALYTICS_KEY, defaultAnalytics);

        function render() {
            const averageAttendance = metrics.length
                ? metrics.reduce(function (sum, item) { return sum + Number(item.attendance || 0); }, 0) / metrics.length
                : 0;

            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 attendance-analytics-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-user-check text-primary me-2"></i>Attendance Analytics Tuning</h6>',
                '    <p class="text-muted mb-0">Use action buttons to simulate attendance interventions by department.</p>',
                '  </div>',
                '</div>',
                '<div class="row g-3 mb-3">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Average Attendance</p><h5 class="mb-0">' + averageAttendance.toFixed(2) + '%</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Best Department</p><h5 class="mb-0">' + getBestDepartment(metrics) + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Watchlist</p><h5 class="mb-0">' + metrics.filter(function (item) { return Number(item.attendance || 0) < 92; }).length + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-clock text-primary me-2"></i>Attendance Analytics</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Department</th><th>Attendance</th><th>Active</th><th>Headcount</th><th>Action</th></tr></thead>',
                '      <tbody>',
                metrics.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.department + '</td>'
                        + '<td>' + Number(item.attendance || 0).toFixed(1) + '%</td>'
                        + '<td>' + item.active + '</td>'
                        + '<td>' + item.headcount + '</td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="boost" data-dept="' + item.department + '">Boost +1%</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="boost"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const department = button.getAttribute('data-dept');
                    metrics = metrics.map(function (item) {
                        if (item.department !== department) {
                            return item;
                        }

                        const nextAttendance = Number(item.attendance || 0) + 1;
                        return {
                            department: item.department,
                            headcount: item.headcount,
                            active: item.active,
                            attrition: item.attrition,
                            attendance: nextAttendance > 100 ? 100 : Number(nextAttendance.toFixed(1)),
                            performance: item.performance
                        };
                    });

                    setStorageList(ANALYTICS_KEY, metrics);
                    render();
                });
            });
        }

        function getBestDepartment(metrics) {
            if (!metrics.length) {
                return 'N/A';
            }
            return metrics.slice().sort(function (a, b) {
                return Number(b.attendance || 0) - Number(a.attendance || 0);
            })[0].department;
        }

        render();
    };
})(window.HRSubmodules);
