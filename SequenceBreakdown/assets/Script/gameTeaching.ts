import GameInit from "./gameInit";

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
export default class GameTeaching extends cc.Component {

   
    @property(cc.Button)
    screen_clicked: cc.Button = null;

    @property(cc.Button)
    returnButton: cc.Button = null;

    @property(cc.Button)
    voiceOnButton: cc.Button = null;

    @property(cc.Button)
    voiceOffButton: cc.Button = null;

    voiceOnOrOFF: boolean = null;
    static instance: GameTeaching = null;
  

    start () {
        GameTeaching.instance = this;
        var node = cc.find('permanent').getComponent('permanent');
        if(node.getMute() == false){
            this.voiceOnOrOFF = true;
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else if(node.getMute() == true){
            this.voiceOnOrOFF = false;
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }
    }

    onScreenClicked(){
        cc.director.loadScene("GameBegin");
    }

    onReturnButtonClicked(){
        var node = cc.find('permanent').getComponent('permanent');
        node.setMute(!this.voiceOnOrOFF);
        node.setFirstLoad(false);
        cc.director.loadScene("GameInit");
    }

    static getGameTeachingInstance(){
        return GameTeaching.instance;
    }

    OnVoiceButtonClicked(){
        var node = cc.find('permanent').getComponent('permanent');
        console.log(node.getMute())
        if(node.getMute() == false){
            var node = cc.find('permanent').getComponent('permanent');
            node.setMute(true);
            this.voiceOnOrOFF = false;
            GameInit.getInitInstance().voiceOnOrOFF = false;
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }else if(node.getMute() == true){
            var node = cc.find('permanent').getComponent('permanent');
            node.setMute(false);
            this.voiceOnOrOFF = true;
            GameInit.getInitInstance().voiceOnOrOFF = true;
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else{
            console.log("Allnot");
        }
    }
}
