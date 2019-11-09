const {ccclass, property} = cc._decorator;

@ccclass
export class Player extends cc.Component {

    //主角跳跃高度
    @property(cc.Integer)
     jumpHeight: number = 0;
    //主角跳跃持续时间
    @property(cc.Integer)
    private jumpDuration: number = 0;
    //辅助变形动作时间
    @property(cc.Integer)
    private squashDuration : number = 0;
    //最大移动速度
    @property(cc.Integer)
    private maxMoveSpeed: number = 0;
    //加速度
    @property(cc.Integer)
    private accel:number = 0;
    //跳跃音效资源
    // @property({
    //     type: cc.AudioClip,
    // })
    // private jumpAudio: cc.AudioClip = null;
    @property(cc.AudioClip)
    private jumpAudio: cc.AudioClip = null;

    private accLeft: boolean = false;
    private accRight:boolean = false;
    private xSpeed: number = 0;
    private jumpAction: cc.Action = null;
    private minPosX: number = 0;
    private maxPosX: number = 0;

    onLoad(){
        //组件是否启用属性
        this.enabled = false;
        //加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        //主角的当前水平方向速度
        this.xSpeed = 0;
        //屏幕边界
        this.minPosX = -this.node.parent.width/2;
        this.maxPosX = this.node.parent.width/2;
        //初始化跳跃动作
        this.jumpAction = this.setJumpAction();
        //初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        // var touchReceiver: cc.Node = cc.Canvas.instance.node;
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd, this);
        cc.find("Canvas").on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);

    }

    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_CANCEL,this.onTouchEnd, this);
        cc.find("Canvas").off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    setJumpAction(){
        let jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        let jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        let squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        let stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        let scaleBack = cc.scaleTo(this.squashDuration, 1, 1);
        let callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(squash, stretch, jumpUp, scaleBack, jumpDown, callback));
    }

    playJumpSound(){
        cc.audioEngine.play(this.jumpAudio, false, 1);
    }

    onKeyDown(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accLeft = false;
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard){
        switch(event.keyCode){
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = false;
                this.accRight = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accLeft = false;
                this.accRight = false;
                break;
        }
    }

    onTouchStart(event: cc.Event.EventTouch){
        if(event.getLocationX() > cc.winSize.width/2){
            this.accRight = true;
            this.accLeft = false;
        }else{
            this.accRight = false;
            this.accLeft = true;
        }
    }

    onTouchEnd(){
        this.accLeft = false;
        this.accRight = false;
    }

    getCenterPos(){
        var centerPos: cc.Vec2 = cc.v2(this.node.x, this.node.y + this.node.height/2);
        return centerPos;
    }

    startMoveAt(pos: cc.Vec2){
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.setJumpAction());
    }

    stopMove(){
        this.node.stopAllActions();
    }

    update(dt: number){
        //根据当前加速度方向每帧更新速度
        if(this.accLeft){
            this.xSpeed -= this.accel * dt;
        }else if(this.accRight){
            this.xSpeed += this.accel * dt;
        }

        //限制主角的速度不超过最大值
        if(Math.abs(this.xSpeed) > this.maxMoveSpeed){
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        //根据当前速度更新主角位置
        this.node.x += this.xSpeed * dt;

        //限制玩家角色超出屏幕
        if(this.node.x > this.node.parent.width/2){
            this.node.x = this.node.parent.width/2;
            this.xSpeed = 0;
        }else if(this.node.x < - this.node.parent.width/2){
            this.node.x = -this.node.parent.width/2;
            this.xSpeed = 0;
        }
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
