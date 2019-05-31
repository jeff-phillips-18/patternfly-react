import * as React from 'react';
import { css, getModifier } from '@patternfly/react-styles';
import megaMenuModalStyles from '@patternfly/patternfly/components/MegaMenuModal/mega-menu-modal.css';
import cardStyles from '@patternfly/patternfly/components/Card/card.css';

import { Omit } from '../../helpers/typeUtils';

export interface MegaMeuModalCategoryItemProps extends Omit<React.LiHTMLAttributes<HTMLLIElement>, 'title'> {
  title: React.ReactNode;
  image?: React.ReactNode
  isActive?: boolean;
  onActivate(): undefined;
  link?: string;
}

export const MegaMenuModalCategoryItem: React.FunctionComponent<MegaMeuModalCategoryItemProps> = ({
  title,
  image,
  isActive = false,
  onActivate = () => undefined,
  link = null,
  ...props
}) => {
  const handleActivate = (event: any) => {
    if (!link) {
      event.preventDefault();
    }
    onActivate();
  };

  return (
    <li {...props}>
      <div className={css(cardStyles.card, isActive && getModifier(megaMenuModalStyles, 'active'))}>
        <div className={css(cardStyles.cardBody)}>
          {image}
          <div>
            <h3 className={css(megaMenuModalStyles.megaMenuModalTitle)}>{title}</h3>
            {isActive ?
              <React.Fragment>
                <i className={css(megaMenuModalStyles.megaMenuModalSelectedIcon, 'fas fa-check')} />
                <span className={css(megaMenuModalStyles.megaMenuModalSelectedText)}>Selected</span>
              </React.Fragment>
              :
              <a href={link || '#'} onClick={e => handleActivate(e)} target="_blank" rel="noopener noreferrer">
                Open <i className={css(megaMenuModalStyles.megaMenuModalLinkIcon, 'fas fa-arrow-right')}/>
              </a>
            }
          </div>
        </div>
      </div>
    </li>
  );
};
