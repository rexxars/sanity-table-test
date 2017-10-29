import React, {Component} from 'react'
import PropTypes from 'prop-types'
import autobind from 'react-autobind'
import ReactDataSheet from 'react-datasheet'
import styles from './FunkyTable.css'
import PatchEvent, {set, unset, setIfMissing} from '@sanity/form-builder/PatchEvent'

const defaultNumRows = 10
const defaultNumColums = 4
const convertToDataSheet = rows => rows.map(row => row.values)
const createEmptyGrid = options => {
  const rows = options.defaultNumRows || defaultNumRows
  const cols = options.defaultNumColumns || defaultNumColumns
  const value = options.defaultValue || ''

  const grid = []
  for (let r = 0; r < rows; r++) {
    const row = {values: []}
    for (let c = 0; c < cols; c++) {
      row.values.push(value)
    }
    grid.push(row)
  }

  return grid
}

export default class FunkyTable extends Component {
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

    const grid = props.value && props.value.grid
    this.state = {dataSheet: grid && convertToDataSheet(grid)}
  }

  componentWillReceiveProps(nextProps) {
    if (
      !nextProps.value ||
      !nextProps.value.grid ||
      nextProps.value.grid === this.props.value.grid
    ) {
      return
    }

    this.setState(state => ({dataSheet: convertToDataSheet(nextProps.value.grid)}))
  }

  handleInitializeTable() {
    const {type, onChange} = this.props
    const emptyGrid = createEmptyGrid(type.options)
    onChange(PatchEvent.from(setIfMissing({_type: type.name}), set(emptyGrid, ['grid'])))
  }

  handleTableChange(cell, row, column, value) {
    const {onChange, type} = this.props
    onChange(
      PatchEvent.from(
        setIfMissing({_type: type.name}),
        set(value || '', ['grid', row, 'values', column])
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
    const grid = value.grid
    const numCols = grid[0] ? grid[0].values.length : options.defaultNumColumns || defaultNumColumns
    const cols = []
    for (let i = 0; i < numCols; i++) {
      cols.push(options.defaultValue || '')
    }

    onChange(
      PatchEvent.from(setIfMissing({_type: type.name}), set({values: cols}, ['grid', grid.length]))
    )
  }

  handleRemoveRow() {
    const {value, type, onChange} = this.props
    const grid = value.grid
    if (!grid.length) {
      return
    }

    onChange(PatchEvent.from(setIfMissing({_type: type.name}), unset(['grid', grid.length - 1])))
  }

  handleAddColumn() {
    const {value, type, onChange} = this.props
    const options = type.options
    const grid = value.grid
    const newColIndex = grid[0]
      ? grid[0].values.length
      : options.defaultNumColumns || defaultNumColumns

    const setOps = grid.map((row, i) =>
      set(options.defaultValue || '', ['grid', i, 'values', newColIndex])
    )

    onChange(PatchEvent.from([setIfMissing({_type: type.name})].concat(setOps)))
  }

  handleRemoveColumn() {
    const {value, type, onChange} = this.props
    const options = type.options
    const grid = value.grid

    if (!grid[0]) {
      return
    }

    const delColIndex = grid[0].values.length - 1
    const delOps = grid.map((row, i) => unset(['grid', i, 'values', delColIndex]))
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
            className={styles.funkyTable}
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
