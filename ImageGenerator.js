var Jimp = require("jimp");
var uuid = require("uuid");

const START_POINT_TEXT_X = 132;
const START_POINT_TEXT_Y = 174;
const ORIGINAL_SOURCE_FILE_PATH = './img/baseImage.jpg';


const MAX_HEIGHT = 96;
const MAX_WIDTH = 134;

let imageCaption;
let imagenCaptionSplit;
var tooLongFlag = false;

module.exports = {
    generate: main
};

//main();

async function main(caption) {
    imageCaption = caption
    imagenCaptionSplit = imageCaption.split(" ");
    const loadedImage = await Jimp.read(ORIGINAL_SOURCE_FILE_PATH);
    const font =  await chooseFont();
    const loadedFont = await Jimp.loadFont(font);

    if(!tooLongFlag){
        modImage = loadedImage.print(loadedFont, START_POINT_TEXT_X, START_POINT_TEXT_Y, imageCaption, MAX_WIDTH);
    } else {
        modImage = loadedImage.print(loadedFont, START_POINT_TEXT_X, START_POINT_TEXT_Y, "DIO! It's too long \n (the text or long words)", MAX_WIDTH);
    }

    const newImage = await modImage.getBufferAsync(Jimp.MIME_JPEG);
    return newImage
}

async function chooseFont() {
    if (await textFits(Jimp.FONT_SANS_32_BLACK)) {
        return Jimp.FONT_SANS_32_BLACK;
    } else if (await textFits(Jimp.FONT_SANS_16_BLACK)) {
        return Jimp.FONT_SANS_16_BLACK;
    }  else {
        tooLongFlag = true;
        return Jimp.FONT_SANS_16_BLACK;
    }
}

async function textFits(font) {
    const loadedFont = await Jimp.loadFont(font);
    const height = Jimp.measureTextHeight(loadedFont, imageCaption, MAX_WIDTH);

    console.log('calculatedHight: ' + height);
    return height < MAX_HEIGHT && checkSingleWords(loadedFont);
}

function checkSingleWords(loadedFont) {
    result = true;
    imagenCaptionSplit.forEach(element => {
        const width = Jimp.measureText(loadedFont, element);
        if (width > MAX_WIDTH) {
            result = false;
        }
    });
    return result;
}
