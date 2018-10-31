'use strict'
import React from 'react'
import { PropTypes as T } from 'prop-types'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import orderBy from 'lodash.orderby'
import c from 'classnames'

import { environment } from '../config'
import { initializeArrayWithRange, padNumber, round } from '../utils/utils'
import { LoadingSkeleton } from './loading-skeleton'
import OnGrid from './on-grid'
import { ParameterGraph, ParameterBreakdown } from './parameters'

export default class ResultsTable extends React.PureComponent {
  componentDidUpdate () {
    ReactTooltip.rebuild()
  }

  onSort (field, e) {
    e.preventDefault()
    const { sortField, sortDirection, onSort } = this.props
    if (sortField === field) {
      // Same field, change direction.
      onSort(sortField, sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // Different fields, reset direction.
      onSort(field, 'asc')
    }
  }

  renderTableHeader () {
    const headings = [
      {
        id: 'rank',
        sortable: true,
        title: 'Sort by rank',
        value: 'Global rank'
      },
      {
        id: 'name',
        sortable: true,
        title: 'Sort by geography',
        value: 'Geography'
      },
      {
        id: 'score',
        sortable: true,
        title: 'Sort by score',
        value: 'Score'
      },
      {
        id: 'graph',
        sortable: false,
        value: <><span className='visually-hidden'>Topics:</span> 0.0 - 5.0</>
      },
      {
        id: 'grid',
        sortable: true,
        title: 'Sort by grid',
        value: 'Grid'
      }
    ]

    return (
      <thead>
        <tr>
          {headings.map(o => {
            if (!o.sortable) return <th className={`th-${o.id}`} key={o.id}>{o.value}</th>

            const { sortField, sortDirection } = this.props
            const klass = c('sort', {
              'sort-none': sortField !== o.id,
              'sort-asc': sortField === o.id && sortDirection === 'asc',
              'sort-desc': sortField === o.id && sortDirection === 'desc'
            })
            return <th className={`th-${o.id}`} key={o.id}><a href='#' title={o.title} className={klass} onClick={this.onSort.bind(this, o.id)}>{o.value}</a></th>
          })}
        </tr>
      </thead>
    )
  }

  renderLoadingRows () {
    return initializeArrayWithRange(10).map(v => (
      <tr key={v}>
        <td><LoadingSkeleton /></td>
        <td><LoadingSkeleton /></td>
        <td><LoadingSkeleton /></td>
        <td><LoadingSkeleton /></td>
      </tr>
    ))
  }

  renderRows () {
    const { data, sortField, sortDirection } = this.props
    const rows = orderBy(data, sortField, sortDirection)

    return rows.map(({ iso, score, rank, name, topics, grid }) => {
      const hasScore = !!score

      return (
        <tr key={iso}>
          <td className='cell-rank'>{hasScore ? padNumber(rank, 2) : '--'}</td>
          <td className='cell-country'>
            <Link to={`/results/${iso}`} title={`Go to ${name} page`}>{name}</Link>
          </td>
          <td>{hasScore ? round(score) : '--'}</td>
          <td>
            <ParameterGraph
              geographyIso={iso}
              data={topics || []}
            />
          </td>
          <td>
            <OnGrid grid={grid} />
          </td>
        </tr>
      )
    })
  }

  renderParamGraphTooltip () {
    const popoverContent = (geographyIso) => {
      const geography = this.props.data.find(c => c.iso === geographyIso)
      if (!geography) return null

      const hasTopics = geography.topics && geography.topics.length

      return (
        <article className='tooltip-inner'>
          {hasTopics ? (
            <ParameterBreakdown
              className='params-legend'
              data={geography.topics}
            />
          ) : (
            <p>There is no data for this geography.</p>
          )}
        </article>
      )
    }

    return (
      <ReactTooltip
        id='param-graph-tooltip'
        effect='solid'
        type='custom'
        className='tooltip'
        getContent={popoverContent}
      />
    )
  }

  render () {
    return (
      <>
        <table className='table country-table'>
          {this.renderTableHeader()}
          <tbody>
            {
              this.props.loading
                ? this.renderLoadingRows()
                : this.renderRows()
            }
          </tbody>
        </table>
        {this.renderParamGraphTooltip()}
      </>
    )
  }
}

if (environment !== 'production') {
  ResultsTable.propTypes = {
    onSort: T.func,
    sortField: T.string,
    sortDirection: T.string,
    data: T.array,
    loading: T.bool
  }
}