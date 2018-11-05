import GameInit from "./gameInit";
import GameBegin from "./gameBegin";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class SquareBlock extends cc.Component {

    @property(cc.Sprite)
    normal_block: cc.Sprite = null;

    @property(cc.Sprite)
    translucent_block: cc.Sprite = null;

    @property(cc.Sprite)
    invisible_block: cc.Sprite = null;

    @property(cc.Label)
    state_label: cc.Label = null;

    //初始block的state值为-1；Normal状态下state值为1，说明可点击；Translucent状态下state值为0，说明已点击
    state: number = -1;
    //初始block的order值为100
    order: number = 100; 
    name: string;


    start () {

    }

    onNormal(){
        //this.normal_block.node.runAction(cc.fadeIn(1));
        this.normal_block.node.active = true;
        //this.normal_block.node.opacity = 0;
        //let a = cc.fadeIn(0.2);
        this.translucent_block.node.active = false;
        this.invisible_block.node.active = false;
        this.state = 1; //Normal状态下说明可以点击，state值为1
        //this.normal_block.node.runAction(cc.fadeIn(0.2));
        //bounce效果
        // let a = cc.moveTo(0.05,0,10)
        // let b = cc.moveTo(0.05,0,-10)
        // let c = cc.moveTo(0.03,0,10)
        // let d = cc.moveTo(0.03,0,-10)
        // let sequence = cc.sequence(a,b,c,d);
        // this.normal_block.node.runAction(sequence);
        let a = cc.scaleBy(0,1.05,1.05);
        let b = cc.scaleBy(0.2,0.95,0.95);
        this.normal_block.node.runAction(cc.sequence(a,b));
    }

    onTranslucent(){
        this.normal_block.node.active = false;
        this.translucent_block.node.active = true;
        this.invisible_block.node.active = false;
        this.state = 0; 
        //this.translucent_block.node.runAction(cc.fadeOut(0.2));
        //this.normal_block.node.runAction(cc.fadeTo(0.2,100));
        var finished = cc.callFunc(function(){
            GameBegin.getGameBeginInstance().checkRoundDone();
        },this)
        let a = cc.scaleBy(0.2,1.15,1.15);
        let b = cc.fadeOut(0.02);
        this.translucent_block.node.runAction(cc.sequence(a,b,finished));
        
    }

    onInvisible(){
        this.normal_block.node.active = false;
        this.translucent_block.node.active = false;
        this.invisible_block.node.active = true;
        this.state = -1; //隐形节点，不能点击
        // this.state_label.string = this.state.toString();
    }

    
}
