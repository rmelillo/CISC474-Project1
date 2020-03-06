
//Team Rocket's 2048 project for CISC474

//check for non-arrow inputs; just "N" for new game and "Q" for quit now, but more can be added 	
function checkKey(e) {
	e = e || window.event;
	if (e.keyCode == '78') {
		var answer = confirm("This will start a new game.");
		if (answer == true) {
			location.reload();	
		} 
	}else if (e.keyCode == '81') {
		var answer = confirm("This will close your browser tab.");
		if (answer == true) {
			window.close();	
		}
	}
}	
function Tile(pos, val, puzzle){
	this.pos     = pos;
	this.val     = val;
	this.puzzle  = puzzle;
	this.merging = false;

	this.getCol = () => Math.round(this.pos % 4);
	this.getRow = () => Math.floor(this.pos / 4);

	//Drawing and coloring the tile, just a placeholder for now until graphics are implemented

	this.show = function(){
		let padding = this.merging ? 0 : 5;
		let size = 0.25*width;
		noStroke();
		colorMode(HSB, 255);
		fill(5*(11 - Math.log2(this.val)), 25 + 15*Math.log2(this.val), 255);
		rect(this.getCol()*size + padding, this.getRow()*size + padding, size - 2*padding, size - 2*padding);
		fill(25);
		textSize(0.1*width);
		textAlign(CENTER, CENTER);
		text(this.val, (this.getCol() + 0.5)*size, (this.getRow() + 0.5)*size);
	}

	//moving the tile

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

			target.val += this.val;
			target.merging = true;
			this.puzzle.score += target.val;
			this.puzzle.removeTile(this);
			return true;
		}

		this.pos += dir;
		return true;
	}
}

function runGame(){
	/*the following alert window is just to instruct the user on the N and Q functionality, but it should probably be in the 
	html file.  Since I'm not doing that I figured I'd leave it to whoever is, and we can just delete it from here then.*/
	alert("Welcome to a game closely resembling 2048! At any time press N for a new game or Q to quit.");
	this.tiles    = [];
	this.dir      = 0;
	this.score    = 0;
	this.hasMoved = false;
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
	
	this.restart = function(){
		this.tiles    = [];
		this.dir      = 0;
		this.score    = 0;
		this.hasMoved = false;
		this.generateTile();
		this.generateTile();
	}

	//draw the board
	this.show = function(){
		background(50);
		fill(255);
		textSize(0.05*width);
		textAlign(CENTER, TOP);
		text("SCORE: " + this.score, 0.5*width, width);

		for(let tile of this.tiles)
			tile.show();
	}

	this.animate = function(){
		if(this.dir === 0)
			return;

		let moving = false;
		this.tiles.sort((x,y) => this.dir*(y.pos - x.pos));
		for(let tile of this.tiles)
			moving = moving || tile.move(this.dir);

		if(this.hasMoved && !moving){
			this.dir = 0;
			this.generateTile();

			for(let tile of this.tiles)
				tile.merging = false;
		} 
		this.hasMoved = moving;
	}

	this.generateTile = function(){
		let positions = this.getOpenPositions();
		let pos       = positions[Math.floor(Math.random()*positions.length)];
		let val       = 2 + 2*Math.floor(Math.random()*1.11);
		this.tiles.push(new Tile(pos, val, this));
	}
	this.generateTile();
	this.generateTile();
	
	//Move the tile based on keyboard input
	this.keyHandler = function(key){
		if      (key === UP_ARROW)   this.dir = -4
		else if (key === DOWN_ARROW)  this.dir = 4
		else if (key === RIGHT_ARROW) this.dir = 1
		else if (key === LEFT_ARROW)  this.dir = -1;
	}
	document.onkeydown = checkKey;
	
}


let game;
	
function setup() {
	createCanvas(400, 420);	
	game = new runGame();
}

function draw() {
	game.checkGameState();
	game.animate();
	game.show();
}
function keyPressed(){
	game.keyHandler(keyCode);
}
