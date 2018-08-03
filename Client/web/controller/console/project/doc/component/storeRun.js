var config=require("common/js/config")
module.exports=new Vuex.Store({
    state:{
        interface:{},
        baseUrl:"",
        index:0,
        baseUrls:[],
        status:[],
        before:"",
        after:""
    },
    getters:{
        querySave:function (state,getters) {
            return state.interface.param[state.index].query.filter(function (obj) {
                if(obj.name && obj.enable)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        headerSave:function (state,getters) {
            return state.interface.param[state.index].header.filter(function (obj) {
                if(obj.name)
                {
                    return true
                }
                else
                {
                    return false
                }
            });
        },
        bodySave:function (state,getters) {
            return state.interface.param[state.index].body.filter(function (obj) {
                if(obj.name && obj.enable)
                {
                    return true
                }
                else
                {
                    return false
                }
            })
        },
        queryCount:function (state,getters) {
            return getters.querySave.length
        },
        headerCount:function (state,getters) {
            return getters.headerSave.length
        },
        bodyCount:function (state,getters) {
            return getters.bodySave.length
        },
        paramCount:function (state,getters) {
            return getters.param.length;
        },
        param:function (state,getters) {
            return state.interface.param[state.index].param;
        },
        curParam:function (state) {
            return state.interface.param[state.index];
        },
    },
    mutations:{
        setIndex:function(state,data) {
            state.index=data;
        },
        setBaseUrls:function(state,data) {
            state.baseUrls=data;
        },
        setStatus:function(state,data) {
            state.status=data;
        },
        setBefore:function(state,data) {
            state.before=data;
        },
        setAfter:function(state,data) {
            state.after=data;
        },
        toggleQuery:function (state) {
            if(state.interface.param[state.index].queryRawShow)
            {
                state.interface.param[state.index].queryRawShow=0;
                var str=$.trim(state.interface.param[state.index].queryRawStr);
                var arr=[];
                var param1=str.split("&");
                for(var i=0;i<param1.length;i++)
                {
                    if(!param1[i])
                    {
                        continue;
                    }
                    var param2=param1[i].split("=");
                    if(param2.length>0)
                    {
                        var valueObj=helper.findValue(state.interface.param[state.index].query,param2[0]);
                        arr.push({
                            name:param2[0],
                            must:valueObj?valueObj.must:1,
                            remark:valueObj?valueObj.remark:"",
                            selValue:param2[1]?decodeURIComponent(param2[1]):"",
                            enable:valueObj?valueObj.enable:1,
                            value:valueObj?valueObj.value:null,
                            encrypt:(valueObj && valueObj.encrypt)?valueObj.encrypt:{
                                type:"",
                                salt:"",
                                key:0
                            }
                        })
                    }
                }
                arr.push({
                    name:"",
                    must:0,
                    remark:"",
                    value:"",
                    selValue:"",
                    enable:1
                })
                state.interface.param[state.index].query=arr;
            }
            else
            {
                state.interface.param[state.index].queryRawShow=1;
                var str="",arr=state.interface.param[state.index].query;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].name)
                    {
                        str+=(arr[i].name+"="+(encodeURIComponent(arr[i].selValue))+"&")
                    }
                    if(i==arr.length-1)
                    {
                        str=str.replace(/(\&+)$/,"");
                    }
                }
                state.interface.param[state.index].queryRawStr=str;
            }
        },
        toggleHeader:function (state) {
            if(state.interface.param[state.index].headerRawShow)
            {
                state.interface.param[state.index].headerRawShow=0;
                var arr=$.trim(state.interface.param[state.index].headerRawStr).split("\n");
                var arrHeader=[];
                for(var i=0;i<arr.length;i++)
                {
                    if(!$.trim(arr[i]))
                    {
                        continue;
                    }
                    var line=$.trim(arr[i]);
                    var index=line.indexOf(":");
                    var key="",value="";
                    if(index==-1)
                    {
                        key=line;
                    }
                    else
                    {
                        key=$.trim(line.substr(0,index));
                        value=$.trim(line.substr(index+1));
                    }
                    if(key)
                    {
                        var obj=helper.findValue(state.interface.param[state.index].header,key);
                        arrHeader.push({
                            name:key,
                            value:value,
                            remark:obj?obj.remark:"",
                            encrypt:(obj && obj.encrypt)?obj.encrypt:{
                                type:"",
                                salt:"",
                                key:0
                            }
                        })
                    }
                }
                arrHeader.push({
                    name:"",
                    value:"",
                    remark:""
                })
                state.interface.param[state.index].header=arrHeader;
            }
            else
            {
                state.interface.param[state.index].headerRawShow=1;
                var str="",arr=state.interface.param[state.index].header;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].name)
                    {
                        str+=(arr[i].name+":"+(arr[i].value?arr[i].value:"")+"\n");
                    }
                    if(i==arr.length-1)
                    {
                        str=str.replace(/(\n+)$/,"");
                    }
                }
                state.interface.param[state.index].headerRawStr=str;
            }
        },
        toggleBody:function (state) {
            if(state.interface.param[state.index].bodyRawShow)
            {
                state.interface.param[state.index].bodyRawShow=0;
                var str=$.trim(state.interface.param[state.index].bodyRawStr);
                var arr=[];
                var param1=str.split("&");
                for(var i=0;i<param1.length;i++)
                {
                    if(!param1[i])
                    {
                        continue;
                    }
                    var param2=param1[i].split("=");
                    if(param2.length>0)
                    {
                        var valueObj=helper.findValue(state.interface.param[state.index].body,param2[0]);
                        var selValue=param2[1]?decodeURIComponent(param2[1]):""
                        if(valueObj && valueObj.type!=1)
                        {
                            valueObj.selValue=selValue;
                        }
                        arr.push({
                            name:decodeURIComponent(param2[0]),
                            type:valueObj?valueObj.type:(selValue=="[FILE]"?1:0),
                            must:valueObj?valueObj.must:1,
                            remark:valueObj?valueObj.remark:"",
                            selValue:selValue,
                            enable:valueObj?valueObj.enable:1,
                            value:valueObj?valueObj.value:null,
                            encrypt:(valueObj && valueObj.encrypt)?valueObj.encrypt:{
                                type:"",
                                salt:"",
                                key:0
                            }
                        })
                    }
                }
                arr.push(
                    {
                        name:"",
                        type:0,
                        must:0,
                        remark:"",
                        value:"",
                        selValue:"",
                        enable:1
                    }
                )
                state.interface.param[state.index].body=arr;
            }
            else
            {
                state.interface.param[state.index].bodyRawShow=1;
                var str="",arr=state.interface.param[state.index].body;
                for(var i=0;i<arr.length;i++)
                {
                    if(arr[i].name)
                    {
                        str+=(arr[i].name+"="+(arr[i].type==1?"[FILE]":encodeURIComponent(arr[i].selValue))+"&")
                    }
                    if(i==arr.length-1)
                    {
                        str=str.replace(/(\&+)$/,"");
                    }
                }
                state.interface.param[state.index].bodyRawStr=str;
            }
        },
        changeMethod:function (state) {
            if(state.interface.method=="POST" || state.interface.method=="PUT" || state.interface.method=="PATCH")
            {
                state.interface.param.forEach(function (obj,index) {
                    if(obj.header.length==1 && !obj.header[0].name)
                    {
                        obj.header[0].name="Content-Type";
                        obj.header[0].value="application/x-www-form-urlencoded"
                    }
                    else
                    {
                        var bFind=false;
                        for(var i=0;i<obj.header.length;i++)
                        {
                            var obj1=obj.header[i];
                            if(obj1.name=="Content-Type")
                            {
                                bFind=true;
                                break;
                            }
                        }
                        if(!bFind)
                        {
                            obj.header.push({
                                name:"Content-Type",
                                value:"application/x-www-form-urlencoded",
                                remark:""
                            })
                        }
                    }
                    if(!obj.bodyInfo)
                    {
                        obj.bodyInfo={
                            type:0,
                            rawType:0,
                            rawTextRemark:"",
                            rawFileRemark:"",
                            rawText:"",
                            rawJSON:[],
                            rawJSONType:0
                        }
                    }
                })
            }
            else
            {
                state.interface.param.forEach(function (obj,index) {
                    for(var i=0;i<obj.header.length;i++)
                    {
                        var obj1=obj.header[i];
                        if(obj1.name=="Content-Type")
                        {
                            if(obj.header.length>1)
                            {
                                obj.header.splice(i,1);
                            }
                            else
                            {
                                obj.header[0].name="";
                                obj.header[0].value="";
                                obj.header[0].remark="";
                            }
                            break;
                        }
                    }
                })
            }
        },
        changeUrl:function (state,val) {
            if(val)
            {
                var arrParam=[];
                var arr=val.match(/\{([^\s|\}|\{]+?)\}(?!\})/g);
                if(arr)
                {
                    for(var i=0;i<arr.length;i++)
                    {
                        var str=arr[i].substr(1,arr[i].length-2);
                        var bFind=false;
                        for(var j=0;j<state.interface.param[state.index].param.length;j++)
                        {
                            if(str==state.interface.param[state.index].param[j].name)
                            {
                                bFind=true;
                                arrParam.push(state.interface.param[state.index].param[j]);
                                break;
                            }
                        }
                        if(!bFind)
                        {
                            arrParam.push({
                                name:str,
                                remark:"",
                                value:{
                                    type:0,
                                    status:"",
                                    data:[]
                                }
                            })
                        }
                    }
                }
                state.interface.param.forEach(function (obj,index) {
                    obj.param=arrParam;
                })
            }
        },
        setBaseUrl:function (state,val) {
            state.baseUrl=val;
        },
    },
    actions:{
        run:function (context) {
            var method=context.state.interface.method;
            var baseUrl=$.trim(context.state.baseUrl);
            var path=$.trim(context.state.interface.url);
            var globalVar={};
            context.state.baseUrls.forEach(function (obj) {
                if(obj.url==baseUrl && obj.env)
                {
                    obj.env.forEach(function (obj) {
                        globalVar[obj.key]=obj.value;
                    })
                }
            })
            if(!method || !baseUrl || !path)
            {
                return new Promise(function (resolve,reject) {
                    var obj={};
                    obj.code=0;
                    obj.msg="方法，url和路由地址不能为空!"
                    resolve(obj)
                });
            }
            var bMock=false;
            if(baseUrl!="MockServer")
            {
                var indexHttp=baseUrl.indexOf("://"),indexSlash;
                if(indexHttp==-1)
                {
                    indexSlash=baseUrl.indexOf("/")
                }
                else
                {
                    indexSlash=baseUrl.indexOf("/",indexHttp+3);
                }
                if(indexSlash>-1)
                {
                    var baseUrlTemp=baseUrl.substring(0,indexSlash);
                    var pathTemp=baseUrl.substr(indexSlash);
                    if(pathTemp[pathTemp.length-1]=="/" && path[0]=="/")
                    {
                        pathTemp=pathTemp.substr(0,pathTemp.length-1);
                    }
                    else if(pathTemp[pathTemp.length-1]!="/" && path[0]!="/" && pathTemp.indexOf("?")==-1 && pathTemp.indexOf("#")==-1)
                    {
                        pathTemp+="/"
                    }
                    baseUrl=baseUrlTemp;
                    path=pathTemp+path;
                }
                else
                {
                    if(path[0]!="/")
                    {
                        path="/"+path;
                    }
                }
            }
            else
            {
                bMock=true;
                baseUrl=config.baseUrl;
                path="/mock/"+session.get("projectId")+(session.get("versionId")?session.get("versionId"):"")+(path[0]!="/"?("/"+path):path);
            }
            path=helper.handleGlobalVar(path,globalVar);
            if(path.substr(0,2)=="//")
            {
                path=path.substr(1);
            }
            var param={};
            context.getters.param.forEach(function (obj) {
                param[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
            })
            var query={};
            context.getters.querySave.forEach(function (obj) {
                if(obj.encrypt && obj.encrypt.type)
                {
                    var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.selValue,globalVar),obj.encrypt.salt);
                    var key=obj.name;
                    if(obj.encrypt.key)
                    {
                        key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
                    }
                    query[key]=value;
                }
                else
                {
                    query[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
                }

            })
            var header={},arrHeaders=["host","connection","origin","referer","user-agent","cookie"],objHeaders={};
            context.getters.headerSave.forEach(function (obj) {
                if(obj.encrypt && obj.encrypt.type)
                {
                    var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.value,globalVar),obj.encrypt.salt);
                    var key=obj.name;
                    if($.inArr(key,arrHeaders))
                    {
                        objHeaders[key]=value;
                    }
                    else
                    {
                        header[key]=value;
                    }

                }
                else
                {
                    if($.inArr(obj.name,arrHeaders))
                    {
                        objHeaders[obj.name]=helper.handleGlobalVar(obj.value,globalVar);
                    }
                    else
                    {
                        header[obj.name]=helper.handleGlobalVar(obj.value,globalVar);
                    }

                }
            })
            var body={},bUpload=false;
            if(method=="POST" || method=="PUT" || method=="PATCH")
            {
                if(context.getters.curParam.bodyInfo.type==0)
                {
                    var arr=document.getElementById("bodyTable").querySelectorAll("[custom]");
                    context.getters.bodySave.forEach(function (obj,index) {
                        if(obj.type==0)
                        {
                            if(obj.encrypt && obj.encrypt.type)
                            {
                                var value=helper.encrypt(obj.encrypt.type,helper.handleGlobalVar(obj.selValue,globalVar),obj.encrypt.salt);
                                var key=obj.name;
                                if(obj.encrypt.key)
                                {
                                    key=helper.encrypt(obj.encrypt.type,key,obj.encrypt.salt);
                                }
                                body[key]=value;
                            }
                            else
                            {
                                body[obj.name]=helper.handleGlobalVar(obj.selValue,globalVar);
                            }
                        }
                        else if(obj.type==1)
                        {
                            if(arr[index].files.length>0)
                            {
                                if(obj.encrypt && obj.encrypt.type && obj.encrypt.key)
                                {
                                    var key=helper.encrypt(obj.encrypt.type,obj.name,obj.encrypt.salt);
                                    body[key]=arr[index].files[0];
                                }
                                else
                                {
                                    body[obj.name]=arr[index].files[0];
                                }
                                bUpload=true;
                            }
                            else
                            {
                                if(obj.encrypt && obj.encrypt.type && obj.encrypt.key)
                                {
                                    var key=helper.encrypt(obj.encrypt.type,obj.name,obj.encrypt.salt);
                                    body[key]="";
                                }
                                else
                                {
                                    body[obj.name]="";
                                }

                            }
                        }
                    })
                }
                else
                {
                    if(context.getters.curParam.bodyInfo.rawType==0)
                    {
                        var encryptType=context.getters.curParam.encryptType;
                        if(encryptType)
                        {
                            body=helper.encrypt(encryptType,helper.handleGlobalVar(context.getters.curParam.bodyInfo.rawText,globalVar),document.getElementById("bodyRawEncryptSalt").querySelector("input").value)
                        }
                        else
                        {
                            body=helper.handleGlobalVar(context.getters.curParam.bodyInfo.rawText,globalVar);
                        }
                    }
                    else if(context.getters.curParam.bodyInfo.rawType==2)
                    {
                        var obj=context.getters.curParam.bodyInfo.rawJSONType==0?{}:[];
                        var result=helper.resultSave(context.getters.curParam.bodyInfo.rawJSON,0,globalVar);
                        helper.convertToJSON(result,obj,null,1);
                        body=obj;
                    }
                    else
                    {
                        if(!context.getters.curParam.fileResult)
                        {
                            return new Promise(function (resolve,reject) {
                                var obj={};
                                obj.code=0;
                                obj.msg="上传内容不能为空！";
                                resolve(obj)
                            });
                        }
                        body=context.getters.curParam.fileResult;
                    }
                }
            }

            if(context.getters.curParam.before.mode==0)
            {
                if(context.state.before)
                {
                    helper.runBefore(context.state.before,baseUrl,path,method,query,header,body,param)
                }
                helper.runBefore(context.getters.curParam.before.code,baseUrl,path,method,query,header,body,param)
            }
            else
            {
                helper.runBefore(context.getters.curParam.before.code,baseUrl,path,method,query,header,body,param)
            }
            for(var paramKey in param)
            {
                path=path.replace("{"+paramKey+"}",param[paramKey])
            }
            if((method=="POST" || method=="PUT" || method=="PATCH") && context.getters.curParam.bodyInfo.type==1 && context.getters.curParam.bodyInfo.rawType==2)
            {
                body=JSON.stringify(body);
            }
            query=$.param(query);
            if(query.length>0)
            {
                path=path+"?"+query;
            }
            header["url-doclever"]=baseUrl;
            header["path-doclever"]=path;
            header["method-doclever"]=method;
            header["user-doclever"]=session.get("id");
            header["headers-doclever"]=JSON.stringify(objHeaders);
            var proxyUrl="/proxy";
            var bNet=false;
            if(!bMock && session.get("proxy"))
            {
                bNet=true;
                proxyUrl="http://127.0.0.1:36742";
            }
            var startDate=new Date();
            var bContent=false,contentKey;
            for(var key in header)
            {
                if(key.toLowerCase()=="content-type")
                {
                    bContent=true;
                    contentKey=key;
                    if(/multipart\/form-data/i.test(header[contentKey]))
                    {
                        bUpload=true;
                    }
                    break
                }
            }
            context.getters.curParam.resultData="";
            var func;
            if(bUpload || context.getters.curParam.bodyInfo.type==1)
            {
                if(bContent && context.getters.curParam.bodyInfo.type==0)
                {
                    delete header[contentKey];
                }
                func=net.upload("POST",proxyUrl,body,header,null,1,bNet)
            }
            else
            {
                func=net.post(proxyUrl,body,header,null,1,bNet)
            }
            return func.then(function (result) {
                context.getters.curParam.run=1;
                context.getters.curParam.reqHeader=result.header["doclever-request"]?JSON.parse(result.header["doclever-request"]):{};
                delete result.header["doclever-request"];
                context.getters.curParam.resHeader=result.header;
                context.getters.curParam.status=String(result.status);
                context.getters.curParam.second=(((new Date())-startDate)/1000).toFixed(3);
                context.getters.curParam.type=typeof (result.data);
                if(context.getters.curParam.after.mode==0)
                {
                    if(context.state.after)
                    {
                        helper.runAfter(context.state.after,result.status,result.header,result.data)
                    }
                    helper.runAfter(context.getters.curParam.after.code,result.status,result.header,result.data)
                }
                else
                {
                    helper.runAfter(context.getters.curParam.after.code,result.status,result.header,result.data)
                }
                if(context.getters.curParam.type=="object" && !(result.data instanceof Blob))
                {
                    context.getters.curParam.type="object"
                    context.getters.curParam.resultData=result.data;
                    context.getters.curParam.rawData=JSON.stringify(result.data);
                    var outParam=helper.resultSave(context.getters.curParam.result)
                    context.getters.curParam.draw=helper.format(context.getters.curParam.rawData,0,outParam,context.state.status).draw;
                    var obj=helper.format(context.getters.curParam.rawData,1,outParam,context.state.status);
                    context.getters.curParam.drawMix=obj.draw
                    context.getters.curParam.errorCount=obj.error;
                }
                else if(result.header["content-type"] && result.header["content-type"].indexOf("image/")>-1)
                {
                    if(context.getters.curParam.imgUrl)
                    {
                        $.revokeUrlObject(context.getters.curParam.imgUrl);
                        context.getters.curParam.imgUrl=""
                    }
                    context.getters.curParam.type="img";
                    context.getters.curParam.rawData="";
                    context.getters.curParam.imgUrl=$.createUrlObject(result.data);
                    context.getters.curParam.errorCount=0;
                }
                else if(result.header["content-type"] && result.header["content-type"].indexOf("/html")>-1)
                {
                    context.getters.curParam.type="html";
                    context.getters.curParam.rawData=result.data;
                    context.getters.curParam.draw=result.data
                    context.getters.curParam.drawMix=result.data;
                    context.getters.curParam.errorCount=0;
                }
                else
                {
                    if(result.header["content-type"]===undefined || (result.header["content-type"] && result.header["content-type"].indexOf("/xml")==-1))
                    {
                        var ele=document.createElement("div");
                        ele.innerHTML=result.data;
                        if(ele.childNodes.length>1 || (ele.childNodes.length>0 && ele.childNodes[0].nodeType==1))
                        {
                            context.getters.curParam.type="html";
                        }
                    }
                    context.getters.curParam.rawData=result.data;
                    context.getters.curParam.draw=result.data
                    context.getters.curParam.drawMix=result.data;
                    context.getters.curParam.errorCount=0;
                }
                return {
                    code:200
                }
            })
        },
        initBaseUrl:function (context) {
            context.commit("setBaseUrl",context.state.baseUrls.length>0?context.state.baseUrls[0].url:"");
        },
        initData:function (context,data) {
            context.state.interface=data;
            context.state.interface.param.forEach(function (obj) {
                var objKey={
                    fileResult:"",
                    resHeader:[],
                    reqHeader:{},
                    status:"",
                    second:"",
                    draw:[],
                    drawMix:[],
                    type:"object",
                    imgUrl:"",
                    resultData:"",
                    queryRawShow:0,
                    headerRawShow:0,
                    bodyRawShow:0,
                    queryRawStr:"",
                    headerRawStr:"",
                    bodyRawStr:"",
                    rawData:"",
                    encryptType:"",
                    errorCount:0,
                    run:0
                }
                for(var key in objKey)
                {
                    Vue.set(obj,key,objKey[key]);
                }
                if(obj.query.length>0)
                {
                    for(var i=0;i<obj.query.length;i++)
                    {
                        Vue.set(obj.query[i],"enable",1);
                        Vue.set(obj.query[i],"selValue","");
                        if(obj.query[i].value && obj.query[i].value.type==0 && obj.query[i].value.data.length>0)
                        {
                            obj.query[i].selValue=obj.query[i].value.data[0].value;
                        }
                        else if(obj.query[i].value && obj.query[i].value.type==1 && obj.query[i].value.status)
                        {
                            var objStatus=null;
                            context.state.status.forEach(function (obj1) {
                                if(obj1.id==obj.query[i].value.status)
                                {
                                    objStatus=obj1;
                                }
                            })
                            if(objStatus && objStatus.data.length>0)
                            {
                                obj.query[i].selValue=objStatus.data[0].key;
                            }
                            else
                            {
                                obj.query[i].selValue="";
                            }
                        }
                        else
                        {
                            obj.query[i].selValue="";
                        }

                    }
                }
                if(obj.body.length>0)
                {
                    for(var i=0;i<obj.body.length;i++)
                    {
                        Vue.set(obj.body[i],"enable",1);
                        Vue.set(obj.body[i],"selValue","");
                        if(obj.body[i].value && obj.body[i].value.type==0 && obj.body[i].value.data.length>0)
                        {
                            obj.body[i].selValue=obj.body[i].value.data[0].value;
                        }
                        else if(obj.body[i].value && obj.body[i].value.type==1 && obj.body[i].value.status)
                        {
                            var objStatus=null;
                            context.state.status.forEach(function (obj1) {
                                if(obj1.id==obj.body[i].value.status)
                                {
                                    objStatus=obj1;
                                }
                            })
                            if(objStatus && objStatus.data.length>0)
                            {
                                obj.body[i].selValue=objStatus.data[0].key;
                            }
                            else
                            {
                                obj.body[i].selValue="";
                            }
                        }
                        else
                        {
                            obj.body[i].selValue="";
                        }

                    }
                }
                if(obj.param.length>0)
                {
                    for(var i=0;i<obj.param.length;i++)
                    {
                        Vue.set(obj.param[i],"selValue","");
                        if(obj.param[i].value && obj.param[i].value.type==0 && obj.param[i].value.data.length>0)
                        {
                            obj.param[i].selValue=obj.param[i].value.data[0].value;
                        }
                        else if(obj.param[i].value && obj.param[i].value.type==1 && obj.param[i].value.status)
                        {
                            var objStatus=null;
                            context.state.status.forEach(function (obj1) {
                                if(obj1.id==obj.param[i].value.status)
                                {
                                    objStatus=obj1;
                                }
                            })
                            if(objStatus && objStatus.data.length>0)
                            {
                                obj.param[i].selValue=objStatus.data[0].key;
                            }
                            else
                            {
                                obj.param[i].selValue="";
                            }
                        }
                        else
                        {
                            obj.param[i].selValue="";
                        }

                    }
                }
                Vue.set(obj,"selParam",$.clone(obj));
                Vue.set(obj,"selExample",{
                    id:"",
                    value:"无运行实例"
                });
                Vue.set(obj,"initParam",$.clone(obj));
            })
            context.dispatch("initBaseUrl");
        },
        changeExample:function (context,id) {
            if(id)
            {
                return net.get("/example/item",{
                    id:id
                }).then(function (data) {
                    if(data.code==200)
                    {
                        var obj={
                            query:data.data.param.query,
                            header:data.data.param.header,
                            body:data.data.param.body?data.data.param.body:[{
                                name:"",
                                type:0,
                                must:0,
                                remark:"",
                            }],
                            param:data.data.param.param,
                            bodyInfo:data.data.param.bodyInfo?data.data.param.bodyInfo:{
                                type:0,
                                rawType:0,
                                rawTextRemark:"",
                                rawFileRemark:"",
                                rawText:"",
                                rawJSON:[],
                                rawJSONType:0
                            },
                            rawJSONObject:[{
                                name:"",
                                must:1,
                                type:0,
                                remark:"",
                                show:1,
                                mock:"",
                                drag:1
                            }],
                            rawJSONArray:[{
                                name:null,
                                must:1,
                                type:0,
                                remark:"",
                                show:1,
                                mock:"",
                                drag:1
                            }],
                            before:data.data.param.before,
                            after:data.data.param.after,
                            fileResult:"",
                            resHeader:[],
                            reqHeader:{},
                            status:"",
                            second:"",
                            draw:[],
                            drawMix:[],
                            type:"object",
                            imgUrl:"",
                            resultData:"",
                            queryRawShow:0,
                            headerRawShow:0,
                            bodyRawShow:0,
                            queryRawStr:"",
                            headerRawStr:"",
                            bodyRawStr:"",
                            rawData:"",
                            encryptType:"",
                            errorCount:0,
                            run:0
                        }
                        for(var key in obj)
                        {
                            Vue.set(context.getters.curParam,key,obj[key]);
                        }
                        if(context.getters.curParam.bodyInfo.rawJSON.length==0)
                        {
                            context.getters.curParam.bodyInfo.rawJSON=context.getters.curParam.rawJSONObject;
                        }
                        var param=data.data.param;
                        if(param.type=="object")
                        {
                            param.draw=helper.format(param.rawData,0,[],context.state.status).draw;
                        }
                        else
                        {
                            param.draw=param.rawData;
                        }
                        Vue.set(context.getters.curParam,"selParam",$.clone(data.data.param));
                        Vue.set(context.getters.curParam,"selExample",{
                            id:data.data._id,
                            value:data.data.name
                        });
                    }
                    return data;
                })
            }
            else
            {
                var obj=$.clone(context.getters.curParam.initParam);
                for(var key in obj)
                {
                    Vue.set(context.getters.curParam,key,obj[key]);
                }
                return new Promise(function (resolve,reject) {
                    setTimeout(function () {
                        resolve({
                            code:200
                        })
                    },200);
                })
            }
        },
    }
})








