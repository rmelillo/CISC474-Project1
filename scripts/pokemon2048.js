// game object
var pokemon2048 = function(){

    /*the following alert window is just to instruct the user on the N and Q functionality, but it should probably be in the 
	html file.  Since I'm not doing that I figured I'd leave it to whoever is, and we can just delete it from here then.*/
	// TODO:: implement showing instructions
	//alert("Welcome to a game closely resembling 2048! At any time press N for a new game or Q to quit.");

	this.tiles    = [];
	this.dir      = 0;
	this.score    = 0;
	this.hasMoved = false;
	this.hasPossibleMoves = false;
	this.validPositions = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    this.getOpenPositions = () => this.validPositions.filter(i => this.tiles.map(x => x.pos).indexOf(i) === -1);
	this.getTile          = pos => this.tiles.filter(x => x.pos === pos)[0];
	this.removeTile       = tile => this.tiles.splice(this.tiles.indexOf(tile), 1);
	this.winCondition     = () => this.tiles.some(x => x.val === 2048);
	
    //check for moves remaining
	this.validMoves = function(){
		if(this.tiles.length < 16)
			return true;
		let res = false;
		this.tiles.sort((x,y) => x.pos - y.pos);
		for(let i = 0; i < 16; i++)
			res = res || ( (i%4 < 3) ? this.tiles[i].val === this.tiles[i+1].val : false )
					|| ( (i  < 12) ? this.tiles[i].val === this.tiles[i+4].val : false );
		return res;
    }
    
    //check if the game is won or lost
	this.checkGameState = function(){
		if(this.winCondition()){
			alert('You win!');
		} else if (!this.validMoves()){
			alert('You Lose!');
			this.restart();
		}
    }
	
	
	// reset variables to restart the game
    this.restart = function(){
		this.tiles    = [];
		this.dir      = 0;
		this.score    = 0;
		this.hasMoved = false;
    }
	
	// generates a new tile at random open position, value is 2 or 4
    this.generateTile = function(pos, val){
		if(pos==-1){
			let positions = this.getOpenPositions();
			pos       = positions[Math.floor(Math.random()*positions.length)];
			val       = 2 + 2*Math.floor(Math.random()*1.11);
		}
		this.tiles.push(new Tile(pos, val, this));
	}

	
}

var Tile = function(pos, val, puzzle){
    this.pos = pos;
    this.val = val;
    this.puzzle  = puzzle;
	this.merging = false;
	this.from = null;
	
    this.getCol = () => Math.round(this.pos % 4);
    this.getRow = () => Math.floor(this.pos / 4);

	// function for 1-unit length move
    this.move = function(dir){
        let col = this.getCol() + (1 - 2*(dir < 0))*Math.abs(dir)%4;
        let row = this.getRow() + (1 - 2*(dir < 0))*Math.floor(Math.abs(dir)/4);
        let target = this.puzzle.getTile(this.pos + dir);
        //move check and merge functionality
        if (col < 0 || col > 3 || row < 0 || row > 3) {
            return false;
        } else if (target){
            if(this.merging || target.merging || target.val !== this.val)
                return false;

			target.merging = true;
			this.pos = target.pos;
			this.merging = true;
            return true;
        }

		this.pos += dir;
        return true;
    }

}