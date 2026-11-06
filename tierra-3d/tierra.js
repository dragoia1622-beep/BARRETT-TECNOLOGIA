
"use strict";

/*
 * BARRETT TECNOLOGÍA
 * SISTEMA DRAGO-IA
 * PLANETA TIERRA 3D
 */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const contenedor = document.getElementById("drago-tierra-3d");

if (contenedor) {

  /* ==========================================
     ESCENA Y CÁMARA
  ========================================== */

  const escena = new THREE.Scene();

  const camara = new THREE.PerspectiveCamera(
    40,
    1,
    0.1,
    100
  );

  camara.position.z = 4.5;

  /* ==========================================
     RENDERIZADOR
  ========================================== */

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;

  contenedor.appendChild(renderer.domElement);

  /* ==========================================
     GEOMETRÍA DEL PLANETA
  ========================================== */

  const geometria = new THREE.SphereGeometry(
    1.45,
    96,
    64
  );

  /* ==========================================
     TEXTURA REAL DE LA TIERRA
     SOLAR SYSTEM SCOPE
  ========================================== */

 
const rutaTextura = new URL(
  "../assets/images/2k_earth_daymap.jpg",
  import.meta.url
).href;


  const textura = new THREE.TextureLoader().load(
    rutaTextura,

    () => {
      console.log(
        "DRAGO-IA: textura de la Tierra cargada correctamente"
      );
    },

    undefined,

    (error) => {
      console.error(
        "DRAGO-IA: error cargando la textura",
        error
      );
    }
  );

  textura.colorSpace = THREE.SRGBColorSpace;
  textura.anisotropy = Math.min(
    8,
    renderer.capabilities.getMaxAnisotropy()
  );

  /* ==========================================
     MATERIAL: COLORES NATURALES
  ========================================== */

  const material = new THREE.MeshStandardMaterial({
    map: textura,
    color: 0xffffff,
    roughness: 1,
    metalness: 0
  });

  const tierra = new THREE.Mesh(
    geometria,
    material
  );

  /* ==========================================
     GRUPO E INCLINACIÓN DEL EJE
  ========================================== */

  const grupo = new THREE.Group();

  grupo.rotation.z = 0.12;

  grupo.add(tierra);
  escena.add(grupo);

  /* ==========================================
     ILUMINACIÓN DEL PLANETA
  ========================================== */

  const luzAmbiental = new THREE.AmbientLight(
    0xffffff,
    1.8
  );

  escena.add(luzAmbiental);

  const sol = new THREE.DirectionalLight(
    0xffffff,
    2.0
  );

  sol.position.set(2, 3, 5);
  escena.add(sol);

  /* ==========================================
     ATMÓSFERA AZUL
  ========================================== */

  const atmosfera = new THREE.Mesh(
    new THREE.SphereGeometry(1.49, 96, 64),

    new THREE.ShaderMaterial({

      uniforms: {
        colorAtmosfera: {
          value: new THREE.Color(0x48bfff)
        }
      },

      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vVista;

        void main() {

          vec4 posicionVista =
            modelViewMatrix * vec4(position, 1.0);

          vNormal = normalize(
            normalMatrix * normal
          );

          vVista = normalize(
            -posicionVista.xyz
          );

          gl_Position =
            projectionMatrix * posicionVista;
        }
      `,

      fragmentShader: `
        uniform vec3 colorAtmosfera;

        varying vec3 vNormal;
        varying vec3 vVista;

        void main() {

          float borde = 1.0 -
            max(
              dot(
                normalize(vNormal),
                normalize(vVista)
              ),
              0.0
            );

          float brillo = pow(borde, 4.0);

          gl_FragColor = vec4(
            colorAtmosfera,
            brillo * 0.65
          );
        }
      `,

      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.FrontSide
    })
  );

  grupo.add(atmosfera);

  /* ==========================================
     ADAPTACIÓN A PANTALLAS
  ========================================== */

  function ajustarTamano() {

    const ancho = contenedor.clientWidth;
    const alto = contenedor.clientHeight;

    if (!ancho || !alto) return;

    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();

    renderer.setSize(
      ancho,
      alto,
      false
    );
  }

  window.addEventListener(
    "resize",
    ajustarTamano
  );

  ajustarTamano();

  /* ==========================================
     ROTACIÓN SOBRE SU PROPIO EJE
  ========================================== */

  const reloj = new THREE.Clock();

  function animar() {

    requestAnimationFrame(animar);

    const delta = Math.min(
      reloj.getDelta(),
      0.05
    );

    tierra.rotation.y += delta * 0.25;

    renderer.render(
      escena,
      camara
    );
  }

  animar();

}
