var w = window.innerWidth;
var h = window.innerHeight;  

//--- player variables
var player_width = 50
var player_height = 50

//--- platform variables 
var platform_size = 1000

// --- these 2 arrays are paired --- 
let colours = [[48, 145, 33], [98, 121, 181], [194, 120, 123], [199, 129, 192], [134, 191, 189 ], [190, 191, 187]]        
let coloursB = [[39, 92, 30], [69, 83, 122], [145, 92, 94], [130, 90, 126], [84, 128, 126], [109, 110, 107]]

let playersMap = new Map()
let firstGameStart = false     //if game just started, needed to call initialize funciton


function setup() {
  canvas=createCanvas(w, h);
  welcome_screen = new welcomeScreen()
}


function sucess(data){  //server responds with socket id 
  me.id = data
  setInterval(sendData, 30);    //handskake finished
  socket.on('heartBeat', heartBeat);
}


//send my data every 33ms
function sendData(){
  let meObj = packToObject(me)
  socket.emit('data', meObj);

  // console.log(meObj)
}



function heartBeat(data){   //getting data of all players
  var dataMap = new Map(JSON.parse(data));    //deserialise map

  for (var [key, value] of dataMap) {

    if(key != me.id){   //all players excluding me

      //---unbox the data from the server

      var player_pos = value.pos
      var player_rot = value.rot
      var player_width = value.width
      var player_height = value.height
      var player_name = value.name
      var base_points = value.base.basePoints
      var tail_points = value.tail.points
      var player_color = value.color
      var base_color = value.base.color

      
      if(!playersMap.has(key)){   //found new player
      
        player = new Player(    //create new player
           player_pos, player_rot, player_width, player_height, player_name
          )

        ground_base = new groundBase(player)   //create new groundbase for given player

        tail = new Tail(player)                //create new tail for given player

        player.setBase(ground_base)
        player.setTail(tail)

        player.setColor(color(player_color.levels[0], player_color.levels[1], player_color.levels[2]))   //works
        ground_base.setColorRGB(base_color.levels[0], base_color.levels[1], base_color.levels[2])
        
      } 
      else{                             //updating existing data 
        player = playersMap.get(key).player    //get existing player and update its data 
        player.set(
           player_rot, player_width, player_height, player_name
        )

        player.pos = player.targetPos   //at the moment new position comes, i need to be at the location i meant to be based on previous position

        player.setTargetPos(player_pos)    //set this pos as target for interpolating

        ground_base = playersMap.get(key).ground_base  
        ground_base.set(base_points)

        tail = playersMap.get(key).tail  
        tail.set(tail_points)

      }

      var playerData = {     //encapsulate all player data in playerData object (including player, tail and base)
        player: player,
        ground_base: ground_base,
        tail: tail
      }

      playersMap.set(key, playerData)
      
    }

  }


}




function draw() {
  welcome_screen.show()


  if(welcome_screen.gameStarted){
    if(!firstGameStart){
      
      initializeGame()

      firstGameStart = true
    }
    drawGame()
  }
  

}



function initializeGame(){
  //socket stuff
  socket= io.connect('http://192.168.0.109:5001');   //server port

  platform = new Platform(platform_size)
  let start_position = p5.Vector.random2D().normalize().setMag(random(0, platform.size/2 - 100))   //100 is radius of base

  me = new Player(start_position, 0, player_width, player_height, "Aleksandar")   //created main player 
  base = new groundBase(me) 
  tail = new Tail(me)

  let randColors = getRandomPairColors()
  me.setColor(randColors.player_color)
  base.setColorRGB(randColors.base_color.levels[0], randColors.base_color.levels[1], randColors.base_color.levels[2])

  me.setBase(base)
  me.setTail(tail)

  let meObj = packToObject(me)

  socket.emit('init', meObj)  //initialize connection
  socket.on('sucess', sucess); 

 

}



function drawGame(){
  background(242, 238, 211);
  
  // console.log(me)

  platform.setViewPoint(me.pos)
  platform.show()

  base.show(platform)

  // --- show all the players --- 
  for (var [key, value] of playersMap) {    //iterate over all players
    if(key != me.id){  //if not me 

      ground_base = playersMap.get(key).ground_base
      ground_base.show(platform)

      player = playersMap.get(key).player
      player.aimToTarget()
      player.show(platform)    //show other player
    }
    
  }


  me.show(platform)
  me.update()

  // AllPoints.developTool()

}



function packToObject(player){

  let tail_points = []
  player.tail.points.forEach(point => {
    tail_points.push({pos: point.pos})
  });

  let base_points = []
  player.base.basePoints.forEach(point => {
    base_points.push({pos: point.pos})
  });


  let playerObj = {        // me as a player packed to send to server
    pos: player.pos,
    rot: player.rot,
    nextPos: player.nextPos,
    color: player.color,
    width: player.width,
    height: player.height,
    name: player.name,

    tail: {
      points: tail_points
    },

    base: {
      basePoints: base_points,
      color: player.base.color
    }

  }


  return playerObj

}


function getRandomPairColors(){
  let rand = Math.floor(Math.random()*colours.length)
  let col = colours[rand]
  let colorB = coloursB[rand]

  let player_color = color(col[0], col[1], col[2])
  let base_color = color(colorB[0], colorB[1], colorB[2])
  
  return {player_color: player_color, base_color: base_color}
}



window.onresize = function() {
  // assigns new values for width and height variables
  w = window.innerWidth;
  h = window.innerHeight;  
  resizeCanvas(w,h);
}


function mousePressed(){                       //sends event to welcomeScreen
  welcome_screen.pressed(mouseX, mouseY)
}



















// --- code for player colider testing ---

// let trVec = createVector(width/2, height/2).sub(platform.viewPoint)
  // for(let i = 0; i<100; i++){
  //   for(let j = 0; j<100; j++){

  //     let p = new createVector(i, j )
  //     if(me.inside(p)){
  //       fill(255, 0, 0)
  //     }else{
  //       fill(0, 0, 0)
  //     }
      
  //     noStroke()
     
  //     ellipse(p.x + trVec.x, p.y + trVec.y, 4, 4)
  //   }
    
  // }