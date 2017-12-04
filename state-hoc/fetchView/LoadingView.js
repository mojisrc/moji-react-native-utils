import React,{ Component,PropTypes } from 'react';
import{
    StyleSheet,
    View,
    Image,
} from 'react-native';


export default class LoadingView extends Component{
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
                <Text>请求中</Text>
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
