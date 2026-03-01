window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const POSITIONS_KEY = 'hospitalHrHcmPositions';

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

    function setStorageList(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    registry.renderPositionManagement = function (container) {
        let positions = getStorageList(POSITIONS_KEY, defaultPositions);

        function render() {
            const openCount = positions.filter(function (item) { return Number(item.filled) < Number(item.headcount); }).length;

            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 position-management-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-briefcase text-primary me-2"></i>Create Position</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-4"><input id="hcmPosTitle" class="form-control" placeholder="Position Title"></div>',
                '      <div class="col-md-3"><input id="hcmPosDepartment" class="form-control" placeholder="Department"></div>',
                '      <div class="col-md-2"><input id="hcmPosHeadcount" type="number" min="1" class="form-control" placeholder="Headcount"></div>',
                '      <div class="col-md-2"><input id="hcmPosFilled" type="number" min="0" class="form-control" placeholder="Filled"></div>',
                '      <div class="col-md-1"><button id="hcmPosAddBtn" class="btn btn-primary w-100">Add</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white d-flex justify-content-between align-items-center">',
                '    <h5 class="mb-0"><i class="fas fa-sitemap text-primary me-2"></i>Position Management</h5>',
                '    <span class="badge bg-warning-subtle text-warning">' + openCount + ' Open Positions</span>',
                '  </div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Position ID</th><th>Title</th><th>Department</th><th>Headcount</th><th>Filled</th><th>Action</th></tr></thead>',
                '      <tbody>',
                positions.map(function (item) {
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.title + '</td>'
                        + '<td>' + item.department + '</td>'
                        + '<td>' + item.headcount + '</td>'
                        + '<td>' + item.filled + '</td>'
                        + '<td><button class="btn btn-sm btn-outline-primary" data-action="fill" data-id="' + item.id + '">Add Occupant</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('hcmPosAddBtn');
            if (addButton) {
                addButton.addEventListener('click', function () {
                    const title = (document.getElementById('hcmPosTitle').value || '').trim();
                    const department = (document.getElementById('hcmPosDepartment').value || '').trim();
                    const headcount = Number(document.getElementById('hcmPosHeadcount').value || 0);
                    const filled = Number(document.getElementById('hcmPosFilled').value || 0);

                    if (!title || !department || !headcount) {
                        return;
                    }

                    const nextId = 'POS-' + (300 + positions.length + 1);
                    positions.unshift({
                        id: nextId,
                        title: title,
                        department: department,
                        headcount: headcount,
                        filled: filled > headcount ? headcount : filled
                    });

                    setStorageList(POSITIONS_KEY, positions);
                    render();
                });
            }

            container.querySelectorAll('button[data-action="fill"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = button.getAttribute('data-id');

                    positions = positions.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }

                        const nextFilled = Number(item.filled) + 1;
                        return {
                            id: item.id,
                            title: item.title,
                            department: item.department,
                            headcount: item.headcount,
                            filled: nextFilled > Number(item.headcount) ? Number(item.headcount) : nextFilled
                        };
                    });

                    setStorageList(POSITIONS_KEY, positions);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
