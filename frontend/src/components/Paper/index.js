import * as paper from "paper/dist/paper-full";
import React, { useLayoutEffect } from "react";
import usePaper from "hooks/usePaper";
import { Canvas, View, Layer, Rectangle } from 'react-paper-bindings';

/**
 * This is the component file that gives the canvas element to React
 * It will create the necessary actions to prepare for a new map to be drawn on the canvas.
 * It also is the file that should wipe the canvas and previous map files, Model and MapDrawer.
 */

function Paper() {
  const { screen } = usePaper();

  const canvasRef = useRef(null);
  const canvas = canvasRef.current;
  const context = canvas.getContext('2d');

  useLayoutEffect(() => {
    //TODO: not how I should handle this for production, fix after actual settlement creation using backend CRUD is done
    //paper.install(window);
    //paper.setup("paper-canvas");
  }, [])

  return (
    <Canvas>
      <View>

      </View>
    </Canvas>
  );
}

export default Paper;
