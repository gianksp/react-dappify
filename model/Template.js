import Moralis from 'moralis';

export default class Template {

    id;
    name;
    schema;

    source;

    constructor(template) {
        this.name = template.get('name');
        this.schema = template.get('schema');
        this.createdAt = template.get('createdAt');
        this.updatedAt = template.get('updatedAt');
        this.source = template;
        return this;
    }

    static listTemplates = async() => {
        const query = new Moralis.Query('Template');
        const response = await query.find() || {};
        const templates = response.map((tmp) => new Template(tmp));
        return templates;
    }
}
