

class AllPoints{

    static list = []

    static addPoint(point){
        AllPoints.list.push(point)

        // console.log(AllPoints.list)
    }

    static removePoint(point){   //not tested
        let index = AllPoints.list.indexOf(point);
        if (index !== -1) {
            AllPoints.list.splice(index, 1);
        }
    }


    static developTool(){
        AllPoints.list.forEach(point => {
            if(point instanceof basePoint){
                fill(255)
                ellipse(point.pos.x, point.pos.y, 10, 10)
            }else{
                fill(0)
                ellipse(point.pos.x, point.pos.y, 10, 10)
            }
        });
    }

    static deletePoints(points){
        points.forEach(point => {
            this.removePoint(point)
        });
    }

}