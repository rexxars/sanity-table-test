import createSchema from 'part:@sanity/base/schema-creator'
import containerDoc from './containerDoc'
import funkyTable from './funkyTable'

export default createSchema({
  name: 'default',
  types: [containerDoc, funkyTable]
})
