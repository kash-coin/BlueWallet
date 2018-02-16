/** @type {AppStorage} */
let BlueApp = require('../../BlueApp')
import React, { Component } from 'react';
import { ActivityIndicator, TextInput,  View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, } from 'react-navigation';
import { Icon, Card, Header, } from 'react-native-elements'
import { List, Button, ListItem } from 'react-native-elements'
import { FormLabel, FormInput, Text, FormValidationMessage } from 'react-native-elements'
import {
  BlueLoading, BlueSpacing20, BlueList, BlueButton, SafeBlueArea, BlueCard, BlueText, BlueListItem, BlueHeader,
  BlueFormInput, BlueSpacing
} from '../../BlueComponents'
let EV = require('../../events')
let BigNumber = require('bignumber.js')

export default class SendCreate extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
      <Ionicons
        name={focused ? 'md-paper-plane' : 'md-paper-plane'}
        size={26}
        style={{ color: tintColor }}
      />
    ),
  }

  constructor(props) {
    super(props);
    console.log('send/create constructor')
    this.state = {
      isLoading : true,
      amount: props.navigation.state.params.amount,
      fee: props.navigation.state.params.fee,
      address: props.navigation.state.params.address,
      memo: props.navigation.state.params.memo,
      fromAddress: props.navigation.state.params.fromAddress,
      broadcastErrorMessage : '',
    }

    let fromWallet = false
    for (let w of BlueApp.getWallets()) {
      if (w.getAddress() === this.state.fromAddress) {
        fromWallet = w
        break;
      }
    }
    this.state['fromWallet'] = fromWallet;
  }

  async componentDidMount() {
    console.log('send/create - componentDidMount')
    console.log('address = ', this.state.address)

      let utxo
      let satoshiPerByte
      let tx

      try {
        await this.state.fromWallet.fetchUtxo()
        utxo = this.state.fromWallet.utxo
        let startTime = Date.now()

        tx = this.state.fromWallet.createTx(utxo, this.state.amount, this.state.fee, this.state.address, this.state.memo)
        let endTime = Date.now()
        console.log('create tx ', (endTime-startTime) / 1000, 'sec')

        let bitcoin = require('bitcoinjs-lib');
        let txDecoded = bitcoin.Transaction.fromHex(tx);
        let txid = txDecoded.getId();
        console.log('txid', txid);
        console.log('txhex', tx);

        BlueApp.tx_metadata = BlueApp.tx_metadata || {}
        BlueApp.tx_metadata[txid] = {
          'txhex' : tx,
          'memo': this.state.memo,
        }
        BlueApp.saveToDisk()

        let feeSatoshi = new BigNumber(this.state.fee)
        feeSatoshi = feeSatoshi.mul(100000000)
        satoshiPerByte = feeSatoshi.div( Math.round(tx.length/2) )
        satoshiPerByte = Math.round(satoshiPerByte.toString(10))
      } catch (err) {
        console.log(err)
        return this.setState({
          isError: true,
          errorMessage: JSON.stringify(err.message)
        })
      }

      this.setState({
        isLoading: false,
        size: Math.round(tx.length/2),
        tx,
        satoshiPerByte,
      })


  }

  async broadcast() {
    let result = await this.state.fromWallet.broadcastTx(this.state.tx)
    console.log('broadcast result = ', result)
    if (typeof result === 'string') {
      result = JSON.parse(result)
    }
    if ((result && result.error)) {
      this.setState({broadcastErrorMessage : JSON.stringify(result.error), broadcastSuccessMessage : ''})
    } else {
      this.setState({broadcastErrorMessage : ''})
      this.setState({broadcastSuccessMessage : "Success! TXID: " + JSON.stringify(result.result)})
    }
  }


  render() {
    const {navigate} = this.props.navigation;

    if (this.state.isError) {
      return (
        <SafeBlueArea  style={{flex: 1, paddingTop: 20}}>
          <BlueSpacing/>
          <BlueCard title={"Create Transaction"} style={{alignItems: 'center', flex: 1}}>
            <BlueText>Error creating transaction. Invalid address or send amount?</BlueText>
            <FormValidationMessage>{this.state.errorMessage}</FormValidationMessage>
          </BlueCard>
          <BlueButton
            onPress={() =>this.props.navigation.goBack()}
            title="Go back"
          />
        </SafeBlueArea>
      );
    }

    if (this.state.isLoading) {
      return (
        <BlueLoading/>
      );
    }


    return (
      <SafeBlueArea  style={{flex: 1, paddingTop: 20}}>
        <BlueSpacing/>
        <BlueCard title={"Create Transaction"} style={{alignItems: 'center', flex: 1}}>

          <BlueText>This is transaction hex, signed and ready to be broadcast to the network. Continue?</BlueText>

          <TextInput
            style={{borderColor: '#ebebeb', borderWidth: 1, marginTop:20, color:'#ebebeb'}}
            maxHeight={70}
            multiline={true}
            editable={false}
            value={this.state.tx}
          />

          <BlueSpacing20/>

          <BlueText style={{paddingTop:20}} >To: {this.state.address}</BlueText>
          <BlueText>Amount: {this.state.amount} KSC</BlueText>
          <BlueText>Fee: {this.state.fee} KSC</BlueText>
          <BlueText >TX size: {this.state.size} Bytes</BlueText>
          <BlueText>satoshiPerByte: {this.state.satoshiPerByte} Sat/B</BlueText>
          <BlueText>Memo: {this.state.memo}</BlueText>




        </BlueCard>




        <BlueButton
          icon={{name: 'megaphone', type: 'octicon'}}
          onPress={() =>
            this.broadcast()
          }
          title="Broadcast"
        />


        <BlueButton
          icon={{name: 'arrow-left', type: 'octicon'}}
          onPress={() =>
            this.props.navigation.goBack()
          }
          title="Go back"
        />

        <FormValidationMessage>{this.state.broadcastErrorMessage}</FormValidationMessage>
        <Text style={{padding:20, color:"#090"}}>{this.state.broadcastSuccessMessage}</Text>


      </SafeBlueArea>
    );
  }
}


