

class Point{

    constructor(pos){     //every point constructed should be saved in global point list -- later quad tree
        this.pos = pos

        //graphical representation of point
        this.marked = false
        this.color = color(0)

        AllPoints.addPoint(this)
    }

    show(platform){
        push()
        let trVec = createVector(width/2, height/2).sub(platform.viewPoint)


        if(this.marked) fill(255, 0, 0)
        else fill(this.color)
        ellipse(this.pos.x + trVec.x, this.pos.y + trVec.y, 5, 5)
        pop()
    }

    mark(){
        this.marked = true
    }

    setColor(color){
        this.color = color
    }

}