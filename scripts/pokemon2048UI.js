var pokemon2048UI=function(){
    var self = this;
    this.game = undefined;
    this.running = false;

    this.initialize = function(){
        // TODO:: implement initialization function

        self.game = new pokemon2048();

        var map_keyevent_to_dir = {
            37: -1, // Left
            38: -4, // Up
            39: 1,  // Right
            40: 4   // Down
        };

        $('body').keydown(function(event){
            // console.info("keydown det:", event.which);
            var mapped_dir = map_keyevent_to_dir[event.which];
            if (mapped_dir !== undefined) {
                event.preventDefault();
                self.game.dir = mapped_dir;

                do {
                self.game.animate();
                } while (self.game.hasMoved === true);
                self.updateUI();
            }
        });
        $('#Restart').on('click', function(){
            console.info("Restart btn clicked");
            self.game.restart();
            self.updateUI();
        });
        $('#changeV').on('click', function(){
            console.info("changeV btn clicked");
        });
        $('#sound').on('click', function(){
            console.info("sound btn clicked");
        });

        self.updateUI();
        // maybe move key detection here

        // definitelly btn detection
    };

    this.refreshView = function(){
        
    };

    // this.takeMove = function(){
    //     if (self.game.dir === 0)
    //         return;

    //     let moving = false;
    //     self.game.tiles.sort((x,y) => self.game.dir*(y.pos - x.pos));
    //     for(let tile of self.game.tiles)
    //         moving = moving || tile.move(this.dir);
        
    //     if(self.game.hasMoved && !moving){
    //         self.game.dir = 0;
    //         self.game.generateTile();

    //         for(let tile of this.tiles)
    //             tile.merging = false;
    //     } 
    //     this.hasMoved = moving;
    // };

    this.updateUI = function(){
        // if (self.running==false) {
        //     return;
        // }

        // Need to add animations.

        $(".cell").each(function(){
            var cell_id = parseInt($(this).attr("id"));         
            var cur_tile = self.game.getTile(cell_id);
            if (cur_tile !== undefined && cur_tile != null){
                // console.info("Found a cell! ", cell_id);
                $(this).text(cur_tile.val);
                // TODO:: need to Replace with CSS functions.
            }
            else {
                $(this).text("");
            }

        });

    }

    this.initialize();
}