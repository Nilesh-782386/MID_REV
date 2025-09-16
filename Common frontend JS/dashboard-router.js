// dashboard-router.js - Fixed and Enhanced Centralized dashboard routing

class DashboardRouter {
    constructor() {
        this.currentUser = null;
        this.userType = null;
        this.dashboardConfig = {
            donor: {
                url: '/Common frontend HTML/dashboard.html',
                script: '/Common frontend JS/dashboard.js',
                features: ['donations', 'statistics', 'profile'],
                role: 'Donor',
                dataKey: 'donor_data',
                defaultData: {
                    blood_group: '',
                    statistics: {
                        blood_donations: 0,
                        money_donated: 0,
                        items_donated: 0,
                        lives_impacted: 0
                    },
                    donations: [],
                    last_donation: null
                }
            },
            volunteer: {
                url: '/Common frontend HTML/volunteer-dashboard.html',
                script: '/Common frontend JS/volunteer-dashboard.js',
                features: ['activities', 'opportunities', 'hours', 'profile'],
                role: 'Volunteer',
                dataKey: 'volunteer_data',
                defaultData: {
                    skills: '',
                    availability: '',
                    preferred_location: '',
                    specialization: '',
                    status: 'Active',
                    statistics: {
                        hours_volunteered: 0,
                        events_participated: 0,
                        people_helped: 0,
                        rating: 5.0
                    },
                    activities: []
                }
            },
            ngo: {
                url: '/Common frontend HTML/ngo-dashboard.html',
                script: '/Common frontend JS/ngo-dashboard.js',
                features: ['projects', 'campaigns', 'volunteers', 'donations', 'profile'],
                role: 'NGO',
                dataKey: 'ngo_data',
                defaultData: {
                    registration_number: '',
                    focus_areas: '',
                    verification_status: 'Pending',
                    rating: 5.0,
                    statistics: {
                        funds_received: 0,
                        beneficiaries_served: 0,
                        volunteers_connected: 0,
                        projects_completed: 0
                    },
                    projects: [],
                    campaigns: [],
                    volunteer_opportunities: []
                }
            }
        };
        
        // Common routes
        this.commonRoutes = {
            login: '/Common frontend HTML/login.html',
            signup: '/Common frontend HTML/signup.html',
            home: '/Common frontend HTML/index.html',
            about: '/Common frontend HTML/about.html',
            donate: '/Common frontend HTML/donate.html',
            volunteer: '/Common frontend HTML/volunteer.html',
            ngo: '/Common frontend HTML/ngo.html'
        };
    }

    // Initialize the router
    init() {
        console.log('=== Dashboard Router Initializing ===');
        
        // Load user session
        this.loadUserSession();
        
        // Check authentication
        if (!this.checkAuthentication()) {
            console.log('Authentication failed, redirecting to login');
            this.redirectToLogin();
            return false;
        }
        
        // Determine user type
        this.determineUserType();
        
        // Validate dashboard access
        if (!this.validateDashboardAccess()) {
            return false;
        }
        
        // Initialize user data structure if needed
        this.ensureUserDataStructure();
        
        console.log('=== Router Initialization Complete ===');
        return true;
    }

    // Load user session from localStorage
    loadUserSession() {
        try {
            const userSession = localStorage.getItem('currentUser');
            if (!userSession || userSession === 'null') {
                console.log('No user session found');
                this.currentUser = null;
                return;
            }

            this.currentUser = JSON.parse(userSession);
            
            if (this.currentUser) {
                console.log('User session loaded:', {
                    name: this.currentUser.name,
                    email: this.currentUser.email,
                    userType: this.currentUser.userType,
                    userId: this.currentUser.user_id,
                    sessionId: this.currentUser.sessionId
                });
            }
        } catch (error) {
            console.error('Error loading user session:', error);
            this.currentUser = null;
            localStorage.removeItem('currentUser');
        }
    }

    // Check if user is authenticated and session is valid
    checkAuthentication() {
        if (!this.currentUser) {
            console.log('No authenticated user found');
            return false;
        }
        
        // Validate required session fields
        if (!this.currentUser.user_id || !this.currentUser.email || !this.currentUser.sessionId) {
            console.log('Invalid user session data');
            this.clearSession();
            return false;
        }
        
        // Check session expiry (24 hours)
        if (this.isSessionExpired()) {
            console.log('Session expired');
            this.clearSession();
            return false;
        }
        
        return true;
    }

    // Check if session is expired (24 hours)
    isSessionExpired() {
        if (!this.currentUser || !this.currentUser.loginTime) {
            return false;
        }
        
        const loginTime = new Date(this.currentUser.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        return hoursSinceLogin > 24;
    }

    // Determine user type from session with enhanced logic
    determineUserType() {
        if (!this.currentUser) {
            this.userType = null;
            return;
        }
        
        // Priority 1: Check explicit userType field
        if (this.currentUser.userType && ['donor', 'volunteer', 'ngo'].includes(this.currentUser.userType)) {
            this.userType = this.currentUser.userType;
        }
        // Priority 2: Check flags and data presence
        else if (this.currentUser.is_ngo === true || this.currentUser.registration_number) {
            this.userType = 'ngo';
        }
        else if (this.currentUser.is_volunteer === true || this.currentUser.skills || this.currentUser.availability) {
            this.userType = 'volunteer';
        }
        // Priority 3: Default to donor
        else {
            this.userType = 'donor';
        }
        
        console.log('User type determined:', this.userType);
        
        // Update session with determined type if it wasn't set
        if (this.currentUser.userType !== this.userType) {
            this.currentUser.userType = this.userType;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    // Validate if user has access to current dashboard
    validateDashboardAccess() {
        const currentPath = window.location.pathname;
        console.log('Validating dashboard access:', {
            currentPath,
            userType: this.userType
        });
        
        // Check if user type is valid
        if (!this.dashboardConfig[this.userType]) {
            console.error('Invalid user type:', this.userType);
            this.redirectToLogin();
            return false;
        }
        
        // Allow access to generic dashboard.html for donors
        if (currentPath.includes('dashboard.html') && !currentPath.includes('-dashboard.html')) {
            if (this.userType !== 'donor') {
                console.log('Non-donor on generic dashboard, redirecting to specific dashboard');
                this.redirectToCorrectDashboard();
                return false;
            }
            return true;
        }
        
        // Check specific dashboard access
        const expectedDashboard = this.userType === 'donor' ? 'dashboard.html' : `${this.userType}-dashboard.html`;
        
        if (!currentPath.includes(expectedDashboard)) {
            console.log('User on wrong dashboard, redirecting to correct dashboard');
            this.redirectToCorrectDashboard();
            return false;
        }
        
        return true;
    }

    // Ensure user data structure is properly initialized
    ensureUserDataStructure() {
        try {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = users.findIndex(u => u.user_id === this.currentUser.user_id);
            
            if (userIndex === -1) {
                console.warn('User not found in registered users, but session exists');
                return;
            }
            
            const config = this.dashboardConfig[this.userType];
            const dataKey = config.dataKey;
            
            // Initialize type-specific data if not exists
            if (!users[userIndex][dataKey]) {
                console.log(`Initializing ${dataKey} for user`);
                users[userIndex][dataKey] = JSON.parse(JSON.stringify(config.defaultData));
                
                // Set userType if not set
                if (!users[userIndex].userType) {
                    users[userIndex].userType = this.userType;
                }
                
                localStorage.setItem('registeredUsers', JSON.stringify(users));
                console.log(`${dataKey} initialized successfully`);
            }
        } catch (error) {
            console.error('Error ensuring user data structure:', error);
        }
    }

    // Redirect to correct dashboard based on user type
    redirectToCorrectDashboard() {
        const config = this.dashboardConfig[this.userType];
        if (config && config.url) {
            console.log(`Redirecting to ${this.userType} dashboard: ${config.url}`);
            window.location.href = config.url;
        } else {
            console.error('No dashboard configuration found for user type:', this.userType);
            this.redirectToLogin();
        }
    }

    // Redirect to login page
    redirectToLogin() {
        console.log('Redirecting to login page');
        this.clearSession();
        window.location.href = this.commonRoutes.login;
    }

    // Navigate to a specific route
    navigateTo(route) {
        if (this.commonRoutes[route]) {
            window.location.href = this.commonRoutes[route];
        } else if (this.dashboardConfig[route]) {
            window.location.href = this.dashboardConfig[route].url;
        } else {
            console.error('Unknown route:', route);
        }
    }

    // Clear user session safely
    clearSession() {
        try {
            localStorage.removeItem('currentUser');
            sessionStorage.clear();
            this.currentUser = null;
            this.userType = null;
            console.log('User session cleared');
        } catch (error) {
            console.error('Error clearing session:', error);
        }
    }

    // Get full user details from storage
    getUserDetails() {
        if (!this.currentUser) return null;
        
        try {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            return users.find(u => u.user_id === this.currentUser.user_id);
        } catch (error) {
            console.error('Error getting user details:', error);
            return null;
        }
    }

    // Update user profile with validation
    updateUserProfile(updates) {
        try {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = users.findIndex(u => u.user_id === this.currentUser.user_id);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            
            // Update user data
            Object.assign(users[userIndex], updates);
            users[userIndex].updated_at = new Date().toISOString();
            
            // Update current session (exclude sensitive data)
            const sessionUpdates = { ...updates };
            delete sessionUpdates.password;
            Object.assign(this.currentUser, sessionUpdates);
            
            // Save to localStorage
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            
            console.log('User profile updated successfully');
            return true;
        } catch (error) {
            console.error('Error updating user profile:', error);
            return false;
        }
    }

    // Update type-specific data (donor_data, volunteer_data, ngo_data)
    updateTypeSpecificData(dataUpdates) {
        try {
            const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userIndex = users.findIndex(u => u.user_id === this.currentUser.user_id);
            
            if (userIndex === -1) {
                throw new Error('User not found');
            }
            
            const config = this.dashboardConfig[this.userType];
            const dataKey = config.dataKey;
            
            // Ensure data structure exists
            if (!users[userIndex][dataKey]) {
                users[userIndex][dataKey] = JSON.parse(JSON.stringify(config.defaultData));
            }
            
            // Update type-specific data
            Object.assign(users[userIndex][dataKey], dataUpdates);
            users[userIndex][dataKey].updated_at = new Date().toISOString();
            
            // Save to localStorage
            localStorage.setItem('registeredUsers', JSON.stringify(users));
            
            console.log(`${dataKey} updated successfully`);
            return true;
        } catch (error) {
            console.error('Error updating type-specific data:', error);
            return false;
        }
    }

    // Get statistics for current user
    getStatistics() {
        const fullUser = this.getUserDetails();
        if (!fullUser) return null;
        
        const config = this.dashboardConfig[this.userType];
        const dataKey = config.dataKey;
        
        return fullUser[dataKey]?.statistics || config.defaultData.statistics;
    }

    // Logout user with confirmation
    logout(skipConfirmation = false) {
        if (!skipConfirmation && !confirm('Are you sure you want to logout?')) {
            return false;
        }
        
        console.log('Logging out user');
        this.clearSession();
        this.redirectToLogin();
        return true;
    }

    // Get user role display name
    getRoleDisplayName() {
        const config = this.getDashboardConfig();
        return config ? config.role : 'User';
    }

    // Check if current user is of specific type
    isUserType(type) {
        return this.userType === type;
    }

    // Get dashboard configuration
    getDashboardConfig() {
        return this.dashboardConfig[this.userType];
    }

    // Get user type-specific data
    getUserTypeData() {
        const fullUser = this.getUserDetails();
        if (!fullUser) return null;
        
        const config = this.dashboardConfig[this.userType];
        const dataKey = config.dataKey;
        
        return fullUser[dataKey] || null;
    }

    // Debug function
    debug() {
        console.log('=== DASHBOARD ROUTER DEBUG ===');
        console.log('Current User:', this.currentUser);
        console.log('User Type:', this.userType);
        console.log('Dashboard Config:', this.getDashboardConfig());
        console.log('Session Expired:', this.isSessionExpired());
        console.log('Current Path:', window.location.pathname);
        console.log('==============================');
    }
}

// Create global router instance
window.dashboardRouter = new DashboardRouter();

// Auto-initialize on DOM load if on a dashboard page
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const isDashboardPage = currentPath.includes('-dashboard') || 
                          currentPath.includes('dashboard.html');
    
    if (isDashboardPage) {
        console.log('Dashboard page detected, initializing router...');
        const success = window.dashboardRouter.init();
        
        if (success) {
            console.log('Dashboard router initialized successfully');
            
            // Make router available globally for dashboard scripts
            window.router = window.dashboardRouter;
            
            // Dispatch custom event for dashboard initialization
            window.dispatchEvent(new CustomEvent('dashboardReady', {
                detail: {
                    userType: window.dashboardRouter.userType,
                    config: window.dashboardRouter.getDashboardConfig()
                }
            }));
        }
    }
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function(event) {
    const isDashboardPage = window.location.pathname.includes('-dashboard') || 
                          window.location.pathname.includes('dashboard.html');
    
    if (isDashboardPage && window.dashboardRouter) {
        setTimeout(() => {
            window.dashboardRouter.init();
        }, 100);
    }
});

// Handle page visibility change (when user switches tabs)
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.dashboardRouter && window.dashboardRouter.currentUser) {
        // Check if session is still valid when user returns to tab
        if (window.dashboardRouter.isSessionExpired()) {
            console.log('Session expired while away, logging out');
            window.dashboardRouter.logout(true);
        }
    }
});

// Global error handler for router
window.addEventListener('error', function(event) {
    if (event.error && event.error.message && event.error.message.includes('dashboardRouter')) {
        console.error('Dashboard Router Error:', event.error);
        
        // Try to recover by reinitializing after a delay
        if (window.dashboardRouter) {
            setTimeout(() => {
                try {
                    window.dashboardRouter.init();
                } catch (retryError) {
                    console.error('Router recovery failed:', retryError);
                    window.dashboardRouter.redirectToLogin();
                }
            }, 1000);
        }
    }
});

// Make router functions globally available
window.logout = function() {
    if (window.dashboardRouter) {
        return window.dashboardRouter.logout();
    }
    return false;
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardRouter;
}