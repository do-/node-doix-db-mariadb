const mariadb = require('mariadb')
const {DbPool} = require ('doix-db')

const DbClientMy = require ('./DbClientMy.js')
const DbLangMy = require ('./DbLangMy.js')

class DbPoolMy extends DbPool {

	constructor (o) {

		super (o)

		this.wrapper = DbClientMy

		this.pool = mariadb.createPool (o.db)
		
		this.lang = o.lang || new DbLangMy ()

	}

	async acquire () {

		return this.pool.getConnection ()

	}

}

module.exports = DbPoolMy