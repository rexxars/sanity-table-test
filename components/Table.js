import React, {Component} from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import ReactDataSheet from 'react-datasheet'
import styles from './Table.css'
import PatchEvent, {insert, set, unset, setIfMissing} from '@sanity/form-builder/PatchEvent'

const defaultNumRows = 10
const defaultNumColums = 4
const convertToDataSheet = rows => rows.map(row => row.columns)
const createEmptyGrid = options => {
  const numRows = options.defaultNumRows || defaultNumRows
  const numCols = options.defaultNumColumns || defaultNumColumns
  const value = options.defaultValue || ''

  const rows = []
  for (let r = 0; r < numRows; r++) {
    const row = {columns: []}
    for (let c = 0; c < numCols; c++) {
      row.columns.push(value)
    }
    rows.push(row)
  }

  return rows
}

export default class Table extends Component {
  static propTypes = {
    type: PropTypes.shape({
      title: PropTypes.string
    }).isRequired,
    level: PropTypes.number,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    autobind(this)

    const rows = props.value && props.value.rows
    this.state = {dataSheet: rows && convertToDataSheet(rows)}
  }

  componentWillReceiveProps(nextProps) {
    const currentValue = this.props.value || {}
    const nextValue = nextProps.value || {}
    if (!nextValue || !nextValue.rows) {
      this.setState({dataSheet: null})
      return
    }

    if (nextValue.rows && nextValue.rows !== currentValue.rows) {
      this.setState(state => ({dataSheet: convertToDataSheet(nextProps.value.rows)}))
    }
  }

  handleInitializeTable() {
    const {type, onChange} = this.props
    const emptyGrid = createEmptyGrid(type.options)
    onChange(PatchEvent.from(setIfMissing({_type: type.name}), set(emptyGrid, ['rows'])))
  }

  handleTableChange(cell, row, column, value) {
    const {onChange, type} = this.props
    onChange(
      PatchEvent.from(
        setIfMissing({_type: type.name}),
        set(value || '', ['rows', row, 'columns', column])
      )
    )
  }

  handleTitleChange(event) {
    const {onChange, type} = this.props
    const value = event.target.value
    onChange(
      PatchEvent.from(
        setIfMissing({_type: type.name}),
        value ? set(event.target.value, ['title']) : unset(['title'])
      )
    )
  }

  handleAddRow() {
    const {value, type, onChange} = this.props
    const options = type.options
    const rows = value.rows
    const numCols = rows[0]
      ? rows[0].columns.length
      : options.defaultNumColumns || defaultNumColumns
    const cols = []
    for (let i = 0; i < numCols; i++) {
      cols.push(options.defaultValue || '')
    }

    onChange(
      PatchEvent.from(
        setIfMissing({_type: type.name}),
        insert([{columns: cols}], 'after', ['rows', -1])
      )
    )
  }

  handleRemoveRow() {
    const {value, type, onChange} = this.props
    const rows = value.rows
    if (!rows.length) {
      return
    }

    onChange(PatchEvent.from(setIfMissing({_type: type.name}), unset(['rows', rows.length - 1])))
  }

  handleAddColumn() {
    const {value, type, onChange} = this.props
    const options = type.options
    const rows = value.rows
    const insertOps = rows.map((row, i) =>
      insert([options.defaultValue || ''], 'after', ['rows', i, 'columns', -1])
    )

    onChange(PatchEvent.from([setIfMissing({_type: type.name})].concat(insertOps)))
  }

  handleRemoveColumn() {
    const {value, type, onChange} = this.props
    const options = type.options
    const rows = value.rows

    if (!rows[0]) {
      return
    }

    const delColIndex = rows[0].columns.length - 1
    const delOps = rows.map((row, i) => unset(['rows', i, 'columns', delColIndex]))
    onChange(PatchEvent.from([setIfMissing({_type: type.name})].concat(delOps)))
  }

  render() {
    const {type, value: sanityData, level, onChange} = this.props
    const {dataSheet} = this.state
    const value = this.props.value || {}
    return (
      <div>
        <div>
          <h3>{type.title}</h3>
          {type.description && <p>{type.description}</p>}
        </div>
        <div>
          <label htmlFor="title">Table title</label>
          <br />
          <input
            className={styles.table}
            name="title"
            type="text"
            onChange={this.handleTitleChange}
            value={value.title || ''}
          />
          <br />

          {!dataSheet && <button onClick={this.handleInitializeTable}>Initialize table</button>}
        </div>

        {dataSheet && (
          <div>
            <div>
              <button onClick={this.handleAddColumn}>Add column</button>{' '}
              <button onClick={this.handleRemoveColumn}>Delete column</button>
            </div>

            <ReactDataSheet
              className={styles['data-grid']}
              data={this.state.dataSheet}
              valueRenderer={cell => cell}
              onChange={this.handleTableChange}
            />

            <div>
              <button onClick={this.handleAddRow}>Add row</button>{' '}
              <button onClick={this.handleRemoveRow}>Delete row</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}
