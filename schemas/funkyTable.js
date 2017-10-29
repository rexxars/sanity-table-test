import FunkyTable from '../components/FunkyTable'

export default {
  name: 'funkyTable',
  title: 'Data table',
  type: 'object',
  inputComponent: FunkyTable,
  fields: [
    {
      name: 'title',
      title: 'Table title',
      type: 'string'
    },
    {
      name: 'grid',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'values',
              type: 'array',
              of: [{type: 'string'}]
            }
          ]
        }
      ]
    }
  ]
}
