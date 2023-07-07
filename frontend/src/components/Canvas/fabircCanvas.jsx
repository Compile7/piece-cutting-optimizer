import { fabric } from "fabric";
import React, { useEffect } from "react";
import "../../App.css";
const fabricCanvas = new fabric.Canvas();

function Fabric(props) {
  const {loading, canvasWidth, canvasHeight, dimension} = props;

  useEffect(() => {
    loading && fabricCanvas.clear();
    var el = document.getElementById("canvas");
    var canvasDiv = document.querySelector(".canvas-div");
    
    const width = canvasDiv.clientWidth <= canvasWidth + 40 ?
                canvasWidth + 40 : canvasDiv.clientWidth;
    const height = canvasHeight >= 10 ?
                (canvasDiv.clientHeight) + (75*(canvasHeight-9)) : canvasDiv.clientHeight;
// console.log(height, width, canvasHeight, canvasWidth);
  
    // Here we have the canvas so we can initialize fabric
    loading && fabricCanvas.initialize(el, {
      width: dimension === "1D" ? width : canvasWidth + 50,
      height: dimension === "1D" ? height : canvasHeight ,
      style:"border-radius:5px; box-shadow: 1px 7px 8px 5px #c7c7c7c4; width: 100%; border: 1px solid #d9d6d2",
    });
  }, [loading]);
  return <canvas id="canvas"></canvas>;
}
const drawRectFor2D = (
  i,
  j,
  a,
  b,
  stockLength,
  stockBreadth,
  stockLengthStart
) => {
  if (stockLength !== 0) {
    var sheet = new fabric.Rect({
      top: stockLengthStart + 20,
      left: 20,
      right: stockLength,
      width: stockLength,
      height: stockBreadth,
      fill: "#c7c7c7c4",
      stroke: "black",
      hasControls: false,
      // objectCaching: false,
      selectable: false,
    });

    fabricCanvas.add(sheet);
  }
  var rect = new fabric.Rect({
    top: a + 20,
    left: i + 20,
    right: j + 20,
    width: j - i,
    height: b - a,
    fill: "#00ADB4",
    stroke: "black",
    hasControls: false,
    selectable: false,
    objectCaching: false,
  });
  rect.set(
    "fill",
    new fabric.Gradient({
      type: "linear",
      gradientUnits: "pixels", // or 'percentage'
      coords: {
        x1: 0,
        y1: -rect.height + 60 / 2,
        x2: 0,
        y2: rect.height + 60 / 2,
      },
      colorStops: [
        { offset: 0, color: "#00ADB4" },
        { offset: 0.5, color: "white" },
        { offset: 1, color: "#00ADB4" },
      ],
    })
  );
  var lengthText = new fabric.Text((j-i).toString(), {
    left:  (j+i)/2,
    top:  a + 20,
    fontSize: 15,
    fill: "black",
    hasControls: false,
    selectable: false,
  });
  var BreadthText = new fabric.Text((b-a).toString(), {
    left: j - 10,
    top: (a + b + 20)/2,
    fontSize: 15,
    fill: "black",
    hasControls: false,
    selectable: false,
  });
  fabricCanvas.add(rect);
  fabricCanvas.add(lengthText);
  fabricCanvas.add(BreadthText);
};
const drawRect = (i, j, width, top) => {
  var topLine = new fabric.Line(
    [
      i + 20,
      top === 0 ? top + 10 : top + 10 + top / 20,
      j + 20,
      top === 0 ? top + 10 : top + 10 + top / 20,
    ],
    { fill: "", stroke: "black", objectCaching: false, selectable: false }
  );

  var arc = new fabric.Path(
    `M ${i + 20} ${top === 0 ? top + 10 : top + 10 + top / 20} Q ${i},
     ${top === 0 ? top + 40 : top + 40 + top/70 *3 }, ${
      i + 20
    }, ${top === 0 ? 70 : 70 + top / 20 + top}`,
    {
      // fill: "#00ADB4",
      stroke: "black",
      objectCaching: false,
      selectable: false,
    }
  );
  arc.set('fill', new fabric.Gradient({
    type: 'linear',
    gradientUnits: 'pixels', // or 'percentage'
    coords: {
      x1: 0,
      y1:  -30,
      x2: 0,
      y2: 90,
    },
    colorStops: [
      { offset: 0, color: '#00ADB4' },
      { offset: 0.5, color: 'white' },
      { offset: 1, color: '#00ADB4' }
    ]
  }));

  var bottomLine = new fabric.Line(
    [
      i + 20,
      top === 0 ? top + 70 : top + top / 20 + 70,
      j + 20,
      top === 0 ? top + 70 : top + top / 20 + 70,
    ],
    { fill: "", stroke: "black", objectCaching: false, selectable: false }
  );

  var rect = new fabric.Rect({
    top: top === 0 ? top + 10 : top + 10 +  top / 20,
    left: i + 20,
    right: j + 20,
    width: width,
    height: 60,
    // fill: "#00ADB4",
    hasControls: false,
    selectable: false,
  });
  rect.set('fill', new fabric.Gradient({
    type: 'linear',
    coords: {
      gradientUnits: 'pixels', // or 'percentage'
      x1: 0,
      y1: -rect.height + 60 / 2,
      x2: 0,
      y2: rect.height + 60 / 2,
    },
    colorStops: [
      { offset: 0, color: '#00ADB4' },
      { offset: 0.5, color: 'white' },
      { offset: 1, color: '#00ADB4' }
    ]
  }));

  var text = new fabric.Text(width.toString(), {
    left: (j + i + 20) / 2 - 7,
    top: top === 0 ? 30 : top + top / 20 + 30,
    fontSize: 15,
    fill: "black",
    hasControls: false,
    selectable: false,
  });
  fabricCanvas.add(topLine);
  fabricCanvas.add(rect);
  fabricCanvas.add(arc);
  fabricCanvas.add(text);
  fabricCanvas.add(bottomLine);
};

const drawPipe = (result, top, dimension, stockLength, stockbreadth , stockLengthStart) => {
  {
    result.map((val, i) =>
      dimension === "1D" ? drawRect(val,result[i + 1],result[i + 1] - result[i] ,top * 70) :
      drawRectFor2D(val[0],val[1],
        stockLengthStart + val[2] ,
        stockLengthStart + val[3],
         i === 0 ? stockLength : 0, i === 0 ? stockbreadth : 0, i === 0 ? stockLengthStart : 0)
      

    );
  }
};

export { drawPipe, Fabric };
