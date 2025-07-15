module.exports = {
    
    parameters: [
    	'_label text',
    ],

    returns: 'int',

    lang: 'sql',

    body: `

        BEGIN

            INSERT INTO __drop_me (label) VALUES (_label);

            RETURN LAST_INSERT_ID();

        END

    `,

}