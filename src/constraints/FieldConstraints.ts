export default {
    createField: {
        "fieldType": {
            type: "string",
            length: {
                is: 24
            },
            presence: true
        },
        "module": {
            type: "string",
            length: {
                is: 24
            }
        },
        "dataFrom": {
            type: "string",
            length: {
                is: 24
            }
        },
        "name": {
            type: "string",
            presence: true
        },
        "slug": {
            type: "string",
        },
        "data": {
            type: "string",
        },
        "toList": {
            type: "boolean",
            presence: true
        },
        "toShow": {
            type: "boolean",
            presence: true
        },
        "order": {
            type: "number",
            presence: true
        },
        "required": {
            type: "boolean",
            presence: true
        },
        "help": {
            type: "string",
        },
    }
}