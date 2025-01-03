import MetaDataCollection from "./oc.app.factory.js";

var OrdersCollectionFactory = MetaDataCollection.extend({
    constructor: function OrdersCollectionFactory(options){
        MetaDataCollection.prototype.constructor.call(this, null, options);
        this.baseUrl = "http://localhost:8181/orderchef/v1/staff"
        this.url = this.baseUrl;
    },

    createOrder: async function(orderPayload){
        const options = {
            method: "POST", 
            data: JSON.stringify(orderPayload)
        };
        this.url = `${this.url}/orders/create`;
        const response = await this.fetch(options);
        this.url = this.baseUrl;
        return response;
    },

    viewAllOrders: async function(){
        this.url = `http://localhost:8181/orderchef/v1/chef/orders/all`;
        const response = await this.fetch();
        this.url = this.baseUrl;
        return response;
    },

    viewOrdersByStaffId: async function(staffId){
        this.url = `${this.baseUrl}/orders/${staffId}`;
        const response = await this.fetch();
        this.url = this.baseUrl;
        return response;
    },

    viewSelectedTables: async function(){
        this.url = `${this.baseUrl}/orders/tables`;
        const response = await this.fetch();
        this.url = this.baseUrl;
        return response;
    },

    unFreezeSelectedTables: async function(tableId){
        const options = {
            method: "PATCH"
        };
        this.url = `${this.baseUrl}/tables/unfreeze/${tableId}`;
        this.fetch(options);
        this.url = this.baseUrl;
    },

    getLastOrderId: async function(){
        const options = {
            method: "GET"
        }
        this.url = `${this.baseUrl}/orders/getlastOrderId`;
        const response = await this.fetch(options);
        this.url = this.baseUrl;
        return response;
    },

    parse: function(response){
        if (response) {
            return{
                message: response
            }; 
        }
        return MetaDataCollection.prototype.parse.call(this, response);
    }
});

export default OrdersCollectionFactory;