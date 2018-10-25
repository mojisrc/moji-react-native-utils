import React, { Component } from "react";
import FetchStatus from '../fetchStatus';
import {
    Loading,
    Failure,
    Error,
    Null,
    Login,
} from './fetchView';
import { config } from "../config";


const stateHOC = (initHocParams = {}) => {
    const hocParams = Object.assign({}, {
        LoadingView: Loading,
        FailureView: Failure,
        ErrorView: Error,
        NullDataView: Null,
        LoginView: Login,
        detail: false,
        needLogin: false,
    }, initHocParams)
    return (WrappedComponent) => {
        return class StateContainer extends WrappedComponent {
            static propTypes = {};
            static defaultProps = {};
            refresh = () => {
                super.hocComponentDidMount && super.hocComponentDidMount()
            }

            componentDidMount() {
                super.hocComponentDidMount && super.hocComponentDidMount()
            }

            render() {

                const {
                    fetchStatus,
                } = this.props

                const {
                    detail,
                } = hocParams

                if (detail) {

                    const key = super.hocDetailKey && super.hocDetailKey()

                    if (!key) {
                        config.ToastError('装饰器参数传递错误')
                        return null
                    }

                    return this.showView(fetchStatus[key])

                } else {
                    return this.showView(fetchStatus)
                }
            }

            showView(fetchStatus) {

                const {
                    height,
                    LoadingView,
                    FailureView,
                    ErrorView,
                    NullDataView,
                    LoginView,
                    needLogin,
                } = hocParams

                const layoutStyle = Object.assign({}, {
                    autoLayout: height === undefined,
                    height,
                })

                if (needLogin) {
                    const {
                        login
                    } = this.props
                    if (!login) {
                        return (
                            <LoginView
                                {...layoutStyle}
                                pushLogin={() => {
                                    config.pushLogin()
                                }}
                            />
                        )
                    }
                }

                switch (fetchStatus) {
                    case FetchStatus.l:
                        return (
                            <LoadingView
                                {...layoutStyle}
                            />
                        )
                    case FetchStatus.s:

                        if (super.hocNullData && super.hocNullData()) {
                            return <NullDataView {...layoutStyle} />
                        } else {
                            return <WrappedComponent {...this.props} stateHOCState={this.state} />
                        }

                    case FetchStatus.f:
                        return <FailureView {...layoutStyle} refresh={this.refresh} />
                    case FetchStatus.e:
                        return <ErrorView {...layoutStyle} refresh={this.refresh} />
                    default :
                        return null
                }
            }
        }
    }
}

export default stateHOC
