export async function svgrequest(filepath = '') {
    try{
        const response = await fetch(`../src/assets/svg/${ filepath }`);
        const svgContent = await response.text();

        return svgContent;
    }catch(e){
        return e;
    }
}