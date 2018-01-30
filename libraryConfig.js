
let libraryConfig = {
    ToastInfo: (content, duration, onClose, mask)=>{
        alert('未设置 ToastInfo 方法')
    },
    ToastError: (content, duration, onClose, mask)=>{
        alert('未设置 ToastError 方法')
    },
    ToastWarn: (content, duration, onClose, mask)=>{
        alert('未设置 ToastWarn 方法')
    },
    API_URL: null,
    getLoginFunc:()=>{
        alert('未设置 getLoginFunc 方法')
    },
    pushLoginFunc:()=>{
        alert('未设置 pushLoginFunc 方法')
    },
    APP_ROOT_CONFIG:null,
    removeUserInfoFunc:()=>{
        alert('未设置 removeUserInfoFunc 方法')
    },
    showLoading: ()=>{
        alert('未设置 showLoading 方法')
    },
    hideLoading: ()=>{
        alert('未设置 hideLoading 方法')
    },
    getHeadersFunc:()=>{
        alert('未设置 getHeadersFunc 方法')
    },
}

const initLibraryConfigFunc = (e={})=>{
    libraryConfig = Object.assign({},libraryConfig,e)
}


export{
    libraryConfig,
    initLibraryConfigFunc
}
