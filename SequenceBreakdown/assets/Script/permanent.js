// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,
 
    properties: {
        mute: {
            default: false,
        },
        
        first_load: {
            default: true,
        }
    },
 
    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
    },
    //自定义的两个函数。将值保存在this变量里
    setdata : function(json){
        this.data = json;  
    },
    getdata : function(){
        return this.data;  
    },
    setMute : function(bool){
        this.mute = bool;  
    },
    getMute : function(){
        return this.mute;  
    },
    setFirstLoad: function(bool){
        this.first_load = bool;  
    },
    getFirstLoad : function(){
        return this.first_load;  
    },
});