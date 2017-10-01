import React from 'react';
import { connect } from 'react-redux';
import { removePackage, isSetting } from '@popup/actions/pack';
import { isEditPackage } from '@popup/actions/flags.js';

const SettingContent = ({
    dispatch,
    packageid
}) => {

  const handleClickItem = () => {
      dispatch(isEditPackage({newPackage: false, packageid}))
  }

  const handleRemovePack = () => {
      /* dispatch(isSetting(false, packageid));*/
      dispatch(removePackage(packageid));
  }

	return (
		<section className="setting-panel">
			<ul>
				<li className="setting-share">
            <svg className="share-icon">
                <use xlinkHref="#icon-share"></use>
            </svg>

            <label>Compartilhar</label>
				</li>

				<li className="setting-edit" onClick={handleClickItem}>
            <svg className="edit-icon">
                <use xlinkHref="#icon-edit"></use>
            </svg>

            <label>Editar</label>
				</li>

				<li className="setting-trash" onClick={handleRemovePack}>
            <svg className="trash-icon">
                <use xlinkHref="#icon-trash"></use>
            </svg>

            <label>Apagar</label>
				</li>

			</ul>
		</section>
	);
};

export default connect()(SettingContent);
