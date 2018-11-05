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
export default class TimeOut extends cc.Component {

    @property(cc.Button)
    screen_clicked: cc.Button = null;

    @property(cc.Sprite)
    showTimeOut: cc.Sprite = null;

    onScreenClicked(){
        cc.director.loadScene("GameEnd");
    }


    start () {
        let a = cc.scaleBy(0,1.05,1.05);
        let b = cc.scaleBy(0.3,0.95,0.95);
        let c = cc.scaleBy(0.3,1.05,1.05);
        let d = cc.scaleBy(0.3,0.95,0.95);
        this.showTimeOut.node.runAction(cc.sequence(a,b,c,d));
        setTimeout(function(){
            cc.director.loadScene("GameEnd");
        },2000)
    }


}
