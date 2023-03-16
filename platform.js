var [r, c] = [100, 100]; 
var matrix = Array(r).fill().map(()=>Array(c).fill(0));

class Platform{

    constructor(size){
        this.size = size

        this.color = color(191, 189, 136)
        this.viewPoint = createVector(0, 0)
    }

    setViewPoint(pos){
        this.viewPoint = pos
    }


    show(){
        push()
        noStroke()
        fill(this.color)
        translate(createVector(width/2, height/2).sub(this.viewPoint))
        ellipse(0, 0, this.size, this.size)

        fill(0)
        ellipse(0, 0, 10, 10)


        let rectSize = 10
        let w = matrix.length 
        let h = matrix[0].length 

        for(let row in matrix){
            for(let col in matrix[row]){
               
                stroke(0)
                matrix[row][col]==1 ? fill(100):fill(200)
                // rect((col - h/2)*rectSize, (row - w/2)*rectSize, rectSize, rectSize)
               
            }
        }

        pop()
    }

}