import React from "react";
import { gsapAnimation, removeModels, resetAnimation } from "../Scene/Script";
import "./styles.css";

const motors = [
  {
    name: "Motor1",
    group: "motor",
    rute: "./model/motor/Motor1.gltf",
  },
  {
    name: "Motor2",
    group: "motor",
    rute: "./model/motor/Motor2.gltf",
  },
  {
    name: "Motor3",
    group: "motor",
    rute: "./model/motor/Motor3.gltf",
  },
];

const helices = [
  {
    name: "Helice1",
    group: "helices",
    rute: "./model/helices/Helice1.gltf",
  },
  {
    name: "Helice2",
    group: "helices",
    rute: "./model/helices/Helice2.gltf",
  },
  {
    name: "Helice3",
    group: "helices",
    rute: "./model/helices/Helice3.gltf",
  },
];

const camaras = [
  {
    name: "Camara1",
    group: "camara",
    rute: "./model/cam/Cam1.gltf",
  },
  {
    name: "Camara2",
    group: "camara",
    rute: "./model/cam/Cam2.gltf",
  },
  {
    name: "Camara3",
    group: "camara",
    rute: "./model/cam/Cam3.gltf",
  },
];

const animations = {
  motors: {
    target: {
      x: -1.36,
      y: 0.2,
      z: 1.23,
    },
    camera: {
      x: -2.28,
      y: 2.89,
      z: 4.92,
    },
    zoom: 1.2,
  },
  helices: {
    target: {
      x: 1.1502,
      y: 0.2929,
      z: 1.1503,
    },
    camera: {
      x: 6.3039,
      y: 5.7885,
      z: 5.7885,
    },
    zoom: 1.2,
  },
  camaras: {
    target: {
      x: -0.2241,
      y: 0,
      z: 1.322,
    },
    camera: {
      x: -7,
      y: 5,
      z: 12,
    },
    zoom: 4,
  },
};

const Menu = () => {
  return (
    <div className="MenuContainer">
      <div className="MenuWrapper">
        <div className="MenuOptions">
          <h1>Drone Customization</h1>
          <ul className="MenuOptionsList">
            <li>
              <label htmlFor="motors">Motors</label>
              <select
                className="motors"
                onClick={() => {
                  gsapAnimation(
                    animations.motors.target,
                    animations.motors.camera,
                    animations.motors.zoom
                  );
                }}
                onChange={(e) => {
                  const motor = motors.find(
                    (motor) => motor.name === e.target.value
                  );
                  removeModels(motor.rute, motor.group);
                }}
              >
                {motors.map((motor, id) => (
                  <option key={id} value={motor.name}>
                    {motor.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="helices">Helices</label>
              <select
                className="helices"
                onChange={(e) => {
                  const hel = helices.find(
                    (hel) => hel.name === e.target.value
                  );
                  removeModels(hel.rute, hel.group);
                }}
                onClick={() => {
                  gsapAnimation(
                    animations.helices.target,
                    animations.helices.camera,
                    animations.helices.zoom
                  );
                }}
              >
                {helices.map((hel, id) => (
                  <option key={id} value={hel.name}>
                    {hel.name}
                  </option>
                ))}
              </select>
            </li>
            <li>
              <label htmlFor="camaras">Camaras</label>
              <select
                className="camaras"
                onChange={(e) => {
                  const camara = camaras.find(
                    (camara) => camara.name === e.target.value
                  );
                  removeModels(camara.rute, camara.group);
                }}
                onClick={() => {
                  gsapAnimation(
                    animations.camaras.target,
                    animations.camaras.camera,
                    animations.camaras.zoom
                  );
                }}
              >
                {camaras.map((cam, id) => (
                  <option key={id} value={cam.name}>
                    {cam.name}
                  </option>
                ))}
              </select>
            </li>
          </ul>
          <div className="VistaGeneral">
            <button onClick={() => resetAnimation()}>Vista general</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
