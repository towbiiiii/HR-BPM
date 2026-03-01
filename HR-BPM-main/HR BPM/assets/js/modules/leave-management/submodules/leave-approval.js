window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const LEAVE_REQUESTS_KEY = 'hospitalHrLeaveRequests';
    const LEAVE_BALANCES_KEY = 'hospitalHrLeaveBalances';

    function defaultRequests() {
        return [
            { id: 'LV-701', employee: 'Anna Santos', type: 'Vacation', from: '2026-03-10', to: '2026-03-12', days: 3, reason: 'Family trip', status: 'Approved' },
            { id: 'LV-702', employee: 'Jude Molina', type: 'Sick', from: '2026-03-04', to: '2026-03-05', days: 2, reason: 'Flu recovery', status: 'Pending' },
            { id: 'LV-703', employee: 'Leah Gomez', type: 'Emergency', from: '2026-03-02', to: '2026-03-02', days: 1, reason: 'Family emergency', status: 'Pending' }
        ];
    }

    function defaultBalances() {
        return [
            { employee: 'Anna Santos', vacation: 9, sick: 8, emergency: 3 },
            { employee: 'Jude Molina', vacation: 10, sick: 6, emergency: 3 },
            { employee: 'Leah Gomez', vacation: 7, sick: 5, emergency: 2 }
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

    function applyBalanceDeduction(balances, request) {
        const updated = balances.map(function (item) {
            if (item.employee !== request.employee) {
                return item;
            }

            const next = {
                employee: item.employee,
                vacation: Number(item.vacation || 0),
                sick: Number(item.sick || 0),
                emergency: Number(item.emergency || 0)
            };

            if (request.type === 'Vacation') {
                next.vacation = Math.max(0, next.vacation - request.days);
            }
            if (request.type === 'Sick') {
                next.sick = Math.max(0, next.sick - request.days);
            }
            if (request.type === 'Emergency') {
                next.emergency = Math.max(0, next.emergency - request.days);
            }

            return next;
        });

        const exists = updated.some(function (item) { return item.employee === request.employee; });
        if (exists) {
            return updated;
        }

        return updated.concat([{
            employee: request.employee,
            vacation: request.type === 'Vacation' ? Math.max(0, 12 - request.days) : 12,
            sick: request.type === 'Sick' ? Math.max(0, 10 - request.days) : 10,
            emergency: request.type === 'Emergency' ? Math.max(0, 3 - request.days) : 3
        }]);
    }

    registry.renderLeaveApproval = function (container) {
        let requests = getStorageList(LEAVE_REQUESTS_KEY, defaultRequests);
        let balances = getStorageList(LEAVE_BALANCES_KEY, defaultBalances);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white d-flex justify-content-between align-items-center">',
                '    <h5 class="mb-0"><i class="fas fa-check-double text-primary me-2"></i>Leave Approval Queue</h5>',
                '    <span class="badge bg-warning-subtle text-warning">' + requests.filter(function (item) { return item.status === 'Pending'; }).length + ' Pending</span>',
                '  </div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle leave-approval-submodule">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Type</th><th>Days</th><th>Reason</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                requests.map(function (item) {
                    const badge = item.status === 'Approved' ? 'bg-success-subtle text-success' : item.status === 'Rejected' ? 'bg-danger-subtle text-danger' : 'bg-warning-subtle text-warning';
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.type + '</td>'
                        + '<td>' + item.days + '</td>'
                        + '<td>' + item.reason + '</td>'
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
                    const target = requests.find(function (item) { return item.id === id; });

                    requests = requests.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            type: item.type,
                            from: item.from,
                            to: item.to,
                            days: item.days,
                            reason: item.reason,
                            status: action === 'approve' ? 'Approved' : 'Rejected'
                        };
                    });

                    if (action === 'approve' && target) {
                        balances = applyBalanceDeduction(balances, target);
                        setStorageList(LEAVE_BALANCES_KEY, balances);
                    }

                    setStorageList(LEAVE_REQUESTS_KEY, requests);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
