(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initPasswordToggles();
        initResetForm();
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

    function initResetForm() {
        const form = document.getElementById('forgotPasswordForm');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const employeeIdInput = document.getElementById('employeeId');
            const roleInput = document.getElementById('role');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            if (!employeeIdInput || !roleInput || !newPasswordInput || !confirmPasswordInput) {
                return;
            }

            const employeeId = employeeIdInput.value.trim();
            const role = roleInput.value;
            const newPassword = newPasswordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!employeeId || !role || !newPassword || !confirmPassword) {
                showNotification('Please complete all fields.', 'error');
                return;
            }

            if (newPassword.length < 6) {
                showNotification('New password must be at least 6 characters.', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('New password and confirm password do not match.', 'error');
                return;
            }

            const accounts = JSON.parse(localStorage.getItem('hospitalHrAccounts') || '[]');
            const accountIndex = accounts.findIndex(function (account) {
                const sameEmployeeId = String(account.employeeId).toLowerCase() === employeeId.toLowerCase();
                const sameRole = String(account.role) === role;
                return sameEmployeeId && sameRole;
            });

            if (accountIndex === -1) {
                showNotification('No account found for that Employee ID and role.', 'error');
                return;
            }

            accounts[accountIndex].password = newPassword;
            localStorage.setItem('hospitalHrAccounts', JSON.stringify(accounts));
            localStorage.setItem('hospitalHrPasswordResetSuccess', '1');

            window.location.href = 'login.html?reset=1';
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
