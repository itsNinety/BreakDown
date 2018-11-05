// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import SquareBlock from "./squareBlock";
import GameTeaching from "./gameTeaching";
import Info from "./Info";
declare const CC_WECHATGAME

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameBegin extends cc.Component {

    @property(cc.Prefab)
    block_fab: cc.Prefab = null;
 
    @property(cc.Label)
    restTimeLabel: cc.Label = null;

    @property(cc.Label)
    currentScoreLabel: cc.Label = null;

    @property(cc.Sprite)
    bgTimeOut = null;

    @property(cc.Button)
    voiceOnButton: cc.Button = null;

    @property(cc.Button)
    voiceOffButton: cc.Button = null;

    @property(cc.AudioClip)
    clickAudio = null;

    @property(cc.AudioClip)
    answerRightAudio = null;

    @property(cc.AudioClip)
    answerWrongAudio = null;

    @property(cc.AudioClip)
    bonusAudio = null;

    @property(cc.AudioClip)
    gameOverAudio = null;

    @property(cc.AudioClip)
    timeOutAudio = null;


    voiceOnOrOFF: boolean = null;
    static instance: GameBegin = null;
    blocks: cc.Node[] = []; //用于存放block的数组
    level: number = 1; //level1-7分别对应出现3-9个block
    restTime: number = 45; //剩余时间，初始值为45s
    score: number = 0; //分数，初始值为0
    successClickNumber: number = 0; //正确点击的次数
    continuingSuccessNumber: number = 0; //连续正确点击的次数
    successNumber: number = 0; //连续正确的组数，初始值为0
    historyHighScore: number = Info.getInstance().topScore; //历史最高分数,需要通过后台获取,也可以保存本地
    weekHighScore: number;
    uploadWeek: number;
    items = ['0','1','2','3','4','5','6','7','8'];
    randomBlocks = this.getRandomArrayElements(this.items, (this.level+2)); //新的随机数组
    clickArray: string[] = []; //用于存放被点击的block（前提这个block是可点击的
    currentIndex: number = 0;
    index: number = 0;
    //public blockPool = new cc.NodePool();


    start () {
        // 设置适配模式
        let windowSize = cc.winSize;
        //console.log("width = " + windowSize.width + ", height = " + windowSize.height);
        if(windowSize.height/windowSize.width > 16/9){
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
        }
        
        this.bgTimeOut.node.active = false;
        GameBegin.instance = this;
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
        //初始化计时器
        this.restTime = 45;
        this.restTimeLabel.string = parseInt(this.restTime.toString()).toString();
        this.currentScoreLabel.string = this.score.toString();
        this.schedule(this.reduceTime,1,44);
        console.log("RestTime:",this.restTime);
        this.initMap();
    }


    initMap(){
        //创建九个block_icon节点
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                this.spawnNewBlock(i,j); 
            }
        }
        //每次initmap的时候randomBlocks也需要更新,clickArray也要更新
        this.randomBlocks = this.getRandomArrayElements(this.items, (this.level+2)); //新的随机数组
        this.clickArray = [];
        this.successClickNumber = 0;
        this.currentIndex = 0;
        this.index = 0;
        this.schedule(this.show , 0.2 , (this.level+1));
    }

    reduceTime(){
        console.log("TimeReduce")
        this.restTime = this.restTime - 1;
        console.log("restTime:",this.restTime);
        this.restTimeLabel.string = parseInt(this.restTime.toString()).toString();
        this.currentScoreLabel.string = this.score.toString();
        if(this.restTime <= 5){
            this.bgTimeOut.node.active = true;
            this.bgTimeOut.node.runAction(cc.blink(5,5));
            cc.log("TimeoutAudio")
            cc.audioEngine.play(this.timeOutAudio,false,1);
        }
        if(this.restTime <= 0){
            cc.audioEngine.stop(this.timeOutAudio);
            this.unschedule(this.reduceTime);
            this.gameOver();
        }
    }

    show(){
        //console.log("不带参数的回调函数show，每0.2秒执行依次，累积执行this.level次")
        this.blocks[this.randomBlocks[this.currentIndex]].getComponent(SquareBlock).onNormal();
        //随机选取(level+2)个block让他们依次每隔0.2s显示一个，并依次标记order:1- level+2
        this.blocks[this.randomBlocks[this.currentIndex]].getComponent(SquareBlock).order = this.currentIndex+1;
        this.currentIndex++;
    }

    //从一个数组arr中随机取出count个元素
    getRandomArrayElements(arr, count){
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while(i-- >min){
            index = Math.floor((i+1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        } 
        return shuffled.slice(min);
    }

    spawnNewBlock(i:number,j:number){
        //使用给定的模版在场景中生成一个新节点
        var newBlock = cc.instantiate(this.block_fab);
        //将新增的节点添加到Canvas节点下面
        this.node.addChild(newBlock);
        //为block设置一个位置
        newBlock.setPosition(this.getNewBlockPosition(i,j));
        //将block放进对象池
        // this.blockPool.put(newBlock);
        //将block放进数组
        this.blocks[3*i+j] = newBlock;
        //初始化block为隐形
        this.blocks[3*i+j].getComponent(SquareBlock).onInvisible();
        //初始化name为了以后判断方便
        this.blocks[3*i+j].getComponent(SquareBlock).name = (3*i+j).toString();
        //创建触碰事件
        newBlock.on(cc.Node.EventType.TOUCH_END,this.onBlockClick,this);

    }

    getNewBlockPosition(i:number,j:number){
        var blockX =(i - 1) * 185;
        var blockY =(j - 1) * 185;
        return cc.p(blockX, blockY);
    }

    onBlockClick(evt:cc.Event.EventTouch){
        let block = evt.target;
        let p = block.getComponent(SquareBlock);
        if(p.state == 0 || p.state == -1){
            console.log("点击无反应,操作无效");
            if(this.voiceOnOrOFF == true){
            cc.audioEngine.play(this.answerWrongAudio,false,1)
            }
        }else if(this.isAllShowed()){
            this.isBlockBeHitRight(p);
        }else{
            // console.log("方块还没完全出现你就点击");
            // console.log(p.state);
            //这里可能需要调用一些函数 更新一些数据
            //this.isAllShowed();
        }
    }

    //判断方块是否已经完全出现
    isAllShowed(){
        console.log(this.blocks[this.randomBlocks[this.level+1]].getComponent(SquareBlock).state);
        if(this.blocks[this.randomBlocks[this.level+1]].getComponent(SquareBlock).state == 1){
            //console.log("已经判断了方块完全出现")
            return true;
        }else{
            return false;
        }
    }

    //检测是否点击正确
    isBlockBeHitRight(grid:SquareBlock){
        var nameIndex = this.randomBlocks[this.index];
        this.index++;
        console.log("index:",this.index);
        if(parseInt(grid.name) == nameIndex){
            this.clickArray.push(grid.name);//将被点击的block的name放进这个数组
            grid.onTranslucent(); //变成已点击状态
            //this.checkRoundDone();
        }else{
            if(this.restTime > 1){
            this.restTime = this.restTime - 1;
            }
            if(this.voiceOnOrOFF == true){
                cc.audioEngine.play(this.answerWrongAudio,false,1);
                }
            this.continuingSuccessNumber = 0;
            //console.log("shake")
            var finished = cc.callFunc(function(){
                this.releaseResource();
                this.initMap();
            },this)
            let a = cc.blink(0.5,3);
            let sequence = cc.sequence(a,finished);
            grid.node.runAction(sequence);
            //console.log("shake over")         
    }
}

    //检测这组是否结束
    checkRoundDone(){
        //判断clickarray和randomarray的元素是否完全相同
        if(this.clickArray.toString() == this.randomBlocks.toString()){
            this.successNumber++; //正确的组数增加1
            // this.restTime = this.restTime + 2;
            this.continuingSuccessNumber++; //连续正确的组数增加1
            if(this.continuingSuccessNumber > 1 && this.voiceOnOrOFF == true){
                cc.audioEngine.play(this.bonusAudio,false,1)
            }else if(this.voiceOnOrOFF == true){
                cc.audioEngine.play(this.answerRightAudio,false,1)
            }else{

            }
            this.getScore();
            if(this.continuingSuccessNumber >= 10){
                this.score = this.score + (this.level + 2) * 50;
            }else if(this.continuingSuccessNumber >= 6){
                this.score = this.score + (this.level + 2) * 30;
            }else if(this.continuingSuccessNumber >= 3){
                this.score = this.score + (this.level + 2) * 20; ;                    
            }else{
                this.score = this.score + (this.level + 2) * 10;
            }
            this.successClickNumber = 0;
            if(this.successNumber%5 == 0){
                this.level++;
            }
            this.releaseResource();
            this.initMap();
        }else{
            if(this.voiceOnOrOFF == true){
                cc.audioEngine.play(this.clickAudio,false,1);
                //cc.log("普通点击音效")
            }
            this.successClickNumber++; //正确点击的次数增加1
            this.getScore();
        }   
    }

    getScore(){
        this.score = this.score + (this.level + 2);
    }

    releaseResource(){
        console.log("releaseResource()");
        for(let i =  0;i < 3; i++){
            for(let j = 0; j < 3; j++){
                this.blocks[3*i+j].destroy();
            }
         }
        //this.blockPool.clear();
    }

    gameOver(){
        this.getHistoryHighScore();
        this.uploadScore(); //上传分数
        if(this.voiceOnOrOFF == true){
        cc.audioEngine.play(this.gameOverAudio,false,1);
        }
        Info.getInstance()._send_score(function(){
            cc.director.loadScene("TimeOut");
        });
        // let openDataContext = 
    }

    static getGameBeginInstance(){
        return GameBegin.instance;
    }

    
    OnVoiceButtonClicked(){
        var node = cc.find('permanent').getComponent('permanent');
        if(node.getMute() == false){
            var node = cc.find('permanent').getComponent('permanent');
            node.setMute(true);
            GameTeaching.getGameTeachingInstance().voiceOnOrOFF = false;
            this.voiceOnOrOFF = false;
            this.voiceOnButton.node.active = false;
            this.voiceOffButton.node.active = true;
        }else if(node.getMute() == true){
            var node = cc.find('permanent').getComponent('permanent');
            node.setMute(false);
            GameTeaching.getGameTeachingInstance().voiceOnOrOFF = true;
            this.voiceOnOrOFF = true;
            this.voiceOnButton.node.active = true;
            this.voiceOffButton.node.active = false;
        }else{
            console.log("Allnot");
        }
    }

    getHistoryHighScore():number{
        if (this.score > this.historyHighScore){
            this.historyHighScore = this.score;
            return this.historyHighScore;  
        }else{
            this.historyHighScore = this.historyHighScore;
            return this.historyHighScore;
        }
    }

    uploadScore(){
        console.log("uploadScore已经执行")
        //this._isShow = !this._isShow;
        let currentTime = new Date().getTime(); //从1970年开始到现在的秒数
        this.uploadWeek = (currentTime - currentTime % 604800)/604800; //从1970年开始到现在是第多少周
        console.log("uploadWeek:",this.uploadWeek)
        wx.setUserCloudStorage({
            KVDataList: [{key:'currentScore',value:this.score.toString()},
                         {key:'uploadTime',value:this.uploadWeek.toString()}],
            success:res =>{
                console.log(res);
                console.log("上传成功");
                //让子域更新当前用户的最高分，因为主域无法得到getUserCloudStorage
                //可以把数据存在本地，对比之后只上传maxScore,weekMaxScore,uploadTime
                //还是不保存本地
                let openDataContext = wx.getOpenDataContext();
                openDataContext.postMessage({
                    command: 'updateweekTotalScore'
                });
            },
            fail: res => {
                console.log(res);
            }
        })
        
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
}



