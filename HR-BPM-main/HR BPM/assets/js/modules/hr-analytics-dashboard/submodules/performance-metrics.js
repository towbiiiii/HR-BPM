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

    registry.renderPerformanceMetrics = function (container) {
        let metrics = getStorageList(ANALYTICS_KEY, defaultAnalytics);

        function render() {
            const avgPerformance = metrics.length
                ? metrics.reduce(function (sum, item) { return sum + Number(item.performance || 0); }, 0) / metrics.length
                : 0;

            const highest = metrics.slice().sort(function (a, b) {
                return Number(b.performance || 0) - Number(a.performance || 0);
            })[0];

            container.innerHTML = [
                '<div class="d-flex justify-content-between align-items-center mb-3 performance-metrics-submodule"><h6 class="mb-0"><i class="fas fa-medal text-primary me-2"></i>Performance Metrics</h6></div>',
                '<div class="row g-3 mb-3">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Average Score</p><h5 class="mb-0">' + avgPerformance.toFixed(2) + '/5</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Top Department</p><h5 class="mb-0">' + (highest ? highest.department : 'N/A') + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Improvement Queue</p><h5 class="mb-0">' + metrics.filter(function (item) { return Number(item.performance || 0) < 4; }).length + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-chart-line text-primary me-2"></i>Department Performance Scorecard</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Department</th><th>Performance</th><th>Attendance</th><th>Attrition</th><th>Action</th></tr></thead>',
                '      <tbody>',
                metrics.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.department + '</td>'
                        + '<td>' + Number(item.performance || 0).toFixed(1) + '/5</td>'
                        + '<td>' + Number(item.attendance || 0).toFixed(1) + '%</td>'
                        + '<td>' + Number(item.attrition || 0).toFixed(1) + '%</td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="raise" data-dept="' + item.department + '">Raise +0.1</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="raise"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const department = button.getAttribute('data-dept');
                    metrics = metrics.map(function (item) {
                        if (item.department !== department) {
                            return item;
                        }

                        const nextPerformance = Number(item.performance || 0) + 0.1;
                        return {
                            department: item.department,
                            headcount: item.headcount,
                            active: item.active,
                            attrition: item.attrition,
                            attendance: item.attendance,
                            performance: nextPerformance > 5 ? 5 : Number(nextPerformance.toFixed(1))
                        };
                    });

                    setStorageList(ANALYTICS_KEY, metrics);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
