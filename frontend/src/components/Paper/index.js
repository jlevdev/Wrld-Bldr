import * as paper from "paper/dist/paper-full";
import React, { useLayoutEffect } from "react";


/**
 * This is the component file that gives the canvas element to React
 * It will create the necessary actions to prepare for a new map to be drawn on the canvas.
 * It also is the file that should wipe the canvas and previous map files, Model and MapDrawer.
 */

function Paper() {
  let i = null; const [state, setstate] = useState(initialState)

  const screen = { w: 1400, h: 1200 };

  //set to DEBUG value
  const options = { size: "Metropolis" };
  const default_options = { size: "Metropolis" };

  useLayoutEffect(() => {
    //TODO: not how I should handle this for production, fix after actual settlement creation using backend CRUD is done
    paper.install(window);
    paper.setup("paper-canvas");

    generateMap();
  }, [])

  return (

    );
}

export default SettlementCreate;


export class Paper extends Component {


  componentDidMount() {
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

  updateDraw() { }
}

export default Paper;
