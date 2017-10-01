import React from 'react'
import { connect } from 'react-redux'
import SettingPanel from './SettingPanel'
import { isSetting } from 'actions/pack'

const Setting = ({
  packageid,
  dispatch,
  isShow
}) => {
  const handleClickSetting = () => {
    dispatch(isSetting(!isShow, packageid))
  }

  return (
    <section className={'setting-content' + (isShow ? ' show-setting' : '')}>
      <svg className='setting-icon' onClick={handleClickSetting}>
        <use xlinkHref='#icon-setting' />
      </svg>
      <SettingPanel packageid={packageid} />
    </section>
  )
}

const {
  func, bool, string
} = React.PropTypes

Setting.propTypes = {
  packageid: string.isRequired,
  dispatch: func.isRequired,
  isShow: bool.isRequired
}

export default connect()(Setting)
