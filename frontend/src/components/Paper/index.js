import { polygonScale } from "geometric";
import usePaper from "hooks/usePaper";
import Ward from "map/wards/Ward";
import { Segment } from "paper/dist/paper-core";
import React, { useState } from "react";
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

const Shop = React.memo((props) => {
  const {
    points,
    strokeJoin = JOIN_DEFAULT,
    strokeCap = CAP_DEFAULT,
    fillColor,
    patch,
    lsRelations = null,
    updateRel = null,
    ...restProps
  } = props;

  const [shopFillColor, setShopFillColor] = useState(fillColor);

  const addHexColor = (c1, c2) => {
    let hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
    while (hexStr.length < 6) {
      hexStr = "0" + hexStr;
    } // Zero pad.
    return hexStr;
  };

  const startHover = () => {
    document.body.style.cursor = "pointer";
    setShopFillColor(
      "#" + addHexColor(patch.district.color.substring(1, 8), "111111")
    );
  };

  const endHover = () => {
    document.body.style.cursor = "auto";
    setShopFillColor(patch.district.color);
  };

  if (lsRelations && !lsRelations.district) {
    updateRel({
      relation: lsRelations,
      data: {
        district: patch.district,
        startHover,
        endHover,
      },
    });

    return (
      <Path
        strokeJoin={strokeJoin}
        strokeCap={strokeCap}
        segments={points.map((p) => {
          return pointConversion(p);
        })}
        fillColor={shopFillColor}
        onClick={() => {
          setActiveShop(lsRelations);
        }}
        onMouseEnter={() => {
          startHover();
        }}
        onMouseLeave={() => {
          endHover();
        }}
        {...restProps}
      />
    );
  }

  return (
    <Path
      strokeJoin={strokeJoin}
      strokeCap={strokeCap}
      segments={points.map((p) => {
        return pointConversion(p);
      })}
      fillColor={shopFillColor}
      {...restProps}
    />
  );
});

const Paper = React.memo(() => {
  const {
    screen,
    model,
    activeSettlement,
    locationShopRelations,
    updateRel,
    setActiveShop,
  } = usePaper();
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
                <PolyLine
                  key={"roads-outline-" + index}
                  points={road}
                  smooth={true}
                  strokeColor={palette.dark}
                  strokeWidth={(Ward.MAIN_STREET + NORMAL_STROKE) * 6}
                />
              );
            })}
          </Layer>
          <Layer>
            {model.roads.map((road, index) => {
              return (
                <PolyLine
                  key={"roads-" + index}
                  points={road}
                  smooth={true}
                  strokeColor={palette.paper}
                  strokeWidth={(Ward.MAIN_STREET + NORMAL_STROKE) * 5}
                />
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
                const shopIndex =
                  activeSettlement.map_data.shopIndexes.indexOf(drawIndex);
                const locData =
                  shopIndex != -1 ? locationShopRelations[shopIndex] : null;

                return (
                  <Shop
                    key={"shop-" + drawIndex}
                    points={patch.ward.geometry[0]}
                    patch={patch}
                    fillColor={c}
                    strokeColor={palette.dark}
                    strokeWidth={NORMAL_STROKE * 3}
                    lsRelations={locData}
                    updateRel={updateRel}
                    setActiveShop={setActiveShop}
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
});

export default Paper;
