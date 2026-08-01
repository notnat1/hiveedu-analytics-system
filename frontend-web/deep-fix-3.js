const fs = require('fs');

// 1. analytics line 276-279: The em-dash descriptions that have special chars
let analytics = fs.readFileSync('src/app/dashboard/analytics/page.tsx', 'utf8');
// These might have already been replaced but the regex isn't matching due to special chars
// Let's check what's actually on those lines
const aLines = analytics.split('\n');
console.log('analytics L276:', aLines[275]);
console.log('analytics L277:', aLines[276]);

// Try replacing with the actual content (may contain unicode em-dash)
analytics = analytics.replace(/>\u2014 baseline constant added to every prediction\.</g, '>{t("analytics.intercept_desc_inline")}<');
analytics = analytics.replace(/— baseline constant added to every prediction\./g, '{t("analytics.intercept_desc_inline")}');
analytics = analytics.replace(/— attendance contribution = attendance coefficient × attendance %\./g, '{t("analytics.b1_desc_inline")}');
analytics = analytics.replace(/— tryout contribution = tryout coefficient × average tryout score\./g, '{t("analytics.b2_desc_inline")}');
analytics = analytics.replace(/— teacher objective contribution = teacher objective coefficient × teacher objective score\./g, '{t("analytics.b3_desc_inline")}');
fs.writeFileSync('src/app/dashboard/analytics/page.tsx', analytics);
console.log('analytics fixed');

// 2. dashboard: X1 Attendance, X2 Tryout in chart data (line 529, 534)
let dash = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const dLines = dash.split('\n');
console.log('dash L529:', dLines[528]);
console.log('dash L534:', dLines[533]);
console.log('dash L539:', dLines[538]);
console.log('dash L658:', dLines[657]);

// Fix the remaining chart data labels and error messages
dash = dash.replace(/name: "X1 Attendance"/g, 'name: t("dashboard.x1_attendance_chart")');
dash = dash.replace(/name: "X2 Tryout"/g, 'name: t("dashboard.x2_tryout_chart")');
dash = dash.replace(/name: "Predicted Score"/g, 'name: t("dashboard.predicted_score_chart")');

// Fix error messages that may have different patterns (catch blocks)
dash = dash.replace(/console\.error\("Failed to fetch user features", error\)/g, 'console.error(t("errors.failed_fetch_features"), error)');

fs.writeFileSync('src/app/dashboard/page.tsx', dash);
console.log('dashboard fixed');

// 3. records: badge title objects at lines 213, 222, 231, 240, 338
let records = fs.readFileSync('src/app/dashboard/records/page.tsx', 'utf8');
const rLines = records.split('\n');
console.log('records L213:', rLines[212]);
console.log('records L222:', rLines[221]);
console.log('records L338:', rLines[337]);

// These are "label:" or "name:" in badge objects
records = records.replace(/label: "Eligible Input"/g, 'label: t("records.badge_eligible")');
records = records.replace(/label: "Ground Truth Ready"/g, 'label: t("records.badge_ground_truth")');
records = records.replace(/label: "X3 Ready"/g, 'label: t("records.badge_x3_ready")');
records = records.replace(/label: "Excluded from Training"/g, 'label: t("records.badge_excluded")');
records = records.replace(/name: "Eligible Input"/g, 'name: t("records.badge_eligible")');
records = records.replace(/name: "Ground Truth Ready"/g, 'name: t("records.badge_ground_truth")');
records = records.replace(/name: "X3 Ready"/g, 'name: t("records.badge_x3_ready")');
records = records.replace(/name: "Excluded from Training"/g, 'name: t("records.badge_excluded")');
// Also check for text: pattern
records = records.replace(/text: "Eligible Input"/g, 'text: t("records.badge_eligible")');
records = records.replace(/text: "Ground Truth Ready"/g, 'text: t("records.badge_ground_truth")');
records = records.replace(/text: "X3 Ready"/g, 'text: t("records.badge_x3_ready")');
records = records.replace(/text: "Excluded from Training"/g, 'text: t("records.badge_excluded")');
// Error at 338
records = records.replace(/console\.error\("Failed to fetch user features\."/g, 'console.error(t("errors.failed_fetch_user_features")');

fs.writeFileSync('src/app/dashboard/records/page.tsx', records);
console.log('records fixed');

// 4. settings L173: >Status<
let settings = fs.readFileSync('src/app/dashboard/settings/page.tsx', 'utf8');
const sLines = settings.split('\n');
console.log('settings L173:', sLines[172]);
// It might be in a specific context that wasn't caught
settings = settings.replace(/>Status</g, '>{t("settings.status_label")}<');
fs.writeFileSync('src/app/dashboard/settings/page.tsx', settings);
console.log('settings fixed');

console.log('\n=== ROUND 3 COMPLETE ===');
