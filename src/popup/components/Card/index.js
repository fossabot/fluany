import React from 'react'
import { connect } from 'react-redux'
import { inc, head, isEmpty, prop } from 'ramda'
import CardEdit from './CardEdit'
import TooltipCard from './TooltipCard'
import { isEditingCard, removeCard, allNoEditingCard } from 'actions/pack'
import { changeCard } from 'actions/flags'
import { getIndexThingById } from 'reducers/stateManipulate'
import { getInLocal } from 'store/LocalStore'
import * as translator from 'shared/constants/internacionalization'

/**
 * A Card -> <Front and Back>
 * @param  {Function} dispatch   The result from `store.dispatch()`
 * @param  {Number} index   A index is the card's number
 * @param  {Number} colorID   The id of color
 * @return {Component}
 */
const Card = ({
    onChangeCard,
    onAllNoEditingCard,
    onEditingCard,
    onRemoveCard,
    packs,
    index,
    colorID,
    back,
    front,
    indexOfPack,
    id,
    packageid,
    isEditing,
    isCreating,
    cardEditing
}) => {
  const indexOfCard = getIndexThingById(packs[indexOfPack].cards, id)
    // ref components
  let listItem = ''

  const handleClickCard = (e) => {
    if (!isEditing) {
        onAllNoEditingCard(packageid)
    }

    listItem.style.transform = 'translateX(-' + (listItem.getBoundingClientRect().left - 25) + 'px)'
    onEditingCard(!isEditing, 'isEditing', packageid, indexOfCard)
    onChangeCard({front: null, back: null})
  }

  const handleRemoveCard = (e) => {
    e.stopPropagation()
    onRemoveCard(packageid, indexOfCard)
  }

  const handleSaveCard = (e) => {
    e.stopPropagation()
        // if is empty, you don't save it :(
    if (cardEditing.front === '' || cardEditing.back === '' ||
           (isCreating && cardEditing.front === null && cardEditing.back === null)) {
      return
    }

    if (cardEditing.front !== null) {
        onEditingCard(cardEditing.front, 'front', packageid, indexOfCard)
    }

    if (cardEditing.back !== null) {
        onEditingCard(cardEditing.back, 'back', packageid, indexOfCard)
    }

    handleClickCard()

    getInLocal('openInPackage').then(data => {
            // when is clicked in save when is selected text, close window to continue the navigation
      setTimeout(() => {
        window.close()
      }, 1500)
    })
  }
  const handleCancelCard = (e) => {
    handleClickCard()
    if (isCreating && front === '' && back === '') {
        onRemoveCard(packageid, indexOfCard)
        onEditingCard(false, 'isCreating', packageid, indexOfCard)
    }
  }

  const cardEditProps = {
    packs,
    indexOfPack,
    indexOfCard,
    packageid,
    cardEditing,
    onChangeCard
  }

  return (
    <li className={'card-item' + (isEditing ? ' isEditing' : ' no-editing')} ref={(e) => { listItem = e }}>
      <CardEdit {...cardEditProps} />
      <div className={'card-item-block color-' + colorID} onClick={handleClickCard}>
        <button className='btn-delete' onClick={handleCancelCard}>
          <span>{translator.CARD_CANCEL}</span>
        </button>
        <button className='btn-save' onClick={handleSaveCard}>
          <svg className='save-icon'>
            <use xlinkHref='#icon-correct' />
          </svg>
          <span>{translator.CARD_SAVE}</span>
        </button>
        <TooltipCard handleOnDelete={handleRemoveCard} color={colorID} back={back} />
        <p className='card-item--flash card-item--count'>{translator.CARD_FRONT_LABEL}</p>
        <p className='card-item--count'>{ front }</p>
      </div>
    </li>
  )
}

const mapStateToProps = (
    state
) => {
  return {
		    packs: state.packs,
    cardEditing: state.flags.cardEditing
  }
}

function mapDispatchToProps(dispatch) {
  return {
      onChangeCard: (c) => dispatch(changeCard(c)),
      onAllNoEditingCard: (id) => dispatch(allNoEditingCard(id)),
      onEditingCard: (...props) => dispatch(isEditingCard(...props)),
      onRemoveCard: (...props) => dispatch(removeCard(...props))
  }
}

const {
    func, number, array, object, string
} = React.PropTypes

Card.propTypes = {
  onChangeCard: func.isRequired,
  onAllNoEditingCard: func.isRequired,
  onEditingCard: func.isRequired,
  onRemoveCard: func.isRequired,
  packs: array.isRequired,
  index: number,
  colorID: number.isRequired,
  indexOfPack: number.isRequired,
  cardEditing: object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Card)
