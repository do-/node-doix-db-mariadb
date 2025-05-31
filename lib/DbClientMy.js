const {Transform} = require ('stream')
const {DbClient} = require ('doix-db')

class DbClientMy extends DbClient {

	constructor (raw) {
	
		super ()

		this.raw = raw
	
	}
	
	async release () {
	
		await this.raw.release ()

		this.emit ('released')
	
	}

	async exec (call) {	

		const {raw} = this, {sql, params, options} = call, {maxRows, rowMode} = options

		try {

			if (maxRows === 0) return call.raw = await raw.execute (sql, params)

			const qs = raw.queryStream (sql, params)

			qs.on ('fields', meta => call.columns = meta.map (i => ({type: i.type, name: i.name ()})))

			if (rowMode === 'object') {

				call.rows = qs

			}
			else {

				const xform = new Transform ({objectMode: true,
					transform (r, __, cb) {
						cb (null, Object.values (r))
					}
				})

				qs.once ('error', e => xform.destroy (e))

				call.rows = qs.pipe (xform)

			}

		}
		catch (cause) {

			const {message} = cause, {sql, params, options} = call, o = {message, call: {sql, params, options}}

			throw Error (JSON.stringify (o), {cause})

		}

	}

}

module.exports = DbClientMy