export function svgclean(svgContent) {
    let output = svgContent.replace(/<svg[^>]*>/, match => match.replace(/ style="[^"]*"/, '')); //# Remove Style <svg style="">
        output = output.replace(/class="([^"]*\bland\b[^"]*)"/g, 'class="unit-selector"'); //# Remove Unit Color

    //# Remove Pins
    const parser = new DOMParser();
    const parsedSVG = parser.parseFromString(output, 'image/svg+xml');
    const mapPins = parsedSVG.querySelectorAll('.pin');

    mapPins.forEach(e => e.parentNode.removeChild(e));

    output = new XMLSerializer().serializeToString(parsedSVG);

    return output;
}