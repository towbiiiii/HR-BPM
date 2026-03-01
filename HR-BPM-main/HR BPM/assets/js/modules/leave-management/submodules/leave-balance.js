window.HRSubmodules = window.HRSubmodules || {};

(function (registry) {
    const LEAVE_BALANCES_KEY = 'hospitalHrLeaveBalances';

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

    registry.renderLeaveBalance = function (container) {
        const balances = getStorageList(LEAVE_BALANCES_KEY, defaultBalances);

        const totalVacation = balances.reduce(function (sum, item) { return sum + Number(item.vacation || 0); }, 0);
        const totalSick = balances.reduce(function (sum, item) { return sum + Number(item.sick || 0); }, 0);
        const totalEmergency = balances.reduce(function (sum, item) { return sum + Number(item.emergency || 0); }, 0);

        container.innerHTML = [
            '<div class="d-flex align-items-center gap-2 mb-3"><i class="fas fa-wallet text-primary"></i><h6 class="mb-0">Leave Balance</h6></div>',
            '<div class="row g-3 mb-3 leave-balance-submodule">',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Vacation Balance</p><h5 class="mb-0">' + totalVacation + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Sick Balance</p><h5 class="mb-0">' + totalSick + '</h5></div></div>',
            '  <div class="col-md-4"><div class="border rounded-3 p-3"><p class="text-muted mb-1">Total Emergency Balance</p><h5 class="mb-0">' + totalEmergency + '</h5></div></div>',
            '</div>',
            '<div class="card border-0 shadow-sm">',
            '  <div class="card-header bg-white"><h5 class="mb-0"><i class="fas fa-table-list text-primary me-2"></i>Employee Leave Balance Ledger</h5></div>',
            '  <div class="table-responsive">',
            '    <table class="table mb-0 align-middle">',
            '      <thead><tr><th>Employee</th><th>Vacation</th><th>Sick</th><th>Emergency</th></tr></thead>',
            '      <tbody>',
            balances.map(function (item) {
                return '<tr><td>' + item.employee + '</td><td>' + item.vacation + '</td><td>' + item.sick + '</td><td>' + item.emergency + '</td></tr>';
            }).join(''),
            '      </tbody>',
            '    </table>',
            '  </div>',
            '</div>'
        ].join('');
    };
})(window.HRSubmodules);
