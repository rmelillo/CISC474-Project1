<<<<<<< HEAD
var pokemon2048UI=function(){
    var self = this;
    this.game = undefined;
    this.running = false;

    this.initialize = function(){

        self.game = new pokemon2048();

        var map_keyevent_to_dir = {
            37: -1, // Left
            38: -4, // Up
            39: 1,  // Right
            40: 4   // Down
        };

        // key listener
        $('body').keydown(function(event){
            if (self.running == true) {
                return;
            }
            self.running = true;
            
            var mapped_dir = map_keyevent_to_dir[event.which];
            if (mapped_dir !== undefined) {
                event.preventDefault();
                self.game.dir = mapped_dir;
                self.animate();
            }
            // Key 'R'
            else if (event.which == 82) {
                var answer = confirm("This will start a new game.");
                if (answer == true) {
                    self.game.restart();
                    $('#tileboard').html("");
                    self.generateNewTile();
                    self.generateNewTile();
                } 
            }
            // Key 'Esc'
            else if (event.which == 81) {
                var answer = confirm("This will close your browser tab.");
                if (answer == true) {
                    window.close();	
                }
            }
            setTimeout(function(){self.updateUI();}, 200);
            self.game.hasMoved = false;
            setTimeout(() => {
                self.game.checkGameState();
            },0);

            setTimeout(() => {self.running=false;}, 250)
        });

        // Restart btn listener
        $('#Restart').on('click', function(){
            self.game.restart();
            $('#tileboard').html("");
            
            self.generateNewTile();
            self.generateNewTile();
            self.updateUI();
        });

        // ChangeV btn listener
        $('#changeV').on('click', function(){
        });

        // Sound btn listener
        $('#sound').on('click', function(){
        });

        self.generateNewTile();
        self.generateNewTile();
        self.updateUI();

    };


    // Updates UI infos
    this.updateUI = function(){

        // $(".cell").each(function(){
        //     var cell_id = parseInt($(this).attr("id"));         
        //     var cur_tile = self.game.getTile(cell_id);
        //     if (cur_tile !== undefined && cur_tile != null){
        //         $(this).text(cur_tile.val);

        //         // TODO:: need to Replace with CSS functions.
        //     }
        //     else {
        //         $(this).text("");
        //     }

        // });

        $('#scoreCount').text(self.game.score);
        $('#bestCount').text(Math.max(self.game.score, $('#bestCount').text()));
    }

    // calculate & complete a move
    this.animate = function(){

        if(self.game.dir === 0)
            return;
        for(let tile of self.game.tiles){
            tile.from = tile.pos;
        }
        do {

            let moving = false;
            self.game.tiles.sort((x,y) => self.game.dir*(y.pos - x.pos));
            for(let tile of self.game.tiles)
                moving = moving || tile.move(self.game.dir);
                self.game.hasMoved = self.game.hasMoved || moving;
            if(self.game.hasPossibleMoves && !moving){

                setTimeout(function(){                
                    self.runMovements();
                    self.mergeTiles();
                    for(let tile of self.game.tiles){
                        tile.merging = false;
                    }
                    self.game.dir = 0;
            
                    
                    self.generateNewTile();
                    }, 200);

            } 
            self.game.hasPossibleMoves = moving;
        } while (self.game.hasPossibleMoves === true);

    }

    // Generates a new random tile
    this.generateNewTile = function(){
        let positions = self.game.getOpenPositions();
        let pos       = positions[Math.floor(Math.random()*positions.length)];
        let val       = 2 + 2*Math.floor(Math.random()*1.11);
        self.game.generateTile(pos, val);
        
        $('#tileboard').append("<img class='gif' id='gif" + pos + "' src='pokemon/Edited/" + val + 
            ".gif' style='width:0px; height:0px; top:"+self.calculateTopMargin(pos)+"px; left:"
            +self.calculateLeftMargin(pos)+"px'></img>");
        $('#gif'+pos).animate({left:'+=56px', top:'+=56px'}, 0);
        $('#gif'+pos).animate({width:'112px', height:'112px', left:'+=-56px', top:'+=-56px'}, 180);
    }


    // Simulates movements of tiles
    this.runMovements = function(){
        
        for (let tile of self.game.tiles){
            diff = tile.pos - tile.from;
            if (diff == 0) {
                continue;
            }
            
            if (diff<=3 && diff>=-3){
                $('#gif'+tile.from).animate({left:'+='+122*diff+'px'}, 90);
            }
            else { // moving vertically
                $('#gif'+tile.from).animate({top:'+='+122*diff/4+'px'}, 90);
            }
            
            $('#gif'+tile.from).prop('id', 'gif'+tile.pos);
            
        }
    }

    // animates tiles merging
    this.mergeTiles = function(){
        for(let tile of self.game.tiles){
            if(tile.merging == true) {
                $('#gif'+tile.pos).remove();
            }
        }
        for (let i = 0; i < 16; i++){
            pair = self.game.tiles.filter(x => x.pos === i);

            if (pair.length>=2){
                self.game.removeTile(pair[1]);
                tile = pair[0];
                self.game.score += tile.val;
                tile.val *= 2;
                tile.merging = false;
                
                $('#tileboard').append("<img class='gif' id='gif" + i + "' src='pokemon/Edited/" + tile.val + 
                ".gif' style='width:112px; height:112px; top:"+self.calculateTopMargin(i)+"px; left:"
                +self.calculateLeftMargin(i)+"px'></img>");
                $('#gif' + tile.pos).animate({height:'128px', width:'128px', left:'+=-8px', top:'+=-8px'}, 90);
                $('#gif' + tile.pos).animate({height:'112px', width:'112px', left:'+=8px', top:'+=8px'}, 90);
            }
            
        }
        
	}

    // takes position of tile and returns relative pixel position to the tileboard
    this.calculateTopMargin = function(pos){
        row = Math.floor(pos / 4);
        return row*122 + 10;
    }

    // takes position of tile and returns relative pixel position to the tileboard
    this.calculateLeftMargin = function(pos){
        col = Math.round(pos % 4);
        return col*122 + 11;
    }

    this.initialize();
}
||||||| merged common ancestors
=======
var pokemon2048UI=function(){
    var self = this;
    this.game = undefined;
    this.running = false;
    
    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }
      }
    this.initialize = function(){

        self.game = new pokemon2048();
        
        var map_keyevent_to_dir = {
            37: -1, // Left
            38: -4, // Up
            39: 1,  // Right
            40: 4   // Down
        };

        // key listener
        $('body').keydown(function(event){
            // console.info("keydown det:", event.which);
            var mapped_dir = map_keyevent_to_dir[event.which];
            if (mapped_dir !== undefined) {
                event.preventDefault();
                self.game.dir = mapped_dir;
                do {
                self.game.animate();
                } while (self.game.hasMoved === true); 
            }
            else if (event.which == 82) {
                var answer = confirm("This will start a new game.");
                if (answer == true) {
                    self.game.restart();
                } 
            }
            else if (event.which == 81) {
                var answer = confirm("This will close your browser tab.");
                if (answer == true) {
                    window.close();	
                }
            }
            self.updateUI();
            setTimeout(() => {
                self.game.checkGameState();
            },0);
            
        });

        // Restart btn listener
        $('#Restart').on('click', function(){
            console.info("Restart btn clicked");
            var startSound;
            startSound = new sound("sounds/start.wav")
            startSound.play();
            self.game.restart();
            self.updateUI();
        });

        // ChangeV btn listener
        $('#changeV').on('click', function(){
            console.info("changeV btn clicked");
        });

        // Sound btn listener
        $('#sound').on('click', function(){
            console.info("sound btn clicked");
            var themeSong;
            themeSong = new sound("sounds/pokerap.mp3")
            themeSong.play();
        });

        self.updateUI();

    };

    // TODO:: put in animation codes?
    this.refreshView = function(){
        
    };


    // call this to update display after each move
    this.updateUI = function(){
        // if (self.running==false) {
        //     return;
        // }

        // TODO:: Need to add animations.

        $(".cell").each(function(){
            var cell_id = parseInt($(this).attr("id"));         
            var cur_tile = self.game.getTile(cell_id);
            if (cur_tile !== undefined && cur_tile != null){
                // console.info("Found a cell! ", cell_id);
                // $(this).text(cur_tile.val);

                $(this).html("<img src='pokemon/Edited/" + cur_tile.val + ".gif'></img>");

                

                // TODO:: need to Replace with CSS functions.
            }
            else {
                $(this).text("");
            }
             
        });

        $('#scoreCount').text(self.game.score);
        $('#bestCount').text(Math.max(self.game.score, $('#bestCount').text()));
    }

    this.initialize();
}
>>>>>>> 95cc8583d70c0e3ca8aa30845f4d9b8a8eb406fd
