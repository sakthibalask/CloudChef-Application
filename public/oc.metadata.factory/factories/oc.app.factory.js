const MetaDataCollection = Backbone.Collection.extend({
    constructor: function MetaDataCollection(models, options){
        this.options = options || {};
        this.url = options?.url || "";
        Backbone.Collection.apply(this, arguments);
    },

    parse: function(response){
        return response;
    },

    url: function(){
        return this.url;
    },

    sync: function (method, collection, options) {
        options = options || {};
        options.contentType = "application/json";
        return Backbone.sync.call(this, method, collection, options);
    }
});

export default MetaDataCollection;