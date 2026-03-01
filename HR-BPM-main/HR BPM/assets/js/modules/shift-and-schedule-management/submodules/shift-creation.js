window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const SHIFT_DEFINITIONS_KEY = 'hospitalHrShiftDefinitions';

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

    registry.renderShiftCreation = function (container) {
        const fallback = [
            { code: 'AM-8', name: 'Morning Shift', start: '08:00', end: '17:00', type: 'Regular' },
            { code: 'PM-8', name: 'Evening Shift', start: '14:00', end: '23:00', type: 'Regular' },
            { code: 'NS-10', name: 'Night Shift', start: '21:00', end: '07:00', type: 'Critical' }
        ];

        let shifts = getStorageList(SHIFT_DEFINITIONS_KEY, fallback);

        function render() {
            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 shift-create-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-calendar-plus text-primary me-2"></i>Create Shift Template</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-2"><input id="shiftCode" class="form-control" placeholder="Code"></div>',
                '      <div class="col-md-3"><input id="shiftName" class="form-control" placeholder="Shift Name"></div>',
                '      <div class="col-md-2"><input id="shiftStart" type="time" class="form-control"></div>',
                '      <div class="col-md-2"><input id="shiftEnd" type="time" class="form-control"></div>',
                '      <div class="col-md-2">',
                '        <select id="shiftType" class="form-select">',
                '          <option>Regular</option>',
                '          <option>Critical</option>',
                '          <option>On-call</option>',
                '        </select>',
                '      </div>',
                '      <div class="col-md-1"><button id="addShiftBtn" class="btn btn-primary w-100">Add</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-layer-group text-primary me-2"></i>Shift Templates</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>Code</th><th>Name</th><th>Start</th><th>End</th><th>Type</th></tr></thead>',
                '      <tbody>',
                shifts.map(function (item) {
                    const badge = item.type === 'Critical' ? 'bg-danger-subtle text-danger' : item.type === 'On-call' ? 'bg-info-subtle text-info' : 'bg-success-subtle text-success';
                    return '<tr><td>' + item.code + '</td><td>' + item.name + '</td><td>' + item.start + '</td><td>' + item.end + '</td><td><span class="badge ' + badge + '">' + item.type + '</span></td></tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const addButton = document.getElementById('addShiftBtn');
            if (!addButton) {
                return;
            }

            addButton.addEventListener('click', function () {
                const code = (document.getElementById('shiftCode').value || '').trim().toUpperCase();
                const name = (document.getElementById('shiftName').value || '').trim();
                const start = (document.getElementById('shiftStart').value || '').trim();
                const end = (document.getElementById('shiftEnd').value || '').trim();
                const type = (document.getElementById('shiftType').value || 'Regular').trim();

                if (!code || !name || !start || !end) {
                    return;
                }

                shifts.unshift({ code: code, name: name, start: start, end: end, type: type });
                setStorageList(SHIFT_DEFINITIONS_KEY, shifts);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
