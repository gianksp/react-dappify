import { useState, useEffect } from 'react';
import { useMoralis } from 'react-moralis';
import { ethers } from 'ethers';
import { loadConfiguration  } from 'react-dappify/configuration';
import defaultConfiguration from 'react-dappify/configuration/default.json';
import Project from 'react-dappify/model/Project';
import { debounce } from 'react-dappify/utils/timer';

const useDappify = ({template}) => {
    const { authenticate: providerAuthenticate, logout, user, isAuthenticated, Moralis } = useMoralis();
    const [configuration, setConfiguration] = useState(defaultConfiguration);
    const [nativeBalance, setNativeBalance] = useState();
    const [provider, setProvider] = useState();
    const [isRightNetwork, setRightNetwork] = useState();
    const [project, setProject] = useState();
 
    useEffect(() => {
        Moralis.onChainChanged(async () => setupProvider());
        bootstrap();
    }, []);

    useEffect(() => {
        loadConfiguration(configuration);
    },[configuration]);

    useEffect(() => {
        if (!user) return;
        if (!provider) return;
        loadBalances();
    }, [user, provider]);

    useEffect(() => {
        if (!configuration) return;
        if (!provider) return;
        const targetNetwork = project?.getNetworkContext(template)?.chainId;
        if (targetNetwork && provider.provider?.chainId)
          setRightNetwork(provider.provider.chainId === targetNetwork);
    }, [provider, configuration]);

    const setupProvider = debounce(async () => {
        const web3 = await Moralis.enableWeb3();
        setProvider(web3);
        return;
    });

    const verifyNetwork = async() => {
        if (!provider) return;
        if (!isAuthenticated) return;
        if (isRightNetwork) return;
        const network = project?.getNetworkContext(template);
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
        await setupProvider();
        const user = await providerAuthenticate(params);
        verifyNetwork();
        return user;
    }

    const loadBalances = async () => {
        if (!provider?.getBalance) return;
        const balance = await provider.getBalance(user.get('ethAddress'));
        const currBalance = parseFloat(ethers.utils.formatEther(balance)).toFixed(3);
        setNativeBalance(currBalance);
    }
 
    const bootstrap = async () => {
        await setupProvider();
        const currentProject = await Project.getInstance();
        setProject(currentProject);
        setConfiguration(currentProject.config);
    };

    const Provider = Moralis;

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
        template,
        provider,
        switchToChain
    };
};

export default useDappify;
