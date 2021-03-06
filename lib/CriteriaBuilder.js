/**
 *
 * @param query the raw request query from express
 * @return {*} an object that contains specific queries for ORMS
 * like mongoose or sequelize.
 */


class CriteriaBuilder {
    constructor() {
    }

    default() {
        return {
            fields: undefined,
            limit: undefined,
            skip: undefined,
            where: {},
            sort: undefined,
            includes: []
        };
    }

    build(query) {
        const criteria = this.default();

        try {
            const raw = (query.criteria instanceof Object)
                ? query.criteria
                : JSON.parse(query.criteria);

            this.buildFields(raw, criteria);
            this.buildLimit(raw, criteria);
            this.buildOffset(raw, criteria);
            this.buildWhere(raw, criteria);
            this.buildSort(raw, criteria);
            this.buildIncludes(raw, criteria);

            return criteria;
        }
        catch (error) {
            return criteria
        }
    }


    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildFields(query, criteria) {
        if (!query.fields)
            return criteria;

        criteria.fields = query.fields;
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildSort(query, criteria) {
        if (!query.sort)
            return criteria;

        criteria.sort = query.sort;
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildWhere(query, criteria) {
        if (!query.where)
            return criteria;

        criteria.where = query.where;
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildLimit(query, criteria) {
        if (!query.limit)
            return criteria;

        criteria.limit = parseInt(query.limit, 10);
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildOffset(query, criteria) {
        if (!query.offset)
            return criteria;

        criteria.offset = parseInt(query.offset, 10);
        return criteria;
    }

    /**
     *
     * @param query     {Object} The request filter's query.
     * @param criteria  {Object} The raw criteria.
     * @return {Object} Mongoose decorated criteria from request's query.
     */
    buildIncludes(query, criteria) {
        if (!query.includes)
            return criteria;

        query.includes.forEach((i) => {
            let include = parse(i);
        criteria.includes = criteria.includes.concat(include);
    })
        ;

        return criteria;

        /**
         *
         * @param query     An include query.
         * @param criteria  {Object} The raw criteria.
         * @return {Object} Mongoose decorated criteria from request's query.
         */
        function parse(query) {
            if (query instanceof Array)
                return query.map(q => parse(q));

        else
            if (typeof query === 'string')
                return { path: query };

            else if (query.toString() === '[object Object]')
                for (let item in query)
                    if (query.hasOwnProperty(item))
                        return { path: item, populate: parse(query[item]) };
        }
    }
}


module.exports = CriteriaBuilder;