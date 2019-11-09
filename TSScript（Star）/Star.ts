import {Game} from "./Game";
const {ccclass, property} = cc._decorator;

@ccclass
export class Star extends cc.Component {

    //星星和主角之间的距离小于这个数值时，就会完成收集
    @property(cc.Integer)
    private pickRadius: number = 0;
    private game: Game = null;

    onLoad(){
        this.enabled = false;
    }

    init(game: Game){
        this.game = game;
        this.enabled = true;
        this.node.opacity = 255;
    }

    reuse(game: Game){
        this.init(game);
    }

    getPlayerDistance(){
        var playerPos = this.game.player.getCenterPos();
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    }

    onPicked(){
        var pos = this.node.getPosition();
        this.game.gainScore(pos);
        this.game.despawnStar(this.node);
    }

    update(dt: number){
        if(this.getPlayerDistance() < this.pickRadius){
            this.onPicked();
            return;
        }
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio *(255 - minOpacity));
    }



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
