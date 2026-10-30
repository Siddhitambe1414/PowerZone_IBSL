/**
 * POWERZONE : GYM & SPORTS STORE
 * BMI & Maintenance Calorie Calculator (Home Page)
 */

document.addEventListener('DOMContentLoaded', () => {
  bindBmiCalculatorEvents();
});

function bindBmiCalculatorEvents() {
  const form = document.getElementById('bmiCalculatorForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value);
    const age = parseInt(document.getElementById('bmiAge').value) || 25;
    const gender = document.getElementById('bmiGender')?.value || 'male';
    const goal = document.getElementById('bmiGoal')?.value || 'fat_loss';
    const activity = document.getElementById('bmiActivity')?.value || 'moderate';

    if (!weight || !height || height <= 0 || weight <= 0) {
      if (window.showToast) window.showToast('Invalid Input', 'Please enter valid height and weight.', 'crimson');
      return;
    }

    const heightM = height / 100;
    const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));

    let category = 'Normal / Athletic Range';
    let categoryClass = 'badge-green';
    let fillPercent = 50;

    if (bmi < 18.5) {
      category = 'Underweight';
      categoryClass = 'badge-cyan';
      fillPercent = 25;
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      category = 'Normal / Athletic Range';
      categoryClass = 'badge-green';
      fillPercent = 50;
    } else if (bmi >= 25.0 && bmi <= 29.9) {
      category = 'Overweight / Bulking Range';
      categoryClass = 'badge-gold';
      fillPercent = 75;
    } else {
      category = 'High Body Mass Index';
      categoryClass = 'badge-crimson';
      fillPercent = 90;
    }

    // Calculate BMR (Mifflin-St Jeor)
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    bmr = gender === 'female' ? (bmr - 161) : (bmr + 5);

    let activityMult = 1.45; // moderate (2-3 days)
    if (activity === 'sedentary') activityMult = 1.2;
    if (activity === 'athlete') activityMult = 1.75;

    const tdee = Math.round(bmr * activityMult);

    // Goal adjustments for Calories & Protein
    let dailyCalories = tdee;
    let proteinTarget = Math.round(weight * 1.8);
    let program = 'Iron & Alloy';
    let programSubtitle = 'Barbell Powerlifting';
    let planDesc = 'Focus on progressive overload barbell compounds (Squat, Bench, Deadlift) and functional strength.';
    let goalLabel = 'Fat Loss & Lean Muscle';

    if (goal === 'fat_loss') {
      goalLabel = 'Fat Loss & Lean Muscle';
      // 400-500 kcal deficit, but not below BMR
      dailyCalories = Math.max(Math.round(tdee - 450), Math.round(bmr));
      proteinTarget = Math.round(weight * 2.2); // 2.2g/kg to preserve lean tissue
      if (bmi >= 25 || activity === 'sedentary') {
        program = 'Burn & Build';
        programSubtitle = '50m Metabolic Conditioning';
        planDesc = 'High-energy interval conditioning, SkiErg circuits, and structured caloric deficit to incinerate body fat while building lean definition.';
      } else {
        program = 'Morning Metabolic Rush';
        programSubtitle = '35m Express Conditioning';
        planDesc = 'Fast-paced morning conditioning combining kettlebell complexes, assault runners, and high-intensity metabolic intervals.';
      }
    } else if (goal === 'strength') {
      goalLabel = 'Strength & Powerlifting';
      dailyCalories = Math.round(tdee + 350); // slight surplus for strength PRs
      proteinTarget = Math.round(weight * 2.0); // 2.0g/kg
      if (bmi < 22 || activity === 'sedentary') {
        program = '5x5 Strength Foundation';
        programSubtitle = 'Beginner-Friendly Compounds';
        planDesc = 'Master the Big 3 powerlifting compounds with guided linear progression, Olympic barbells, and calibrated bumper plates.';
      } else {
        program = 'Iron & Alloy';
        programSubtitle = 'Heavy Barbell Compounds';
        planDesc = 'Championship barbell powerlifting focusing on competition-spec squat, bench, and deadlift technique with personalized coaching cues.';
      }
    } else {
      // General Fitness & Agility
      goalLabel = 'General Fitness & Agility';
      dailyCalories = tdee;
      proteinTarget = Math.round(weight * 1.6);
      if (activity === 'athlete') {
        program = 'Velocity 30';
        programSubtitle = 'Speed & Turf Jumps';
        planDesc = 'High-octane plyometric box jumps, turf sprint shuttles, and deceleration drills built for cricket, badminton, and turf athletes.';
      } else if (bmi >= 27) {
        program = 'Post-Work Back & Joint Relief';
        programSubtitle = '40m Desk Recovery';
        planDesc = 'Joint decompression, spine mobilization, thoracic openers, and thermal infrared steam to restore posture and eliminate aches.';
      } else {
        program = 'Reset & Rebuild';
        programSubtitle = 'Myofascial + Steam';
        planDesc = 'Comprehensive mobility routines, myofascial foam rolling, and post-session steam therapy for deep recovery and joint health.';
      }
    }

    const resultBox = document.getElementById('bmiResultContainer');
    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div class="bmi-result-box" style="margin-top: 1.5rem; text-align: center;">
          <div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
            <span class="badge ${categoryClass}">${category}</span>
            <span class="badge badge-gold">${goalLabel}</span>
          </div>
          <div class="bmi-score-number">${bmi} <span style="font-size: 1rem; font-weight: 600; color: var(--text-muted);">BMI Score</span></div>
          
          <div class="bmi-bar-track">
            <div class="bmi-bar-fill" style="width: ${fillPercent}%;"></div>
          </div>

          <div class="bmi-metric-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.65rem; margin: 1rem 0;">
            <div class="bmi-mini-card">
              <div class="bmi-mini-val">${dailyCalories.toLocaleString('en-IN')}</div>
              <div class="bmi-mini-label">Target Calories (kcal/day)</div>
            </div>
            <div class="bmi-mini-card">
              <div class="bmi-mini-val" style="color: var(--accent-green);">${proteinTarget}g</div>
              <div class="bmi-mini-label">Protein Target (g/day)</div>
            </div>
            <div class="bmi-mini-card">
              <div class="bmi-mini-val" style="color: var(--secondary); font-size: 0.95rem;">${program}</div>
              <div class="bmi-mini-label">Recommended Discipline</div>
            </div>
          </div>

          <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem; text-align: left; margin-top: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; flex-wrap: wrap; gap: 0.3rem;">
              <h4 style="font-size: 0.95rem; color: var(--text-primary); margin: 0;">Athletic Blueprint: ${program}</h4>
              <span style="font-size: 0.78rem; color: var(--primary); font-weight: 700;">${programSubtitle}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${planDesc}</p>
          </div>

          <div style="display: flex; gap: 0.75rem; justify-content: center; margin-top: 1.25rem; flex-wrap: wrap;">
            <button class="btn btn-primary btn-sm" onclick="window.pzModalMgr.closeModal('bmiCalculatorModal'); if(window.pzModalMgr && typeof window.pzModalMgr.openTrialBooking === 'function') { window.pzModalMgr.openTrialBooking('${program}'); } else { window.location.href='classes.html'; }">
              Book Free Trial for ${program}
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.pzModalMgr.closeModal('bmiCalculatorModal');">
              Done
            </button>
          </div>
        </div>
      `;

      if (window.showToast) {
        window.showToast('Blueprint Generated!', `BMI: ${bmi} • Target: ${dailyCalories} kcal • Protein: ${proteinTarget}g`, 'success');
      }
    }
  });
}
