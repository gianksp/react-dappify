const constants = {
    NETWORKS : {
        // Ethereum
        "0x1": {
            chainId: "0x1",
            chainName: "Ethereum",
            rpcUrls: ["https://mainnet.infura.io/v3/"],
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            blockExplorerUrls: ["https://etherscan.io"]
        },
        "0x5": {
            chainId: "0x5",
            chainName: "Goerli",
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
            chainName: "Kovan",
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
            chainName: "BNB Chain",
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
            chainName: "BNB Chain",
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
            chainName: "Avalanche",
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
            chainName: "Fuji",
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
    },
    MAINNETS: [
      "0xa86a", "0x38", "0x89", "0x1"
    ],
    TESTNETS: {
      "0xa86a": ["0xa869"],
      "0x38": ["0x61"],
      "0x89": ["0x13881"],
      "0x1": ["0x5", "0x2a"]
    },
    FAUCETS: {
      "0xa869": "https://faucet.avax-test.network/",
      "0x61": "https://testnet.binance.org/faucet-smart",
      "0x13881": "https://faucet.polygon.technology/",
      "0x2a": "https://ethdrop.dev/",
      "0x5": "https://goerlifaucet.com/"
    }
};

export default constants;