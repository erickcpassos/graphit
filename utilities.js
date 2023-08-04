function getAppropriateTextColor(backgroundColorRGBHex) {
    /*
        Garanta que o HEX é da forma #XXXXXX, sem "abreviações"
    */

    let red = parseInt(backgroundColorRGBHex.substring(1, 3), 16), green = parseInt(backgroundColorRGBHex.substring(3,5), 16), blue = parseInt(backgroundColorRGBHex.substring(5, 7), 16);
    let brightness = (red*299) + (green*567) + (blue*114);
    brightness /= 1000;
    return (brightness >= 128) ? '#000000' : '#FFFFFF' 
}