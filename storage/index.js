import {
    AsyncStorage
} from 'react-native';

export default class StorageModule {
    static getUserInfo() {
        return AsyncStorage.getItem('userInfo')
    }

    static setUserInfo(user) {
        return AsyncStorage.setItem('userInfo', JSON.stringify(user))
    }

    static removeUserInfo() {
        return AsyncStorage.removeItem('userInfo')
    }

    static set(key, value) {
        return AsyncStorage.setItem(key.toString(), value)
    }

    static get(e) {
        return AsyncStorage.getItem(e)
    }

    static remove(key) {
        return AsyncStorage.removeItem(key)
    }
}


/**
 * 本地存储的字段名称:
 * locationCity   [array]['储存用户的选择城市历史']
 */
