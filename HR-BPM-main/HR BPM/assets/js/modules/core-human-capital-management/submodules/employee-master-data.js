window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const EMPLOYEES_KEY = 'hospitalHrHcmEmployees';

    function defaultEmployees() {
        return [
            { id: 'EMP-1001', name: 'Anna Santos', department: 'Human Resources', position: 'HR Specialist', status: 'Active' },
            { id: 'EMP-1002', name: 'Jude Molina', department: 'Operations', position: 'Operations Officer', status: 'Active' },
            { id: 'EMP-1003', name: 'Leah Gomez', department: 'Finance', position: 'Payroll Analyst', status: 'Probation' }
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

    registry.renderEmployeeMasterData = function (container) {
        let employees = getStorageList(EMPLOYEES_KEY, defaultEmployees);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 employee-master-data-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-id-badge text-primary me-2"></i>Create Employee Master Record</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="hcmEmpName" class="form-control" placeholder="Full Name"></div>',
                '      <div class="col-md-3"><input id="hcmEmpDepartment" class="form-control" placeholder="Department"></div>',
                '      <div class="col-md-3"><input id="hcmEmpPosition" class="form-control" placeholder="Position"></div>',
                '      <div class="col-md-2">',
                '        <select id="hcmEmpStatus" class="form-select">',
                '          <option>Active</option><option>Probation</option><option>Inactive</option>',
                '        </select>',
                '      </div>',
                '      <div class="col-md-1"><button id="hcmEmpAddBtn" class="btn btn-primary w-100">Add</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-database text-primary me-2"></i>Employee Master Data</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Employee ID</th><th>Name</th><th>Department</th><th>Position</th><th>Status</th></tr></thead>',
                '      <tbody>',
                employees.map(function (item) {
                    const badge = item.status === 'Active'
                        ? 'bg-success-subtle text-success'
                        : item.status === 'Probation'
                            ? 'bg-warning-subtle text-warning'
                            : 'bg-secondary-subtle text-secondary';
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.name + '</td>'
                        + '<td>' + item.department + '</td>'
                        + '<td>' + item.position + '</td>'
                        + '<td><span class="badge ' + badge + '">' + item.status + '</span></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('hcmEmpAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const name = (document.getElementById('hcmEmpName').value || '').trim();
                const department = (document.getElementById('hcmEmpDepartment').value || '').trim();
                const position = (document.getElementById('hcmEmpPosition').value || '').trim();
                const status = (document.getElementById('hcmEmpStatus').value || 'Active').trim();

                if (!name || !department || !position) {
                    return;
                }

                const nextId = 'EMP-' + (1000 + employees.length + 1);
                employees.unshift({
                    id: nextId,
                    name: name,
                    department: department,
                    position: position,
                    status: status
                });

                setStorageList(EMPLOYEES_KEY, employees);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
