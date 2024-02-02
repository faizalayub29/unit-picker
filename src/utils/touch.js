export function touch(relative, absolute) {
    return !(absolute.x > relative.x + relative.width || absolute.x + absolute.width < relative.x || absolute.y > relative.y + relative.height || absolute.y + absolute.height < relative.y);
}