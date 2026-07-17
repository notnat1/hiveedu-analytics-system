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
      
      // Fix parameters that were renamed by my previous powershell script
      content = content.replace(/findHydratedById\(userId: string\)/g, 'findHydratedById(id: string)');
      content = content.replace(/findById\(userId: string\)/g, 'findById(id: string)');
      content = content.replace(/getCurrentUserProfile\(userId: string\)/g, 'getCurrentUserProfile(id: string)');
      content = content.replace(/updateProfile\(\s*userId: string/g, 'updateProfile(\n    id: string');
      content = content.replace(/updateSelfProfile\(\s*userId: string/g, 'updateSelfProfile(\n    id: string');
      content = content.replace(/update\(\s*userId: string/g, 'update(\n    id: string');
      content = content.replace(/remove\(\s*userId: string/g, 'remove(\n    id: string');
      content = content.replace(/useruserId:/g, 'userId:');
      
      // Select fields missing the replace
      content = content.replace(/select: \{\s*id: true/g, 'select: {\n        userId: true');

      // User entity replacements
      content = content.replace(/\buser\.id\b/g, 'user.userId');
      content = content.replace(/\{ id: /g, '{ userId: ');
      content = content.replace(/\{ id \}/g, '{ userId: id }');
      content = content.replace(/\{ id, /g, '{ userId: id, ');
      content = content.replace(/\.id\b/g, (match, offset, str) => {
        // Simple heuristic: if previous word is 'user' or 'existingUser' etc
        const before = str.substring(offset - 20, offset);
        if (before.match(/(user|existingUser|savedUser|hydratedUser|usernameOwner|targetUser|assignedTutor|actor|Record|Attendance|InterventionNote|History)$/i)) {
           // We'll be more specific below
        }
        return match;
      });

      // Specific object properties
      content = content.replace(/user\.id/g, 'user.userId');
      content = content.replace(/existingUser\.id/g, 'existingUser.userId');
      content = content.replace(/savedUser\.id/g, 'savedUser.userId');
      content = content.replace(/hydratedUser\.id/g, 'hydratedUser.userId');
      content = content.replace(/usernameOwner\.id/g, 'usernameOwner.userId');
      content = content.replace(/targetUser\.id/g, 'targetUser.userId');
      content = content.replace(/assignedTutor\.id/g, 'assignedTutor.userId');

      content = content.replace(/record\.id/g, 'record.recordId');
      content = content.replace(/savedRecord\.id/g, 'savedRecord.recordId');
      content = content.replace(/attendance\.id/g, 'attendance.attendanceId');
      content = content.replace(/note\.id/g, 'note.noteId');
      content = content.replace(/history\.id/g, 'history.historyId');
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir(path.join(__dirname, 'backend-api/src'));
console.log("Replacement complete.");
