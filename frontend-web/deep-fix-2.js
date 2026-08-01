const fs = require('fs');

const enFile = 'src/i18n/locales/en.json';
const idFile = 'src/i18n/locales/id.json';
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const id = JSON.parse(fs.readFileSync(idFile, 'utf8'));

// Remaining toast messages with tone: "success" are code values (not translatable).
// Remaining CSS classes (translate-x-6, bg-blue-600, blur(24px), uppercase) are NOT translatable.
// Remaining date format options (short, numeric) are Intl.DateTimeFormat options, NOT translatable.
// Badge keys (perfect-attendance, eligible-input, etc.) are internal CSS/key values, NOT translatable.
// "HiveEdu" and "Analytics" are brand names, NOT translatable.
// OnboardingTour positions (body, center, right, bottom, top, main) are Joyride config, NOT translatable.
// Login (text/password) are HTML input types, NOT translatable.

// REAL remaining issues:

// 1. analytics: token not found + configError (line 78, 141)
// 2. dashboard: error messages (658, 791, 921) + chart data labels
// 3. records: badge descriptions + error (338)
// 4. settings: >Status< at line 173

// Records badge descriptions need translation
en.records = { ...en.records,
  badge_eligible_desc: "This record has valid math, logic, and English scores.",
  badge_ground_truth_desc: "Actual exam score is available for validation.",
  badge_x3_ready_desc: "Teacher objective score has been set.",
  badge_excluded_desc: "This record will not be included in MLR training."
};
id.records = { ...id.records,
  badge_eligible_desc: "Catatan ini memiliki nilai matematika, logika, dan bahasa Inggris yang valid.",
  badge_ground_truth_desc: "Nilai ujian aktual tersedia untuk validasi.",
  badge_x3_ready_desc: "Nilai objektif guru telah ditetapkan.",
  badge_excluded_desc: "Catatan ini tidak akan dimasukkan dalam pelatihan MLR."
};

fs.writeFileSync(enFile, JSON.stringify(en, null, 2));
fs.writeFileSync(idFile, JSON.stringify(id, null, 2));

function applyReplacements(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const [s, r] of replacements) {
    if (content.includes(s)) {
      content = content.replaceAll(s, r);
      count++;
    }
  }
  fs.writeFileSync(filePath, content);
  return count;
}

// --- ANALYTICS (remaining errors) ---
let c = applyReplacements('src/app/dashboard/analytics/page.tsx', [
  ['setConfigError("Authentication token not found.")', 'setConfigError(t("errors.token_not_found"))'],
  ['setConfigError("Unable to load analytics configuration right now.")', 'setConfigError(t("errors.unable_load_config"))'],
]);
console.log(`analytics errors: ${c}`);

// --- DASHBOARD (remaining error messages that use console.error or different pattern) ---
let dashContent = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
// Fix remaining error messages
dashContent = dashContent.replace(/setPageError\("Failed to fetch user features"\)/g, 'setPageError(t("errors.failed_fetch_features"))');
dashContent = dashContent.replace(/setPageError\("Failed to fetch analytics users."\)/g, 'setPageError(t("errors.failed_fetch_analytics_users"))');
dashContent = dashContent.replace(/setPageError\("Failed to fetch global analytics"\)/g, 'setPageError(t("errors.failed_fetch_global"))');

// Fix chart data name values that remain as ternary/object assignments
dashContent = dashContent.replace(/name: "X1 Attendance"/g, 'name: t("dashboard.x1_attendance_chart")');
dashContent = dashContent.replace(/name: "X2 Tryout"/g, 'name: t("dashboard.x2_tryout_chart")');
dashContent = dashContent.replace(/name: "Predicted Score"/g, 'name: t("dashboard.predicted_score_chart")');

fs.writeFileSync('src/app/dashboard/page.tsx', dashContent);
console.log('dashboard remaining errors fixed');

// --- RECORDS (remaining errors + badge descriptions) ---
c = applyReplacements('src/app/dashboard/records/page.tsx', [
  ['setPageError("Failed to fetch user features.")', 'setPageError(t("errors.failed_fetch_user_features"))'],
]);
// Also fix the badge description strings in records
let recordsContent = fs.readFileSync('src/app/dashboard/records/page.tsx', 'utf8');
// The badge descriptions might be in the object literal
recordsContent = recordsContent.replace(/description: "Eligible Input"/g, 'description: t("records.badge_eligible")');
recordsContent = recordsContent.replace(/description: "Ground Truth Ready"/g, 'description: t("records.badge_ground_truth")');
recordsContent = recordsContent.replace(/description: "X3 Ready"/g, 'description: t("records.badge_x3_ready")');
recordsContent = recordsContent.replace(/description: "Excluded from Training"/g, 'description: t("records.badge_excluded")');
fs.writeFileSync('src/app/dashboard/records/page.tsx', recordsContent);
console.log(`records remaining: fixed`);

console.log('\n=== DEEP FIX ROUND 2 COMPLETE ===');
