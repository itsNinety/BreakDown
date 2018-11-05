import GameInit from "./gameInit";
import GameEnd from "./gameEnd";
import { INFO } from "./Info";

const {ccclass, property} = cc._decorator;

@ccclass
export default class moreGame extends cc.Component {

    @property(cc.Button)
    returnButton: cc.Button = null;

    @property(cc.Button)
    crazyCatButton: cc.Button = null;

    @property(cc.Button)
    whiteLineButton: cc.Button = null;

    @property(cc.Button)
    rumenglingButton: cc.Button = null;

    start () {
        // 设置适配模式
        let windowSize = cc.winSize;
        //console.log("width = " + windowSize.width + ", height = " + windowSize.height);
        if(windowSize.height/windowSize.width > 16/9){
            cc.view.setResolutionPolicy(cc.ResolutionPolicy.SHOW_ALL);
        }
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

    onCrazyCatClicked(){
        wx.navigateToMiniProgram({
            appId: 'wx464d4fbf51af15b3',
            path: '',
            extraData: {
              appid: 'wxc44519764273878e',
            },
            envVersion: 'trial',
            success(res) {
              console.log('打开成功');
            }
          }) 
    }

    onWhiteLineClicked(){
        wx.navigateToMiniProgram({
            appId: 'wx464d4fbf51af15b3',
            path: '',
            extraData: {
              appid: 'wx68a33d3511756108',
            },
            envVersion: 'trial',
            success(res) {
              console.log('打开成功');
            }
          }) 
    }

    onRuMengLingClicked(){
        wx.navigateToMiniProgram({
            appId: 'wx464d4fbf51af15b3',
            path: '',
            extraData: {
              appid: 'wxcbefc10395c176cc',
            },
            envVersion: 'trial',
            success(res) {
              console.log('打开成功');
            }
          }) 
    }
}
