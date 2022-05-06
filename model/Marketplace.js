import Moralis from 'moralis';
import { ethers } from 'ethers';
import MarketplaceContract from 'react-dappify/contracts/Marketplace.sol/Marketplace.json';
import UserProfile from 'react-dappify/model/UserProfile';

export default class Marketplace {

    contract;
    marketplaceAddress;

    constructor(contractAddress) {
        this.marketplaceAddress = contractAddress.toLowerCase();
        return this;
    }

    init = async() => {
        Moralis.start({ 
			appId:process.env.REACT_APP_MORALIS_APP_ID, 
			serverUrl:process.env.REACT_APP_MORALIS_SERVER_URL 
		});
        const web3Provider = await Moralis.enableWeb3();
        const signer = web3Provider.getSigner();
        this.contract = new ethers.Contract(this.marketplaceAddress, MarketplaceContract.abi, signer);
		this.signer = signer;
        return this;
    }

	static getBalance = async() => {
		const context = await UserProfile.getCurrentUserContext();
        const { currentProfile, currentProject } = context;
		const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const contractAddress = currentProject.config.template.marketplace[env].contract;
		let marketplace = new Marketplace(contractAddress);
        marketplace = await marketplace.init();
        const balance = await marketplace.contract.viewBalances(currentProfile.wallet);
		return ethers.utils.formatEther(balance);
	}

	static withdrawBalance = async() => {
		const context = await UserProfile.getCurrentUserContext();
        const { currentProject } = context;
		const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const contractAddress = currentProject.config.template.marketplace[env].contract;
		let marketplace = new Marketplace(contractAddress);
        marketplace = await marketplace.init();
        await marketplace.contract.withdrawBalance();
	}
}