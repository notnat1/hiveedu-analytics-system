Act as a Senior Frontend Engineer. We are currently testing the Light Mode UI across the entire dashboard and found several visual bugs and one React console warning. Please systematically scan the codebase and execute these exact fixes:

Task 1 Fix Dark Dropdowns in Light Mode
In components across Academic Records, Attendance, User Management, and Audit Logs (especially standard HTML select elements or custom dropdown menus), the opened option lists are rendering in hardcoded dark backgrounds (black or zinc-900). 
Scan all select and option tags across the dashboard pages and update their classNames so that option elements render cleanly in light mode: use bg-white dark:bg-[#09090b] and text-zinc-900 dark:text-zinc-100. Remove any hardcoded bg-black or text-white on select inputs.

Task 2 Fix Add New Account Modal Styling
In frontend-web/src/app/dashboard/users/page.tsx (or the AddNewAccountModal component), the popup modal is still hardcoded to dark mode. Update the modal container to use theme-responsive classes: bg-white dark:bg-[#09090b], text-zinc-900 dark:text-zinc-100, and border-zinc-200 dark:border-zinc-800. Ensure all internal labels and input fields adapt cleanly to both light and dark modes.

Task 3 Fix React Key Warning in User Management
In frontend-web/src/app/dashboard/users/page.tsx around line 580, there is a React console warning: "Each child in a list should have a unique key prop". This occurs inside the teachers.map() function where the option tag uses key={teacher.id}. Change this to key={teacher.userId} (or the correct new primary key property) to clear the error.

Task 4 Fix Contrast for Attendance Logic and Audit Logs
In frontend-web/src/app/dashboard/attendance/page.tsx, check the X1 Attendance Logic "SELECTED USER X1" box displaying "N/A" and ensure the container and text have proper light/dark contrast (e.g., bg-zinc-50 dark:bg-zinc-900/50, text-zinc-900 dark:text-white). 
In frontend-web/src/app/dashboard/audit-logs/page.tsx, ensure the "METADATA" code blocks render with readable font colors in light mode (e.g., text-zinc-700 dark:text-zinc-300 in a light bg-zinc-100 dark:bg-zinc-900 container).

Execute these changes carefully and confirm when done. Do not use markdown headers or bolding in your response to save tokens.