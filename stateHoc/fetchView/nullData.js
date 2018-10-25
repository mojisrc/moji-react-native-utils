import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import{
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';


export default class NullData extends Component{
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
        const {autoLayout,height} = this.props
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
                <Text>请求错误</Text>
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
