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
export default class Http {

    static instance : Http = null;

    static getInstance() {  
        if (Http.instance == null) {  
            Http.instance = new Http(); 
        }  
        return Http.instance;  
    }

    httpGets(url, callback){
        var xhr = cc.loader.getXMLHttpRequest();  
        xhr.onreadystatechange = function () {  
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                var respone = xhr.responseText;  
                callback(respone);  
            }  
        };  
        xhr.open("GET", url, true);  
        if (cc.sys.isNative) {  
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");  
        }
        xhr.timeout = 5000;// 5 seconds for timeout  
  
        xhr.send();  
    }
  
    httpPost(url, params, callback){
        var xhr = cc.loader.getXMLHttpRequest();  
        xhr.onreadystatechange = function () {   
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {  
                var respone = xhr.responseText;  
                callback(respone);  
            }else{  
                callback(-1);
            }  
        };  
        xhr.open("POST", url, true);  
        if (cc.sys.isNative) {  
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");  
        }
        xhr.timeout = 5000;// 5 seconds for timeout  
        xhr.send(params);  
    }
}
export const HTTP = Http.getInstance();