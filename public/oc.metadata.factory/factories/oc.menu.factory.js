import MetaDataCollection from "./oc.app.factory.js";

let MenuCollection = MetaDataCollection.extend({

    constructor: function MenuCollection(options){
        MetaDataCollection.prototype.constructor.call(this, null, options);
        this.baseUrl = "http://localhost:8181/orderchef/v1/admin/menu";
        this.url = this.baseUrl;
    },

    /**
     * Constructs the URL dynamically based on query parameters
     * @param {Object} qParms - Query parameters to include in the URL
     */

    _constructUrl: function(qParms){
        if(!qParms || Object.keys(qParms).length === 0){
            this.url = `${this.url}/view`;
        }else{
            let endpoint = `${this.url}/filter`;

            const queryString = Object.entries(qParms)
                .filter(([key, value]) => value !== null && value !== undefined) 
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`) 
                .join('&');

            this.url = `${this.baseUrl}/filter?${queryString}`;
        }
    },

    /**
     * Fetches data with optional query parameters
     * @param {Object} qParms - Query parameters to include in the request
     */

    fetchFilteredData: async function (qParms) {
        // Construct the URL dynamically based on the parameters
        this._constructUrl(qParms);

        // Call the fetch method from the parent class
        const response = await this.fetch();
        return response;
    },


    fetchAllMenuData: async function(){
        this.url = 'http://localhost:8181/orderchef/v1/staff/menu/view';
        const response = await this.fetch();
        return response;
    }

});


export default MenuCollection;