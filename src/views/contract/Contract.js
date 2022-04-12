import React, {useState} from 'react'
import Web3 from "web3"
import MTZContract from './MTZContract.json'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
} from '@coreui/react'
import { unstable_renderSubtreeIntoContainer } from "react-dom"
import axios from 'axios'

var contract
var contractAddress = "0xCE07219F6DCC95e89238e3aAa622379674e2549D"
const baseURL = ''

async function connect(onConnected = null, onCancelled = null) {
  try {
      if (!window.ethereum) {
          alert("Get MetaMask!");
          return;
      }

      if (web3 == null || contract == null) {
          web3 = new Web3(window.ethereum)
          contract = new web3.eth.Contract(
            MTZContract.abi,
            contractAddress
          )
      }

      var res = await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x61" }]
      });

      var accounts = await window.ethereum.request({
          method: "eth_accounts",
      });

      if (accounts.length > 0) {
          if (onConnected != null) {
              onConnected(accounts[0])
          }
          return
      }
  
      accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
          if (onConnected != null) {
              onConnected(accounts[0])
          }
          return
      }

      if (onCancelled) onCancelled()
  } catch (err) {      
      if (onCancelled) onCancelled()
  }    
}

async function transferPlayFee(address, callback = () => {}, reject = () => {}) {
  contract.methods.makeReflect().send({from: address})
  .on('confirmation', function (confirmationNumber, receipent) {
      if (confirmationNumber == 0) callback()
  })
  .on('error', function (error, receipent) {
      reject()
  })
}

const Contract = () => {
  const [wallet, setWallet] = useState('')
  const [burnStopped, setBurnStopped] = useState(false)
  const [developers, setDevelopers] = useState([])
  const [exceptFeeMembers, setExceptFeeMembers] = useState([])
  const [liquiditys, setLiquiditys] = useState([])
  const [feeInfo, setFeeInfo] = useState({})
  const [supplyInfo, setSupplyInfo] = useState({})
  const [manualReflect, setManualReflect] = useState(true)
  const [president, setPresident] = useState('0x0000000000000000000000000000000000000000')

  async function onConnect() {
    connect(async (account) => {
      setWallet(account)
      await showInfos()
    }, () => {
      setWallet('')
    })
  }

  async function showInfos() {
    var funcs = []
    var res = []
    var burnStopped = 0
    var developers = []
    var cntDev = 0
    var exceptFeeMembers = []
    var cntExcept = 0
    var liquiditys = []
    var cntLiq = 0
    var feeInfos
    var supplyInfos

    funcs.push(contract.methods._totalDevelopers().call())
    funcs.push(contract.methods._totalExceptMembers().call())
    funcs.push(contract.methods._totalLiquiditys().call())
    funcs.push(contract.methods.getFeeInfo().call())
    funcs.push(contract.methods.getSupplyInfo().call())
    funcs.push(contract.methods.getPresident().call())
    funcs.push(axios.get(baseURL + '/getreflect'))

    res = await Promise.all(funcs)

    cntDev = res[0]
    cntExcept = res[1]
    cntLiq = res[2]
    feeInfos = JSON.parse(JSON.stringify(res[3]))
    supplyInfos = JSON.parse(JSON.stringify(res[4]))

    setPresident(res[5])
    document.getElementById('reflect_period').value = res[6].data.reflect_period

    funcs = []

    funcs.push(contract.methods.burnStopped().call())

    for (var i = 0; i < cntDev; i ++) {
      funcs.push(contract.methods.getDeveloper(i).call())
    }

    for (var i = 0; i < cntExcept; i ++) {
      funcs.push(contract.methods.getExceptFeeMembers(i).call())
    }

    for (var i = 0; i < cntLiq; i ++) {
      funcs.push(contract.methods.getLiquidity(i).call())
    }

    res = await Promise.all(funcs)

    var idx = 1

    burnStopped = res[0]

    for (var i = 0; i < cntDev; i ++) {
      developers.push(res[idx ++])
    }

    for (var i = 0; i < cntExcept; i ++) {
      exceptFeeMembers.push(res[idx ++])
    }
    
    for (var i = 0; i < cntLiq; i ++) {
      liquiditys.push(res[idx ++])
    }

    setBurnStopped(burnStopped)
    setDevelopers(developers)
    setExceptFeeMembers(exceptFeeMembers)
    setLiquiditys(liquiditys)
    setFeeInfo(feeInfos)
    setSupplyInfo(supplyInfos)
  }

  async function onSetAutoReflect() {
    var tmp = document.getElementById('reflect_period').value

    console.log(document.getElementById('reflect_period').value)

    await axios.post(baseURL + '/setreflect', {
      period: tmp
    })

    alert('Auto reflect is set to ' + tmp + '!')
  }

  async function onManualReflect() {
    connect(async (account) => {
      setWallet(account)
      setManualReflect(false)
      transferPlayFee(account, async () => {
        setManualReflect(true)
        await showInfos()
        alert('Making reflect is done!')
      }, () => {
        setManualReflect(true)
      })
    }, () => {
      setWallet('')
    })
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Contract Address</strong>
        </CCardHeader>
        <CCardBody>
          {contractAddress}
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Connect Wallet({wallet}) <CButton onClick={onConnect}>{wallet != '' ? 'Refresh Infos' : 'Connect'}</CButton></strong>
        </CCardHeader>
        <CCardBody>
          <CFormInput type="number" id="reflect_period" style={{width: '200px', display: 'inline-block'}} />&nbsp;&nbsp;
          <CButton className="btn btn-success" onClick={onSetAutoReflect}>Set Auto Reflect</CButton>&nbsp;&nbsp;
          <CButton className="btn btn-danger" disabled={manualReflect == true ? false : true} onClick={onManualReflect}>Manual Reflect Now!</CButton>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Fees</strong>
        </CCardHeader>
        <CCardBody>
          <b>App Fee: </b>{(parseFloat(feeInfo.appFee) / 100).toFixed(2)} %<br/>
          <b>Burn Fee: </b>{(parseFloat(feeInfo.burnFee) / 100).toFixed(2)} %<br/>
          <b>President Fee: </b>{(parseFloat(feeInfo.presidentFee) / 100).toFixed(2)} %<br/>
          <b>Developers Fee: </b>{(parseFloat(feeInfo.developersFee) / 100).toFixed(2)} %<br/>
          <b>Holders Fee: </b>{(parseFloat(feeInfo.holdersFee) / 100).toFixed(2)} %<br/>
          <b>Lquidity Fee: </b>{(parseFloat(feeInfo.liquidityFee) / 100).toFixed(2)} %<br/>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Supply To Reflect</strong>
        </CCardHeader>
        <CCardBody>
          <b>App Supply: </b>{(parseFloat(supplyInfo.appSupply) / 10 ** 18).toFixed(2)} MTZ<br/>
          <b>President Supply: </b>{(parseFloat(supplyInfo.presidentSupply) / 10 ** 18).toFixed(2)} MTZ<br/>
          <b>Developers Supply: </b>{(parseFloat(supplyInfo.developersSupply) / 10 ** 18).toFixed(2)} MTZ<br/>
          <b>Holders Supply: </b>{(parseFloat(supplyInfo.holdersSupply) / 10 ** 18).toFixed(2)} MTZ<br/>
          <b>Liquidity Supply: </b>{(parseFloat(supplyInfo.liquiditySupply) / 10 ** 18).toFixed(2)} MTZ<br/>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Burn Stopped</strong>
        </CCardHeader>
        <CCardBody>
          <p>{burnStopped ? 'true' : 'false'}</p>
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>President Wallet</strong>
        </CCardHeader>
        <CCardBody>
          {president}
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Except Fee Members({exceptFeeMembers.length})</strong>
        </CCardHeader>
        <CCardBody>
          {
            exceptFeeMembers.map((member, index) => {
              return <p>{member}</p>
            })
          }
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Developers({developers.length})</strong>
        </CCardHeader>
        <CCardBody>
          {
            developers.map((developer, index) => {
              return <p>{developer}</p>
            })
          }
        </CCardBody>
      </CCard>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Liquiditys({liquiditys.length})</strong>
        </CCardHeader>
        <CCardBody>
          {
            liquiditys.map((liquidity, index) => {
              return <p>{liquidity}</p>
            })
          }
        </CCardBody>
      </CCard>
    </>
  )
}

export default Contract
