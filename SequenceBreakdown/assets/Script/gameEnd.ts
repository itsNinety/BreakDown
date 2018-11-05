import gameBegin from "./gameBegin";
import Info from "./Info";
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
export default class GameEnd extends cc.Component {

    @property(cc.Button)
    moreGameButton: cc.Button = null;

    @property(cc.Button)
    chartsButton: cc.Button = null;

    @property(cc.Button)
    againButton: cc.Button = null;
    
    @property(cc.Button)
    shareToChallengeButton: cc.Button = null;

    @property(cc.Button)
    voiceOnButton: cc.Button = null;

    @property(cc.Button)
    voiceOffButton: cc.Button = null;

    @property(cc.Label)
    currentScore: cc.Label = null;

    @property(cc.Label)
    highScoreLabel: cc.Label = null;

    backToGameEnd: boolean = false;
    static instance: GameEnd = null;

    start () {
        // 设置适配模式
        let windowSize = cc.winSize;
        //console.log("width = " + windowSize.width + ", height = " + windowSize.height);
        if(windowSize.height/windowSize.width > 16/9){
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
        }
        
        // let that = this;
        // Info.getInstance().wxLogin(function(){
        //         console.log(Info.getInstance().topScore);
        //         that.highScoreLabel.string = Info.getInstance().topScore.toString();
        //     });
        if(gameBegin.getGameBeginInstance().score > Info.getInstance().topScore){
            this.highScoreLabel.string = gameBegin.getGameBeginInstance().score.toString();
        }else{
            this.highScoreLabel.string = Info.getInstance().topScore.toString();
        }
        
        GameEnd.instance = this;
        var node = cc.find('permanent').getComponent('permanent');
        if(node.getMute() == false){
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else if(node.getMute() == true){
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }
        //cc.log(gameBegin.getGameBeginInstance().score.toString());
        this.currentScore.string = gameBegin.getGameBeginInstance().score.toString();
        //this.historyHighScore.string = ("最高分：" + (gameBegin.getGameBeginInstance().getHistoryHighScore()).toString());
    }

    onMoreGameButtonClicked(){
        this.backToGameEnd = true;
        //cc.director.loadScene("MoreGame");
        wx.navigateToMiniProgram({
            appId: 'wx464d4fbf51af15b3',
            path: '',
            extraData: {
              appid: '',
            },
            envVersion: 'release',
            success(res) {
              console.log('打开成功');
            }
        }) 
    }

    onchartsButtonClicked(){
        this.backToGameEnd = true;
        cc.director.loadScene("UserRank");
    }

    onAgainButtonClicked(){
        var node = cc.find('permanent').getComponent('permanent');
        node.setMute(this.voiceOffButton.node.active);
        cc.director.loadScene("GameBegin");
    }

    //也就是分享按钮
    onShareToChallengeButton(){
        var imgurl = [
            'https://cdnh5.nibaguai.com/wxapp/break/share/1.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/2.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/3.jpg',
        ]
        let index = Math.floor(Math.random() * 3 ) 
        // cc.loader.loadRes("texture/share",function(err,data){
            wx.shareAppMessage({
                title:"是金鱼还是记忆大师，1秒极限记忆大挑战",
                imageUrl:imgurl[index],
                success(res){
                    console.log("转发成功")
                    //分享成功后的奖励
                },
                fail(res){
                    console.log("转发失败")
                }
            })
    }

    static getEndInstance(){
        return GameEnd.instance;
    }

    OnVoiceButtonClicked(){
        var node = cc.find('permanent').getComponent('permanent');
        if(node.getMute() == false){
            var node = cc.find('permanent').getComponent('permanent');
            node.setMute(true);
            gameBegin.getGameBeginInstance().voiceOnOrOFF = false;
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }else if(node.getMute() == true){
            var node = cc.find('permanent').getComponent('permanent');
            node.setMute(false);
            gameBegin.getGameBeginInstance().voiceOnOrOFF = true;
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else{
            console.log("Allnot");
        }
    }
}
