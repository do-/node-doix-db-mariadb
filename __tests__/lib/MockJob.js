const EventEmitter = require ('events')

const {Tracker}  = require ('events-to-winston')
const winston = require ('winston')
const logger = winston.createLogger({
	transports: [
	  new winston.transports.Console (),
	],
	silent: true
})

module.exports = class extends EventEmitter {

	constructor () {

		super ()

		this.uuid = '00000000-0000-0000-0000-000000000000'

		this.logger = logger

		this [Tracker.LOGGING_ID] = 'DUMMY'

	}

}