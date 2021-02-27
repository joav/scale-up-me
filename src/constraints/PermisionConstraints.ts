export default {
    createPermision: {
        "name": {
            type: "string",
            presence: true
        },
        "slug": {
            type: "string"
        },
        "module": {
            type: "string",
            length: {
                is: 24
            }
        }
    }
}