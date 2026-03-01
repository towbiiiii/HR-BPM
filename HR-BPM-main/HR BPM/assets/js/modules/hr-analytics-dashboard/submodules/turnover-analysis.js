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

    registry.renderTurnoverAnalysis = function (container) {
        let metrics = getStorageList(ANALYTICS_KEY, defaultAnalytics);

        function render() {
            const highRisk = metrics.filter(function (item) { return Number(item.attrition || 0) >= 4; }).length;
            const avgAttrition = metrics.length
                ? metrics.reduce(function (sum, item) { return sum + Number(item.attrition || 0); }, 0) / metrics.length
                : 0;

            container.innerHTML = [
                '<div class="row g-3 mb-3 turnover-analysis-submodule">',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Avg Attrition</p><h5 class="mb-0">' + avgAttrition.toFixed(2) + '%</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">High Risk Departments</p><h5 class="mb-0">' + highRisk + '</h5></div></div>',
                '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Retention Focus</p><h5 class="mb-0">Q2 2026</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-arrow-trend-down text-primary me-2"></i>Turnover Analysis</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Department</th><th>Headcount</th><th>Active</th><th>Attrition</th><th>Risk</th><th>Action</th></tr></thead>',
                '      <tbody>',
                metrics.map(function (item) {
                    const risk = Number(item.attrition || 0) >= 4 ? 'High' : Number(item.attrition || 0) >= 3 ? 'Medium' : 'Low';
                    const riskBadge = risk === 'High'
                        ? 'bg-danger-subtle text-danger'
                        : risk === 'Medium'
                            ? 'bg-warning-subtle text-warning'
                            : 'bg-success-subtle text-success';

                    return '<tr>'
                        + '<td>' + item.department + '</td>'
                        + '<td>' + item.headcount + '</td>'
                        + '<td>' + item.active + '</td>'
                        + '<td>' + Number(item.attrition || 0).toFixed(1) + '%</td>'
                        + '<td><span class="badge ' + riskBadge + '">' + risk + '</span></td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="improve" data-dept="' + item.department + '">Improve Retention</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action="improve"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const department = button.getAttribute('data-dept');
                    metrics = metrics.map(function (item) {
                        if (item.department !== department) {
                            return item;
                        }

                        const nextAttrition = Number(item.attrition || 0) - 0.3;
                        return {
                            department: item.department,
                            headcount: item.headcount,
                            active: item.active,
                            attrition: nextAttrition < 0 ? 0 : Number(nextAttrition.toFixed(1)),
                            attendance: item.attendance,
                            performance: item.performance
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
