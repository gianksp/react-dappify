import { parse } from 'tldts';
import Moralis from 'moralis';
import UserProfile from 'react-dappify/model/UserProfile';
import constants from 'react-dappify/constants';

export default class Project {

    static PLATFORM_DOMAIN = 'dappify';
    static instance;

    id;
    config;
    source;
    isTestEnvironment;

    static getInstance = async () => {
        if (Project.instance) return Project.instance;
        return await Project.load();
    }

    static load = async() => {
        const domainName = parse(window.location.hostname);
        const isDappifySubdomain = domainName.domainWithoutSuffix.toLocaleLowerCase() === Project.PLATFORM_DOMAIN;
        const searchKey = isDappifySubdomain ? 'subdomain' : 'domain';
        const searchValue = isDappifySubdomain ? domainName.subdomain.replace('test.','') : domainName.hostname;
        const projectObject = await Project.getCached(searchKey, searchValue);
        const ProjectObj = Moralis.Object.extend('Project');
        const project = new ProjectObj();
        project.id = projectObject.objectId;
        project.isTestEnvironment = isDappifySubdomain && domainName.subdomain.startsWith('test.');
        project.set('config', projectObject.config);
        const loadedProject = new Project(project);
        return loadedProject;
    }

    constructor(project) {
        return this.#fromProvider(project);
    }

    #fromProvider = (project) => {
        this.id = project.id;
        this.isTestEnvironment = project.isTestEnvironment;
        this.config = project.get('config');
        this.source = project;
        return this;
    }

    getNetworkForTemplate = (template) => {
        const env = this.isTestEnvironment ? 'test' : 'main';
        return this.config.template[template][env];
    }

    getNetworkContext = (template) => {
        const network = this.getNetworkForTemplate(template);
        return constants.NETWORKS[network.chainId];
    }

    static getCached = async(searchKey, searchValue) => {
        let cachedStr = localStorage.getItem(searchKey);
        // if (!cachedStr) {
        //     //Add to cache
            const project = await Project.loadFromProvider(searchKey, searchValue);
            localStorage.setItem(searchKey, JSON.stringify(project));
            cachedStr = localStorage.getItem(searchKey);
        // } else {
        //     // console.log(`Project configuration from cached key ${searchKey}`);
        // }
        return JSON.parse(cachedStr)
    }

    static loadFromProvider = async(searchKey, searchValue) => {
        Moralis.start({ appId:process.env.REACT_APP_MORALIS_APP_ID, serverUrl:process.env.REACT_APP_MORALIS_SERVER_URL });
        const query = new Moralis.Query('Project');
        query.equalTo(searchKey, searchValue);
        const result = await query.first();
        return result;
    }

    static getTokenPrice = async() => {
        const context = await UserProfile.getCurrentUserContext();
        const { currentProject } = context;
        const tokenPrice = await Moralis.Cloud.run('getTokenPrice', { address: currentProject.config.tokenContractAddress });
        return tokenPrice?.data ? tokenPrice.data : {};
    }
}