window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const EMPLOYMENT_RECORDS_KEY = 'hospitalHrHcmEmploymentRecords';

    function defaultRecords() {
        return [
            { id: 'REC-5001', employee: 'Anna Santos', recordType: 'Regularization', effectiveDate: '2026-03-05', status: 'Pending' },
            { id: 'REC-5002', employee: 'Jude Molina', recordType: 'Promotion', effectiveDate: '2026-03-08', status: 'Approved' },
            { id: 'REC-5003', employee: 'Leah Gomez', recordType: 'Transfer', effectiveDate: '2026-03-12', status: 'Pending' }
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

    registry.renderEmploymentRecords = function (container) {
        let records = getStorageList(EMPLOYMENT_RECORDS_KEY, defaultRecords);

        function render() {
            const pending = records.filter(function (item) { return item.status === 'Pending'; }).length;
            const approved = records.filter(function (item) { return item.status === 'Approved'; }).length;

            container.innerHTML = [
                '<div class="row g-3 mb-3 employment-records-submodule">',
                '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Records</p><h5 class="mb-0">' + records.length + '</h5></div></div>',
                '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Pending</p><h5 class="mb-0">' + pending + '</h5></div></div>',
                '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved</p><h5 class="mb-0">' + approved + '</h5></div></div>',
                '  <div class="col-md-3"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Action Queue</p><h5 class="mb-0">' + pending + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-folder-tree text-primary me-2"></i>Employment Records</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Record ID</th><th>Employee</th><th>Type</th><th>Effective Date</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                records.map(function (item) {
                    const badge = item.status === 'Approved'
                        ? 'bg-success-subtle text-success'
                        : item.status === 'Rejected'
                            ? 'bg-danger-subtle text-danger'
                            : 'bg-warning-subtle text-warning';

                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.recordType + '</td>'
                        + '<td>' + item.effectiveDate + '</td>'
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
                    const id = button.getAttribute('data-id');
                    const action = button.getAttribute('data-action');

                    records = records.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }

                        return {
                            id: item.id,
                            employee: item.employee,
                            recordType: item.recordType,
                            effectiveDate: item.effectiveDate,
                            status: action === 'approve' ? 'Approved' : 'Rejected'
                        };
                    });

                    setStorageList(EMPLOYMENT_RECORDS_KEY, records);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
