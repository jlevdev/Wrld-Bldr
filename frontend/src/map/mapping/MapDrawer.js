import Graphics from "../render/Graphics";
import Model from "../building/Model";
import Ward from "../wards/Ward";
import Palette from "./Palette";
import Brush from "./Brush";
import Shop from "../data/Shop";
import Random from "../utils/Random";
import Visual from "../utils/Visual";
import Paper from "../../components/SettlementBuilder/Paper";

/*
This file brings together pieces from the Model and ties it together with files needed to draw the map and does so when instantiated.
It's a connector between Model and the Graphics rendering class
*/

export default class MapDrawer {
    static SETTLEMENT_SIZE_SMALL_TOWN = 6;
    static SETTLEMENT_SIZE_LARGE_TOWN = 10;
    static SETTLEMENT_SIZE_SMALL_CITY = 15;
    static SETTLEMENT_SIZE_LARGE_CITY = 24;
    static SETTLEMENT_SIZE_METROPOLIS = 40;

    static palette = Palette.DEFAULT;

    patches; //: Array<PatchView>;

    brush; //: Brush;

    constructor() {
        this.brush = new Brush(MapDrawer.palette);

        const initial_graphics_obj = new Graphics();
        initial_graphics_obj.beginFill(MapDrawer.palette.paper);
        initial_graphics_obj.drawCircle(0, 0, Paper.screen.w * 2);

        this.model = Model.instance;

        this.model.roads.forEach((road) => {
            let roadView = new Graphics();
            this.drawRoad(roadView, road);
        });

        let patchIndex = 0;
        let g = new Graphics(true);

        this.model.patches.forEach((patch) => {
            const label = patch.ward.getLabel();

            if (label === Ward.CASTLE_WARD) {
                this.drawBuilding(
                    g,
                    patch.ward.geometry,
                    MapDrawer.palette.light,
                    MapDrawer.palette.dark,
                    Brush.NORMAL_STROKE * 2
                );
            } else if (label === Ward.CATHEDRAL_WARD) {
                const c =
                    typeof patch.district == "undefined"
                        ? "#000000"
                        : patch.district.color;
                this.brush.setColor(g, c, MapDrawer.palette.dark);
                this.drawTemple(
                    g,
                    patch.ward.geometry,
                    c,
                    MapDrawer.palette.dark,
                    Brush.NORMAL_STROKE
                );
            } else if (Ward.shopWards.indexOf(label) != -1) {
                const c =
                    typeof patch.district == "undefined"
                        ? "#000000"
                        : patch.district.color;
                this.brush.setColor(g, c, MapDrawer.palette.dark);
                patch.ward.geometry.forEach((building) => {
                    g.drawShop(building, patch);
                });
            } else if (Ward.sceneryWards.indexOf(label) != -1) {
                this.brush.setColor(g, MapDrawer.palette.light, MapDrawer.palette.dark);
                patch.ward.geometry.forEach((building) => {
                    g.drawPolygon(building);
                });
            } else if (label === Ward.PARK_WARD) {
                this.brush.setColor(g, MapDrawer.palette.medium);
                patch.ward.geometry.forEach((grove) => {
                    g.drawCurvyPolygon(grove);
                });
            } else if (label === Ward.MARKET_WARD) {
                const c =
                    typeof patch.district == "undefined"
                        ? "#000000"
                        : patch.district.color;
                this.brush.setColor(g, c, MapDrawer.palette.dark);
                patch.ward.geometry.forEach((building) => {
                    g.drawPolygon(building);
                });
            }
            //g.renderShadows();
        });

        //TODO optimize this process
        g.renderBuffer();

        let walls = new Graphics();

        if (this.model.wall != null) this.drawWall(walls, model.wall, false);

        if (this.model.citadel != null)
            this.drawWall(walls, model.citadel.ward.wall, true);

        //DEBUG CODE

        //model.drawPlaza();/*
        //model.drawRegionCenters();
        //model.drawGates();*/
        Visual.render();
        /*model.patches.forEach(p => {
                if (p.ward.getLabel()!=null && typeof p.ward.geometry[0] != 'undefined')
                    Visual.drawText( p.ward.geometry[0][0], p.ward.getLabel() );
            });*/
    }

    //only used for castle at time of writing
    drawBuilding(g, blocks, fill, line, thickness) {
        this.brush.setStroke(g, line, thickness * 2);
        this.brush.setFill(g, fill);

        blocks.forEach((block) => {
            g.drawPolygon(block);
        });
    }

    drawGate(g, wall, gate) {
        g.lineStyle(Brush.THICK_STROKE * 2, MapDrawer.palette.dark());

        var dir = wall.next(gate).subtract(wall.prev(gate));
        dir.normalize(Brush.THICK_STROKE * 1.5);
        //TODO
        //g.moveToPoint( gate.subtract( dir ) );
        //g.lineToPoint( gate.add( dir ) );
    }

    drawRoad(g, road) {
        g.lineStyle(
            (Ward.MAIN_STREET + Brush.NORMAL_STROKE) * 6,
            MapDrawer.palette.medium
        );
        g.drawPolyline(road, true);

        g.lineStyle(
            (Ward.MAIN_STREET - Brush.NORMAL_STROKE) * 6,
            MapDrawer.palette.paper
        );
        g.drawPolyline(road, true);

        g.fill = MapDrawer.palette.paper;
        g.drawLineCapHider(road[0]);
        //g.drawSquare(road[road.length-1]);
    }

    drawTemple(g, rect, fill) {
        this.brush.setFill(g, fill);

        g.drawCenteredRectangle(rect.p, rect.width, rect.height, rect.angle);
    }

    drawWall(g, wall, large) {
        g.lineStyle(Brush.THICK_STROKE, MapDrawer.palette.dark);
        g.drawPolygon(wall.shape);

        wall.gates.forEach((gate) => {
            this.drawGate(g, wall.shape, gate);
        });

        wall.towers.forEach((t) => {
            this.drawTower(g, t, Brush.THICK_STROKE * (large ? 1.5 : 1));
        });
    }

    drawTower(g, p, r) {
        this.brush.noStroke(g);
        g.beginFill(MapDrawer.palette.dark);
        g.drawCircle(p.x, p.y, r);
        g.endFill();
    }

    static generateShopIndexes() {
        let allShops = [];
        let index = 0;
        Model.instance.patches.forEach((patch) => {
            const label = patch.ward.getLabel();

            if (Ward.shopWards.indexOf(label) != -1) {
                allShops[Number(patch.shape.perimeter)] = index;
            }
            index++;
        });
        const sortedShops = MapDrawer.sortShops(allShops);

        return MapDrawer.pickShopIndexes(sortedShops);
    }

    static pickShopIndexes(
        sortedShops,
        settlementSize = MapDrawer.SETTLEMENT_SIZE_SMALL_TOWN
    ) {
        const chosenIndexes = [];
        const numberOfShops = Random.int(settlementSize, settlementSize * 2);

        if (numberOfShops * 2 > sortedShops.length) {
            for (let i = 0; i < numberOfShops; i += 2) {
                chosenIndexes.push(sortedShops[i]);
            }
        } else {
            for (let i = 0; i < numberOfShops; i++) {
                chosenIndexes.push(sortedShops[i]);
            }
        }
        return chosenIndexes;
    }

    //sorts shops based on size
    static sortShops(shops) {
        const sorted = [];
        Object.keys(shops)
            .sort((a, b) => {
                return a - b;
            })
            .reverse()
            .forEach(function (k, v) {
                sorted.push(v);
            });
        return sorted;
    }
}