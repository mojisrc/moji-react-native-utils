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
            url,
        } = api
        return fetch(url + "?" + toQueryString(params), {
            method: "GET",
            headers: Object.assign({}, getHeaders(), { "Content-Type": "application/x-www-form-urlencoded" }),
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
            url,
        } = api
        return fetch(url, {
            method: "POST",
            headers: Object.assign({}, getHeaders(), { "Content-Type": "application/json" }),
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
            app,
            removeUserInfoFunc,
            Toast,
            Modal,
            hideLoading,
        } = config
        const {
            env
        } = app
        if (api.showLoading) {
            hideLoading()
        }
        if (!res.ok) {
            if (env.showNetWorkErrorInfo) {
                res.text()
                    .then(errmsg => {
                        Modal.alert(
                            "接口请求错误", `接口名:${api.url}`,
                            [
                                {
                                    text: "上报接口异常",
                                    onPress: () => {
                                        this.errorApiFetch({
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
                    this.errorApiFetch({
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
                        if (typeof res['errcode'] !== "undefined") {
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
    static errorApiFetch({ api, errmsg, params }) {
        const {
            app,
        } = config


        fetch(app.errorCollectApi, {
            method: "POST",
            // 临时写
            headers: { "Content-Type": "application/json" },
            body: toQueryString({
                project: `${app.name}${app.platform}端`,
                server_return: errmsg,
                api_address: `${api.method}:${api.url}?${toQueryString(params)}`,
            })
        })
            .then(res => {
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
