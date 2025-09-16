// login.js - Fixed and Enhanced Login functionality

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page initializing...');
    
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    // Check if required elements exist
    if (!loginForm) {
        console.error('Login form not found. Make sure the form has id="loginForm"');
        return;
    }

    if (!messageDiv) {
        console.error('Message div not found. Make sure there is a div with id="message"');
        return;
    }

    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        console.log('User already logged in, redirecting to dashboard');
        const userType = determineUserType(currentUser);
        redirectToCorrectDashboard(userType);
        return;
    }

    console.log('Login page loaded successfully');

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');
        
        const mobileInput = document.getElementById('mobile');
        const passwordInput = document.getElementById('password');

        if (!mobileInput || !passwordInput) {
            console.error('Mobile or password input not found');
            showError('Form elements not found. Please refresh the page.');
            return;
        }

        const mobile = mobileInput.value.trim();
        const password = passwordInput.value;

        console.log('Attempting login for mobile:', mobile);

        // Validate inputs
        if (!validateLogin(mobile, password)) {
            return;
        }

        // Attempt login
        loginUser(mobile, password);
    });

    function validateLogin(mobile, password) {
        console.log('Validating login inputs');
        
        // Clear previous messages
        clearMessages();

        // Validate mobile number
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobile) {
            showError('Mobile number is required');
            focusField('mobile');
            return false;
        }
        if (!mobileRegex.test(mobile)) {
            showError('Please enter a valid 10-digit mobile number starting with 6-9');
            focusField('mobile');
            return false;
        }

        // Validate password
        if (!password) {
            showError('Password is required');
            focusField('password');
            return false;
        }
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            focusField('password');
            return false;
        }

        console.log('Login validation passed');
        return true;
    }

    function loginUser(mobile, password) {
        console.log('Starting login process for mobile:', mobile);
        
        // Show loading state
        setLoadingState(true);

        // Small delay to show loading state
        setTimeout(() => {
            try {
                // Get registered users from localStorage
                const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                console.log('Total registered users:', users.length);
                
                // Find user by mobile
                const user = users.find(u => u.mobile === mobile);
                
                if (!user) {
                    console.log('User not found for mobile:', mobile);
                    setLoadingState(false);
                    showError('Mobile number not registered. Please register first.');
                    focusField('mobile');
                    return;
                }

                console.log('User found:', user.name);

                // Check password (in real app, this would be hashed and compared securely)
                if (user.password !== password) {
                    console.log('Invalid password for user:', user.name);
                    setLoadingState(false);
                    showError('Invalid password. Please try again.');
                    focusField('password');
                    return;
                }

                // Login successful
                console.log('Login successful for user:', user.name);
                
                // Determine user type for display and routing
                const userType = determineUserType(user);
                const userTypeDisplay = getUserTypeDisplay(userType);
                
                setLoadingState(false);
                showSuccess(`Welcome back, ${userTypeDisplay}! Redirecting to dashboard...`);
                
                // Update last login time
                user.last_login = new Date().toISOString();
                
                // Update user in storage
                const userIndex = users.findIndex(u => u.mobile === mobile);
                users[userIndex] = user;
                localStorage.setItem('registeredUsers', JSON.stringify(users));
                
                // Store current user session with enhanced data
                const userSession = createUserSession(user, userType);
                localStorage.setItem('currentUser', JSON.stringify(userSession));
                
                console.log('User session created:', { ...userSession, password: undefined });
                
                // Clear form
                loginForm.reset();
                
                // Redirect to appropriate dashboard after 2 seconds
                setTimeout(() => {
                    console.log('Redirecting to dashboard...');
                    redirectToCorrectDashboard(userType);
                }, 2000);
                
            } catch (error) {
                console.error('Login error:', error);
                setLoadingState(false);
                showError('Login failed. Please try again.');
            }
        }, 800); // Slightly longer delay to show loading state
    }

    // Determine user type based on user data
    function determineUserType(user) {
        console.log('Determining user type for:', user.name);
        
        // Priority 1: Check explicit userType field
        if (user.userType && ['donor', 'volunteer', 'ngo'].includes(user.userType)) {
            return user.userType;
        }
        // Priority 2: Check flags
        else if (user.is_ngo === true || user.registration_number) {
            return 'ngo';
        }
        else if (user.is_volunteer === true || user.volunteer_data || user.skills) {
            return 'volunteer';
        }
        // Priority 3: Default to donor
        else {
            return 'donor';
        }
    }

    // Get user type display label
    function getUserTypeDisplay(userType) {
        const labels = {
            donor: 'Donor',
            volunteer: 'Volunteer',
            ngo: 'NGO'
        };
        return labels[userType] || 'User';
    }

    // Create comprehensive user session object
    function createUserSession(user, userType) {
        const session = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address,
            userType: userType,
            is_volunteer: user.is_volunteer || false,
            is_ngo: user.is_ngo || false,
            loginTime: new Date().toISOString(),
            sessionId: generateSessionId()
        };

        // Add type-specific data to session
        if (user.skills) session.skills = user.skills;
        if (user.availability) session.availability = user.availability;
        if (user.registration_number) session.registration_number = user.registration_number;
        if (user.focus_areas) session.focus_areas = user.focus_areas;
        if (user.organization_name) session.organization_name = user.organization_name;
        
        return session;
    }

    // Generate unique session ID
    function generateSessionId() {
        return 'SESSION_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Redirect to correct dashboard based on user type
    function redirectToCorrectDashboard(userType) {
        console.log('Redirecting to dashboard for user type:', userType);
        
        const dashboardUrls = {
            donor: '/Common frontend HTML/dashboard.html', // Using generic dashboard for donors
            volunteer: '/Common frontend HTML/volunteer-dashboard.html',
            ngo: '/Common frontend HTML/ngo-dashboard.html'
        };
        
        const redirectUrl = dashboardUrls[userType] || dashboardUrls.donor;
        console.log('Redirect URL:', redirectUrl);
        window.location.href = redirectUrl;
    }

    function clearMessages() {
        if (messageDiv) {
            messageDiv.className = 'hidden';
            messageDiv.innerHTML = '';
        }
    }

    function showError(message) {
        console.log('Showing error:', message);
        if (messageDiv) {
            messageDiv.className = 'message error';
            messageDiv.innerHTML = `<i class="error-icon">⚠️</i> ${message}`;
            messageDiv.classList.remove('hidden');
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Auto-hide error after 6 seconds
            setTimeout(() => {
                if (messageDiv.className.includes('error')) {
                    messageDiv.className = 'hidden';
                }
            }, 6000);
        }
    }

    function showSuccess(message) {
        console.log('Showing success:', message);
        if (messageDiv) {
            messageDiv.className = 'message success';
            messageDiv.innerHTML = `<i class="success-icon">✅</i> ${message}`;
            messageDiv.classList.remove('hidden');
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function focusField(fieldName) {
        const field = document.getElementById(fieldName);
        if (field) {
            setTimeout(() => {
                field.focus();
                field.style.borderColor = '#ff6b6b';
                field.style.backgroundColor = '#ffebee';
                
                // Reset border color after focus
                setTimeout(() => {
                    field.style.borderColor = '';
                    field.style.backgroundColor = '';
                }, 3000);
            }, 100);
        }
    }

    function setLoadingState(loading) {
        const submitButton = loginForm.querySelector('button[type="submit"]');
        if (!submitButton) {
            console.error('Submit button not found');
            return;
        }
        
        if (loading) {
            submitButton.disabled = true;
            submitButton.classList.add('btn-loading');
            submitButton.innerHTML = '<span class="loading-spinner"></span> Logging in...';
            console.log('Loading state: ON');
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('btn-loading');
            submitButton.innerHTML = 'Login';
            console.log('Loading state: OFF');
        }
    }

    // Mobile number input formatting and validation
    const mobileInput = document.getElementById('mobile');
    if (mobileInput) {
        mobileInput.addEventListener('input', function(e) {
            // Remove any non-digit characters
            let value = e.target.value.replace(/\D/g, '');
            
            // Limit to 10 digits
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            e.target.value = value;
            
            // Real-time validation feedback
            if (value.length > 0) {
                const mobileRegex = /^[6-9]\d{9}$/;
                if (value.length === 10 && mobileRegex.test(value)) {
                    e.target.style.borderColor = '#28a745';
                    e.target.style.backgroundColor = '#f8fff8';
                } else if (value.length === 10) {
                    e.target.style.borderColor = '#ff6b6b';
                    e.target.style.backgroundColor = '#ffebee';
                } else {
                    e.target.style.borderColor = '';
                    e.target.style.backgroundColor = '';
                }
            }
        });

        // Prevent non-numeric input
        mobileInput.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char)) {
                e.preventDefault();
            }
        });

        // Handle paste events
        mobileInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                e.target.value = value;
            }, 0);
        });
    }

    // Password field enhancements
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                loginForm.dispatchEvent(new Event('submit'));
            }
        });

        // Real-time password validation feedback
        passwordInput.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value.length >= 6) {
                e.target.style.borderColor = '#28a745';
                e.target.style.backgroundColor = '#f8fff8';
            } else if (value.length > 0) {
                e.target.style.borderColor = '#ffc107';
                e.target.style.backgroundColor = '#fffbf0';
            } else {
                e.target.style.borderColor = '';
                e.target.style.backgroundColor = '';
            }
        });
    }

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Clear form and messages on escape
            if (confirm('Clear login form?')) {
                loginForm.reset();
                clearMessages();
                if (mobileInput) {
                    mobileInput.focus();
                }
            }
        }
    });

    // Auto-focus first input field
    if (mobileInput) {
        mobileInput.focus();
    }

    // Add loading styles
    const style = document.createElement('style');
    style.textContent = `
        .btn-loading {
            position: relative;
            color: transparent !important;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .message {
            padding: 12px 16px;
            border-radius: 6px;
            margin: 16px 0;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .message.error {
            background-color: #fee;
            color: #c53030;
            border: 1px solid #feb2b2;
        }
        
        .message.success {
            background-color: #f0fff4;
            color: #2f855a;
            border: 1px solid #9ae6b4;
        }
        
        .message.hidden {
            display: none;
        }
        
        input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
    `;
    document.head.appendChild(style);

    // Debugging: Check localStorage data
    console.log('=== LOGIN DEBUG INFO ===');
    console.log('Registered users count:', JSON.parse(localStorage.getItem('registeredUsers') || '[]').length);
    console.log('Current user:', JSON.parse(localStorage.getItem('currentUser') || 'null'));
    console.log('========================');
});

// Enhanced utility functions for global access
function isLoggedIn() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser !== null && currentUser !== 'null';
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (error) {
        console.error('Error parsing current user:', error);
        return null;
    }
}

function getCurrentUserType() {
    const user = getCurrentUser();
    if (!user) return null;
    return user.userType || (user.is_volunteer ? 'volunteer' : (user.is_ngo ? 'ngo' : 'donor'));
}

function logoutUser() {
    console.log('Logging out user...');
    
    // Clear all user data
    localStorage.removeItem('currentUser');
    sessionStorage.clear();
    
    console.log('User logged out, redirecting to login...');
    window.location.href = '/Common frontend HTML/login.html';
}

function checkAuthentication() {
    if (!isLoggedIn()) {
        console.log('User not authenticated, redirecting to login...');
        window.location.href = '/Common frontend HTML/login.html';
        return false;
    }
    
    // Check if session is expired (24 hours)
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.loginTime) {
        const loginTime = new Date(currentUser.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
            console.log('Session expired, logging out');
            logoutUser();
            return false;
        }
    }
    
    return true;
}

// Global logout function that can be called from anywhere
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        logoutUser();
    }
}

// Function to redirect to appropriate dashboard
function redirectToDashboard() {
    const userType = getCurrentUserType();
    const dashboardUrls = {
        donor: '/Common frontend HTML/dashboard.html',
        volunteer: '/Common frontend HTML/volunteer-dashboard.html',
        ngo: '/Common frontend HTML/ngo-dashboard.html'
    };
    
    const redirectUrl = dashboardUrls[userType] || dashboardUrls.donor;
    window.location.href = redirectUrl;
}

// Debug function to check localStorage
function debugStorage() {
    console.log('=== DEBUGGING LOGIN STORAGE ===');
    console.log('Registered Users:', localStorage.getItem('registeredUsers'));
    console.log('Current User:', localStorage.getItem('currentUser'));
    console.log('All localStorage keys:', Object.keys(localStorage));
    
    const currentUser = getCurrentUser();
    if (currentUser) {
        console.log('Current User Type:', getCurrentUserType());
        console.log('Session ID:', currentUser.sessionId);
    }
    console.log('================================');
}

// Function to clear all app data (for development/testing)
function clearAllData() {
    if (confirm('This will clear all app data including registered users. Are you sure?')) {
        localStorage.clear();
        sessionStorage.clear();
        console.log('All app data cleared');
        window.location.reload();
    }
}

// Make functions globally available
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.getCurrentUserType = getCurrentUserType;
window.logout = logout;
window.logoutUser = logoutUser;
window.debugStorage = debugStorage;
window.clearAllData = clearAllData;
window.redirectToDashboard = redirectToDashboard;
window.checkAuthentication = checkAuthentication;