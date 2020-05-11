import * as logger from './libs/logger'
import * as calc from './libs/calc'
import $ from 'jquery'

const e = $('#app')
e.text(`2 + 3 = ${calc.add(2, 3)}`)
logger.debug('Message', 'pageA')
for (let i = 0; i < 100; i++) {
 e.fadeToggle(1000)
}
