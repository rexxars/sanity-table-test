export default {
  name: 'containerDoc',
  title: 'Container document',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      required: true
    },
    {
      name: 'productInfo',
      title: 'Product info',
      type: 'table',
      options: {
        defaultNumRows: 3,
        defaultNumColumns: 3
      }
    }
  ]
}
