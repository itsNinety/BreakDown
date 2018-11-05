// import { LANG } from "../utils/Lang";
// import { CONFIG } from "../utils/Config";
import { HTTP } from "./Http";
import GameBegin from "./gameBegin";
import gameBegin from "./gameBegin";
import userRank from "./userRank";

declare const CC_WECHATGAME

export default class Info {
    url_login = 'https://dzp.hdyouxi.com/gong_wx/index.php/Home/Index/login_program';
    url_sendInfo = 'https://dzp.hdyouxi.com/gong_wx/index.php/Home/General/save_score';
    url_getInfo = 'https://nh.hdyouxi.com/zhuanpan_dev/index.php/Home/General/get_score';

    diamond = 1000;
    bottle = 5;//
    vip = 0; 
    process = 0;
    juqing_id = 0;
    avatarUrl:string = ''
    city:string =''
    country:string =''
    gender = 0;
    sign = 0;
    language :string = ''
    // nickName : string = '不愿透露姓名的杨先生'
    province : string = '';
    headimg_url: string = '';
    
    //邀请的几个钻石获得
    // get1;
    // get2;
    // get3;
    // get4;
    
    userid : number = 0;
    openid: number = 0;
    score: number = 0;
    topScore: number = 0;
    nickName: String = null;
    userImage: String = null;
    topArray = []; //用于存放总排行用户信息
    weekArray = []; //用于存放周排行用户信息
    session_key :string = '';
    friendList = [];
    isReady : Boolean = false;
    isFinished: Boolean = false;
    //const I = Info.getInstance();

    friend_query = [1,2];

    static instance : Info = null;

    static getInstance() {  
        if (Info.instance == null) {  
            Info.instance = new Info();  
        }  
        return Info.instance;  
    }

    constructor(){
        if(!CC_WECHATGAME){
            this.isReady = true;
        }

    }

    getSharedInfo(){
       if(window.wx_data){
           let wx_data = window.wx_data.query;
           let from = wx_data.from;
           if(this.friend_query.indexOf(from) >= 0){
                console.log('该好友已经准备添加');
           }else{
                console.log('放入列表，准备添加');
                if(typeof from !=  "undefined"){
                    this.friend_query.push(from);
                }
           }
           window.wx_data = null;
       }
    }

    addDiamond(num){
        this.diamond += num;
    }

    touch(id){
        console.log('-------------------------------')
        var tmp = Date.parse( new Date() ).toString();
        tmp = tmp.substr(0,10);
        for(let i = 0 ; i<this.friendList.length ; i++){
            console.log(this.friendList[i]['id'] , id);
            if(parseInt(this.friendList[i]['id']) == parseInt(id)){
                this.friendList[i]['touch'] = tmp;
                return;
            }
        }
    }

    setSign(){
        var tmp = Date.parse( new Date() ).toString();
        tmp = tmp.substr(0,10);
        this.sign = tmp;
    }
    
    _need_update : boolean = false;
    _need_info : boolean = false;

    wxLogin(cb){
 
            let that = this;
            if(CC_WECHATGAME){
                wx.getSetting({
                    success: function (res) {
                        var authSetting = res.authSetting
                        if (authSetting['scope.userInfo'] === true) {
                            // 用户已授权，可以直接调用相关 API
                            console.log('已经授权');
                            that._need_update = false;
                            // that._wx_login(function(){
                                
                            // });
                            cb();
                        } else if (authSetting['scope.userInfo'] === false){
                            // 用户已拒绝授权，再调用相关 API 或者 wx.authorize 会失败，需要引导用户到设置页面打开授权开关
                            console.log('已经拒绝过')
                        } else {
                            // 未询问过用户授权，调用相关 API 或者 wx.authorize 会弹窗询问用户
                            console.log('未询问过');
                            that._need_update = true;
                            that._need_info = true;
                            that._wx_login(function(){

                            });
                        }
                    },
                    fail : function(res){
                        //console.log('fail' ,res);
                    },
                    complete :function(res){
                        //console.log('complete',res);
                    }
                })
            }else{
                console.log('非微信环境'  , CC_WECHATGAME)
            }
   
       
    }

    _wx_login(cbtwo){
        //可以优化为登录信息加密保存在本地，不用再次请求，后面优化
        //2018.07.12
       
            let that = this;
            wx.login({
                success: function (data) {
                    console.log(data);
                    let jscode = data.code;
                    let parm = {};
                    //parm.method = "login";
                    // parm.gameid = CONFIG.GAMEID;
                    parm.code = jscode;
                    parm.type = 'break_down'
                    console.log("parm",parm);
                   HTTP.httpPost('https://dzp.hdyouxi.com/gong_wx/index.php/Home/Index/login_program' ,parm, function(data){
                        if(parseInt(data) == -1){
                            //没有请求成功
                            return;
                        }
                        if(parseInt(data) == -10000){
                            //没有登录成功
                            return;
                        }
                        //that.userid = data;
                        let data2 = JSON.parse(data);
                        console.log("自己服务器传过来的data：",data2)
                        that.userid = data2.user_id;
                        that.openid = data2.open_id;
                        that.topScore = data2.top_score;
                        cbtwo();
                        if(that._need_info){
                            that._get_wx_info();
                        }else{
                            that._get_game_info();
                        }
                        that._get_friend_list();
                    })
                }
            })
          
        
   
    }

    //上传分数
    _send_score(cb){
        let that = this;
        let parm = {};
        parm.score = gameBegin.getGameBeginInstance().historyHighScore;
        console.log("toptopscore:",parm.score);
        parm.type = 'break_down'
        parm.user_id = this.userid;
        parm.open_id = this.openid;
        HTTP.httpPost(this.url_sendInfo,parm,function(data){
            if(parseInt(data) == -1){
                //没有请求成功
                return;
            }
            if(parseInt(data) == -10000){
                //没有上传成功
                return;
            }
            console.log("传过来的data：",data);
            cb();
        })
    }

    _get_charts(){
        return new Promise((resolve,reject)=>{
            let that = this;
            let parm = {};
            parm.type = 'break_down';
            HTTP.httpPost('https://nh.hdyouxi.com/zhuanpan_dev/index.php/Home/General/get_score',parm,function(data){
                if(parseInt(data) == -1){
                    //没有请求成功
                    return;
                }
                if(parseInt(data) == -10000){
                    //没有获取成功
                    return;
                }
                
                let data2 = JSON.parse(data);
                console.log("传过来的data：",data2);
                that.topArray = data2.top_info;
                that.weekArray = data2.week_info;
                console.log("weekArray的第一个值：",that.weekArray[0]);
                console.log("weekArray的长度",that.weekArray.length);
                console.log("topArray[0]调用：",that.topArray[0].user_id);
                that.isFinished = true;
                resolve();
            })
           
        })   
    }



    _get_wx_info(){
        let that = this;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            fail: function (res) {
                // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                    // 处理用户拒绝授权的情况
                }
            },
            success:function(data){
                that.avatarUrl = data.userInfo.avatarUrl+'?av=av.jpg';
                that.city = data.userInfo.city;
                that.country = data.userInfo.country;
                that.gender = data.userInfo.gender;
                that.language  = data.userInfo.language;
                that.nickName  = data.userInfo.nickName;
                that.province  = data.userInfo.province;


                if(that._need_update){
                    that._upToServer(that._get_game_info.bind(that));
                }
            }
        })
    }

    _upToServer(cb){
        let par = {};
        // par.nickname    = this.nickName;
        // par.avatar      = this.avatarUrl;
        // par.sex         = this.gender;
        // par.city        = this.city;
        // par.province    = this.province;
        // // par.gameid      = CONFIG.GAMEID;
        // par.userid      = this.userid;
        // par.method      = 'upInfo';
        HTTP.httpPost(this.url_login , par, function(data){
            cb();
        })
    }

    _get_game_info(){
        let that = this;
        let par = {};
        // par.userid = this.userid;
        // par.method = 'getInfo';
        HTTP.httpPost(this.url_login , par , function(data){
            if(data == -1) return;
            data = JSON.parse(data);
            that._set_info(data);
            that.isReady = true;
        })
    }

    _set_info(data){
        // this.bottle = parseInt(data.bottle);
        // this.diamond = parseInt(data.diamond);
        // this.vip = parseInt(data.vip);
        // this.process = parseInt(data.process);
        // this.juqing_id = parseInt(data.juqing_id);
        // this.nickName = data.nickname;
        // this.avatarUrl = data.avatar;
        // this.userid = data.id;
        // this.sign = data.sign;
        // //
        // this.get1 = data.get1;
        // this.get2 = data.get2;
        // this.get3 = data.get3;
        // this.get4 = data.get4;
    }

    _get_friend_list(){
        let that = this;
        let par ={};
        // par.method = 'getFriends';
        // par.userid = this.userid;
        // par.gameid = CONFIG.GAMEID;
        HTTP.httpPost(this.url_login, par , function(data){
            if(data == -1) return;
            data = JSON.parse(data);
            that._parse_friend(data);
        });
    }

    _parse_friend(data){
        this.friendList = data;
        this._add_friend();
    }



    _add_friend(){
        console.log(this.friend_query);
        for(let i = this.friend_query.length-1 ; i>=0 ;i--){
            for(let k in  this.friendList){
                let friend = this.friendList[k];
                if(parseInt(this.friend_query[i]) == parseInt(friend['id'])){
                    let o = this.friend_query.splice(i,1);
                    break;
                }
            }
        }

        if(this.friend_query.length==0)
            return;

        let addpar = {};
        addpar.method = 'addFriend';
        addpar.userid = this.userid;
        addpar.friends = this.friend_query.join(',');
        // addpar.gameid = CONFIG.GAMEID;
        HTTP.httpPost(this.url_login, addpar , function(data){});
        this.friend_query = [];
    }
    

}


