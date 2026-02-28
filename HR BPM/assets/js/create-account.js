(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initPasswordToggles();
        initCreateAccountForm();
    }

    function initPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');

        toggleButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                const targetId = button.getAttribute('data-target');
                const input = targetId ? document.getElementById(targetId) : null;
                if (!input) {
                    return;
                }

                const shouldShow = input.type === 'password';
                input.type = shouldShow ? 'text' : 'password';

                const icon = button.querySelector('i');
                if (!icon) {
                    return;
                }

                icon.classList.toggle('fa-eye', !shouldShow);
                icon.classList.toggle('fa-eye-slash', shouldShow);
            });
        });
    }

    function initCreateAccountForm() {
        const form = document.getElementById('createAccountForm');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const fullName = document.getElementById('fullName');
            const employeeId = document.getElementById('employeeId');
            const role = document.getElementById('role');
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirmPassword');

            if (!fullName || !employeeId || !role || !password || !confirmPassword) {
                return;
            }

            const fullNameValue = fullName.value.trim();
            const employeeIdValue = employeeId.value.trim();
            const roleValue = role.value;
            const passwordValue = password.value;
            const confirmPasswordValue = confirmPassword.value;

            if (!fullNameValue || !employeeIdValue || !roleValue || !passwordValue || !confirmPasswordValue) {
                showNotification('Please complete all fields.', 'error');
                return;
            }

            if (passwordValue.length < 6) {
                showNotification('Password must be at least 6 characters.', 'error');
                return;
            }

            if (passwordValue !== confirmPasswordValue) {
                showNotification('Password and confirm password do not match.', 'error');
                return;
            }

            const accountStorageKey = 'hospitalHrAccounts';
            const existingAccounts = JSON.parse(localStorage.getItem(accountStorageKey) || '[]');

            const duplicateEmployee = existingAccounts.some(function (account) {
                return String(account.employeeId).toLowerCase() === employeeIdValue.toLowerCase();
            });

            if (duplicateEmployee) {
                showNotification('Employee ID already exists. Please use another one.', 'error');
                return;
            }

            const accountData = {
                fullName: fullNameValue,
                employeeId: employeeIdValue,
                role: roleValue,
                password: passwordValue
            };

            existingAccounts.push(accountData);
            localStorage.setItem(accountStorageKey, JSON.stringify(existingAccounts));
            localStorage.setItem('hospitalHrSignupSuccess', '1');

            window.location.href = 'login.html?created=1';
        });
    }

    function showNotification(message, type) {
        const notificationType = type || 'info';
        let container = document.querySelector('.auth-notification-container');

        if (!container) {
            container = document.createElement('div');
            container.className = 'auth-notification-container';
            document.body.appendChild(container);
        }

        const item = document.createElement('div');
        item.className = 'auth-notification auth-notification--' + notificationType;
        item.textContent = message;
        container.appendChild(item);

        window.setTimeout(function () {
            item.remove();
            if (!container.children.length) {
                container.remove();
            }
        }, 3200);
    }
})();
