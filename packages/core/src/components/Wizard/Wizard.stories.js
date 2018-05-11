import { storiesOf } from '@storybook/react';
import {
  loadingWizardExampleWithInfo,
  wizardExampleWithInfo,
  wizardPatternExampleAddWithInfo
} from './Stories';

import { name } from '../../../package.json';
import { STORYBOOK_CATEGORY } from 'storybook/constants/siteConstants';

/**
 * Wizard Component stories
 */
const componentStories = storiesOf(
  `${name}/${STORYBOOK_CATEGORY.COMMUNICATION}/Wizard/Components`,
  module
);
loadingWizardExampleWithInfo(componentStories);
wizardExampleWithInfo(componentStories);

/**
 * Wizard Pattern stories
 */
const patternStories = storiesOf(
  `${name}/${STORYBOOK_CATEGORY.COMMUNICATION}/Wizard/Patterns`,
  module
);
wizardPatternExampleAddWithInfo(patternStories);
