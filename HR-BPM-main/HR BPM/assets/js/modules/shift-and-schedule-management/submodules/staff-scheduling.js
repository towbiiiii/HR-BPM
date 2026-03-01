window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const STAFF_SCHEDULE_KEY = 'hospitalHrStaffSchedule';

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

    registry.renderStaffScheduling = function (container) {
        const fallback = [
            { employee: 'Anna Santos', unit: 'HR Ops', day: 'Monday', shift: 'AM-8' },
            { employee: 'Jude Molina', unit: 'Operations', day: 'Monday', shift: 'PM-8' },
            { employee: 'Liza De Leon', unit: 'Nursing', day: 'Monday', shift: 'NS-10' }
        ];

        let schedules = getStorageList(STAFF_SCHEDULE_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 staff-sched-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-user-clock text-primary me-2"></i>Assign Staff Schedule</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="schedEmployee" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-3"><input id="schedUnit" class="form-control" placeholder="Unit"></div>',
                '      <div class="col-md-2">',
                '        <select id="schedDay" class="form-select">',
                '          <option>Monday</option><option>Tuesday</option><option>Wednesday</option><option>Thursday</option><option>Friday</option><option>Saturday</option><option>Sunday</option>',
                '        </select>',
                '      </div>',
                '      <div class="col-md-2"><input id="schedShift" class="form-control" placeholder="Shift Code"></div>',
                '      <div class="col-md-2"><button id="schedAddBtn" class="btn btn-primary w-100">Assign</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-calendar-week text-primary me-2"></i>Weekly Schedule</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Employee</th><th>Unit</th><th>Day</th><th>Shift</th></tr></thead>',
                '      <tbody>',
                schedules.map(function (item) {
                    return '<tr><td>' + item.employee + '</td><td>' + item.unit + '</td><td>' + item.day + '</td><td><span class="badge bg-primary-subtle text-primary">' + item.shift + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('schedAddBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const employee = (document.getElementById('schedEmployee').value || '').trim();
                const unit = (document.getElementById('schedUnit').value || '').trim();
                const day = (document.getElementById('schedDay').value || '').trim();
                const shift = (document.getElementById('schedShift').value || '').trim().toUpperCase();

                if (!employee || !unit || !day || !shift) {
                    return;
                }

                schedules.unshift({ employee: employee, unit: unit, day: day, shift: shift });
                setStorageList(STAFF_SCHEDULE_KEY, schedules);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
