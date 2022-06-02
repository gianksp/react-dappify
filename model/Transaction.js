import Moralis from 'moralis';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

export default class Transaction {

    id;
    from;
    to;
    amount;
    symbol;
    createdAt;
    updatedAt;
    chainId;
    transactionHash;

    source;

    constructor(tx) {
        if (isEmpty(tx)) {

        } else {
            this.id = tx.id;
            this.from = tx.get('from');
            this.to = tx.get('to');
            this.amount = tx.get('amount');
            this.symbol = tx.get('symbol');
            this.chainId = tx.get('chainId');
            this.transactionHash = tx.get('transactionHash');
            this.createdAt = moment(tx.get('createdAt'));
            this.updatedAt = moment(tx.get('updatedAt'));
            this.source = tx;
        }
        return this;
    }

    static listByProject = async({ projectId, page = 0, limit = 20 }) => {
        const projects = new Moralis.Query('Project');
        projects.equalTo('objectId', projectId);
        const project = await projects.first();
        const query = new Moralis.Query('Transaction');
        query.equalTo('project', project);
        query.descending('updatedAt');
        query.limit(limit);
        query.skip(page*limit);
        query.withCount();
        const response = await query.find() || {};
        const txs = response.results.map((tx) => new Transaction(tx));
        return {
            results: txs,
            count: response.count
        }
    }
}
