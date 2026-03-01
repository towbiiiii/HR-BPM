window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const EMPLOYEES_KEY = 'hospitalHrHcmEmployees';
    const POSITIONS_KEY = 'hospitalHrHcmPositions';

    function defaultEmployees() {
        return [
            { id: 'EMP-1001', name: 'Anna Santos', department: 'Human Resources', position: 'HR Specialist', status: 'Active' },
            { id: 'EMP-1002', name: 'Jude Molina', department: 'Operations', position: 'Operations Officer', status: 'Active' },
            { id: 'EMP-1003', name: 'Leah Gomez', department: 'Finance', position: 'Payroll Analyst', status: 'Probation' }
        ];
    }

    function defaultPositions() {
        return [
            { id: 'POS-301', title: 'HR Manager', department: 'Human Resources', headcount: 1, filled: 1 },
            { id: 'POS-302', title: 'Payroll Analyst', department: 'Finance', headcount: 2, filled: 1 },
            { id: 'POS-303', title: 'Clinic Coordinator', department: 'Operations', headcount: 1, filled: 0 }
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

    registry.renderOrganizationalStructure = function (container) {
        const employees = getStorageList(EMPLOYEES_KEY, defaultEmployees);
        const positions = getStorageList(POSITIONS_KEY, defaultPositions);

        const departmentMap = employees.reduce(function (acc, employee) {
            const key = employee.department || 'Unassigned';
            if (!acc[key]) {
                acc[key] = { department: key, employees: 0, active: 0 };
            }
            acc[key].employees += 1;
            if (employee.status === 'Active') {
                acc[key].active += 1;
            }
            return acc;
        }, {});

        const positionMap = positions.reduce(function (acc, position) {
            const key = position.department || 'Unassigned';
            if (!acc[key]) {
                acc[key] = { headcount: 0, filled: 0 };
            }
            acc[key].headcount += Number(position.headcount || 0);
            acc[key].filled += Number(position.filled || 0);
            return acc;
        }, {});

        const rows = Object.keys(departmentMap).sort().map(function (departmentName) {
            const employeeStats = departmentMap[departmentName];
            const positionStats = positionMap[departmentName] || { headcount: 0, filled: 0 };
            const openSlots = positionStats.headcount - positionStats.filled;

            return '<tr>'
                + '<td>' + departmentName + '</td>'
                + '<td>' + employeeStats.employees + '</td>'
                + '<td>' + employeeStats.active + '</td>'
                + '<td>' + positionStats.headcount + '</td>'
                + '<td>' + positionStats.filled + '</td>'
                + '<td>' + (openSlots > 0 ? openSlots : 0) + '</td>'
                + '</tr>';
        }).join('');

        const totalHeadcount = positions.reduce(function (sum, item) { return sum + Number(item.headcount || 0); }, 0);
        const totalFilled = positions.reduce(function (sum, item) { return sum + Number(item.filled || 0); }, 0);

        container.innerHTML = [
            '<div class="row g-3 mb-3 organizational-structure-submodule">',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Departments</p><h5 class="mb-0">' + Object.keys(departmentMap).length + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Headcount Plan</p><h5 class="mb-0">' + totalHeadcount + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Filled Positions</p><h5 class="mb-0">' + totalFilled + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-building-user text-primary me-2"></i>Organizational Structure Matrix</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>Department</th><th>Employees</th><th>Active</th><th>Headcount Plan</th><th>Filled</th><th>Open Slots</th></tr></thead>',
            '      <tbody>' + rows + '</tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');
    };
})(window.HRSubmodules);
