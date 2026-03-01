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

    registry.renderBenefitsClaims = function (container) {
        let records = getStorageList(BENEFITS_KEY, defaultBenefits);

        function render() {
            const pendingClaims = records.filter(function (item) { return item.claimStatus === 'Pending'; }).length;
            const approvedClaims = records.filter(function (item) { return item.claimStatus === 'Approved'; }).length;

            container.innerHTML = [
                '<div class="card border-0 shadow-sm mb-3 benefits-claims-submodule">',
                '  <div class="card-body">',
                '    <h6 class="mb-3"><i class="fas fa-file-medical text-primary me-2"></i>Submit Benefits Claim</h6>',
                '    <div class="row g-2">',
                '      <div class="col-md-4"><select id="benefitsClaimEmployee" class="form-select">',
                records.map(function (item) {
                    return '<option value="' + item.id + '">' + item.employee + ' (' + item.id + ')</option>';
                }).join(''),
                '      </select></div>',
                '      <div class="col-md-4"><input id="benefitsClaimAmount" type="number" min="1" class="form-control" placeholder="Claim Amount"></div>',
                '      <div class="col-md-4"><button id="benefitsClaimSubmit" class="btn btn-primary w-100">Submit Claim</button></div>',
                '    </div>',
                '  </div>',
                '</div>',
                '<div class="row g-3 mb-3">',
                '  <div class="col-md-6"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Pending Claims</p><h5 class="mb-0">' + pendingClaims + '</h5></div></div>',
                '  <div class="col-md-6"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Approved Claims</p><h5 class="mb-0">' + approvedClaims + '</h5></div></div>',
                '</div>',
                '<div class="card border-0 shadow-sm">',
                '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-receipt text-primary me-2"></i>Benefits Claims Queue</h5></div>',
                '  <div class="table-responsive">',
                '    <table class="table mb-0 align-middle">',
                '      <thead><tr><th>ID</th><th>Employee</th><th>Plan</th><th>Claim Amount</th><th>Status</th><th>Action</th></tr></thead>',
                '      <tbody>',
                records.map(function (item) {
                    const badge = item.claimStatus === 'Approved'
                        ? 'bg-success-subtle text-success'
                        : item.claimStatus === 'Pending'
                            ? 'bg-warning-subtle text-warning'
                            : 'bg-secondary-subtle text-secondary';
                    const disabled = item.claimStatus !== 'Pending' ? ' disabled' : '';

                    return '<tr>'
                        + '<td>' + item.id + '</td>'
                        + '<td>' + item.employee + '</td>'
                        + '<td>' + item.hmoPlan + '</td>'
                        + '<td>₱' + Number(item.claimAmount || 0).toLocaleString() + '</td>'
                        + '<td><span class="badge ' + badge + '">' + item.claimStatus + '</span></td>'
                        + '<td><button class="btn btn-sm btn-outline-success" data-action="approve" data-id="' + item.id + '"' + disabled + '>Approve</button></td>'
                        + '</tr>';
                }).join(''),
                '      </tbody>',
                '    </table>',
                '  </div>',
                '</div>'
            ].join('');

            const submitButton = document.getElementById('benefitsClaimSubmit');
            if (submitButton) {
                submitButton.addEventListener('click', function () {
                    const selectedId = document.getElementById('benefitsClaimEmployee').value;
                    const amount = Number(document.getElementById('benefitsClaimAmount').value || 0);
                    if (!selectedId || !amount) {
                        return;
                    }

                    records = records.map(function (item) {
                        if (item.id !== selectedId) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            hmoPlan: item.hmoPlan,
                            benefitsType: item.benefitsType,
                            coverage: item.coverage,
                            claimAmount: amount,
                            claimStatus: 'Pending',
                            enrolled: item.enrolled
                        };
                    });

                    setStorageList(BENEFITS_KEY, records);
                    render();
                });
            }

            container.querySelectorAll('button[data-action="approve"]').forEach(function (button) {
                button.addEventListener('click', function () {
                    const id = button.getAttribute('data-id');
                    records = records.map(function (item) {
                        if (item.id !== id) {
                            return item;
                        }
                        return {
                            id: item.id,
                            employee: item.employee,
                            hmoPlan: item.hmoPlan,
                            benefitsType: item.benefitsType,
                            coverage: item.coverage,
                            claimAmount: item.claimAmount,
                            claimStatus: 'Approved',
                            enrolled: item.enrolled
                        };
                    });
                    setStorageList(BENEFITS_KEY, records);
                    render();
                });
            });
        }

        render();
    };
})(window.HRSubmodules);
