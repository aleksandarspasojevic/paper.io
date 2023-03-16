

class welcomeScreen{

    constructor(){
        this.button = new Button(createVector(width/2 - width*.12, height/2), 200, 100, "PLAY")
        this.gameStarted = false
    }

    show(){

        push()
        background(222, 217, 182)
        fill(255)

        textSize(40)
        text("paper.io", width/2 - width*.1, height/2 - 200)


        this.button.show()

        pop()

    }

    pressed(x, y){
        if(this.button.inside(x, y)){
            this.gameStarted = true
        }
    }

}


class Button{
    constructor(pos, width, height, text){
        this.pos = pos
        this.width = width
        this.height = height
        this.text = text
    }


    show(){
        push()
        strokeWeight(6)
        stroke(255)

        if(this.hover()){
            fill(189, 181, 125)
        }else{
            fill(176, 169, 118)
        }

        
        rect(this.pos.x, this.pos.y, this.width, this.height)

        strokeWeight(3)
        fill(79, 75, 47)
        stroke(79, 75, 47)
        textSize(40)
        text(this.text, this.pos.x + this.width/2 - 45, this.pos.y + this.height/2 + 10)

        pop()
    }

    hover(){
        return (mouseX > this.pos.x && mouseX < this.pos.x+this.width && mouseY > this.pos.y && mouseY < this.pos.y + this.height)
    }

    inside(x, y){
        return (x > this.pos.x && x < this.pos.x+this.width && y > this.pos.y && y < this.pos.y + this.height)
    }

}

