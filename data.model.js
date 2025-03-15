const {dynamoDB} = require('./aws.config');
const tableName = 'Subject';
const SubjectModel = {
    createSubject: async (params) => {
        const param = {
            TableName: tableName,
            Item: {
                id: params.id,
                tenMonHoc: params.name,
                loai: params.course_type,
                hocKy: params.semester,
                khoa: params.department
            }
        };

        try{
            await dynamoDB.put(param).promise();
            return param.Item;
        }
        catch(err){
            console.error('Error: ', err);
            throw err;
        }
    },

    getSubjects: async () => {
        const params = {
            TableName: tableName
        };

        try{
            const data = await dynamoDB.scan(params).promise();
            return data.Items;
        }
        catch(err){
            console.error('Error: ', err);
            throw err;
        }
    },

    getSubject: async (id) => {
        const params = {
            TableName: tableName,
            Key: {
                id: id
            }
        };

        try{
            const data = await dynamoDB.get(params).promise();
            return data.Item;
        }
        catch(err){
            console.error('Error: ', err);
            throw err;
        }
    },

    deleteSubject: async (id) => {
        const params = {
            TableName: tableName,
            Key: {
                id: id
            }
        };

        try{
            await dynamoDB.delete(params).promise();
            return id;
        }
        catch(err){
            console.error('Error: ', err);
            throw err;
        }
    },

    deleteSubjects: async (ids) => {
        try{
            for (let i = 0; i < ids.length; i++) {
                const params = {
                    TableName: tableName,
                    Key: {
                        id: ids[i]
                    }
                };
                await dynamoDB.delete(params).promise();
            }
            return ids;
        }
        catch(err){
            console.error('Error: ', err);
            throw err;
        }
    }



};

module.exports = SubjectModel;


