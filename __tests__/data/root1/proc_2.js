module.exports = {
    
    parameters: [
    	'_id int',
    ],

    body: `
    	BEGIN
            SELECT _id AS id;
        END;
    `,

}