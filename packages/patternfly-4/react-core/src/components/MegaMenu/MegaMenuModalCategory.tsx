import * as React from 'react';
import { css } from '@patternfly/react-styles';
import megaMenuStyles from '@patternfly/patternfly/components/MegaMenuModal/mega-menu-modal.css';

import {Omit} from '../../helpers/typeUtils';

export interface MegaMeuModalCategoryProps extends Omit<React.HTMLProps<HTMLElement>, 'title'> {
  title: React.ReactNode;
  children: React.ReactNode;
}

export const MegaMenuModalCategory: React.FunctionComponent<MegaMeuModalCategoryProps> = ({
  title,
  children
}) => (
  <React.Fragment>
    <h2 className={css(megaMenuStyles.megaMenuModalNavTitle)}>{title}</h2>
    <ul className={css(megaMenuStyles.megaMenuModalNavList)}>
      {children}
    </ul>
  </React.Fragment>
);
