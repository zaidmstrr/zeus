import * as React from 'react';
import { Alert, View } from 'react-native';
import { Header } from 'react-native-elements';
import { observer } from 'mobx-react';

import QRCodeScanner from './../components/QRCodeScanner';

import handleAnything from './../utils/handleAnything';
import { localeString } from './../utils/LocaleUtils';
import { themeColor } from './../utils/ThemeUtils';
import LoadingIndicator from './../components/LoadingIndicator';

interface handleAnythingQRProps {
    navigation: any;
}

interface handleAnythingQRState {
    loading: boolean;
}

@observer
export default class handleAnythingQRScanner extends React.Component<
    handleAnythingQRProps,
    handleAnythingQRState
> {
    constructor(props: any) {
        super(props);

        this.state = {
            loading: false
        };
    }

    handleAnythingScanned = async (data: string) => {
        const { navigation } = this.props;
        this.setState({
            loading: true
        });
        handleAnything(data)
            .then(([route, props]) => {
                this.setState({
                    loading: false
                });
                navigation.navigate(route, props);
            })
            .catch((err) => {
                Alert.alert(
                    localeString('general.error'),
                    err.message,
                    [
                        {
                            text: localeString('general.ok'),
                            onPress: () => void 0
                        }
                    ],
                    { cancelable: false }
                );

                this.setState({
                    loading: false
                });

                navigation.navigate('Send');
            });
    };

    render() {
        const { navigation } = this.props;
        const { loading } = this.state;

        if (loading) {
            return (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: themeColor('background')
                    }}
                >
                    <Header
                        centerComponent={{
                            text: localeString('general.loading'),
                            style: {
                                color: themeColor('text'),
                                fontFamily: 'Lato-Regular'
                            }
                        }}
                        backgroundColor={themeColor('background')}
                        containerStyle={{
                            borderBottomWidth: 0
                        }}
                    />
                    <View style={{ top: 40 }}>
                        <LoadingIndicator />
                    </View>
                </View>
            );
        }

        return (
            <QRCodeScanner
                handleQRScanned={this.handleAnythingScanned}
                goBack={() => navigation.goBack()}
            />
        );
    }
}
