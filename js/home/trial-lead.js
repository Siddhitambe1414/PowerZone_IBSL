/**
 * POWERZONE : GYM & SPORTS STORE
 * Interactive Modals System (Free 1-Day Pass, Workout Quiz & Trial Booking)
 */

class PowerZoneModalManager {
  constructor() {
    this.quizAnswers = {};
    this.currentQuizStep = 1;
    this.init();
  }

  init() {
    this.bindGlobalModalEvents();
    this.bindFreePassEvents();
    this.bindQuizEvents();
    this.bindTrialBookingEvents();
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      if (modalId === 'freePassModal') {
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('passDate');
        if (dateInput) {
          dateInput.min = today;
          if (!dateInput.value || dateInput.value < today) {
            dateInput.value = today;
          }
        }
        const formContainer = document.getElementById('freePassFormWrap');
        const resultContainer = document.getElementById('freePassResultWrap');
        if (formContainer && resultContainer) {
          formContainer.style.display = 'block';
          resultContainer.style.display = 'none';
        }
      }
      if (window.pzAuth && typeof window.pzAuth.prefillFormsForCurrentUser === 'function') {
        window.pzAuth.prefillFormsForCurrentUser();
      }
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  bindGlobalModalEvents() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    document.querySelectorAll('.modal-close-icon, [data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-backdrop');
        if (modal) this.closeModal(modal.id);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.active').forEach(modal => {
          this.closeModal(modal.id);
        });
      }
    });

    document.querySelectorAll('[data-open-pass-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal('freePassModal');
      });
    });

    document.querySelectorAll('[data-open-quiz-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.resetQuiz();
        this.openModal('workoutQuizModal');
      });
    });

    document.querySelectorAll('[data-open-bmi-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal('bmiCalculatorModal');
      });
    });

    document.querySelectorAll('[data-book-class]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const className = btn.getAttribute('data-book-class') || 'Burn & Build';
        this.openTrialBooking(className);
      });
    });
  }

  // --- FREE 1-DAY PASS GENERATOR ---
  bindFreePassEvents() {
    const form = document.getElementById('freePassForm');
    const dateInput = document.getElementById('passDate');

    // Enforce no previous dates on workout date picker
    const enforceMinDate = () => {
      const today = new Date().toISOString().split('T')[0];
      if (dateInput) {
        dateInput.min = today;
        if (!dateInput.value || dateInput.value < today) {
          dateInput.value = today;
        }
      }
    };
    enforceMinDate();

    if (dateInput) {
      dateInput.addEventListener('change', () => {
        const today = new Date().toISOString().split('T')[0];
        if (dateInput.value && dateInput.value < today) {
          if (window.showToast) {
            window.showToast('Invalid Date', 'Previous dates cannot be selected. Please choose today or a future date.', 'crimson');
          }
          dateInput.value = today;
        }
      });
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('passName').value.trim();
      const email = document.getElementById('passEmail').value.trim();
      const branch = document.getElementById('passBranch').value;
      const today = new Date().toISOString().split('T')[0];
      const date = (dateInput && dateInput.value) ? dateInput.value : today;

      // Reject any previous date
      if (date < today) {
        if (window.showToast) {
          window.showToast('Invalid Date', 'Previous dates cannot be selected. Please choose today or a future date.', 'crimson');
        }
        if (dateInput) {
          dateInput.min = today;
          dateInput.value = today;
          dateInput.focus();
        }
        return;
      }

      if (!name || !email) {
        if (window.showToast) window.showToast('Required Fields', 'Please complete your name and WhatsApp email.', 'crimson');
        return;
      }

      const passCode = 'PZ-PASS-' + Math.floor(100000 + Math.random() * 900000);
      const formContainer = document.getElementById('freePassFormWrap');
      const resultContainer = document.getElementById('freePassResultWrap');
      const passPhone = document.getElementById('passPhone')?.value || '';

      // Check localStorage for prior claimed passes by email
      const claimedPasses = JSON.parse(localStorage.getItem('powerzone_claimed_passes') || '[]');
      const hasClaimedBefore = claimedPasses.some(p =>
        (p.email && p.email.toLowerCase() === email.toLowerCase()) ||
        (passPhone && p.phone && p.phone.replace(/\D/g, '') === passPhone.replace(/\D/g, ''))
      );

      let passFee = 0;
      if (hasClaimedBefore) {
        passFee = 149;
        // Prompt user directly: nominal fee is generated, and order is confirmed. No UPI redirection!
        if (window.showToast) {
          window.showToast('Order Confirmed', 'Nominal fee is generated, and order is confirmed.', 'success');
        }
      } else {
        if (window.showToast) {
          window.showToast('Pass Confirmed', 'Your free VIP 1-day pass is confirmed and ready!', 'success');
        }
      }

      // Save to claimed passes in localStorage
      claimedPasses.push({
        code: passCode,
        name: name,
        email: email,
        phone: passPhone,
        branch: branch,
        date: date,
        fee: passFee,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('powerzone_claimed_passes', JSON.stringify(claimedPasses));

      // Cache pass details for txt file download
      window.currentPassData = {
        code: passCode,
        name: name,
        email: email,
        phone: passPhone,
        branch: branch,
        date: date,
        fee: passFee
      };

      // Log into PowerZone Supabase Persistent Cloud DB (Leads Table)
      if (window.PowerZoneDB && typeof window.PowerZoneDB.createLead === 'function') {
        window.PowerZoneDB.createLead({
          id: passCode,
          name: name,
          full_name: name,
          email: email,
          phone: passPhone,
          preferred_slot: `${branch} (${date})`,
          goal: passFee > 0 ? 'VIP 1-Day Pass (₹149 Paid)' : 'VIP 1-Day Gym Pass (Free)'
        }).catch(err => console.error('Error creating lead in Supabase:', err));
      } else if (window.PowerZoneDB && typeof window.PowerZoneDB.insert === 'function') {
        window.PowerZoneDB.insert('passes', {
          id: passCode,
          name: name,
          email: email,
          phone: passPhone,
          branch: branch,
          date: date,
          fee: passFee,
          status: 'Active'
        });
      }

      // Also record as confirmed order in PowerZoneDB so it shows in Orders & Passes
      if (window.PowerZoneDB && typeof window.PowerZoneDB.createOrder === 'function') {
        window.PowerZoneDB.createOrder({
          id: passCode,
          customer_name: name,
          phone: passPhone,
          city: branch.includes('Shirdi') ? 'Shirdi' : (branch.includes('Kopargaon') ? 'Kopargaon' : 'Rahata'),
          address: branch,
          pincode: '423109',
          item: passFee > 0 ? `PowerZone Day Pass (₹149 Nominal Fee - Valid ${date})` : `PowerZone VIP 1-Day Pass (Free - Valid ${date})`,
          price: passFee,
          payment_method: passFee > 0 ? 'Nominal Fee (Confirmed)' : 'Complimentary VIP Pass',
          status: 'Confirmed'
        }).catch(err => console.error('Error recording pass order in DB:', err));
      }

      if (formContainer && resultContainer) {
        formContainer.style.display = 'none';
        resultContainer.style.display = 'block';

        resultContainer.innerHTML = `
          <div class="gym-pass-ticket">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border-medium); padding-bottom: 0.75rem; margin-bottom: 1rem;">
              <span class="badge ${passFee > 0 ? 'badge-gold' : 'badge-crimson'}">${passFee > 0 ? 'POWERZONE DAY PASS (₹149)' : 'POWERZONE VIP PASS'}</span>
              <strong style="color: var(--secondary); font-family: var(--font-display);">${passCode}</strong>
            </div>

            ${passFee > 0 ? `
              <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid var(--accent-green, #10b981); border-radius: var(--radius-sm, 6px); padding: 0.6rem 0.85rem; margin-bottom: 0.85rem; font-size: 0.85rem; color: var(--accent-green, #10b981); font-weight: 700; text-align: center;">
                ✓ Nominal fee is generated, and order is confirmed.
              </div>
            ` : `
              <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid var(--accent-green, #10b981); border-radius: var(--radius-sm, 6px); padding: 0.6rem 0.85rem; margin-bottom: 0.85rem; font-size: 0.85rem; color: var(--accent-green, #10b981); font-weight: 700; text-align: center;">
                ✓ 100% Free VIP Pass Confirmed!
              </div>
            `}

            <div class="pass-qr-mock">
              <svg viewBox="0 0 100 100" fill="#0b0d11">
                <rect x="5" y="5" width="25" height="25" fill="#dc2626"/>
                <rect x="10" y="10" width="15" height="15" fill="#ffffff"/>
                <rect x="70" y="5" width="25" height="25" fill="#dc2626"/>
                <rect x="75" y="10" width="15" height="15" fill="#ffffff"/>
                <rect x="5" y="70" width="25" height="25" fill="#dc2626"/>
                <rect x="10" y="75" width="15" height="15" fill="#ffffff"/>
                <rect x="35" y="10" width="10" height="10"/>
                <rect x="50" y="20" width="15" height="10"/>
                <rect x="35" y="35" width="30" height="30" fill="#0b0d11"/>
                <rect x="42" y="42" width="16" height="16" fill="#dc2626"/>
                <rect x="70" y="40" width="20" height="10"/>
                <rect x="10" y="45" width="15" height="10"/>
                <rect x="40" y="75" width="20" height="15"/>
                <rect x="70" y="70" width="20" height="20"/>
              </svg>
            </div>

            <h3 style="color: var(--text-primary); font-size: 1.25rem; margin-bottom: 0.25rem;">${name}</h3>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">${branch}</p>
            <p style="font-size: 0.8rem; color: var(--primary); margin-top: 0.5rem; font-weight: 600;">Valid on: ${date} (Until Slotted Gym Hours 10:00 PM)</p>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Nagar-Manmad Highway, Shirdi</div>
          </div>

         <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.printPass({ passId: '${passCode}', name: '${name || 'VIP Member'}' })">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download Pass (.pdf)
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.pzModalMgr.closeModal('freePassModal')">Done</button>
          </div>
        `;

        if (window.showToast) {
          window.showToast('VIP Pass Ready!', `Welcome to PowerZone Shirdi, ${name}! Your pass code is active and logged in database.`, 'success');
        }
      }
    });
  }

  // --- 3-QUESTION WORKOUT FINDER QUIZ ---
  bindQuizEvents() {
    document.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = parseInt(btn.getAttribute('data-step'));
        const value = btn.getAttribute('data-value');

        this.quizAnswers[`step${step}`] = value;

        btn.parentElement.querySelectorAll('.quiz-opt-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        setTimeout(() => {
          this.nextQuizStep(step + 1);
        }, 220);
      });
    });
  }

  nextQuizStep(targetStep) {
    if (targetStep <= 3) {
      document.querySelectorAll('.quiz-step').forEach(stepEl => {
        stepEl.classList.remove('active');
      });
      const nextEl = document.getElementById(`quizStep${targetStep}`);
      if (nextEl) nextEl.classList.add('active');
    } else {
      this.calculateQuizResult();
    }
  }

  calculateQuizResult() {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const resultStep = document.getElementById('quizStepResult');
    if (!resultStep) return;

    resultStep.classList.add('active');

    const goal = this.quizAnswers.step1 || 'burn';
    let matchTitle = 'Burn & Build Conditioning';
    let matchDesc = 'High-octane agility, dumbbell complexes, sprint ergs, and sports stamina.';
    let matchCal = '850 kcal/session';
    let matchBadge = 'High Intensity';

    if (goal === 'strength') {
      matchTitle = 'Iron & Alloy Powerlifting';
      matchDesc = 'Olympic barbell mastery, heavy compound lifts (Squat, Bench, Deadlift), and raw physical power.';
      matchCal = '600 kcal/session';
      matchBadge = 'Raw Strength';
    } else if (goal === 'recovery') {
      matchTitle = 'Reset & Rebuild Mobility';
      matchDesc = 'Deep myofascial foam rolling, dynamic hip & shoulder mobility flows, and steam/ice bath recovery.';
      matchCal = '300 kcal/session';
      matchBadge = 'Restorative';
    } else if (goal === 'speed') {
      matchTitle = 'Velocity 30 Sprint Blitz';
      matchDesc = '30 minutes of unrelenting turf plyometrics, shuttle sprints, and kettlebell intervals designed for match agility.';
      matchCal = '550 kcal/session';
      matchBadge = 'Express Cardio';
    }

    const resultBox = document.getElementById('quizMatchOutput');
    if (resultBox) {
      resultBox.innerHTML = `
        <div style="background: var(--bg-card); border: 1px solid var(--border-glow); border-radius: var(--radius-lg); padding: 1.5rem; text-align: left; margin: 1.25rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <span class="badge badge-crimson">${matchBadge}</span>
            <span style="color: var(--secondary); font-weight: 700; font-size: 0.85rem;">${matchCal}</span>
          </div>
          <h3 style="font-size: 1.45rem; color: var(--text-primary); margin-bottom: 0.5rem;">${matchTitle}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 1.25rem;">${matchDesc}</p>
          <div style="background: var(--primary-subtle); border: 1px dashed var(--primary); border-radius: var(--radius-sm); padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary);">Shirdi Member Code: <strong style="color: var(--primary);">POWERZONE20</strong></span>
            <span style="font-size: 0.75rem; color: var(--secondary); font-weight: 700;">20% OFF Trials</span>
          </div>
        </div>
        <div style="display: flex; gap: 0.75rem; justify-content: center;">
          <a href="classes.html" class="btn btn-primary btn-sm" onclick="window.pzModalMgr.closeModal('workoutQuizModal')">View Class Schedule</a>
          <button class="btn btn-secondary btn-sm" onclick="window.pzModalMgr.resetQuiz()">Retake Quiz</button>
        </div>
      `;
    }
  }

  resetQuiz() {
    this.quizAnswers = {};
    document.querySelectorAll('.quiz-opt-btn').forEach(b => b.classList.remove('selected'));
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const step1 = document.getElementById('quizStep1');
    if (step1) step1.classList.add('active');
  }

  // --- TRIAL CLASS BOOKING MODAL ---
  openTrialBooking(className) {
    const classSelect = document.getElementById('trialClassSelect');
    if (classSelect && className) {
      const q = className.toLowerCase();
      let matched = false;
      for (let opt of classSelect.options) {
        if (opt.value.toLowerCase().includes(q) || q.includes(opt.value.toLowerCase())) {
          classSelect.value = opt.value;
          matched = true;
          break;
        }
      }
      if (!matched) classSelect.value = className;
    }
    this.openModal('trialBookingModal');
  }

  bindTrialBookingEvents() {
    const form = document.getElementById('trialBookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const className = document.getElementById('trialClassSelect').value;
      const trainer = document.getElementById('trialTrainerSelect').value;
      const timeSlot = document.getElementById('trialTimeSlot').value;
      const clientName = document.getElementById('trialName').value.trim();
      const email = document.getElementById('trialEmail')?.value.trim() || '';
      const phone = document.getElementById('trialPhone')?.value.trim() || '';

      if (!clientName) {
        if (window.showToast) window.showToast('Missing Info', 'Please enter your full name.', 'crimson');
        return;
      }

      // Check existing booked slots in localStorage before reserving (Requirement 6)
      const existingBookings = JSON.parse(localStorage.getItem('powerzone_class_bookings') || '[]');
      const hasSlotConflict = existingBookings.some(b => {
        const slotMatch = (b.timeSlot === timeSlot) || (b.timeSlot && timeSlot && b.timeSlot.slice(0, 5) === timeSlot.slice(0, 5));
        if (!slotMatch) return false;
        if (email && b.email) return b.email.toLowerCase() === email.toLowerCase();
        if (phone && b.phone) return b.phone.replace(/\D/g, '') === phone.replace(/\D/g, '');
        return true;
      });

      if (hasSlotConflict) {
        if (window.showToast) {
          window.showToast('Slot Conflict', 'You have already booked a class at this time slot', 'crimson');
        }
        return;
      }

      // Check if prior booking exists for nominal fee of ₹199 (Requirement 4)
      const hasPriorBooking = existingBookings.some(b =>
        (email && b.email && b.email.toLowerCase() === email.toLowerCase()) ||
        (phone && b.phone && b.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''))
      );

      let slotFee = 0;
      if (hasPriorBooking) {
        slotFee = 199;
        if (typeof window.triggerUPIPayment === 'function') {
          window.triggerUPIPayment(199, `PowerZone Class Slot (${className} - ${timeSlot})`);
        }
        if (window.showToast) {
          window.showToast('Nominal Slot Fee', 'A nominal slot fee of ₹199 applies to additional class reservations. Redirecting to UPI payment...', 'info');
        }
      }

      // Record booking to localStorage
      const trialId = 'PZ-TRL-' + Math.floor(10000 + Math.random() * 90000);
      const bookingRecord = {
        id: trialId,
        name: clientName,
        email: email,
        phone: phone,
        className: className,
        trainer: trainer,
        timeSlot: timeSlot,
        fee: slotFee,
        status: 'Confirmed',
        date: new Date().toISOString().split('T')[0]
      };
      existingBookings.push(bookingRecord);
      localStorage.setItem('powerzone_class_bookings', JSON.stringify(existingBookings));

      // Log into PowerZone Supabase Persistent Cloud DB (Leads Table)
      if (window.PowerZoneDB && typeof window.PowerZoneDB.createLead === 'function') {
        window.PowerZoneDB.createLead({
          id: trialId,
          name: clientName,
          full_name: clientName,
          email: email,
          phone: phone,
          preferred_slot: `${className} - ${timeSlot} (${trainer})`,
          goal: slotFee > 0 ? `${className} (₹199 Paid Slot)` : `${className} (Free Trial)`
        }).catch(err => console.error('Error logging trial lead in Supabase:', err));
      } else if (window.PowerZoneDB && typeof window.PowerZoneDB.insert === 'function') {
        window.PowerZoneDB.insert('bookings', {
          id: trialId,
          name: clientName,
          email: email,
          phone: phone,
          className: className,
          trainer: trainer,
          timeSlot: timeSlot,
          fee: slotFee,
          status: 'Confirmed'
        });
      }

      this.closeModal('trialBookingModal');

      if (window.showToast) {
        window.showToast('Trial Slot Reserved!', `Booked: ${className} with ${trainer} at ${timeSlot}${slotFee > 0 ? ' (₹199 nominal slot fee)' : ' (Logged in Database)'}.`, 'success');
      }
    });
  }

  // --- QUICK VIEW FOR SPORTS PRODUCTS ---
  openQuickView(productId) {
    if (typeof POWERZONE_PRODUCTS === 'undefined') return;
    const prod = POWERZONE_PRODUCTS.find(p => p.id === productId);
    if (!prod) return;

    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem; align-items: center;">
        <div style="border-radius: var(--radius-md); overflow: hidden; height: 260px; background: var(--bg-secondary);">
          <img src="${prod.image}" alt="${prod.name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div>
          <span class="badge badge-crimson" style="margin-bottom: 0.5rem;">${prod.badge}</span>
          <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--text-primary);">${prod.name}</h3>
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem; color: var(--secondary); font-size: 0.85rem;">
            <span>★ ${prod.rating}</span>
            <span style="color: var(--text-muted);">(${prod.reviews} Shirdi & regional athlete reviews)</span>
          </div>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1.25rem;">${prod.desc}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div>
              <span style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); font-family: var(--font-display);">₹${prod.price.toLocaleString('en-IN')}</span>
              ${prod.oldPrice ? `<span style="font-size: 0.95rem; color: var(--text-muted); text-decoration: line-through; margin-left: 0.5rem;">₹${prod.oldPrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <span style="color: var(--accent-green); font-size: 0.85rem; font-weight: 600;">✓ In Stock at Shirdi Store</span>
          </div>
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 0.5rem;">
            <button class="btn btn-primary" onclick="window.pzModalMgr.closeModal('quickViewModal'); window.placeDirectOrder('${prod.id}');">
              Place Order
            </button>
            <button class="btn btn-secondary" onclick="window.pzCart.addItem('${prod.id}', 1); window.pzModalMgr.closeModal('quickViewModal');">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;

    this.openModal('quickViewModal');
  }

  // --- EXPLORE MORE PREVIEW MODAL FOR WORKOUT SESSIONS (Requirement 4 & 5) ---
  openClassExplore(programId) {
    if (typeof POWERZONE_PROGRAM_DATA === 'undefined') return;
    const prog = POWERZONE_PROGRAM_DATA[programId];
    if (!prog) return;

    const modal = document.getElementById('sessionDetailModal');
    const content = document.getElementById('sessionDetailContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="session-detail-header" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <span class="badge badge-crimson">${prog.category}</span>
          <span class="badge badge-gold">${prog.intensity}</span>
        </div>
        <h2 style="font-size: 1.45rem; color: var(--text-primary); margin-bottom: 0.35rem;">${prog.fullTitle}</h2>
        <div style="display: flex; align-items: center; gap: 0.6rem; color: var(--text-secondary); font-size: 0.88rem;">
          <img src="${prog.coachImg}" alt="${prog.coach}" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">
          <span>Lead Coach: <strong style="color: var(--text-primary);">${prog.coach}</strong></span>
        </div>
      </div>

      <div class="class-specs" style="margin-bottom: 1.25rem; background: var(--bg-surface); padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: grid; grid-template-columns: repeat(3, 1fr); text-align: center;">
        <div>
          <div class="spec-val text-crimson" style="font-weight: 800; font-size: 1.15rem;">${prog.duration}</div>
          <div class="spec-key" style="font-size: 0.75rem; color: var(--text-muted);">Duration</div>
        </div>
        <div>
          <div class="spec-val text-gold" style="font-weight: 800; font-size: 1.15rem;">${prog.calories}</div>
          <div class="spec-key" style="font-size: 0.75rem; color: var(--text-muted);">Est. Burn</div>
        </div>
        <div>
          <div class="spec-val" style="font-weight: 800; font-size: 1.15rem; color: var(--text-primary);">${prog.capacity}</div>
          <div class="spec-key" style="font-size: 0.75rem; color: var(--text-muted);">Capacity</div>
        </div>
      </div>

      <div style="margin-bottom: 1.15rem;">
        <h4 style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem;">
          🎯 Target Muscle Groups & Systems
        </h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          ${prog.muscles.map(m => `<span class="badge badge-cyan" style="font-size: 0.76rem;">${m}</span>`).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.15rem;">
        <h4 style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem;">
          📋 Workout Structure & Progression
        </h4>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${prog.structure.map(s => `
            <div style="background: var(--bg-surface); border-left: 3px solid var(--primary); padding: 0.6rem 0.85rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
              <div style="font-size: 0.86rem; font-weight: 700; color: var(--text-primary);">${s.phase}</div>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.15rem; line-height: 1.4;">${s.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="margin-bottom: 1.15rem; background: var(--bg-surface); padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
        <h4 style="font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.25rem;">
          🏋️ Equipment Used
        </h4>
        <p style="font-size: 0.83rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
          ${prog.equipment}
        </p>
      </div>

      <div style="margin-bottom: 1.25rem; background: rgba(255, 149, 0, 0.08); border: 1px solid rgba(255, 149, 0, 0.25); padding: 0.85rem; border-radius: var(--radius-md);">
        <h4 style="font-size: 0.85rem; color: var(--secondary); margin-bottom: 0.25rem;">
          💡 Athlete Suitability Notes
        </h4>
        <p style="font-size: 0.83rem; color: var(--text-secondary); line-height: 1.45; margin: 0;">
          ${prog.suitability}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 0.75rem;">
        <button class="btn btn-primary btn-glow" style="width: 100%;" onclick="window.bookSessionFromModal('${prog.bookingKey}')">
          Book This Session (Free)
        </button>
        <button class="btn btn-secondary" style="width: 100%;" onclick="window.pzModalMgr.closeModal('sessionDetailModal')">
          Close Preview
        </button>
      </div>
    `;

    this.openModal('sessionDetailModal');
  }
}

// Global lookup data for training programs
window.POWERZONE_PROGRAM_DATA = {
  'burn-build': {
    name: 'Burn & Build',
    fullTitle: 'Burn & Build (50m Conditioning)',
    category: 'HIIT & METABOLIC',
    intensity: '🔥 High Intensity',
    duration: '50 Min',
    calories: '850 kcal',
    capacity: '12 Max',
    coach: 'Vikram Patil (CSCS)',
    coachImg: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=60&auto=format&fit=crop&q=80',
    muscles: ['Full Body', 'Quads & Hamstrings', 'Core & Obliques', 'Shoulders & Deltoids', 'Cardiovascular System'],
    structure: [
      { phase: 'Phase 1: Dynamic Primer & CNS Activation (8 min)', desc: 'Prehab band work, hip openers, thoracic mobility drills, and central nervous system activation.' },
      { phase: 'Phase 2: High-Density SkiErg & Runner Intervals (20 min)', desc: 'Anaerobic interval blocks on Concept2 SkiErgs and curved assault runners targeting VO2 max.' },
      { phase: 'Phase 3: Kettlebell & Dumbbell Metcon Circuits (15 min)', desc: 'Progressive EMOM rounds of kettlebell clean-and-press, thrusters, and explosive goblet squats.' },
      { phase: 'Phase 4: Parasympathetic Heart-Rate Reset (7 min)', desc: 'Controlled diaphragmatic breathing, spinal decompression, and active leg draining.' }
    ],
    equipment: 'Concept2 SkiErgs, Rogue curved assault runners, competition cast iron kettlebells, hex dumbbells, plyo boxes.',
    suitability: 'Ideal for athletes aiming to torch body fat, build lean definition, and dramatically increase metabolic work capacity. Full scaling options available.',
    bookingKey: 'Burn & Build'
  },
  'metabolic-rush': {
    name: 'Morning Metabolic Rush',
    fullTitle: 'Morning Metabolic Rush (35m Express)',
    category: 'HIIT & METABOLIC',
    intensity: '⚡ Express 35M',
    duration: '35 Min',
    calories: '550 kcal',
    capacity: '14 Max',
    coach: 'Vikram Patil (CSCS)',
    coachImg: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=60&auto=format&fit=crop&q=80',
    muscles: ['Total Body Conditioning', 'Core Stabilizers', 'Glutes & Calves', 'Heart & Lung Stamina'],
    structure: [
      { phase: 'Phase 1: Rapid 5-Min Dynamic Warm-up', desc: 'Joint lubrication, jumping jacks, shoulder dislocates, and bodyweight squats.' },
      { phase: 'Phase 2: 20-Min High-Velocity Tabata Rounds', desc: '8 rounds of 20s work / 10s rest across battle ropes, burpees, sled pushes, and slam balls.' },
      { phase: 'Phase 3: 7-Min Core Finisher', desc: 'Hollow body holds, plank saws, Russian twists, and hanging knee tucks.' },
      { phase: 'Phase 4: 3-Min Cool-Down & Hydration', desc: 'Full-body static stretching and hydration check.' }
    ],
    equipment: 'Heavy battle ropes, slam balls, turf sleds, bodyweight calisthenics rigs, medicine balls.',
    suitability: 'Perfect for Shirdi shop owners, students, and busy working professionals looking for max caloric burn before starting their daily routine.',
    bookingKey: 'Morning Metabolic Rush'
  },
  'iron-alloy': {
    name: 'Iron & Alloy',
    fullTitle: 'Iron & Alloy (Heavy Compounds)',
    category: 'BARBELL POWERLIFTING',
    intensity: '🏋️ Heavy Power',
    duration: '60 Min',
    calories: '600 kcal',
    capacity: '8 Max',
    coach: 'Rohit Shinde (State Powerlifter)',
    coachImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    muscles: ['Posterior Chain', 'Quadriceps', 'Pectorals & Triceps', 'Latissimus Dorsi', 'Spinal Erectors & Core Bracing'],
    structure: [
      { phase: 'Phase 1: Biomechanical Prep & Barbell Primer (10 min)', desc: 'Hip capsule distraction, thoracic spine extension, empty bar positional cues, and progressive ramp-up sets.' },
      { phase: 'Phase 2: Competition Compound Working Sets (28 min)', desc: 'Heavy working sets of Squats, Bench Press, or Deadlifts following RPE-calibrated percentage loads.' },
      { phase: 'Phase 3: Hypertrophy & Stability Accessories (15 min)', desc: 'Pendlay rows, Romanian deadlifts, Bulgarian split squats, and overhead barbell pressing.' },
      { phase: 'Phase 4: Spine Decompression & Intra-Abdominal Release (7 min)', desc: 'Inversion hanging, lat hang stretches, and posterior chain release.' }
    ],
    equipment: 'IPF-standard combo racks, 20kg competition Olympic barbells, calibrated steel powerlifting plates, magnesium block chalk.',
    suitability: 'Engineered for athletes seeking serious absolute strength, PR progression, and tendon density under professional barbell supervision.',
    bookingKey: 'Iron & Alloy'
  },
  'strength-5x5': {
    name: '5x5 Strength Foundation',
    fullTitle: '5x5 Strength Foundation (Beginner-Friendly)',
    category: 'BARBELL POWERLIFTING',
    intensity: '💪 Foundational Strength',
    duration: '45 Min',
    calories: '480 kcal',
    capacity: '10 Max',
    coach: 'Rohit Shinde (State Powerlifter)',
    coachImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    muscles: ['Full Body Foundation', 'Legs & Hips', 'Upper Back & Chest', 'Grip & Core Stability'],
    structure: [
      { phase: 'Phase 1: Form & Safety Alignment Tutorial (8 min)', desc: 'Foot stance, grip width, scapular retraction, and intra-abdominal bracing instruction.' },
      { phase: 'Phase 2: 5x5 Linear Compound Working Sets (22 min)', desc: '5 disciplined sets of 5 repetitions with controlled tempo and strict coach feedback on every rep.' },
      { phase: 'Phase 3: Postural Correctives (10 min)', desc: 'Face pulls, band pull-aparts, dumbbell farmer carries, and glute bridges.' },
      { phase: 'Phase 4: Mobility & Lifting Log Review (5 min)', desc: 'Logging session weights into personal training logbook and cool-down.' }
    ],
    equipment: 'Standard Olympic barbells, safety squat stands, flat lifting benches, bumper plates, resistance loop bands.',
    suitability: 'The gold standard starting point for gym novices, teenagers, and newcomers who want to learn compound lifting with pristine form and zero injury risk.',
    bookingKey: '5x5 Strength Foundation'
  },
  'reset-rebuild': {
    name: 'Reset & Rebuild',
    fullTitle: 'Reset & Rebuild (Myofascial + Steam)',
    category: 'MOBILITY & STEAM',
    intensity: '🧘 Restorative Recovery',
    duration: '45 Min',
    calories: '300 kcal',
    capacity: '10 Max',
    coach: 'Dr. Alok Kulkarni (MPT, Sports Rehab)',
    coachImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
    muscles: ['Thoracic Spine', 'Hip Flexors & Glutes', 'Shoulder Rotator Cuff', 'Plantar Fascia', 'Whole Myofascial System'],
    structure: [
      { phase: 'Phase 1: Deep Myofascial Foam Rolling (12 min)', desc: 'Targeted trigger point therapy for calves, IT bands, lats, and piriformis using high-density rollers and lacrosse balls.' },
      { phase: 'Phase 2: Functional Joint Articulations (18 min)', desc: 'Controlled articular rotations (CARs) for hips, ankles, and glenohumeral joints to restore full range of motion.' },
      { phase: 'Phase 3: Box Breathing & Vagus Nerve Stimulation (10 min)', desc: 'Rhythmic 4-4-4-4 nasal breathing to transition nervous system into anabolic recovery state.' },
      { phase: 'Phase 4: Thermal Eucalyptus Infrared Steam Session (Optional 15 min)', desc: 'Heat therapy in PowerZone’s specialized steam suite to relax deep tissue and flush metabolites.' }
    ],
    equipment: 'High-density foam rollers, lacrosse massage balls, heavy stretch bands, yoga blocks, specialized eucalyptus steam sauna.',
    suitability: 'Essential for hard-training athletes preventing burnout, individuals with restricted mobility, and anyone seeking complete body rejuvenation.',
    bookingKey: 'Reset & Rebuild'
  },
  'desk-recovery': {
    name: 'Post-Work Back & Joint Relief',
    fullTitle: 'Post-Work Back & Joint Relief (40m Desk Recovery)',
    category: 'MOBILITY & STEAM',
    intensity: '🌿 Pain-Free Decompression',
    duration: '40 Min',
    calories: '250 kcal',
    capacity: '12 Max',
    coach: 'Dr. Alok Kulkarni (MPT, Sports Rehab)',
    coachImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80',
    muscles: ['Lumbar & Cervical Spine', 'Psoas & Hip Flexors', 'Upper Trapezius & Neck', 'Gluteus Medius'],
    structure: [
      { phase: 'Phase 1: Spinal Unloading & Wave Decompression (8 min)', desc: 'Gentle spinal traction, pelvic tilts, and thoracic rotations to reverse the effects of prolonged sitting.' },
      { phase: 'Phase 2: Deep Hip & Psoas Lengthening (14 min)', desc: 'Half-kneeling couch stretches, pigeon poses, and gentle hamstring traction.' },
      { phase: 'Phase 3: Scapular Retraction & Neck Tension Relief (10 min)', desc: 'Wall angels, chin tucks, levator scapulae releases, and gentle isometric neck strengthening.' },
      { phase: 'Phase 4: Soothing Infrared Steam & Posture Guidance (8 min)', desc: 'Warm sauna relaxation and personalized ergonomic tips for daily work life.' }
    ],
    equipment: 'Extra-thick padded mats, trigger point therapy balls, cervical traction straps, yoga bolsters, eucalyptus steam room.',
    suitability: 'Engineered specifically for local desk workers, teachers, bank employees, and drivers suffering from sedentary posture strain and lower back stiffness.',
    bookingKey: 'Post-Work Back & Joint Relief'
  },
  'velocity-30': {
    name: 'Velocity 30',
    fullTitle: 'Velocity 30 (Speed & Jumps)',
    category: 'TURF & CRICKET AGILITY',
    intensity: '⚡ Extreme Agility',
    duration: '30 Min',
    calories: '550 kcal',
    capacity: '12 Max',
    coach: 'Anjali Deshmukh (Athletic Conditioning)',
    coachImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=80',
    muscles: ['Fast-Twitch Muscle Fibers', 'Calves & Achilles Tendons', 'Quads & Glute Maxima', 'Reactive Core'],
    structure: [
      { phase: 'Phase 1: Dynamic Ankle Prehab & A-Skip Drills (6 min)', desc: 'Pogo jumps, ankle stiffness drills, and sprint posture mechanical checks.' },
      { phase: 'Phase 2: Plyometric Box & Broad Jump Explosiveness (10 min)', desc: 'Depth drops, hurdle hops, and single-leg bounds to develop reactive power and elastic energy.' },
      { phase: 'Phase 3: Turf Sled Shuttles & Deceleration Drills (10 min)', desc: '5-10-5 pro-agility shuttle runs, reactive cone cuts, and weighted sled sprints on synthetic turf.' },
      { phase: 'Phase 4: Plantar Cool-Down & Joint Stability (4 min)', desc: 'Barefoot turf walks, calf wall stretches, and breathing recovery.' }
    ],
    equipment: 'Synthetic turf sprint track, plyometric wooden boxes, agility hurdles, reactive cones, weighted prowler sleds.',
    suitability: 'Built for cricket fielders, badminton shuttle chasers, and sprinters seeking lightning acceleration, foot speed, and rapid deceleration.',
    bookingKey: 'Velocity 30'
  },
  'bowler-batsman-stamina': {
    name: 'Pace Bowler & Batsman Stamina',
    fullTitle: 'Pace Bowler & Batsman Stamina (45m Turf Conditioning)',
    category: 'TURF & CRICKET AGILITY',
    intensity: '🏏 Match Conditioning',
    duration: '45 Min',
    calories: '700 kcal',
    capacity: '10 Max',
    coach: 'Anjali Deshmukh (Athletic Conditioning)',
    coachImg: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&auto=format&fit=crop&q=80',
    muscles: ['Rotator Cuff & Latissimus Dorsi', 'Posterior Oblique Sling', 'Core Rotational Power', 'Hamstrings & Groin'],
    structure: [
      { phase: 'Phase 1: Bowling Shoulder & Rotational Core Warm-Up (8 min)', desc: 'Tubing internal/external rotations, prone Y-T-Ws, and dynamic hip swivel flows.' },
      { phase: 'Phase 2: 22-Yard Run-Up & Repeat Sprint Interval Endurance (15 min)', desc: 'Simulated 6-ball over sprint repeats with measured rest periods replicating bowling spells and running between wickets.' },
      { phase: 'Phase 3: Medicine Ball Rotational Power & Deceleration Slams (15 min)', desc: 'Side-to-side shot put throws, kneeling woodchops, and anti-rotational Pallof presses.' },
      { phase: 'Phase 4: Bowling Arm Care & Hamstring Lengthening (7 min)', desc: 'Shoulder sleeper stretches, band hamstring distraction, and recovery tracking.' }
    ],
    equipment: '22-yard synthetic turf strip, heavy medicine balls, resistance cords, agility poles, sprint timing gates.',
    suitability: 'Specifically built for Shirdi & Ahmednagar district tournament cricket players wanting peak spell speed and batting stamina under the hot sun.',
    bookingKey: 'Pace Bowler & Batsman Stamina'
  }
};

window.bookSessionFromModal = function(programKey) {
  if (window.pzModalMgr) {
    window.pzModalMgr.closeModal('sessionDetailModal');
    window.pzModalMgr.openTrialBooking(programKey);
  }
};

window.openClassDetail = function(programId) {
  if (window.pzModalMgr) {
    window.pzModalMgr.openClassExplore(programId);
  }
};

window.printPass = function (code) {
  // 1. Check if jsPDF library is loaded
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF generator is loading. Please try again in a second.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const p = window.currentPassData || {};
  const passCode = (typeof code === 'object' ? code.passId : code) || p.code || ('PZ-PASS-' + Math.floor(100000 + Math.random() * 900000));
  const name = (typeof code === 'object' ? code.name : null) || p.name || 'Valued Athlete';
  const branch = p.branch || 'PowerZone Shirdi Central (Nagar-Manmad Hwy)';
  const date = p.date || new Date().toISOString().split('T')[0];
  const feeLabel = (p.fee && p.fee > 0) ? `Day Pass Nominal Fee: Rs. ${p.fee}` : 'Complimentary VIP Access (Free)';

  // 2. Initialize compact VIP Pass Card (105mm x 148mm - A6 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [105, 148]
  });

  // Dark luxury background
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, 105, 148, 'F');

  // Red accent border
  doc.setDrawColor(229, 9, 20);
  doc.setLineWidth(0.8);
  doc.roundedRect(5, 5, 95, 138, 3, 3, 'D');

  // Brand Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(229, 9, 20);
  doc.text('POWERZONE GYM & FITNESS', 52.5, 15, { align: 'center' });

  doc.setFontSize(9);
  doc.setTextColor(255, 165, 0); // Gold accent
  doc.text('VIP ENTRY PASS', 52.5, 21, { align: 'center' });

  // Divider
  doc.setDrawColor(45, 45, 50);
  doc.line(10, 25, 95, 25);

  // Pass Reference Code Box
  doc.setFillColor(25, 25, 30);
  doc.roundedRect(12, 28, 81, 12, 2, 2, 'F');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`PASS ID: ${passCode}`, 52.5, 35.5, { align: 'center' });

  // Athlete Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 165);
  doc.text('PASS HOLDER', 52.5, 46, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(name, 52.5, 53, { align: 'center' });

  // Access Tier & Branch
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(229, 9, 20);
  doc.text(feeLabel, 52.5, 60, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(180, 180, 180);
  doc.text(branch, 52.5, 66, { align: 'center' });

  // Validity Box
  doc.setFillColor(30, 15, 18);
  doc.setDrawColor(229, 9, 20);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, 71, 81, 14, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(229, 9, 20);
  doc.text(`Valid on: ${date}`, 52.5, 77, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(200, 200, 200);
  doc.text('(Until Slotted Gym Hours 10:00 PM)', 52.5, 82, { align: 'center' });

  // Guidelines Section
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('ACCESS GUIDELINES', 14, 93);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(150, 150, 155);
  doc.text('- Display this digital PDF pass at the front desk.', 14, 98);
  doc.text('- Full access to free weights, machines & locker amenities.', 14, 103);
  doc.text('- Athletic training shoes and proper workout attire required.', 14, 108);

  // Footer / Contact
  doc.setDrawColor(45, 45, 50);
  doc.line(10, 116, 95, 116);

  doc.setFontSize(6.8);
  doc.setTextColor(130, 130, 135);
  doc.text('Nagar-Manmad Highway, Shirdi, Maharashtra 423109', 52.5, 122, { align: 'center' });
  doc.text('+91 94222 01823 | powerzone.fit', 52.5, 127, { align: 'center' });

  doc.setFontSize(6);
  doc.setTextColor(90, 90, 95);
  doc.text(`Issued: ${new Date().toLocaleString('en-IN')}`, 52.5, 134, { align: 'center' });

  // 3. Save as PDF
  doc.save(`PowerZone-VIP-Pass-${passCode}.pdf`);

  if (window.showToast) {
    window.showToast('Pass Downloaded', `PowerZone-VIP-Pass-${passCode}.pdf downloaded successfully.`, 'success');
  }
};

window.pzModalMgr = new PowerZoneModalManager();
window.modalMgr = window.pzModalMgr;