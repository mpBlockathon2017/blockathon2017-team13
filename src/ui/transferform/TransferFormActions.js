import CryptoLicenseToken from '../../../build/contracts/CryptoLicenseToken.json'
import store from '../../store'
import { loginUser, setErrorMessage, setInfoMessage, unlockAccount, setLoaderStatus } from '../loginform/LoginFormActions'

const contract = require('truffle-contract')

export function transferTo(receiver, amount, passPhrase) {
    let web3 = store.getState().web3.web3Instance
    const coinbase = store.getState().user.data.coinbase
    // Double-check web3's status.
    if (typeof web3 !== 'undefined') {
        return (async (dispatch) => {
            try {
                dispatch(setLoaderStatus(false))
                dispatch(setErrorMessage(null))
                const licenseContract = contract(CryptoLicenseToken)
                licenseContract.setProvider(web3.currentProvider)
                const licenseContractInstance = await licenseContract.deployed()
                await unlockAccount(coinbase, passPhrase)
                await licenseContractInstance.transferToken(receiver, amount, { from: coinbase })
                dispatch(loginUser(coinbase))
                dispatch(setInfoMessage('Successfully transferred!!!'))
            } catch (err) {
                dispatch(setLoaderStatus(true))
                dispatch(setErrorMessage(err.message))
            }
        })
    } else {
        console.error('Web3 is not initialized.');
    }
}
