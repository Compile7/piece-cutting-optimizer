import { fabric } from "fabric";
import React, { useEffect } from "react";
import "../App.css";
const fabricCanvas = new fabric.Canvas();

function Fabric(props) {
  const {loading} = props;
  useEffect(() => {
    loading && fabricCanvas.clear();
    var el = document.getElementById("canvas");
  
    // Here we have the canvas so we can initialize fabric
    loading && fabricCanvas.initialize(el, {
      height: document.body.clientHeight - 60,
      width: document.body.clientWidth,
      backgroundColor: "#aaaaaa",
    });
  }, [loading]);
  return <canvas id="canvas"></canvas>;
}
const drawRect = (i, j, width, top) => {
  var topLine = new fabric.Line(
    [
      i + 20,
      top === 0 ? top : top + top / 20,
      j + 20,
      top === 0 ? top : top + top / 20,
    ],
    { fill: "", stroke: "black", objectCaching: false, selectable: false }
  );

  var line = new fabric.Path(
    `M ${i + 20} ${top === 0 ? top : top + top / 20} Q ${i}, ${top + 50}, ${
      i + 20
    }, ${top === 0 ? 100 : 100 + top / 20 + top}`,
    {
      fill: "#c6daeb",
      stroke: "black",
      objectCaching: false,
      selectable: false,
    }
  );

  var bottomLine = new fabric.Line(
    [
      i + 20,
      top === 0 ? top + 100 : top + top / 20 + 100,
      j + 20,
      top === 0 ? top + 100 : top + top / 20 + 100,
    ],
    { fill: "", stroke: "black", objectCaching: false, selectable: false }
  );

  var rect = new fabric.Rect({
    top: top === 0 ? top : top + top / 20,
    left: i + 20,
    right: j + 20,
    width: width,
    height: 100,
    fill: "#c6daeb",
    hasControls: false,
    selectable: false,
  });

  var text = new fabric.Text(width.toString(), {
    left: (j + i + 20) / 2 - 7,
    top: top === 0 ? 40 : top + top / 20 + 45,
    fontSize: 15,
    fill: "black",
    hasControls: false,
    selectable: false,
  });
  fabricCanvas.add(topLine);
  fabricCanvas.add(rect);
  fabricCanvas.add(line);
  fabricCanvas.add(text);
  fabricCanvas.add(bottomLine);
};

const drawPipe = (result, top) => {
  {
    result.map((val, i) =>
      drawRect(val, result[i + 1], result[i + 1] - result[i], top * 100)
    );
  }
};

export { drawPipe, Fabric };
