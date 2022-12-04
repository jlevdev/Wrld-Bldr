import { polygonScale } from "geometric";
import usePaper from "hooks/usePaper";
import Ward from "map/wards/Ward";
import { Segment } from "paper/dist/paper-core";
import { Fragment, useState } from "react";
import {
  Canvas,
  Circle,
  Layer,
  Path,
  Rectangle,
  View,
} from "react-paper-bindings";
import {
  CAP_DEFAULT,
  DEFAULT_PALETTE,
  JOIN_DEFAULT,
  NORMAL_STROKE,
  THICK_STROKE,
} from "./PaperConstants";

const pointConversion = (p) => {
  return [p.x, p.y];
};

//TODO this shit doesnt work - handle this in model with some geom functions
const geometricSmoothMultiPointConversion = (points, fac) => {
  const segments = points.map((p) => {
    return new Segment(p);
  });
  for (let i = 0; i <= segments.length - 1; i++) {
    segments[i < 0 ? i + length : i].smooth(
      { type: "geometric", factor: 0.3 },
      true,
      true
    );
  }
  return segments.map((s) => {
    return [s.point.x, s.point.y];
  });
};

const CurvyPolygon = (props) => {
  const {
    points,
    strokeColor,
    strokeWidth,
    fillColor,
    strokeJoin = JOIN_DEFAULT,
    strokeCap = CAP_DEFAULT,
    ...restProps
  } = props;

  //TODO model should handle scaling
  const scaledPoints = polygonScale(
    points.map((p) => {
      return pointConversion(p);
    }),
    0.7
  );
  return (
    <Path
      strokeJoin={strokeJoin}
      strokeCap={strokeCap}
      strokeColor={strokeColor}
      strokeWidth={strokeWidth}
      fillColor={fillColor}
      //TODO model should handle smoothing
      segments={geometricSmoothMultiPointConversion(scaledPoints)}
      {...restProps}
    />
  );
};

const LineCapHider = (props) => {
  const { point, size, ...restProps } = { props };
  return (
    <Rectangle
      center={[props.point.x, props.point.y]}
      size={[size * 5, size * 5]}
      {...restProps}
    />
  );
};

const Polygon = (props) => {
  const {
    points,
    strokeJoin = JOIN_DEFAULT,
    strokeCap = CAP_DEFAULT,
    ...restProps
  } = props;
  return (
    <Path
      strokeJoin={strokeJoin}
      strokeCap={strokeCap}
      segments={points.map((p) => {
        return pointConversion(p);
      })}
      {...restProps}
    />
  );
};

const PolyLine = (props) => {
  const {
    points,
    strokeJoin = JOIN_DEFAULT,
    strokeCap = CAP_DEFAULT,
    ...restProps
  } = props;
  return (
    <Path
      strokeJoin={strokeJoin}
      strokeCap={strokeCap}
      segments={points.map((p) => {
        return pointConversion(p);
      })}
      {...restProps}
    />
  );
};

const Shop = (props) => {
  const {
    points,
    strokeJoin = JOIN_DEFAULT,
    strokeCap = CAP_DEFAULT,
    locationData,
    fillColor,
    patch,
    ...restProps
  } = props;

  //const { setActiveShop } = usePaper();
  const [shopFillColor, setShopFillColor] = useState(fillColor);
  //TODO might be unecessary remove later if not needed
  //if (patch.district) patch.district.replace(patch, locationData);
  //patch.shop = locationData;

  const addHexColor = (c1, c2) => {
    let hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
    while (hexStr.length < 6) {
      hexStr = "0" + hexStr;
    } // Zero pad.
    return hexStr;
  };

  return (
    <Path
      strokeJoin={strokeJoin}
      strokeCap={strokeCap}
      segments={points.map((p) => {
        return pointConversion(p);
      })}
      fillColor={shopFillColor}
      onClick={() => {
        //TODO setActiveShop(locationData);
      }}
      onMouseEnter={() => {
        if (locationData)
          setShopFillColor(
            "#" + addHexColor(district.color.substring(1, 8), "111111")
          );
      }}
      onMouseLeave={() => {
        setShopFillColor(district.color);
      }}
      {...restProps}
    />
  );
};

function Paper() {
  const { screen, model, activeSettlement } = usePaper();

  const palette = DEFAULT_PALETTE;
  return (
    model && (
      <Canvas width={screen.w} height={screen.h}>
        <View>
          <Layer>
            <Circle
              fillColor={palette.paper}
              center={[screen.w / 2, screen.h / 2]}
              radius={screen.w * 2}
            />
          </Layer>
          <Layer>
            {model.roads.map((road, index) => {
              return (
                <Fragment key={"roads-" + index}>
                  <PolyLine
                    points={road}
                    smooth={true}
                    strokeColor={palette.dark}
                    strokeWidth={(Ward.MAIN_STREET + NORMAL_STROKE) * 6}
                  />
                  <PolyLine
                    points={road}
                    smooth={true}
                    strokeColor={palette.paper}
                    strokeWidth={(Ward.MAIN_STREET + NORMAL_STROKE) * 5}
                  />
                  <LineCapHider point={road[0]} fillColor={palette.paper} />
                </Fragment>
              );
            })}
            {/**
             * TODO
             * instead of label names determinging, maybe each ward should
             * just have it's own draw info that we pull from?
             */}

            {model.patches.map((patch, drawIndex) => {
              const label = patch.ward.getLabel();

              if (label === Ward.CASTLE_WARD) {
                patch.ward.geometry.map((block, index) => {
                  return (
                    <Polygon
                      key={"castle-" + drawIndex + index}
                      points={block}
                      fillColor={palette.light}
                      strokeColor={palette.dark}
                      strokeWidth={NORMAL_STROKE * 2}
                    />
                  );
                });
              } else if (label === Ward.CATHEDRAL_WARD) {
                const c =
                  typeof patch.district == "undefined"
                    ? "#000000"
                    : patch.district.color;
                const rect = patch.ward.geometry;
                return (
                  <Rectangle
                    key={"cathedral-" + drawIndex}
                    center={pointConversion(rect.p)}
                    size={[rect.width, rect.height]}
                    strokeColor={palette.dark}
                    strokeWidth={NORMAL_STROKE}
                    fillColor={c}
                    rotation={rect.angle}
                  />
                );
              } else if (Ward.shopWards.indexOf(label) != -1) {
                const c =
                  typeof patch.district == "undefined"
                    ? "#000000"
                    : patch.district.color;

                return (
                  <Shop
                    key={"shop-" + drawIndex}
                    points={patch.ward.geometry[0]}
                    patch={patch}
                    fillColor={c}
                    strokeColor={palette.dark}
                    strokeWidth={NORMAL_STROKE * 3}
                    locationData={
                      activeSettlement.map_data.shopIndexes.indexOf(drawIndex)
                        ? activeSettlement.locations[drawIndex]
                        : null
                    }
                  />
                );
              } else if (Ward.sceneryWards.indexOf(label) != -1) {
                patch.ward.geometry.map((block, index) => {
                  return (
                    <Polygon
                      key={"scenery-" + drawIndex + index}
                      points={block}
                      fillColor={palette.light}
                      strokeColor={palette.dark}
                      strokeWidth={NORMAL_STROKE * 2}
                    />
                  );
                });
              } else if (label === Ward.PARK_WARD) {
                return (
                  <CurvyPolygon
                    key={"park-" + drawIndex}
                    points={patch.ward.geometry[0]}
                    fillColor={palette.garden}
                    strokeColor={palette.dark}
                    strokeWidth={NORMAL_STROKE}
                  />
                );
              } else if (label === Ward.MARKET_WARD) {
                const c =
                  typeof patch.district == "undefined"
                    ? "#000000"
                    : patch.district.color;

                return (
                  <Polygon
                    key={"market-" + drawIndex}
                    points={patch.ward.geometry[0]}
                    fillColor={c}
                    strokeColor={palette.dark}
                    strokeWidth={NORMAL_STROKE}
                  />
                );
              }
            })}
            {model.wall && (
              <Polygon
                points={model.wall.shape}
                strokeColor={palette.dark}
                strokeWidth={THICK_STROKE}
              />
            )}
            {model.wall &&
              model.wall.towers.map((point, index) => {
                return (
                  <Circle
                    key={"tower-" + index}
                    fillColor={palette.dark}
                    center={[point.x, point.y]}
                    radius={THICK_STROKE}
                  />
                );
                //TODO implement citadel drawing
              })}
          </Layer>
        </View>
      </Canvas>
    )
  );
}

export default Paper;
