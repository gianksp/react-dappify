import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import { loadConfiguration  } from 'react-dappify/configuration';
import defaultConfiguration from 'react-dappify/configuration/default.json';
import Project from 'react-dappify/model/Project';
import UserProfile from 'react-dappify/model/UserProfile';
import { getProviderPreference, setProviderPreference } from 'react-dappify/utils/localStorage';

const useDappify = () => {
    const { authenticate: providerAuthenticate, logout, user, isAuthenticated, Moralis } = useMoralis();
    const [configuration, setConfiguration] = useState(defaultConfiguration);
    const [nativeBalance, setNativeBalance] = useState();
    const [provider, setProvider] = useState();
    const [isRightNetwork, setRightNetwork] = useState();
    const [project, setProject] = useState();
    const Provider = Moralis;

    useEffect(() => {
      const bootstrapProject = async () => {
        const currentProject = await Project.getInstance();
        setProject(currentProject);
        setConfiguration(currentProject.config);
      };

      bootstrapProject();
    }, [Moralis, isAuthenticated]);

    useEffect(() => {
        loadConfiguration(configuration);
    },[configuration]);

    useEffect(() => {
        if (!user) return;
        if (!provider) return;
        const loadBalances = async () => {
          if (!provider?.getBalance) return;
          const balance = await provider.getBalance(user.get('ethAddress'));
          const currBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(3);
          setNativeBalance(currBalance);
        }
        loadBalances();
    }, [user, provider]);

    useEffect(() => {
        if (!configuration) return;
        if (!provider) return;
        const targetNetwork = configuration.template.chainId;
        if (targetNetwork && provider.provider?.chainId)
          setRightNetwork(provider.provider.chainId === targetNetwork);
    }, [provider, configuration]);

    const verifyNetwork = async() => {
        if (!provider) return;
        if (!isAuthenticated) return;
        if (isRightNetwork) return;
        const network = configuration.template;
        await switchToChain(network, provider.provider);
    }

    const switchToChain = async(network, currentProvider) => {
      if (!network) return;
      const chainId = network.chainId;
      if (!chainId) return;
      try {
        await currentProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }]
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await currentProvider.request({
              method: "wallet_addEthereumChain",
              params: [network]
            });
          } catch (error) {
            throw new Error("Could not change network");
          }
        }
      }
    }

    const authenticate = async(params) => {
      let providerUser;
      try {
        setProviderPreference(params);
        const pref = getProviderPreference();
        pref.signingMessage = configuration?.name || 'Dappify';
        providerUser = await providerAuthenticate(pref);
        if (providerUser)
          await UserProfile.init(providerUser);
      } catch (e) {
        console.log(e);
      }
      return providerUser;
    }

    const getProviderInstance = async() => {
      let web3;
      try {
        const pref = getProviderPreference();
        pref.signingMessage = configuration?.name || 'Dappify';
        web3 = await Moralis.enableWeb3(pref);
        setProvider(web3);
      } catch(e) {
        console.log(e);
      }
      return web3;
    }

    return { 
        configuration, 
        authenticate, 
        isAuthenticated, 
        user, 
        logout,
        Provider,
        nativeBalance,
        verifyNetwork,
        isRightNetwork,
        project,
        provider,
        switchToChain,
        getProviderInstance
    };
};

export default useDappify;
