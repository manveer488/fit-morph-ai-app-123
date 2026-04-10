import fs from 'fs';
import path from 'path';
import Jimp from 'jimp';

async function cropAssets() {
  const sourceBase = '../stitch_welcome_to_fitmorph_ai/';
  const assetsDir = './public/assets';

  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  try {
    // 1. Welcome Screen (Hologram)
    const welcomeParams = { x: 153, y: 250, w: 400, h: 400 };
    const welcomeImg = await Jimp.read(path.join(sourceBase, 'welcome_to_fitmorph_ai/screen.png'));
    welcomeImg.crop(welcomeParams.x, welcomeParams.y, welcomeParams.w, welcomeParams.h);
    await welcomeImg.writeAsync(path.join(assetsDir, 'welcome_hologram.png'));
    console.log('Cropped welcome hologram');

    // 2. Join Screen (Silhouette)
    const joinParams = { x: 153, y: 550, w: 400, h: 250 };
    const joinImg = await Jimp.read(path.join(sourceBase, 'join_fitmorph_ai/screen.png'));
    joinImg.crop(joinParams.x, joinParams.y, joinParams.w, joinParams.h);
    await joinImg.writeAsync(path.join(assetsDir, 'join_silhouette.png'));
    console.log('Cropped join silhouette');

    // 3. Body Scan Screen (Background body)
    const scanParams = { x: 100, y: 300, w: 506, h: 600 };
    const scanImg = await Jimp.read(path.join(sourceBase, 'ai_body_analysis/screen.png'));
    scanImg.crop(scanParams.x, scanParams.y, scanParams.w, scanParams.h);
    await scanImg.writeAsync(path.join(assetsDir, 'body_scan_bg.png'));
    console.log('Cropped body scan bg');

    // 4. For Key Benefits, reuse these high-quality safe crops to represent the themes
    // Benefit 1: AI Body Analysis (use scan crop)
    // Benefit 2: Smart Workouts (use join crop)
    // Benefit 3: Diet Tracking (use welcome crop or just same overall futuristic theme)
    
  } catch (err) {
    console.error('Error cropping images:', err);
  }
}

cropAssets();
