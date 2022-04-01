const path = require('path')

const GIFEncoder = require('gifencoder')
const Canvas = require('canvas')
const { abort } = require('process')

const FRAMES = 10

const GifCache = []

const defaultOptions = {
    resolution: 512,
    delay: 100,
    backgroundColor: null,
}

module.exports = async (avatarURL, options = {}) => {
    options = defaultOptions // Fill in the default option values

    // Create GIF encoder
    const encoder = new GIFEncoder(options.resolution, options.resolution)

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(options.delay)
    encoder.setTransparent()

    // Create canvas and its context
    const canvas = Canvas.createCanvas(options.resolution, options.resolution)
    const ctx = canvas.getContext('2d')
    const avatarctx = canvas.getContext('2d')

    const avatar = await Canvas.loadImage(avatarURL)
    avatarctx.drawImage(avatar,0,0,avatar.width,avatar.height);
    avatarData =avatarctx.getImageData(0,0,avatar.width,avatar.height);
    // Loop and create each frame
    for (let i = 0; i < FRAMES; i++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        if (i == GifCache.length) GifCache.push(await Canvas.loadImage(path.resolve(__dirname, `animation/00${i<9?`0${i+1}`:i+1}.png`)))
        ctx.drawImage(GifCache[i], 0, 0, options.resolution, options.resolution)
        var patternData = ctx.getImageData(0,0,options.resolution, options.resolution);
        data = patternData.data
         for(var z = 0;z<data.length;z+=4){
             let pos = (data[z+1]*256+data[z])<<2;
             
             data[z] = avatarData.data[pos]
             data[z+1] = avatarData.data[pos+1]
             data[z+2] = avatarData.data[pos+2]
         }
         patternData.data=data;
        ctx.putImageData(patternData,0,0)

        encoder.addFrame(ctx)
    }

    encoder.finish()
    return encoder.out.getData()
}