import * as React from 'react';
import accessibleStyles from '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import { css } from '@patternfly/react-styles';

import { Title, TitleLevel } from '../Title';

export interface ModalBoxHeaderProps {
  /** content rendered inside the Header */
  children?:React.ReactNode;
  /** additional classes added to the button */
  className?: string;
  /** Flag to hide the title */
  hideTitle?: boolean;
}

export const ModalBoxHeader: React.FunctionComponent<ModalBoxHeaderProps> = ({
  children = null,
  className = '',
  hideTitle = false,
  ...props
}) => {
  const hidden = hideTitle ? css(accessibleStyles.screenReader) : '';

  return (
    <React.Fragment>
      <Title size="2xl" headingLevel={TitleLevel.h1} className={className + hidden} {...props}>
        {children}
      </Title>
    </React.Fragment>
  );
};

export default ModalBoxHeader;
