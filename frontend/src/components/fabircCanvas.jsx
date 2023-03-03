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
      width: 500,
    });
  }, []);
  return <canvas id="canvas"></canvas>;
}

const drawRect = () => {
  fabricCanvas.add(
    new fabric.Rect({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: "red",
    })
  );
};

export { drawRect, Fabric };
