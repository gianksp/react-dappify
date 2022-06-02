import Moralis from 'moralis';
import isEmpty from 'lodash/isEmpty';

export default class Property {

    id;
    key;
    value;
    type;
    createdAt;
    updatedAt;

    source;

    constructor(property = {}) {
        if (isEmpty(property)) {
            return this;   
        }
        this.id = property.id;
        this.key = property.get('key');
        this.value = property.get('value');
        this.type = property.get('type');
        this.createdAt = property.get('createdAt');
        this.updatedAt = property.get('updatedAt');
        this.source = property;
        return this;
    }

    static listPropertiesByProject = async({ projectId, templateId }) => {
        const projects = new Moralis.Query('Project');
        projects.equalTo('objectId', projectId);
        const project = await projects.first();
        const query = new Moralis.Query('Property');
        query.equalTo('project', project);
        query.equalTo('templateId', templateId);
        query.descending('type');
        query.descending('updatedAt');
        const response = await query.find() || {};
        const properties = response.map((prop) => new Property(prop));
        return properties;
    }

    static addPropertyForProject = async({ projectId, templateId }) => {
        const projects = new Moralis.Query('Project');
        projects.equalTo('objectId', projectId);
        const project = await projects.first();
        const Property = Moralis.Object.extend('Property');
        const property = new Property();
        property.set('project', project);
        property.set('templateId', templateId);
        property.set('key', null);
        property.set('value', null);
        property.set('type', null);
        return await property.save();
    }

    save = async () => {
        this.source.set('key', this.key);
        this.source.set('value', this.value);
        this.source.set('type', this.type);
        await this.source.save();
    }

    remove = async () => {
        return await this.source.destroy();
    }
}
