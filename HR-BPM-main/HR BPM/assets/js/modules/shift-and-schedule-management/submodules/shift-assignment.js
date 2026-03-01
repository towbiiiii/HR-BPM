window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const SHIFT_ASSIGNMENT_KEY = 'hospitalHrShiftAssignmentQueue';

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

    registry.renderShiftAssignment = function (container) {
        const fallback = [
            { ticket: 'ASG-201', employee: 'Mark Rivera', request: 'Swap PM-8 to AM-8 (Tue)', status: 'Pending' },
            { ticket: 'ASG-202', employee: 'Leah Gomez', request: 'Assign NS-10 (Weekend)', status: 'Pending' },
            { ticket: 'ASG-203', employee: 'Paolo Cruz', request: 'Move to PM-8 (Fri)', status: 'Approved' }
        ];

        let queue = getStorageList(SHIFT_ASSIGNMENT_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white d-flex justify-content-between align-items-center">',
                '    <h5 class="mb-0"><i class="fas fa-people-arrows-left-right text-primary me-2"></i>Shift Assignment Queue</h5>',
                '    <span class="badge bg-warning-subtle text-warning">' + queue.filter(function (item) { return item.status === 'Pending'; }).length + ' Pending</span>',
                '  </div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle shift-assign-submodule">',
                '      <thead><tr><th>Ticket</th><th>Employee</th><th>Request</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                queue.map(function (item) {
                    const badge = item.status === 'Approved' ? 'bg-success-subtle text-success' : item.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning';
                    return '<tr>'
                        + '<td>' + item.ticket + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.request + '</td>'
                        + '<td><span class="badge ' + badge + '">' + item.status + '</span></td>'
                        + '<td>'
                        + '<button class="btn btn-sm btn-outline-success me-1" data-action="approve" data-id="' + item.ticket + '">Approve</button>'
                        + '<button class="btn btn-sm btn-outline-danger" data-action="reject" data-id="' + item.ticket + '">Reject</button>'
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
                    const ticket = button.getAttribute('data-id');

                    queue = queue.map(function (item) {
                        if (item.ticket !== ticket) {
                            return item;
                        }
                        return {
                            ticket: item.ticket,
                            employee: item.employee,
                            request: item.request,
                            status: action === 'approve' ? 'Approved' : 'Rejected'
                        };
                    });

                    setStorageList(SHIFT_ASSIGNMENT_KEY, queue);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
