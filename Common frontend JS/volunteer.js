// Enhanced Volunteer Registration and Login JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
    });
  }
  
  // Initialize registered users in localStorage if not exists
  if (!localStorage.getItem('registeredUsers')) {
    localStorage.setItem('registeredUsers', JSON.stringify([]));
  }
  
  // Registration form validation and submission
  const volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    setupRegistrationForm(volunteerForm);
  }
  
  // Login form validation and submission
  const loginForm = document.getElementById('volunteer-login-form');
  if (loginForm) {
    setupLoginForm(loginForm);
  }
  
  // Add animation to benefit cards
  const benefitCards = document.querySelectorAll('.benefit-card');
  benefitCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.classList.add('fade-in');
  });
  
  // Check if user is already logged in
  function checkLoggedIn() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser && window.location.pathname.includes('/Common frontend HTML/volunteer-login.html')) {
      if (confirm('You are already logged in. Would you like to go to your dashboard?')) {
        window.location.href = '/Common frontend HTML/volunteer-dashboard.html';
      }
    }
  }
  
  checkLoggedIn();
});

// Registration form setup
function setupRegistrationForm(form) {
  // Multi-step form functionality
  const formSections = document.querySelectorAll('.form-section');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextButtons = document.querySelectorAll('.btn-next');
  const prevButtons = document.querySelectorAll('.btn-prev');
  
  let currentSection = 0;
  
  // Show current section
  function showSection(index) {
    formSections.forEach(section => section.classList.remove('active'));
    formSections[index].classList.add('active');
    
    progressSteps.forEach((step, i) => {
      if (i <= index) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }
  
  // Next button click handler
  nextButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Validate current section before proceeding
      if (validateSection(currentSection)) {
        if (currentSection < formSections.length - 1) {
          currentSection++;
          showSection(currentSection);
        }
      }
    });
  });
  
  // Previous button click handler
  prevButtons.forEach(button => {
    button.addEventListener('click', function() {
      if (currentSection > 0) {
        currentSection--;
        showSection(currentSection);
      }
    });
  });
  
  // Form validation for each section
  function validateSection(sectionIndex) {
    let isValid = true;
    const section = formSections[sectionIndex];
    
    // Section 1 validation (Personal Information)
    if (sectionIndex === 0) {
      isValid = validatePersonalInfoSection();
    }
    
    // Section 2 validation (Availability)
    if (sectionIndex === 1) {
      isValid = validateAvailabilitySection();
    }
    
    // Section 3 validation (Skills & Preferences)
    if (sectionIndex === 2) {
      isValid = validateSkillsSection();
    }
    
    return isValid;
  }
  
  // Validate personal information section
  function validatePersonalInfoSection() {
    let isValid = true;
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const dob = document.getElementById('dob');
    const address = document.getElementById('address');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    // Name validation - only alphabets and spaces
    if (!fullName.value.trim()) {
      showError('name-error', 'Please enter your full name');
      isValid = false;
    } else if (!isValidName(fullName.value)) {
      showError('name-error', 'Name should contain only alphabets and spaces');
      isValid = false;
    } else {
      hideError('name-error');
    }
    
    // Email validation
    if (!email.value.trim()) {
      showError('email-error', 'Please enter your email address');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError('email-error', 'Please enter a valid email address');
      isValid = false;
    } else {
      hideError('email-error');
    }
    
    // Phone validation - exactly 10 digits
    if (!phone.value.trim()) {
      showError('phone-error', 'Please enter your phone number');
      isValid = false;
    } else if (!isValidPhone(phone.value)) {
      showError('phone-error', 'Please enter a valid 10-digit phone number');
      isValid = false;
    } else {
      hideError('phone-error');
    }
    
    // Date of Birth validation
    if (!dob.value) {
      showError('dob-error', 'Please select your date of birth');
      isValid = false;
    } else {
      hideError('dob-error');
    }
    
    // Password validation
    if (!password.value.trim()) {
      showError('password-error', 'Please enter a password');
      isValid = false;
    } else if (!isValidPassword(password.value)) {
      showError('password-error', 'Password must be at least 6 characters long');
      isValid = false;
    } else {
      hideError('password-error');
    }
    
    // Confirm Password validation
    if (!confirmPassword.value.trim()) {
      showError('confirm-password-error', 'Please confirm your password');
      isValid = false;
    } else if (password.value !== confirmPassword.value) {
      showError('confirm-password-error', 'Passwords do not match');
      isValid = false;
    } else {
      hideError('confirm-password-error');
    }
    
    // Address validation
    if (!address.value.trim()) {
      showError('address-error', 'Please enter your address');
      isValid = false;
    } else {
      hideError('address-error');
    }
    
    return isValid;
  }
  
  // Validate availability section
  function validateAvailabilitySection() {
    let isValid = true;
    const daysChecked = document.querySelectorAll('input[name="days"]:checked');
    const hours = document.getElementById('hours');
    const area = document.getElementById('area');
    
    if (daysChecked.length === 0) {
      showError('days-error', 'Please select at least one available day');
      isValid = false;
    } else {
      hideError('days-error');
    }
    
    if (!hours.value) {
      showError('hours-error', 'Please select available hours per week');
      isValid = false;
    } else {
      hideError('hours-error');
    }
    
    if (!area.value) {
      showError('area-error', 'Please select a preferred service area');
      isValid = false;
    } else {
      hideError('area-error');
    }
    
    return isValid;
  }
  
  // Validate skills section
  function validateSkillsSection() {
    let isValid = true;
    const transportation = document.getElementById('transportation');
    
    if (!transportation.value) {
      showError('transportation-error', 'Please select your transportation method');
      isValid = false;
    } else {
      hideError('transportation-error');
    }
    
    return isValid;
  }
  
  // Form submission handler
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate all sections
    let allValid = true;
    for (let i = 0; i < formSections.length; i++) {
      if (!validateSection(i)) {
        allValid = false;
        showSection(i); // Show the section with errors
        break;
      }
    }
    
    if (allValid) {
      // Get form data
      const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value, // Store password for login
        dob: document.getElementById('dob').value,
        address: document.getElementById('address').value,
        days: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(cb => cb.value),
        hours: document.getElementById('hours').value,
        area: document.getElementById('area').value,
        transportation: document.getElementById('transportation').value,
        skills: Array.from(document.querySelectorAll('input[name="skills"]:checked')).map(cb => cb.value),
        experience: document.getElementById('experience').value,
        motivation: document.getElementById('motivation').value,
        registrationDate: new Date().toISOString()
      };
      
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('registeredUsers'));
      const userExists = users.some(user => user.email === formData.email);
      
      if (userExists) {
        showError('email-error', 'This email is already registered. Please use a different email or login.');
        showSection(0); // Go back to first section
        return;
      }
      
      // Simulate form submission
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        // Save user data to localStorage
        users.push(formData);
        localStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Show success message
        alert('Thank you for registering as a volunteer! We will contact you soon to complete the onboarding process.');
        
        // Redirect to login page after user clicks OK
        window.location.href = '/Common frontend HTML/volunteer-login.html';
        
        // Reset form
        form.reset();
        currentSection = 0;
        showSection(currentSection);
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 2000);
    }
  });
  
  // Add input validation for name field (only alphabets)
  const nameInput = document.getElementById('fullName');
  if (nameInput) {
    nameInput.addEventListener('input', function() {
      // Remove any non-alphabet characters (allow spaces)
      this.value = this.value.replace(/[^a-zA-Z\s]/g, '');
    });
  }
  
  // Add input validation for phone field (only numbers, max 10 digits)
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      // Remove any non-numeric characters
      this.value = this.value.replace(/\D/g, '');
      
      // Limit to 10 digits
      if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
      }
    });
  }
  
  // Real-time password confirmation validation
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirmPassword');
  
  if (passwordInput && confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      if (passwordInput.value !== this.value) {
        showError('confirm-password-error', 'Passwords do not match');
      } else {
        hideError('confirm-password-error');
      }
    });
  }
}

// Login form setup
function setupLoginForm(form) {
  // Form validation and submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateLoginForm()) {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('registeredUsers'));
      const user = users.find(u => u.email === email);
      
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        if (user) {
          // Verify password
          if (user.password === password) {
            // Store logged in user in sessionStorage (without password)
            const {password: _, ...userWithoutPassword} = user;
            sessionStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
            
            // Show success message
            alert('Login successful! Welcome back, ' + user.fullName);
            
            // Redirect to dashboard
            window.location.href = '/Common frontend HTML/volunteer-dashboard.html';
          } else {
            showError('login-password-error', 'Incorrect password');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
          }
        } else {
          showError('login-email-error', 'Email not registered. Please register first.');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      }, 1500);
    }
  });
  
  // Login form validation
  function validateLoginForm() {
    let isValid = true;
    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');
    
    // Email validation
    if (!email.value.trim()) {
      showError('login-email-error', 'Please enter your email address');
      isValid = false;
    } else if (!isValidEmail(email.value)) {
      showError('login-email-error', 'Please enter a valid email address');
      isValid = false;
    } else {
      hideError('login-email-error');
    }
    
    // Password validation
    if (!password.value.trim()) {
      showError('login-password-error', 'Please enter your password');
      isValid = false;
    } else {
      hideError('login-password-error');
    }
    
    return isValid;
  }
}

// Utility functions
function isValidName(name) {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
}

function isValidPassword(password) {
  return password.length >= 6;
}

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  }
}

function hideError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.style.display = 'none';
  }
}