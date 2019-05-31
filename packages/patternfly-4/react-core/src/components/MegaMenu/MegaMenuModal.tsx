import * as React from 'react';

import { css, getModifier } from '@patternfly/react-styles';
import megaMenuModalStyles from '@patternfly/patternfly/components/MegaMenuModal/mega-menu-modal.css';

import { Omit } from '../../helpers';
import { Modal } from '../Modal';
import { Title, TitleLevel } from '../Title';
import { BaseSizes } from '../../styles/sizes';

export interface MegaMenuModalProps extends Omit<React.HTMLProps<HTMLDivElement>, 'title'> {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  isOpen?: boolean;
  onSwitch?(): void;
  /** A callback for when the close button is clicked */
  onClose?: () => void;
}

export const MegaMenuModal: React.FunctionComponent<MegaMenuModalProps> = ({
  title = 'Red Hat OpenShift Services',
  description = 'Text sample here, maybe describing the content.',
  children = null,
  isOpen = false,
  onClose = () => undefined
}) => {
  const header = (
    <React.Fragment>
      <Title headingLevel={TitleLevel.h1} size={BaseSizes['2xl']}>
        {title}
      </Title>
      <p className={css(megaMenuModalStyles.megaMenuModalDescription)}>
        {description}
      </p>
    </React.Fragment>
  );

  return (
    <Modal
      className={
        css(megaMenuModalStyles.megaMenuModal,
            getModifier(megaMenuModalStyles, 'full-width', 'pf-m-full-width'),
            getModifier(megaMenuModalStyles,  'full-height', 'pf-m-full-height'))
      }
      isOpen={isOpen}
      header={header}
      title={title}
      onClose={onClose}
    >
      <nav className={css(megaMenuModalStyles.megaMenuModalNav)}>
        {children}
      </nav>
    </Modal>
  );
};
