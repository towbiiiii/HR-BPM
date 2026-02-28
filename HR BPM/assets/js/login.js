(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initPasswordToggle();
        initSignupSuccessNotice();
        initPasswordResetSuccessNotice();
        initLoginForm();
    }

    function initSignupSuccessNotice() {
        const query = new URLSearchParams(window.location.search);
        const fromQuery = query.get('created') === '1';
        const fromStorage = localStorage.getItem('hospitalHrSignupSuccess') === '1';

        if (!fromQuery && !fromStorage) {
            return;
        }

        localStorage.removeItem('hospitalHrSignupSuccess');
        showNotification('Account created successfully. You can now sign in.', 'success');
    }

    function initPasswordResetSuccessNotice() {
        const query = new URLSearchParams(window.location.search);
        const fromQuery = query.get('reset') === '1';
        const fromStorage = localStorage.getItem('hospitalHrPasswordResetSuccess') === '1';

        if (!fromQuery && !fromStorage) {
            return;
        }

        localStorage.removeItem('hospitalHrPasswordResetSuccess');
        showNotification('Password reset successful. Please sign in with your new password.', 'success');
    }

    function initPasswordToggle() {
        const toggleButton = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        if (!toggleButton || !passwordInput) {
            return;
        }

        toggleButton.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';

            const icon = toggleButton.querySelector('i');
            if (!icon) {
                return;
            }

            icon.classList.toggle('fa-eye', !isPassword);
            icon.classList.toggle('fa-eye-slash', isPassword);
        });
    }

    function initLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) {
            return;
        }

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const employeeId = document.getElementById('employeeId');
            const password = document.getElementById('password');
            const role = document.getElementById('role');

            if (!employeeId || !password || !role) {
                return;
            }

            if (!employeeId.value.trim() || !password.value.trim() || !role.value) {
                showNotification('Please complete all login fields.', 'error');
                return;
            }

            const employeeIdValue = employeeId.value.trim();
            const passwordValue = password.value.trim();
            const roleValue = role.value;
            const accounts = JSON.parse(localStorage.getItem('hospitalHrAccounts') || '[]');

            if (accounts.length > 0) {
                const matchedAccount = accounts.find(function (account) {
                    const sameEmployeeId = String(account.employeeId).toLowerCase() === employeeIdValue.toLowerCase();
                    const samePassword = String(account.password) === passwordValue;
                    const sameRole = String(account.role) === roleValue;
                    return sameEmployeeId && samePassword && sameRole;
                });

                if (!matchedAccount) {
                    showNotification('Invalid credentials or role. Please try again.', 'error');
                    return;
                }
            }

            localStorage.setItem('hospitalHrSelectedRole', roleValue);
            localStorage.setItem('hospitalHrEmployeeId', employeeIdValue);
            window.location.href = 'dashboard.html?role=' + encodeURIComponent(roleValue);
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
