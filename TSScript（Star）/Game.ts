import {Player} from "./Player";
import {Star} from "./Star";
const {ccclass, property} = cc._decorator;

@ccclass
export class Game extends cc.Component {
    //这个属性引用了星星预制体资源
    @property(cc.Prefab)
    private starPrefab: cc.Prefab = null;
    //得分跳字
    @property(cc.Prefab)
    scoreFXPrefab: cc.Prefab = null;
    //星星产生后消失的随机事件范围
    @property(cc.Integer)
    maxStarDuration: number = 0;
    @property(cc.Integer)
    minStarDuration: number = 0;
    //地面节点，用于确定星星生成的高度
    @property(cc.Node)
    ground: cc.Node = null;
    //用于获取主角弹跳高度，和控制主角行动无关
    @property(Player)
    player: Player = null;
    @property(cc.Label)
    scoreDisplay: cc.Label = null;
    @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null;
    @property(cc.Node)
    btnNode: cc.Node = null;
    @property(cc.Node)
    gameOverNode: cc.Node = null;
    @property(cc.Label)
    controlHintLabel: cc.Label = null;
    @property({
        // type: cc.String,
        multiline: true,
    })
    keyboardHint: string = '';
    @property({
        // type: cc.String,
        multiline: true,
    })
    touchHint: string = '';

    //其他属性
    //地面节点的y轴坐标
    private groundY: number;
    //定时器
    private timer: number;
    //星星存在的持续时间（由于有随机，需要存储）
    private starDuration: number;
    //当前得分
    private score: number;
    //存储最后的星星的x坐标
    private currentStar: Star;
    private currentStarX: number;
    //星星池和得分池
    private starPool: cc.NodePool;
    private scorePool: cc.NodePool;

    protected onLoad(){
        //获取地平面的y轴坐标
        this.groundY = this.ground.y + this.ground.height/2;
        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        this.currentStar = null;
        this.currentStarX = 0;
        this.enabled = false;
        //判断是键盘操作还是触屏操作，设置提示文本
        var hinText = cc.sys.isMobile ? this.touchHint : this.keyboardHint;
        this.controlHintLabel.string = hinText;
        //创建节点池
        this.starPool = new cc.NodePool('Star');
        this.scorePool = new cc.NodePool('ScoreFX');
        
    }

    onStartGame(){
        //重置分数
        this.resetScore();
        //设置游戏运行状态
        this.enabled = true;
        //将按钮和游戏结束挪远和设置不可用
        this.btnNode.x = 3000;
        this.gameOverNode.active = false;
        this.player.startMoveAt(cc.v2(0, this.groundY));
        //产生星星
        this.spawnNewStar();
    }

    resetScore(){
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
    }

    spawnNewStar(){
        var newStar = null;
        //使用指定的模版在场景中生成一个新节点
        if(this.starPool.size() > 0){
            newStar = this.starPool.get(this);
        }else{
            newStar = cc.instantiate(this.starPrefab);
        }
        //将新增的节点添加到canvas节点下面
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        newStar.getComponent('Star').init(this);
        this.startTimer();
        this.currentStar = newStar;
    }

    despawnStar(star: any){
        this.starPool.put(star);
        this.spawnNewStar();
    }

    getNewStarPosition(){
        //如果没有星星，则设置一个随机的位置
        if(!this.currentStar){
            this.currentStarX = (Math.random() - 0.5) * 2 * this.node.width/2;
        }
        var randX = 0;
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        var maxX = this.node.width/2;
        if(this.currentStarX > 0){
            randX = -Math.random() * maxX;
        }else{
            randX = Math.random() * maxX;
        }
        this.currentStarX = randX;
        //返回星星坐标
        return cc.v2(randX, randY);
    } 

    startTimer(){
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    gainScore(pos){
        this.score += 1;
        //更新scoreDisplay Label文字
        this.scoreDisplay.string = 'Score: ' + this.score.toString();
        //播放特效
        var fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos);
        fx.play();
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    spawnScoreFX(){
        var fx;
        if(this.scorePool.size() > 0){
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        }else{
            fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
            fx.init(this);
            return fx;
        }
    }

    despawnScoreFX(scoreFX){
        this.scorePool.put(scoreFX);
    }

    gameOver(){
        this.gameOverNode.active = true;
        this.player.enabled = false;
        this.player.stopMove();
        this.currentStar.destroy();
        this.btnNode.x = 0;
    }

    protected update(dt: number){
        //每帧更新计时器
        if(this.timer > this.starDuration){
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    }
    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // start () {

    // }

    // update (dt) {}
}
