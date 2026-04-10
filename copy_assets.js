import fs from 'fs';
import path from 'path';

const sourceBase = '../stitch_welcome_to_fitmorph_ai/';
const targetBase = './public/assets/';

if (!fs.existsSync(targetBase)) {
  fs.mkdirSync(targetBase, { recursive: true });
}

const folders = ['welcome_to_fitmorph_ai', 'key_ai_benefits', 'join_fitmorph_ai', 'ai_body_analysis', 'user_dashboard'];

folders.forEach(folder => {
  const sourcePath = path.join(sourceBase, folder, 'screen.png');
  const targetPath = path.join(targetBase, `${folder}.png`);
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${folder}.png`);
  } else {
    console.log(`Source not found: ${sourcePath}`);
  }
});
