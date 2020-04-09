/* eslint-disable camelcase */
/* eslint-disable max-len */
'use strict';
const orGraf = {};
const loops = [];
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.font = '17px Times new Roman';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';





const A = [
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const r = 15;
const rloops = 3 * r / 4;
const arrr = 5;
const N = 11;

const calcVertics = (n, P, x0, y0, obj) => {

  const step = P / n;
  const side = P / 3;
  let left = 0;
  let vert = 1;
  let newX = x0;
  let newY = y0;

  ctx.beginPath();
  ctx.setLineDash([5, 15]);
  ctx.moveTo(x0, y0);

  ctx.lineTo(x0 + side / 2, y0 - side * Math.sin(Math.PI / 3));
  ctx.lineTo(x0 + side, y0);
  ctx.lineTo(x0, y0);
  ctx.stroke();

  ctx.setLineDash([]);

  for (let curMargin = 0; curMargin <= side; curMargin += step) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
        radius: r,
      },
      enumerable: true,
      writable: true
    });
    newX += step * Math.cos(Math.PI / 3);
    newY += -step * Math.sin(Math.PI / 3);
    left = side - curMargin;
    vert++;
  }

  newX = x0 + side / 2;
  newY = y0 - side * Math.sin(Math.PI / 3);

  for (let curMargin = left; curMargin <= side; curMargin += step) {
    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
        radius: r,
      },
      enumerable: true,
      writable: true
    });
    newX += step * Math.cos(Math.PI / 3);
    newY += step * Math.sin(Math.PI / 3);
    left = side - curMargin;
    vert++;
  }

  newX = x0 + side;
  newY = y0;

  for (vert; vert <= n; vert++) {
    newX += -step;

    Object.defineProperty(obj, `vert${vert}`, {
      value: {
        coords: [newX, newY],
        num: vert,
        radius: r,
      },
      enumerable: true,
      writable: true
    });
  }
};

calcVertics(11, 1600, 50, 520, orGraf);


const makeCons = (matrix, obj) => {
  for (const key in obj) {
    obj[key].simple = [];
    obj[key].double = [];
  }
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j]) {
        const names = [`vert${i + 1}`, `vert${j + 1}`];
        if (i === j) loops.push(`vert${i + 1}`);
        else if (!matrix[j][i]) {
          obj[names[0]].simple.push(`vert${j + 1}`);
        } else {
          obj[names[0]].double.push(`vert${j + 1}`);
        }
      }
    }
  }
};
const center = (x0, y0, p) => {
  const x = x0 + p / 6;
  const y = y0 + p / 6;
  return {
    x,
    y
  };
};

const drawLoops = (arr, obj, x0, y0) => {
  let alpha;
  const xc = center(x0, y0, 1600).x;
  const yc = center(x0, y0, 1600).y;
  for (const i in arr) {
    alpha = Math.atan2(obj[arr[i]].coords[1] - yc, obj[[arr[i]]].coords[0] - xc);
    const R = Math.sqrt((obj[arr[i]].coords[0] - xc) ** 2 + (obj[arr[i]].coords[1] - yc) ** 2) + r;
    const xloops = xc + R * Math.cos(alpha);
    const yloops = yc + R * Math.sin(alpha);
    ctx.beginPath();
    ctx.arc(xloops, yloops, rloops, 0, 2 * Math.PI, false);
    ctx.stroke();
  }
};

function drawArrowhead(x0, y0, x1, y1, radius, fillStyle = 'white', strokestyle = 'black') {
  const xCenter = x1;
  const yCenter = y1;
  let angle;
  let x;
  let y;
  ctx.fillStyle = fillStyle;
  ctx.strokestyle = strokestyle;
  ctx.beginPath();
  angle = Math.atan2(y1 - y0, x1 - x0);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;

  ctx.moveTo(x, y);
  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);

  angle += (1.0 / 3.0) * (2 * Math.PI);
  x = radius * Math.cos(angle) + xCenter;
  y = radius * Math.sin(angle) + yCenter;
  ctx.lineTo(x, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

const readyCons = (x0, y0, x1, y1, radius) => {
  const step = 1;
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  const dx = step * Math.cos(alpha);
  const dy = step * Math.sin(alpha);
  let x = x0;
  let y = y0;
  while (true) {
    x += dx;
    y += dy;
    if (Math.sqrt((x1 - x) ** 2 + (y1 - y) ** 2) < radius + arrr) break;
  }
  const res = {
    x,
    y
  };
  return res;
};

function singleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r * 4.6) * Math.cos(Math.PI / 2 - alpha),
    dy: (r * 5.9) * Math.sin(Math.PI / 2 - alpha)
  };
}

function doubleAdditionalDots(x0, y0, x1, y1) {
  const alpha = Math.atan2(y1 - y0, x1 - x0);
  return {
    dx: (r * 1.15) * Math.cos(Math.PI / 2 - alpha),
    dy: (r * 2.4) * Math.sin(Math.PI / 2 - alpha)
  };
}

const singleDirected = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].simple.length; i++) {
      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].simple[i]}`].coords[0];
      const toY = obj[`${obj[key].simple[i]}`].coords[1];


      if (Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === 1 || Math.abs(obj[key].num - obj[`${obj[key].simple[i]}`].num) === (Object.keys(obj).length - 1)) {
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(fromX, fromY, toX, toY, obj[`${obj[key].simple[i]}`].radius);
        drawArrowhead(fromX, fromY, coordinates.x, coordinates.y, arrr);
      } else {
        const { dx, dy } = singleAdditionalDots(fromX, fromY, toX, toY);
        let newX = (fromX + toX) / 2;
        let newY = (fromY + toY) / 2;
        newX -= dx;
        newY += dy;
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(newX, newY);
        ctx.lineTo(toX, toY);
        ctx.stroke();
        const coordinates = readyCons(newX, newY, toX, toY, obj[`${obj[key].simple[i]}`].radius);
        drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
      }
    }
  }
};

const bothDirected = obj => {
  for (const key in obj) {
    for (let i = 0; i < obj[key].double.length; i++) {

      const fromX = obj[key].coords[0];
      const fromY = obj[key].coords[1];
      const toX = obj[`${obj[key].double[i]}`].coords[0];
      const toY = obj[`${obj[key].double[i]}`].coords[1];

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      const { dx, dy } = doubleAdditionalDots(fromX, fromY, toX, toY);
      let newX = (fromX + toX) / 2;
      let newY = (fromY + toY) / 2;
      newX += dx;
      newY -= dy;
      ctx.lineTo(newX, newY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
      const coordinates = readyCons(newX, newY, toX, toY, obj[key].radius);
      drawArrowhead(newX, newY, coordinates.x, coordinates.y, arrr);
    }
  }
};


const drawVertex = obj => {
  for (const key in obj) {
    ctx.beginPath();
    ctx.arc(obj[key].coords[0], obj[key].coords[1], obj[key].radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.strokeText(obj[key].num, obj[key].coords[0], obj[key].coords[1]);
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
};



const exitCount = (obj, loops) => {
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = 'black';
  ctx.fillText('Outside', 600, 600);
  ctx.stroke();
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].exit = obj[key].simple.length + obj[key].double.length;

    if (loops.includes(`vert${obj[key].num}`)) obj[key].exit++;
    ctx.fillText(`${name} : ${obj[key].exit}`, 600, 600 + obj[key].num * 25);
  }
};

const entranceCount = (obj, loops) => {
  ctx.font = '24px Times new Roman';
  ctx.fillStyle = 'black';
  ctx.fillText('Inside', 900, 600);
  ctx.stroke();
  for (const key in obj) {
    const name = `vert${obj[key].num}`;
    obj[key].entrance = 0;
    if (loops.includes(name)) obj[key].entrance++;
    for (const j in obj) {
      if (obj[j].simple.includes(name)) obj[key].entrance++;
      if (obj[j].double.includes(name)) obj[key].entrance++;
    }
    ctx.fillText(`${name} : ${obj[key].entrance}`, 900, 600 + obj[key].num * 25);
  }
};


const matrixCopy = JSON.parse(JSON.stringify(A));

function MultiplyElemets(m1, m2) {
  const C = Array.from(m1);
  for (let i = 0; i < m1.length; i++) {
    for (let j = 0; j < m2.length; j++) {
      C[i][j] = m1[i][j] * m2[i][j];
    }
  }
  return C;
}
function MultiplyMatrix(m1, m2) {
  const result = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}
function MatrixPow(n, A) {
  if (n === 1) return A;     // Функцию MultiplyMatrix см. выше
  else return MultiplyMatrix(A, MatrixPow(n - 1, A));
}
function TransMatrix(A) {       //На входе двумерный массив
  const m = A.length, n = A[0].length, AT = [];
  for (let i = 0; i < n; i++) {
    AT[ i ] = [];
    for (let j = 0; j < m; j++) AT[ i ][j] = A[j][ i ];
  }
  return AT;
}


const matrDos = [];
for (let i = 0; i < N; i++) {
  matrDos[i] = [];
  for (let j = 0; j < N; j++) {
    matrDos[i][j] = (i === j) ? 1 : 0;
  }
}

const A2 = MatrixPow(2, matrixCopy);
const A3 = MatrixPow(3, matrixCopy);


const mfw = JSON.parse(JSON.stringify(A));
for (let i = 0; i < mfw.length; i++) {
  mfw[i][i] = 0;
}

const ways2 = [];
const ways3 = [];

const findlen2 = matrix => {
  ctx.fillText('Paths two in length', 600, 950);
  let counter = 1;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1) {
        for (let k = 0; k < matrix.length; k++) {
          if (matrix[j][k] === 1) {
            ways2.push(`${i + 1}-${j + 1}-${k + 1}`);
            ctx.fillText(`${i + 1}-${j + 1}-${k + 1}`, 600, 950 + counter * 25);
            //console.log(`${i + 1}-${j + 1}-${k + 1}`);
            counter++;
          }
        }
      }
    }
  }
};


const findlen3 = matrix => {
  ctx.fillText('Paths three in length', 950, 950);
  let counter = 1;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1) {
        for (let k = 0; k < matrix.length; k++) {
          if (matrix[j][k] === 1) {
            for (let w = 0; w < matrix.length; w++) {
              if (matrix[k][w] === 1) {
                ways3.push(`${i + 1}-${j + 1}-${k + 1}-${w + 1}`);
                ctx.fillText(`${i + 1}-${j + 1}-${k + 1}-${w + 1}`, 950, 950 + counter * 25);
                //console.log(`${i + 1}-${j + 1}-${k + 1}-${w + 1}`);
                counter++;
              }
            }
          }
        }
      }
    }
  }
};

const arrForSum = [];
for (let i = 1; i < N; i++) {
  arrForSum.push(MatrixPow(i, matrixCopy));
}

for (let i = 0; i < arrForSum.length; i++) {
  for (let j = 0; j < matrDos.length; j++) {
    for (let k = 0; k < matrDos.length; k++) {
      if (arrForSum[i][j][k]) {
        matrDos[j][k] = 1;
      }
    }
  }
}

const S = MultiplyElemets(JSON.parse(JSON.stringify(matrDos)), TransMatrix(JSON.parse(JSON.stringify(matrDos)))); //матриця сильной связности



const V = [];
const used = new Set();

for (let i = 0; i < S.length; i++) { //компоненты сильной связности
  let temp = [];
  if (used.has(i + 1)) continue;
  for (let j = i; j < S.length; j++) {
    if (S[j][i]) {
      used.add(j + 1);
      temp.push(j + 1);
    }
  }
  if (temp.length) V.push(Array.from(temp));
  temp = [];
}

const conRegen = {};

V.forEach((val, ind) => {
  val.forEach(inVal => {
    conRegen[inVal] = ind + 1;
  });
});

const newLength = V.length;

const newMatrix = [];
for (let i = 0; i < newLength; i++) {
  newMatrix[i] = [];
  for (let j = 0; j < newLength; j++) {
    newMatrix[i][j] = 0;
  }
}
let newVerts = {};
for (let i = 0; i < matrixCopy.length; i++) { //recreate matrix for condensation
  for (let j = 0; j < matrixCopy.length; j++) {
    if (matrixCopy[i][j] === 1) {
      const a = conRegen[i + 1];
      const b = conRegen[j + 1];
      if (a !== b) newMatrix[a - 1][b - 1] = 1;
    }
  }
}

{
  const n = V.length;
  const x = 900;
  const y = 325;
  const R = 200;

  const alpha = 2 * Math.PI / n;

  const vertics = {};
  let i = 1;

  for (let angle = 0; i <= n; angle += alpha) {
    const newX = x + R * Math.cos(angle);
    const newY = y + R * Math.sin(angle);
    vertics[`vert${i}`] = {};
    vertics[`vert${i}`].coords = [newX, newY];
    vertics[`vert${i}`].num = `${V[i - 1]}`;
    vertics[`vert${i}`].radius = r / 2 + R * (V[i - 1].length) * 0.05;
    i++;
  }
  newVerts = vertics;
}

for (const key in newVerts) {  //adding props
  newVerts[key].simple = [];
}


for (let i = 0; i < newMatrix.length; i++) { //find connection
  for (let j = 0; j < newMatrix[i].length; j++) {
    if (newMatrix[i][j]) {
      const names = [`vert${i + 1}`, `vert${j + 1}`];
      if (!newMatrix[j][i]) newVerts[names[0]].simple.push(`vert${j + 1}`);
    }
  }
}




ctx.font = '22px Times new Roman';
ctx.fillText('Adjacency matrix', 250, 600);
for (let i = 0; i < A.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(A[i], 250, 600 + (i + 1) * 25);
}



ctx.font = '22px Times new Roman';
ctx.fillText('Reachability matrix', 250, 950);
for (let i = 0; i < matrDos.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(matrDos[i], 250, 950 + (i + 1) * 25);
}

ctx.font = '22px Times new Roman';
ctx.fillText('Strong connectivity matrix', 250, 1300);
for (let i = 0; i < S.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(S[i], 250, 1300 + (i + 1) * 25);
}
ctx.font = '22px Times new Roman';
ctx.fillText('Adjacency matrix of consideration graph', 250, 1650);
for (let i = 0; i < newMatrix.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(newMatrix[i], 250, 1650 + (i + 1) * 25);
}
ctx.font = '22px Times new Roman';
ctx.fillText('Components:', 250, 1800);
for (let i = 0; i < V.length; i++) {
  ctx.font = '24px Times new Roman';
  ctx.fillText(V[i], 250, 1800 + (i + 1) * 25);
}


makeCons(A, orGraf);

drawLoops(loops, orGraf, 75, 100);
singleDirected(orGraf);
bothDirected(orGraf);
singleDirected(newVerts);
drawVertex(orGraf);
drawVertex(newVerts);


exitCount(orGraf, loops);
entranceCount(orGraf, loops);
findlen2(A);
findlen3(A);

console.log('Square');
console.log(A2);
console.log('Cube');
console.log(A3);
