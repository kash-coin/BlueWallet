let BlueApp = require('../BlueApp')
import React, { Component } from 'react';
import { ScrollView, Linking, ActivityIndicator, StyleSheet, ListView, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, TabNavigator } from 'react-navigation';
import { Icon, Card, Header, List, ListItem, Avatar } from 'react-native-elements'
import {
  BlueLoading, BlueSpacing20, BlueList, BlueButton, SafeBlueArea, BlueCard, BlueText, BlueListItem, BlueHeader,
  BlueFormInput, BlueSpacing
} from '../BlueComponents'


export default class Settings extends Component {

  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'ios-settings' : 'ios-settings-outline'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  }


  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }

  async componentDidMount() {
    this.setState({
      isLoading: false,
    })
  }


  render() {
    const {navigate} = this.props.navigation;

    if (this.state.isLoading) {
      return (
        <BlueLoading/>
      );
    }

    return (
      <SafeBlueArea forceInset={{ horizontal: 'always' }}  style={{flex: 1}}>
        <BlueHeader
          backgroundColor={BlueApp.settings.brandingColor}
          leftComponent={<Icon name='menu' color="#fff"           onPress={() => this.props.navigation.navigate('DrawerToggle') }/>}
          centerComponent={{ text: 'Settings', style: { color: '#fff', fontSize: 25 }}}
        />
        <BlueCard>

          <ScrollView
            maxHeight={450}
          >
            <BlueText h4>About</BlueText>
            <BlueSpacing20/>

            <BlueText>This app is based on Blue Wallet.</BlueText>
            <BlueSpacing20/>
            <BlueText>Blue Wallet is free and opensource Bitcoin wallet</BlueText>
            <BlueText>Warning: Alpha version, don't use to store large amouts!</BlueText>
            <BlueButton
              icon={{name: 'octoface', type: 'octicon'}}
              onPress={() =>
              {
                Linking.openURL("https://github.com/Overtorment/BlueWallet")
              }
              }
              title="github.com/Overtorment/BlueWallet"
              style={{ padding: 20, flex:1, flexGrow: 10, }}
            />

            <BlueSpacing20/>
            <BlueText>Licensed MIT</BlueText>
            <BlueSpacing20/>

            <BlueText>Built with awesome:</BlueText>
            <BlueSpacing20/>
            <BlueText>* React Native</BlueText>
            <BlueText>* Bitcoinjs-lib</BlueText>
            <BlueText>* blockcypher.com API</BlueText>
            <BlueText>* Nodejs</BlueText>
            <BlueText>* Expo</BlueText>
            <BlueText>* react-native-elements</BlueText>
            <BlueText>* rn-nodeify</BlueText>
            <BlueText>* bignumber.js</BlueText>
            <BlueText>* https://github.com/StefanoBalocco/isaac.js</BlueText>
            <BlueText>* Design by https://dribbble.com/chrometaphore</BlueText>


          </ScrollView>


        </BlueCard>
      </SafeBlueArea>
    );
  }
}


