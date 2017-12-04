import React, { Component } from "react";
import PropTypes from "prop-types";
import FetchStatus from '../fetch-status';
import {
    LoadingView,
    FailureView,
    ErrorView,
    NullDataView,
} from './fetchView';
import {libraryConfig} from "../libraryConfig";



const stateHOC = (initHocParams = {})=>{
    const hocParams = Object.assign({}, {
        LoadingView,
        FailureView,
        ErrorView,
        NullDataView,
    }, initHocParams)
    return (WrappedComponent)=>{
        return class StateContainer extends WrappedComponent {
            static navigationOptions = WrappedComponent.navigationOptions;
            static propTypes = {

            };
            static defaultProps = {

            };
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
                } = hocParams

                const LoadingViewStyle = Object.assign({},{
                    autoLayout : height==undefined?true:false,
                    height,
                })

                switch (fetchStatus) {
                    case FetchStatus.l:
                        return  (
                            <LoadingView
                                {...LoadingViewStyle}
                            />
                        )
                    case FetchStatus.s:

                        if(super.hocNullDataFunc&&super.hocNullDataFunc()){
                            return  <NullDataView {...LoadingViewStyle}/>
                        }else {
                            return <WrappedComponent {...this.props} stateHOCState={this.state}/>
                        }

                    case FetchStatus.f:
                        return  <FailureView {...LoadingViewStyle}/>
                    case FetchStatus.e:
                        return  <ErrorView {...LoadingViewStyle}/>
                    default :
                        return null
                }
            }
        }
    }
}

export default stateHOC
