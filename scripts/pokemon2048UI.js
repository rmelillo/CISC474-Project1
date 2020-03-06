var pokemon2048UI=function(){
    var self = this;
    this.game = undefined;
    this.running = false;

    this.initialize = function(){
        // TODO:: implement initialization function

        self.game = new pokemon2048();
        
        self.updateUI();
        // maybe move key detection here

        // definitelly btn detection
    };

    this.refreshView = function(){
        // $("#cell0")
        
    };

    this.takeMove = function(){

    };

    this.updateUI = function(){
        // if (self.running==false) {
        //     return;
        // }

        // Need to add animations.

        $(".cell").each(function(){
            var cell_id = parseInt($(this).attr("id"));         
            var cur_tile = self.game.getTile(cell_id);
            if (typeof cur_tile !== undefined && cur_tile != null){
                // console.info("Found a cell! ", cell_id);
                $(this).text(cur_tile.val);


                // TODO:: need to Replace with CSS functions.
            }


        });

    }

    this.initialize();
}