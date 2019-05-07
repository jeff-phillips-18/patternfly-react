import * as React from 'react';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/patternfly/components/ModalBox/modal-box.css';

export interface ModalBoxBodyProps extends React.HTMLProps<HTMLDivElement> {
  /** content rendered inside the ModalBoxBody */
  children?: React.ReactNode;
  /** additional classes added to the ModalBoxBody */
  className?: string;
  /** id of the ModalBoxBody */
  id?: string;
}

export const ModalBoxBody: React.FunctionComponent<ModalBoxBodyProps> = ({
  children = null,
  className = '',
  id = undefined,
  ...props
}) => (
  <div {...props} className={css(styles.modalBoxBody, className)} id={id}>
    {children}
  </div>
);

export default ModalBoxBody;
