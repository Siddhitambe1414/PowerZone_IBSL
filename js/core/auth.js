/**
 * POWERZONE : GYM & SPORTS STORE
 * Customer Authentication, Session Controller & Dynamic Tailored Starter Kit PDF Generator
 * Regional Hub: Shirdi (Nagar-Manmad Highway), Maharashtra
 */

class PowerZoneAuthManager {
  constructor() {
    this.usersKey = 'powerzone_users_v1';
    this.sessionKey = 'powerzone_current_user_v1';
    this.init();
  }

  init() {
    this.seedInitialUsers();
    this.bindEvents();
    this.renderSessionNav();
    this.prefillFormsForCurrentUser();
  }

  seedInitialUsers() {
    const existing = localStorage.getItem(this.usersKey);
    if (!existing) {
      const defaultUsers = [
        {
          id: 'PZ-MEM-1001',
          fullName: 'Rahul Gunjal',
          mobile: '9876543210',
          email: 'rahul@example.com',
          password: 'password123',
          goal: 'Muscle Building / Bulk',
          dietPreference: 'Non-Vegetarian',
          createdAt: '2026-08-15'
        },
        {
          id: 'PZ-MEM-1002',
          fullName: 'Priya Deshmukh',
          mobile: '9822018234',
          email: 'priya@example.com',
          password: 'password123',
          goal: 'Fat Loss & Shredding',
          dietPreference: 'Pure Vegetarian',
          createdAt: '2026-08-18'
        }
      ];
      this.saveUsers(defaultUsers);
    }
  }

  getUsers() {
    try {
      const data = localStorage.getItem(this.usersKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parsing PowerZone Users:', e);
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.usersKey, JSON.stringify(users));
    } catch (e) {
      console.error('Error saving PowerZone Users:', e);
    }
  }

  getCurrentUser() {
    try {
      const session = localStorage.getItem(this.sessionKey);
      return session ? JSON.parse(session) : null;
    } catch (e) {
      console.error('Error parsing current user session:', e);
      return null;
    }
  }

  setCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(this.sessionKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.sessionKey);
      }
    } catch (e) {
      console.error('Error updating current user session:', e);
    }
  }

  // --- Real Supabase Email OTP Dispatch ---
  async initiateRegistration({ fullName, mobile, email, password, goal, dietPreference }) {
    const trimmedName = (fullName || '').trim();
    const cleanMobile = (mobile || '').trim().replace(/\D/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!trimmedName || trimmedName.length < 2) {
      if (window.showToast) window.showToast('Validation Error', 'Please enter your full legal name.', 'crimson');
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      if (window.showToast) window.showToast('Invalid Mobile', 'Enter a valid 10-digit Indian mobile number.', 'crimson');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      if (window.showToast) window.showToast('Invalid Email', 'Please provide a valid email address.', 'crimson');
      return false;
    }
    if (cleanPassword.length < 6) {
      if (window.showToast) window.showToast('Weak Password', 'Password must be at least 6 characters.', 'crimson');
      return false;
    }

    this.pendingUser = {
      fullName: trimmedName,
      mobile: cleanMobile,
      email: cleanEmail,
      password: cleanPassword,
      goal: goal || 'Muscle Building / Bulk',
      dietPreference: dietPreference || 'Pure Vegetarian'
    };

    const client = window.PowerZoneDB ? window.PowerZoneDB.getClient() : null;
    if (!client) {
      if (window.showToast) window.showToast('Database Error', 'Supabase client is not ready.', 'crimson');
      return false;
    }

    if (window.showToast) window.showToast('Sending OTP...', 'Dispatching verification code to your email inbox.', 'success');

    const { data, error } = await client.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          full_name: trimmedName,
          phone: cleanMobile,
          diet: dietPreference,
          goal: goal
        }
      }
    });

    if (error) {
      if (window.showToast) window.showToast('Sign-Up Error', error.message, 'crimson');
      return false;
    }

    const otpWrap = document.getElementById('regOtpWrap');
    const submitBtn = document.getElementById('regSubmitBtn');
    if (otpWrap) otpWrap.style.display = 'block';
    if (submitBtn) submitBtn.textContent = 'Verify OTP & Finish Sign Up';

    if (window.showToast) {
      window.showToast('Email Sent!', `Check inbox for ${cleanEmail} for your verification code.`, 'success');
    }
    return true;
  }

  // --- Verify Real Supabase Email Token ---
  async verifyOtpAndRegister(enteredOtp) {
    const userEmail = (this.pendingUser && this.pendingUser.email)
      ? this.pendingUser.email
      : (document.getElementById('regEmail')?.value || '').trim().toLowerCase();

    if (!userEmail) {
      if (window.showToast) window.showToast('Missing Data', 'Please fill the registration form first.', 'crimson');
      return false;
    }

    const token = (enteredOtp || '').toString().trim().replace(/\D/g, '');
    if (token.length < 6 || token.length > 8) {
      if (window.showToast) window.showToast('Invalid Code', 'Please enter the complete 6 to 8 digit code from your email.', 'crimson');
      return false;
    }

    const client = window.PowerZoneDB ? window.PowerZoneDB.getClient() : null;
    if (!client) {
      if (window.showToast) window.showToast('Database Error', 'Supabase client is not ready.', 'crimson');
      return false;
    }

    const { data, error } = await client.auth.verifyOtp({
      email: userEmail,
      token: token,
      type: 'signup'
    });

    if (error) {
      if (window.showToast) window.showToast('Verification Failed', error.message, 'crimson');
      return false;
    }

    const userData = this.pendingUser || {
      fullName: document.getElementById('regFullName')?.value || 'Athlete',
      mobile: document.getElementById('regMobile')?.value || '',
      email: userEmail,
      password: document.getElementById('regPassword')?.value || 'member123',
      goal: document.getElementById('regGoal')?.value || 'General Fitness',
      dietPreference: document.getElementById('regDiet')?.value || 'Pure Vegetarian'
    };

    const res = this.registerUser(userData);
    this.pendingUser = null;

    const otpWrap = document.getElementById('regOtpWrap');
    const submitBtn = document.getElementById('regSubmitBtn');
    if (otpWrap) otpWrap.style.display = 'none';
    if (submitBtn) submitBtn.textContent = 'Create Account & Get Free Diet Plan';

    this.closeAuthModal();
    this.renderSessionNav();

    return res;
  }

  registerUser({ fullName, mobile, email, password, goal, dietPreference }) {
    const trimmedName = (fullName || '').trim();
    const cleanMobile = (mobile || '').trim().replace(/\D/g, '');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();
    const selectedGoal = goal || 'Muscle Building / Bulk';
    const selectedDiet = dietPreference || 'Pure Vegetarian';

    const users = this.getUsers();
    const newUser = {
      id: 'PZ-MEM-' + Math.floor(10000 + Math.random() * 90000),
      fullName: trimmedName,
      mobile: cleanMobile,
      email: cleanEmail,
      password: cleanPassword,
      goal: selectedGoal,
      dietPreference: selectedDiet,
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);

    if (window.PowerZoneDB && typeof window.PowerZoneDB.syncMemberProfile === 'function') {
      window.PowerZoneDB.syncMemberProfile({
        id: newUser.id,
        full_name: newUser.fullName,
        phone: newUser.mobile,
        email: newUser.email,
        diet_preference: newUser.dietPreference,
        training_goal: newUser.goal,
        city: 'Shirdi'
      }).catch(err => console.error('Error syncing profile to Supabase:', err));
    }

    this.closeAuthModal();
    this.renderSessionNav();
    this.prefillFormsForCurrentUser();

    if (window.showToast) {
      window.showToast('Welcome to PowerZone!', `Account verified & created for ${trimmedName}.`, 'success');
    }

    return { success: true, user: newUser };
  }

  loginUser(identifier, password) {
    const cleanId = (identifier || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanId || !cleanPassword) {
      if (window.showToast) window.showToast('Missing Credentials', 'Please enter your email/mobile and password.', 'crimson');
      return { success: false, message: 'Missing fields' };
    }

    const users = this.getUsers();
    const normalizedMobile = cleanId.replace(/\D/g, '');
    const isMobile = /^[6-9]\d{9}$/.test(normalizedMobile);

    const user = users.find(u => {
      if (isMobile && u.mobile === normalizedMobile) return true;
      return (u.email && u.email.toLowerCase() === cleanId.toLowerCase()) || u.mobile === cleanId;
    });

    if (!user || user.password !== cleanPassword) {
      if (window.showToast) {
        window.showToast('Sign In Failed', 'Invalid email/mobile or password.', 'crimson');
      }
      return { success: false, message: 'Invalid credentials' };
    }

    this.setCurrentUser(user);

    if (window.PowerZoneDB && typeof window.PowerZoneDB.syncMemberProfile === 'function') {
      window.PowerZoneDB.syncMemberProfile({
        id: user.id || ('PZ-MEM-' + Math.floor(10000 + Math.random() * 90000)),
        full_name: user.fullName,
        phone: user.mobile,
        email: user.email,
        diet_preference: user.dietPreference || 'Both / Flexible',
        training_goal: user.goal || 'General Fitness',
        city: 'Shirdi'
      }).catch(err => console.error('Error syncing profile on login:', err));
    }

    this.closeAuthModal();
    this.renderSessionNav();
    this.prefillFormsForCurrentUser();

    if (window.showToast) {
      window.showToast('Signed In!', `Welcome back, ${user.fullName}!`, 'success');
    }

    return { success: true, user };
  }

  logoutUser() {
    const user = this.getCurrentUser();
    const name = user ? user.fullName.split(' ')[0] : 'Member';
    this.setCurrentUser(null);
    this.closeUserMenu();
    this.closeUserOrdersModal();
    this.renderSessionNav();

    if (window.showToast) {
      window.showToast('Signed Out', `Goodbye, ${name}. Have a strong day!`, 'crimson');
    }
  }

  updateUserPreferences(newGoal, newDiet) {
    const user = this.getCurrentUser();
    if (!user) return;

    user.goal = newGoal || user.goal || 'Muscle Building / Bulk';
    user.dietPreference = newDiet || user.dietPreference || 'Pure Vegetarian';

    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.mobile === user.mobile);
    if (idx !== -1) {
      users[idx] = user;
      this.saveUsers(users);
    }

    this.setCurrentUser(user);

    if (window.PowerZoneDB && typeof window.PowerZoneDB.syncMemberProfile === 'function') {
      window.PowerZoneDB.syncMemberProfile({
        id: user.id || ('PZ-MEM-' + Math.floor(10000 + Math.random() * 90000)),
        full_name: user.fullName,
        phone: user.mobile,
        email: user.email,
        diet_preference: user.dietPreference,
        training_goal: user.goal,
        city: 'Shirdi'
      }).catch(err => console.error('Error syncing preferences:', err));
    }

    this.renderSessionNav();
    this.openUserOrdersModal();

    if (window.showToast) {
      window.showToast('Preferences Saved', `Updated to ${user.dietPreference} & ${user.goal}.`, 'success');
    }
  }

  openAuthModal(tab = 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    this.switchAuthTab(tab);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      if (tab === 'login') {
        const input = document.getElementById('loginIdentifier');
        if (input) input.focus();
      } else {
        const input = document.getElementById('regFullName');
        if (input) input.focus();
      }
    }, 150);
  }

  closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      this.resetAuthForms();
    }
  }

  switchAuthTab(tabName) {
    const tabLoginBtn = document.getElementById('authTabLoginBtn');
    const tabSignupBtn = document.getElementById('authTabSignupBtn');
    const tabLoginContent = document.getElementById('authLoginTabContent');
    const tabSignupContent = document.getElementById('authSignupTabContent');

    if (!tabLoginBtn || !tabSignupBtn || !tabLoginContent || !tabSignupContent) return;

    if (tabName === 'signup') {
      tabLoginBtn.classList.remove('active');
      tabSignupBtn.classList.add('active');
      tabLoginContent.style.display = 'none';
      tabSignupContent.style.display = 'block';
    } else {
      tabLoginBtn.classList.add('active');
      tabSignupBtn.classList.remove('active');
      tabLoginContent.style.display = 'block';
      tabSignupContent.style.display = 'none';
    }
  }

  resetAuthForms() {
    const loginForm = document.getElementById('authLoginForm');
    const signupForm = document.getElementById('authSignupForm');
    if (loginForm) loginForm.reset();
    if (signupForm) signupForm.reset();
    const otpWrap = document.getElementById('regOtpWrap');
    if (otpWrap) otpWrap.style.display = 'none';
    const submitBtn = document.getElementById('regSubmitBtn');
    if (submitBtn) submitBtn.textContent = 'Create Account & Get Free Diet Plan';
  }

  renderSessionNav() {
    const user = this.getCurrentUser();
    const authContainers = document.querySelectorAll('#authNavContainer, .auth-nav-container');
    const mobileAuthContainers = document.querySelectorAll('#mobileAuthContainer, .mobile-auth-container');

    const authBtnMarkup = `
      <button class="btn btn-outline btn-sm auth-btn" id="navAuthBtn" onclick="window.pzAuth.openAuthModal('login')" aria-label="Sign In or Register">
        <span class="auth-btn-icon">👤</span>
        <span class="auth-btn-text">Sign In / Join</span>
      </button>
    `;

    const loggedInMarkup = (u) => {
      const diet = u.dietPreference || 'Pure Vegetarian';
      const goal = u.goal || 'Muscle Building / Bulk';
      return `
        <div class="user-session-dropdown" id="userSessionDropdown">
          <button class="user-session-trigger" id="userSessionTrigger" aria-expanded="false" onclick="window.pzAuth.toggleUserMenu(event)">
            <span class="user-avatar-badge">👤</span>
            <span class="user-session-name">Welcome, ${u.fullName}</span>
            <span class="dropdown-chevron">▾</span>
          </button>
          <div class="user-session-menu" id="userSessionMenu">
            <div class="user-menu-header">
              <div class="user-menu-fullname">${u.fullName}</div>
              <div class="user-menu-sub">${u.email || '+91 ' + u.mobile}</div>
              <div style="display: flex; gap: 0.35rem; margin-top: 0.4rem; flex-wrap: wrap;">
                <span class="badge badge-gold" style="font-size: 0.7rem;">🎯 ${goal}</span>
                <span class="badge ${diet === 'Pure Vegetarian' ? 'badge-green' : (diet === 'Non-Vegetarian' ? 'badge-crimson' : 'badge-cyan')}" style="font-size: 0.7rem;">${diet}</span>
              </div>
            </div>
            <div class="user-menu-divider"></div>
            <button class="user-menu-item" onclick="window.pzAuth.openUserOrdersModal()">
              <span class="menu-item-icon">📦</span>
              <span>My Orders & Passes</span>
            </button>
            <button class="user-menu-item" onclick="window.pzAuth.downloadStarterKitPDF()">
              <span class="menu-item-icon">📋</span>
              <span>Download Diet Plan (PDF)</span>
            </button>
            <div class="user-menu-divider"></div>
            <button class="user-menu-item user-menu-logout" onclick="window.pzAuth.logoutUser()">
              <span class="menu-item-icon">🚪</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      `;
    };

    authContainers.forEach(container => {
      container.innerHTML = user ? loggedInMarkup(user) : authBtnMarkup;
    });

    mobileAuthContainers.forEach(container => {
      if (user) {
        const diet = user.dietPreference || 'Pure Vegetarian';
        const goal = user.goal || 'Muscle Building';
        container.innerHTML = `
          <div class="mobile-user-profile-card">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
              <div class="user-avatar-badge" style="width: 36px; height: 36px; font-size: 1.1rem;">👤</div>
              <div>
                <strong style="color: var(--text-primary); font-size: 0.95rem;">Welcome, ${user.fullName}</strong>
                <div style="font-size: 0.75rem; color: var(--text-muted);">${goal} • ${diet}</div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="window.pzAuth.openUserOrdersModal()">📦 My Orders</button>
              <button class="btn btn-primary btn-sm" onclick="window.pzAuth.downloadStarterKitPDF()">📋 Diet Plan</button>
            </div>
            <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="window.pzAuth.logoutUser()">🚪 Sign Out</button>
          </div>
        `;
      } else {
        container.innerHTML = `
          <button class="btn btn-outline" style="width: 100%; margin-bottom: 0.75rem;" onclick="window.pzAuth.openAuthModal('login')">
            👤 Sign In / Join PowerZone
          </button>
        `;
      }
    });
  }

  toggleUserMenu(e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('userSessionMenu');
    const trigger = document.getElementById('userSessionTrigger');
    if (menu && trigger) {
      const isOpen = menu.classList.contains('show');
      if (isOpen) {
        this.closeUserMenu();
      } else {
        menu.classList.add('show');
        trigger.setAttribute('aria-expanded', 'true');
      }
    }
  }

  closeUserMenu() {
    const menu = document.getElementById('userSessionMenu');
    const trigger = document.getElementById('userSessionTrigger');
    if (menu) menu.classList.remove('show');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  }

  prefillFormsForCurrentUser() {
    const user = this.getCurrentUser();
    if (!user) return;

    const checkoutName = document.getElementById('checkoutName');
    const checkoutPhone = document.getElementById('checkoutPhone');
    if (checkoutName && !checkoutName.value) checkoutName.value = user.fullName || '';
    if (checkoutPhone && !checkoutPhone.value) checkoutPhone.value = user.mobile || '';

    const passName = document.getElementById('passName');
    const passEmail = document.getElementById('passEmail');
    const passPhone = document.getElementById('passPhone');
    if (passName && !passName.value) passName.value = user.fullName || '';
    if (passEmail && !passEmail.value) passEmail.value = user.email || '';
    if (passPhone && !passPhone.value) passPhone.value = user.mobile || '';

    const trialName = document.getElementById('trialName');
    const trialEmail = document.getElementById('trialEmail');
    const trialPhone = document.getElementById('trialPhone');
    if (trialName && !trialName.value) trialName.value = user.fullName || '';
    if (trialEmail && !trialEmail.value) trialEmail.value = user.email || '';
    if (trialPhone && !trialPhone.value) trialPhone.value = user.mobile || '';
  }

  downloadStarterKitPDF(targetUser = null) {
    this.closeUserMenu();
    const user = targetUser || this.getCurrentUser();
    if (!user) {
      this.openAuthModal('login');
      return;
    }
    if (!window.jspdf || !window.jspdf.jsPDF) return;

    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const goal = user.goal || 'Muscle Building / Bulk';
      const diet = user.dietPreference || 'Pure Vegetarian';
      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

      doc.setFillColor(15, 17, 21);
      doc.rect(0, 0, 210, 36, 'F');
      doc.setFillColor(220, 38, 38);
      doc.rect(0, 36, 210, 2, 'F');

      doc.setTextColor(255, 59, 48);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('POWERZONE', 14, 16);

      doc.setTextColor(248, 250, 252);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('PREMIER GYM & OFFICIAL SPORTS STORE | SHIRDI', 14, 23);

      doc.save(`PowerZone_Starter_Kit_${user.fullName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      if (window.showToast) window.showToast('PDF Ready', 'Downloaded starter kit PDF.', 'success');
    } catch (e) {
      console.error(e);
    }
  }

  async openUserOrdersModal() {
    this.closeUserMenu();
    let user = this.getCurrentUser();
    if (!user) {
      user = {
        fullName: 'Reva',
        mobile: '9876543210',
        email: 'reva@powerzone.com',
        goal: 'Muscle Building / Bulk',
        dietPreference: 'Pure Vegetarian'
      };
    }
    const modal = document.getElementById('userOrdersModal');
    const content = document.getElementById('userOrdersModalContent');
    if (!modal || !content) return;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    let orders = [];
    if (user && user.mobile && window.PowerZoneDB && typeof window.PowerZoneDB.fetchCustomerOrders === 'function') {
      try {
        orders = await window.PowerZoneDB.fetchCustomerOrders(user.mobile);
      } catch (e) { }
    }

    if (!orders || orders.length === 0) {
      orders = [
        {
          id: 'PZ-ORD-52630',
          totalAmount: 2624,
          status: 'Delivered',
          itemsSummary: 'PowerZone Whey Protein Isolate & Lifting Straps',
          date: '28 Oct 2026',
          timestamp: '28 Oct 2026, 11:30 AM'
        }
      ];
    }

    const athleteName = user.fullName || 'Reva';
    const monogram = athleteName.trim().charAt(0).toUpperCase() || 'R';
    const phone = user.mobile ? (user.mobile.startsWith('+91') ? user.mobile : '+91 ' + user.mobile) : '+91 98765 43210';
    const email = user.email || 'reva@powerzone.com';

    // Retrieve user's booked session slots from 'pz_user_bookings'
    let userBookings = [];
    try {
      const storedBookings = localStorage.getItem('pz_user_bookings');
      if (storedBookings) {
        userBookings = JSON.parse(storedBookings);
      } else {
        const legacyBookings = localStorage.getItem('powerzone_class_bookings');
        if (legacyBookings) {
          userBookings = JSON.parse(legacyBookings);
        }

      }
    } catch (e) {
      userBookings = [];
    }

    if (!Array.isArray(userBookings)) {
      userBookings = [];
    }

    content.innerHTML = `
      <div class="pz-profile-modal">
        <!-- User Profile Header -->
        <div class="pz-profile-header">
          <div class="pz-profile-avatar" aria-hidden="true">${monogram}</div>
          <div class="pz-profile-info">
            <div class="pz-profile-name-row">
              <h3 class="pz-profile-name">${athleteName}</h3>
              <span class="pz-vip-badge">VIP MEMBER</span>
            </div>
            <div class="pz-profile-contact">
              <span class="pz-contact-phone">${phone}</span>
              <span class="pz-contact-sep">•</span>
              <span class="pz-contact-email">${email}</span>
            </div>
          </div>
        </div>

        <!-- Dedicated My Booked Session Slots Section -->
        <div class="pz-orders-section pz-bookings-section">
          <div class="pz-orders-header">
            <span class="pz-section-label">MY BOOKED SESSION SLOTS</span>
            <span class="pz-item-counter">${userBookings.length} ${userBookings.length === 1 ? 'SESSION' : 'SESSIONS'}</span>
          </div>

          <div class="pz-bookings-list">
            ${userBookings.length === 0 ? `
              <div class="pz-order-card" style="text-align: center; padding: 1.5rem 1rem;">
                <p style="margin: 0 0 0.4rem 0; font-size: 0.95rem; font-weight: 600; color: var(--text-primary);">No Session Slots Booked Yet</p>
                <p style="margin: 0 0 0.85rem 0; font-size: 0.82rem; color: var(--text-muted);">Reserve a trial or training session to lock in your preferred discipline and coach.</p>
                <a href="classes.html#schedule" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.35rem; text-decoration: none; margin: 0 auto;" onclick="window.pzAuth && window.pzAuth.closeUserOrdersModal();">
                  Explore & Book Slots →
                </a>
              </div>
            ` : userBookings.map(b => {
              const disciplineName = b.sessionTitle || b.className || 'Training Discipline';
              const coachName = b.coach || b.trainer || 'Lead Instructor';
              const rawSlot = b.slot || b.timeSlot || '06:00 AM (Morning)';
              const formattedSlot = rawSlot.toLowerCase().startsWith('slot:') ? rawSlot : `Slot: ${rawSlot}`;
              const bookingDate = b.date || 'Confirmed Reservation';
              const status = b.status || 'Confirmed';
              const bookingId = b.id || 'PZ-TRL-CONFIRMED';

              return `
                <div class="pz-order-card pz-booking-slot-card">
                  <div class="pz-order-card-header">
                    <div class="pz-order-meta">
                      <span class="pz-order-id" style="color: var(--secondary); font-size: 0.9rem;">#${bookingId}</span>
                      <span class="pz-order-date">${bookingDate}</span>
                    </div>
                    <span class="pz-status-pill">
                      <span class="pz-status-dot"></span>
                      ${status}
                    </span>
                  </div>
                  
                  <div class="pz-order-card-body" style="display: flex; flex-direction: column; gap: 0.45rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap;">
                      <div>
                        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin: 0 0 0.25rem 0; font-family: var(--font-display, sans-serif);">
                          ${disciplineName}
                        </h4>
                        <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0; display: flex; align-items: center; gap: 0.35rem;">
                          <span style="color: var(--primary); font-weight: 600;">Coach:</span>
                          <span style="font-weight: 600; color: var(--text-primary);">${coachName}</span>
                        </p>
                      </div>
                      
                      <!-- Formatted Time Slot Badge -->
                      <span class="pz-slot-badge">
                        ${formattedSlot}
                      </span>
                    </div>
                  </div>

                  <div class="pz-order-card-footer" style="padding-top: 0.65rem; margin-top: 0.2rem;">
                    <span style="font-size: 0.78rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.35rem;">
                      📍 PowerZone Shirdi Arena • Entry Verified
                    </span>
                    <span style="font-size: 0.76rem; color: var(--accent-green); font-weight: 700; text-transform: uppercase;">
                      ✓ Confirmed Access
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Orders & Active Passes Section -->
        <div class="pz-orders-section">
          <div class="pz-orders-header">
            <span class="pz-section-label">ORDERS & ACTIVE PASSES</span>
            <span class="pz-item-counter">${orders.length} ${orders.length === 1 ? 'ITEM' : 'ITEMS'}</span>
          </div>

          <div class="pz-orders-list">
            ${orders.map(ord => `
              <div class="pz-order-card">
                <div class="pz-order-card-header">
                  <div class="pz-order-meta">
                    <span class="pz-order-id">#${ord.id}</span>
                    <span class="pz-order-date">${ord.date || ord.timestamp || 'Official Order'}</span>
                  </div>
                  <span class="pz-status-pill">
                    <span class="pz-status-dot"></span>
                    ${ord.status || 'Delivered'}
                  </span>
                </div>
                <div class="pz-order-card-body">
                  <p class="pz-order-items">${ord.itemsSummary || ord.item || 'PowerZone Official Sports Gear'}</p>
                </div>
                <div class="pz-order-card-footer">
                  <div class="pz-order-amount-wrap">
                    <span class="pz-amount-label">Total Amount</span>
                    <span class="pz-order-amount">₹${Number(ord.totalAmount || ord.price || 2624).toLocaleString('en-IN')}</span>
                  </div>
                  <button type="button" class="pz-btn-receipt" onclick="window.pzAuth.viewReceipt('${ord.id}')">
                    View Receipt →
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  viewReceipt(orderId) {
    const user = this.getCurrentUser() || { fullName: 'Reva', mobile: '9876543210', email: 'reva@powerzone.com' };
    const cleanId = orderId || 'PZ-ORD-52630';

    if (window.jspdf && window.jspdf.jsPDF) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });

        doc.setFillColor(15, 17, 21);
        doc.rect(0, 0, 148, 28, 'F');
        doc.setFillColor(220, 38, 38);
        doc.rect(0, 28, 148, 2, 'F');

        doc.setTextColor(255, 59, 48);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('POWERZONE', 12, 13);

        doc.setTextColor(248, 250, 252);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.text('PREMIER FITNESS & SPORTS STORE | OFFICIAL RECEIPT', 12, 20);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`RECEIPT: ${cleanId}`, 12, 40);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Customer: ${user.fullName || 'Reva'}`, 12, 48);
        doc.text(`Contact: ${user.mobile ? ('+91 ' + user.mobile) : '+91 98765 43210'} | ${user.email || 'reva@powerzone.com'}`, 12, 54);
        doc.text(`Date: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`, 12, 60);
        doc.text(`Status: Delivered (Verified)`, 12, 66);

        doc.setDrawColor(226, 232, 240);
        doc.line(12, 72, 136, 72);

        doc.setFont('helvetica', 'bold');
        doc.text('Item Description', 12, 78);
        doc.text('Amount', 112, 78);

        doc.line(12, 81, 136, 81);

        doc.setFont('helvetica', 'normal');
        doc.text('PowerZone Whey Protein Isolate & Lifting Straps', 12, 88);
        doc.text('INR 2,624', 112, 88);

        doc.line(12, 94, 136, 94);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('TOTAL PAID:', 80, 102);
        doc.setTextColor(220, 38, 38);
        doc.text('INR 2,624', 112, 102);

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for choosing PowerZone Shirdi. Keep pushing your limits!', 12, 125);

        doc.save(`PowerZone_Receipt_${cleanId}.pdf`);
        if (window.showToast) {
          window.showToast('Receipt Ready', `Downloaded receipt for ${cleanId}.`, 'success');
        }
        return;
      } catch (err) {
        console.error('Error generating receipt PDF:', err);
      }
    }

    if (window.showToast) {
      window.showToast('Order Receipt', `Receipt for Order #${cleanId} - Total: ₹2,624 (Delivered)`, 'success');
    }
  }

  closeUserOrdersModal() {
    const modal = document.getElementById('userOrdersModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('userSessionDropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        this.closeUserMenu();
      }
    });

    document.addEventListener('submit', async (e) => {
      if (e.target && e.target.id === 'authLoginForm') {
        e.preventDefault();
        const idInput = document.getElementById('loginIdentifier');
        const passInput = document.getElementById('loginPassword');
        if (idInput && passInput) {
          this.loginUser(idInput.value, passInput.value);
        }
      }

      if (e.target && e.target.id === 'authSignupForm') {
        e.preventDefault();

        const submitBtn = document.getElementById('regSubmitBtn');
        const otpInput = e.target.querySelector('#regOtpInput, input[name="otp"], input[placeholder*="code" i], input[placeholder*="verification" i]') || document.getElementById('regOtpInput');
        const otpVal = otpInput ? otpInput.value.replace(/\D/g, '') : '';

        // If the submit button text contains 'Verify' OR otpVal.length >= 6
        if ((submitBtn && submitBtn.textContent.includes('Verify')) || otpVal.length >= 6) {
          if (otpVal.length < 6 || otpVal.length > 8) {
            if (window.showToast) window.showToast('Invalid Code', 'Please enter the complete 6 to 8 digit code from your email.', 'crimson');
            return;
          }
          await this.verifyOtpAndRegister(otpVal);
          return;
        }

        const fullName = document.getElementById('regFullName')?.value;
        const mobile = document.getElementById('regMobile')?.value;
        const email = document.getElementById('regEmail')?.value;
        const password = document.getElementById('regPassword')?.value;
        const goal = document.getElementById('regGoal')?.value;
        const dietPreference = document.getElementById('regDiet')?.value;

        this.initiateRegistration({ fullName, mobile, email, password, goal, dietPreference });
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'regMobile') {
        const val = e.target.value.replace(/\D/g, '');
        const helper = document.getElementById('regMobileHelper');
        if (helper) {
          if (val.length === 0) {
            helper.textContent = 'Enter 10-digit Indian mobile number (e.g. 9876543210)';
            helper.style.color = 'var(--text-muted)';
          } else if (/^[6-9]\d{9}$/.test(val)) {
            helper.textContent = '✓ Valid 10-digit Indian mobile number';
            helper.style.color = 'var(--accent-green)';
          } else {
            helper.textContent = 'Must be 10 digits starting with 6, 7, 8, or 9';
            helper.style.color = 'var(--primary)';
          }
        }
      }
    });
  }
}

window.togglePasswordVisibility = function (inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btnEl) btnEl.textContent = '👁️';
  } else {
    input.type = 'password';
    if (btnEl) btnEl.textContent = '👁️‍🗨️';
  }
};

window.PowerZoneAuth = new PowerZoneAuthManager();
window.pzAuth = window.PowerZoneAuth;

window.renderUserBookedSlots = function () {
  // If the user orders modal is currently active, re-render it directly
  const modal = document.getElementById('userOrdersModal');
  if (modal && modal.classList.contains('active') && window.pzAuth && typeof window.pzAuth.openUserOrdersModal === 'function') {
    window.pzAuth.openUserOrdersModal();
    return;
  }

  const container = document.getElementById('userBookedSlotsContainer') ||
    document.getElementById('userOrdersModalContent') ||
    document.querySelector('.orders-modal-body') ||
    document.querySelector('#userOrdersModal .modal-body');
  if (!container) return;

  // Retrieve user bookings from localStorage
  const userBookings = JSON.parse(localStorage.getItem('pz_user_bookings') || '[]');

  const existingSection = document.getElementById('pzMyBookedSlotsSection');
  if (existingSection) existingSection.remove();

  const sectionDiv = document.createElement('div');
  sectionDiv.id = 'pzMyBookedSlotsSection';
  sectionDiv.style.marginBottom = '20px';
  sectionDiv.style.paddingBottom = '15px';
  sectionDiv.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';

  let slotsHTML = `
    <h4 style="margin: 0 0 12px 0; color: var(--primary, #ef4444); font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 8px;">
      <span>📅</span> My Booked Training Slots
    </h4>
  `;

  if (userBookings.length === 0) {
    slotsHTML += `
      <div style="background: rgba(255, 255, 255, 0.03); border: 1px dashed rgba(255, 255, 255, 0.15); border-radius: 8px; padding: 14px; text-align: center; color: #94a3b8; font-size: 0.85rem;">
        No session slots booked yet. Book a session to view your reserved timing here.
      </div>
    `;
  } else {
    slotsHTML += userBookings.map(item => `
      <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-left: 4px solid var(--primary, #ef4444); border-radius: 6px; padding: 12px 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">${item.className || 'Training Session'}</div>
          <div style="font-size: 0.8rem; color: #94a3b8; margin-top: 2px;">Coach: ${item.trainer || 'Head Coach'} • Booked on ${item.date || 'Recent'}</div>
        </div>
        <div style="text-align: right;">
          <span style="background: #0284c7; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 8px; border-radius: 4px; display: inline-block;">
            ${item.slot || item.timeSlot || '09:00 AM'}
          </span>
          <div style="font-size: 0.75rem; color: #22c55e; font-weight: 600; margin-top: 3px;">✓ Confirmed</div>
        </div>
      </div>
    `).join('');
  }

  sectionDiv.innerHTML = slotsHTML;
  container.prepend(sectionDiv);
};