import Graphics from "../render/Graphics";
import Random from "./Random";

export default class CanvasDebugVisualizer {

    static toRender = [];

    static sib(points, colorize = false, cStep = 20, limit = null, log = false, numbers = false) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderSib, { points, colorize, cStep, limit, log, numbers }]);
    }

    static renderSib(o) {
        let points = o.points;
        let colorize = o.colorize;
        let cStep = o.cStep;
        let limit = o.limit;
        let log = o.log;
        let numbers = o.numbers;

        const g = new Graphics();
        const c = points.slice(0);
        let lastStep = 0;

        if (typeof colorize === 'string') {
            g.beginFill(colorize)
            colorize = false;
        }

        let count = 0;

        c.forEach(p => {
            lastStep++;
            count++;
            if (limit !== null && count > limit)
                return;
            if (colorize && lastStep > cStep) {
                g.beginFill(CanvasDebugVisualizer.randomColor());
                lastStep = 0;
            }
            if (numbers)
                g.drawText(p.x, p.y, count);
            else
                g.drawCircle(p.x, p.y, 10);
            if (log)
                console.log(p.x, p.y)
        });
    }

    static polygon(points, opaque = true, opacity = 0.3) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderPolygon, { points, opaque, opacity }]);
    }

    static renderPolygon(o) {
        let points = o.points;
        let opaque = o.opaque;
        let opacity = o.opacity;

        const g = new Graphics();
        let c = opaque ? CanvasDebugVisualizer.randomColor() : CanvasDebugVisualizer.randomTransColor(opacity);
        g.beginFill(c);
        g.drawPolygon(o.points);
    }

    static drawRectangle(p1, width, height, angle) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderRectangle, { p1, width, height, angle }])
    }

    static renderRectangle(o) {
        const g = new Graphics();
        g.beginFill(CanvasDebugVisualizer.randomColor());
        g.lineStyle(0, CanvasDebugVisualizer.randomColor());
        g.drawRectangle(o.p1, o.width, o.height, o.angle);
    }

    static drawLine(p1, p2) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderLine, { p1, p2 }])
    }

    static renderLine(o) {
        const g = new Graphics();
        g.lineStyle(50, CanvasDebugVisualizer.randomColor());
        g.drawLine(o.p1, o.p2);

    }

    static drawRoads(points) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderRoads, { points }]);
    }

    static drawDots(points, size = 10, preScaled = false) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderDots, { points, size, preScaled }])
    }

    static renderDots(o) {
        let points = o.points;
        let preScaled = o.preScaled;
        const g = new Graphics();
        g.beginFill(CanvasDebugVisualizer.randomColor());
        points.forEach(p => {
            g.drawCircle(p.x, p.y, o.size, preScaled);
        })
    }

    static renderRoads(o) {
        const g = new Graphics();
        g.lineStyle(3, CanvasDebugVisualizer.randomTransColor());
        g.drawPolyline(o.points);
    }

    static randomTransColor(opacity = 0.4) {
        let r = Random.int(0, 255);
        let g = Random.int(0, 255);
        let b = Random.int(0, 255);
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    }

    static randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    static drawText(p, text) {
        CanvasDebugVisualizer.toRender.push([CanvasDebugVisualizer.renderText, { p, text }]);
    }

    static renderText(o) {
        const g = new Graphics();
        g.beginFill('#FF0000');
        g.drawText(o.p.x, o.p.y, o.text);
    }

    static render() {
        CanvasDebugVisualizer.toRender.forEach(e => {
            e[0](e[1]);
        });
    }

}