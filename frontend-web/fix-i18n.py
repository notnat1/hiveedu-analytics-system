def replace_exact(filepath, old, new, label=""):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    if old not in content:
        print(f"  MISS [{label}]: {repr(old[:80])}")
        return False
    content = content.replace(old, new, 1)
    with open(filepath, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print(f"  OK [{label}]")
    return True

ATTENDANCE = 'src/app/dashboard/attendance/page.tsx'
RECORDS = 'src/app/dashboard/records/page.tsx'

print("=== Fixing attendance/page.tsx ===")

replace_exact(ATTENDANCE,
    '          Record daily attendance events for each user and feed real participation data into the X1 attendance engine.',
    '          {t("attendance.desc")}',
    "header desc")

replace_exact(ATTENDANCE,
    '                Daily attendance signal entry',
    '                {t("attendance.input_signal")}',
    "input_signal")

replace_exact(ATTENDANCE,
    '                Cancel Edit\n              </button>',
    '                {t("attendance.cancel_edit")}\n              </button>',
    "cancel edit btn")

replace_exact(ATTENDANCE,
    '              <label htmlFor="attendance-date" className="text-sm font-medium text-zinc-300">\n                Date\n              </label>',
    '              <label htmlFor="attendance-date" className="text-sm font-medium text-zinc-300">\n                {t("attendance.date")}\n              </label>',
    "date label")

replace_exact(ATTENDANCE,
    '              <label htmlFor="attendance-status" className="text-sm font-medium text-zinc-300">\n                Status\n              </label>',
    '              <label htmlFor="attendance-status" className="text-sm font-medium text-zinc-300">\n                {t("attendance.status")}\n              </label>',
    "status label")

replace_exact(ATTENDANCE,
    '                  PRESENT\n                </option>\n                <option value="LATE"',
    '                  {t("attendance.present")}\n                </option>\n                <option value="LATE"',
    "PRESENT option")

replace_exact(ATTENDANCE,
    '                  LATE\n                </option>\n                <option value="ABSENT"',
    '                  {t("attendance.late")}\n                </option>\n                <option value="ABSENT"',
    "LATE option")

replace_exact(ATTENDANCE,
    '                  ABSENT\n                </option>\n              </select>',
    '                  {t("attendance.absent")}\n                </option>\n              </select>',
    "ABSENT option")

replace_exact(ATTENDANCE,
    '              <label htmlFor="attendance-user" className="text-sm font-medium text-zinc-300">\n                Active User\n              </label>',
    '              <label htmlFor="attendance-user" className="text-sm font-medium text-zinc-300">\n                {t("attendance.active_user")}\n              </label>',
    "active user label")

replace_exact(ATTENDANCE,
    '                    ? "Saving Changes..."\n                    : "Saving Attendance..."\n                  : editingAttendanceId\n                    ? "Save Changes"\n                    : t("attendance.save_attendance")',
    '                    ? t("attendance.saving_changes")\n                    : t("attendance.saving_attendance")\n                  : editingAttendanceId\n                    ? t("attendance.save_changes")\n                    : t("attendance.save_attendance")',
    "saving states")

replace_exact(ATTENDANCE,
    '              Attendance-driven MLR input\n            </p>',
    '              {t("attendance.x1_logic_desc")}\n            </p>',
    "x1_logic_desc")

replace_exact(ATTENDANCE,
    '                              Edit\n                            </button>\n                            <button\n                              type="button"\n                              onClick={() => void handleDeleteAttendance',
    '                              {t("attendance.btn_edit")}\n                            </button>\n                            <button\n                              type="button"\n                              onClick={() => void handleDeleteAttendance',
    "edit btn text")

replace_exact(ATTENDANCE,
    '                              Delete\n                            </button>\n                          </div>',
    '                              {t("attendance.btn_delete")}\n                            </button>\n                          </div>',
    "delete btn text")

# Error messages
replace_exact(ATTENDANCE,
    '      const message =\n        decoded.role === "USER"\n          ? "Unable to load your attendance profile right now."\n          : "Unable to load user options right now.";',
    '      const message =\n        decoded.role === "USER"\n          ? t("errors.unable_load_attendance_profile")\n          : t("errors.unable_load_user_options");',
    "error messages")

print("\n=== Fixing records/page.tsx ===")

replace_exact(RECORDS,
    '              Username\n            </label>',
    '              {t("records.username_label")}\n            </label>',
    "username label")

replace_exact(RECORDS,
    '                Cancel Edit\n              </button>\n            )}\n          </div>\n\n          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">',
    '                {t("records.cancel_edit")}\n              </button>\n            )}\n          </div>\n\n          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">',
    "cancel edit btn")

replace_exact(RECORDS,
    '              <label htmlFor="math-score" className="text-sm text-zinc-400">\n                Math Score\n              </label>',
    '              <label htmlFor="math-score" className="text-sm text-zinc-400">\n                {t("records.math_score")}\n              </label>',
    "math score label")

replace_exact(RECORDS,
    '              <label htmlFor="logic-score" className="text-sm text-zinc-400">\n                Logic Score\n              </label>',
    '              <label htmlFor="logic-score" className="text-sm text-zinc-400">\n                {t("records.logic_score")}\n              </label>',
    "logic score label")

replace_exact(RECORDS,
    '              <label htmlFor="english-score" className="text-sm text-zinc-400">\n                English Score\n              </label>',
    '              <label htmlFor="english-score" className="text-sm text-zinc-400">\n                {t("records.english_score")}\n              </label>',
    "english score label")

replace_exact(RECORDS,
    '              <label htmlFor="teacher-objective-score" className="text-sm text-zinc-400">\n                Teacher Objective Score (X3)\n              </label>',
    '              <label htmlFor="teacher-objective-score" className="text-sm text-zinc-400">\n                {t("records.teacher_x3")}\n              </label>',
    "teacher x3 label")

replace_exact(RECORDS,
    '              <label htmlFor="actual-exam-score" className="text-sm text-zinc-400">\n                Actual Exam Score\n              </label>',
    '              <label htmlFor="actual-exam-score" className="text-sm text-zinc-400">\n                {t("records.actual_exam")}\n              </label>',
    "actual exam label")

replace_exact(RECORDS,
    '              <label htmlFor="exam-date" className="text-sm text-zinc-400">\n                Exam Date\n              </label>',
    '              <label htmlFor="exam-date" className="text-sm text-zinc-400">\n                {t("records.exam_date")}\n              </label>',
    "exam date label")

replace_exact(RECORDS,
    '              <label htmlFor="exam-label" className="text-sm text-zinc-400">\n                Exam Label\n              </label>',
    '              <label htmlFor="exam-label" className="text-sm text-zinc-400">\n                {t("records.exam_label")}\n              </label>',
    "exam label label")

replace_exact(RECORDS,
    '            <label htmlFor="teacher-feedback" className="text-sm text-zinc-400">\n              Teacher Feedback\n            </label>',
    '            <label htmlFor="teacher-feedback" className="text-sm text-zinc-400">\n              {t("records.teacher_feedback")}\n            </label>',
    "teacher feedback label")

replace_exact(RECORDS,
    '                    ? "Saving Changes..."\n                    : "Saving Record..."\n                  : editingRecordId\n                    ? "Save Changes"\n                    : t("records.save_record")',
    '                    ? t("records.saving_changes")\n                    : t("records.saving_record")\n                  : editingRecordId\n                    ? t("records.save_changes")\n                    : t("records.save_record")',
    "saving states")

replace_exact(RECORDS,
    '                              Edit\n                            </button>\n                          ) : (\n                            <span className="text-sm text-zinc-500">{t("records.badge_readonly")}',
    '                              {t("records.btn_edit")}\n                            </button>\n                          ) : (\n                            <span className="text-sm text-zinc-500">{t("records.badge_readonly")}',
    "edit btn text")

replace_exact(RECORDS,
    '{record.isUsedForTraining === false ? "No" : t("records.yes")}',
    '{record.isUsedForTraining === false ? t("records.no") : t("records.yes")}',
    "yes/no")

print("\nDone!")
