import createSchema from 'part:@sanity/base/schema-creator'
import containerDoc from './containerDoc'
import table from './table'

export default createSchema({
  name: 'default',
  types: [containerDoc, table]
})
