
var gl;
var vertices;
var points;
var programNormal;
var programTessellated;

var progTest;
var outLine = false;

var fill = 1;
var tessellation = 0;
var rotate = 0;

/* triangle */
var vec_triangle = [
  vec2(-0.85, -0.4907477295),
  vec2(0.85, -0.4907477295),
  vec2(0.0, 0.9814954573)
];

/* square */
var vec_square = [
  vec2(-0.7, -0.7),
  vec2(0.7, 0.7),
  vec2(-0.7, 0.7),

  vec2(-0.7, -0.7),
  vec2(0.7, 0.7),
  vec2(0.7, -0.7)
];

var vec_pentagon = [
  vec2(0.0, 0.0),
  vec2(0.0, -1.000000),
  vec2(-0.951057, -0.309017),

  vec2(0.0, 0.0),
  vec2(-0.951057, -0.309017),
  vec2(-0.587785, 0.809017),

  vec2(0.0, 0.0),
  vec2(-0.587785, 0.809017),
  vec2(0.587785, 0.809017),

  vec2(0.0, 0.0),
  vec2(0.587785, 0.809017),
  vec2(0.951057, -0.309017),

  vec2(0.0, 0.0),
  vec2(0.951057, -0.309017),
  vec2(0.0, -1.000000),
];


var vec_hexagon = [
  vec2(0.0, 0.0),
  vec2(0.0, -1.000000),
  vec2(-0.866025, -0.500000),

  vec2(0.0, 0.0),
  vec2(-0.866025, -0.500000),
  vec2(-0.866025, 0.500000),

  vec2(0.0, 0.0),
  vec2(-0.866025, 0.500000),
  vec2(0.0, 1.000000),

  vec2(0.0, 0.0),
  vec2(0.0, 1.000000),
  vec2(0.866025, 0.500000),

  vec2(0.0, 0.0),
  vec2(0.866025, 0.500000),
  vec2(0.866025, -0.500000),

  vec2(0.0, 0.0),
  vec2(0.866025, -0.500000),
  vec2(0.0, -1.000000),

];

var vec_octagon = [
  vec2(0, 0),
  vec2(0.7071067811865476, 0.7071067811865475),
  vec2(6.123233995736766e-17, 1),

  vec2(0, 0),
  vec2(-1, 1.2246467991473532e-16),
  vec2(-0.7071067811865477, -0.7071067811865475),

  vec2(0, 0),
  vec2(0.7071067811865474, -0.7071067811865477),
  vec2(1, -2.4492935982947064e-16),

  vec2(0, 0),
  vec2(3.061616997868383e-16, 1),
  vec2(-0.7071067811865467, 0.7071067811865483),

  vec2(0, 0),
  vec2(-0.7071067811865471, -0.7071067811865479),
  vec2(-4.286263797015736e-16, -1),

  vec2(0, 0),
  vec2(1, -4.898587196589413e-16),
  vec2(0.7071067811865472, 0.7071067811865478),

  vec2(0, 0),
  vec2(-0.7071067811865465, 0.7071067811865486),
  vec2(-1, 6.123233995736766e-16),

  vec2(0, 0),
  vec2(-2.4499125789312946e-15, -1),
  vec2(0.7071067811865465, -0.70710678118654),
]

var vec_octa = makeShape(8);

vertices = vec_triangle.slice(0);

//render following function onload
window.onload = init = () => {
  let normalGl = generateCanvasNormal();
  let tessellatedGl = generateCanvasTessellated();
  let testGl = canvasTest();
  RadioButton(normalGl, tessellatedGl, testGl);
  tessellationSlider(normalGl, tessellatedGl);
  polygonSlider(normalGl, tessellatedGl, testGl);
  rotationSlider(normalGl, tessellatedGl);
}

//listen to the event on the radio button: line or filled 
const RadioButton = (gl1, gl2) => {
  const lines = document.getElementById("lines");
  const filled = document.getElementById("filled");

  lines.addEventListener("input", () => {
    fill = 2;
    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
  });

  filled.addEventListener("input", () => {
    fill = 1;
    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
  });
};

//listen to to the slider on UI for number of sides for the polygon
const polygonSlider = (gl1, gl2, gl3) => {
  const slider = document.getElementById("polygon-slider");
  document.getElementById("polygon").innerHTML = "3";
  slider.addEventListener("input", () => {
    const sliderValue = slider.value === "7" ? "8" : slider.value;
    document.getElementById("polygon").innerHTML = sliderValue;

    switch (sliderValue) {
      default:
      case "3":
        vertices = vec_triangle.slice(0);
        break;
      case "4":
        vertices = vec_square.slice(0);
        break;
      case "5":
        vertices = vec_pentagon.slice(0);
        break;
      case "6":
        vertices = vec_hexagon.slice(0);
        break;
      case "8":
        vertices = vec_octagon.slice(0);
        break;
    }

    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
    verticeToPoints(gl3, progTest, sliderValue);
  })
}

//listen to to the slider on UI for the number of subdivision 
const tessellationSlider = (gl1, gl2) => {
  const slider = document.getElementById("tessellation-slider");
  document.getElementById("tessellation").innerHTML = "0";
  slider.addEventListener("input", () => {
    const sliderValue = slider.value;
    document.getElementById("tessellation").innerHTML = sliderValue;
    tessellation = sliderValue;

    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
  })
}

//listen to to the slider on UI for the number of degree to rotate 
const rotationSlider = (gl1, gl2) => {
  const slider = document.getElementById("rotation-slider");
  document.getElementById("rotation").innerHTML = "0";
  slider.addEventListener("input", () => {
    const sliderValue = slider.value;
    document.getElementById("rotation").innerHTML = sliderValue;
    rotate = sliderValue;
    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
  })
}

const canvasTest = () => {
  var canvasTest = document.getElementById("gl-canvas-test");
  // Initialize the GL context
  var gl = canvasTest.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvasTest.width, canvasTest.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //  Load shaders and initialize attribute buffers
  progTest = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(progTest);

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  // Bind the id buffer here.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

  // default situation - triangle when the page is loaded.
  verticeToPoints(gl, progTest, 3);
  return gl;
}

//generate a normal canvas
const generateCanvasNormal = () => {
  var canvasNormal = document.getElementById("gl-canvas-normal");
  // Initialize the GL context
  var gl = canvasNormal.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvasNormal.width, canvasNormal.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //  Load shaders and initialize attribute buffers
  programNormal = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(programNormal);

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer
  var vPosition = gl.getAttribLocation(programNormal, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  recalculate(gl, programNormal, 0);
  return gl;
}

//generate a tessellated canvas
const generateCanvasTessellated = () => {
  var canvasTessellated = document.getElementById("gl-canvas-tessellated");
  // Initialize the GL context
  var gl = canvasTessellated.getContext("webgl2");

  // Only continue if WebGL is available and working
  if (gl === null) {
    alert("Unable to initialize WebGL. Your browser or machine may not support it.");
    return;
  }

  //  Configure WebGL
  gl.viewport(0, 0, canvasTessellated.width, canvasTessellated.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  //  Load shaders and initialize attribute buffers
  programTessellated = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(programTessellated);

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer

  var vPosition = gl.getAttribLocation(programTessellated, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  recalculate(gl, programTessellated, tessellation);
  return gl;
}

const verticeToPoints = (gl, program, d) => {
  points = makeShape(d);

  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render2(gl);
}


const recalculate = (gl, program, tessellated = 0, fill = 1) => {
  points = [];
  for (var i = 0; i < vertices.length; i += 3) {
    triangle(vertices[i + 0], vertices[i + 1], vertices[i + 2], tessellated, fill = 1);
  }

  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  render(gl);
}

const render2 = (gl) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (fill === 2) {
    gl.drawArrays(gl.LINE_LOOP, 0, points.length);
  } else {
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
  }
}

const render = (gl) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (fill === 2) {
    console.log('what?')
    for (let i = 0; i < points.length; i += 3) {
      gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
    // gl.drawArrays(gl.LINE_LOOP, 0, points.length);
  } else {
    for (let i = 0; i < points.length; i += 3) {
      gl.drawArrays(gl.TRIANGLES, i, 3);
    }
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
    // console.log(points.length);
  }
}

const triangle = (a, b, c, count, fill) => {
  if (count === 0) {
    var da = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2)) * (rotate * Math.PI / 180.0);
    var db = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2)) * (rotate * Math.PI / 180.0);
    var dc = Math.sqrt(Math.pow(c[0], 2) + Math.pow(c[1], 2)) * (rotate * Math.PI / 180.0);

    var ap = vec2(
      (a[0] * Math.cos(da)) - (a[1] * Math.sin(da)),
      (a[0] * Math.sin(da)) + (a[1] * Math.cos(da)));
    var bp = vec2(
      (b[0] * Math.cos(db)) - (b[1] * Math.sin(db)),
      (b[0] * Math.sin(db)) + (b[1] * Math.cos(db)));
    var cp = vec2(
      (c[0] * Math.cos(dc)) - (c[1] * Math.sin(dc)),
      (c[0] * Math.sin(dc)) + (c[1] * Math.cos(dc)));

    if (fill == 2) {
      points.push(ap, bp, ap, cp, bp, cp);
    } else {
      points.push(ap, bp, cp);
    }

    return;
  }

  var ab = mix(a, b, 0.5);
  var ac = mix(a, c, 0.5);
  var bc = mix(b, c, 0.5);

  triangle(a, ab, ac, (count - 1), fill);
  triangle(b, bc, ab, (count - 1), fill);
  triangle(c, ac, bc, (count - 1), fill);
  if (fill == 1 || fill == 2) {
    triangle(ab, ac, bc, (count - 1), fill);
  }
  
}

// helper func
function makeShape(d) {
  let p1 = [];
  let rad = Math.PI * 2.0;

  for (let i = 0; i < d; i++) {
    let x = 1 * Math.cos(rad / d * i);
    let y = 1 * Math.sin(rad / d * i);
    p1.push(vec2(x, y));
  }

  return p1;
}