import PropTypes from 'prop-types';
import { createContext } from 'react';
import useDappify from 'react-dappify/hooks/useDappify';

export const DappifyContext = createContext(null);

export const DappifyProvider = ({ children, template='marketplace' }) => (
    <DappifyContext.Provider value={{ ...useDappify({template}) }}>
        {children}
    </DappifyContext.Provider>
);

DappifyProvider.propTypes = {
    children: PropTypes.node
};
