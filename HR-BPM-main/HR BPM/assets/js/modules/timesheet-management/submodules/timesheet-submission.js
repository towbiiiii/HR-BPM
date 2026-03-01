window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const TIMESHEET_SUBMISSIONS_KEY = 'hospitalHrTimesheetSubmissions';

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

    registry.renderTimesheetSubmission = function (container) {
        const fallback = [
            { id: 'TS-301', employee: 'Anna Santos', week: '2026-W09', hours: 40, status: 'Submitted' },
            { id: 'TS-302', employee: 'Mark Rivera', week: '2026-W09', hours: 38, status: 'Draft' }
        ];

        let submissions = getStorageList(TIMESHEET_SUBMISSIONS_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 ts-submission-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-file-signature text-primary me-2"></i>Submit Timesheet</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-4"><input id="tsEmp" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-3"><input id="tsWeek" class="form-control" placeholder="Week (YYYY-W##)"></div>',
                '      <div class="col-md-2"><input id="tsHours" type="number" min="1" max="80" class="form-control" placeholder="Hours"></div>',
                '      <div class="col-md-2">',
                '        <select id="tsStatus" class="form-select">',
                '          <option>Draft</option>',
                '          <option>Submitted</option>',
                '        </select>',
                '      </div>',
                '      <div class="col-md-1"><button id="tsAddBtn" class="btn btn-primary w-100">Add</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-clipboard-list text-primary me-2"></i>Timesheet Submission Log</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Week</th><th>Hours</th><th>Status</th></tr></thead>',
                '      <tbody>',
                submissions.map(function (item) {
                    const badge = item.status === 'Submitted' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary';
                    return '<tr><td>' + item.id + '</td><td>' + item.employee + '</td><td>' + item.week + '</td><td>' + item.hours + '</td><td><span class="badge ' + badge + '">' + item.status + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('tsAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const employee = (document.getElementById('tsEmp').value || '').trim();
                const week = (document.getElementById('tsWeek').value || '').trim();
                const hours = Number(document.getElementById('tsHours').value || 0);
                const status = (document.getElementById('tsStatus').value || 'Draft').trim();

                if (!employee || !week || !hours) {
                    return;
                }

                const nextNumber = 300 + submissions.length + 1;
                submissions.unshift({
                    id: 'TS-' + nextNumber,
                    employee: employee,
                    week: week,
                    hours: hours,
                    status: status
                });

                setStorageList(TIMESHEET_SUBMISSIONS_KEY, submissions);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
