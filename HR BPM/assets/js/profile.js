(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    const ACCOUNT_KEY = 'hospitalHrAccounts';
    const PROFILE_EXTRA_KEY = 'hospitalHrProfileExtras';

    function init() {
        const selectedRole = localStorage.getItem('hospitalHrSelectedRole');
        const employeeId = localStorage.getItem('hospitalHrEmployeeId');

        if (!selectedRole || !employeeId) {
            window.location.href = 'login.html';
            return;
        }

        localStorage.setItem('hospitalHrLastLogin', new Date().toISOString());

        bindLogout();
        loadProfile(selectedRole, employeeId);
    }

    function loadProfile(selectedRole, employeeId) {
        const roleLabel = getRoleLabel(selectedRole);
        const accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
        const extrasByEmployee = JSON.parse(localStorage.getItem(PROFILE_EXTRA_KEY) || '{}');
        const profileKey = getProfileKey(employeeId, selectedRole);
        const account = accounts.find(function (item) {
            return String(item.employeeId).toLowerCase() === String(employeeId).toLowerCase() && String(item.role) === String(selectedRole);
        });

        const extras = extrasByEmployee[profileKey] || {};
        const fullName = extras.fullName || (account && account.fullName ? account.fullName : 'Hospital HR User');

        setText('profileName', fullName);
        setText('profileRole', roleLabel);
        setText('profileEmployeeId', employeeId);
        setText('infoFullName', fullName);
        setText('infoEmail', extras.email || '-');
        setText('infoPhone', extras.phone || '-');
        setText('infoDepartment', getRoleLabel(extras.department || selectedRole));
        setText('infoAddress', extras.address || '-');

        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName) + '&background=0D6EFD&color=fff&bold=true';
        }

        const lastLogin = localStorage.getItem('hospitalHrLastLogin');
        if (lastLogin) {
            setText('lastLoginText', new Date(lastLogin).toLocaleString());
        }

    }

    function bindLogout() {
        const button = document.getElementById('logoutProfileBtn');
        if (!button) {
            return;
        }

        button.addEventListener('click', function () {
            localStorage.removeItem('hospitalHrSelectedRole');
            localStorage.removeItem('hospitalHrEmployeeId');
            localStorage.removeItem('hospitalHrSidebarCollapsed');
            window.location.href = 'login.html';
        });
    }

    function getRoleLabel(roleValue) {
        const map = {
            hr1: 'HR1 - Talent Acquisition',
            hr2: 'HR2 - Talent Development',
            hr3: 'HR3 - Workforce Operations',
            hr4: 'HR4 - Compensation & Analytics'
        };

        return map[roleValue] || 'Hospital HR';
    }

    function getProfileKey(employeeId, role) {
        return String(employeeId).toLowerCase() + '::' + String(role).toLowerCase();
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

})();
