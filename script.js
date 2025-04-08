gsap.registerPlugin(ScrollToPlugin);


// DOM Elements
const app = document.getElementById('app');
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');
const loginButton = document.getElementById('loginButton');
const loginModal = document.getElementById('loginModal');
const closeLoginModal = document.getElementById('closeLoginModal');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const loadingScreen = document.getElementById('loadingScreen');
const navLinks = document.querySelectorAll('.nav-link');
const togglePasswordButtons = document.querySelectorAll('.toggle-password');
const backToTop = document.getElementById('backToTop');
const modalContent = document.getElementById('modalContent');

// Initialize Three.js
function initThreeJS() {
  const canvas = document.getElementById('threeCanvas');
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Create particles with more complexity
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 1500;
  
  const posArray = new Float32Array(particlesCount * 3);
  const colorArray = new Float32Array(particlesCount * 3);
  const sizeArray = new Float32Array(particlesCount);
  
  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
    colorArray[i] = Math.random();
  }
  
  for(let i = 0; i < particlesCount; i++) {
    sizeArray[i] = Math.random() * 0.1 + 0.05;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
  particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
  
  // Create material with more visual interest
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  // Create mesh
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);
  
  // Mouse movement effect
  const mouse = new THREE.Vector2();
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
  
  // Animation with GSAP for smoother performance
  gsap.ticker.add(() => {
    particlesMesh.rotation.x += 0.0002;
    particlesMesh.rotation.y += 0.0003;
    
    // Add subtle mouse movement effect
    particlesMesh.position.x = mouse.x * 0.5;
    particlesMesh.position.y = mouse.y * 0.5;
    
    renderer.render(scene, camera);
  });
  
  // Handle window resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }, 200);
  });
  
  // Update particle color on dark mode toggle
  darkModeToggle.addEventListener('change', () => {
    particlesMaterial.color.set(isDarkMode() ? 0x6d28d9 : 0x0ea5e9);
  });
}

// Initialize p5.js with more sophisticated effects
let p5Instance;
let particles = [];
let mouseX = 0;
let mouseY = 0;

function initP5() {
  if (p5Instance) p5Instance.remove();
  
  const sketch = (p) => {
    p.setup = function() {
      const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
      canvas.parent('p5Canvas');
      canvas.style('position', 'fixed');
      canvas.style('top', '0');
      canvas.style('left', '0');
      canvas.style('z-index', '-1');
      
      // Create more particles with varied properties
      for (let i = 0; i < 80; i++) {
        particles.push({
          position: p.createVector(p.random(p.width), p.random(p.height)),
          velocity: p.createVector(p.random(-1, 1), p.random(-1, 1)),
          size: p.random(2, 10),
          color: isDarkMode() ? 
            p.color(109, 40, 217, p.random(30, 70)) : 
            p.color(14, 165, 233, p.random(30, 70)),
          angle: p.random(p.TWO_PI),
          angleSpeed: p.random(-0.02, 0.02),
          maxDistance: p.random(100, 200)
        });
      }
      
      p.noStroke();
    };
    
    p.draw = function() {
      p.clear();
      
      // Update mouse position
      mouseX = p.mouseX;
      mouseY = p.mouseY;
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        
        // Update position with more organic movement
        particle.position.add(particle.velocity);
        particle.angle += particle.angleSpeed;
        
        // Boundary check with bounce
        if (particle.position.x < 0 || particle.position.x > p.width) {
          particle.velocity.x *= -1;
          particle.position.x = p.constrain(particle.position.x, 0, p.width);
        }
        
        if (particle.position.y < 0 || particle.position.y > p.height) {
          particle.velocity.y *= -1;
          particle.position.y = p.constrain(particle.position.y, 0, p.height);
        }
        
        // Draw particle with more interesting shape
        p.push();
        p.translate(particle.position.x, particle.position.y);
        p.rotate(particle.angle);
        p.fill(particle.color);
        p.ellipse(0, 0, particle.size, particle.size * 0.6);
        p.pop();
        
        // Connect particles with more sophisticated logic
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const d = p.dist(
            particle.position.x, particle.position.y, 
            other.position.x, other.position.y
          );
          
          if (d < particle.maxDistance) {
            const alpha = p.map(d, 0, particle.maxDistance, 100, 0);
            p.stroke(
              particle.color.levels[0], 
              particle.color.levels[1], 
              particle.color.levels[2], 
              alpha
            );
            p.strokeWeight(p.map(d, 0, particle.maxDistance, 2, 0.2));
            p.line(
              particle.position.x, particle.position.y, 
              other.position.x, other.position.y
            );
          }
        }
        
        // Connect to mouse with subtle effect
        if (mouseX > 0 && mouseY > 0) {
          const mouseDist = p.dist(
            particle.position.x, particle.position.y, 
            mouseX, mouseY
          );
          
          if (mouseDist < 150) {
            const mouseAlpha = p.map(mouseDist, 0, 150, 50, 0);
            p.stroke(
              particle.color.levels[0], 
              particle.color.levels[1], 
              particle.color.levels[2], 
              mouseAlpha
            );
            p.strokeWeight(p.map(mouseDist, 0, 150, 1, 0.1));
            p.line(
              particle.position.x, particle.position.y, 
              mouseX, mouseY
            );
          }
        }
      }
    };
    
    p.windowResized = function() {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      
      // Reposition particles that might be outside new canvas bounds
      for (let particle of particles) {
        particle.position.x = p.constrain(particle.position.x, 0, p.width);
        particle.position.y = p.constrain(particle.position.y, 0, p.height);
      }
    };
  };
  
  p5Instance = new p5(sketch);
}

// Dark Mode Toggle
function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  
  if (isDarkMode()) {
    darkModeIcon.classList.remove('fa-moon');
    darkModeIcon.classList.add('fa-sun');
    localStorage.setItem('darkMode', 'true');
  } else {
    darkModeIcon.classList.remove('fa-sun');
    darkModeIcon.classList.add('fa-moon');
    localStorage.setItem('darkMode', 'false');
  }
  
  // Reinitialize p5 to update colors
  initP5();
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.documentElement.classList.add('dark');
  darkModeToggle.checked = true;
  darkModeIcon.classList.remove('fa-moon');
  darkModeIcon.classList.add('fa-sun');
}

// Mobile Menu Toggle
function toggleMobileMenu() {
  mobileMenu.classList.toggle('hidden');
  mobileMenuButton.classList.toggle('text-white');
  mobileMenuButton.classList.toggle('bg-gray-700');
}

// Login Modal with animation
function openLoginModal(tab = 'login') {
    loginModal.classList.remove('hidden');
    setTimeout(() => {
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');
      
      // Show the requested tab
      if (tab === 'signup') {
        switchToSignup();
      } else {
        switchToLogin();
      }
    }, 10);
  }

  // Update the login button to have separate Sign In and Sign Up options
function updateLoginButton() {
    const user = firebase.auth().currentUser;
    
    if (user) {
      // User is logged in - show dashboard button
      loginButton.innerHTML = '<i class="fas fa-user mr-2"></i><span>Dashboard</span>';
      loginButton.onclick = openDashboard;
    } else {
      // User is not logged in - create dropdown for login/signup
      loginButton.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i><span>Account</span>';
      
      // Remove previous dropdown if exists
      const existingDropdown = document.getElementById('accountDropdown');
      if (existingDropdown) {
        existingDropdown.remove();
      }}}
    
// Create dropdown menu
const dropdown = document.createElement('div');
dropdown.id = 'accountDropdown';
dropdown.className = 'hidden absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-dark-100 ring-1 ring-black ring-opacity-5 z-50';
dropdown.innerHTML = `
  <div class="py-1" role="menu" aria-orientation="vertical">
    <button id="signInButton" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300" role="menuitem">
      <i class="fas fa-sign-in-alt mr-2"></i> Sign In
    </button>
    <button id="signUpButton" class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300" role="menuitem">
      <i class="fas fa-user-plus mr-2"></i> Sign Up
    </button>
  </div>
`;

// Position dropdown and add event listeners
loginButton.parentNode.style.position = 'relative';
loginButton.parentNode.appendChild(dropdown);

// Toggle dropdown on click
loginButton.onclick = function(e) {
  e.stopPropagation();
  dropdown.classList.toggle('hidden');
};

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
  if (!loginButton.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// Add event listeners for sign in and sign up buttons
document.getElementById('signInButton').addEventListener('click', function() {
  dropdown.classList.add('hidden');
  openLoginModal('login');
});

document.getElementById('signUpButton').addEventListener('click', function() {
  dropdown.classList.add('hidden');
  openLoginModal('signup');
});



// Update the DOMContentLoaded event listener to use the new updateLoginButton function
document.addEventListener('DOMContentLoaded', () => {
// ... existing code ...

// Replace updateAuthUI with updateLoginButton
firebase.auth().onAuthStateChanged(updateLoginButton);

// ... rest of the existing code ...
});

function closeLoginModalFunc() {
  modalContent.classList.remove('scale-100', 'opacity-100');
  modalContent.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    loginModal.classList.add('hidden');
  }, 300);
}

// Tab Switching
function switchToLogin() {
  loginTab.classList.add('text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400');
  loginTab.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
  
  signupTab.classList.remove('text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400');
  signupTab.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
  
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
}

function switchToSignup() {
  signupTab.classList.add('text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400');
  signupTab.classList.remove('text-gray-500', 'dark:text-gray-400', 'border-transparent');
  
  loginTab.classList.remove('text-primary-600', 'dark:text-primary-400', 'border-primary-600', 'dark:border-primary-400');
  loginTab.classList.add('text-gray-500', 'dark:text-gray-400', 'border-transparent');
  
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
}

// Toggle Password Visibility
function togglePasswordVisibility(e) {
  const targetId = e.currentTarget.getAttribute('data-target');
  const passwordInput = document.getElementById(targetId);
  const icon = e.currentTarget.querySelector('i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  }
}

// Contact Form Submission
function handleContactFormSubmit(e) {
  e.preventDefault();
  
  // Show loading state
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
  submitButton.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    formSuccess.classList.remove('hidden');
    contactForm.reset();
    
    // Reset button
    submitButton.innerHTML = originalText;
    submitButton.disabled = false;
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      formSuccess.classList.add('hidden');
    }, 5000);
  }, 1500);
}

// Firebase Authentication
function handleSignIn(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Signing In...';
  submitButton.disabled = true;
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Success
      Swal.fire({
        title: "Welcome Back!",
        text: "You have been logged in successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
      closeLoginModalFunc();
      updateAuthUI();
    })
    .catch((error) => {
      // Error
      Swal.fire({
        title: "Login Failed",
        text: error.message,
        icon: "error"
      });
    })
    .finally(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    });
}

function handleSignUp(e) {
  e.preventDefault();
  
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const name = document.getElementById('signup-name').value;
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalText = submitButton.innerHTML;
  
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating Account...';
  submitButton.disabled = true;
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Success
      Swal.fire({
        title: "Welcome Aboard!",
        text: "Your account has been created successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });
      
      closeLoginModalFunc();
      updateAuthUI();
    })
    .catch((error) => {
      // Error
      Swal.fire({
        title: "Sign Up Failed",
        text: error.message,
        icon: "error"
      });
    })
    .finally(() => {
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    });
}

// Update UI based on auth state
// Update the updateAuthUI function to handle logout
function updateAuthUI() {
    const user = firebase.auth().currentUser;
    
    if (user) {
      // User is signed in - show dashboard button and logout option
      loginButton.innerHTML = '<i class="fas fa-user mr-2"></i><span>Dashboard</span>';
      loginButton.onclick = openDashboard;
      
      // Add logout button next to the dashboard button
      if (!document.getElementById('logoutButton')) {
        const logoutButton = document.createElement('button');
        logoutButton.id = 'logoutButton';
        logoutButton.className = 'flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ml-4';
        logoutButton.innerHTML = '<i class="fas fa-sign-out-alt mr-2"></i><span>Logout</span>';
        logoutButton.onclick = handleLogout;
        loginButton.parentNode.insertBefore(logoutButton, loginButton.nextSibling);
      }
    } else {
      // No user signed in - show login button and remove logout button if exists
      loginButton.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i><span>Login</span>';
      loginButton.onclick = openLoginModal;
      
      const logoutButton = document.getElementById('logoutButton');
      if (logoutButton) {
        logoutButton.remove();
        
      }
    }
  }

  // Handle logout
function handleLogout() {
    firebase.auth().signOut().then(() => {
      // Redirect to homepage after logout
      window.location.href = "#home";
      // Smooth scroll to top of homepage
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: false },
        duration: 0.8,
        ease: "power2.inOut"
      });
    });
  }
  

function showUserProfile() {
  const user = firebase.auth().currentUser;
  
  Swal.fire({
    title: "Your Profile",
    html: `
      <div class="text-left">
        <p class="mb-2"><strong>Email:</strong> ${user.email}</p>
        <p class="mb-4"><strong>Account Created:</strong> ${new Date(user.metadata.creationTime).toLocaleDateString()}</p>
      </div>
      <div class="flex justify-between">
        <button id="viewDashboard" class="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors">
          Dashboard
        </button>
        <button id="logoutBtn" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
          Sign Out
        </button>
      </div>
    `,
    showConfirmButton: false,
    showCloseButton: true
  });
  
  document.getElementById('logoutBtn').addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      Swal.close();
      updateAuthUI();
    });
  });
  
  if (document.getElementById('viewDashboard')) {
    document.getElementById('viewDashboard').addEventListener('click', () => {
      Swal.fire({
        title: "Coming Soon!",
        text: "The user dashboard is currently under development.",
        icon: "info"
      });
    });
  }
}

// Counter Animation with GSAP
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const duration = 2; // seconds
    const start = 0;
    
    gsap.to(counter, {
      innerText: target,
      duration: duration,
      ease: "power1.out",
      snap: { innerText: 1 },
      onUpdate: function() {
        counter.innerText = Math.floor(this.targets()[0].innerText);
      }
    });
  });
}

// Smooth Scrolling with offset for header
function smoothScroll(e) {
  e.preventDefault();
  
  const targetId = e.currentTarget.getAttribute('href');
  const targetElement = document.querySelector(targetId);
  
  if (targetElement) {
    const headerHeight = document.querySelector('nav').offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight;
    
    gsap.to(window, {
      scrollTo: { y: targetPosition, autoKill: false },
      duration: 0.8,
      ease: "power2.inOut"
    });
    
    // Close mobile menu if open
    if (!mobileMenu.classList.contains('hidden')) {
      toggleMobileMenu();
    }
  }
}

// Back to Top Button
function handleBackToTop() {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.remove('scale-0', 'opacity-0');
      backToTop.classList.add('scale-100', 'opacity-100');
    } else {
      backToTop.classList.remove('scale-100', 'opacity-100');
      backToTop.classList.add('scale-0', 'opacity-0');
    }
  });
  
  backToTop.addEventListener('click', () => {
    gsap.to(window, {
      scrollTo: 0,
      duration: 0.8,
      ease: "power2.inOut"
    });
  });
}

// Intersection Observer for scroll animations
function initIntersectionObserver() {
  const sections = document.querySelectorAll('section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, {
    threshold: 0.1
  });
  
  sections.forEach(section => {
    section.classList.add('section-animate');
    observer.observe(section);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize
  initThreeJS();
  initP5();
  
  // Hide loading screen after everything is loaded
  setTimeout(() => {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      
      // Animate counters after loading screen is hidden
      animateCounters();
      
      // Initialize intersection observer
      initIntersectionObserver();
    }, 500);
  }, 1500);
  
  // Event listeners
  darkModeToggle.addEventListener('change', toggleDarkMode);
  mobileMenuButton.addEventListener('click', toggleMobileMenu);
  loginButton.addEventListener('click', openLoginModal);
  closeLoginModal.addEventListener('click', closeLoginModalFunc);
  loginTab.addEventListener('click', switchToLogin);
  signupTab.addEventListener('click', switchToSignup);
  contactForm.addEventListener('submit', handleContactFormSubmit);
  
  // Login/Signup forms
  loginForm.querySelector('form').addEventListener('submit', handleSignIn);
  signupForm.querySelector('form').addEventListener('submit', handleSignUp);
  
  // Toggle password visibility
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', togglePasswordVisibility);
  });
  
  // Smooth scrolling for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
  });
  


  
  // Check auth state
  firebase.auth().onAuthStateChanged(updateAuthUI);
  
  // Close modal when clicking outside
  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      closeLoginModalFunc();
    }
  });
  
  // Initialize back to top button
  handleBackToTop();
  
  // Add hover effects to all buttons
  const buttons = document.querySelectorAll('button, a[href="#"]');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.classList.add('transform', 'transition-transform', 'duration-200');
      button.classList.add('hover:scale-105');
    });
    button.addEventListener('mouseleave', () => {
      button.classList.remove('transform', 'transition-transform', 'duration-200');
      button.classList.remove('hover:scale-105');
    });
  });
});

// Handle window resize
window.addEventListener('resize', () => {
  // Reinitialize canvases if needed
  if (window.innerWidth < 768 && mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
});

// Dashboard Functions
function openDashboard() {
    const user = firebase.auth().currentUser;
    if (user) {
      // Update user name if available
      const userNameElement = document.getElementById('userName');
      userNameElement.textContent = user.displayName || user.email.split('@')[0];
      
      // Open dashboard
      dashboardModal.classList.remove('hidden');
      setTimeout(() => {
        dashboardContent.classList.remove('scale-95', 'opacity-0');
        dashboardContent.classList.add('scale-100', 'opacity-100');
      }, 10);
    }
  }
  
  function closeDashboard() {
    dashboardContent.classList.remove('scale-100', 'opacity-100');
    dashboardContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      dashboardModal.classList.add('hidden');
      
      loginModal.classList.add('hidden');
      // Redirect to homepage when dashboard is closed
      window.location.href = "#home";
      // Smooth scroll to top of homepage
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: false },
        duration: 0.8,
        ease: "power2.inOut"
      });
    }, 300);
  }
  
  // Update the showUserProfile function to open dashboard instead
  function showUserProfile() {
    openDashboard();
  }
  
  // Initialize dashboard elements
  const dashboardModal = document.getElementById('dashboardModal');
  const dashboardContent = document.getElementById('dashboardContent');
  const closeDashboardBtn = document.getElementById('closeDashboard');
  
  // Add event listeners for dashboard
  if (closeDashboardBtn) {
    closeDashboardBtn.addEventListener('click', closeDashboard);
  }
  
  // Close dashboard when clicking outside
  dashboardModal.addEventListener('click', (e) => {
    if (e.target === dashboardModal) {
      closeDashboard();
    }
  });

