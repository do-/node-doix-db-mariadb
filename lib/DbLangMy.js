const stringEscape = require ('string-escape-map')
const {DbLang, DbView, DbProcedure} = require ('doix-db')

const CH_QQ = '`'

const QQ_ESC = new stringEscape ([
  [CH_QQ, CH_QQ + CH_QQ],
])

module.exports = class DbLangMy extends DbLang {

	quoteName (s) {

		return CH_QQ + QQ_ESC.escape (s) + CH_QQ

	}

	genRoutineArgFull (p) {

		return `${p.mode} ${p.qName} ${p.type}`

	}	

	genReCreate (o) {
	
		if (o instanceof DbView) return this.genReCreateView (o)

		if (o instanceof DbProcedure) return this.genReCreateProcedure (o)

		// if (o instanceof DbFunction) return this.genReCreateFunction (o)
		
		throw Error (`Don't know how to recreate ` + o.constructor.name)

	}

	genReCreateView ({qName, sql}) {

		return `CREATE OR REPLACE VIEW ${qName} AS ${sql}`

	}

	genReCreateProcedure ({label, qName, parameters, body}) {

		let sql = '(' + parameters.map (p => this.genRoutineArgFull (p)) + ')'

		if (label) sql += ` COMMENT '${this.quoteLiteral (label)}'`

		return `CREATE OR REPLACE PROCEDURE ${qName} ${sql} ${body}`

	}

}