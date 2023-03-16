var player_speed = 10

class Player{

    constructor(pos, rot, width, height, name){
        this.pos = pos
        this.rot = rot
        this.width = width
        this.height = height
        this.name = name

        this.id = null
        
        this.color = color(0, 100, 100)
        this.strokeWeight = 5
        this.speed = player_speed
        this.targetAng = 0

        this.nextPos = p5.Vector.fromAngle(radians(this.rot)).normalize().mult(this.speed)  //aproximatelly next position - for curveVertex

        this.base = null
        this.tail = null
        this.insideBase = true

        this.leavePoint = null
        this.enterPoint = null

        this.targetPos = null
    }


    setBase(base){
        this.base = base
    }


    setTail(tail){
        this.tail = tail
    }

    setTargetPos(targetPos){
        this.targetPos = targetPos
    }
    

    aimToTarget(){
        if(this.targetPos){
            // this.pos = lerp(this.pos, this.targetPos, 1);
            this.pos = this.targetPos
        }
    }

    set(rot, width, height, name){
        this.rot = rot
        this.width = width
        this.height = height
        this.name = name
    }

    setId(id){
        this.id = id
    }

    setColor(color){
        this.color = color
    }

    show(platform){  //called every frame

        if(this.tail) this.tail.show(platform)   //show tail
        
        push()
        strokeWeight(this.strokeWeight)
        fill(this.color)

        // this.rot = lerp(this.rot, this.targetAng, 0.05);

        translate(createVector(this.pos.x, this.pos.y).add(width/2, height/2).sub(platform.viewPoint))
        rotate(this.rot)
        rectMode(CENTER)
        rect(0, 0, this.width, this.height)
        pop()

    }


    update(){

        // --- logic based on player position

        if(this.base.point_inside(this.pos) != this.insideBase){
            this.insideBase = this.base.point_inside(this.pos)    //detects if a center of a player is inside a ground base 

            //at the moment i left my base, give me all points i intersect rn 
            let intersectPoints = []
            this.base.basePoints.forEach(point => {
                if(this.inside(point.pos)){
                    intersectPoints.push(point)
                }
            });
            


            if(this.insideBase){
                // this.setColor(color(255, 0, 0))     //debugging purposes
                this.enteredBase(intersectPoints)
            }
            else{
                // this.setColor(color(0, 100, 100))
                this.leftBase(intersectPoints)
            }

        }


        // --- check on intersecting with any point (object)
        let intersects = false 
        let intersectPoints = []
        AllPoints.list.forEach(point => {
            if(this.inside(point.pos)){
                // console.log("INTERSECTED")
                intersectPoints.push(point)
                intersects = true
            }
        });
        if(intersects) this.intersected(intersectPoints)
     

        // --- code for controlling position of the player 

        //finding velocity vector
        let mouseVec = createVector(mouseX, mouseY)
        let dirVec = mouseVec.sub(createVector(width/2, height/2)).normalize()
        let velVec = dirVec.mult(this.speed * deltaTime / 30)

        //finding target angle
        let targetAng = velVec.heading() + Math.PI/2

        this.rot += (targetAng - this.rot)/1

        this.pos.add(velVec)

    }


    intersected(points){    //called if player intersects with some 

        // console.log(points)

        //a bit stupid way to determine if i drive over my path 
        let numTailPoints = 0
        points.forEach(point => {
            if(point instanceof tailPoint) numTailPoints++
        });
        if(numTailPoints > 5){
            console.log("DEAD")
            // this.die()
        }
    }

    die(){
        noLoop();
        gameOver.show()
    }

    leftBase(intersectPoints){   //function called once at the moment the player leaves base zone with all base points intersecting at a time
        // console.log("EXITED")
        // console.log(intersectPoints)
        this.leavePoint = intersectPoints[parseInt(intersectPoints.length/2)]

        this.tail.startEmiting(this.leavePoint)
        // this.leavePoint.mark()

    }

    enteredBase(intersectPoints){    //function called once the moment the player enters base zone 
        // console.log("ENTERED")
        // console.log(intersectPoints)

        this.tail.stopEmiting()

        this.enterPoint = intersectPoints[parseInt(intersectPoints.length/2)]
        // this.enterPoint.mark()

        this.base.addBase(this.leavePoint, this.enterPoint, this.tail)    

        this.tail.clearTail()   //entered home zone, tail dissapears
    }

    inside(point) {

        function getRectFourPoints(x, y,width ,height, ang, isDeg = false) {   //need rect points

            if(isDeg) ang = ang * (Math.PI / 180)

            ang -= Math.PI/2

            let beta = Math.PI - atan(width/height)  //angle
            let r = sqrt(pow(height/2, 2) + pow(width/2, 2))

            // let point = new Point(null, createVector(x + cos(beta - ang)*r , y - sin(beta - ang)*r))
            // point.show(platform)

            x = x + cos(beta - ang)*r
            y = y - sin(beta - ang)*r

            ang += Math.PI/2


            const points = []

            // const points = {first: {x,y}}
            points.push([x,y])
            const sinAng = Math.sin(ang)	
            const cosAng = Math.cos(ang)
            
            let upDiff = sinAng * width
            let sideDiff = cosAng * width
            const sec = {x: x + sideDiff, y: y + upDiff}
            // points.sec = sec
            points.push([x + sideDiff, y + upDiff])
            
            upDiff = cosAng * height
            sideDiff = sinAng * height
            let third = [x + sideDiff, y - upDiff]
            // points.push([x + sideDiff, y - upDiff])
            
            // points.push([sec.x + sideDiff, sec.y - upDiff])
            let fourth = [sec.x + sideDiff, sec.y - upDiff]

            points.push(fourth)
            points.push(third)

            return points
        }

        let vs = getRectFourPoints(this.pos.x, this.pos.y, this.width, this.height, this.rot, false)
        // console.log(vs)
        
        // let lg = new Point(createVector(vs[0][0], vs[0][1]))
        // let dg = new Point(createVector(vs[1][0], vs[1][1]))
        // let ld = new Point(createVector(vs[2][0], vs[2][1]))
        // let dd = new Point(createVector(vs[3][0], vs[3][1]))

        // lg.show(platform)
        // dg.show(platform)
        // ld.show(platform)
        // dd.show(platform)
       
        var x = point.x, y = point.y;
        
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };

}