(function () {
    'use strict';

    let activeSubmoduleName = '';
    let dashboardRealtimeTimer = null;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initRoleDashboard();
        initRealtimeProfileSync();
        initRealtimeDashboardSync();
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

            if (event.key === 'hospitalHrEmployeeId') {
                initRoleDashboard();
            }

            if (event.key.indexOf('hospitalHr') === 0) {
                updateDashboardFromModuleData();
            }
        });

        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                initRoleDashboard();
                updateDashboardFromModuleData();
            }
        });
    }

    function initRealtimeDashboardSync() {
        updateDashboardFromModuleData();

        if (dashboardRealtimeTimer) {
            window.clearInterval(dashboardRealtimeTimer);
        }

        dashboardRealtimeTimer = window.setInterval(function () {
            updateDashboardFromModuleData();
        }, 2000);
    }

    function updateDashboardFromModuleData() {
        const employees = getStorageList('hospitalHrHcmEmployees');
        const leaveRequests = getStorageList('hospitalHrLeaveRequests');
        const payrollRecords = getStorageList('hospitalHrPayrollRecords');
        const claimsRecords = getStorageList('hospitalHrClaimsRecords');
        const attendanceRecords = getStorageList('hospitalHrAttendanceRecords');
        const benefitsRecords = getStorageList('hospitalHrBenefitsRecords');

        const totalEmployees = employees.length || 248;
        const pendingRequests = leaveRequests.filter(function (item) {
            return item && item.status === 'Pending';
        }).length + claimsRecords.filter(function (item) {
            return item && (item.status === 'Submitted' || item.status === 'Under Review');
        }).length;

        const payrollProcessed = payrollRecords.filter(function (item) {
            return item && item.status === 'Processed';
        }).length;
        const payrollCompliance = payrollRecords.length
            ? Math.round((payrollProcessed / payrollRecords.length) * 100)
            : 92;

        const attendancePresent = attendanceRecords.filter(function (item) {
            return item && (item.status === 'Present' || item.status === 'On Time');
        }).length;
        const attendanceTotal = attendanceRecords.length;
        const attendanceRate = attendanceTotal
            ? Math.round((attendancePresent / attendanceTotal) * 100)
            : 93;

        setText('statLabel1', 'Total Employees');
        setText('statValue1', String(totalEmployees));
        setText('statLabel2', 'Open Requests');
        setText('statValue2', String(pendingRequests));
        setText('statLabel3', 'Attendance Compliance');
        setText('statValue3', attendanceRate + '%');
        setText('statLabel4', 'Payroll Ready');
        setText('statValue4', payrollCompliance + '%');

        setSectionMetric('attendance', 0, attendancePresent || 223);
        setSectionMetric('attendance', 1, Math.max(attendanceTotal - attendancePresent, 0) || 11);
        setSectionMetric('attendance', 2, leaveRequests.filter(function (item) {
            return item && item.status === 'Approved';
        }).length || 14);

        setSectionMetric('payroll', 1, payrollProcessed + '/' + (payrollRecords.length || totalEmployees));
        setSectionMetric('payroll', 2, payrollRecords.length ? payrollRecords.length - payrollProcessed : 17);

        setSectionMetric('documents', 0, totalEmployees);
        setSectionMetric('documents', 1, claimsRecords.filter(function (item) {
            return item && item.status !== 'Approved';
        }).length || 7);
        setSectionMetric('documents', 2, benefitsRecords.filter(function (item) {
            return item && item.claimStatus === 'Pending';
        }).length || 2);
    }

    function getStorageList(key) {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function setText(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    function setSectionMetric(sectionId, index, value) {
        const section = document.getElementById(sectionId);
        if (!section) {
            return;
        }

        const metricRows = section.querySelectorAll('.card-body p');
        if (!metricRows[index]) {
            return;
        }

        const strong = metricRows[index].querySelector('strong');
        if (strong) {
            strong.textContent = String(value);
        }
    }

    function initRoleDashboard() {
        const selectedConfig = {
            roleName: 'Hospital HR',
            subtitle: 'Manage workforce, operations, and employee lifecycle in one place.',
            sidebarModules: [
                { label: 'Dashboard', target: 'dashboard.html', icon: 'fa-gauge' },
                { label: 'Applicant Management', target: '#', icon: 'fa-users' },
                { label: 'Recruitment Management', target: '#', icon: 'fa-user-plus' },
                { label: 'New Hire Onboarding', target: '#', icon: 'fa-id-card' },
                { label: 'Performance Management (Initial)', target: '#', icon: 'fa-chart-line' },
                { label: 'Social Recognition', target: '#', icon: 'fa-award' },
                { label: 'Competency Management', target: '#', icon: 'fa-brain' },
                { label: 'Learning Management', target: '#', icon: 'fa-graduation-cap' },
                { label: 'Training Management', target: '#', icon: 'fa-chalkboard-user' },
                { label: 'Succession Planning', target: '#', icon: 'fa-diagram-project' },
                { label: 'Employee Self-Service (ESS)', target: '#', icon: 'fa-user-gear' },
                {
                    label: 'Time and Attendance System',
                    target: '#',
                    icon: 'fa-clock',
                    submodules: [
                        { label: 'Attendance Monitoring', target: '#' },
                        { label: 'Attendance Validation', target: '#' },
                        { label: 'Attendance Reports', target: '#' },
                        { label: 'Correction Requests', target: '#' }
                    ]
                },
                {
                    label: 'Shift and Schedule Management',
                    target: '#',
                    icon: 'fa-calendar-days',
                    submodules: [
                        { label: 'Shift Creation', target: '#' },
                        { label: 'Staff Scheduling', target: '#' },
                        { label: 'Shift Assignment', target: '#' },
                        { label: 'Schedule Reports', target: '#' }
                    ]
                },
                {
                    label: 'Timesheet Management',
                    target: '#',
                    icon: 'fa-file-lines',
                    submodules: [
                        { label: 'Timesheet Submission', target: '#' },
                        { label: 'Timesheet Approval', target: '#' },
                        { label: 'Overtime Tracking', target: '#' }
                    ]
                },
                {
                    label: 'Leave Management',
                    target: '#',
                    icon: 'fa-calendar-check',
                    submodules: [
                        { label: 'Leave Dashboard', target: '#' },
                        { label: 'Leave Request', target: '#' },
                        { label: 'Leave Approval', target: '#' },
                        { label: 'Leave Balance', target: '#' },
                        { label: 'Leave Reports', target: '#' }
                    ]
                },
                {
                    label: 'Claims and Reimbursement',
                    target: '#',
                    icon: 'fa-receipt',
                    submodules: [
                        { label: 'Claim Submission', target: '#' },
                        { label: 'Claim Review', target: '#' },
                        { label: 'Reimbursement Processing', target: '#' },
                        { label: 'Claim History', target: '#' }
                    ]
                },
                {
                    label: 'Core Human Capital Management (HCM)',
                    target: '#',
                    icon: 'fa-people-group',
                    submodules: [
                        { label: 'Employee Master Data', target: '#' },
                        { label: 'Employment Records', target: '#' },
                        { label: 'Position Management', target: '#' },
                        { label: 'Organizational Structure', target: '#' }
                    ]
                },
                {
                    label: 'Payroll Management',
                    target: '#',
                    icon: 'fa-money-bill-wave',
                    submodules: [
                        { label: 'Payroll Processing', target: '#' },
                        { label: 'Salary Computation', target: '#' },
                        { label: 'Payslip Generation', target: '#' },
                        { label: 'Payroll Reports', target: '#' }
                    ]
                },
                {
                    label: 'Compensation Planning',
                    target: '#',
                    icon: 'fa-sack-dollar',
                    submodules: [
                        { label: 'Salary Adjustment', target: '#' },
                        { label: 'Incentive Management', target: '#' },
                        { label: 'Bonus Allocation', target: '#' }
                    ]
                },
                {
                    label: 'HR Analytics Dashboard',
                    target: '#',
                    icon: 'fa-chart-pie',
                    submodules: [
                        { label: 'Workforce Reports', target: '#' },
                        { label: 'Turnover Analysis', target: '#' },
                        { label: 'Attendance Analytics', target: '#' },
                        { label: 'Performance Metrics', target: '#' }
                    ]
                },
                {
                    label: 'HMO & Benefits Administration',
                    target: '#',
                    icon: 'fa-notes-medical',
                    submodules: [
                        { label: 'HMO Enrollment', target: '#' },
                        { label: 'Benefits Management', target: '#' },
                        { label: 'Benefits Claims', target: '#' },
                        { label: 'Benefits Reports', target: '#' }
                    ]
                }
            ],
            stats: [
                { label: 'Total Employees', value: '248' },
                { label: 'Open Positions', value: '18' },
                { label: 'Attendance Compliance', value: '93%' },
                { label: 'Pending Requests', value: '27' }
            ],
            primaryCardTitle: 'Workforce Overview',
            secondaryCardTitle: 'Pending Actions'
        };

        const employeeId = localStorage.getItem('hospitalHrEmployeeId');
        const displayName = employeeId ? 'ID: ' + employeeId : 'Hospital HR';
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
                        const subTarget = submodule.target || '#';
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
        const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
        const sidebar = document.getElementById('sidebar');

        if (!navLinks.length) {
            return;
        }

        navLinks.forEach(function (link) {
            link.addEventListener('click', function (event) {
                const isSubmoduleLink = link.classList.contains('nav-sublink');

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

                const targetSelector = link.getAttribute('href');
                if (!targetSelector) {
                    return;
                }

                if (isSubmoduleLink) {
                    event.preventDefault();
                    setActiveNavLink(link);
                    renderInlineSubmoduleContent(link.textContent.trim());
                    if (window.innerWidth < 992 && sidebar) {
                        sidebar.classList.remove('show');
                    }
                    return;
                }

                if (!isSubmoduleLink) {
                    event.preventDefault();
                    setActiveNavLink(link);

                    if (link.textContent.trim() === 'Dashboard') {
                        restoreDashboardView();
                        const dashboardSection = document.getElementById('dashboard');
                        if (dashboardSection) {
                            dashboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }

                    if (window.innerWidth < 992 && sidebar) {
                        sidebar.classList.remove('show');
                    }
                    return;
                }

                event.preventDefault();

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

        const sectionLinks = Array.from(navLinks).filter(function (link) {
            const selector = link.getAttribute('href');
            return !!selector && selector.charAt(0) === '#' && selector.length > 1;
        });

        const sections = sectionLinks
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

    function renderInlineSubmoduleContent(submoduleName) {
        const titleEl = document.getElementById('roleOverviewTitle');
        const bodyEl = document.getElementById('roleModuleOverviewBody');
        const sectionEl = document.getElementById('roleOverview');
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        if (!titleEl || !bodyEl) {
            return;
        }

        activeSubmoduleName = submoduleName;

        setDashboardContentMode('submodule');
        titleEl.textContent = submoduleName;

        if (pageTitle) {
            pageTitle.textContent = submoduleName;
        }

        if (pageSubtitle) {
            pageSubtitle.textContent = 'Operational view for ' + submoduleName + ' with real-time HR workflow data.';
        }

        const submoduleRenderers = {
            'Attendance Monitoring': 'renderAttendanceMonitoring',
            'Attendance Validation': 'renderAttendanceValidation',
            'Attendance Reports': 'renderAttendanceReports',
            'Correction Requests': 'renderCorrectionRequests',
            'Shift Creation': 'renderShiftCreation',
            'Staff Scheduling': 'renderStaffScheduling',
            'Shift Assignment': 'renderShiftAssignment',
            'Schedule Reports': 'renderScheduleReports',
            'Timesheet Submission': 'renderTimesheetSubmission',
            'Timesheet Approval': 'renderTimesheetApproval',
            'Overtime Tracking': 'renderOvertimeTracking',
            'Leave Dashboard': 'renderLeaveDashboard',
            'Leave Request': 'renderLeaveRequest',
            'Leave Approval': 'renderLeaveApproval',
            'Leave Balance': 'renderLeaveBalance',
            'Leave Reports': 'renderLeaveReports',
            'Claim Submission': 'renderClaimSubmission',
            'Claim Review': 'renderClaimReview',
            'Reimbursement Processing': 'renderReimbursementProcessing',
            'Claim History': 'renderClaimHistory',
            'Employee Master Data': 'renderEmployeeMasterData',
            'Employment Records': 'renderEmploymentRecords',
            'Position Management': 'renderPositionManagement',
            'Organizational Structure': 'renderOrganizationalStructure',
            'Payroll Processing': 'renderPayrollProcessing',
            'Salary Computation': 'renderSalaryComputation',
            'Payslip Generation': 'renderPayslipGeneration',
            'Payroll Reports': 'renderPayrollReports',
            'Salary Adjustment': 'renderSalaryAdjustment',
            'Incentive Management': 'renderIncentiveManagement',
            'Bonus Allocation': 'renderBonusAllocation',
            'Workforce Reports': 'renderWorkforceReports',
            'Turnover Analysis': 'renderTurnoverAnalysis',
            'Attendance Analytics': 'renderAttendanceAnalytics',
            'Performance Metrics': 'renderPerformanceMetrics',
            'HMO Enrollment': 'renderHmoEnrollment',
            'Benefits Management': 'renderBenefitsManagement',
            'Benefits Claims': 'renderBenefitsClaims',
            'Benefits Reports': 'renderBenefitsReports'
        };

        const rendererName = submoduleRenderers[submoduleName];
        const renderer = rendererName && window.HRSubmodules ? window.HRSubmodules[rendererName] : null;

        if (typeof renderer === 'function') {
            renderer(bodyEl);
        } else {
            bodyEl.innerHTML = '<div class="border rounded-3 p-3">'
                + '<p class="mb-1 fw-semibold">' + submoduleName + '</p>'
                + '<p class="text-muted mb-0">This submodule is loaded in the same dashboard page. Content can be expanded here next.</p>'
                + '</div>';
        }

        injectSubmoduleActionBar(bodyEl, submoduleName);

        if (sectionEl) {
            sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function injectSubmoduleActionBar(container, submoduleName) {
        if (!container) {
            return;
        }

        const existingBar = container.querySelector('.submodule-actionbar');
        if (existingBar) {
            existingBar.remove();
        }

        const toolbar = document.createElement('div');
        toolbar.className = 'submodule-actionbar d-flex justify-content-between align-items-center mb-3';
        toolbar.innerHTML = [
            '<div class="submodule-actionbar-title">',
            '  <span class="badge bg-primary-subtle text-primary px-2 py-1">HR Workspace</span>',
            '</div>',
            '<div class="submodule-actionbar-buttons d-flex gap-2">',
            '  <button type="button" class="btn btn-sm btn-outline-secondary" data-submodule-action="filter"><i class="fas fa-filter me-1"></i>Filter</button>',
            '  <button type="button" class="btn btn-sm btn-outline-secondary" data-submodule-action="export"><i class="fas fa-file-export me-1"></i>Export</button>',
            '  <button type="button" class="btn btn-sm btn-outline-primary" data-submodule-action="refresh"><i class="fas fa-rotate-right me-1"></i>Refresh</button>',
            '</div>'
        ].join('');

        container.prepend(toolbar);

        toolbar.querySelectorAll('button[data-submodule-action]').forEach(function (button) {
            button.addEventListener('click', function () {
                const action = button.getAttribute('data-submodule-action');

                if (action === 'filter') {
                    const firstInput = container.querySelector('input:not([type="hidden"]), select, textarea');
                    if (firstInput) {
                        firstInput.focus();
                    }
                    return;
                }

                if (action === 'export') {
                    const knownExportIds = ['attExportCsv', 'exportScheduleCsv', 'leaveExportCsv'];
                    const exportButton = knownExportIds
                        .map(function (id) { return document.getElementById(id); })
                        .find(Boolean);

                    if (exportButton) {
                        exportButton.click();
                        return;
                    }

                    exportFirstTableAsCsv(container, submoduleName);
                    return;
                }

                if (action === 'refresh' && activeSubmoduleName) {
                    renderInlineSubmoduleContent(activeSubmoduleName);
                }
            });
        });
    }

    function exportFirstTableAsCsv(container, submoduleName) {
        const table = container.querySelector('table');
        if (!table) {
            return;
        }

        const rows = Array.from(table.querySelectorAll('tr')).map(function (row) {
            return Array.from(row.querySelectorAll('th, td')).map(function (cell) {
                const raw = (cell.textContent || '').trim().replace(/\s+/g, ' ');
                return '"' + raw.replace(/"/g, '""') + '"';
            }).join(',');
        });

        if (!rows.length) {
            return;
        }

        const safeName = (submoduleName || 'submodule-report').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = (safeName || 'submodule-report') + '.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    }

    function setDashboardContentMode(mode) {
        const sections = document.querySelectorAll('.content-section');
        const contentWrapper = document.querySelector('.content-wrapper');

        if (contentWrapper) {
            contentWrapper.classList.toggle('submodule-view', mode === 'submodule');
        }

        sections.forEach(function (section) {
            if (mode === 'submodule') {
                section.classList.toggle('d-none', section.id !== 'roleOverview');
                return;
            }

            section.classList.remove('d-none');
        });
    }

    function restoreDashboardView() {
        const pageTitle = document.getElementById('pageTitle');
        const pageSubtitle = document.getElementById('pageSubtitle');

        setDashboardContentMode('dashboard');

        if (pageTitle) {
            pageTitle.textContent = 'Hospital HR Dashboard';
        }

        if (pageSubtitle) {
            pageSubtitle.textContent = 'Manage workforce, operations, and employee lifecycle in one place.';
        }
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
                localStorage.removeItem('hospitalHrEmployeeId');
                localStorage.removeItem('hospitalHrSidebarCollapsed');
                window.location.href = 'dashboard.html';
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
