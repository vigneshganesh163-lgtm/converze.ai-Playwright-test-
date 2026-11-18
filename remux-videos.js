const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpegPath = 'C:\\Users\\parip\\AppData\\Local\\ms-playwright\\ffmpeg-1013\\ffmpeg-win64.exe';
const targetDirs = [
  'c:\\Users\\parip\\OneDrive\\Documents\\Vignesh\\Converze.ai -playwright test new\\scenario-7-report\\videos',
  'c:\\Users\\parip\\OneDrive\\Documents\\Vignesh\\Test result\\scenario-7-report\\videos'
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  console.log('Processing directory:', dir);
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.webm') && !f.startsWith('fixed_'));
  files.forEach(f => {
    const fullPath = path.join(dir, f);
    const tempPath = path.join(dir, 'fixed_' + f);
    const isUser1 = f.includes('user1');
    const trimArg = isUser1 ? '-t 1600' : '';
    const cmd = `"${ffmpegPath}" -y -i "${fullPath}" ${trimArg} -c copy "${tempPath}"`;
    try {
      execSync(cmd, { stdio: 'pipe' });
      const origSize = fs.statSync(fullPath).size;
      const newSize = fs.statSync(tempPath).size;
      fs.unlinkSync(fullPath);
      fs.renameSync(tempPath, fullPath);
      console.log(`✓ ${f}: ${(origSize/1024/1024).toFixed(1)}MB -> ${(newSize/1024/1024).toFixed(1)}MB`);
    } catch(err) {
      console.error(`Error on ${f}:`, err.message);
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    }
  });
});
console.log('Finished remuxing all videos.');
