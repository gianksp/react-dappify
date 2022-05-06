import PropTypes from 'prop-types';
import { createContext } from 'react';
import useDappify from 'react-dappify/hooks/useDappify';

export const DappifyContext = createContext(null);

export const DappifyProvider = ({ children }) => (
    <DappifyContext.Provider value={{ ...useDappify() }}>
        {children}
    </DappifyContext.Provider>
);

DappifyProvider.propTypes = {
    children: PropTypes.node
};
