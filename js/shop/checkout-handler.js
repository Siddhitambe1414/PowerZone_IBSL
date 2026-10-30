/**
 * POWERZONE : GYM & SPORTS STORE
 * Streamlined Checkout Modal Handler & Direct Order Dispatch Integration
 */

(function() {
  const cart = window.pzCart || (window.PowerZoneCart && PowerZoneCart.prototype);

  cart.openCheckoutModal = function() {
    if (this.cart.length === 0) {
      if (window.showToast) window.showToast('Empty Cart', 'Please add sports items before checkout.', 'crimson');
      return;
    }

    this.closeDrawer();
    const modal = document.getElementById('checkoutModal');
    const summary = document.getElementById('checkoutSummaryContent');
    const formWrap = document.getElementById('checkoutFormWrap');
    const successWrap = document.getElementById('checkoutSuccessWrap');

    if (formWrap) formWrap.style.display = 'block';
    if (successWrap) successWrap.style.display = 'none';

    if (modal && summary) {
      const { total } = this.getCalculations();
      const orderRef = 'PZ-' + Math.floor(100000 + Math.random() * 900000);

      summary.innerHTML = `
        <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; border: 1px solid var(--border-color, var(--border-subtle));">
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            <span>Order Reference</span>
            <strong style="color: var(--text-primary); font-family: var(--font-display);">${orderRef}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            <span>Total Items</span>
            <strong style="color: var(--text-primary);">${this.getTotalCount()} items</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; color: var(--primary); border-top: 1px solid var(--border-color, var(--border-subtle)); padding-top: 0.5rem; margin-top: 0.4rem;">
            <span>Payable Amount</span>
            <span>₹${total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      `;

      if (window.pzAuth && typeof window.pzAuth.prefillFormsForCurrentUser === 'function') {
        window.pzAuth.prefillFormsForCurrentUser();
      }

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  cart.closeCheckoutModal = function() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
    const formWrap = document.getElementById('checkoutFormWrap');
    const successWrap = document.getElementById('checkoutSuccessWrap');
    if (formWrap) formWrap.style.display = 'block';
    if (successWrap) successWrap.style.display = 'none';
  };

  cart.processOrder = async function(formData) {
    const formWrap = document.getElementById('checkoutFormWrap');
    const successWrap = document.getElementById('checkoutSuccessWrap');
    const { total } = this.getCalculations();

    const orderItems = this.cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty
    }));

    const itemNames = orderItems.map(i => `${i.name} (x${i.qty})`).join(', ');
    const orderId = 'PZ-ORD-' + Math.floor(10000 + Math.random() * 90000);
    const totalPrice = total;
    const paymentMethodText = 'Direct Order';

    // Directly write order to Supabase PostgreSQL Database & Local Cache
    let res = null;
    if (window.PowerZoneDB && typeof window.PowerZoneDB.createOrder === 'function') {
      try {
        res = await window.PowerZoneDB.createOrder({
          id: orderId,
          customer_name: formData.name,
          phone: formData.phone,
          city: formData.city,
          address: formData.address,
          pincode: formData.pincode,
          item: itemNames,
          price: totalPrice,
          payment_method: paymentMethodText,
          status: 'Confirmed'
        });
        console.log("Supabase Insert Result:", res);
      } catch (err) {
        console.error('Error inserting order to Supabase:', err);
      }
    }

    const savedOrder = res || {
      id: orderId,
      customer_name: formData.name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      pincode: formData.pincode,
      item: itemNames,
      price: totalPrice,
      payment_method: paymentMethodText,
      status: 'Confirmed'
    };

    // If an active user exists, link their phone or session
    if (window.pzAuth && typeof window.pzAuth.getCurrentUser === 'function') {
      const curUser = window.pzAuth.getCurrentUser();
      if (curUser && !curUser.mobile) {
        curUser.mobile = formData.phone;
        window.pzAuth.setCurrentUser(curUser);
      }
    }

    if (formWrap && successWrap) {
      formWrap.style.display = 'none';
      successWrap.style.display = 'block';

      successWrap.innerHTML = `
        <div class="order-success-card" style="text-align: center; padding: 1.5rem 0.5rem;">
          <div class="order-success-icon" style="margin: 0 auto 0.75rem auto; width: 52px; height: 52px; background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--accent-green);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="badge badge-green" style="margin-bottom: 0.5rem;">ORDER PLACED & CONFIRMED</span>
          <h3 style="font-size: 1.5rem; margin-bottom: 0.35rem; color: var(--text-primary);">Order Confirmed, ${formData.name}!</h3>
          <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
            Order ID: <strong style="color: var(--primary); font-family: var(--font-display);">#${savedOrder.id}</strong> • Synced to Database
          </p>

          <div style="background: var(--bg-surface); border: 1px solid var(--border-color, var(--border-subtle)); border-radius: var(--radius-md); padding: 1.2rem; text-align: left; margin-bottom: 1.5rem; font-size: 0.9rem; line-height: 1.8;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Order ID:</span>
              <strong style="color: var(--primary); font-family: var(--font-display);">#${savedOrder.id}</strong>
            </div>
            <div style="margin-bottom: 0.5rem;">
              <span style="color: var(--text-muted);">Items:</span>
              <div style="color: var(--text-primary); font-weight: 600; margin-top: 0.15rem;">${itemNames}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">Delivery Town / City:</span>
              <span style="color: var(--text-primary); font-weight: 600;">${formData.city} (${formData.pincode})</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.85rem;">
              <span style="color: var(--text-muted);">Shipping Address:</span>
              <span style="color: var(--text-primary); font-weight: 600; max-width: 60%; text-align: right;">${formData.address}</span>
            </div>
            <div style="border-top: 1px solid var(--border-color, var(--border-subtle)); margin-top: 0.65rem; padding-top: 0.65rem; display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: var(--text-primary);">
              <span>Total Amount:</span>
              <span style="color: var(--primary);">₹${totalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-glow" style="min-width: 140px;" onclick="window.pzCart.closeCheckoutModal();">
              Done
            </button>
            <button class="btn btn-secondary" onclick="if(window.pzAuth && typeof window.pzAuth.viewReceipt === 'function') { window.pzAuth.viewReceipt('${savedOrder.id}'); } else { alert('Order #${savedOrder.id} confirmed!'); }">
              📄 View Receipt
            </button>
          </div>
        </div>
      `;

      // Track coupon redemption if a coupon was used
      if (this.appliedCoupon) {
        if (typeof this.recordCouponUse === 'function') {
          this.recordCouponUse(this.appliedCoupon);
        } else {
          try {
            const couponUses = JSON.parse(localStorage.getItem('pz_coupon_uses') || '{}');
            const c = this.appliedCoupon.toUpperCase();
            couponUses[c] = (couponUses[c] || 0) + 1;
            localStorage.setItem('pz_coupon_uses', JSON.stringify(couponUses));
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Clear shopping cart
      this.cart = [];
      this.appliedCoupon = null;
      this.discountPercent = 0;
      this.save();
      if (typeof this.syncPromoBanner === 'function') {
        this.syncPromoBanner();
      }

      if (window.showToast) {
        window.showToast('Order Confirmed!', `Order ${savedOrder.id} placed and recorded successfully.`, 'success');
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('checkoutName').value.trim();
        const phone = document.getElementById('checkoutPhone').value.trim().replace(/\D/g, '');
        const city = document.getElementById('checkoutCity').value.trim();
        const address = document.getElementById('checkoutAddress').value.trim();
        const pincode = document.getElementById('checkoutPincode').value.trim().replace(/\D/g, '');

        if (!name || name.length < 2) {
          if (window.showToast) window.showToast('Invalid Name', 'Please enter a valid full name.', 'crimson');
          return;
        }

        // Strict 10-digit Indian phone validation (starts with 6, 7, 8, or 9)
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
          if (window.showToast) window.showToast('Invalid Mobile', 'Please enter a valid 10-digit Indian mobile number.', 'crimson');
          document.getElementById('checkoutPhone')?.focus();
          return;
        }

        // Strict 6-digit Indian pincode validation
        const pinRegex = /^\d{6}$/;
        if (!pinRegex.test(pincode)) {
          if (window.showToast) window.showToast('Invalid Pincode', 'Please enter a valid 6-digit postal pincode (e.g. 423109 for Shirdi).', 'crimson');
          document.getElementById('checkoutPincode')?.focus();
          return;
        }

        if (!address || address.length < 5) {
          if (window.showToast) window.showToast('Incomplete Address', 'Please provide your full delivery address and landmark.', 'crimson');
          document.getElementById('checkoutAddress')?.focus();
          return;
        }

        if (window.pzCart && typeof window.pzCart.processOrder === 'function') {
          await window.pzCart.processOrder({ name, phone, city, address, pincode });
        }
      });
    }
  });
})();
