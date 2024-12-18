//controls section
var simstatus = 0;
var rotstatus = 1;
//comments section
var commenttext = "Some Text";
var commentloc = 0;
//computing section
var trans = new point(200, 200);
var o = new point(0, 0, "O");
var q = new point(0, 0, "Q");
var a = new point(0, 0, "A");
var b = new point(0, 0, "B");
var p = new point(0, 0, "P");
var c = new point(0, 0, "C");
var d = new point(0, 0, "D");
var e = new point(0, 0, "E");
var f = new point(0, 0, "F");
var g = new point(0, 0, "G");
var h = new point(0, 0, "H");
var i = new point(0, 0, "I");
var j = new point(0, 0, "J");
var l = new point(0, 0, "L");
var m = new point(0, 0, "M");
var n = new point(0, 0, "N");
var s = new point(0, 0, "S");
var r = new point(0, 0, "R");

var k, ka, kb, kc, det;
var ok, oka, okb, okc, odet;
var r1 = 80,
  r2 = r1 / 2,
  r3 = 2.5 * r2,
  r4 = 2.5 * r2;
var theta4, theta3, otheta4, otheta3;
var BOQ = 30; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
var AQO; // All angles in Degrees. (mention the specification in the script like here)
var temp = 0;
//graphics section
var canvas;
var ctx;
var speed = 7;
var omega2;
//timing section
var simTimeId = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
//small point tracing section
var utx = [];
var uty = [];
var trace = false;
/*
function trythis()
{ alert();}
*/

//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss() {
  $(".variable").css("padding-top", "40px");
}

function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  var pauseTime;
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#alphaspinner").spinner("value", BOQ);
    pauseTime = setInterval("varupdate();", "100");
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
  }
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}

function varinit() {
  varchange();

  $("#ABslider").slider("value", 40);
  $("#ABspinner").spinner("value", 40);

  $("#alphaslider").slider("value", 55);
  $("#alphaspinner").spinner("value", 55);

  //Variable omega2 slider and number input types
  $("#omega2slider").slider("value", 1);
  $("#omega2spinner").spinner("value", 1);
  ptx = [];
  pty = [];
  document.getElementById("trace").checked = false;
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange() {
  //Link AB
  // slider initialisation : jQuery widget
  $("#ABslider").slider({ max: 70, min: 30, step: 2 });

  // number initialisation : jQuery widget
  $("#ABspinner").spinner({ max: 70, min: 30, step: 2 });
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#ABslider").on("slide", function (e, ui) {
    $("#ABspinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#ABspinner").on("spin", function (e, ui) {
    $("#ABslider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#ABspinner").on("change", function () {
    varchange();
  });

  // Angle Alpha
  // slider initialisation : jQuery widget
  $("#alphaslider").slider({ max: 360, min: 0, step: 1 });

  // number initialisation : jQuery widget
  $("#alphaspinner").spinner({ max: 360, min: 0, step: 1 });

  //Speed Change
  //sliderintialisation : jquery widget
  //$('#speedslider').slider({ max : 30, min : 7, step : 2 });
  //$('#speedspinner').slider({ max : 30, min : 7, step : 2 });

  // monitoring change in value and connecting slider and number
  $("#alphaslider").on("slide", function (e, ui) {
    $("#alphaspinner").spinner("value", ui.value);
  });
  $("#alphaspinner").on("spin", function (e, ui) {
    $("#alphaslider").slider("value", ui.value);
  });
  $("#alphaspinner").on("change", function () {
    varchange();
  });

  //Variable omega2 slider and number input types
  $("#omega2slider").slider({ max: 5, min: 0.2, step: 0.2 }); // slider initialisation : jQuery widget
  $("#omega2spinner").spinner({ max: 5, min: 0.2, step: 0.2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#omega2slider").on("slide", function (e, ui) {
    $("#omega2spinner").spinner("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("spin", function (e, ui) {
    $("#omega2slider").slider("value", ui.value);
    ptx = [];
    pty = [];
  });
  $("#omega2spinner").on("change", function () {
    varchange();
  });

  varupdate();
}

function varupdate() {
  $("#ABslider").slider("value", $("#ABspinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#alphaslider").slider("value", $("#alphaspinner").spinner("value"));
  $("#omega2slider").slider("value", $("#omega2spinner").spinner("value"));
  //$('#speedslider').slider("value", $('#speedspinner').spinner('value'));

  r1 = $("#ABspinner").spinner("value");

  printcomment("The End point traverses approximately in a straight line", 1);
  printcomment("OF=OB <br/> OB:OQ:BC = 1 : 2 : 2.5", 2);

  if (!simstatus) {
    /*if(BOQ<38 || BOQ>93) rotstate();*/
    $("#alphaslider").slider("disable");
    $("#alphaspinner").spinner("disable");
    $("#omega2set").show();
    //'#speedspinner').spinner("enable");
    omega2 = rotstatus * $("#omega2spinner").spinner("value");
    BOQ = BOQ + 0.1 * deg(omega2);
    BOQ = BOQ % 360;
  }
  if (simstatus) {
    $("#alphaslider").slider("enable");
    $("#alphaspinner").spinner("enable");
    $("#speedspinner").spinner("disable");
    $("#omega2set").hide();
    BOQ = $("#alphaspinner").spinner("value");
    omega2 = rotstatus * $("#omega2spinner").spinner("value");
    ptx = [];
    pty = [];
  }
  /*First Leg*/
  (r2 = r1 / 2), (r3 = 2.5 * r2), (r4 = 2.5 * r2);
  k = (r2 * r2 - r3 * r3 + r4 * r4 + r1 * r1) / 2;
  ka = k - r2 * (r1 - r4) * Math.cos(rad(BOQ)) - r4 * r1;
  kb = -2 * r2 * r4 * Math.sin(rad(BOQ));
  kc = k - r2 * (r1 + r4) * Math.cos(rad(BOQ)) + r4 * r1;
  det = kb * kb - 4 * ka * kc;
  /*Second Leg*/
  ok = (r2 * r2 - r3 * r3 + r4 * r4 + r1 * r1) / 2;
  oka = ok - r2 * (r1 - r4) * Math.cos(rad(180 + BOQ)) - r4 * r1;
  okb = -2 * r2 * r4 * Math.sin(rad(180 + BOQ));
  okc = k - r2 * (r1 + r4) * Math.cos(rad(180 + BOQ)) + r4 * r1;
  odet = okb * okb - 4 * oka * okc;
  o.xcoord = 0;
  o.ycoord = 0;
  l.xcoord = -270;
  l.ycoord = -150;
  q.xcoord = o.xcoord + r1;
  q.ycoord = 0;
  b.xcoord = o.xcoord + r2 * Math.cos(rad(BOQ));
  b.ycoord = o.ycoord + r2 * Math.sin(rad(BOQ));
  f.xcoord = -b.xcoord;
  f.ycoord = -b.ycoord;
  /*temp=pointdist(b,q);
AQO= deg(Math.asin(2.5*l*Math.sin(rad(BOQ))/temp))-deg(Math.acos((5.25*l*l+temp*temp)/(5*l*temp)));
a.xcoord=q.xcoord-((2.5*l*Math.cos(rad(AQO))));
a.ycoord=q.ycoord+(2.5*l*Math.sin(rad(AQO)));
p.xcoord=(a.xcoord+b.xcoord)/2;
p.ycoord=(a.ycoord+b.ycoord)/2;*/

  theta4 = deg(2 * Math.atan((-kb - Math.sqrt(det)) / (2 * ka)));
  c.xcoord = q.xcoord + r4 * Math.cos(rad(theta4));
  c.ycoord = q.ycoord + r4 * Math.sin(rad(theta4));
  theta3 = deg(Math.atan((c.ycoord - b.ycoord) / (c.xcoord - b.xcoord)));
  if (theta3 < 0) theta3 += 180;

  otheta4 = deg(2 * Math.atan((-okb - Math.sqrt(odet)) / (2 * oka)));
  g.xcoord = q.xcoord + r4 * Math.cos(rad(otheta4));
  g.ycoord = q.ycoord + r4 * Math.sin(rad(otheta4));
  otheta3 = deg(Math.atan((g.ycoord - f.ycoord) / (g.xcoord - f.xcoord)));
  if (otheta3 < 0) otheta3 += 180;
  d.xcoord = c.xcoord + r3 * Math.cos(rad(theta3));
  d.ycoord = c.ycoord + r3 * Math.sin(rad(theta3));
  h.xcoord = g.xcoord + r3 * Math.cos(rad(otheta3));
  h.ycoord = g.ycoord + r3 * Math.sin(rad(otheta3));
  p.xcoord = d.xcoord;
  p.ycoord = d.ycoord - 250;
  e.xcoord = p.xcoord + 30;
  e.ycoord = p.ycoord;
  i.xcoord = h.xcoord;
  i.ycoord = h.ycoord - 250;
  j.xcoord = i.xcoord + 30;
  j.ycoord = i.ycoord;
  //Sample mechanism
  n.xcoord = b.xcoord / 1.2 - 270;
  n.ycoord = b.ycoord / 1.2 - 150;
  m.xcoord = q.xcoord / 1.2 - 270;
  m.ycoord = q.ycoord / 1.2 - 150;
  r.xcoord = d.xcoord / 1.2 - 270;
  r.ycoord = d.ycoord / 1.2 - 150;
  s.xcoord = c.xcoord / 1.2 - 270;
  s.ycoord = c.ycoord / 1.2 - 150;

  draw();
}

function draw() {
  //pointdisp(a); to display point
  //pointjoin(a,b); to join to points with a line
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 550, 400); //clears the complete canvas#simscreen everytime

  o = pointtrans(o, trans);
  l = pointtrans(l, trans);
  q = pointtrans(q, trans);
  c = pointtrans(c, trans);
  b = pointtrans(b, trans);
  d = pointtrans(d, trans);
  p = pointtrans(p, trans);
  e = pointtrans(e, trans);
  f = pointtrans(f, trans);
  g = pointtrans(g, trans);
  h = pointtrans(h, trans);
  i = pointtrans(i, trans);
  j = pointtrans(j, trans);
  n = pointtrans(n, trans);
  m = pointtrans(m, trans);
  r = pointtrans(r, trans);
  s = pointtrans(s, trans);
  ptx.push(p.xcoord);
  pty.push(p.ycoord);

  pointjoin(o, q, ctx, "grey", 12);
  pointjoin(o, f, ctx, "green", 12);
  pointjoin(o, b, ctx, "green", 12);
  pointjoin(b, c, ctx, "green", 12);
  pointjoin(c, q, ctx, "red", 12);
  pointjoin(c, d, ctx, "red", 12);
  pointjoin(p, d, ctx, "black", 12);
  pointjoin(p, e, ctx, "black", 12);
  pointjoin(f, g, ctx, "green", 12);
  pointjoin(q, g, ctx, "red", 12);
  pointjoin(h, g, ctx, "red", 12);
  pointjoin(h, i, ctx, "black", 12);
  pointjoin(i, j, ctx, "black", 12);
  pointdisp(o, ctx);
  pointdisp(q, ctx);
  pointdisp(c, ctx);
  pointdisp(b, ctx);
  pointdisp(p, ctx);
  pointdisp(d, ctx);
  pointdisp(f, ctx);
  pointdisp(g, ctx);
  pointdisp(h, ctx);
  pointdisp(i, ctx);
  pointdisp(j, ctx);
  pointdisp(e, ctx);
  //Sample Mechanism

  if (trace) {
    pointtrace(ptx, pty, ctx, "blue", 2);
    pointdisp(p, ctx, 2, "", "", "", true, 3);
  } else {
    ptx = [];
    pty = [];
  }
}

function tracePlot() {
  trace = !trace;
}
// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    // document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    // document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    // document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    // document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
