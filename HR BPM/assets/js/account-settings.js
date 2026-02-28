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

        bindLogout();
        bindPasswordVisibilityToggles();
        loadAccountData(selectedRole, employeeId);
        bindProfileSettingsEvents(selectedRole, employeeId);
        bindAccountSettingsEvents(selectedRole, employeeId);
    }

    function loadAccountData(selectedRole, employeeId) {
        const accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
        const profileExtras = JSON.parse(localStorage.getItem(PROFILE_EXTRA_KEY) || '{}');
        const profileKey = getProfileKey(employeeId, selectedRole);
        const extras = profileExtras[profileKey] || {};
        const account = accounts.find(function (item) {
            return String(item.employeeId).toLowerCase() === String(employeeId).toLowerCase() && String(item.role) === String(selectedRole);
        });

        const fullName = extras.fullName || (account && account.fullName ? account.fullName : '');

        setInputValue('settingsEmployeeId', employeeId);
        setInputValue('settingsRole', getRoleLabel(selectedRole));
        setInputValue('fullName', fullName);
        setInputValue('email', extras.email || '');
        setInputValue('phone', extras.phone || '');
        setInputValue('department', extras.department || selectedRole);
        setInputValue('address', extras.address || '');
    }

    function bindProfileSettingsEvents(selectedRole, employeeId) {
        const form = document.getElementById('profileSettingsForm');
        const resetButton = document.getElementById('resetProfileSettingsBtn');

        if (resetButton) {
            resetButton.addEventListener('click', function () {
                loadAccountData(selectedRole, employeeId);
                showNotice('Profile settings reset.', 'success');
            });
        }

        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const fullName = getInputValue('fullName');
            if (!fullName) {
                showNotice('Full Name is required.', 'error');
                return;
            }

            const accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
            const accountIndex = accounts.findIndex(function (item) {
                return String(item.employeeId).toLowerCase() === String(employeeId).toLowerCase() && String(item.role) === String(selectedRole);
            });

            if (accountIndex !== -1) {
                accounts[accountIndex].fullName = fullName;
                localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));
            }

            const profileExtras = JSON.parse(localStorage.getItem(PROFILE_EXTRA_KEY) || '{}');
            const profileKey = getProfileKey(employeeId, selectedRole);
            profileExtras[profileKey] = {
                fullName: fullName,
                email: getInputValue('email'),
                phone: getInputValue('phone'),
                department: getInputValue('department'),
                address: getInputValue('address')
            };
            localStorage.setItem(PROFILE_EXTRA_KEY, JSON.stringify(profileExtras));

            showNotice('Profile settings updated successfully.', 'success');
            loadAccountData(selectedRole, employeeId);
        });
    }

    function bindAccountSettingsEvents(selectedRole, employeeId) {
        const form = document.getElementById('accountSettingsForm');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const currentPassword = getInputValue('currentPassword');
            const newPassword = getInputValue('newPassword');
            const confirmNewPassword = getInputValue('confirmNewPassword');

            if (!currentPassword || !newPassword || !confirmNewPassword) {
                showNotice('Please complete all password fields.', 'error');
                return;
            }

            if (newPassword.length < 6) {
                showNotice('New password must be at least 6 characters.', 'error');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                showNotice('New password and confirmation do not match.', 'error');
                return;
            }

            const accounts = JSON.parse(localStorage.getItem(ACCOUNT_KEY) || '[]');
            const accountIndex = accounts.findIndex(function (item) {
                return String(item.employeeId).toLowerCase() === String(employeeId).toLowerCase() && String(item.role) === String(selectedRole);
            });

            if (accountIndex === -1) {
                showNotice('No account record found for this user.', 'error');
                return;
            }

            if (String(accounts[accountIndex].password) !== currentPassword) {
                showNotice('Current password is incorrect.', 'error');
                return;
            }

            accounts[accountIndex].password = newPassword;
            localStorage.setItem(ACCOUNT_KEY, JSON.stringify(accounts));

            setInputValue('currentPassword', '');
            setInputValue('newPassword', '');
            setInputValue('confirmNewPassword', '');

            showNotice('Account password updated successfully.', 'success');
        });
    }

    function bindPasswordVisibilityToggles() {
        const toggles = document.querySelectorAll('.toggle-password-field');

        toggles.forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                const targetId = toggle.getAttribute('data-target');
                const input = targetId ? document.getElementById(targetId) : null;
                if (!input) {
                    return;
                }

                const showPassword = input.type === 'password';
                input.type = showPassword ? 'text' : 'password';

                const icon = toggle.querySelector('i');
                if (!icon) {
                    return;
                }

                icon.classList.toggle('fa-eye', !showPassword);
                icon.classList.toggle('fa-eye-slash', showPassword);
            });
        });
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

    function setInputValue(id, value) {
        const el = document.getElementById(id);
        if (el) {
            el.value = value;
        }
    }

    function getInputValue(id) {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function showNotice(message, type) {
        const notice = document.getElementById('profileNotice');
        if (!notice) {
            return;
        }

        notice.textContent = message;
        notice.className = 'profile-notice show ' + (type || 'success');

        window.setTimeout(function () {
            notice.classList.remove('show');
        }, 3000);
    }
})();
