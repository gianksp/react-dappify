import Moralis from "moralis";
import WalletLink from "walletlink";
import Web3 from "web3";
import { getPreference } from 'react-dappify/utils/localStorage';
import constants from 'react-dappify/constants';

// @ts-ignore
class WalletLinkConnector extends Moralis?.AbstractWeb3Connector {
  // A name for the connector to reference it easy later on
  type = "WalletLink";
  account;
  chainId;
  provider;
  walletLink = new WalletLink({
    appName: getPreference(constants.PREFERENCES.SUBDOMAIN).config?.name,
    appLogoUrl: getPreference(constants.PREFERENCES.SUBDOMAIN).config?.icon,
    darkMode: false,
  });

  /**
   * A function to connect to the provider
   * This function should return an EIP1193 provider (which is the case with most wallets)
   * It should also return the account and chainId, if possible
   */
  async activate() {
    console.log("????");
    const appConfiguration = getPreference(constants.PREFERENCES.SUBDOMAIN).config;
    console.log(appConfiguration);
    const chainId = appConfiguration.template.chainId;
    console.log(appConfiguration);
    const ethereum = this.walletLink.makeWeb3Provider(constants.SPEEDY_NODE[chainId], 1);

    // Store the EIP-1193 provider, account and chainId
    await ethereum.enable();
    const web3 = new Web3(ethereum);
    const accounts = await web3.eth.getAccounts();
    this.account = accounts[0];
    this.chainId = chainId; // Should be in hex format
    this.provider = ethereum;

    // Call the subscribeToEvents from AbstractWeb3Connector to handle events like accountsChange and chainChange
    // @ts-ignore
    this.subscribeToEvents(this.provider);

    // Return the provider, account and chainId
    return {
      provider: this.provider,
      chainId: this.chainId,
      account: this.account,
    };
  }

  // Cleanup any references to torus
  async deactivate() {
    // Call the unsubscribeToEvents from AbstractWeb3Connector to handle events like accountsChange and chainChange
    // @ts-ignore
    this.unsubscribeToEvents(this.provider);

    this.walletLink.disconnect();

    this.account = null;
    this.chainId = null;
    this.provider = null;
  }
}

export default WalletLinkConnector;