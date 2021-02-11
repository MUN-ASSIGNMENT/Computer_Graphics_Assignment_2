
var gl;
var vertices;
var points;
var programNormal;
var programTessellated;

var fill = 1;
var tessellation = 0;
var rotate = 0;
var twist = false;

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

vertices = vec_triangle.slice(0);

window.onload = init = () => {
  let normalGl = generateCanvasNormal();
  let tessellatedGl = generateCanvasTessellated();
  tessellationSlider();
  polygonSlider(normalGl, tessellatedGl);
  rotationSlider();
}

const polygonSlider = (gl1, gl2) => {
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
    }
    recalculate(gl1, programNormal)
    recalculate(gl2, programTessellated)
  })
}

const tessellationSlider = (gl) => {
  const slider = document.getElementById("tessellation-slider");
  document.getElementById("tessellation").innerHTML = "0";
  slider.addEventListener("input", () => {
    const sliderValue = slider.value;
    document.getElementById("tessellation").innerHTML = sliderValue;
    tessellation = sliderValue;
  })
}

const rotationSlider = (gl) => {
  const slider = document.getElementById("rotation-slider");
  document.getElementById("rotation").innerHTML = "0";
  slider.addEventListener("input", () => {
    const sliderValue = slider.value;
    document.getElementById("rotation").innerHTML = sliderValue;
    tessellation = sliderValue;
  })
}

const generateCanvasNormal = () => {
  var canvasNormal = document.getElementById("gl-canvas-normal");
  // Initialize the GL context
  var gl = canvasNormal.getContext("webgl");

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

  recalculate(gl, programNormal);
  return gl;
}

const generateCanvasTessellated = () => {
  var canvasTessellated = document.getElementById("gl-canvas-tessellated");
  // Initialize the GL context
  var gl = canvasTessellated.getContext("webgl");

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

  recalculate(gl, programTessellated);
  return gl;
}


/* 
$("#shape").selectmenu({change: function( event, ui ) {
  
  switch (ui.item.value) {
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
  } 
  recalculate();
  
}});
 
$("#tessellation-slider").slider({
  value:  0,
  min:    0,
  max:    5,
  step:   1,
  slide:  function(event, ui) {
    $("#tessellation").val("" + ui.value + "");
    tessellation = ui.value;
    recalculate();
}});

$("#fill").buttonset();
$("#fill-radio1" , "#fill").click(function() {
  fill = 1;
  recalculate();
});
$("#fill-radio2" , "#fill").click(function() {
  fill = 2;
  recalculate();
});
$("#fill-radio3" , "#fill").click(function() {
  fill = 3;
  recalculate();
});
$("#fill-radio4" , "#fill").click(function() {
  fill = 4;
  recalculate();
}); 

$("#rotation-slider").slider({
value:  0,
min:    0,
max:    1800,
step:   1,
slide:  function(event, ui) {
  $("#rotation").val("" + ui.value + "°");
  rotate = ui.value;
  recalculate();
}});
});

$("#twist").buttonset();
$("#twist-radio1" , "#twist").click(function() {
twist = false;
recalculate();
});
$("#twist-radio2", "#twist").click(function() {
twist = true;
recalculate();
});

*/
const recalculate = (gl, program, tessellated = 0, fill = 1) => {
  points = [];
  
  for (var i = 0; i < vertices.length; i += 3) {
    triangle(vertices[i + 0], vertices[i + 1], vertices[i + 2], tessellation = 0, fill = 1);
  }console.log(fill)

  gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
  var vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  console.log(fill)
  render(gl);
}

const render = (gl) => {console.log(fill)
  gl.clear(gl.COLOR_BUFFER_BIT);
  console.log(fill)
  if (fill === 3) {
    gl.drawArrays(gl.LINES, 0, 3);
  } else {
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
  }
}

const triangle = (a, b, c, count, fill) => {
  if (count === 0) {
    if (twist) {
      var da = Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2)) * (rotate * Math.PI / 180.0);
      var db = Math.sqrt(Math.pow(b[0], 2) + Math.pow(b[1], 2)) * (rotate * Math.PI / 180.0);
      var dc = Math.sqrt(Math.pow(c[0], 2) + Math.pow(c[1], 2)) * (rotate * Math.PI / 180.0);
    } else {
      var da = (rotate * Math.PI / 180.0);
      var db = (rotate * Math.PI / 180.0);
      var dc = (rotate * Math.PI / 180.0);
    }

    var ap = vec2(
      (a[0] * Math.cos(da)) - (a[1] * Math.sin(da)),
      (a[0] * Math.sin(da)) + (a[1] * Math.cos(da)));
    var bp = vec2(
      (b[0] * Math.cos(db)) - (b[1] * Math.sin(db)),
      (b[0] * Math.sin(db)) + (b[1] * Math.cos(db)));
    var cp = vec2(
      (c[0] * Math.cos(dc)) - (c[1] * Math.sin(dc)),
      (c[0] * Math.sin(dc)) + (c[1] * Math.cos(dc)));

    if (fill == 3 || fill == 4) {
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
  if (fill == 1 || fill == 3) {
    triangle(ab, ac, bc, (count - 1), fill);
  }
}

