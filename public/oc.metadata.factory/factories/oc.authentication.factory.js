import MetaDataCollection from "./oc.app.factory.js";

let AuthCollectionFactory = MetaDataCollection.extend({

    constructor: function AuthCollectionFactory(options){
        MetaDataCollection.prototype.constructor.call(this, null, options);
        this.url = "http://localhost:8181/orderchef/auth/login";
    },

    login: async function (payload){
        const options = {
            method: "POST", 
            data: JSON.stringify(payload), 
            success: this.onLoginSuccess,
            error: this.onLoginError
        };

        const response = await this.fetch(options);
        return response;
    },

    onLoginSuccess: function (response) {
        return response;
    },

    onLoginError: function (response) {
        console.error("Login failed:", response);
    },

    parse: function (response) {
        if (response) {
            return {
                message: response
            };
        }
        return MetaDataCollection.prototype.parse.call(this, response);
    }
});

export default AuthCollectionFactory;