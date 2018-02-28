import React, { Component } from "react";
import PropTypes from "prop-types";
import FetchStatus from '../fetch-status';
import {
    LoadingView,
    FailureView,
    ErrorView,
    NullDataView,
    LoginView,
} from './fetchView';
import {libraryConfig} from "../libraryConfig";



const stateHOC = (initHocParams = {})=>{
    const hocParams = Object.assign({}, {
        LoadingView,
        FailureView,
        ErrorView,
        NullDataView,
        LoginView,
        detail:false,
        needLogin:false,
    }, initHocParams)
    return (WrappedComponent)=>{
        return class StateContainer extends WrappedComponent {
            static navigationOptions = WrappedComponent.navigationOptions;
            static propTypes = {

            };
            static defaultProps = {

            };
            refresh = ()=>{
                super.hocComponentDidMount && super.hocComponentDidMount()
            }
            componentDidMount(){
                super.hocComponentDidMount && super.hocComponentDidMount()
            }
            render() {

                const {
                    fetchStatus,
                } = this.props

                const {
                    detail,
                    keyFunc,
                    needLogin,
                } = hocParams

                if(detail){

                    const key = super.hocDetailKey&&super.hocDetailKey()

                    if(!key){
                        libraryConfig.ToastError('装饰器参数传递错误')
                        return null
                    }

                    return this.showView(fetchStatus[key])

                }else {
                    return this.showView(fetchStatus)
                }
            }
            showView(fetchStatus){

                const {
                    height,
                    LoadingView,
                    FailureView,
                    ErrorView,
                    NullDataView,
                    LoginView,
                    needLogin,
                } = hocParams

                const layoutStyle = Object.assign({},{
                    autoLayout : height==undefined?true:false,
                    height,
                })

                if(needLogin){
                    const {
                        login
                    } = this.props
                    if(!login){
                        return (
                            <LoginView
                                {...layoutStyle}
                                pushLoginFunc={()=>{
                                    libraryConfig.pushLoginFunc()
                                }}
                            />
                        )
                    }
                }

                switch (fetchStatus) {
                    case FetchStatus.l:
                        return  (
                            <LoadingView
                                {...layoutStyle}
                            />
                        )
                    case FetchStatus.s:

                        if(super.hocNullDataFunc&&super.hocNullDataFunc()){
                            return  <NullDataView {...layoutStyle}/>
                        }else {
                            return <WrappedComponent {...this.props} stateHOCState={this.state}/>
                        }

                    case FetchStatus.f:
                        return  <FailureView {...layoutStyle} refresh={this.refresh}/>
                    case FetchStatus.e:
                        return  <ErrorView {...layoutStyle} refresh={this.refresh}/>
                    default :
                        return null
                }
            }
        }
    }
}

export default stateHOC
