module.exports = {

    comment: 'Procedure 1',
    
    parameters: [
    	'_id int',
    ],

    body: `
    	BEGIN
            SELECT _id AS id;
        END;
    `,

}