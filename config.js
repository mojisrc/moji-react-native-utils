let config = {
    app: {
        name: null,
        env: null,
        platform: null,
        errorCollectApi: null
    },
    Modal: {
        alert: (e) => {
            console.warn(e)
        }
    },
    ToastInfo: (content, duration, onClose, mask) => {
        alert('未设置 ToastInfo 方法')
    },
    ToastError: (content, duration, onClose, mask) => {
        alert('未设置 ToastError 方法')
    },
    ToastWarn: (content, duration, onClose, mask) => {
        alert('未设置 ToastWarn 方法')
    },
    getLogin: () => {
        alert('未设置 getLogin 方法')
    },
    pushLogin: () => {
        alert('未设置 pushLogin 方法')
    },
    removeUserInfo: () => {
        alert('未设置 removeUserInfo 方法')
    },
    showLoading: () => {
        alert('未设置 showLoading 方法')
    },
    hideLoading: () => {
        alert('未设置 hideLoading 方法')
    },
    getHeaders: () => {
        alert('未设置 getHeaders 方法')
    },
}

const initLibraryConfig = (e = {}) => {
    return config = Object.assign({}, config, e)
}


export {
    config,
    initLibraryConfig
}
