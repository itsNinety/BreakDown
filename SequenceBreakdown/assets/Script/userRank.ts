
import GameInit from "./gameInit";
import GameEnd from "./gameEnd";
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
export default class userRank extends cc.Component {

    @property(cc.Button)
    returnButton: cc.Button = null;

    @property(cc.Button)
    weekButton: cc.Button = null;

    @property(cc.Button)
    totalButton: cc.Button = null;

    @property(cc.Button)
    buttonLeft:cc.Button = null;

    @property(cc.Button)
    buttonRight:cc.Button = null;

    @property(cc.Sprite)
    buleWeek_s: cc.Sprite = null;

    @property(cc.Sprite)
    whiteWeek_s: cc.Sprite = null;

    @property(cc.Sprite)
    blueTotal_s : cc.Sprite = null;

    @property(cc.Sprite)
    whiteTotal_s: cc.Sprite = null;

    @property(cc.Label)
    rightString:cc.Label = null;

    @property(cc.Label)
    leftString:cc.Label = null;

    @property(cc.Sprite)
    ranklist: cc.Sprite = null;

    @property(cc.Button)
    groupCharts: cc.Button = null;

    static instance: userRank = null;
    _isShow: boolean = false;
    isLeft: boolean = true;
    isWeek: boolean = true;
    isGroup: boolean = false;

    start () {
        
        let windowSize = cc.winSize;
        //console.log("width = " + windowSize.width + ", height = " + windowSize.height);
        if(windowSize.height/windowSize.width > 16/9){
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
        }

        let openDataContext = wx.getOpenDataContext();
        openDataContext.postMessage({
            message:'pleaseDrawWeekRankListOne'
        });  
        this.whiteWeek_s.node.active = true;
        this.buleWeek_s.node.active = false;
        this.whiteTotal_s.node.active = false;
        this.blueTotal_s.node.active = true;
        
        userRank.instance = this;
        this.leftString.node.active = true;
        this.rightString.node.active = false;
    
    }

    onLoad(){
        wx.updateShareMenu({
            withShareTicket:true
        });
        wx.showShareMenu({
            withShreTicket:true
        })
    }
   
    onReturnButtonClicked(){
        var node = cc.find('permanent').getComponent('permanent');
        node.setFirstLoad(false);
        if(GameInit.getInitInstance().backToGameInit == true){
            GameInit.getInitInstance().backToGameInit = false;
            cc.director.loadScene("GameInit");
        }else if(GameEnd.getEndInstance().backToGameEnd == true){
            GameEnd.getEndInstance().backToGameEnd = false;
            cc.director.loadScene("GameEnd");
        }else{
            console.log("All not");
        }
    }

    onWeekButtonClicked(){
        console.log("weekButtonClicked------------")
        this.whiteWeek_s.node.active = true;
        this.buleWeek_s.node.active = false;
        this.whiteTotal_s.node.active = false;
        this.blueTotal_s.node.active = true;
        let openDataContext = wx.getOpenDataContext();
        if(this.isGroup == false)
        {
            if(this.isLeft == true){
                openDataContext.postMessage({
                    message:'pleaseDrawWeekRankListOne'
                });  
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawWeekRankListTwo'
                });  
            }
        }else{
            if(this.isLeft == true){
                openDataContext.postMessage({
                    message:'pleaseDrawGroupWeekRankListOne'
                });  
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawGroupWeekRankListTwo'
                });  
            }
        }   
    }

    onTotalButtonClicked(){
        console.log("totalButtonClicked------------")
        this.whiteWeek_s.node.active = false;
        this.buleWeek_s.node.active = true;
        this.whiteTotal_s.node.active = true;
        this.blueTotal_s.node.active = false;
        this.isWeek = false;
        let openDataContext = wx.getOpenDataContext();
        if(this.isGroup == false){
            if(this.isLeft == true){
                openDataContext.postMessage({
                    message:'pleaseDrawTotalRankListOne'
                });  
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawTotalRankListTwo'
                });  
            }
        }else{
            if(this.isLeft == true){
                openDataContext.postMessage({
                    message:'pleaseDrawGroupTotalRankListOne'
                });  
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawGroupTotalRankListTwo'
                });  
            }
        }
    }

    onLeftButtonClicked(){
        console.log("leftButtonClicked------------")
        this.leftString.node.active = true;
        this.rightString.node.active = false;
        this.isLeft = true;
        let openDataContext = wx.getOpenDataContext();
        if(this.isGroup == false){
            if(this.isWeek == true){
                openDataContext.postMessage({
                    message:'pleaseDrawWeekRankListOne'
                }); 
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawTotalRankListOne'
                }); 
            }
        }else{
            if(this.isWeek == true){
                openDataContext.postMessage({
                    message:'pleaseDrawGroupWeekRankListOne'
                }); 
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawGroupTotalRankListOne'
                }); 
            }
        }
   
    }

    onRightButtonClicked(){
        console.log("rightButtonClicked------------")
        this.leftString.node.active = false;
        this.rightString.node.active = true;
        this.isLeft = false;
        let openDataContext = wx.getOpenDataContext();
        if(this.isGroup == false){
            if(this.isWeek == true){
                openDataContext.postMessage({
                    message:'pleaseDrawWeekRankListTwo'
                }); 
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawTotalRankListTwo'
                }); 
            }
        }else{
            if(this.isWeek == true){
                openDataContext.postMessage({
                    message:'pleaseDrawGroupWeekRankListTwo'
                }); 
            }else{
                openDataContext.postMessage({
                    message:'pleaseDrawGroupTotalRankListTwo'
                }); 
            }
        }   
    }

    onGroupChartsButtonClicked(){
       
        this.isGroup = true;
        console.log("groupChartsButtonClicked------------")
        var imgurl = [
            'https://cdnh5.nibaguai.com/wxapp/break/share/1.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/2.jpg',
            'https://cdnh5.nibaguai.com/wxapp/break/share/3.jpg',
        ]
        let index = Math.floor(Math.random() * 3 ) 
        let openDataContext = wx.getOpenDataContext();
        var self = this;

            wx.shareAppMessage({
                title:"是金鱼还是记忆大师，1秒极限记忆大挑战！",
                imageUrl:imgurl[index],
                success(res){
                    console.log("转发成功！");
                    console.log("res:",res);
                    console.log("res.shareTickets:",res.shareTickets);
                    if(res.shareTickets == null || res.shareTickets == undefined || res.shareTickets == ""){
                        //没有群消息，说明分享的是个人
                        console.log("res.shareTickets is null");
                        //self.showTipsUI("请分享到群")
                    }else{
                        //有群消息
                        console.log("res.shareTickets is not null")
                        if(res.shareTickets.length > 0){
                            //一些成功操作
                            openDataContext.postMessage({
                                message:'pleaseDrawGroupWeekRankListOne'
                            })
                        }
                    }
                },
                fail(res){
                    console.log("转发失败")
                }
            })
        
    }

    static getuserRankInstance(){
        return userRank.instance;
    }


    tex = new cc.Texture2D();

    // 刷新子域的纹理
    _updateSubDomainCanvas () {
        if (!this.tex) {
            return;
        }
        if(typeof(wx) == 'undefined') return;
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.ranklist.spriteFrame = new cc.SpriteFrame(this.tex);
    }
    update () {
        this._updateSubDomainCanvas();
    }


}
