// https://docs.opensea.io/docs/metadata-standards
import Moralis from 'moralis';
import { ethers } from 'ethers';
import UserProfile from 'react-dappify/model/UserProfile';
import Collection from 'react-dappify/model/Collection';
import Metadata from 'react-dappify/model/Metadata';
import Like from 'react-dappify/model/Like';
import Status from 'react-dappify/model/Status';
import Marketplace from 'react-dappify/model/Marketplace';
import TokenContract from 'react-dappify/contracts/ERC721TokenV1.sol/ERC721TokenV1.json';

export default class Nft {

    id;
    tokenId;
    collection;
    status;
    author;
    owner;
    metadataUri;
    metadata = {};
    price;
    bid;
    maxBid;
    likes;
    views;
    publishedAt;
    createdAt;
    updatedAt;
    offeringId;
    buyer;
    hash;

    source;

    constructor(nft) {
        if (nft instanceof Nft) return this.#fromClone({...nft});
        if (nft.contract_type) return this.#fromRest(nft);
        return this.#fromProvider(nft);
    }

    #fromProvider = (nft) => {
        this.id = nft.id;
        this.tokenId = parseInt(nft.tokenId || nft.get('tokenId'));
        this.collection = new Collection(nft);
        this.status = nft.get('status');
        this.owner = nft.get('offerer') && new UserProfile(nft.get('offerer'));
        this.buyer = nft.get('buyer') && new UserProfile(nft.get('buyer'));
        this.metadataUri = nft.get('uri');
        this.metadata = nft.get('metadata') && new Metadata(nft.get('metadata'));
        this.price = nft.get('price') || 0;
        this.createdAt = nft.get('createdAt');
        this.updatedAt = nft.get('updatedAt');
        this.offeringId = nft.get('offeringId');
        this.hash = nft.get('hash');
        this.source = nft;
        return this;
    }

    #fromRest = (nft) => {
        this.id = '';
        this.tokenId = nft.token_id;
        this.collection = new Collection(nft);
        this.owner = new UserProfile(nft.owner_of);
        const metadata = JSON.parse(nft.metadata);
        this.metadata = new Metadata(metadata, nft.token_uri);
        this.price = 0;
        this.likes = 0;
        this.views = 0;
        this.createdAt = nft.synced_at;
        this.updatedAt = nft.synced_at;
        this.maxBid = 0;
        this.source = nft;
        return this;
    }

    #fromClone = (nft) => {
        for (const [key, value] of Object.entries(nft)) {
            this[key] = value;
        }
        return this;
    }

    save = async(collection, imageFile, animationFile) => {
        this.metadata_uri = await this.metadata.save(imageFile, animationFile);
        const context = await UserProfile.getCurrentUserContext();
        const { currentProject, currentProfile } = context;
        const NFTOffer = Moralis.Object.extend('NFTOffer');
        const nft = new NFTOffer();
        this.metadata_uri && nft.set('metadataUri', this.metadata_uri);
        this.metadata && nft.set('metadata', this.metadata.toJson());
        this.status && nft.set('status', this.status);
        this.price && nft.set('price', this.price);
        nft.set('owner', currentProfile.source);
        nft.set('author', currentProfile.source);
        nft.set('project', currentProject.source);
        nft.set('collection', collection.source);
        return await nft.save();
    }

    sellTo = async(price, category) => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProfile, currentProject } = context;

        // Soft check if we have already an OfferingPlaced for this item so we avoid duplicating from UI
        const query = new Moralis.Query('NFTOffer');
        query.equalTo('project', context.currentProject.source);
        query.equalTo('status', "OfferingPlaced");
        query.equalTo('contract', this.collection.address);
        query.equalTo('tokenId', this.tokenId.toString());
        query.descending("updatedAt");
        const previousOffering = await query.first() || {};
        if (previousOffering.id) {
            throw new Error(`This item is already in the marketplace`);
        }

        const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const contractAddress = currentProject.config.template.marketplace[env].contract;
        const chainId = currentProject.config.template.marketplace[env].chainId;
        let marketplace = new Marketplace(contractAddress);
        marketplace = await marketplace.init();

        // grant permission to marketplace
        const tokenContact = new ethers.Contract(this.collection.address, TokenContract.abi, marketplace.signer);
        const getappr = await tokenContact.getApproved(this.tokenId);
        if (getappr !== contractAddress) {
            const txApprove = await tokenContact.approve(marketplace.marketplaceAddress, this.tokenId);
            await txApprove.wait();
        }

        const transaction = await marketplace.contract.placeOffering(   this.collection.address, 
                                                                        this.tokenId, 
                                                                        ethers.utils.parseEther(JSON.stringify(price)),
                                                                        currentProject.config.operator
                                                                    );
        const tx = await transaction.wait();
        const event = tx.events.filter((e) => e.event === "OfferingPlaced")[0].args;
        const tokenURI = await tokenContact.tokenURI(this.tokenId);
        const NFTOffer = Moralis.Object.extend('NFTOffer');
        const offer = new NFTOffer();
        offer.set('project', currentProject.source);
        offer.set('offerer', currentProfile.source);
        offer.set('offeringId', event.offeringId);
        offer.set('price', price);
        offer.set('contract', this.collection.address);
        offer.set('tokenId', this.tokenId);
        offer.set('uri', tokenURI);
        offer.set('metadata', this.metadata.source);
        offer.set('status', "OfferingPlaced");
        offer.set('symbol', this.collection.symbol);
        offer.set('name', this.collection.name);
        offer.set('chainId', chainId);
        offer.set('category', category.uri);
        offer.set('hash', tx.transactionHash);
        await offer.save();
        return tx.transactionHash;
    }

    purchase = async() => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProfile, currentProject } = context;
		const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const contractAddress = currentProject.config.template.marketplace[env].contract;
        let marketplace = new Marketplace(contractAddress);
        marketplace = await marketplace.init();
        let transaction = await marketplace.contract.closeOffering(this.offeringId, { value: ethers.utils.parseEther(JSON.stringify(this.price)) });
        const tx = await transaction.wait();
        this.source.set("status", "OfferingClosed");
        this.source.set("buyer", currentProfile.source);
        this.source.set("hash", tx.transactionHash);
        await this.source.save();
        return tx.transactionHash;
    }

    editPricing = async(price) => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProject } = context;
		const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const contractAddress = currentProject.config.template.marketplace[env].contract;
        let marketplace = new Marketplace(contractAddress);
        marketplace = await marketplace.init();
        const newPricing = ethers.utils.parseEther(JSON.stringify(price));
        const transaction = await marketplace.contract.updateOffering(this.offeringId, newPricing);
        const tx = await transaction.wait();
        this.source.set("price", price);
        await this.source.save();
        return tx.transactionHash;
    }

    withdrawFromMarketplace = async() => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProject } = context;
		const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const contractAddress = currentProject.config.template.marketplace[env].contract;
        let marketplace = new Marketplace(contractAddress);
        marketplace = await marketplace.init();
        let transaction = await marketplace.contract.withdrawOffering(this.offeringId);
        const tx = await transaction.wait();
        this.source.set("status", "OfferingWithdrawn");
        this.source.set("hash", tx.transactionHash);
        await this.source.save();
        return tx.transactionHash;

    }

    bidBy = async(userProfile, amount) => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProject } = context;
        const NFTOfferTransaction = Moralis.Object.extend('NFTOfferTransaction');
        const nftSale = new NFTOfferTransaction();
        nftSale.set('project', currentProject.source);
        nftSale.set('nft', this.source);
        nftSale.set('owner', this.owner.source);
        nftSale.set('offer', amount);
        nftSale.set('offerer', userProfile.source);
        nftSale.set('symbol', currentProject.config.symbol);
        nftSale.set('type', Status.ON_AUCTION);
        return await nftSale.save();
    }

    like = async() => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProfile, currentProject } = context;
        const likeQuery = new Moralis.Query('NFTLike');
        likeQuery.equalTo('project', currentProject.source);
        likeQuery.equalTo('nft', this.source);
        likeQuery.equalTo('user', currentProfile.source);
        const targetNft = await likeQuery.first();
        if (targetNft) {
            // Remove like
            return await targetNft.destroy();
        } else {
            // Add like
            const NFTLike = Moralis.Object.extend('NFTLike');
            const like = new NFTLike();
            like.set('project', currentProject.source);
            like.set('nft', this.source);
            like.set('user', currentProfile.source);
            return await like.save();
        }

    }

    static getNewestDrops = async() => {
        const context = await UserProfile.getCurrentUserContext();
        const query = new Moralis.Query('NFTOffer');
        query.equalTo('project', context.currentProject.source);
        query.equalTo('status', "OfferingPlaced");
        query.descending("createdAt");
        query.limit(20);
        query.include('offerer');
        const nfts = await query.find() || [];
        const nftsList = nfts.map((nft) => new Nft(nft));
        return nftsList;
    }

    static getHotAuctions = async() => {
        const context = await UserProfile.getCurrentUserContext();
        const query = new Moralis.Query('NFTOffer');
        query.equalTo('project', context.currentProject.source);
        query.equalTo('status', "OfferingPlaced");
        query.descending("createdAt");
        query.limit(20);
        query.include('offerer');
        const nfts = await query.find() || [];
        const nftsList = nfts.map((nft) => new Nft(nft));
        return nftsList;
    }

    static getUserLikes = async(userProfile) => {
        await UserProfile.getCurrentUserContext();
        const likes = await Moralis.Cloud.run('getNFTLikes', { userId: userProfile?.id });
        const nftLikes = likes.map((like) => new Like(like));
        return nftLikes;
    }

    static getById = async(collectionAddress, tokenId) => {
        const context = await UserProfile.getCurrentUserContext();
        const query = new Moralis.Query('NFTOffer');
        query.equalTo('project', context.currentProject.source);
        query.equalTo('tokenId', tokenId);
        query.equalTo('contract', collectionAddress);
        query.include('offerer');
        query.descending("updatedAt");
        const nfts = await query.find() || [];
        const nftsList = nfts.map((nft) => new Nft(nft));
        return nftsList;
    }

    static fromCollection = async(collection) => {
        const context = await UserProfile.getCurrentUserContext();
        const query = new Moralis.Query('NFTOffer');
        query.equalTo('project', context.currentProject.source);
        query.equalTo('collection', collection.source);
        query.include('author');
        query.include('owner');
        const nfts = await query.find() || [];
        const nftsList = nfts.map((nft) => new Nft(nft));
        return nftsList;
    }

    static getFromUser = async(userProfile) => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProject } = context;
        const env = currentProject.isTestEnvironment ? 'test' : 'main';
        const chainId = currentProject.config.template.marketplace[env].chainId;
        const items = await Moralis.Cloud.run('getNftsForAddress', { address: userProfile.wallet, chainId:chainId });
        const resolvedItems = items?.data?.result;
        const ownedItems = resolvedItems.map((nft) => new Nft(nft));

        const ownerOfQuery = new Moralis.Query('NFTOffer');
        ownerOfQuery.equalTo('offerer', userProfile.source);
        ownerOfQuery.includeAll();
        ownerOfQuery.includeAll();
        const nfts = await ownerOfQuery.find() || [];
        const nftsList = nfts.map((nft) => new Nft(nft));
        return [...nftsList,...ownedItems];
    }

    static getWithFilters = async({category, status}) => {
        const context = await UserProfile.getCurrentUserContext();
        const query = new Moralis.Query('NFTOffer');
        query.equalTo('project', context.currentProject.source);
        if (status) query.equalTo('status', status);
        if (category) query.equalTo('category', category);
        query.includeAll();
        query.descending('updatedAt');
        const nfts = await query.find() || [];
        const nftsList = nfts.map((nft) => new Nft(nft));
        return nftsList;
    }

    static fullTextSearch = async(text) => {
        const items = await Moralis.Cloud.run('search', { filter: text });
        const itemList = items.map((item) => {
            switch(item.className) {
                case 'NFTOffer':
                    return new Nft(item)
                case 'NFTCollection':
                    return new Collection(item);
                case 'UserProfile':
                    return new UserProfile(item);
                default:
                    return null;
            }
        });
        return itemList;
    }
}