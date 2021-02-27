export default {
    createRole: {
        "name": {
            type: "string",
            presence: true
        },
        "permisions": {
            type: "array"
        },
        "deleted": {
            type: "boolean"
        }
    }
};