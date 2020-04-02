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
            // console.info("keydown det:", event.which);
            var mapped_dir = map_keyevent_to_dir[event.which];
            if (mapped_dir !== undefined) {
                event.preventDefault();
                self.game.dir = mapped_dir;
                do {
                self.game.animate();
                } while (self.game.hasPossibleMoves === true); 
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
            if (self.game.hasMoved){
                self.updateUI();
            }
            self.game.hasMoved = false;
            setTimeout(() => {
                self.game.checkGameState();
            },0);
            
        });

        // Restart btn listener
        $('#Restart').on('click', function(){
            console.info("Restart btn clicked");
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
            // for Testing
            // $('#gif1').animate({left:'244px'});
            // $('#gif2').animate({left:'122px'});
            $('#gif2').animate({height:'130px', width:'130px', margin:'-4px'}, 25);
            $('#gif2').animate({height:'112px', width:'112px', margin:'4px'}, 25);
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

                $(this).html("<img class='gif' id='gif" + cell_id + "' src='pokemon/Edited/" + cur_tile.val + ".gif'></img>");

                // TODO:: need to Replace with CSS functions.
            }
            else {
                $(this).html("");
            }

        });

        $('#scoreCount').text(self.game.score);
        $('#bestCount').text(Math.max(self.game.score, $('#bestCount').text()));
    }

    this.initialize();
}