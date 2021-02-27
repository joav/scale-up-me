export default {
    createModule: {
        "name": {
            type: "string",
            presence: true
        },
        "slug": {
            type: "string"
        },
        "isCollection": {
            type: "boolean",
            presence: true
        },
        "parent": {
            type: "string",
            length: {
                is: 24
            }
        },
        "deleted": {
            type: "boolean"
        },
        "predefined": {
            type: "boolean"
        },
        "order": {
            type: "number"
        }
    }
};