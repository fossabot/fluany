import React from 'react'
import { connect } from 'react-redux'
import { changePagination } from 'actions/flags'
import * as translator from 'shared/constants/internacionalization'

/**
 * A component to click and see more package
 *
 * @param  {Function} dispatch   The result from `store.dispatch()`
 * @param  {Array}    packs   Store's packs
 * @param  {Number}   paginationPackage   A flag to know pagination number
 * @param  {String}   filterPackage   A flag to know if is search anything
 * @return {Component}
 */
let MorePackage = ({
    dispatch,
    packs,
    filterPackage,
    paginationPackage }) => {

  const handleClickMorePack = () => dispatch(changePagination())
  const isPagination = paginationPackage >= packs.length || filterPackage !== ''
  return (
    <section className={'more-package--content ' + (isPagination ? 'more-package--hidden' : '')}>
        <button className='more-package--button btn'
                onClick={handleClickMorePack}>+ { translator.PACK_LOAD_MORE }</button>
    </section>
  )
}

const mapStateToProps = (
    state
) => ({
  packs: state.packs,
  paginationPackage: state.flags.paginationPackage,
  filterPackage: state.flags.filterPackage
})

const {
  func, array, number
} = React.PropTypes

MorePackage.propTypes = {
  dispatch: func.isRequired,
  paginationPackage: number.isRequired,
  packs: array.isRequired
}

export default connect(mapStateToProps)(MorePackage)
