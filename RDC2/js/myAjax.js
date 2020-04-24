// 对象转字符
function obj2str(obj){
    // {
    // "userName":"abc",
    // "userPwd":"12345",
    // "t":"648963"
    // }
    obj.t = new Date().getTime();
    var res = [];
    for(var key in obj){
        // 将URL中的中文转换为字符串
        res.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])); //[username=abc,userPwd=12345];
    }
    // 转换为需要的格式
    return res.join("&");//username=abc&userPwd=12345
}
function ajax(type, url, obj, timeout, success, error){
    // 0.将对象转换为字符串
    var str = obj2str(obj); //key=value&&key=value
    //1.创建一个异步对象    
    var xmlhttp;
    if (window.XMLHttpRequest){
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }else{
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    //2.设置请求方式和请求地址
    if(type === "GET"){
        xmlhttp.open(type, url+"?"+str, true);
        xmlhttp.send();
    }else{
        xmlhttp.open(type,url,true);
        xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xmlhttp.send(str);

    }
    xmlhttp.open("POST", url+"?"+str, true);
    // 以下代码必须放到open和send之间
    xmlhttp.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
        //3.发送请求
    xmlhttp.send();
    //4.监听状态的变化
    xmlhttp.onreadystatechange = function(ev2){
        if (xmlhttp.readyState === 4) {
            clearInterval(timer);
            // 判断是否请求成功
            if(xmlhttp.status >= 200 && xmlhttp.status <300 ||
                xmlhttp.status === 304){
                //5.处理返回的结果
                //接收到服务器返回的数据
                success(xmlhttp);
            }
            else{
                error(xmlhttp);
            }
        }
    }
    // 判断是否传入超时时间
    if(timeout){
        timer = setInterval(function(){
            console.log("中断请求");
            xmlhttp.abort();
            clearInterval(timer);
        },timeout);
    }
}




// cookie封装
window.onload = function(){
    function addCookie(key, value, day, path, domain){
        // 1.处理默认保存的路径
        var index = window.location.pathname.lastIndexOf("/");
        var currentPath = window.location.pathname.slice(0,index);
        path = path || currentPath;
        // 2.处理默认保存的domain
        domain = domain || document.domain;
        // 3.处理默认过期时间
        if(!day){
            document.cookie = key+"="+value+";path="+path+";domain="+domain+";";
        }else{
            var date = new Date();
            date.setDate(date.getDate() + day);
            document.cookie = key+"="+value+";expires="+date.toGMTString()+";path="+path+";domain="+domain+";";

        }
    }
    function getCookie(key){
        var res = document.cookie.split(";");
        for(var i=0; i<res.length; i++){
            var temp = res[i].split("=");
            if(temp[0].trim() === key){
                return temp[1];
            }
        }
    }
    // 默认情况下只能删除默认路径中保存的cookie，若想删除指定路径中保存的cookie，必须在删除时指定路径
    function delCookie(key,path){
        addCookie(key,getCookie(key),-1,path);
    }
}


