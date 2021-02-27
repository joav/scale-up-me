export default {
    createFieldType: {
        "name": {
            type: "string",
            presence: true
        },
        "saveType": {
            type: "string",
            presence: true,
            inclusion: {
                within: ["boolean", "string", "number", "date", "rel", "rel_array", "obj"]
            }
        }
    }
};