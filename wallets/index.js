
import CoinbaseConnector from 'react-dappify/connectors/CoinbaseConnector';

const baseUrl = 'https://gateway.pinata.cloud/ipfs/QmYBFBPQKnGAoMk58DFnaXqpuHkeWBiWUFTGCTK94LZ1tV';

export const supportedWallets = [
    { 
        id: 'metamask', 
        payload: { 
            provider: 'metamask' 
        },  
        image: `${baseUrl}/1.png`, 
        tag: 'Most popular', 
        name: 'Metamask'
    },
    { 
        id: 'coinbase', 
        payload: { 
            connector: CoinbaseConnector 
        }, 
        image: `${baseUrl}/5.png`, 
        name: 'Coinbase'
    },
    { 
        id: 'walletconnect', 
        payload: { 
            provider: 'walletconnect' 
        }, 
        image: `${baseUrl}/4.png`, 
        name: 'WalletConnect'
    }
    // { id: 'torus', image: `${baseUrl}/8.png`, tag: 'Most Simple', name: 'Torus', description: 'Open source protocol for connecting decentralised applications to mobile wallets.' },
    // { id: 'bitski', image: `${baseUrl}/9.png`, name: 'Bitski', description: 'Bitski connects communities, creators and brands through unique, ownable digital content.' },
    // { id: 'formatic', image: `${baseUrl}/3.png`, name: 'Fortmatic', description: 'Let users access your Ethereum app from anywhere. No more browser extensions.' },
    // { id: 'arkane', image: `${baseUrl}/6.png`, name: 'Arkane', description: 'Make it easy to create blockchain applications with secure wallets solutions.' },
    // { id: 'authereum', image: `${baseUrl}/7.png`, name: 'Authereum', description: 'Your wallet where you want it. Log into your favorite dapps with Authereum.' }
];
