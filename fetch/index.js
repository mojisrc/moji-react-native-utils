// import { API_URL } from "./APP_ROOT_NETWORK_CONFIG";
// import { errorHandler, addNetInfoListener } from "./errorHandler";
import {
    Platform,
    Alert,
    InteractionManager,
    Linking,
} from "react-native";
// import {
//     AppName,
//     AppPlatform,
//     errorCollectApi,
//     env,
//     developer,
// } from "./APP_ROOT_CONFIG";


import {libraryConfig} from "../libraryConfig"



export default class FetchDataModule {
    /*
     *  请求入口
    */
    static fetch({ApiName, params}) {
        const {
            API_URL,
            getLoginFunc,
            pushLoginFunc,
        } = libraryConfig
        const login = getLoginFunc()
        if (ApiName) {
            if (API_URL[ApiName].needLogin) {
                if (login) {
                    return this.fetchData(ApiName, params);
                } else {
                    return new Promise(() => {
                        pushLoginFunc()
                    })
                }
            } else {
                return this.fetchData({ApiName, params})
            }
        } else {
            Alert.alert("FetchDataModule模块调用异常，请检查传递参数");
        }
    }

    /*
     *  处理请求的接口
    */
    static fetchData({ApiName, params}) {
        const {
            API_URL,
            showLoading,
        } = libraryConfig
        if (API_URL[ApiName].showLoading) {
            showLoading()
        }
        if (API_URL[ApiName].method == "GET") {
            return this.get({ApiName, params});
        } else if (API_URL[ApiName].method == "POST") {
            return this.post({ApiName, params});
        } else {
            Alert.alert("接口预定义信息错误", `接口名:${ApiName}${"\b"}错误类型:请求方式异常`, [
                {
                    text: "查看接口描述",
                    onPress: () => {
                        console.warn(
                            `接口预定义信息错误的接口描述:${API_URL[ApiName].remark}`
                        );
                    }
                },
                {
                    text: "查看接口地址",
                    onPress: () => {
                        console.warn(
                            `接口预定义信息错误的接口地址:${API_URL[ApiName].fetchUrl}`
                        );
                    }
                },
                {
                    text: "确定",
                    onPress: () => {
                        console.warn("请处理错误接口");
                    }
                }
            ]);
        }
    }

    /*
     *  GET请求
    */
    static get({ApiName, params}) {

        const {
            API_URL,
            getHeadersFunc,
        } = libraryConfig

        return fetch(API_URL[ApiName].fetchUrl + "?" + toQueryString(params), {
            method: "GET",
            headers: getHeadersFunc()
        })
        .then(res => {
            return this.HandleRequestResults({
                res,
                ApiName,
                params
            })
        })
    }

    /*
     *  POST请求
    */
    static post(ApiName, params) {

        const {
            API_URL,
            getHeadersFunc,
        } = libraryConfig

        return fetch(API_URL[ApiName].fetchUrl, {
            method: "POST",
            headers: getHeadersFunc(),
            body: JSON.stringify(params)
        })
        .then(res => {
            return this.HandleRequestResults({
                res,
                ApiName,
                params
            })
        })
    }

    /*
     *  处理请求结果
     *  res.headers.map['content-type'][0]                      非debug
     *  res._bodyBlob.type                                      debug
    */
    static HandleRequestResults({res, ApiName, params}) {

        const {
            API_URL,
            hideLoading,
            APP_ROOT_CONFIG,
            ToastError,
            removeUserInfoFunc,
        } = libraryConfig

        const {
            env
        } = APP_ROOT_CONFIG

        if (API_URL[ApiName].showLoading) {
            hideLoading()
        }

        if (res.headers.map["content-type"][0] != `application/json; charset=utf-8`) {
            if(env.showNetWorkErrorInfo){
                res.text()
                .then(err => {
                    setTimeout(()=>{
                        Alert.alert(
                            "接口请求错误", `接口名:${API_URL[ApiName].apiUrl}`,
                            [
                                {
                                    text: "上报接口异常",
                                    onPress: () => {
                                        this.ErrorApiFetch({
                                            ApiName,
                                            errmsg: err,
                                            params
                                        })
                                    }
                                },
                                { text: "查看报错信息", onPress: () => console.warn(err) },
                                { text: "确定", onPress: () => {} }
                            ]
                        );
                    },API_URL[ApiName].showLoading?1000:1)
                });
            }
            if(env.defaultUploadNetWorkErrorInfo){
                ToastError("捕获到服务器返回数据类型异常，正在自动提交错误信息");
                res.text().then(e => {
                    this.ErrorApiFetch({ApiName, errmsg: e, params})
                });
            }
            return new Promise(() => {})
        } else {
            return res
                .json()
                .then(res => {
                    return new Promise((resolve,reject) => {
                        if (res.errcode != -999) {
                            resolve(res);
                        } else {
                            reject(res)
                            ToastError("token验证异常，请重新登录");
                            removeUserInfoFunc()
                        }
                    });
                })
        }
    }

    /*
     *  微信专用请求
    */
    static wechat(url, params, callback) {
        return fetch(url + "?" + toQueryString(params), {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
        .then(res => res.json())
        .then(data => {
            return new Promise(resolve=>resolve(data))
        })
    }

    /*
     *  请求错误处理
    */
    static ErrorApiFetch({ApiName, errmsg, params}) {
        const {
            API_URL,
            APP_ROOT_CONFIG,
            ToastError,
            getHeadersFunc,
            ToastWarn,
            ToastInfo,
        } = libraryConfig
        const {
            developer,
            errorCollectApi,
            AppName,
            AppPlatform,
        } = APP_ROOT_CONFIG

        const errorApiDeveloper = developerVerification({
            developerName: API_URL[ApiName].developer,
            developer,
            ToastError,
        })

        fetch(errorCollectApi, {
            method: "POST",
            headers: getHeadersFunc(),
            body: toQueryString({
                project: `${AppName}${AppPlatform}端`,
                post_author: errorApiDeveloper.name,
                server_return: errmsg,
                api_address: `${API_URL[ApiName].method}:${API_URL[ApiName].fetchUrl}?${toQueryString(params)}`,
                api_author: API_URL[ApiName].author
            })
        })
        .then(res => {
            if (res.headers.map["content-type"][0] != `application/json; charset=utf-8`) {
                Alert.alert("提交错误的接口都报错了", `肿么办ﾍ(;´Д｀ﾍ)`, [
                    {
                        text: "GG",
                        onPress: () => {ToastWarn('你选择了GG')}
                    },{
                        text: "人肉联系开发人员",
                        onPress: () => {
                            Alert.alert(
                                `接口的使用者是 ${errorApiDeveloper.name}`,
                                '是否要拨打电话联系开发者',
                                [
                                    {
                                        text: '取消',
                                        onPress: () => {}
                                    },
                                    {
                                        text: '拨打',
                                        onPress: () => {
                                            Linking.openURL(`tel:${errorApiDeveloper.phone}`).catch(err => console.warn('拨打电话失败，请检查当前环境'));
                                        }
                                    },
                                ]
                            )
                        }
                    },{
                        text: "确定",
                        onPress: () => {}
                    }
                ]);
            }else {
                res.json()
                .then(e => {
                    ToastInfo("服务器异常提交成功");
                })
            }
        })
    }
}



// 获取开发者信息
const developerVerification = ({developerName,developer,ToastError})=>{
    if(developerName){
        if(developer.allDeveloper[developerName]){
            return developer.allDeveloper[developerName]
        }else {
            ToastError('检测到定义了错误的接口开发者，请审查APP_ROOT_NETWORK_CONFIG')
            return developer.main
        }
    }else {
        return developer.main
    }
}

function toQueryString(obj) {
    return obj
        ? Object.keys(obj)
              .sort()
              .map(function(key) {
                  var val = obj[key];
                  if (Array.isArray(val)) {
                      return val
                          .sort()
                          .map(function(val2) {
                              return encodeURIComponent(key) +
                                  "[]=" +
                                  encodeURIComponent(val2);
                          })
                          .join("&");
                  }
                  if (val) {
                      return encodeURIComponent(key) +
                          "=" +
                          encodeURIComponent(val);
                  } else {
                      return encodeURIComponent(key) + "=";
                  }
              })
              .join("&")
        : "";
}
