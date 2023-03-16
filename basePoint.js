
class basePoint extends Point{

    constructor(pos, base){     //every base point should have id which is counter value, for conture recognizing

        super(pos)

        this.base = base
        this.pos = pos
    }

}