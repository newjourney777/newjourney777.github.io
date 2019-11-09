import {Game} from "./Game";
const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreFX extends cc.Component {
    
    @property(cc.Animation)
    anim: cc.Animation = null;
    private game: Game;

    init(game: Game){
        this.game = game;
        this.anim.getComponent('ScoreAnim').init(this);
    }

    despawn(){
        this.game.despawnScoreFX(this.node);
    }

    play(){
        this.anim.play('score_pop');
    }




    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
