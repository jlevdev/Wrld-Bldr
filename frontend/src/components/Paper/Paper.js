import * as paper from "paper/dist/paper-full";
import React, { Component, Fragment } from "react";
import Model from "../../Map/building/Model";
import MapDrawer from "../../Map/mapping/MapDrawer";

/**
 * This is the component file that gives the canvas element to React
 * It will create the necessary actions to prepare for a new map to be drawn on the canvas.
 * It also is the file that should wipe the canvas and previous map files, Model and MapDrawer.
 */

export class Paper extends Component {
  static i = null;

  static screen = { w: 1400, h: 1200 };

  //set to DEBUG value
  static options = { size: "Metropolis" };
  static default_options = { size: "Metropolis" };

  constructor(props) {
    super(props);
  }

  static addActiveShop(newShop) {
    Paper.i.props.updateShopList(newShop);
  }

  static clear() {
    Paper.i = null;
    Model.instance = null;
  }

  static getShopIndexes(seed) {
    Paper.clear();
    new Model(MapDrawer.SETTLEMENT_SIZE_MAP[Paper.options.size], seed);
    return MapDrawer.generateShopIndexes();
  }

  static generateMap() {
    Model.instance = null;
    console.log("Settlement at map gen", Paper.i.props.activeSettlement);
    console.log(
      "Seed at map gen",
      Paper.i.props.activeSettlement.map_data.seed
    );
    new Model(
      MapDrawer.SETTLEMENT_SIZE_MAP[
        Paper.i.props.activeSettlement.map_data.size
      ],
      Paper.i.props.activeSettlement.map_data.seed
    );
    new MapDrawer();
  }

  static SetActiveShop(shop) {
    Paper.i.props.setActiveShop(shop);
  }

  static wipe() {
    //Paper.i.props.createNewSettlement();
  }

  componentDidMount() {
    //TODO: not how I should handle this for production, fix after actual settlement creation using backend CRUD is done
    paper.install(window);
    paper.setup("paper-canvas");

    if (Paper.i === null || typeof Paper.i === "undefined") Paper.i = this;

    Paper.generateMap();
  }

  render() {
    return (
      <canvas
        id="paper-canvas"
        resize="true"
        style={{ width: Paper.screen.w + "px", height: Paper.screen.h + "px" }}
      />
    );
  }

  updateDraw() {}
}

export default Paper;
