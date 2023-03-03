import { fabric } from "fabric";
import React, { useEffect } from "react";
import "../App.css";
const fabricCanvas = new fabric.Canvas();

function Fabric() {
  useEffect(() => {
    var el = document.getElementById("canvas");

    // Here we have the canvas so we can initialize fabric
    fabricCanvas.initialize(el, {
      height: 500,
      width: 1000,
      backgroundColor: '#aaaaaa'
    });
  }, []);
  return <canvas id="canvas"></canvas>;
}
const drawRect = (i,j,width, top ) => {

  var rect =  new fabric.Rect({
      top: top===0 ? top: top+(top/20),
      left: i,
      right: j,
      width: width,
      height: 100,
      fill: "#c6daeb",
      strokeWidth: 1,
	    stroke: "#000",
      hasControls:false,
      selectable: false,
    })
    
    var text = new fabric.Text(width.toString(), {
      left: (j+i)/2-7,
      top: top===0 ? 40: top+(top/2),
      fontSize: 15,
      fill: "black",
      hasControls:false,
      selectable: false,
    })

    fabricCanvas.add(rect)
    fabricCanvas.add(text)
}


const drawPipe = (result, top) => {
  {result.map((val,i) => (
   
    drawRect( val,
       result[i+1],
        (result[i+1]-result[i]),top*100 )
   
    
   ))}
};

export { drawPipe, Fabric };
