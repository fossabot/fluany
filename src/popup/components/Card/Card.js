import React from 'react';
import { connect } from 'react-redux';
import { inc } from 'ramda';
import { isEditingCard } from '../../actions/pack';
import { getIndexThingById } from '../../reducers/stateManipulate';
import CardEdit from './CardEdit';
import TooltipCard from './TooltipCard';


/**
 * A Card -> <Front and Back>
 *
 * @param  {Function} dispatch   The result from `store.dispatch()`
 * @param  {Number} index   A index is the card's number
 * @param  {Number} colorID   The id of color
 * @return {Component}
 */
const Card = ({
    dispatch,
    packs,
    index,
    colorID,
    id,
    packageid
}) => {

    const indexOfPack = getIndexThingById(packs, packageid);
    const indexOfCard = getIndexThingById(packs[indexOfPack].cards, id);
    const isEditing = packs[indexOfPack].cards[indexOfCard].isEditing;
    let listItem = "";
    let styled = {
        backgroundColor: 'red'
    }

    const handleClickCard = () => {
        dispatch(isEditingCard(!isEditing, 'isEditing', indexOfPack, indexOfCard));
    }

    const cardEditProps = {
        dispatch,
        packs,
        indexOfPack,
        indexOfCard
    }

    return (
        <li className={"card-item" + (isEditing ? " isEditing" : "")} ref={(e) =>{listItem = e}}>
            <div className={"card-item-block color-" + colorID} onClick={handleClickCard}>
                <svg className="arrow-back">
                    <use xlinkHref="#icon-arrow"></use>
                </svg>
                <p className="card-item--count">{ inc(index) }</p>
            </div>
            <TooltipCard front={packs[indexOfPack].cards[indexOfCard].front} back={packs[indexOfPack].cards[indexOfCard].back}/>
            <CardEdit {...cardEditProps} />
        </li>
    );
}

const mapStateToProps = (
    state
) => {
    return {
		    packs: state.packs
    };
};

export default connect(mapStateToProps)(Card);
