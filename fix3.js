const fs = require('fs');
const path = require('path');

function fixWhere(file, wrongKey, rightKey) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = new RegExp(`where: \\{\\s*${wrongKey}:`, 'g');
  content = content.replace(regex, `where: { ${rightKey}:`);
  
  // also fix where: { userId } if it was meant to be rightKey (like in remove, update, findById)
  // this happens when we passed 'id' but now parameter is 'id' and we need { recordId: id }
  const regex2 = new RegExp(`where: \\{\\s*${wrongKey}: id\\s*\\}`, 'g');
  content = content.replace(regex2, `where: { ${rightKey}: id }`);
  
  fs.writeFileSync(file, content, 'utf8');
}

fixWhere(path.join(__dirname, 'backend-api/src/records/records.service.ts'), 'userId', 'recordId');
fixWhere(path.join(__dirname, 'backend-api/src/attendance/attendance.service.ts'), 'userId', 'attendanceId');
fixWhere(path.join(__dirname, 'backend-api/src/interventions/interventions.service.ts'), 'userId', 'noteId');

// in analytics.service.ts, some queries are for MLR history, some for System config
// Let's manually fix analytics.service.ts 
let analyticsContent = fs.readFileSync(path.join(__dirname, 'backend-api/src/analytics/analytics.service.ts'), 'utf8');
analyticsContent = analyticsContent.replace(/where: \{ userId: id \}/g, 'where: { historyId: id }');
analyticsContent = analyticsContent.replace(/where: \{ userId: configId \}/g, 'where: { configId: configId }');
analyticsContent = analyticsContent.replace(/id: record\.analyticsId/g, 'analyticsId: record.analyticsId');
// fix missing replacements for SystemConfig id to configId
analyticsContent = analyticsContent.replace(/config\.id/g, 'config.configId');
analyticsContent = analyticsContent.replace(/history\.id/g, 'history.historyId');
fs.writeFileSync(path.join(__dirname, 'backend-api/src/analytics/analytics.service.ts'), analyticsContent, 'utf8');

console.log("Replacement 3 complete.");
