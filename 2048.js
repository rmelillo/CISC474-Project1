$(function(){
    $("#Restart").click(function(){ // Click on New Game Btn

        // TODO:: Implement change of game states

        var cur_btn = $(this).text();
        if (cur_btn == "New Game"){
            $(this).text("Restart");
        }
        else {
            $(this).text("New Game");
        }
    })
});