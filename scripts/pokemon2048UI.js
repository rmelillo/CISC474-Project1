var imgUrls = new Array(1025);
for(i=2; i<1025; i=i*2){
    imgUrls[i]='pokemon/Edited/' + i + '.gif';
    console.log(imgUrls[i]);
}

var imgNum = 2;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }
  
var pokemon2048UI=function(){
    var self = this;
    this.game = undefined;
    this.running = false;
    this.version = 1;
    


    this.initialize = function(){

        self.game = new pokemon2048();
        self.version = 1;
        var themeSong = new sound("sounds/pokerap.mp3");
        var movesound = new sound("sounds/ding.mp3");
        var startsound = new sound("sounds/start.wav");

        var map_keyevent_to_dir = {
            37: -1, // Left
            38: -4, // Up
            39: 1,  // Right
            40: 4   // Down
        };

        // key listener
        $('body').keydown(function(event){
            if (self.running == true) {
                event.preventDefault();
                return;
            }
            self.running = true;
            
            var mapped_dir = map_keyevent_to_dir[event.which];
            if (mapped_dir !== undefined) {
                movesound.sound.play();
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

            startsound.sound.play();
            
            self.generateNewTile();
            self.generateNewTile();
            self.updateUI();
        });

        //change version btn listener
        $('#changeV').on('click', function(){
            if(self.version === 1){
                self.version = 2;
                // alert("version is: "+self.version);
            }
            else{
                self.version = 1;
                // alert("version is: "+self.version);
            }
            // self.game.restart();
            // $('#tileboard').html("");

            
            // self.generateNewTile();
            // self.generateNewTile();
            // self.updateUI();

            self.updateTileboard();

            
        });

        // Sound btn listener
        $('#sound').on('click', function(){
            themeSong.sound.play();
        });

        // Sound btn listener
        $('#soundS').on('click', function(){
            themeSong.sound.pause();
        });

        self.generateNewTile();
        self.generateNewTile();
        self.updateUI();

        //ryan stuff
        $('#upload2').on('change', this.something);
        $('#upload4').on('change', this.something);
        $('#upload8').on('change', this.something);
        $('#upload16').on('change', this.something);
        $('#upload64').on('change', this.something);
        $('#upload128').on('change', this.something);
        $('#upload256').on('change', this.something);
        $('#upload512').on('change', this.something);
        $('#upload1024').on('change', this.something);
        $('#upload2048').on('change', this.something);
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

    // Updates the tileboard based on the current version number
    this.updateTileboard = function(){
        $('#tileboard').html("");
        for(let tile of self.game.tiles){
            if (self.version === 1) {
                $('#tileboard').append("<img class='gif' id='gif" + tile.pos + "' src='pokemon/Number/" + tile.val + 
                    ".gif' style='width:112px; height:112px; top:"+self.calculateTopMargin(tile.pos)+"px; left:"
                    +self.calculateLeftMargin(tile.pos)+"px'></img>");
            }
            else {
                $('#tileboard').append("<img class='gif' id='gif" + tile.pos + "'src='"+ imgUrls[tile.val] + 
                "' style='width:112px; height:112px; top:"+self.calculateTopMargin(tile.pos)+"px; left:"
                +self.calculateLeftMargin(tile.pos)+"px'></img>");
            }
        }

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
        
        if (self.version === 1) {
            $('#tileboard').append("<img class='gif' id='gif" + pos + "' src='pokemon/Number/" + val + 
                ".gif' style='width:0px; height:0px; top:"+self.calculateTopMargin(pos)+"px; left:"
                +self.calculateLeftMargin(pos)+"px'></img>");
        }
        else {
            $('#tileboard').append("<img class='gif' id='gif" + pos + "'src='"+ imgUrls[val] + 
            "' style='width:0px; height:0px; top:"+self.calculateTopMargin(pos)+"px; left:"
                +self.calculateLeftMargin(pos)+"px'></img>");
        }
        $('#gif'+pos).animate({left:'+=56px', top:'+=56px'}, 0);
        $('#gif'+pos).animate({width:'112px', height:'112px', left:'+=-56px', top:'+=-56px'}, 180);
    }

    this.something = function(){

        var btn=document.getElementById('upload'+imgNum);
        if (btn.files && btn.files[0]){
            var img=document.getElementById('myImg'+imgNum);
            var url=URL.createObjectURL(btn.files[0]);
            var className='.c'+imgNum;
            img.src=url;
            $(className).attr('src',url);
            imgUrls[imgNum] = url;
            //console.log(imgUrls[imgNum]);
            btn.value='';
        }
        imgNum*=2;
    }

    // Simulates movements of tiles
    this.runMovements = function(){
        //movesound.sound.play();
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
                setTimeout(function(){$('#gif'+tile.pos).remove();}, 180);
                // $('#gif'+tile.pos).remove();
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

                if (self.version === 1) {
                    $('#tileboard').append("<img class='gif' id='gif" + i + "' src='pokemon/Number/" + tile.val + 
                        ".gif' style='width:112px; height:112px; top:"+self.calculateTopMargin(i)+"px; left:"
                        +self.calculateLeftMargin(i)+"px'></img>");
                }
                else {
                    $('#tileboard').append("<img class='gif' id='gif" + i + "'src='"+ imgUrls[tile.val] + 
                    "' style='width:112px; height:112px; top:"+self.calculateTopMargin(i)+"px; left:"
                        +self.calculateLeftMargin(i)+"px'></img>");
                }
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