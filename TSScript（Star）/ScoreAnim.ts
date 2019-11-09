import {ScoreFX} from "./ScoreFX";
const {ccclass, property} = cc._decorator;

@ccclass
export class ScoreAnim extends cc.Component {

    private scoreFX: ScoreFX;

    init(scoreFX: ScoreFX){
        this.scoreFX = scoreFX;
    }

    hideFX(){
        this.scoreFX.despawn();
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    // update (dt) {}
}
