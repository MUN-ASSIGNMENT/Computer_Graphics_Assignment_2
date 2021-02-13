var gl;
var vertices;
var points;
var programNormal;
var programTessellated;
var colorLocation;

var outLine = false;
var howMnayPoints = 3;

var fill = 1;
var tessellation = 0;
var rotate = 0;

/* triangle */
var vecTriangle = [
  vec2(-0.85, -0.4907477295),
  vec2(0.85, -0.4907477295),
  vec2(0.0, 0.9814954573)
];

/* square */
var vecSquare = [
  vec2(-0.7, -0.7),
  vec2(0.7, 0.7),
  vec2(-0.7, 0.7),

  vec2(-0.7, -0.7),
  vec2(0.7, 0.7),
  vec2(0.7, -0.7)
];

var vecPentagon = [
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


var vecHexagon = [
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

var vecOctagon = [
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

// for letter 'F'
var F = [
  // left column
  vec2(0, 0),
  vec2(30, 0),
  vec2(0, 150),
  vec2(0, 150),
  vec2(30, 0),
  vec2(30, 150),

  // top rung
  vec2(30, 0),
  vec2(100, 0),
  vec2(30, 30),
  vec2(30, 30),
  vec2(100, 0),
  vec2(100, 30),

  // middle rung
  vec2(30, 60),
  vec2(67, 60),
  vec2(30, 90),
  vec2(30, 90),
  vec2(67, 60),
  vec2(67, 90),
];
// convert the F's vertices to Clip Space
var letter = [];
F.forEach(f => {
  console.log(f[0], f[1], "dsa");
  const tmp = 256;
  let x = f[0] / tmp * 2.0 - 1.0;
  let y = (f[1] / tmp * 2.0 - 1.0) * -1;
  letter.push(vec2(x, y));
});

// default shape - triangle
vertices = vecTriangle.slice(0);

//render following function onload
window.onload = init = () => {
  let normalGl = generateCanvasNormal();
  let tessellatedGl = generateCanvasTessellated();
  RadioButton(normalGl, tessellatedGl);
  tessellationSlider(normalGl, tessellatedGl);
  polygonSlider(normalGl, tessellatedGl);
  rotationSlider(normalGl, tessellatedGl);
}

// Line or filled listner
const RadioButton = (gl1, gl2, gl3) => {
  const button = document.getElementById("lines"); //lines
  const button1 = document.getElementById("filled"); //filled
  const buttonLetter = document.getElementById("letter"); //F

  // when the letter button clicked
  buttonLetter.addEventListener("click", () => {
    vertices = letter; // set the vertices to 'F'
    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
    verticeToPoints(gl3, progTest, howMnayPoints);
  });

  button.addEventListener("input", () => {
    fill = 2;
    console.log("lines button!", fill);
    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
  });

  button1.addEventListener("input", () => {
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

    howMnayPoints = sliderValue;

    console.log("FILL: ", fill);

    switch (sliderValue) {
      default:
      case "3":
        vertices = vecTriangle.slice(0);
        break;
      case "4":
        vertices = vecSquare.slice(0);
        break;
      case "5":
        vertices = vecPentagon.slice(0);
        break;
      case "6":
        vertices = vecHexagon.slice(0);
        break;
      case "8":
        vertices = vecOctagon.slice(0);
        break;
    }

    recalculate(gl1, programNormal, 0);
    recalculate(gl2, programTessellated, tessellation);
  })
}

//listen to to the slider on UI for the number of subdivision 
const tessellationSlider = (gl1, gl2, gl3) => {
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
const rotationSlider = (gl1, gl2, gl3) => {
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

  // call 
  recalculate(gl, programTessellated, tessellation);
  return gl;
}

const verticeToPoints = (gl, program) => {

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  // Bind the id buffer here.
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  // fill the buffer with vertecies
  let starCoords = star();
  gl.bufferData(gl.ARRAY_BUFFER, starCoords, gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // color location 
  colorLocation = gl.getUniformLocation(program, "u_Color");
}

const star = () => {
  coords = new Float32Array(24);
  k = 0;
  coords[k++] = 0;
  coords[k++] = 0;
  for (var i = 0; i <= 20; i++) {
    var angle = -Math.PI / 2 + (i / 10) * 2 * Math.PI;
    var radius = i % 2 == 0 ? 0.5 : 0.2;
    coords[k++] = radius * Math.cos(angle); 
    coords[k++] = radius * Math.sin(angle);
  }
  return coords;
}
const recalculate = (gl, program, tessellated = 0) => {
  points = [];
  // create a tessellated shape
  for (var i = 0; i < vertices.length; i += 3) {
    triangle(vertices[i + 0], vertices[i + 1], vertices[i + 2], tessellated, 1);
  }

  // Load the data into the GPU
  var bufferId = gl.createBuffer();
  // bind to the ARRAY_BUFFER
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  // fill the buffer
  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  // color location 
  colorLocation = gl.getUniformLocation(program, "u_Color");

  render(gl);
}

// reder funtion 
const render = (gl) => {
  gl.clear(gl.COLOR_BUFFER_BIT);
  if (fill === 2) {
    for (let i = 0; i < points.length; i += 3) {
      // set the color
      var cc = [Math.random(), Math.random(), Math.random(), 1.0];
      gl.uniform4fv(colorLocation, cc);
      // draw
      gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
  } else {
    for (let i = 0; i < points.length; i += 3) {
      // set the color
      var cc = [Math.random(), Math.random(), Math.random(), 1.0];
      gl.uniform4fv(colorLocation, cc);
      // draw
      gl.drawArrays(gl.TRIANGLES, i, 3);
    }
  }
}

// tessellation method
const triangle = (a, b, c, count, fill) => {
  if (count == 0) {
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
// creating shapes according to the given d(num of edges)
function makeShape(d) {
  let p1 = [];
  let rad = Math.PI * 2.0;

  for (let i = 0; i < d; i++) {
    let x = 1 * Math.cos(rad / d * i);
    let y = 1 * Math.sin(rad / d * i);
    let nextI = i === d - 1 ? 0 : i + 1;
    let nextX = 1 * Math.cos(rad / d * nextI);
    let nextY = 1 * Math.sin(rad / d * nextI);
    p1.push(vec2(0, 0));
    p1.push(vec2(x, y));
    p1.push(vec2(nextX, nextY));

  }

  return p1;
}