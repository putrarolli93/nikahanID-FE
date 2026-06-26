const Jimp = require('jimp');

async function removeWhiteBg(inputPath, outputPath) {
  try {
    const image = await Jimp.read(inputPath);
    
    // Iterate over every pixel
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is close to white, make it transparent
      if (red > 230 && green > 230 && blue > 230) {
        this.bitmap.data[idx + 3] = 0; // alpha to 0
      }
    });

    await image.writeAsync(outputPath);
    console.log('Processed:', outputPath);
  } catch (err) {
    console.error('Error processing', inputPath, err);
  }
}

async function main() {
  await removeWhiteBg('./public/images/floral_top.png', './public/images/floral_top.png');
  await removeWhiteBg('./public/images/floral_bottom.png', './public/images/floral_bottom.png');
  console.log('Done');
}

main();
