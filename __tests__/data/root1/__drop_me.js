module.exports = {

    columns: {
        id       : 'INT    // PK',
        label    : 'TEXT   // PK',
    },

    pk: 'id',

    triggers: [

    	{
            name   : '__tezt_trg',
            phase  : 'BEFORE INSERT',
            action : 'FOR EACH ROW',
            sql    : `
                BEGIN
                    SET NEW.label = CONCAT ('#', NEW.id);
                END;
            `,
    	},

    ],    

}