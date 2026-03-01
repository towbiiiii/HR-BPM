window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const BENEFITS_KEY = 'hospitalHrBenefitsRecords';

    function defaultBenefits() {
        return [
            { id: 'BEN-6001', employee: 'Anna Santos', hmoPlan: 'Premium Plus', benefitsType: 'Medical', coverage: 250000, claimAmount: 0, claimStatus: 'None', enrolled: true },
            { id: 'BEN-6002', employee: 'Jude Molina', hmoPlan: 'Standard Care', benefitsType: 'Medical', coverage: 180000, claimAmount: 12000, claimStatus: 'Approved', enrolled: true },
            { id: 'BEN-6003', employee: 'Leah Gomez', hmoPlan: 'Basic Care', benefitsType: 'Medical', coverage: 120000, claimAmount: 8000, claimStatus: 'Pending', enrolled: true }
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

    registry.renderHmoEnrollment = function (container) {
        let records = getStorageList(BENEFITS_KEY, defaultBenefits);

        function render() {
            const enrolledCount = records.filter(function (item) { return item.enrolled === true; }).length;

            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 hmo-enrollment-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-notes-medical text-primary me-2"></i>HMO Enrollment</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-3"><input id="hmoEmp" class="form-control" placeholder="Employee"></div>',
                '      <div class="col-md-3"><input id="hmoPlan" class="form-control" placeholder="Plan"></div>',
                '      <div class="col-md-3"><input id="hmoCoverage" type="number" min="1" class="form-control" placeholder="Coverage"></div>',
                '      <div class="col-md-3"><button id="hmoEnrollBtn" class="btn btn-primary w-100">Enroll</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="row g-3 mb-3">',
                '  <div class="col-md-6"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Profiles</p><h5 class="mb-0">' + records.length + '</h5></div></div>',
                '  <div class="col-md-6"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Active Enrollments</p><h5 class="mb-0">' + enrolledCount + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-hospital-user text-primary me-2"></i>Enrollment Registry</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Plan</th><th>Coverage</th><th>Status</th></tr></thead>',
                '      <tbody>',
                records.map(function (item) {
                    const badge = item.enrolled === true ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary';
                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.hmoPlan + '</td>'
                        + '<td>₱' + Number(item.coverage).toLocaleString() + '</td>'
                        + '<td><span class="badge ' + badge + '">' + (item.enrolled ? 'Enrolled' : 'Inactive') + '</span></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const enrollButton = document.getElementById('hmoEnrollBtn');
            if (!enrollButton) {
                return;
            }

            enrollButton.addEventListener('click', function () {
                const employee = (document.getElementById('hmoEmp').value || '').trim();
                const hmoPlan = (document.getElementById('hmoPlan').value || '').trim();
                const coverage = Number(document.getElementById('hmoCoverage').value || 0);

                if (!employee || !hmoPlan || !coverage) {
                    return;
                }

                const nextId = 'BEN-' + (6000 + records.length + 1);
                records.unshift({
                    id: nextId,
                    employee: employee,
                    hmoPlan: hmoPlan,
                    benefitsType: 'Medical',
                    coverage: coverage,
                    claimAmount: 0,
                    claimStatus: 'None',
                    enrolled: true
                });

                setStorageList(BENEFITS_KEY, records);
                render();
            });
        }

        render();
    };
})(window.HRSubmodules);
