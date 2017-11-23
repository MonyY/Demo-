var WIDTH = 1920;
var HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

// var endTime = new Date()
// endTime.setTime(endTime.getTime() + 3600 * 1000)
var curShowTimeSeconds = 0

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00","#669900","#FFBB33","#FF8800","#FF4444","#CC0000"]


onload = function() {

  WIDTH = document.body.clientWidth
  HEIGHT = document.body.clientHeight

  MARGIN_LEFT = Math.round(WIDTH /10);
  RADIUS = Math.round(WIDTH * 4 / 5 / 108)-1

  MARGIN_TOP = Math.round(HEIGHT /5);

  var cvs = document.getElementById('canvas')
  var contxt = cvs.getContext('2d')

  cvs.width = WIDTH
  cvs.height = HEIGHT

  curShowTimeSeconds = getCurShowTimeSeconds()
  setInterval(
    function(){
      render( contxt )
      update()
    },50
  )
  
}

function render(cxt) {

  cxt.clearRect(0, 0, WIDTH, HEIGHT)

  var hours = parseInt(curShowTimeSeconds/3600),
      minutes = parseInt((curShowTimeSeconds - hours*3600) / 60),
      seconds = curShowTimeSeconds%60;

  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours/10), cxt)
  renderDigit(MARGIN_LEFT + 15*(RADIUS+1), MARGIN_TOP, parseInt(hours%10), cxt)
  renderDigit(MARGIN_LEFT + 30*(RADIUS+1), MARGIN_TOP, 10, cxt)
  renderDigit(MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP, parseInt(minutes/10), cxt)
  renderDigit(MARGIN_LEFT + 54*(RADIUS+1), MARGIN_TOP, parseInt(minutes%10), cxt)
  renderDigit(MARGIN_LEFT + 69*(RADIUS+1), MARGIN_TOP, 10, cxt)
  renderDigit(MARGIN_LEFT + 78*(RADIUS+1), MARGIN_TOP, parseInt(seconds/10), cxt)
  renderDigit(MARGIN_LEFT + 93*(RADIUS+1), MARGIN_TOP, parseInt(seconds%10), cxt)

  for( var i = 0 ; i < balls.length ; i ++ ){
    cxt.fillStyle=balls[i].color;

    cxt.beginPath();
    cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
    cxt.closePath();

    cxt.fill();
  }
}

function renderDigit(x, y, num, cxt) {
  cxt.fillStyle = 'rgb(0, 102, 153)'

  for (let i = 0; i < digit[num].length; i++) {
    for (let j = 0; j < digit[num][j].length; j++) {
      if( digit[num][i][j] === 1){
        // 绘制圆球
        /**
         * 第(i, j)个圆心的位置
         * X: x+j*2*(r+1)+(r+1)
         * Y: y+i*2*(r+1)+(r+1)
         */
        cxt.beginPath()
        cxt.arc(x+j*2*(RADIUS+1)+(RADIUS+1), y+i*2*(RADIUS+1)+(RADIUS+1), RADIUS, 0, 2*Math.PI)
        cxt.closePath()
        cxt.fill()
      }
    }
  }
}

function getCurShowTimeSeconds() {
  var curTime = new Date()
  var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds()
  return ret;
}

function update() {

  var nextShowTimeSeconds = getCurShowTimeSeconds()

  var nextHours = parseInt(nextShowTimeSeconds/3600),
      nextMinutes = parseInt((nextShowTimeSeconds - nextHours*3600) / 60),
      nextSeconds = nextShowTimeSeconds%60;

  var curHours = parseInt(curShowTimeSeconds/3600),
      curMinutes = parseInt((curShowTimeSeconds - curHours*3600) / 60),
      curSeconds = curShowTimeSeconds%60;

  if( nextSeconds != curSeconds ){
    if( parseInt(curHours/10) != parseInt(nextHours/10) ){
        addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
    }
    if( parseInt(curHours%10) != parseInt(nextHours%10) ){
        addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
    }

    if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
        addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
    }
    if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
        addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
    }

    if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
        addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
    }
    if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
        addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
    }

    curShowTimeSeconds = nextShowTimeSeconds;
  }

  updateBalls();
  console.log(balls.length)
}
function updateBalls(){
  for( var i = 0 ; i < balls.length ; i ++ ){
    balls[i].x += balls[i].vx;
    balls[i].y += balls[i].vy;
    balls[i].vy += balls[i].g;

    if( balls[i].y >= HEIGHT-RADIUS ){
      balls[i].y = HEIGHT-RADIUS;
      balls[i].vy = - balls[i].vy*0.75;
    }
  }
  // 删除多余下落小球
  var cnt = 0
  for( var i = 0 ; i < balls.length ; i ++ )
    if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WIDTH )
      balls[cnt++] = balls[i]

  while( balls.length > cnt ){
    balls.pop();
  }
}
  
function addBalls( x , y , num ){

  for( var i = 0  ; i < digit[num].length ; i ++ )
    for( var j = 0  ; j < digit[num][i].length ; j ++ )
      if( digit[num][i][j] == 1 ){
        var aBall = {
          x:x+j*2*(RADIUS+1)+(RADIUS+1),
          y:y+i*2*(RADIUS+1)+(RADIUS+1),
          g:1.5+Math.random(),
          vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
          vy:-5,
          color: colors[ Math.floor( Math.random()*colors.length ) ]
        }
        balls.push( aBall )
      }
}