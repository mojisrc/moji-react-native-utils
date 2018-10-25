import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import{
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';


export default class Login extends Component{
    static propTypes = {
        height : PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string
        ]),
        autoLayout : PropTypes.bool,
    };
    static defaultProps = {
        height : '40%',
        autoLayout : false,
    };
    render() {
        const {autoLayout,height,pushLogin} = this.props
        return (
            <View
                style={[
                    styles.loaddingView,
                    autoLayout
                    ?   {
                            flex:1
                        }
                    :   {
                            height,
                        }
                ]}
            >
                <Text
                    onPress={()=>{
                        pushLogin()
                    }}
                >
                    需要登录
                </Text>
            </View>
        )
    }
}






const styles = StyleSheet.create({
    loaddingView:{
        justifyContent:'center',
        alignItems:'center',
    },
    loaddingImage:{

    },
})
