

class groundBase{

    constructor(player){
        this.player = player
        this.pos = player.pos
        this.radius = 100
        this.color = player.color

        this.strokeWeight = 5

        this.basePoints = []   //add initialy points to form circle
        for(let ang = 0; ang < 2 * Math.PI; ang += Math.PI/20){
            this.basePoints.push(new basePoint(createVector(cos(ang)*this.radius + this.pos.x, sin(-ang)*this.radius + this.pos.y), this))
        }

    }


    setColorRGB(r, g, b){
        this.color = color(r, g, b)
    }

    setColor(color){
        this.color = color
    }


    addBase(leavePoint, enterPoint, tail){
        // leavePoint.mark()
        // enterPoint.mark()

        let firstPathPoints = []             //leave to enter path 
        let secondPathPoints = []            //enter to leave path 
        let enterPoint_index = 0
        
        for(enterPoint_index = 0; enterPoint_index < this.basePoints.length; enterPoint_index++){       //find enter point index in basePoints
            if(this.basePoints[enterPoint_index] == enterPoint) break;
        }


        let i = enterPoint_index
        while(1){

            firstPathPoints.push(this.basePoints[i])

            if(this.basePoints[i] == leavePoint) break

            i = (i + 1)%this.basePoints.length
        }

        i = enterPoint_index
        while(1){
            i--
            if(i<0) i = this.basePoints.length-1

            if(this.basePoints[i] == leavePoint) break

            secondPathPoints.push(this.basePoints[i])

        }


        // firstPathPoints.forEach(point => {
        //     point.setColor(color(0, 255, 0))
        // });

        // secondPathPoints.forEach(point => {
        //     point.setColor(color(255))
        // });

        let firstPathRepresentativePoint = firstPathPoints[parseInt(firstPathPoints.length/2)]    //points for path eminimation
        firstPathRepresentativePoint.mark()

        //making union of tail points with firstPathPoints and determing if a secondPathRepresentativePoint is inside, if it is, union is done 
        //tail always goes from leavePoint to enterPoint


        let newBasePoints = []              //points to be added to my base
        tail.points.forEach(tailPoint => {
            newBasePoints.push(new basePoint(tailPoint.pos, this))
        });

        let newBase = concat(newBasePoints, secondPathPoints)
        if(this.point_inside_polygon(newBase, firstPathRepresentativePoint.pos) == false){
            newBase = concat(newBasePoints, firstPathPoints)
            AllPoints.deletePoints(secondPathPoints)
        }else{
            AllPoints.deletePoints(firstPathPoints)
        }
        

        this.basePoints = newBase
        

    }


    set(base){                                    //required to set tail by data from the server 
        this.basePoints = base
    }

    show(platform){
        if(this.basePoints.length < 1) return

        let trVec = createVector(width/2, height/2).sub(platform.viewPoint)

        let firstPoint = this.basePoints[0];
        let lastPoint = this.basePoints[this.basePoints.length - 1]


        fill(this.color)
        strokeWeight(this.strokeWeight)

        beginShape()
        if(lastPoint) curveVertex(lastPoint.pos.x + trVec.x, lastPoint.pos.y + trVec.y)
        this.basePoints.forEach(point => {
            curveVertex(point.pos.x + trVec.x, point.pos.y + trVec.y)
            // point.show(platform)     //for debugging 
        });

        if(firstPoint) curveVertex(firstPoint.pos.x + trVec.x, firstPoint.pos.y + trVec.y)
        if(firstPoint) curveVertex(firstPoint.pos.x + trVec.x, firstPoint.pos.y + trVec.y)
        endShape(noFill)
    }


    point_inside(point){
        return this.point_inside_polygon(this.basePoints, point)
    }

    point_inside_polygon(vertices, point){  //point in coordinates
        var x = point.x, y = point.y;
              
        var inside = false;
        for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
            var xi = vertices[i].pos.x, yi = vertices[i].pos.y;
            var xj = vertices[j].pos.x, yj = vertices[j].pos.y;
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
      }


}