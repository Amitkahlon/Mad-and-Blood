const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

const MOVEMENT_MODE = {
  stand: 0,
  walk: 1
}

const MOUSE_MODE = {
  Unselected: 0,
  ballSelected: 1,
}

const mouse_state = {
  mouse_mode: MOUSE_MODE.Unselected,
  selectedBall: null
}


const myBall1 = {
  id: 0,
  x: 300, 
  y: 300,
  r: 20,
  color: "#000000",
  mode: MOVEMENT_MODE.stand,
  moveDestination: {x: 30, y: 30}
}

const myBall2 = {
  id: 1,
  x: 200, 
  y: 300,
  r: 20,
  color: "#000000",
  mode: MOVEMENT_MODE.stand,
  moveDestination: {x: 30, y: 30}
}

const myBall3 = {
  id: 2,
  x: 100, 
  y: 300,
  r: 20,
  color: "#000000",
  mode: MOVEMENT_MODE.stand,
  moveDestination: {x: 30, y: 30}
}

const ENTITY_LIST = [
  myBall1,
  myBall2,
  myBall3
]


function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return {mouseX: x, mouseY: y};
}

const drawBall = (x, y, r, color) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.stroke()
  ctx.fillStyle = color
  ctx.fill()
}

// let mouseDown = false;
// const downPos = {x: null, y: null};
// const upPos = {x: null, y: null};


// const pointInRect = ({x1, y1, x2, y2}, {x, y}) => (
//   (x > x1 && x < x2) && (y > y1 && y < y2)
// )

// canvas.addEventListener("mousedown", (event) => {
//   mouseDown = true;
//   const {mouseX, mouseY} = getCursorPosition(canvas, event);
//   downPos.x = mouseX;
//   downPos.y = mouseY;
// })

// canvas.addEventListener("mouseup", (event) => {
//   mouseDown = false;
//   const {mouseX, mouseY} = getCursorPosition(canvas, event);
//   upPos.x = mouseX;
//   upPos.y = mouseY;

//   // const xDis = getDistance(downPos.x, upPos.x);
//   // const yDis = getDistance(downPos.y, upPos.y);

//   const rectPos = {x1: downPos.x, y1: downPos.y, x2: upPos.x, y2: upPos.y};
//   const isInside = pointInRect(rectPos, {x: myBall1.x, y: myBall1.y});
  
//   console.log(isInside);
// })

canvas.addEventListener("click", (event) => {
  console.log("Hit!")
  const {mouseX, mouseY} = getCursorPosition(canvas, event);

  if(mouse_state.mouse_mode === MOUSE_MODE.Unselected){
    const id = selectBall(mouseX, mouseY);

    if(id != null){
      const currentBall = getEntity(id);
      currentBall.color = "#DD725B";
      mouse_state.mouse_mode = MOUSE_MODE.ballSelected;
      mouse_state.selectedBall = id;

    }
  } else if(mouse_state.mouse_mode === MOUSE_MODE.ballSelected) {
    const currentBall = getEntity(mouse_state.selectedBall);
    currentBall.moveDestination.x = mouseX;
    currentBall.moveDestination.y = mouseY;
    currentBall.mode = MOVEMENT_MODE.walk;
    mouse_state.mouse_mode = MOUSE_MODE.Unselected;
    mouse_state.selectedBall = null;
    currentBall.color = "#000000";
  }
  

  // checkCollision(mouseX, mouseY);
})

const getEntity = (id) => {
  return ENTITY_LIST.find((entity) => entity.id === id)
}

const selectBall = (mouseX, mouseY) => {
  for (let i = 0; i < ENTITY_LIST.length; i++) {
    const ball = ENTITY_LIST[i];
    const a = {x: mouseX, y: mouseY};
    const b = {x: ball.x, y: ball.y};

    const ballSelected = checkCollision(a, b, ball.r);
    if(ballSelected){
      return ball.id;
    }
  }

  return null;
}

const getDistance = (x, y) => {
  return Math.abs(x - y);
}

const getPointDistance = (point1, point2) => {
    const disX = getDistance(point1.x, point2.x);
    const disY = getDistance(point1.y, point2.y);

    let dis = Math.pow(disX, 2) + Math.pow(disY, 2)
    dis = Math.sqrt(dis);
    return dis;
}

const checkCollision = (mousePos, ballPos, r) => {
    const distance = getPointDistance(mousePos, ballPos)

    return distance < (r);
}

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

const entityReached = (entity) => {
  const currentPos = {x: entity.x, y: entity.y};
  const wantedPos = entity.moveDestination;
  const reached = checkCollision(wantedPos, currentPos, entity.r);
  return reached;
}

const movement = () => {
  for (const entity of ENTITY_LIST) {
    const MOVE_DIS = 1;
    if(entity.mode === MOVEMENT_MODE.walk){
      if(entityReached(entity)){
        entity.mode = MOVEMENT_MODE.stand;
        continue;
      }
      const ballPos = {x: entity.x, y: entity.y};
      const wantedPos = {x: entity.moveDestination.x, y: entity.moveDestination.y};

      // const xDis = getDistance(ballPos.x, wantedPos.x);
      const yDis = getDistance(ballPos.y, wantedPos.y)
      const cDis = getPointDistance(ballPos, wantedPos)


      // const ratio = MOVE_DIS / cDis;
      const deg = toDegrees(Math.asin(yDis / cDis));

      let addY, addX;
      addY = MOVE_DIS * Math.sin(deg);
      addX = MOVE_DIS * Math.cos(deg);

      
      if(entity.x < wantedPos.x){
        entity.x += addX;
      }else {
        entity.x -= addX;
      }

      if(entity.y < wantedPos.y)
      {
        entity.y += addY;
      }else {
        entity.y -= addY;
      }
    }
  }
   
}

const renderBalls = () => {
  ENTITY_LIST.forEach(ball => {
    drawBall(ball.x, ball.y, ball.r, ball.color);
  })
}

setInterval(() => {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  movement();
  renderBalls();
}, 1000/60)
