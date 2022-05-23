import constants from 'react-dappify/constants';
import CoinbaseConnector from 'react-dappify/connectors/CoinbaseConnector';

export const getProviderPreference = () => {
    const authParams = getPreference(constants.PREFERENCES.PROVIDER);
    if (authParams.connector) {
        // Change from class to string for ref
        authParams.connector = authParams.connector === CoinbaseConnector.name ? CoinbaseConnector : authParams.connector;
    }
    return authParams;
}

export const setProviderPreference = (authParams = {}) => {
    if (authParams.connector && authParams.connector instanceof Function) {
        // Change from class to string for ref
        authParams.connector = authParams.connector.name;
    }
    setPreference(constants.PREFERENCES.PROVIDER, authParams);
    return getPreference(constants.PREFERENCES.PROVIDER);
}

export const setPreference = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    return getPreference(key);
}

export const getPreference = (key) => {
    const value = JSON.parse(localStorage.getItem(key));
    return value;
}