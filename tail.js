
class Tail{

    constructor(player){
        this.points = []
        this.player = player

        this.emitting = null    //setInterval object

        this.emit_rate = 100 * 6/this.player.speed             //emit rate raises due to player speed lowering
    }

    show(platform){
        push()

        let trVec = createVector(width/2, height/2).sub(platform.viewPoint)
        let lastPoint = null

        stroke(this.player.base.color)
        strokeWeight(this.player.width)

        noFill()
        beginShape()
        this.points.forEach(point => {
            curveVertex(point.pos.x + trVec.x, point.pos.y + trVec.y)
            // point.mark()
            // point.show(platform)    //for debugging 

            lastPoint = point
        });
        if(lastPoint) curveVertex(lastPoint.pos.x + trVec.x + this.player.nextPos.x, lastPoint.pos.y + trVec.y + this.player.nextPos.y)
        endShape(noFill)

        pop()
    }

    set(tail_points){                          //required to set tail by data from the server 
        AllPoints.deletePoints(this.points)
        this.points = []
        tail_points.forEach(point => {
            this.points.push(new tailPoint(point.pos, this))
        });
    }

    startEmiting(startPoint){
        // console.log("START EMITTING")
        let point = new tailPoint(startPoint.pos, this)   //mark startPoint as tailPoint and insert to tail
        this.points.push(point)
        this.points.push(point)

        this.emitting = setInterval(this.addPoint, this.emit_rate, this)  //passing object -- cause setInterval calls only static functions
    }

    stopEmiting(){
        // console.log("STOP EMITTING")
        clearInterval(this.emitting);
    }



    addPoint(obj){
        obj.points.push(new tailPoint(createVector(obj.player.pos.x, obj.player.pos.y), this))
    }


    clearTail(){
        AllPoints.deletePoints(this.points)
        this.points = []
    }

}