(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initRoleDashboard();
        initRealtimeProfileSync();
        initSidebar();
        initSidebarNavigation();
        initSearch();
        initActionButtons();
        initLogout();
    }

    function initRealtimeProfileSync() {
        window.addEventListener('storage', function (event) {
            if (!event || !event.key) {
                return;
            }

            if (event.key === 'hospitalHrAccounts' || event.key === 'hospitalHrEmployeeId' || event.key === 'hospitalHrSelectedRole') {
                initRoleDashboard();
            }
        });

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                initRoleDashboard();
            }
        });
    }

    function initRoleDashboard() {
        const roleConfigs = {
            hr1: {
                roleName: 'HR1 - Talent Acquisition',
                subtitle: 'Recruitment-focused dashboard for sourcing, screening, and interview coordination.',
                sidebarModules: [
                    { label: 'Dashboard', target: '#dashboard', icon: 'fa-gauge' },
                    {
                        label: 'Applicant Management',
                        target: '#employees',
                        icon: 'fa-users',
                        submodules: [
                            { label: 'Applicant List' },
                            { label: 'Application Tracking' },
                            { label: 'Interview Scheduling' },
                            { label: 'Applicant Status Monitoring' }
                        ]
                    },
                    {
                        label: 'Recruitment Management',
                        target: '#recruitment',
                        icon: 'fa-user-plus',
                        submodules: [
                            { label: 'Job Posting Management' },
                            { label: 'Vacancy Requests' },
                            { label: 'Candidate Shortlisting' },
                            { label: 'Hiring Approval' }
                        ]
                    },
                    {
                        label: 'New Hire Onboarding',
                        target: '#documents',
                        icon: 'fa-id-card',
                        submodules: [
                            { label: 'Pre-Employment Requirements' },
                            { label: 'Document Submission' },
                            { label: 'Contract Management' },
                            { label: 'Orientation Scheduling' }
                        ]
                    },
                    {
                        label: 'Performance Management (Initial)',
                        target: '#attendance',
                        icon: 'fa-chart-line',
                        submodules: [
                            { label: 'Probation Evaluation' },
                            { label: 'Initial KPI Setup' },
                            { label: 'Evaluation Results' }
                        ]
                    },
                    {
                        label: 'Social Recognition',
                        target: '#settings',
                        icon: 'fa-award',
                        submodules: [
                            { label: 'Employee Recognition' },
                            { label: 'Awards & Commendations' },
                            { label: 'Recognition History' }
                        ]
                    },
                    {
                        label: 'Competency Management',
                        target: '#employees',
                        icon: 'fa-brain',
                        submodules: [
                            { label: 'Skill Inventory' },
                            { label: 'Competency Assessment' },
                            { label: 'Competency Gap Analysis' }
                        ]
                    }
                ],
                stats: [
                    { label: 'Open Positions', value: '18' },
                    { label: 'Applicants This Week', value: '124' },
                    { label: 'Interviews Scheduled', value: '27' },
                    { label: 'Offers Sent', value: '9' }
                ],
                primaryCardTitle: 'Candidate Pipeline',
                secondaryCardTitle: 'Interview Queue'
            },
            hr2: {
                roleName: 'HR2 - Talent Development',
                subtitle: 'Development dashboard for training, learning plans, and employee growth tracking.',
                sidebarModules: [
                    { label: 'Dashboard', target: '#dashboard', icon: 'fa-gauge' },
                    {
                        label: 'Learning Management',
                        target: '#recruitment',
                        icon: 'fa-graduation-cap',
                        submodules: [
                            { label: 'Course Catalog' },
                            { label: 'Assigned Courses' },
                            { label: 'Course Completion Tracking' },
                            { label: 'Certifications' }
                        ]
                    },
                    {
                        label: 'Training Management',
                        target: '#attendance',
                        icon: 'fa-chalkboard-user',
                        submodules: [
                            { label: 'Training Programs' },
                            { label: 'Training Schedule' },
                            { label: 'Training Attendance' },
                            { label: 'Training Evaluation' }
                        ]
                    },
                    {
                        label: 'Succession Planning',
                        target: '#documents',
                        icon: 'fa-diagram-project',
                        submodules: [
                            { label: 'Position Planning' },
                            { label: 'Successor Identification' },
                            { label: 'Readiness Assessment' }
                        ]
                    },
                    {
                        label: 'Employee Self-Service (ESS)',
                        target: '#settings',
                        icon: 'fa-user-gear',
                        submodules: [
                            { label: 'View Profile' },
                            { label: 'Update Personal Info' },
                            { label: 'Submit Requests' },
                            { label: 'View Employment Records' }
                        ]
                    }
                ],
                stats: [
                    { label: 'Active Training Programs', value: '14' },
                    { label: 'Employees Enrolled', value: '187' },
                    { label: 'Certifications This Month', value: '31' },
                    { label: 'Completion Rate', value: '86%' }
                ],
                primaryCardTitle: 'Learning & Development',
                secondaryCardTitle: 'Training Requests'
            },
            hr3: {
                roleName: 'HR3 - Workforce Operations',
                subtitle: 'Operations dashboard for attendance, leave approvals, and staffing stability.',
                sidebarModules: [
                    { label: 'Dashboard', target: '#dashboard', icon: 'fa-gauge' },
                    {
                        label: 'Time and Attendance System',
                        target: '#attendance',
                        icon: 'fa-clock',
                        submodules: [
                            { label: 'Attendance Monitoring' },
                            { label: 'Attendance Validation' },
                            { label: 'Attendance Reports' },
                            { label: 'Correction Requests' }
                        ]
                    },
                    {
                        label: 'Shift and Schedule Management',
                        target: '#recruitment',
                        icon: 'fa-calendar-days',
                        submodules: [
                            { label: 'Shift Creation' },
                            { label: 'Staff Scheduling' },
                            { label: 'Shift Assignment' },
                            { label: 'Schedule Reports' }
                        ]
                    },
                    {
                        label: 'Timesheet Management',
                        target: '#employees',
                        icon: 'fa-file-lines',
                        submodules: [
                            { label: 'Timesheet Submission' },
                            { label: 'Timesheet Approval' },
                            { label: 'Overtime Tracking' }
                        ]
                    },
                    {
                        label: 'Leave Management',
                        target: '#leave',
                        icon: 'fa-calendar-check',
                        submodules: [
                            { label: 'Leave Dashboard' },
                            { label: 'Leave Request' },
                            { label: 'Leave Approval' },
                            { label: 'Leave Balance' },
                            { label: 'Leave Reports' }
                        ]
                    },
                    {
                        label: 'Claims and Reimbursement',
                        target: '#payroll',
                        icon: 'fa-receipt',
                        submodules: [
                            { label: 'Claim Submission' },
                            { label: 'Claim Review' },
                            { label: 'Reimbursement Processing' },
                            { label: 'Claim History' }
                        ]
                    }
                ],
                stats: [
                    { label: 'Active Employees', value: '248' },
                    { label: 'Attendance Compliance', value: '93%' },
                    { label: 'Open Leave Requests', value: '19' },
                    { label: 'Shift Coverage', value: '97%' }
                ],
                primaryCardTitle: 'Workforce Directory',
                secondaryCardTitle: 'Leave Approvals'
            },
            hr4: {
                roleName: 'HR4 - Compensation & Analytics',
                subtitle: 'Compensation and analytics dashboard for payroll accuracy and workforce insights.',
                sidebarModules: [
                    { label: 'Dashboard', target: '#dashboard', icon: 'fa-gauge' },
                    {
                        label: 'Core Human Capital Management (HCM)',
                        target: '#employees',
                        icon: 'fa-people-group',
                        submodules: [
                            { label: 'Employee Master Data' },
                            { label: 'Employment Records' },
                            { label: 'Position Management' },
                            { label: 'Organizational Structure' }
                        ]
                    },
                    {
                        label: 'Payroll Management',
                        target: '#payroll',
                        icon: 'fa-money-bill-wave',
                        submodules: [
                            { label: 'Payroll Processing' },
                            { label: 'Salary Computation' },
                            { label: 'Payslip Generation' },
                            { label: 'Payroll Reports' }
                        ]
                    },
                    {
                        label: 'Compensation Planning',
                        target: '#leave',
                        icon: 'fa-sack-dollar',
                        submodules: [
                            { label: 'Salary Adjustment' },
                            { label: 'Incentive Management' },
                            { label: 'Bonus Allocation' }
                        ]
                    },
                    {
                        label: 'HR Analytics Dashboard',
                        target: '#attendance',
                        icon: 'fa-chart-pie',
                        submodules: [
                            { label: 'Workforce Reports' },
                            { label: 'Turnover Analysis' },
                            { label: 'Attendance Analytics' },
                            { label: 'Performance Metrics' }
                        ]
                    },
                    {
                        label: 'HMO & Benefits Administration',
                        target: '#documents',
                        icon: 'fa-notes-medical',
                        submodules: [
                            { label: 'HMO Enrollment' },
                            { label: 'Benefits Management' },
                            { label: 'Benefits Claims' },
                            { label: 'Benefits Reports' }
                        ]
                    }
                ],
                stats: [
                    { label: 'Payroll Processed', value: '231/248' },
                    { label: 'Compensation Reviews', value: '22' },
                    { label: 'Budget Utilization', value: '89%' },
                    { label: 'Outstanding Adjustments', value: '17' }
                ],
                primaryCardTitle: 'Compensation Overview',
                secondaryCardTitle: 'Pending Salary Actions'
            }
        };

        const query = new URLSearchParams(window.location.search);
        const roleFromQuery = query.get('role');
        const roleFromStorage = localStorage.getItem('hospitalHrSelectedRole');
        const selectedRole = roleFromQuery || roleFromStorage;

        if (!selectedRole || !roleConfigs[selectedRole]) {
            return;
        }

        localStorage.setItem('hospitalHrSelectedRole', selectedRole);

        const selectedConfig = roleConfigs[selectedRole];
        const employeeId = localStorage.getItem('hospitalHrEmployeeId');
        const accounts = JSON.parse(localStorage.getItem('hospitalHrAccounts') || '[]');
        const profileExtras = JSON.parse(localStorage.getItem('hospitalHrProfileExtras') || '{}');
        const profileKey = String(employeeId || '').toLowerCase() + '::' + String(selectedRole).toLowerCase();
        const profileData = profileExtras[profileKey] || {};
        const matchedAccount = accounts.find(function (account) {
            const sameEmployeeId = String(account.employeeId).toLowerCase() === String(employeeId || '').toLowerCase();
            const sameRole = String(account.role) === String(selectedRole);
            return sameEmployeeId && sameRole;
        });
        const displayName = profileData.fullName || (matchedAccount && matchedAccount.fullName
            ? matchedAccount.fullName
            : (employeeId ? 'ID: ' + employeeId : 'Hospital HR'));
        const avatarUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(displayName) + '&background=0D6EFD&color=fff&bold=true';

        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');
        const sidebarUserName = document.getElementById('sidebarUserName');
        const sidebarRoleText = document.getElementById('sidebarRoleText');
        const navbarRoleText = document.getElementById('navbarRoleText');
        const sidebarAvatar = document.getElementById('sidebarAvatar');
        const navbarAvatar = document.getElementById('navbarAvatar');
        const primaryCardTitle = document.getElementById('primaryCardTitle');
        const secondaryCardTitle = document.getElementById('secondaryCardTitle');

        if (pageTitle) {
            pageTitle.textContent = selectedConfig.roleName + ' Dashboard';
        }

        if (pageSubtitle) {
            pageSubtitle.textContent = selectedConfig.subtitle;
        }

        applyRoleSidebarModules(selectedConfig);
        applyRoleDashboardOverview(selectedConfig);

        if (sidebarRoleText) {
            sidebarRoleText.textContent = selectedConfig.roleName;
        }

        if (navbarRoleText) {
            navbarRoleText.textContent = displayName;
        }

        if (sidebarUserName) {
            sidebarUserName.textContent = displayName;
        }

        if (sidebarAvatar) {
            sidebarAvatar.src = avatarUrl;
        }

        if (navbarAvatar) {
            navbarAvatar.src = avatarUrl;
        }

        if (primaryCardTitle) {
            primaryCardTitle.textContent = selectedConfig.primaryCardTitle;
        }

        if (secondaryCardTitle) {
            secondaryCardTitle.textContent = selectedConfig.secondaryCardTitle;
        }

        selectedConfig.stats.forEach(function (item, index) {
            const labelEl = document.getElementById('statLabel' + (index + 1));
            const valueEl = document.getElementById('statValue' + (index + 1));

            if (labelEl) {
                labelEl.textContent = item.label;
            }

            if (valueEl) {
                valueEl.textContent = item.value;
            }
        });

        function applyRoleSidebarModules(config) {
            if (!config.sidebarModules || !config.sidebarModules.length) {
                return;
            }

            const navList = document.querySelector('.sidebar-nav .nav.flex-column');
            if (!navList) {
                return;
            }

            const roleModuleItems = config.sidebarModules.map(function (module, index) {
                const activeClass = index === 0 ? ' active' : '';
                const hasSubmodules = Array.isArray(module.submodules) && module.submodules.length > 0;
                const parentClasses = hasSubmodules ? ' has-submodules' : '';
                const submoduleItems = hasSubmodules
                    ? '<ul class="nav flex-column sidebar-subnav">' + module.submodules.map(function (submodule) {
                        const subTarget = submodule.target || module.target;
                        return [
                            '<li class="nav-item">',
                            '  <a class="nav-link nav-sublink" href="' + subTarget + '">',
                            '    <span>' + submodule.label + '</span>',
                            '  </a>',
                            '</li>'
                        ].join('');
                    }).join('') + '</ul>'
                    : '';

                return [
                    '<li class="nav-item">',
                    '  <a class="nav-link' + activeClass + parentClasses + '" href="' + module.target + '">',
                    '    <i class="fas ' + module.icon + '"></i>',
                    '    <span>' + module.label + '</span>',
                    hasSubmodules ? '    <i class="fas fa-chevron-down subnav-caret"></i>' : '',
                    '  </a>',
                    submoduleItems,
                    '</li>'
                ].join('');
            }).join('');

            navList.innerHTML = roleModuleItems;
        }

        function applyRoleDashboardOverview(config) {
            const overviewTitle = document.getElementById('roleOverviewTitle');
            const overviewBody = document.getElementById('roleModuleOverviewBody');

            if (!overviewBody) {
                return;
            }

            if (overviewTitle) {
                overviewTitle.textContent = config.roleName + ' Modules';
            }

            const modulesForOverview = (config.sidebarModules || []).filter(function (module) {
                return module.label !== 'Dashboard';
            });

            if (!modulesForOverview.length) {
                overviewBody.innerHTML = '<p class="text-muted mb-0">No role modules available.</p>';
                return;
            }

            overviewBody.innerHTML = '<div class="role-module-grid">' + modulesForOverview.map(function (module) {
                const submodules = Array.isArray(module.submodules) ? module.submodules : [];
                const submoduleMarkup = submodules.length
                    ? '<div class="role-submodule-list">' + submodules.map(function (submodule) {
                        return '<span class="role-submodule-pill">' + submodule.label + '</span>';
                    }).join('') + '</div>'
                    : '<p class="text-muted small mb-0">No submodules.</p>';

                return [
                    '<div class="role-module-item">',
                    '  <div class="role-module-name">' + module.label + '</div>',
                    submoduleMarkup,
                    '</div>'
                ].join('');
            }).join('') + '</div>';
        }
    }

    function initSidebar() {
        const toggle = document.getElementById('sidebarToggle');
        const close = document.getElementById('sidebarClose');
        const sidebar = document.getElementById('sidebar');
        const storageKey = 'hospitalHrSidebarCollapsed';

        if (!toggle || !sidebar) {
            return;
        }

        applyStoredSidebarState();

        toggle.addEventListener('click', function (event) {
            event.preventDefault();
            if (window.innerWidth >= 992) {
                sidebar.classList.toggle('collapsed');
                persistSidebarState();
                return;
            }

            sidebar.classList.toggle('show');
        });

        if (close) {
            close.addEventListener('click', function (event) {
                event.preventDefault();
                sidebar.classList.remove('show');
            });
        }

        document.addEventListener('click', function (event) {
            if (window.innerWidth >= 992) {
                return;
            }

            if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
                sidebar.classList.remove('show');
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 992) {
                sidebar.classList.remove('show');
                applyStoredSidebarState();
            }
        });

        function persistSidebarState() {
            const isCollapsed = sidebar.classList.contains('collapsed');
            localStorage.setItem(storageKey, isCollapsed ? '1' : '0');
        }

        function applyStoredSidebarState() {
            if (window.innerWidth < 992) {
                return;
            }

            const isCollapsed = localStorage.getItem(storageKey) === '1';
            sidebar.classList.toggle('collapsed', isCollapsed);
        }
    }

    function initSidebarNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link[href^="#"]');
        const sidebar = document.getElementById('sidebar');

        if (!navLinks.length) {
            return;
        }

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                if (link.classList.contains('has-submodules')) {
                    event.preventDefault();

                    const parentItem = link.closest('.nav-item');
                    if (!parentItem) {
                        return;
                    }

                    const isOpen = parentItem.classList.contains('open');
                    const allParentItems = document.querySelectorAll('.sidebar-nav > .nav > .nav-item');

                    allParentItems.forEach(function (item) {
                        item.classList.remove('open');
                    });

                    if (!isOpen) {
                        parentItem.classList.add('open');
                    }

                    return;
                }

                event.preventDefault();

                const targetSelector = link.getAttribute('href');
                if (!targetSelector) {
                    return;
                }

                const targetElement = document.querySelector(targetSelector);
                if (!targetElement) {
                    return;
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                setActiveNavLink(link);

                if (window.innerWidth < 992 && sidebar) {
                    sidebar.classList.remove('show');
                }
            });
        });

        const sections = Array.from(navLinks)
            .map(function (link) {
                const selector = link.getAttribute('href');
                return selector ? document.querySelector(selector) : null;
            })
            .filter(Boolean);

        if (!sections.length) {
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                    return;
                }

                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector('.sidebar-nav .nav-link[href="#' + id + '"]');
                if (activeLink) {
                    setActiveNavLink(activeLink);
                }
            });
        }, {
            rootMargin: '-120px 0px -55% 0px',
            threshold: 0.1
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function setActiveNavLink(activeLink) {
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        navLinks.forEach(function (link) {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    function initSearch() {
        const searchForm = document.querySelector('form[role="search"]');
        if (!searchForm) {
            return;
        }

        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const input = searchForm.querySelector('input[type="search"]');
            if (!input) {
                return;
            }

            const query = input.value.trim();
            if (query.length > 0) {
                alert('Search: ' + query);
            }
        });
    }

    function initActionButtons() {
        const buttons = document.querySelectorAll('.table .btn-sm');

        buttons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const icon = button.querySelector('i');
                if (!icon) {
                    return;
                }

                if (icon.classList.contains('fa-eye')) {
                    alert('Open employee profile');
                }

                if (icon.classList.contains('fa-edit')) {
                    alert('Edit employee record');
                }
            });
        });
    }

    function initLogout() {
        const logoutButton = document.getElementById('logoutButton');
        if (!logoutButton) {
            return;
        }

        logoutButton.addEventListener('click', function (event) {
            event.preventDefault();
            showLogoutNotification(function () {
                localStorage.removeItem('hospitalHrSelectedRole');
                localStorage.removeItem('hospitalHrEmployeeId');
                localStorage.removeItem('hospitalHrSidebarCollapsed');
                window.location.href = 'login.html';
            });
        });
    }

    function showLogoutNotification(onConfirm) {
        let overlay = document.getElementById('logoutNotificationOverlay');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'logoutNotificationOverlay';
            overlay.className = 'app-notification-overlay';
            overlay.innerHTML = [
                '<div class="app-notification-box" role="dialog" aria-modal="true" aria-labelledby="logoutNotifTitle">',
                '  <div class="app-notification-title" id="logoutNotifTitle">Confirm Logout</div>',
                '  <div class="app-notification-text">Are you sure you want to logout?</div>',
                '  <div class="app-notification-actions">',
                '    <button type="button" class="btn btn-sm btn-outline-secondary" id="cancelLogoutBtn">Cancel</button>',
                '    <button type="button" class="btn btn-sm btn-danger" id="confirmLogoutBtn">Logout</button>',
                '  </div>',
                '</div>'
            ].join('');
            document.body.appendChild(overlay);

            overlay.addEventListener('click', function (event) {
                if (event.target === overlay) {
                    overlay.classList.remove('show');
                }
            });
        }

        const cancelButton = overlay.querySelector('#cancelLogoutBtn');
        const confirmButton = overlay.querySelector('#confirmLogoutBtn');

        overlay.classList.add('show');

        if (cancelButton) {
            cancelButton.onclick = function () {
                overlay.classList.remove('show');
            };
        }

        if (confirmButton) {
            confirmButton.onclick = function () {
                overlay.classList.remove('show');
                if (typeof onConfirm === 'function') {
                    onConfirm();
                }
            };
        }
    }
})();
