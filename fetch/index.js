import {
    Platform,
    Alert,
    InteractionManager,
    Linking,
} from "react-native";


import { config } from "../config"

export default class FetchDataModule {
    /*
     *  请求入口
    */
    static fetch({ api, params }) {
        const {
            getLogin,
            pushLogin,
        } = config
        const login = getLogin()
        if (api) {
            if (api.needLogin) {
                if (login) {
                    return this.fetchData({ api, params });
                } else {
                    return new Promise(() => {
                        pushLogin()
                    })
                }
            } else {
                return this.fetchData({ api, params })
            }
        } else {
            // noinspection JSAnnotator
            throw new 'params error : missing or error api'
        }
    }

    /*
    *  处理请求的接口
   */
    static fetchData({ api, params }) {
        const { showLoading, } = config
        if (api.showLoading) {
            showLoading()
        }
        if (api.method === "GET") {
            return this.get({ api, params })
        } else if (api.method === "POST") {
            return this.post({ api, params })
        } else {
            throw new `错误类型:请求方式异常，接口名:${api.url}`
        }
    }

    /*
    *  GET请求
   */
    static get({ api, params }) {
        const { getHeaders } = config
        const {
            mock,
            url,
            mockUrl,
        } = api
        return fetch(mock ? mockUrl : url + "?" + toQueryString(params), {
            method: "GET",
            headers: Object.assign({}, mock ? {} : getHeaders(), { "Content-Type": "application/x-www-form-urlencoded" }),
        })
            .then(res => {
                return this.handleRequestResults({
                    res,
                    api,
                    params,
                });
            })

    }

    /*
      *  POST请求
     */
    static post({ api, params }) {
        const { getHeaders } = config
        const {
            mock,
            url,
            mockUrl,
        } = api
        return fetch(mock ? mockUrl : url, {
            method: "POST",
            headers: Object.assign({}, mock ? {} : getHeaders(), { "Content-Type": "application/json" }),
            body: JSON.stringify(params)
        })
            .then(res => {
                return this.handleRequestResults({
                    res,
                    api,
                    params,
                });
            })
    }

    /*
    *  处理请求结果
   */
    static handleRequestResults({ res, api, params }) {
        const {
            APP_ROOT_CONFIG,
            removeUserInfoFunc,
            Toast,
            Modal,
            hideLoading,
        } = config
        const {
            env
        } = APP_ROOT_CONFIG
        if (api.showLoading) {
            hideLoading()
        }
        if (!res.ok) {
            if (env.showNetWorkErrorInfo) {
                res.text()
                    .then(errmsg => {
                        Modal.alert(
                            "接口请求错误", `接口名:${api.apiUrl}`,
                            [
                                {
                                    text: "上报接口异常",
                                    onPress: () => {
                                        this.ErrorApiFetch({
                                            api,
                                            errmsg,
                                            params,
                                        });
                                    }
                                },
                                { text: "查看报错信息", onPress: () => console.warn(errmsg) },
                                {
                                    text: "确定", onPress: () => {
                                    }
                                }
                            ]
                        );
                    });
            }
            if (env.defaultUploadNetWorkErrorInfo) {
                Toast.info('捕获到服务器返回数据类型异常，正在自动提交错误信息');
                res.text().then(errmsg => {
                    this.ErrorApiFetch({
                        api,
                        errmsg,
                        params,
                    });
                });
            }
            return new Promise((resolve, reject) => {
                reject()
            });
        } else {
            return res
                .json()
                .then(res => {
                    return new Promise(resolve => {
                        // 临时为了兼容项目整合
                        if(typeof res['errcode'] !== "undefined"){
                            res['code'] = res['errcode']
                        }
                        if (res.code !== -999) {
                            resolve(res);
                        } else {
                            Toast.error("token验证异常，请重新登录");
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
                return new Promise(resolve => resolve(data))
            })
    }

    /*
     *  请求错误处理
    */
    static ErrorApiFetch({ api, errmsg, params }) {
        const {
            APP_ROOT_CONFIG,
        } = config


        fetch(errorCollectApi, {
            method: "POST",
            headers: Object.assign({}, headers, { "Content-Type": "application/json" }),
            body: toQueryString({
                project: `${APP_ROOT_CONFIG.AppName}${APP_ROOT_CONFIG.AppPlatform}端`,
                server_return: errmsg,
                api_address: `${api.method}:${api.url}?${toQueryString(params)}`,
            })
        })
            .then(res => {
                if (!res.ok) {
                    throw `错误收集接口错误：${APP_ROOT_CONFIG.errorApiDeveloper.name}`
                } else {
                    res.json()
                        .then(e => {
                            Toast.info("异常提交成功");
                        })
                }
            })
    }
}

function toQueryString(obj) {
    return obj
        ? Object.keys(obj)
            .sort()
            .map(function (key) {
                var val = obj[key];
                if (Array.isArray(val)) {
                    return val
                        .sort()
                        .map(function (val2) {
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
