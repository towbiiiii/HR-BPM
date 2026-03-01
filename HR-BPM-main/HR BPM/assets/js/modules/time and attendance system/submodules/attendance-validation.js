window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const VALIDATION_QUEUE_KEY = 'hospitalHrAttendanceValidationQueue';

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

    registry.renderAttendanceValidation = function (container) {
        const fallback = [
            { id: 'VAL-1001', employee: 'Paolo Cruz', issue: 'Missing Time In', status: 'Pending' },
            { id: 'VAL-1002', employee: 'Rina Torres', issue: 'Late Log Entry', status: 'Pending' },
            { id: 'VAL-1003', employee: 'John Lim', issue: 'Early Out Dispute', status: 'For Review' }
        ];
        let queue = getStorageList(VALIDATION_QUEUE_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm att-val-submodule">',
                '  <div class="card-header bg-white d-flex justify-content-between align-items-center">',
                '    <h5 class="mb-0"><i class="fas fa-clipboard-check text-primary me-2"></i>Pending Validation Queue</h5>',
                '    <span class="badge bg-warning-subtle text-warning">' + queue.filter(function (item) { return item.status === 'Pending' || item.status === 'For Review'; }).length + ' Open</span>',
                '  </div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Issue</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                queue.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.issue + '</td>'
                        + '<td><span class="badge ' + (item.status === 'Approved' ? 'bg-success-subtle text-success' : item.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning') + '">' + item.status + '</span></td>'
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
                            issue: item.issue,
                            status: action === 'approve' ? 'Approved' : 'Rejected'
                        };
                    });
                    setStorageList(VALIDATION_QUEUE_KEY, queue);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
