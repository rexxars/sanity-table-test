import Table from '../components/Table'

export default {
  name: 'table',
  title: 'Data table',
  type: 'object',
  inputComponent: Table,
  fields: [
    {
      name: 'title',
      title: 'Table title',
      type: 'string'
    },
    {
      name: 'rows',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'columns',
              type: 'array',
              of: [{type: 'string'}]
            }
          ]
        }
      ]
    }
  ]
}
