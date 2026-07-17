const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');

      // specific for users.service.ts
      content = content.replace(/assignedTutor: \{\s*id: true/g, 'assignedTutor: {\n          userId: true');
      content = content.replace(/assignedTutor: \{\r\n\s*id: true/g, 'assignedTutor: {\n          userId: true');

      // Specific entity ID fixes
      content = content.replace(/\bhistory\.id\b/g, 'history.historyId');
      content = content.replace(/\bsystemConfig\.id\b/g, 'systemConfig.configId');
      content = content.replace(/\bconfig\.id\b/g, 'config.configId');
      content = content.replace(/\buser\.id\b/g, 'user.userId');
      content = content.replace(/\brecord\.id\b/g, 'record.recordId');
      content = content.replace(/\banalyticsRecord\.id\b/g, 'analyticsRecord.analyticsId');
      content = content.replace(/\battendance\.id\b/g, 'attendance.attendanceId');
      content = content.replace(/\bnote\.id\b/g, 'note.noteId');
      content = content.replace(/\binterventionNote\.id\b/g, 'interventionNote.noteId');
      content = content.replace(/\bexistingUser\.id\b/g, 'existingUser.userId');
      content = content.replace(/\bsavedUser\.id\b/g, 'savedUser.userId');
      content = content.replace(/\bhydratedUser\.id\b/g, 'hydratedUser.userId');
      content = content.replace(/\busernameOwner\.id\b/g, 'usernameOwner.userId');
      content = content.replace(/\btargetUser\.id\b/g, 'targetUser.userId');
      content = content.replace(/\bassignedTutor\.id\b/g, 'assignedTutor.userId');

      // where: { userId } when it should be { historyId: id } etc in analytics.service.ts
      if (file === 'analytics.service.ts') {
        content = content.replace(/where: \{ userId: id \}/g, 'where: { historyId: id }'); // For getMlrRunHistoryById
        content = content.replace(/recordId: record\.recordId/g, 'analyticsId: record.analyticsId'); 
        content = content.replace(/id: record\.id/g, 'analyticsId: record.analyticsId'); 
        content = content.replace(/record\.id/g, 'record.analyticsId'); // if it's analytics record
      }

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, 'backend-api/src'));
console.log("Replacement 2 complete.");
