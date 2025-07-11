const stringEscape = require ('string-escape-map')
const {DbLang}     = require ('doix-db')

const CH_QQ = '`'

const QQ_ESC = new stringEscape ([
  [CH_QQ, CH_QQ + CH_QQ],
])

module.exports = class DbLangMy extends DbLang {

	quoteName (s) {

		return CH_QQ + QQ_ESC.escape (s) + CH_QQ

	}

}