const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const LOGO_PATH = 'logo.png';

const ANDROID_SIZES = {
  'mdpi': 48,
  'hdpi': 72,
  'xhdpi': 96,
  'xxhdpi': 144,
  'xxxhdpi': 192,
};

const IOS_SIZES = [
  { size: 20, mult: [1, 2, 3], idiom: 'ipad' },
  { size: 29, mult: [1, 2, 3], idiom: 'ipad' },
  { size: 40, mult: [1, 2, 3], idiom: 'ipad' },
  { size: 60, mult: [2, 3], idiom: 'iphone' },
  { size: 76, mult: [1, 2], idiom: 'ipad' },
  { size: 83.5, mult: [2], idiom: 'ipad' },
  { size: 1024, mult: [1], idiom: 'ios-marketing' }
];

async function generate() {
  try {
    const image = await Jimp.read(LOGO_PATH);
    
    // Generate Android Icons
    console.log('Generating Android icons...');
    for (const [folder, size] of Object.entries(ANDROID_SIZES)) {
      const outDir = path.join('android/app/src/main/res', `mipmap-${folder}`);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
      }
      
      const androidImg = image.clone();
      androidImg.resize(size, size);
      await androidImg.writeAsync(path.join(outDir, 'ic_launcher.png'));
      await androidImg.writeAsync(path.join(outDir, 'ic_launcher_round.png')); // Just duplicate for round
      console.log(`Created Android ${folder} (${size}x${size})`);
    }

    // Generate iOS Icons
    console.log('Generating iOS icons...');
    const iosDir = 'ios/lifepartner/Images.xcassets/AppIcon.appiconset';
    if (!fs.existsSync(iosDir)) {
      fs.mkdirSync(iosDir, { recursive: true });
    }

    const contents = { images: [], info: { author: 'xcode', version: 1 } };

    for (const config of IOS_SIZES) {
      for (const mult of config.mult) {
        const finalSize = config.size * mult;
        const filename = `icon-${config.size}x${config.size}@${mult}x.png`;
        
        const iosImg = image.clone();
        iosImg.resize(finalSize, finalSize);
        await iosImg.writeAsync(path.join(iosDir, filename));
        
        contents.images.push({
          size: `${config.size}x${config.size}`,
          idiom: config.idiom,
          filename: filename,
          scale: `${mult}x`
        });
        
        // Extra entries for iphone/ipad sharing same sizes to make Xcode happy
        if (config.idiom === 'ipad' && config.size <= 40) {
            contents.images.push({
              size: `${config.size}x${config.size}`,
              idiom: 'iphone',
              filename: filename,
              scale: `${mult}x`
            });
        }
      }
    }
    
    fs.writeFileSync(path.join(iosDir, 'Contents.json'), JSON.stringify(contents, null, 2));
    console.log('Created iOS AppIcon.appiconset');
    
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generate();
