<<<<<<< HEAD
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
=======
// Enhanced volunteer-dashboard.js - Handles comprehensive volunteer data from signup

document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Volunteer Dashboard page loading...');
    
    // Check authentication and user type
    if (!checkAuthentication() || !checkUserType('volunteer')) {
        return;
    }

    // Initialize volunteer dashboard
    initializeVolunteerDashboard();
    setupEventListeners();
});

function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) {
        console.log('No user session found, redirecting to login...');
        window.location.href = '/Common frontend HTML/login.html';
        return false;
    }
    console.log('User authenticated:', currentUser.name);
    return true;
}

function checkUserType(expectedType) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return false;
    
    const userType = currentUser.userType || (currentUser.is_volunteer ? 'volunteer' : 'donor');
    if (userType !== expectedType) {
        console.log(`User type mismatch. Expected: ${expectedType}, Got: ${userType}`);
        redirectToCorrectDashboard(userType);
        return false;
    }
    return true;
}

function redirectToCorrectDashboard(userType) {
    const dashboardUrls = {
        donor: '/Common frontend HTML/donor-dashboard.html',
        volunteer: '/Common frontend HTML/volunteer-dashboard.html',
        ngo: '/Common frontend HTML/ngo-dashboard.html'
    };
    
    const redirectUrl = dashboardUrls[userType] || '/Common frontend HTML/donor-dashboard.html';
    window.location.href = redirectUrl;
}

function initializeVolunteerDashboard() {
    console.log('Initializing enhanced volunteer dashboard...');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser) return;

    // Update user information
    updateUserProfile(currentUser);
    
    // Load volunteer statistics
    loadVolunteerStatistics(currentUser);
    
    // Load activity history
    loadActivityHistory(currentUser);
    
    // Load volunteer opportunities
    loadVolunteerOpportunities();
    
    console.log('Enhanced volunteer dashboard initialized successfully');
}

function updateUserProfile(user) {
    console.log('Updating enhanced volunteer profile display');
    
    // Update profile header
    const userName = document.getElementById('user-name');
    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    
    if (userName) userName.textContent = user.name;
    if (avatarPlaceholder) {
        avatarPlaceholder.textContent = user.name.charAt(0).toUpperCase();
    }
    
    // Update basic profile information
    const userEmail = document.getElementById('user-email');
    const userMobile = document.getElementById('user-mobile');
    const userAddress = document.getElementById('user-address');
    const memberSince = document.getElementById('member-since');
    const volunteerSkills = document.getElementById('volunteer-skills');
    const volunteerAvailability = document.getElementById('volunteer-availability');
    const preferredLocation = document.getElementById('preferred-location');
    const volunteerStatus = document.getElementById('volunteer-status');
    
    // New enhanced fields
    const volunteerSpecialization = document.getElementById('volunteer-specialization');
    const volunteerExperience = document.getElementById('volunteer-experience');
    const volunteerCommitment = document.getElementById('volunteer-commitment');
    const volunteerTransportation = document.getElementById('volunteer-transportation');
    
    if (userEmail) userEmail.textContent = user.email;
    if (userMobile) userMobile.textContent = user.mobile;
    if (userAddress) userAddress.textContent = user.address;
    
    // Get full user data for additional info
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const fullUser = users.find(u => u.user_id === user.user_id);
    
    if (memberSince && fullUser && fullUser.registration_date) {
        const regDate = new Date(fullUser.registration_date);
        memberSince.textContent = regDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else if (memberSince) {
        memberSince.textContent = 'Recently joined';
    }
    
    // Update volunteer-specific fields (enhanced from signup.js)
    if (fullUser && fullUser.volunteer_data) {
        const volData = fullUser.volunteer_data;
        
        // Basic fields
        if (volunteerSkills) volunteerSkills.textContent = volData.skills || user.skills || 'Not specified';
        if (volunteerAvailability) volunteerAvailability.textContent = volData.availability || user.availability || 'Not specified';
        if (preferredLocation) preferredLocation.textContent = volData.preferred_location || 'Not specified';
        if (volunteerStatus) volunteerStatus.textContent = volData.status || 'Active';
        
        // Enhanced fields from comprehensive signup
        if (volunteerSpecialization) {
            volunteerSpecialization.textContent = formatSpecialization(volData.specialization) || 'Not specified';
        }
        if (volunteerExperience) {
            volunteerExperience.textContent = formatExperienceLevel(volData.experience_level) || 'Not specified';
        }
        if (volunteerCommitment) {
            volunteerCommitment.textContent = formatTimeCommitment(volData.time_commitment) || 'Not specified';
        }
        if (volunteerTransportation) {
            volunteerTransportation.textContent = formatTransportation(volData.transportation) || 'Not specified';
        }
    } else {
        // Fallback to user session data
        if (volunteerSkills) volunteerSkills.textContent = user.skills || 'Not specified';
        if (volunteerAvailability) volunteerAvailability.textContent = user.availability || 'Not specified';
        if (volunteerSpecialization) volunteerSpecialization.textContent = 'Not specified';
        if (volunteerExperience) volunteerExperience.textContent = 'Not specified';
        if (volunteerCommitment) volunteerCommitment.textContent = 'Not specified';
        if (volunteerTransportation) volunteerTransportation.textContent = 'Not specified';
    }
    
    // Update edit form with current values
    updateEditForm(user, fullUser);
}

function updateEditForm(user, fullUser) {
    const editName = document.getElementById('edit-name');
    const editEmail = document.getElementById('edit-email');
    const editMobile = document.getElementById('edit-mobile');
    const editAddress = document.getElementById('edit-address');
    const editSkills = document.getElementById('edit-skills');
    const editAvailability = document.getElementById('edit-availability');
    const editLocation = document.getElementById('edit-location');
    const editSpecialization = document.getElementById('edit-specialization');
    
    if (editName) editName.value = user.name;
    if (editEmail) editEmail.value = user.email;
    if (editMobile) editMobile.value = user.mobile;
    if (editAddress) editAddress.value = user.address;
    
    if (fullUser && fullUser.volunteer_data) {
        const volData = fullUser.volunteer_data;
        if (editSkills) editSkills.value = volData.skills || user.skills || '';
        if (editAvailability) editAvailability.value = volData.availability || user.availability || '';
        if (editLocation) editLocation.value = volData.preferred_location || '';
        if (editSpecialization) editSpecialization.value = volData.specialization || '';
    } else {
        if (editSkills) editSkills.value = user.skills || '';
        if (editAvailability) editAvailability.value = user.availability || '';
        if (editLocation) editLocation.value = '';
        if (editSpecialization) editSpecialization.value = '';
    }
}

// Format helper functions for enhanced fields
function formatSpecialization(spec) {
    const specializations = {
        healthcare: 'Healthcare & Medical Support',
        education: 'Education & Tutoring',
        elderly_care: 'Elderly Care & Assistance',
        child_care: 'Child Care & Development',
        disaster_relief: 'Disaster Relief & Emergency Response',
        environmental: 'Environmental & Conservation',
        food_distribution: 'Food Distribution & Nutrition',
        transport: 'Transportation & Logistics',
        technology: 'Technology & Digital Literacy',
        fundraising: 'Fundraising & Event Management',
        counseling: 'Counseling & Mental Health Support',
        other: 'Other'
    };
    return specializations[spec] || spec;
}

function formatExperienceLevel(level) {
    const levels = {
        beginner: 'New to volunteering',
        some: 'Some experience (1-2 years)',
        experienced: 'Experienced (3-5 years)',
        expert: 'Very experienced (5+ years)'
    };
    return levels[level] || level;
}

function formatTimeCommitment(commitment) {
    const commitments = {
        occasional: 'Occasional (1-2 hours/week)',
        regular: 'Regular (3-5 hours/week)',
        committed: 'Committed (6-10 hours/week)',
        intensive: 'Intensive (10+ hours/week)'
    };
    return commitments[commitment] || commitment;
}

function formatTransportation(transport) {
    const transports = {
        none: 'No personal transportation',
        bicycle: 'Bicycle',
        two_wheeler: 'Two-wheeler',
        car: 'Car',
        public: 'Public transport only'
    };
    return transports[transport] || transport;
}

function loadVolunteerStatistics(user) {
    console.log('Loading volunteer statistics');
    
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const fullUser = users.find(u => u.user_id === user.user_id);
    
    let stats = {
        hours_volunteered: 0,
        events_participated: 0,
        people_helped: 0,
        rating: 5.0
    };
    
    if (fullUser && fullUser.volunteer_data && fullUser.volunteer_data.statistics) {
        stats = { ...stats, ...fullUser.volunteer_data.statistics };
    }
    
    // Update statistics display
    const hoursVolunteered = document.getElementById('hours-volunteered');
    const eventsParticipated = document.getElementById('events-participated');
    const peopleHelped = document.getElementById('people-helped');
    const volunteerRating = document.getElementById('volunteer-rating');
    
    if (hoursVolunteered) hoursVolunteered.textContent = stats.hours_volunteered;
    if (eventsParticipated) eventsParticipated.textContent = stats.events_participated;
    if (peopleHelped) peopleHelped.textContent = stats.people_helped;
    if (volunteerRating) volunteerRating.textContent = stats.rating.toFixed(1);
}

function loadActivityHistory(user) {
    console.log('Loading volunteer activity history');
    
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const fullUser = users.find(u => u.user_id === user.user_id);
    
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    let activities = [];
    if (fullUser && fullUser.volunteer_data && fullUser.volunteer_data.activities) {
        activities = fullUser.volunteer_data.activities;
    }
    
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="no-activities">
                <p>No activities recorded yet. Start volunteering to see your impact!</p>
            </div>
        `;
        return;
    }
    
    // Sort activities by date (newest first)
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    activities.slice(0, 5).forEach(activity => { // Show only latest 5
        html += `
            <div class="activity-item">
                <div class="activity-icon">${getActivityIcon(activity.type)}</div>
                <div class="activity-details">
                    <h4>${getActivityTypeLabel(activity.type)}</h4>
                    <p>${activity.description || 'No description'}</p>
                    <div class="activity-meta">
                        <span><i class="fas fa-calendar"></i> ${new Date(activity.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-clock"></i> ${activity.hours_worked}h</span>
                        ${activity.people_helped ? `<span><i class="fas fa-users"></i> ${activity.people_helped} people</span>` : ''}
                        ${activity.organization ? `<span><i class="fas fa-building"></i> ${activity.organization}</span>` : ''}
                        ${activity.location ? `<span><i class="fas fa-map-marker-alt"></i> ${activity.location}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    if (activities.length > 5) {
        html += `<p class="view-all"><a href="#" onclick="viewAllActivities()">View all ${activities.length} activities</a></p>`;
    }
    
    activityList.innerHTML = html;
}

function loadVolunteerOpportunities() {
    console.log('Loading volunteer opportunities');
    
    const opportunitiesList = document.getElementById('opportunities-list');
    if (!opportunitiesList) return;
    
    // Sample opportunities (in real app, this would come from backend)
    const sampleOpportunities = [
        {
            id: 1,
            title: 'Blood Drive Volunteer',
            organization: 'Red Cross Mumbai',
            date: '2025-09-20',
            location: 'Mumbai Central',
            type: 'blood_drive',
            description: 'Help organize blood donation camp and assist donors'
        },
        {
            id: 2,
            title: 'Food Distribution',
            organization: 'Feeding India',
            date: '2025-09-18',
            location: 'Pune',
            type: 'food_distribution',
            description: 'Distribute meals to underprivileged communities'
        },
        {
            id: 3,
            title: 'Medical Camp Assistant',
            organization: 'CareConnect Health',
            date: '2025-09-25',
            location: 'Nashik',
            type: 'medical_assistance',
            description: 'Assist doctors in free medical camp'
        },
        {
            id: 4,
            title: 'Environmental Cleanup',
            organization: 'Clean Mumbai Initiative',
            date: '2025-09-22',
            location: 'Marine Drive, Mumbai',
            type: 'environmental',
            description: 'Beach cleanup and awareness drive'
        }
    ];
    
    let html = '';
    sampleOpportunities.forEach(opportunity => {
        html += `
            <div class="opportunity-item">
                <div class="opportunity-icon">${getActivityIcon(opportunity.type)}</div>
                <div class="opportunity-details">
                    <h4>${opportunity.title}</h4>
                    <p>${opportunity.description}</p>
                    <div class="opportunity-meta">
                        <span><i class="fas fa-building"></i> ${opportunity.organization}</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(opportunity.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${opportunity.location}</span>
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="applyForOpportunity(${opportunity.id})">Apply</button>
                </div>
            </div>
        `;
    });
    
    opportunitiesList.innerHTML = html;
}

function getActivityIcon(type) {
    const icons = {
        blood_drive: '<i class="fas fa-tint" style="color: #e74c3c;"></i>',
        food_distribution: '<i class="fas fa-utensils" style="color: #f39c12;"></i>',
        medical_assistance: '<i class="fas fa-user-md" style="color: #3498db;"></i>',
        disaster_relief: '<i class="fas fa-exclamation-triangle" style="color: #e67e22;"></i>',
        education: '<i class="fas fa-graduation-cap" style="color: #9b59b6;"></i>',
        community_service: '<i class="fas fa-home" style="color: #1abc9c;"></i>',
        elderly_care: '<i class="fas fa-user-friends" style="color: #95a5a6;"></i>',
        environmental: '<i class="fas fa-leaf" style="color: #27ae60;"></i>',
        other: '<i class="fas fa-handshake" style="color: #34495e;"></i>'
    };
    return icons[type] || icons.other;
}

function getActivityTypeLabel(type) {
    const labels = {
        blood_drive: 'Blood Drive',
        food_distribution: 'Food Distribution',
        medical_assistance: 'Medical Assistance',
        disaster_relief: 'Disaster Relief',
        education: 'Education Support',
        community_service: 'Community Service',
        elderly_care: 'Elderly Care',
        environmental: 'Environmental Work',
        other: 'Other Activity'
    };
    return labels[type] || 'Volunteer Activity';
}

function setupEventListeners() {
    console.log('Setting up volunteer dashboard event listeners...');
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
    
    // Activity form submission
    const activityForm = document.getElementById('activityForm');
    if (activityForm) {
        activityForm.addEventListener('submit', handleActivitySubmission);
    }
    
    console.log('Event listeners set up successfully');
}

function handleProfileUpdate(e) {
    e.preventDefault();
    console.log('Enhanced volunteer profile update form submitted');
    
    const formData = new FormData(e.target);
    const updatedData = {
        name: formData.get('name').trim(),
        email: formData.get('email').trim().toLowerCase(),
        address: formData.get('address').trim(),
        skills: formData.get('skills').trim(),
        availability: formData.get('availability'),
        preferred_location: formData.get('preferred_location').trim(),
        specialization: formData.get('specialization')
    };
    
    // Validate the updated data
    if (!validateProfileUpdate(updatedData)) {
        return;
    }
    
    // Update volunteer profile
    updateVolunteerProfile_localStorage(updatedData);
}

function validateProfileUpdate(data) {
    const messageDiv = document.getElementById('message');
    
    // Clear previous messages
    if (messageDiv) {
        messageDiv.className = 'message hidden';
        messageDiv.innerHTML = '';
    }
    
    // Validate name
    if (!data.name || data.name.length < 2) {
        showMessage('Name must be at least 2 characters long', 'error');
        return false;
    }
    
    // Validate email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address', 'error');
        return false;
    }
    
    // Validate address
    if (!data.address || data.address.length < 10) {
        showMessage('Please enter a complete address (minimum 10 characters)', 'error');
        return false;
    }
    
    return true;
}

function updateVolunteerProfile_localStorage(updatedData) {
    console.log('Updating enhanced volunteer profile in localStorage');
    
    try {
        // Get current user session
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser) return;
        
        // Get all registered users
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = users.findIndex(u => u.user_id === currentUser.user_id);
        
        if (userIndex === -1) {
            showMessage('User not found', 'error');
            return;
        }
        
        // Initialize volunteer_data if not exists
        if (!users[userIndex].volunteer_data) {
            users[userIndex].volunteer_data = {
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
            };
        }
        
        // Update user data
        users[userIndex].name = updatedData.name;
        users[userIndex].email = updatedData.email;
        users[userIndex].address = updatedData.address;
        users[userIndex].skills = updatedData.skills;
        users[userIndex].availability = updatedData.availability;
        
        // Update volunteer-specific data
        users[userIndex].volunteer_data.skills = updatedData.skills;
        users[userIndex].volunteer_data.availability = updatedData.availability;
        users[userIndex].volunteer_data.preferred_location = updatedData.preferred_location;
        users[userIndex].volunteer_data.specialization = updatedData.specialization;
        users[userIndex].volunteer_data.updated_at = new Date().toISOString();
        
        // Update current session
        currentUser.name = updatedData.name;
        currentUser.email = updatedData.email;
        currentUser.address = updatedData.address;
        currentUser.skills = updatedData.skills;
        currentUser.availability = updatedData.availability;
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUserProfile(currentUser);
        
        showMessage('Profile updated successfully!', 'success');
        console.log('Enhanced volunteer profile updated successfully');
        
    } catch (error) {
        console.error('Error updating volunteer profile:', error);
        showMessage('Failed to update profile. Please try again.', 'error');
    }
}

function handleActivitySubmission(e) {
    e.preventDefault();
    console.log('Activity record form submitted');
    
    const formData = new FormData(e.target);
    const activityData = {
        type: formData.get('activity_type'),
        date: formData.get('activity_date'),
        hours_worked: parseFloat(formData.get('hours_worked')),
        people_helped: parseInt(formData.get('people_helped')) || 0,
        organization: formData.get('organization').trim(),
        location: formData.get('location').trim(),
        description: formData.get('description').trim()
    };
    
    // Validate activity data
    if (!validateActivityData(activityData)) {
        return;
    }
    
    // Add activity record
    addActivityRecord_localStorage(activityData);
}

function validateActivityData(data) {
    const messageDiv = document.getElementById('message');
    
    // Clear previous messages
    if (messageDiv) {
        messageDiv.className = 'message hidden';
        messageDiv.innerHTML = '';
    }
    
    // Validate required fields
    if (!data.type) {
        showMessage('Activity type is required', 'error');
        return false;
    }
    
    if (!data.date) {
        showMessage('Activity date is required', 'error');
        return false;
    }
    
    if (!data.hours_worked || data.hours_worked <= 0) {
        showMessage('Please enter valid hours worked', 'error');
        return false;
    }
    
    // Validate date is not in future
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    if (selectedDate > today) {
        showMessage('Activity date cannot be in the future', 'error');
        return false;
    }
    
    return true;
}

function addActivityRecord_localStorage(activityData) {
    console.log('Adding activity record to localStorage');
    
    try {
        // Get current user session
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!currentUser) return;
        
        // Get all registered users
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = users.findIndex(u => u.user_id === currentUser.user_id);
        
        if (userIndex === -1) {
            showMessage('User not found', 'error');
            return;
        }
        
        // Initialize volunteer_data if not exists
        if (!users[userIndex].volunteer_data) {
            users[userIndex].volunteer_data = {
                skills: '',
                availability: '',
                preferred_location: '',
                status: 'Active',
                statistics: {
                    hours_volunteered: 0,
                    events_participated: 0,
                    people_helped: 0,
                    rating: 5.0
                },
                activities: []
            };
        }
        
        // Create activity record
        const activity = {
            id: 'ACT_' + Date.now(),
            type: activityData.type,
            date: activityData.date,
            hours_worked: activityData.hours_worked,
            people_helped: activityData.people_helped,
            organization: activityData.organization,
            location: activityData.location,
            description: activityData.description,
            created_at: new Date().toISOString()
        };
        
        // Add to activities array
        users[userIndex].volunteer_data.activities.push(activity);
        
        // Update statistics
        const stats = users[userIndex].volunteer_data.statistics;
        stats.hours_volunteered += activityData.hours_worked;
        stats.events_participated += 1;
        stats.people_helped += activityData.people_helped;
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Update UI
        loadVolunteerStatistics(currentUser);
        loadActivityHistory(currentUser);
        
        // Hide form and show success message
        hideActivityForm();
        showMessage('Activity record added successfully!', 'success');
        console.log('Activity record added successfully');
        
    } catch (error) {
        console.error('Error adding activity record:', error);
        showMessage('Failed to add activity record. Please try again.', 'error');
    }
}

// Utility functions
function addActivityRecord() {
    console.log('Showing add activity form');
    const formSection = document.getElementById('add-activity-section');
    if (formSection) {
        formSection.classList.remove('hidden');
        formSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function cancelActivity() {
    console.log('Cancelling activity form');
    hideActivityForm();
}

function hideActivityForm() {
    const formSection = document.getElementById('add-activity-section');
    if (formSection) {
        formSection.classList.add('hidden');
    }
    
    // Clear form
    const activityForm = document.getElementById('activityForm');
    if (activityForm) {
        activityForm.reset();
    }
}

function viewAllActivities() {
    console.log('Viewing all activities');
    alert('Feature coming soon: View all activities in detail');
}

function applyForOpportunity(opportunityId) {
    console.log('Applying for opportunity:', opportunityId);
    showMessage('Application submitted! You will be contacted soon.', 'success');
}

function cancelEdit() {
    console.log('Cancelling profile edit');
    
    // Reset form to original values
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        updateEditForm(currentUser, null);
    }
    
    // Clear any error messages
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'message hidden';
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
        messageDiv.classList.remove('hidden');
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.className = 'message hidden';
        }, 5000);
    }
    console.log(`${type.toUpperCase()}: ${message}`);
>>>>>>> b38bb18 (UPDATED)
}

// Logout function
function logout() {
<<<<<<< HEAD
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
=======
    console.log('Logout function called');
    
    if (confirm('Are you sure you want to logout?')) {
        console.log('User confirmed logout');
        localStorage.removeItem('currentUser');
        showMessage('Logged out successfully. Redirecting to login page...', 'success');
        
        setTimeout(() => {
            console.log('Redirecting to login page...');
            window.location.href = '/Common frontend HTML/login.html';
        }, 1500);
    } else {
        console.log('User cancelled logout');
    }
}

// Global functions
window.logout = logout;
window.addActivityRecord = addActivityRecord;
window.cancelActivity = cancelActivity;
window.cancelEdit = cancelEdit;
window.viewAllActivities = viewAllActivities;
window.applyForOpportunity = applyForOpportunity;
>>>>>>> b38bb18 (UPDATED)
