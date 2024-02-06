const validateModelName = (modelName) => {
    if (modelName === "" || modelName === undefined) { //throw error if no table name is specified
        throw noTableError;
    } else {
        if (tableNames.hasOwnProperty(modelName)) { //validate that table name exists 
            return;
        } else {
            throw nonExistentTableError;
        }
    }
}