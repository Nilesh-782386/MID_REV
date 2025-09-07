// Dashboard Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    // Update dashboard based on login status
    updateDashboard(currentUser);
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Profile link functionality
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        profileLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (!currentUser) {
                alert('Please log in to view your profile');
                window.location.href = '/Common frontend HTML/volunteer-login.html';
            } else {
                alert('Redirecting to your profile page...');
            }
        });
    }
});

// Get current user from session storage
function getCurrentUser() {
    const userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

// Update dashboard based on user login status
function updateDashboard(user) {
    const dashboardContent = document.getElementById('dashboard-content');
    const welcomeMessage = document.getElementById('welcome-message');
    
    if (user) {
        welcomeMessage.innerHTML = `Welcome back, <span class="user-name">${user.fullName}</span>! Here's your current volunteer overview.`;
        dashboardContent.innerHTML = generateDashboardContent(user);
        initializeDashboardFeatures();
    } else {
        welcomeMessage.textContent = 'Please log in to access your dashboard';
        dashboardContent.innerHTML = `
            <div class="login-prompt">
                <h2><i class="fas fa-lock"></i> Authentication Required</h2>
                <p>You need to be logged in to view your volunteer dashboard.</p>
                <a href="volunteer-login.html" class="btn"><i class="fas fa-sign-in-alt"></i> Login Now</a>
            </div>
        `;
    }
}

// Generate dashboard content based on user data
function generateDashboardContent(user) {
    const completedTasks = user.completedTasks || 0;
    const pendingTasks = user.pendingTasks || 0;
    const rewardPoints = user.rewardPoints || 0;
    const volunteerHours = user.volunteerHours || 0;
    
    return `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon completed"><i class="fas fa-check-circle"></i></div>
                <div class="stat-info"><h3>Completed Tasks</h3><p class="stat-number">${completedTasks}</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon pending"><i class="fas fa-clock"></i></div>
                <div class="stat-info"><h3>Pending Tasks</h3><p class="stat-number">${pendingTasks}</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon points"><i class="fas fa-star"></i></div>
                <div class="stat-info"><h3>Reward Points</h3><p class="stat-number">${rewardPoints}</p></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon hours"><i class="fas fa-hourglass-half"></i></div>
                <div class="stat-info"><h3>Volunteer Hours</h3><p class="stat-number">${volunteerHours}</p></div>
            </div>
        </div>
        
        <div class="dashboard-tabs">
            <button class="tab-btn active" data-tab="requests">Pickup Requests</button>
            <button class="tab-btn" data-tab="accepted">Accepted Tasks</button>
            <button class="tab-btn" data-tab="history">Task History</button>
            <button class="tab-btn" data-tab="profile">My Profile</button>
        </div>
        
        <div class="tab-content active" id="requests-tab">
            <h2><i class="fas fa-list"></i> Available Pickup Requests</h2>
            <p>These are the available pickup requests in your area (${user.area || 'All Districts'}).</p>
        </div>
        
        <div class="tab-content" id="accepted-tab">
            <h2><i class="fas fa-clipboard-check"></i> Your Accepted Tasks</h2>
            <p>You have ${pendingTasks} pending tasks to complete.</p>
        </div>
        
        <div class="tab-content" id="history-tab">
            <h2><i class="fas fa-history"></i> Your Task History</h2>
            <p>You've completed ${completedTasks} tasks so far.</p>
        </div>
        
        <div class="tab-content" id="profile-tab">
            <h2><i class="fas fa-user"></i> Your Profile</h2>
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-top: 20px;">
                <p><strong>Name:</strong> ${user.fullName}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone}</p>
                <p><strong>Area:</strong> ${user.area || 'Not specified'}</p>
                <p><strong>Availability:</strong> ${user.availability || 'Not specified'}</p>
                <p><strong>Skills:</strong> ${user.skills ? user.skills.join(', ') : 'None specified'}</p>
            </div>
        </div>
    `;
}

// Initialize dashboard features
function initializeDashboardFeatures() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('currentUser');
        window.location.reload();
    }
}

// SIMULATED USER DATA
function simulateLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        const demoUser = {
            fullName: "Sarah Johnson",
            email: "sarah.j@example.com",
            phone: "(555) 123-4567",
            area: "North District",
            availability: "Weekends, 5-10 hours/week",
            skills: ["Driving", "First Aid", "Communication"],
            completedTasks: 24,
            pendingTasks: 3,
            rewardPoints: 1250,
            volunteerHours: 62
        };
        sessionStorage.setItem('currentUser', JSON.stringify(demoUser));
        window.location.href = window.location.pathname;
    }
}
simulateLogin();
