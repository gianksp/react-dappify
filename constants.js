const constants = {
    NETWORKS : {
        // Ethereum
        "0x1": {
            chainId: "0x1",
            chainName: "Ethereum Mainnet",
            rpcUrls: ["https://mainnet.infura.io/v3/"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://etherscan.io"]
        },
        "0x3": {
            chainId: "0x3",
            chainName: "Ropsten Test Network",
            rpcUrls: ["https://ropsten.infura.io/v3/"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://ropsten.etherscan.io"]
        },        
        "0x4": {
            chainId: "0x4",
            chainName: "Ropsten Test Network",
            rpcUrls: ["https://rinkeby.infura.io/v3/"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://rinkeby.etherscan.io"]
        },
        "0x5": {
            chainId: "0x5",
            chainName: "Goerli Test Network",
            rpcUrls: ["https://goerli.infura.io/v3/"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://goerli.etherscan.io"]
        },
        "0x2a": {
            chainId: "0x2a",
            chainName: "Kovan Test Network",
            rpcUrls: ["https://kovan.infura.io/v3/"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://kovan.etherscan.io"]
        },
        // Polygon
        "0x89": {
            chainId: "0x89",
            chainName: "Polygon",
            rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
            nativeCurrency: {
              name: "Matic",
              symbol: "Matic",
              decimals: 18,
            },
            blockExplorerUrls: ["https://explorer.matic.network"]
        },
        "0x13881": {
            chainId: "0x13881",
            chainName: "Mumbai",
            rpcUrls: ["https://rpc-mumbai.matic.today"],
            nativeCurrency: {
              name: "Matic",
              symbol: "Matic",
              decimals: 18,
            },
            blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"]
        },
        // Binance chain
        "0x38": {
            chainId: "0x38",
            chainName: "Binance Smart Chain Mainnet",
            rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://bscscan.com/"]
        },
        "0x61": {
            chainId: "0x61",
            chainName: "Binance Smart Chain Testnet",
            rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
            nativeCurrency: {
              name: "BNB",
              symbol: "BNB",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.bscscan.com"]
        },
        // Avalanche
        "0xa86a": {
            chainId: "0xa86a",
            chainName: "Avalanche Network",
            rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            blockExplorerUrls: ["https://snowtrace.io/"]
        },        
        "0xa869": {
            chainId: "0xa869",
            chainName: "Avalanche Fuji Testnet",
            rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            blockExplorerUrls: ["https://testnet.snowtrace.io/"]
        },

    },
    LOGO: {
        AVAX: 'https://cryptologos.cc/logos/avalanche-avax-logo.svg',
        BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.svg',
        Matic: 'https://cryptologos.cc/logos/polygon-matic-logo.svg',
        ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg'
    }
};

export default constants;