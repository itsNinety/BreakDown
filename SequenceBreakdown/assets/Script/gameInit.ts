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
export default class GameInit extends cc.Component {

    @property(cc.Button)
    screen_clicked: cc.Button = null;

    @property(cc.Button)
    chartsButton: cc.Button = null;

    @property(cc.Button)
    shareButton: cc.Button = null;

    @property(cc.Button)
    moreGameButton: cc.Button = null;

    @property(cc.Button)
    voiceOnButton: cc.Button = null;

    @property(cc.Button)
    voiceOffButton: cc.Button = null;

    @property(cc.Node)
    origin: cc.Node = null;

    @property(cc.Sprite)
    singleColor: cc.Sprite = null;

    @property(cc.Sprite)
    notice: cc.Sprite = null;

    @property(cc.Sprite)
    logo: cc.Sprite = null;

    @property(cc.Label)
    highScoreLabel:cc.Label;

    @property(sp.Skeleton)
    circle_1: sp.Skeleton = null;

    @property(sp.Skeleton)
    circle_2: sp.Skeleton = null;


    backToGameInit: boolean = false;
    voiceOnOrOFF: boolean = true;
    static instance: GameInit = null;
    

    start () {
        // 设置适配模式
        let windowSize = cc.winSize;
        //console.log("width = " + windowSize.width + ", height = " + windowSize.height);
        if(windowSize.height/windowSize.width > 16/9){
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_WIDTH);
        }else{
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.FIXED_HEIGHT)
        }
        // Info.getInstance().wxLogin().then((reslove)=>{
        //     console.log("init里面topScore",Info.getInstance().topScore.toString())
        //     this.highScoreLabel.string = Info.getInstance().topScore.toString();
        // });
        
        this.passiveShare();
        //this.groupShare();

        var node = cc.find('permanent').getComponent('permanent');
        if(node.getFirstLoad() == true){
            this.wx_login();
            let that = this;
            Info.getInstance().wxLogin(function(){
                Info.getInstance()._wx_login(function(){
                    console.log(Info.getInstance().topScore);
                    that.highScoreLabel.string = Info.getInstance().topScore.toString();
                })
            });
            // this.singleColor.node.active = true;
            // this.notice.node.active = true;
            // this.logo.node.active = true;
            this.origin.active = true;
            this.screen_clicked.node.active = false; 
            var finished = cc.callFunc(function(){
                this.screen_clicked.node.active = true;
                this.origin.active = false;
            },this)
            this.origin.runAction(cc.sequence(cc.fadeIn(1.0),cc.fadeTo(1.5,255),cc.fadeTo(0.5,200),finished));
            // this.singleColor.node.runAction(cc.sequence(cc.fadeIn(1.0),cc.fadeTo(1.5,255),cc.fadeTo(0.5,100)));
            // this.notice.node.runAction(cc.sequence(cc.fadeIn(1.0),cc.fadeTo(1.5,255),cc.fadeTo(0.5,100)));
            // this.logo.node.runAction(cc.sequence(cc.fadeIn(1.0),cc.fadeTo(1.5,255),cc.fadeTo(0.5,100),finished));        
        }else{
            // let that = this;
            // Info.getInstance().wxLogin(function(){
            //     console.log(Info.getInstance().topScore);
            //     that.highScoreLabel.string = Info.getInstance().topScore.toString();
            //     });
            this.highScoreLabel.string = Info.getInstance().topScore.toString();
            this.singleColor.node.active = false;
            this.notice.node.active = false;
            this.logo.node.active = false;
        }  

        if(node.getMute() == false){
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else{
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }
        GameInit.instance = this;
        this.circle_1.enabled = true;
        this.circle_2.enabled = false;
        // this.scheduleOnce(function() {
        //     this.playCircle1();
        // }, 2.5);//circle1播放一次
        this.playCircle1();
        
    }

    playCircle1(){
        this.scheduleOnce(function() {
            this.circle_1.enabled = false;
            this.circle_2.enabled = true; 
            this. playCircle2();
        }, 2.5);//circle1播放一次
    }

    playCircle2(){
        this.scheduleOnce(function() {
            this.circle_2.enabled = false;
            this.circle_1.enabled = true;
            this. playCircle1();
        }, 2.5);//circle2播放一次
    }

    wx_login(){
        let that = this;
        if(typeof(wx) != 'undefined'){
            let windowSize = cc.winSize;
            let button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 0,
                    top: 0,
                    width: windowSize.width,
                    height: windowSize.height,
                }
            })
            button.onTap(function(res){
                if(res.userInfo){//用户授权
                    button.destroy();
                    //let json = JSON.parse(res);
                    let json = res;
                    console.log("json = ", json);
                    Info.getInstance().nickName = json.userInfo.nickName;
                    Info.getInstance().headimg_url = json.userInfo.avatarUrl;
                    Info.getInstance().city = json.userInfo.city;
                    Info.getInstance().country = json.userInfo.country;
                    //Info.getInstance().gender = json.userInfo.gender;
                    Info.getInstance().language = json.userInfo.language;
                    Info.getInstance().province = json.userInfo.province;
                    console.log('用户登录成功:(微信返回) nick_name = ' + Info.getInstance().nickName);
                    console.log('headimg_url = ' + Info.getInstance().headimg_url);
                    console.log('city = ' + Info.getInstance().city);
                    console.log('country = ' + Info.getInstance().country);
                    console.log('gender = ' + Info.getInstance().gender);
                    console.log('language = ' + Info.getInstance().language);
                    console.log('province = ' + Info.getInstance().province);
                    console.log('userInfo:-----------------------------');
                    //Info.getInstance().showInfo();
                }
                else{
                    that.wx_login();
                }
            })
        }
    }

    onScreenClicked(){
        cc.director.loadScene("GameTeaching");
    }

    onChartsButtonClicked(){
        this.backToGameInit = true;
        cc.director.loadScene("UserRank");
    }

    
    //主动分享,微信在不开启群分享时默认是单人分享
    onShareButtonClicked(){
        //分享游戏
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
        // })
    }

    //群分享
    groupShare(){
        wx.updateShareMenu({
            withShareTicket:true
        });
        var self = this;
        var imgurl = [
            'https://cdnh5.nibaguai.com/wxapp/break/share/1.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/2.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/3.jpg',
        ]
        let index = Math.floor(Math.random() * 3 ) 
        // cc.loader.loadRes("Texture/shareImage/1",function(err,data){
            wx.shareAppMessage({
                title:"是金鱼还是记忆大师，1秒极限记忆大挑战！",
                imageUrl:imgurl[index],
                success(res){
                    console.log("转发成功！");
                    if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){
                        //没有群消息，说明分享的是个人
                        console.log("res.shareTickets is null");
                        //self.showTipsUI("请分享到群")
                    }else{
                        //有群消息
                        console.log("res.shareTickets is not null")
                        if(res.shareTickets.length > 0){
                            //一些成功操作
                        }
                    }
                },
                fail(res){
                    console.log("转发失败")
                }
            })
        // })
    }

    //被动分享
    passiveShare(){
        wx.showShareMenu(); //开启右上角的分享
        var imgurl = [
            'https://cdnh5.nibaguai.com/wxapp/break/share/1.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/2.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/3.jpg',
        ]
        //监听右上角的分享调用
        // cc.loader.loadRes("texture/share",function(err,data){
            let index = Math.floor(Math.random() * 3 )
            wx.onShareAppMessage(function(res){
                return{
                    title:"是金鱼还是记忆大师，1秒极限记忆大挑战！",
                    imageUrl:imgurl[index],
                    success(res){
                        console.log("转发成功")
                        //分享后的奖励
                    },
                    fail(res){
                        console.log("转发失败")
                    }
                }
            })
        // })
    }

    onMoreGameButtonClicked(){
        this.backToGameInit = true;
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

    onWhiteLineClicked(){
        this.backToGameInit = true;
        //cc.director.loadScene("MoreGame");
        wx.navigateToMiniProgram({
            appId: 'wx464d4fbf51af15b3',
            path: '',
            extraData: {
              appid: 'wx68a33d3511756108',
            },
            envVersion: 'release',
            success(res) {
              console.log('打开成功');
            }
        }) 
    }

    static getInitInstance(){
        return GameInit.instance;
    }

    OnVoiceButtonClicked(){
        console.log("clicked")
        console.log(this.voiceOnButton.node.active);
        var node = cc.find('permanent').getComponent('permanent');
        console.log(node.getMute());
        if(node.getMute() == false){
            //var node = cc.find('permanent').getComponent('permanent');
            node.setMute(true);
            this.voiceOnOrOFF = false;
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }else if(node.getMute() == true){
            //var node = cc.find('permanent').getComponent('permanent');
            console.log("测试是否执行到")
            node.setMute(false);
            console.log(node.getMute());
            this.voiceOnOrOFF = true;
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else{
            console.log("not true, not false")
        }
    }
}
