// signup.js - Enhanced Signup functionality with integrated comprehensive volunteer registration
// Updated to include streamlined volunteer signup process

document.addEventListener('DOMContentLoaded', function() {
    const messageDiv = document.getElementById('message');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Check if user is already logged in - if yes, redirect to dashboard
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
        console.log('User already logged in, redirecting to dashboard');
        redirectToCorrectDashboard(currentUser.userType);
        return;
    }

    console.log('Signup page loaded successfully');

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and forms
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Show corresponding form
            const targetForm = document.getElementById(`${tabId}Form`);
            if (targetForm) {
                targetForm.classList.add('active');
            }
            
            // Clear any previous messages
            if (messageDiv) {
                messageDiv.className = 'hidden';
                messageDiv.innerHTML = '';
            }
            
            // Initialize form-specific enhancements
            if (tabId === 'volunteer') {
                initializeVolunteerFormEnhancements();
            }
            
            console.log('Switched to tab:', tabId);
        });
    });

    // Form submission handlers
    const donorForm = document.getElementById('donorForm');
    const volunteerForm = document.getElementById('volunteerForm');
    const ngoForm = document.getElementById('ngoForm');

    if (donorForm) {
        donorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup('donor');
        });
    }

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleVolunteerSignup();
        });
    }

    if (ngoForm) {
        ngoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSignup('ngo');
        });
    }

    // Initialize form enhancements on load
    initializeFormEnhancements();
});

// Enhanced volunteer signup handler
function handleVolunteerSignup() {
    console.log('Volunteer signup submitted with enhanced validation');
    
    // Get comprehensive form data
    const formData = extractVolunteerFormData();
    console.log('Volunteer form data collected:', { ...formData, password: '***' });

    // Comprehensive validation
    if (!validateVolunteerSignup(formData)) {
        return;
    }

    // Check if user already exists
    if (checkUserExists(formData.mobile, formData.email)) {
        return;
    }

    // Process volunteer registration
    registerVolunteerUser(formData);
}

function extractVolunteerFormData() {
    const baseData = {
        name: document.getElementById('volunteerName').value.trim(),
        email: document.getElementById('volunteerEmail').value.trim().toLowerCase(),
        mobile: document.getElementById('volunteerMobile').value.trim(),
        address: document.getElementById('volunteerAddress').value.trim(),
        password: document.getElementById('volunteerPassword').value,
        skills: document.getElementById('volunteerSkills').value.trim(),
        availability: document.getElementById('volunteerAvailability').value
    };

    // Get enhanced volunteer fields if they exist
    const enhancedData = {};
    
    const specializationField = document.getElementById('volunteerSpecialization');
    if (specializationField) {
        enhancedData.specialization = specializationField.value;
        enhancedData.experience_level = document.getElementById('volunteerExperience')?.value || 'beginner';
        enhancedData.time_commitment = document.getElementById('volunteerCommitment')?.value || '';
        enhancedData.preferred_location = document.getElementById('preferredLocation')?.value.trim() || '';
        enhancedData.transportation = document.getElementById('transportationMode')?.value || 'none';
        enhancedData.emergency_contact = document.getElementById('emergencyContact')?.value.trim() || '';
        enhancedData.emergency_phone = document.getElementById('emergencyPhone')?.value.trim() || '';
        enhancedData.background_check_consent = document.getElementById('backgroundCheck')?.checked || false;
        enhancedData.data_sharing_consent = document.getElementById('dataSharing')?.checked || false;
        
        // Get detailed availability if custom was selected
        const detailedAvailability = document.querySelector('input[name="detailed_availability"]');
        if (detailedAvailability) {
            enhancedData.detailed_availability = JSON.parse(detailedAvailability.value);
        }
    }

    return {
        ...baseData,
        ...enhancedData,
        userType: 'volunteer'
    };
}

function validateVolunteerSignup(data) {
    console.log('Validating comprehensive volunteer signup data');
    
    // Clear previous messages and error states
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'hidden';
        messageDiv.innerHTML = '';
    }
    clearErrorMessages();
    resetInputStyles();

    let isValid = true;

    // Basic field validation (reusing existing logic but enhanced)
    if (!validateBasicVolunteerFields(data)) {
        isValid = false;
    }

    // Enhanced fields validation (only if enhanced form is loaded)
    if (document.getElementById('volunteerSpecialization')) {
        if (!validateEnhancedVolunteerFields(data)) {
            isValid = false;
        }
    }

    console.log('Volunteer signup validation result:', isValid);
    return isValid;
}

function validateBasicVolunteerFields(data) {
    let isValid = true;

    // Name validation
    if (!data.name || data.name.length < 2) {
        showFieldError('volunteerNameError', 'Name must be at least 2 characters long');
        isValid = false;
    } else if (!/^[a-zA-Z\s.''-]+$/.test(data.name)) {
        showFieldError('volunteerNameError', 'Name can only contain letters, spaces, and common punctuation');
        isValid = false;
    } else if (data.name.length > 50) {
        showFieldError('volunteerNameError', 'Name cannot exceed 50 characters');
        isValid = false;
    } else {
        clearFieldError('volunteerNameError');
    }

    // Email validation
    if (!data.email) {
        showFieldError('volunteerEmailError', 'Email address is required');
        isValid = false;
    } else {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(data.email)) {
            showFieldError('volunteerEmailError', 'Please enter a valid email address');
            isValid = false;
        } else if (data.email.length > 100) {
            showFieldError('volunteerEmailError', 'Email cannot exceed 100 characters');
            isValid = false;
        } else {
            clearFieldError('volunteerEmailError');
        }
    }

    // Mobile number validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!data.mobile) {
        showFieldError('volunteerMobileError', 'Mobile number is required');
        isValid = false;
    } else if (!mobileRegex.test(data.mobile)) {
        showFieldError('volunteerMobileError', 'Please enter a valid 10-digit Indian mobile number starting with 6-9');
        isValid = false;
    } else {
        clearFieldError('volunteerMobileError');
    }

    // Address validation
    if (!data.address) {
        showFieldError('volunteerAddressError', 'Address is required');
        isValid = false;
    } else if (data.address.length < 10) {
        showFieldError('volunteerAddressError', 'Please enter a complete address (minimum 10 characters)');
        isValid = false;
    } else if (data.address.length > 200) {
        showFieldError('volunteerAddressError', 'Address cannot exceed 200 characters');
        isValid = false;
    } else {
        clearFieldError('volunteerAddressError');
    }

    // Password validation
    if (!data.password) {
        showFieldError('volunteerPasswordError', 'Password is required');
        isValid = false;
    } else if (data.password.length < 6) {
        showFieldError('volunteerPasswordError', 'Password must be at least 6 characters long');
        isValid = false;
    } else if (data.password.length > 50) {
        showFieldError('volunteerPasswordError', 'Password cannot exceed 50 characters');
        isValid = false;
    } else if (!/[a-zA-Z]/.test(data.password)) {
        showFieldError('volunteerPasswordError', 'Password must contain at least one letter');
        isValid = false;
    } else if (!/\d/.test(data.password)) {
        showFieldError('volunteerPasswordError', 'Password must contain at least one number');
        isValid = false;
    } else {
        const commonPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123'];
        if (commonPasswords.includes(data.password.toLowerCase())) {
            showFieldError('volunteerPasswordError', 'This password is too common. Please choose a stronger password');
            isValid = false;
        } else {
            clearFieldError('volunteerPasswordError');
        }
    }

    // Skills validation (optional but if provided, should be meaningful)
    if (data.skills && data.skills.length > 0 && data.skills.length < 10) {
        showFieldError('volunteerSkillsError', 'Please provide a more detailed description of your skills');
        isValid = false;
    } else {
        clearFieldError('volunteerSkillsError');
    }

    return isValid;
}

function validateEnhancedVolunteerFields(data) {
    let isValid = true;

    // Specialization validation
    if (!data.specialization) {
        showFieldError('volunteerSpecializationError', 'Please select your primary specialization');
        isValid = false;
    } else {
        clearFieldError('volunteerSpecializationError');
    }

    // Time commitment validation
    if (!data.time_commitment) {
        showFieldError('volunteerCommitmentError', 'Please select your time commitment');
        isValid = false;
    } else {
        clearFieldError('volunteerCommitmentError');
    }

    // Preferred location validation
    if (!data.preferred_location || data.preferred_location.length < 3) {
        showFieldError('preferredLocationError', 'Please specify your preferred service location (minimum 3 characters)');
        isValid = false;
    } else {
        clearFieldError('preferredLocationError');
    }

    // Emergency phone validation (if provided)
    if (data.emergency_phone && data.emergency_phone.length > 0) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(data.emergency_phone)) {
            showFieldError('emergencyPhoneError', 'Please enter a valid 10-digit phone number');
            isValid = false;
        } else {
            clearFieldError('emergencyPhoneError');
        }
    } else {
        clearFieldError('emergencyPhoneError');
    }

    return isValid;
}

function registerVolunteerUser(data) {
    console.log('Starting comprehensive volunteer user registration');
    
    // Show loading state
    setLoadingState(true, 'volunteer');

    // Simulate API call delay
    setTimeout(() => {
        try {
            // Get existing users
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            // Create comprehensive volunteer user object
            const newUser = createComprehensiveVolunteerUser(data);

            console.log('New volunteer user object created:', { ...newUser, password: '***' });

            // Add to users array
            existingUsers.push(newUser);
            
            // Save to localStorage
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
            console.log('Volunteer user saved to localStorage. Total users:', existingUsers.length);
            
            // Show success message
            setLoadingState(false, 'volunteer');
            showSuccess('Volunteer registration successful! Welcome to the CareConnect volunteer community. You can now login to access your dashboard.');
            
            // Clear form
            document.getElementById('volunteerForm').reset();
            
            // Track registration
            if (window.CareConnect && window.CareConnect.analytics) {
                window.CareConnect.analytics.trackEvent('volunteer_registered', {
                    specialization: data.specialization || 'not_specified',
                    experience_level: data.experience_level || 'beginner',
                    time_commitment: data.time_commitment || 'not_specified',
                    registration_source: 'integrated_signup'
                });
            }
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                console.log('Redirecting to login page...');
                window.location.href = '/Common frontend HTML/login.html';
            }, 3000);
            
        } catch (error) {
            console.error('Volunteer registration error:', error);
            setLoadingState(false, 'volunteer');
            showError('Registration failed. Please try again.');
        }
    }, 1500);
}

function createComprehensiveVolunteerUser(data) {
    const userId = generateUserId();
    
    const baseUser = {
        user_id: userId,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        address: data.address,
        password: data.password, // In real app, this would be hashed
        userType: 'volunteer',
        is_volunteer: true,
        is_ngo: false,
        registration_date: new Date().toISOString(),
        last_login: null,
        
        // Basic volunteer info
        skills: data.skills || '',
        availability: data.availability || ''
    };

    // Add enhanced volunteer data if available
    if (data.specialization) {
        baseUser.volunteer_data = {
            specialization: data.specialization,
            experience_level: data.experience_level || 'beginner',
            time_commitment: data.time_commitment,
            preferred_location: data.preferred_location,
            transportation: data.transportation || 'none',
            emergency_contact: data.emergency_contact || '',
            emergency_phone: data.emergency_phone || '',
            background_check_consent: data.background_check_consent || false,
            data_sharing_consent: data.data_sharing_consent || false,
            detailed_availability: data.detailed_availability || null,
            
            // Status fields
            status: 'active',
            verification_status: 'pending',
            profile_completion: calculateProfileCompletion(data),
            onboarding_completed: false,
            
            // Statistics
            statistics: {
                hours_volunteered: 0,
                events_participated: 0,
                people_helped: 0,
                rating: 5.0,
                tasks_completed: 0,
                reliability_score: 100
            },
            
            // Activity tracking
            activities: [],
            certifications: [],
            training_completed: [],
            
            // Preferences
            notification_preferences: {
                email_opportunities: true,
                sms_reminders: true,
                push_notifications: true,
                weekly_digest: true
            },
            
            // Metadata
            registration_source: 'integrated_signup',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    } else {
        // Basic volunteer data for legacy compatibility
        baseUser.volunteer_data = {
            skills: data.skills || '',
            availability: data.availability || '',
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

    return baseUser;
}

function calculateProfileCompletion(data) {
    const requiredFields = ['name', 'email', 'mobile', 'address', 'specialization', 'time_commitment'];
    const optionalFields = ['skills', 'preferred_location', 'transportation', 'emergency_contact'];
    
    let completed = 0;
    let total = requiredFields.length;
    
    // Check required fields
    requiredFields.forEach(field => {
        if (data[field] && data[field].toString().trim()) {
            completed++;
        }
    });
    
    // Add bonus for optional fields
    optionalFields.forEach(field => {
        if (data[field] && data[field].toString().trim()) {
            completed += 0.5;
            total += 0.5;
        }
    });
    
    return Math.round((completed / total) * 100);
}

// Enhanced form initialization
function initializeVolunteerFormEnhancements() {
    // Only enhance if not already enhanced
    if (document.getElementById('volunteerSpecialization')) {
        return; // Already enhanced
    }
    
    const volunteerForm = document.getElementById('volunteerForm');
    if (!volunteerForm) return;
    
    // Add enhanced fields after the availability field
    const availabilityGroup = volunteerForm.querySelector('#volunteerAvailability')?.parentNode;
    if (availabilityGroup) {
        const enhancedFieldsHTML = `
            <div class="form-group">
                <label for="volunteerSpecialization">Primary Specialization *</label>
                <select id="volunteerSpecialization" name="specialization" required>
                    <option value="">Choose your primary area</option>
                    <option value="healthcare">Healthcare & Medical Support</option>
                    <option value="education">Education & Tutoring</option>
                    <option value="elderly_care">Elderly Care & Assistance</option>
                    <option value="child_care">Child Care & Development</option>
                    <option value="disaster_relief">Disaster Relief & Emergency Response</option>
                    <option value="environmental">Environmental & Conservation</option>
                    <option value="food_distribution">Food Distribution & Nutrition</option>
                    <option value="transport">Transportation & Logistics</option>
                    <option value="technology">Technology & Digital Literacy</option>
                    <option value="fundraising">Fundraising & Event Management</option>
                    <option value="counseling">Counseling & Mental Health Support</option>
                    <option value="other">Other</option>
                </select>
                <div class="error-text" id="volunteerSpecializationError"></div>
            </div>

            <div class="form-group">
                <label for="volunteerExperience">Volunteer Experience Level</label>
                <select id="volunteerExperience" name="experience_level">
                    <option value="beginner">New to volunteering</option>
                    <option value="some">Some experience (1-2 years)</option>
                    <option value="experienced">Experienced (3-5 years)</option>
                    <option value="expert">Very experienced (5+ years)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="volunteerCommitment">Time Commitment *</label>
                <select id="volunteerCommitment" name="time_commitment" required>
                    <option value="">Select your availability</option>
                    <option value="occasional">Occasional (1-2 hours/week)</option>
                    <option value="regular">Regular (3-5 hours/week)</option>
                    <option value="committed">Committed (6-10 hours/week)</option>
                    <option value="intensive">Intensive (10+ hours/week)</option>
                </select>
                <div class="error-text" id="volunteerCommitmentError"></div>
            </div>

            <div class="form-group">
                <label for="preferredLocation">Preferred Service Location *</label>
                <input type="text" id="preferredLocation" name="preferred_location" 
                       placeholder="e.g., Mumbai Central, Pune Camp, etc." required>
                <div class="error-text" id="preferredLocationError"></div>
            </div>

            <div class="form-group">
                <label for="transportationMode">Transportation Available</label>
                <select id="transportationMode" name="transportation">
                    <option value="none">No personal transportation</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="two_wheeler">Two-wheeler</option>
                    <option value="car">Car</option>
                    <option value="public">Public transport only</option>
                </select>
            </div>

            <div class="form-group">
                <label for="emergencyContact">Emergency Contact Name</label>
                <input type="text" id="emergencyContact" name="emergency_contact" 
                       placeholder="Full name of emergency contact">
            </div>

            <div class="form-group">
                <label for="emergencyPhone">Emergency Contact Phone</label>
                <input type="tel" id="emergencyPhone" name="emergency_phone" 
                       placeholder="10-digit phone number" maxlength="10">
                <div class="error-text" id="emergencyPhoneError"></div>
            </div>

            <div class="form-group checkbox-group">
                <label class="checkbox-container">
                    <input type="checkbox" id="backgroundCheck" name="background_check_consent">
                    <span class="checkmark"></span>
                    I consent to background verification for volunteer activities
                </label>
            </div>

            <div class="form-group checkbox-group">
                <label class="checkbox-container">
                    <input type="checkbox" id="dataSharing" name="data_sharing_consent">
                    <span class="checkmark"></span>
                    I allow sharing my profile with partner NGOs for opportunities
                </label>
            </div>
        `;
        
        availabilityGroup.insertAdjacentHTML('afterend', enhancedFieldsHTML);
        
        // Add input formatting for emergency phone
        const emergencyPhoneInput = document.getElementById('emergencyPhone');
        if (emergencyPhoneInput) {
            emergencyPhoneInput.addEventListener('input', function(e) {
                // Remove any non-digit characters and limit to 10 digits
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                e.target.value = value;
            });
        }
    }
}

function initializeFormEnhancements() {
    // Initialize mobile number formatting for all forms
    const mobileInputs = document.querySelectorAll('input[type="tel"]');
    mobileInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            e.target.value = value;
        });

        input.addEventListener('keypress', function(e) {
            const char = String.fromCharCode(e.which);
            if (!/[0-9]/.test(char)) {
                e.preventDefault();
            }
        });
    });

    // Real-time validation feedback for all inputs
    const allInputs = document.querySelectorAll('input, textarea, select');
    allInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('invalid')) {
                this.classList.remove('invalid');
                this.style.borderColor = '#e1e5e9';
                this.style.backgroundColor = '#fafbfc';
                
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        });

        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
            this.style.backgroundColor = 'white';
        });
    });
}

// Regular signup handler for donor and NGO (unchanged from original)
function handleSignup(userType) {
    console.log(`${userType} signup submitted`);
    
    const formData = extractFormData(userType);
    console.log('Form data collected:', { ...formData, password: '***' });

    if (!validateSignup(formData, userType)) {
        return;
    }

    if (checkUserExists(formData.mobile, formData.email)) {
        return;
    }

    registerUser(formData, userType);
}

// Keep all existing functions from original signup.js intact
function extractFormData(userType) {
    const data = {
        name: document.getElementById(`${userType}Name`).value.trim(),
        email: document.getElementById(`${userType}Email`).value.trim().toLowerCase(),
        mobile: document.getElementById(`${userType}Mobile`).value.trim(),
        address: document.getElementById(`${userType}Address`).value.trim(),
        password: document.getElementById(`${userType}Password`).value,
        userType: userType
    };

    if (userType === 'ngo') {
        data.registration = document.getElementById('ngoRegistration').value.trim();
        data.focus = document.getElementById('ngoFocus').value.trim();
    }

    return data;
}

function validateSignup(data, userType) {
    console.log('Validating signup data for:', userType);
    
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'hidden';
        messageDiv.innerHTML = '';
    }
    clearErrorMessages();
    resetInputStyles();

    let isValid = true;

    // Name validation
    if (!data.name || data.name.length < 2) {
        showFieldError(`${userType}NameError`, 'Name must be at least 2 characters long');
        isValid = false;
    } else if (!/^[a-zA-Z\s.''-]+$/.test(data.name)) {
        showFieldError(`${userType}NameError`, 'Name can only contain letters, spaces, and common punctuation');
        isValid = false;
    } else if (data.name.length > 50) {
        showFieldError(`${userType}NameError`, 'Name cannot exceed 50 characters');
        isValid = false;
    } else {
        clearFieldError(`${userType}NameError`);
    }

    // Email validation
    if (!data.email) {
        showFieldError(`${userType}EmailError`, 'Email address is required');
        isValid = false;
    } else {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(data.email)) {
            showFieldError(`${userType}EmailError`, 'Please enter a valid email address');
            isValid = false;
        } else if (data.email.length > 100) {
            showFieldError(`${userType}EmailError`, 'Email cannot exceed 100 characters');
            isValid = false;
        } else {
            clearFieldError(`${userType}EmailError`);
        }
    }

    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!data.mobile) {
        showFieldError(`${userType}MobileError`, 'Mobile number is required');
        isValid = false;
    } else if (!mobileRegex.test(data.mobile)) {
        showFieldError(`${userType}MobileError`, 'Please enter a valid 10-digit Indian mobile number starting with 6-9');
        isValid = false;
    } else {
        clearFieldError(`${userType}MobileError`);
    }

    // Address validation
    if (!data.address) {
        showFieldError(`${userType}AddressError`, 'Address is required');
        isValid = false;
    } else if (data.address.length < 10) {
        showFieldError(`${userType}AddressError`, 'Please enter a complete address (minimum 10 characters)');
        isValid = false;
    } else if (data.address.length > 200) {
        showFieldError(`${userType}AddressError`, 'Address cannot exceed 200 characters');
        isValid = false;
    } else {
        clearFieldError(`${userType}AddressError`);
    }

    // Password validation
    if (!data.password) {
        showFieldError(`${userType}PasswordError`, 'Password is required');
        isValid = false;
    } else if (data.password.length < 6) {
        showFieldError(`${userType}PasswordError`, 'Password must be at least 6 characters long');
        isValid = false;
    } else if (data.password.length > 50) {
        showFieldError(`${userType}PasswordError`, 'Password cannot exceed 50 characters');
        isValid = false;
    } else if (!/[a-zA-Z]/.test(data.password)) {
        showFieldError(`${userType}PasswordError`, 'Password must contain at least one letter');
        isValid = false;
    } else if (!/\d/.test(data.password)) {
        showFieldError(`${userType}PasswordError`, 'Password must contain at least one number');
        isValid = false;
    } else {
        const commonPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123'];
        if (commonPasswords.includes(data.password.toLowerCase())) {
            showFieldError(`${userType}PasswordError`, 'This password is too common. Please choose a stronger password');
            isValid = false;
        } else {
            clearFieldError(`${userType}PasswordError`);
        }
    }

    // NGO specific validation
    if (userType === 'ngo') {
        if (!data.registration) {
            showFieldError('ngoRegistrationError', 'Registration number is required');
            isValid = false;
        } else if (data.registration.length < 5) {
            showFieldError('ngoRegistrationError', 'Registration number must be at least 5 characters');
            isValid = false;
        } else {
            clearFieldError('ngoRegistrationError');
        }

        if (!data.focus) {
            showFieldError('ngoFocusError', 'Focus area is required');
            isValid = false;
        } else if (data.focus.length < 10) {
            showFieldError('ngoFocusError', 'Please provide a detailed description of your focus areas');
            isValid = false;
        } else {
            clearFieldError('ngoFocusError');
        }
    }

    console.log('Signup validation result:', isValid);
    return isValid;
}

function checkUserExists(mobile, email) {
    console.log('Checking if user exists:', mobile, email);
    
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const mobileExists = existingUsers.some(user => user.mobile === mobile);
    if (mobileExists) {
        showError('This mobile number is already registered. Please use a different number or login.');
        return true;
    }

    const emailExists = existingUsers.some(user => user.email === email);
    if (emailExists) {
        showError('This email address is already registered. Please use a different email or login.');
        return true;
    }

    return false;
}

function registerUser(data, userType) {
    console.log('Starting user registration process for:', userType);
    
    setLoadingState(true, userType);

    setTimeout(() => {
        try {
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            
            const newUser = {
                user_id: generateUserId(),
                name: data.name,
                email: data.email,
                mobile: data.mobile,
                address: data.address,
                password: data.password,
                userType: userType,
                is_volunteer: userType === 'volunteer',
                is_ngo: userType === 'ngo',
                registration_date: new Date().toISOString(),
                last_login: null
            };

            if (userType === 'ngo') {
                newUser.registration_number = data.registration;
                newUser.focus_areas = data.focus || '';
                newUser.ngo_data = {
                    verification_status: 'pending',
                    status: 'active',
                    campaigns_created: 0,
                    funds_raised: 0,
                    volunteers_managed: 0,
                    rating: 5.0,
                    activities: [],
                    certifications: []
                };
            } else if (userType === 'donor') {
                newUser.donor_data = {
                    total_donated: 0,
                    donations_count: 0,
                    preferred_causes: [],
                    donation_history: [],
                    status: 'active',
                    verification_status: 'verified'
                };
            }

            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
            
            setLoadingState(false, userType);
            showSuccess(`Registration successful as ${userType}! Redirecting to login page...`);
            
            document.getElementById(`${userType}Form`).reset();
            
            setTimeout(() => {
                window.location.href = '/Common frontend HTML/login.html';
            }, 3000);
            
        } catch (error) {
            console.error('Registration error:', error);
            setLoadingState(false, userType);
            showError('Registration failed. Please try again.');
        }
    }, 1500);
}

function generateUserId() {
    return 'USER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function showError(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'message error';
        messageDiv.innerHTML = `<i class="error-icon">⚠️</i> ${message}`;
        messageDiv.classList.remove('hidden');
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            if (messageDiv.classList.contains('error')) {
                messageDiv.className = 'hidden';
            }
        }, 7000);
    }
}

function showSuccess(message) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.className = 'message success';
        messageDiv.innerHTML = `<i class="success-icon">✅</i> ${message}`;
        messageDiv.classList.remove('hidden');
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showFieldError(elementId, message) {
    const field = document.getElementById(elementId.replace('Error', ''));
    const errorElement = document.getElementById(elementId);
    
    if (field && errorElement) {
        field.classList.add('invalid');
        field.style.borderColor = '#ff6b6b';
        field.style.backgroundColor = '#ffebee';
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
        errorElement.style.color = '#ff6b6b';
        
        if (!document.querySelector('.invalid:focus')) {
            field.focus();
        }
    }
}

function clearFieldError(elementId) {
    const field = document.getElementById(elementId.replace('Error', ''));
    const errorElement = document.getElementById(elementId);
    
    if (field) {
        field.classList.remove('invalid');
        field.style.borderColor = '#e1e5e9';
        field.style.backgroundColor = '#fafbfc';
    }
    
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.innerHTML = '';
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-text');
    errorElements.forEach(element => {
        element.innerHTML = '';
        element.style.display = 'none';
    });
}

function resetInputStyles() {
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.classList.remove('invalid', 'valid');
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    });
}

function setLoadingState(loading, userType) {
    const submitButton = document.querySelector(`#${userType}Form button[type="submit"]`);
    if (!submitButton) return;
    
    if (loading) {
        submitButton.disabled = true;
        submitButton.classList.add('btn-loading');
        submitButton.innerHTML = '⏳ Registering...';
    } else {
        submitButton.disabled = false;
        submitButton.classList.remove('btn-loading');
        submitButton.textContent = `Sign Up as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`;
    }
}

function validateSingleField(input) {
    const value = input.value.trim();
    const fieldName = input.name || input.id;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error state
    input.classList.remove('invalid', 'valid');
    input.style.borderColor = '#e1e5e9';
    input.style.backgroundColor = '#fafbfc';

    if (!value && input.hasAttribute('required')) {
        errorMessage = `${getFieldDisplayName(fieldName)} is required`;
        isValid = false;
    } else if (value) {
        // Field-specific validation
        switch (true) {
            case fieldName.includes('name') || fieldName.includes('Name'):
                if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                } else if (!/^[a-zA-Z\s.''-]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters, spaces, and common punctuation';
                    isValid = false;
                } else if (value.length > 50) {
                    errorMessage = 'Name cannot exceed 50 characters';
                    isValid = false;
                }
                break;

            case fieldName.includes('email') || fieldName.includes('Email'):
                const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (value.length > 100) {
                    errorMessage = 'Email cannot exceed 100 characters';
                    isValid = false;
                }
                break;

            case fieldName.includes('mobile') || fieldName.includes('Mobile') || fieldName.includes('phone') || fieldName.includes('Phone'):
                const phoneRegex = /^[6-9]\d{9}$/;
                if (!phoneRegex.test(value)) {
                    errorMessage = 'Please enter a valid 10-digit phone number starting with 6-9';
                    isValid = false;
                }
                break;

            case fieldName.includes('address') || fieldName.includes('Address'):
                if (value.length < 10) {
                    errorMessage = 'Please enter a complete address (minimum 10 characters)';
                    isValid = false;
                } else if (value.length > 200) {
                    errorMessage = 'Address cannot exceed 200 characters';
                    isValid = false;
                }
                break;

            case fieldName.includes('password') || fieldName.includes('Password'):
                if (value.length < 6) {
                    errorMessage = 'Password must be at least 6 characters long';
                    isValid = false;
                } else if (value.length > 50) {
                    errorMessage = 'Password cannot exceed 50 characters';
                    isValid = false;
                } else if (!/[a-zA-Z]/.test(value)) {
                    errorMessage = 'Password must contain at least one letter';
                    isValid = false;
                } else if (!/\d/.test(value)) {
                    errorMessage = 'Password must contain at least one number';
                    isValid = false;
                } else {
                    const commonPasswords = ['123456', 'password', '123456789', 'qwerty', 'abc123'];
                    if (commonPasswords.includes(value.toLowerCase())) {
                        errorMessage = 'This password is too common. Please choose a stronger password';
                        isValid = false;
                    }
                }
                break;

            case fieldName.includes('skills') || fieldName.includes('Skills'):
                if (value.length > 0 && value.length < 10) {
                    errorMessage = 'Please provide a more detailed description of your skills';
                    isValid = false;
                }
                break;

            case fieldName.includes('registration') || fieldName.includes('Registration'):
                if (value.length < 5) {
                    errorMessage = 'Registration number must be at least 5 characters';
                    isValid = false;
                }
                break;

            case fieldName.includes('focus') || fieldName.includes('Focus'):
                if (value.length < 10) {
                    errorMessage = 'Please provide a detailed description of your focus areas';
                    isValid = false;
                }
                break;

            case fieldName.includes('preferred_location') || fieldName.includes('preferredLocation'):
                if (value.length < 3) {
                    errorMessage = 'Please specify your preferred service location (minimum 3 characters)';
                    isValid = false;
                }
                break;
        }
    }

    // Apply validation result
    if (isValid && value) {
        input.classList.add('valid');
        input.style.borderColor = '#28a745';
        input.style.backgroundColor = '#f8fff8';
    } else if (!isValid) {
        input.classList.add('invalid');
        input.style.borderColor = '#ff6b6b';
        input.style.backgroundColor = '#ffebee';

        // Show error message
        const errorElementId = input.id + 'Error';
        const errorElement = document.getElementById(errorElementId);
        if (errorElement && errorMessage) {
            errorElement.innerHTML = errorMessage;
            errorElement.style.display = 'block';
            errorElement.style.color = '#ff6b6b';
        }
    }

    return isValid;
}

function getFieldDisplayName(fieldName) {
    const displayNames = {
        'name': 'Name',
        'email': 'Email',
        'mobile': 'Mobile number',
        'address': 'Address',
        'password': 'Password',
        'skills': 'Skills',
        'registration': 'Registration number',
        'focus': 'Focus areas',
        'specialization': 'Specialization',
        'time_commitment': 'Time commitment',
        'preferred_location': 'Preferred location',
        'emergency_contact': 'Emergency contact',
        'emergency_phone': 'Emergency phone'
    };

    // Extract base field name
    const baseName = fieldName.replace(/^(donor|volunteer|ngo)/, '').toLowerCase();
    return displayNames[baseName] || fieldName;
}

// Utility function for dashboard redirect (should be implemented based on your routing)
function redirectToCorrectDashboard(userType) {
    const dashboardUrls = {
        'donor': '/Donor frontend HTML/donor_dashboard.html',
        'volunteer': '/Volunteer frontend HTML/volunteer_dashboard.html',
        'ngo': '/NGO frontend HTML/ngo_dashboard.html'
    };

    const redirectUrl = dashboardUrls[userType] || '/Common frontend HTML/login.html';
    console.log(`Redirecting ${userType} to:`, redirectUrl);
    window.location.href = redirectUrl;
}

// Additional utility functions for enhanced functionality
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Password strength indicator (optional enhancement)
function checkPasswordStrength(password) {
    let strength = 0;
    const checks = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password)
    };

    strength = Object.values(checks).filter(Boolean).length;

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return {
        score: strength,
        level: strengthLevels[Math.min(strength, 4)],
        checks: checks
    };
}

// Form auto-save functionality (optional)
function enableAutoSave() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', debounce(() => {
                saveFormData(form.id, input.id, input.value);
            }, 1000));
        });
    });
}

function saveFormData(formId, fieldId, value) {
    try {
        const savedData = JSON.parse(localStorage.getItem(`formDraft_${formId}`) || '{}');
        savedData[fieldId] = value;
        savedData.lastSaved = new Date().toISOString();
        localStorage.setItem(`formDraft_${formId}`, JSON.stringify(savedData));
    } catch (error) {
        console.warn('Could not save form data:', error);
    }
}

function loadFormData(formId) {
    try {
        const savedData = JSON.parse(localStorage.getItem(`formDraft_${formId}`) || '{}');
        Object.keys(savedData).forEach(fieldId => {
            if (fieldId !== 'lastSaved') {
                const field = document.getElementById(fieldId);
                if (field && savedData[fieldId]) {
                    field.value = savedData[fieldId];
                }
            }
        });
    } catch (error) {
        console.warn('Could not load form data:', error);
    }
}

function clearFormData(formId) {
    try {
        localStorage.removeItem(`formDraft_${formId}`);
    } catch (error) {
        console.warn('Could not clear form data:', error);
    }
}