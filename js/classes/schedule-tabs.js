/**
 * POWERZONE : GYM & SPORTS STORE
 * Schedule Tabs & FAQs Accordion Controller (classes.html)
 */

document.addEventListener('DOMContentLoaded', () => {
  initFaqAccordion();
  initScheduleConflictGuard();
});

function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Class Slot Conflict Prevention (Requirement 6)
 * Checks existing booked slots in localStorage before reserving.
 */
function initScheduleConflictGuard() {
  const trialForm = document.getElementById('trialBookingForm');
  if (trialForm) {
    trialForm.addEventListener('submit', (e) => {
      const timeSlot = document.getElementById('trialTimeSlot')?.value || '';
      const email = (document.getElementById('trialEmail')?.value || '').trim().toLowerCase();
      const phone = (document.getElementById('trialPhone')?.value || '').trim().replace(/\D/g, '');

      const existingBookings = JSON.parse(localStorage.getItem('powerzone_class_bookings') || '[]');
      const hasConflict = existingBookings.some(b => {
        const slotMatch = (b.timeSlot === timeSlot) || (b.timeSlot && timeSlot && b.timeSlot.slice(0, 5) === timeSlot.slice(0, 5));
        if (!slotMatch) return false;
        if (email && b.email) return b.email.toLowerCase() === email;
        if (phone && b.phone) return b.phone.replace(/\D/g, '') === phone;
        return true;
      });

      if (hasConflict) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (window.showToast) {
          window.showToast('Slot Conflict', 'You have already booked a class at this time slot', 'crimson');
        }
        return false;
      }
    }, true);
  }

  // Pre-check when clicking schedule table buttons
  document.querySelectorAll('.schedule-table button[data-book-class]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tr = btn.closest('tr');
      const timeText = tr ? tr.querySelector('td strong')?.textContent.trim() : '';
      if (!timeText) return;

      const user = window.pzAuth && typeof window.pzAuth.getCurrentUser === 'function' ? window.pzAuth.getCurrentUser() : null;
      const userEmail = (user?.email || '').toLowerCase();
      const userPhone = (user?.mobile || '').replace(/\D/g, '');

      const existingBookings = JSON.parse(localStorage.getItem('powerzone_class_bookings') || '[]');
      const hasConflict = existingBookings.some(b => {
        const slotMatch = b.timeSlot && b.timeSlot.includes(timeText);
        if (!slotMatch) return false;
        if (userEmail && b.email) return b.email.toLowerCase() === userEmail;
        if (userPhone && b.phone) return b.phone.replace(/\D/g, '') === userPhone;
        return true;
      });

      if (hasConflict) {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (window.showToast) {
          window.showToast('Slot Conflict', 'You have already booked a class at this time slot', 'crimson');
        }
        return false;
      }

      const slotSelect = document.getElementById('trialTimeSlot');
      if (slotSelect) {
        for (let opt of slotSelect.options) {
          if (opt.value.includes(timeText)) {
            slotSelect.value = opt.value;
            break;
          }
        }
      }
    }, true);
  });
}
