import * as React from 'react';
import { css, getModifier } from '@patternfly/react-styles';
import megaMenuStyles from '@patternfly/patternfly/components/MegaMenu/mega-menu.css';
import titleStyles from '@patternfly/patternfly/components/Title/title.css';

import {Omit} from '../../helpers/typeUtils';

export interface MegaMenuSwitcherProps extends Omit<React.HTMLProps<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  switcherAriaLabel?: string;
  onSwitch?(): void;
}

export const MegaMenuSwitcher: React.FunctionComponent<MegaMenuSwitcherProps> = ({
  title,
  description = null,
  onSwitch = () => undefined,
  switcherAriaLabel = '',
  ...props
}) => (
  <div className={css(megaMenuStyles.megaMenu)} {...props}>
    <div className={css(megaMenuStyles.megaMenuHeader)}>
      <div className={css(megaMenuStyles.megaMenuTitle)}>
        <h1 className={css(titleStyles.title, getModifier(titleStyles, 'md'))}>{title}</h1>
        <p className={css(megaMenuStyles.megaMenuDescription)}>{description}</p>
      </div>
      <button
        className={css(megaMenuStyles.megaMenuToggle)}
        aria-expanded="false"
        aria-label={switcherAriaLabel}
        onClick={onSwitch}
      >
        <i className="fas fa-th" aria-hidden="true" />
      </button>
    </div>
  </div>
);
