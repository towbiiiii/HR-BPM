(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const employeeId = localStorage.getItem('hospitalHrEmployeeId');

        bindLogout();
        loadProfile(employeeId);
    }

    function loadProfile(employeeId) {
        const roleLabel = 'Hospital HR';
        const fullName = employeeId ? 'ID: ' + employeeId : 'Hospital HR User';

        setText('profileName', fullName);
        setText('profileRole', roleLabel);
        setText('profileEmployeeId', employeeId);
        setText('infoFullName', fullName);
        setText('infoEmail', '-');
        setText('infoPhone', '-');
        setText('infoDepartment', roleLabel);
        setText('infoAddress', '-');

        const avatar = document.getElementById('profileAvatar');
        if (avatar) {
            avatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(fullName) + '&background=0D6EFD&color=fff&bold=true';
        }

    }

    function bindLogout() {
        const button = document.getElementById('logoutProfileBtn');
        if (!button) {
            return;
        }

        button.addEventListener('click', function () {
            localStorage.removeItem('hospitalHrEmployeeId');
            localStorage.removeItem('hospitalHrSidebarCollapsed');
            window.location.href = 'dashboard.html';
        });
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = value;
        }
    }

})();
