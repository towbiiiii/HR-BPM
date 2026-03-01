window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const TIMESHEET_APPROVAL_KEY = 'hospitalHrTimesheetApprovalQueue';

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

    registry.renderTimesheetApproval = function (container) {
        const fallback = [
            { id: 'APP-401', employee: 'Jude Molina', week: '2026-W09', hours: 41, status: 'Pending' },
            { id: 'APP-402', employee: 'Leah Gomez', week: '2026-W09', hours: 39, status: 'Pending' },
            { id: 'APP-403', employee: 'Anna Santos', week: '2026-W09', hours: 40, status: 'Approved' }
        ];

        let queue = getStorageList(TIMESHEET_APPROVAL_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white d-flex justify-content-between align-items-center">',
                '    <h5 class="mb-0"><i class="fas fa-thumbs-up text-primary me-2"></i>Timesheet Approval Queue</h5>',
                '    <span class="badge bg-warning-subtle text-warning">' + queue.filter(function (item) { return item.status === 'Pending'; }).length + ' Pending</span>',
                '  </div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle ts-approval-submodule">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Week</th><th>Hours</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                queue.map(function (item) {
                    const badge = item.status === 'Approved' ? 'bg-success-subtle text-success' : item.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning';
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.week + '</td>'
                        + '<td>' + item.hours + '</td>'
                        + '<td><span class="badge ' + badge + '">' + item.status + '</span></td>'
                        + '<td>'
                        + '<button class="btn btn-sm btn-outline-success me-1" data-action="approve" data-id="' + item.id + '">Approve</button>'
                        + '<button class="btn btn-sm btn-outline-danger" data-action="reject" data-id="' + item.id + '">Reject</button>'
                        + '</td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            container.querySelectorAll('button[data-action]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const action = button.getAttribute('data-action');
                    const id = button.getAttribute('data-id');
                    queue = queue.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            week: item.week,
                            hours: item.hours,
                            status: action === 'approve' ? 'Approved' : 'Rejected'
                        };
                    });
                    setStorageList(TIMESHEET_APPROVAL_KEY, queue);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
