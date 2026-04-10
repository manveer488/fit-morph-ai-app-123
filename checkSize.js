const Jimp = require('jimp');

async function checkSize() {
  const image = await Jimp.read('../stitch_welcome_to_fitmorph_ai/welcome_to_fitmorph_ai/screen.png');
  console.log('Welcome Image size:', image.bitmap.width, 'x', image.bitmap.height);
}
checkSize();
