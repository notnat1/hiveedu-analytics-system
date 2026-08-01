const fs = require('fs');

const enFile = 'src/i18n/locales/en.json';
const idFile = 'src/i18n/locales/id.json';
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const id = JSON.parse(fs.readFileSync(idFile, 'utf8'));

// ==========================================
// 1. ERROR MESSAGES & TOAST MESSAGES
// ==========================================

en.errors = {
  failed_fetch_config: "Failed to fetch analytics configuration.",
  unable_load_config: "Unable to load analytics configuration right now.",
  failed_update_config: "Failed to update analytics configuration.",
  failed_export_report: "Failed to export analytics report.",
  failed_fetch_user: "Failed to fetch current user.",
  failed_fetch_users: "Failed to fetch users.",
  failed_fetch_attendance: "Failed to fetch attendance records.",
  token_not_found: "Authentication token not found.",
  unable_identify_session: "Unable to identify the current session.",
  failed_delete_attendance: "Failed to delete attendance record.",
  failed_save_attendance: "Failed to save attendance",
  failed_fetch_audit: "Failed to fetch audit logs.",
  unable_load_audit: "Unable to load audit logs right now.",
  failed_fetch_features: "Failed to fetch user features",
  failed_fetch_analytics_users: "Failed to fetch analytics users.",
  failed_fetch_global: "Failed to fetch global analytics",
  unable_load_users: "Unable to load user options right now.",
  failed_fetch_user_features: "Failed to fetch user features.",
  failed_fetch_records: "Failed to fetch academic records.",
  failed_save_record: "Failed to save academic record.",
  failed_fetch_profile: "Failed to fetch current user profile",
  failed_update_profile: "Failed to update current user profile",
  failed_fetch_tutor: "Failed to fetch tutor analytics.",
  unable_load_tutor: "Unable to load tutor analytics right now.",
  failed_delete_user: "Failed to delete user.",
  unable_load_accounts: "Unable to load accounts right now.",
  error_updating_user: "Error updating user:",
  error_creating_user: "Error creating user:"
};

id.errors = {
  failed_fetch_config: "Gagal mengambil konfigurasi analitik.",
  unable_load_config: "Tidak dapat memuat konfigurasi analitik saat ini.",
  failed_update_config: "Gagal memperbarui konfigurasi analitik.",
  failed_export_report: "Gagal mengekspor laporan analitik.",
  failed_fetch_user: "Gagal mengambil data pengguna saat ini.",
  failed_fetch_users: "Gagal mengambil data pengguna.",
  failed_fetch_attendance: "Gagal mengambil catatan kehadiran.",
  token_not_found: "Token autentikasi tidak ditemukan.",
  unable_identify_session: "Tidak dapat mengidentifikasi sesi saat ini.",
  failed_delete_attendance: "Gagal menghapus catatan kehadiran.",
  failed_save_attendance: "Gagal menyimpan kehadiran",
  failed_fetch_audit: "Gagal mengambil log audit.",
  unable_load_audit: "Tidak dapat memuat log audit saat ini.",
  failed_fetch_features: "Gagal mengambil fitur pengguna",
  failed_fetch_analytics_users: "Gagal mengambil data pengguna analitik.",
  failed_fetch_global: "Gagal mengambil analitik global",
  unable_load_users: "Tidak dapat memuat opsi pengguna saat ini.",
  failed_fetch_user_features: "Gagal mengambil fitur pengguna.",
  failed_fetch_records: "Gagal mengambil catatan akademik.",
  failed_save_record: "Gagal menyimpan catatan akademik.",
  failed_fetch_profile: "Gagal mengambil profil pengguna saat ini",
  failed_update_profile: "Gagal memperbarui profil pengguna saat ini",
  failed_fetch_tutor: "Gagal mengambil analitik tutor.",
  unable_load_tutor: "Tidak dapat memuat analitik tutor saat ini.",
  failed_delete_user: "Gagal menghapus pengguna.",
  unable_load_accounts: "Tidak dapat memuat akun saat ini.",
  error_updating_user: "Error memperbarui pengguna:",
  error_creating_user: "Error membuat pengguna:"
};

// ==========================================
// 2. REMAINING TERNARY / BUTTON TEXT
// ==========================================

en.analytics = { ...en.analytics,
  save_config: "Save Configuration",
  no_fallback: "No fallback used",
  export_report_btn: "Export Analytics Report"
};
id.analytics = { ...id.analytics,
  save_config: "Simpan Konfigurasi",
  no_fallback: "Tidak ada cadangan yang digunakan",
  export_report_btn: "Ekspor Laporan Analitik"
};

en.attendance = { ...en.attendance,
  update_attendance: "Update Attendance",
  attendance_input: "Attendance Input",
  select_user_review: "Select a user to review attendance history",
  select_a_user: "Select a user",
  save_attendance: "Save Attendance"
};
id.attendance = { ...id.attendance,
  update_attendance: "Perbarui Kehadiran",
  attendance_input: "Input Kehadiran",
  select_user_review: "Pilih pengguna untuk meninjau riwayat kehadiran",
  select_a_user: "Pilih pengguna",
  save_attendance: "Simpan Kehadiran"
};

en.audit = { ...en.audit,
  refresh: "Refresh"
};
id.audit = { ...id.audit,
  refresh: "Segarkan"
};

en.dashboard = { ...en.dashboard,
  mathematics: "Mathematics",
  logical_reasoning: "Logical Reasoning",
  english_proficiency: "English Proficiency",
  x1_attendance_chart: "X1 Attendance",
  x2_tryout_chart: "X2 Tryout",
  predicted_score_chart: "Predicted Score",
  badge_early_improvement_title: "Early Improvement",
  badge_early_improvement_desc: "Your current analytics signal is highlighting an area to improve before the next exam.",
  total_users_stat: "Total Users",
  active_users_stat: "Active Users",
  eligible_users_stat: "Eligible Users",
  excluded_users_stat: "Excluded Users",
  training_samples_stat: "Training Samples",
  predictions_stat: "Predictions",
  mse_stat: "MSE",
  export_report_btn: "Export Analytics Report",
  tutor_unavailable: "Tutor assignment unavailable"
};
id.dashboard = { ...id.dashboard,
  mathematics: "Matematika",
  logical_reasoning: "Penalaran Logika",
  english_proficiency: "Kemampuan Bahasa Inggris",
  x1_attendance_chart: "X1 Kehadiran",
  x2_tryout_chart: "X2 Tryout",
  predicted_score_chart: "Skor Prediksi",
  badge_early_improvement_title: "Peningkatan Awal",
  badge_early_improvement_desc: "Sinyal analitik Anda saat ini menyoroti area yang perlu ditingkatkan sebelum ujian berikutnya.",
  total_users_stat: "Total Pengguna",
  active_users_stat: "Pengguna Aktif",
  eligible_users_stat: "Pengguna Memenuhi Syarat",
  excluded_users_stat: "Pengguna Dikecualikan",
  training_samples_stat: "Sampel Pelatihan",
  predictions_stat: "Prediksi",
  mse_stat: "MSE",
  export_report_btn: "Ekspor Laporan Analitik",
  tutor_unavailable: "Penugasan tutor tidak tersedia"
};

en.records = { ...en.records,
  select_a_user: "Select a user",
  update_record: "Update Academic Record",
  input_scores: "Input Subject Scores",
  calculated_backend: "Calculated by backend",
  save_record: "Save Academic Record",
  select_user_review: "Select a user to review saved academic records",
  badge_eligible: "Eligible Input",
  badge_ground_truth: "Ground Truth Ready",
  badge_x3_ready: "X3 Ready",
  badge_excluded: "Excluded from Training",
  yes: "Yes"
};
id.records = { ...id.records,
  select_a_user: "Pilih pengguna",
  update_record: "Perbarui Catatan Akademik",
  input_scores: "Input Nilai Mata Pelajaran",
  calculated_backend: "Dihitung oleh backend",
  save_record: "Simpan Catatan Akademik",
  select_user_review: "Pilih pengguna untuk meninjau catatan akademik tersimpan",
  badge_eligible: "Input Memenuhi Syarat",
  badge_ground_truth: "Kebenaran Aktual Siap",
  badge_x3_ready: "X3 Siap",
  badge_excluded: "Dikecualikan dari Pelatihan",
  yes: "Ya"
};

en.settings = { ...en.settings,
  status_inactive: "Inactive"
};
id.settings = { ...id.settings,
  status_inactive: "Tidak Aktif"
};

en.users = { ...en.users,
  edit_account_title: "Edit Account",
  add_new_account: "Add New Account",
  optional_password: "Optional Password Update",
  password_label: "Password",
  min_8_chars: "Minimum 8 characters",
  no_tutor_assigned: "No tutor assigned",
  no_teachers_available: "No teacher accounts available",
  create_account_btn: "Create Account"
};
id.users = { ...id.users,
  edit_account_title: "Edit Akun",
  add_new_account: "Tambah Akun Baru",
  optional_password: "Pembaruan Kata Sandi Opsional",
  password_label: "Kata Sandi",
  min_8_chars: "Minimal 8 karakter",
  no_tutor_assigned: "Tidak ada tutor yang ditugaskan",
  no_teachers_available: "Tidak ada akun guru yang tersedia",
  create_account_btn: "Buat Akun"
};

// ==========================================
// 3. METADATA (app/layout.tsx)
// ==========================================
en.meta = {
  title: "HiveEdu Analytics",
  description: "Advanced intelligence and learning analytics dashboard for modern education."
};
id.meta = {
  title: "HiveEdu Analytics",
  description: "Dasbor analitik pembelajaran dan kecerdasan tingkat lanjut untuk pendidikan modern."
};

fs.writeFileSync(enFile, JSON.stringify(en, null, 2));
fs.writeFileSync(idFile, JSON.stringify(id, null, 2));
console.log('Dictionaries updated with ALL remaining strings');

// ==========================================
// NOW APPLY ALL REPLACEMENTS
// ==========================================

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

// --- ANALYTICS ---
let c = applyReplacements('src/app/dashboard/analytics/page.tsx', [
  ['throw new Error("Failed to fetch analytics configuration.")', 'throw new Error(t("errors.failed_fetch_config"))'],
  ['setPageError("Unable to load analytics configuration right now.")', 'setPageError(t("errors.unable_load_config"))'],
  ['throw new Error("Failed to update analytics configuration.")', 'throw new Error(t("errors.failed_update_config"))'],
  ['throw new Error("Failed to export analytics report.")', 'throw new Error(t("errors.failed_export_report"))'],
  ['"Save Configuration"', 't("analytics.save_config")'],
  ['"No fallback used"', 't("analytics.no_fallback")'],
  ['"Export Analytics Report"', 't("analytics.export_report_btn")'],
]);
console.log(`analytics: ${c} replacements`);

// --- ATTENDANCE ---
c = applyReplacements('src/app/dashboard/attendance/page.tsx', [
  ['throw new Error("Failed to fetch current user.")', 'throw new Error(t("errors.failed_fetch_user"))'],
  ['throw new Error("Failed to fetch users.")', 'throw new Error(t("errors.failed_fetch_users"))'],
  ['throw new Error("Failed to fetch attendance records.")', 'throw new Error(t("errors.failed_fetch_attendance"))'],
  ['setPageError("Authentication token not found.")', 'setPageError(t("errors.token_not_found"))'],
  ['setPageError("Unable to identify the current session.")', 'setPageError(t("errors.unable_identify_session"))'],
  ['throw new Error("Failed to delete attendance record.")', 'throw new Error(t("errors.failed_delete_attendance"))'],
  ['throw new Error("Failed to save attendance")', 'throw new Error(t("errors.failed_save_attendance"))'],
  ['? "Update Attendance"', '? t("attendance.update_attendance")'],
  [': "Attendance Input"', ': t("attendance.attendance_input")'],
  [': "Select a user"', ': t("attendance.select_a_user")'],
  [': "Save Attendance"', ': t("attendance.save_attendance")'],
  [': "Select a user to review attendance history"', ': t("attendance.select_user_review")'],
]);
console.log(`attendance: ${c} replacements`);

// --- AUDIT ---
c = applyReplacements('src/app/dashboard/audit-logs/page.tsx', [
  ['setPageError("Authentication token not found.")', 'setPageError(t("errors.token_not_found"))'],
  ['throw new Error("Failed to fetch audit logs.")', 'throw new Error(t("errors.failed_fetch_audit"))'],
  ['setPageError("Unable to load audit logs right now.")', 'setPageError(t("errors.unable_load_audit"))'],
  ['setPageError("Unable to identify the current session.")', 'setPageError(t("errors.unable_identify_session"))'],
  [': "Refresh"', ': t("audit.refresh")'],
]);
console.log(`audit: ${c} replacements`);

// --- DASHBOARD ---
c = applyReplacements('src/app/dashboard/page.tsx', [
  ['throw new Error("Failed to export analytics report.")', 'throw new Error(t("errors.failed_export_report"))'],
  [': "Mathematics"', ': t("dashboard.mathematics")'],
  [': "Logical Reasoning"', ': t("dashboard.logical_reasoning")'],
  [': "English Proficiency"', ': t("dashboard.english_proficiency")'],
  ['name: "X1 Attendance"', 'name: t("dashboard.x1_attendance_chart")'],
  ['name: "X2 Tryout"', 'name: t("dashboard.x2_tryout_chart")'],
  ['name: "Predicted Score"', 'name: t("dashboard.predicted_score_chart")'],
  ['title: "Early Improvement"', 'title: t("dashboard.badge_early_improvement_title")'],
  ['description: "Your current analytics signal is highlighting an area to improve before the next exam."', 'description: t("dashboard.badge_early_improvement_desc")'],
  ['setPageError("Failed to fetch user features")', 'setPageError(t("errors.failed_fetch_features"))'],
  ['setPageError("Failed to fetch analytics users.")', 'setPageError(t("errors.failed_fetch_analytics_users"))'],
  ['setPageError("Failed to fetch global analytics")', 'setPageError(t("errors.failed_fetch_global"))'],
  ['label: "Total Users"', 'label: t("dashboard.total_users_stat")'],
  ['label: "Active Users"', 'label: t("dashboard.active_users_stat")'],
  ['label: "Eligible Users"', 'label: t("dashboard.eligible_users_stat")'],
  ['label: "Excluded Users"', 'label: t("dashboard.excluded_users_stat")'],
  ['label: "Training Samples"', 'label: t("dashboard.training_samples_stat")'],
  ['label: "Predictions"', 'label: t("dashboard.predictions_stat")'],
  ['label: "MSE"', 'label: t("dashboard.mse_stat")'],
  ['"Export Analytics Report"', 't("dashboard.export_report_btn")'],
  [': "Tutor assignment unavailable"', ': t("dashboard.tutor_unavailable")'],
]);
console.log(`dashboard: ${c} replacements`);

// --- RECORDS ---
c = applyReplacements('src/app/dashboard/records/page.tsx', [
  ['title: "Eligible Input"', 'title: t("records.badge_eligible")'],
  ['title: "Ground Truth Ready"', 'title: t("records.badge_ground_truth")'],
  ['title: "X3 Ready"', 'title: t("records.badge_x3_ready")'],
  ['title: "Excluded from Training"', 'title: t("records.badge_excluded")'],
  ['throw new Error("Failed to fetch users.")', 'throw new Error(t("errors.failed_fetch_users"))'],
  ['setPageError("Unable to load user options right now.")', 'setPageError(t("errors.unable_load_users"))'],
  ['setPageError("Failed to fetch user features.")', 'setPageError(t("errors.failed_fetch_user_features"))'],
  ['throw new Error("Failed to fetch academic records.")', 'throw new Error(t("errors.failed_fetch_records"))'],
  ['setPageError("Authentication token not found.")', 'setPageError(t("errors.token_not_found"))'],
  ['setPageError("Unable to identify the current session.")', 'setPageError(t("errors.unable_identify_session"))'],
  ['throw new Error("Failed to save academic record.")', 'throw new Error(t("errors.failed_save_record"))'],
  [': "Select a user"', ': t("records.select_a_user")'],
  ['? "Update Academic Record"', '? t("records.update_record")'],
  [': "Input Subject Scores"', ': t("records.input_scores")'],
  [': "Calculated by backend"', ': t("records.calculated_backend")'],
  [': "Save Academic Record"', ': t("records.save_record")'],
  [': "Select a user to review saved academic records"', ': t("records.select_user_review")'],
  [': "Yes"', ': t("records.yes")'],
]);
console.log(`records: ${c} replacements`);

// --- SETTINGS ---
c = applyReplacements('src/app/dashboard/settings/page.tsx', [
  ['throw new Error("Failed to fetch current user profile")', 'throw new Error(t("errors.failed_fetch_profile"))'],
  ['throw new Error("Failed to update current user profile")', 'throw new Error(t("errors.failed_update_profile"))'],
  [': "Inactive"', ': t("settings.status_inactive")'],
  [': "Save Changes"', ': t("settings.save_changes")'],
]);
console.log(`settings: ${c} replacements`);

// --- TUTORS ---
c = applyReplacements('src/app/dashboard/tutors/page.tsx', [
  ['setPageError("Authentication token not found.")', 'setPageError(t("errors.token_not_found"))'],
  ['throw new Error("Failed to fetch tutor analytics.")', 'throw new Error(t("errors.failed_fetch_tutor"))'],
  ['setPageError("Unable to load tutor analytics right now.")', 'setPageError(t("errors.unable_load_tutor"))'],
]);
console.log(`tutors: ${c} replacements`);

// --- USERS ---
c = applyReplacements('src/app/dashboard/users/page.tsx', [
  ['setPageError("Authentication token not found.")', 'setPageError(t("errors.token_not_found"))'],
  ['throw new Error("Failed to fetch users.")', 'throw new Error(t("errors.failed_fetch_users"))'],
  ['setPageError("Unable to load accounts right now.")', 'setPageError(t("errors.unable_load_accounts"))'],
  ['setPageError("Unable to identify the current session.")', 'setPageError(t("errors.unable_identify_session"))'],
  ['throw new Error("Failed to delete user.")', 'throw new Error(t("errors.failed_delete_user"))'],
  ['? "Error updating user:"', '? t("errors.error_updating_user")'],
  [': "Error creating user:"', ': t("errors.error_creating_user")'],
  ['? "Edit Account"', '? t("users.edit_account_title")'],
  [': "Add New Account"', ': t("users.add_new_account")'],
  ['? "Optional Password Update"', '? t("users.optional_password")'],
  [': "Password"', ': t("users.password_label")'],
  [': "Minimum 8 characters"', ': t("users.min_8_chars")'],
  ['? "No tutor assigned"', '? t("users.no_tutor_assigned")'],
  [': "No teacher accounts available"', ': t("users.no_teachers_available")'],
  [': "Create Account"', ': t("users.create_account_btn")'],
]);
console.log(`users: ${c} replacements`);

console.log('\n=== ALL DEEP SCAN FIXES APPLIED ===');
