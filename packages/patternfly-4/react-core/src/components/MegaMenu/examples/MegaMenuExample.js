import React from 'react';

import accessibleStyles from '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import spacingStyles from '@patternfly/patternfly/utilities/Spacing/spacing.css';
import { css } from '@patternfly/react-styles';
import { BellIcon, CogIcon, ExternalLinkAltIcon } from '@patternfly/react-icons';

import {
  Avatar,
  Brand,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonVariant,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  Gallery,
  GalleryItem,
  KebabToggle,
  MegaMenuSwitcher,
  MegaMenuModal,
  MegaMenuModalCategory,
  MegaMenuModalCategoryItem,
  Nav,
  NavExpandable,
  NavItem,
  NavItemSeparator,
  NavList,
  Page,
  PageHeader,
  PageSection,
  PageSectionVariants,
  PageSidebar,
  SkipToContent,
  TextContent,
  Text,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';

import imgBrand from './imgBrand.png';
import imgAvatar from './imgAvatar.svg';
import threeScaleLogo from './3scale.svg';
import mongodbLogo from './mongodb.svg';
import openshiftLogo from './openshift.svg';
import shadownmanLogo from './shadowman.svg';
import awsLogo from './aws.png';
import kafkaLogo from './kafka.svg';
import defaultLogo from './default-logo.svg';

const defaultLink = 'http://google.com';

const perspectives = [
  {
    id: 'multi-cluster-manager',
    title: 'Multi-Cluster Manager',
    activeItem: 'multi-cluster-clusters',
    image: openshiftLogo
  },
  {
    id: 'dev',
    title: 'Developer Console',
    activeItem: 'dev-topology',
    image: openshiftLogo
  },
  {
    id: 'admin',
    title: 'Admin Console',
    description: 'Cluster: AWS-us-west-1',
    activeGroup: 'admin-home',
    activeItem: 'admin-projects',
    image: openshiftLogo
  }
];

const externalApplicationCategories = [
  {
    title: 'Red Hat Applications',
    applications: [
      {
        title: 'OpenShift Logging',
        link: defaultLink,
        image: openshiftLogo
      },
      {
        title: 'OpenShift Services Mesh',
        link: defaultLink,
        image: openshiftLogo
      },
      {
        title: 'RedHat 3 Scale',
        link: defaultLink,
        image: threeScaleLogo
      },
      {
        title: 'Red Hat Fuse',
        link: defaultLink,
        image: shadownmanLogo
      },
      {
        title: 'SkyDive',
        link: defaultLink,
        image: defaultLogo
      }
    ]
  },
  {
    title: '3rd Party Applications',
    applications: [
      {
        title: 'AWS',
        link: defaultLink,
        image: awsLogo
      },
      {
        title: 'Kafka',
        link: defaultLink,
        image: kafkaLogo
      },
      {
        title: 'Mongo',
        link: defaultLink,
        image: mongodbLogo
      }
    ]
  },
  {
    title: 'Customer Applications',
    applications: [
      {
        title: 'Application 1',
        link: defaultLink,
        image: defaultLogo
      },
      {
        title: 'Application 2',
        link: defaultLink,
        image: defaultLogo
      },
      {
        title: 'Application 3',
        link: defaultLink,
        image: defaultLogo
      }
    ]
  }
];

class MegaMenuExample extends React.Component {
  state = {
    isDropdownOpen: false,
    isKebabDropdownOpen: false,
    perspective: perspectives[2],
    isPerspectiveModalOpen: false,
    activeGroup: perspectives[2].activeGroup,
    activeItem: perspectives[2].activeItem
  };

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = event => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };

  onKebabDropdownToggle = isKebabDropdownOpen => {
    this.setState({
      isKebabDropdownOpen
    });
  };

  onKebabDropdownSelect = event => {
    this.setState({
      isKebabDropdownOpen: !this.state.isKebabDropdownOpen
    });
  };

  onNavSelect = result => {
    if (result.itemId && result.itemId.endsWith('-link')) {
      return;
    }

    this.setState({
      activeItem: result.itemId,
      activeGroup: result.groupId
    });
  };

  onSwitcher = () => {
    this.setState({
      isPerspectiveModalOpen: true
    });
  };

  setPerspective = (e, perspective) => {
    e.preventDefault();

    this.setState({
      perspective,
      activeItem: perspective.activeItem,
      isPerspectiveModalOpen: false
    });
  };

  renderNavItemLink = (title, href) => (
    <NavItem title={title} key={title}>
      <a
        href={href}
        className="external-link-nav-item"
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
        <ExternalLinkAltIcon className="pf-u-ml-md external-link-nav-item__icon" />
      </a>
    </NavItem>
  );

  getDevNavItems = () => {
    const { activeItem, activeGroup } = this.state;

    return [
      <NavItem title="Topology" key="dev-topology" groupId="dev-topology" isActive={activeItem === 'dev-topology'}>
        Topology
      </NavItem>,
      <NavItem title="Builds" key="dev-builds" groupId="dev-builds" isActive={activeItem === 'dev-builds'}>
        Builds
      </NavItem>,
      <NavExpandable
        title="Advanced"
        key="dev-advanced"
        groupId="dev-advanced"
        isActive={activeGroup === 'dev-advanced'}
      >
        <NavItem groupId="dev-advanced" itemId="dev-projects" isActive={activeItem === 'dev-projects'}>
          Projects
        </NavItem>
        <NavItem groupId="dev-advanced" itemId="dev-status" isActive={activeItem === 'dev-status'}>
          Status
        </NavItem>
        <NavItem groupId="dev-advanced" itemId="dev-events" isActive={activeItem === 'dev-events'}>
          Events
        </NavItem>
        <NavItem groupId="dev-advanced" itemId="dev-search" isActive={activeItem === 'dev-search'}>
          Search
        </NavItem>
      </NavExpandable>
    ];
  };

  getAdminNavItems = () => {
    const { activeItem, activeGroup } = this.state;

    return [
      <NavExpandable
        title="Home"
        key="admin-home"
        groupId="admin-home"
        isActive={activeGroup === 'admin-home'}
        isExpanded
      >
        <NavItem groupId="admin-home" itemId="admin-projects" isActive={activeItem === 'admin-projects'}>
          Projects
        </NavItem>
        <NavItem groupId="admin-home" itemId="admin-status" isActive={activeItem === 'admin-status'}>
          Status
        </NavItem>
        <NavItem groupId="admin-home" itemId="admin-search" isActive={activeItem === 'admin-search'}>
          Search
        </NavItem>
        <NavItem groupId="admin-home" itemId="admin-events" isActive={activeItem === 'admin-events'}>
          Events
        </NavItem>
      </NavExpandable>,
      <NavExpandable
        title="Catalog"
        key="admin-catalog"
        groupId="admin-catalog"
        isActive={activeGroup === 'admin-catalog'}
      >
        <NavItem groupId="admin-catalog" itemId="admin-dev-catalog" isActive={activeItem === 'admin-dev-catalog'}>
          Developer Catalog
        </NavItem>
        <NavItem groupId="admin-catalog" itemId="admin-operators" isActive={activeItem === 'admin-operators'}>
          Installed Operators
        </NavItem>
        <NavItem groupId="admin-catalog" itemId="admin-op-hub" isActive={activeItem === 'admin-op-hub'}>
          OperatorHub
        </NavItem>
        <NavItem groupId="admin-catalog" itemId="admin-op-management" isActive={activeItem === 'admin-op-management'}>
          Operator Management
        </NavItem>
      </NavExpandable>,
      <NavExpandable
        title="Workloads"
        key="admin-workloads"
        groupId="admin-workloads"
        isActive={activeGroup === 'admin-workloads'}
      >
        <NavItem title="Pods" groupId="admin-workloads" itemId="admin-pods" isActive={activeItem === 'admin-pods'}>
          Pods
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-deployments" isActive={activeItem === 'admin-deployments'}>
          Deployments
        </NavItem>
        <NavItem
          groupId="admin-workloads"
          itemId="admin-deployment-configs"
          isActive={activeItem === 'admin-deployment-configs'}
        >
          Deployment Configs
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-stateful-sets" isActive={activeItem === 'admin-stateful-sets'}>
          Stateful Sets
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-secrets" isActive={activeItem === 'admin-secrets'}>
          Secrets
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-config-maps" isActive={activeItem === 'admin-config-maps'}>
          Config Maps
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-cron-jobs" isActive={activeItem === 'admin-cron-jobs'}>
          Cron Jobs
        </NavItem>
        <NavItem title="Jobs" groupId="admin-workloads" itemId="admin-jobs" isActive={activeItem === 'admin-jobs'}>
          Jobs
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-daemon-sets" isActive={activeItem === 'admin-daemon-sets'}>
          Daemon Sets
        </NavItem>
        <NavItem groupId="admin-workloads" itemId="admin-replica-sets" isActive={activeItem === 'admin-replica-sets'}>
          Replica Sets
        </NavItem>
        <NavItem
          groupId="admin-workloads"
          itemId="admin-replication-controllers"
          isActive={activeItem === 'admin-replication-controllers'}
        >
          Replication Controllers
        </NavItem>
        <NavItem
          groupId="admin-workloads"
          itemId="admin-horizontal-pod-autoscalers"
          isActive={activeItem === 'admin-horizontal-pod-autoscalers'}
        >
          Horizontal Pod Autoscalers
        </NavItem>
      </NavExpandable>,
      <NavExpandable
        title="Networking"
        key="admin-networking"
        groupId="admin-networking"
        isActive={activeGroup === 'admin-networking'}
      >
        <NavItem groupId="admin-networking" itemId="admin-services" isActive={activeItem === 'admin-services'}>
          Services
        </NavItem>
        <NavItem groupId="admin-networking" itemId="admin-routes" isActive={activeItem === 'admin-routes'}>
          Routes
        </NavItem>
        <NavItem groupId="admin-networking" itemId="admin-ingres" isActive={activeItem === 'admin-ingres'}>
          Ingres
        </NavItem>
        <NavItem groupId="admin-networking" itemId="admin-policies" isActive={activeItem === 'admin-policies'}>
          Network Policies
        </NavItem>
      </NavExpandable>,
      <NavExpandable title="Builds" key="admin-builds" groupId="admin-builds" isActive={activeGroup === 'admin-builds'}>
        <NavItem groupId="admin-builds" itemId="admin-build-configs" isActive={activeItem === 'admin-build-configs'}>
          Build Configs
        </NavItem>
        <NavItem groupId="admin-builds" itemId="admin-builds" isActive={activeItem === 'admin-builds'}>
          Builds
        </NavItem>
        <NavItem groupId="admin-builds" itemId="admin-image-streams" isActive={activeItem === 'admin-image-streams'}>
          Image Streams
        </NavItem>
      </NavExpandable>,
      <NavExpandable
        title="Monitoring"
        key="admin-monitoring"
        groupId="admin-monitoring"
        isActive={activeGroup === 'admin-monitoring'}
      >
        <NavItem groupId="admin-monitoring" itemId="admin-alerts" isActive={activeItem === 'admin-alerts'}>
          Alerts
        </NavItem>
        <NavItem groupId="admin-monitoring" itemId="admin-silences" isActive={activeItem === 'admin-silences'}>
          Silences
        </NavItem>
        {this.renderNavItemLink('Metrics', defaultLink)}
        {this.renderNavItemLink('Dashboards', defaultLink)}
      </NavExpandable>,
      <NavExpandable
        title="Compute"
        key="admin-compute"
        groupId="admin-compute"
        isActive={activeGroup === 'admin-compute'}
      >
        <NavItem groupId="admin-compute" itemId="admin-nodes" isActive={activeItem === 'admin-nodes'}>
          Nodes
        </NavItem>
        <NavItem groupId="admin-compute" itemId="admin-machines" isActive={activeItem === 'admin-machines'}>
          Machines
        </NavItem>
        <NavItem groupId="admin-compute" itemId="admin-machine-sets" isActive={activeItem === 'admin-machine-sets'}>
          Machine Sets
        </NavItem>
        <NavItemSeparator />
        <NavItem
          groupId="admin-compute"
          itemId="admin-machine-configs"
          isActive={activeItem === 'admin-machine-configs'}
        >
          Machine Configs
        </NavItem>
        <NavItem
          groupId="admin-compute"
          itemId="admin-machine-config-pods"
          isActive={activeItem === 'admin-machine-config-pods'}
        >
          Machine Config Pods
        </NavItem>
      </NavExpandable>,
      <NavExpandable
        title="Administration"
        key="admin-admin"
        groupId="admin-admin"
        isActive={activeGroup === 'admin-admin'}
      >
        <NavItem
          groupId="admin-admin"
          itemId="admin-cluster-settings"
          isActive={activeItem === 'admin-cluster-settings'}
        >
          Cluster Settings
        </NavItem>
        <NavItem groupId="admin-admin" itemId="admin-namespaces" isActive={activeItem === 'admin-namespaces'}>
          Namespaces
        </NavItem>
        <NavItem
          groupId="admin-admin"
          itemId="admin-service-accounts"
          isActive={activeItem === 'admin-service-accounts'}
        >
          Service Accounts
        </NavItem>
        <NavItem groupId="admin-admin" itemId="admin-roles" isActive={activeItem === 'admin-roles'}>
          Roles
        </NavItem>
        <NavItem groupId="admin-admin" itemId="admin-role-bindings" isActive={activeItem === 'admin-role-bindings'}>
          Role Bindings
        </NavItem>
        <NavItem groupId="admin-admin" itemId="admin-resource-quotas" isActive={activeItem === 'admin-resource-quotas'}>
          Resource Quotas
        </NavItem>
        <NavItem groupId="admin-admin" itemId="admin-limit-ranges" isActive={activeItem === 'admin-limit-ranges'}>
          Limit Ranges
        </NavItem>
        <NavItem groupId="admin-admin" itemId="admin-crds" isActive={activeItem === 'admin-crds'}>
          Custom Resource Definitions
        </NavItem>
      </NavExpandable>
    ];
  };

  getMultiClusterNavItems = () => [
    <NavItem title="Topology" key="topology" itemId="multi-cluster-clusters" isActive>
      Clusters
    </NavItem>,
    <NavItemSeparator key="seo" />,
    this.renderNavItemLink('Documentation', defaultLink),
    this.renderNavItemLink('OperatorHub.io', defaultLink),
    this.renderNavItemLink('Cluster Manager Feedback', defaultLink),
    this.renderNavItemLink('Report an OpenShift Bug', defaultLink)
  ];

  getNavItems = () => {
    const { perspective } = this.state;

    let navItems;

    if (perspective.id === 'dev') {
      navItems = this.getDevNavItems();
    } else if (perspective.id === 'admin') {
      navItems = this.getAdminNavItems();
    } else {
      navItems = this.getMultiClusterNavItems();
    }

    return (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList>
          <MegaMenuSwitcher
            title={perspective.title}
            description={perspective.description}
            onSwitch={this.onSwitcher}
          />
          {navItems}
        </NavList>
      </Nav>
    );
  };

  setPerspective = id => {
    this.setState({
      perspective: perspectives.find(perspective => perspective.id === id),
      isPerspectiveModalOpen: false
    });
  };

  getCategories = () => {
    const { isPerspectiveModalOpen, perspective } = this.state;

    if (!isPerspectiveModalOpen) {
      return null;
    }

    const imageStyle = { width: 25 };

    return (
      <React.Fragment>
        <MegaMenuModalCategory key="OpenShift Console" title="OpenShift Console">
          {perspectives.map(nextPerspective => (
            <MegaMenuModalCategoryItem
              key={nextPerspective.id}
              title={nextPerspective.title}
              image={<img src={nextPerspective.image} alt="" style={imageStyle} />}
              isActive={perspective.id === nextPerspective.id}
              onActivate={() => this.setPerspective(nextPerspective.id)}
            />
          ))}
        </MegaMenuModalCategory>
        {externalApplicationCategories.map(category => (
          <MegaMenuModalCategory key={category.title} title={category.title}>
            {category.applications.map(application => (
              <MegaMenuModalCategoryItem
                key={application.title}
                title={application.title}
                image={<img src={application.image} alt="" style={imageStyle} />}
                link={application.link}
                onActivate={() => this.setState({ isPerspectiveModalOpen: false })}
              />
            ))}
          </MegaMenuModalCategory>
        ))}
      </React.Fragment>
    );
  };

  render() {
    const { isDropdownOpen, isKebabDropdownOpen, isPerspectiveModalOpen } = this.state;

    const kebabDropdownItems = [
      <DropdownItem key="1">
        <BellIcon /> Notifications
      </DropdownItem>,
      <DropdownItem key="2">
        <CogIcon /> Settings
      </DropdownItem>
    ];

    const userDropdownItems = [
      <DropdownItem key="1">Link</DropdownItem>,
      <DropdownItem key="2" component="button">
        Action
      </DropdownItem>,
      <DropdownItem key="3" isDisabled>
        Disabled Link
      </DropdownItem>,
      <DropdownItem key="4" isDisabled component="button">
        Disabled Action
      </DropdownItem>,
      <DropdownSeparator key="5" />,
      <DropdownItem key="6">Separated Link</DropdownItem>,
      <DropdownItem key="7" component="button">
        Separated Action
      </DropdownItem>
    ];

    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnLg)}>
          <ToolbarItem>
            <Button id="expanded-example-uid-01" aria-label="Notifications actions" variant={ButtonVariant.plain}>
              <BellIcon />
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button id="expanded-example-uid-02" aria-label="Settings actions" variant={ButtonVariant.plain}>
              <CogIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className={css(accessibleStyles.hiddenOnLg, spacingStyles.mr_0)}>
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onKebabDropdownSelect}
              toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}
              isOpen={isKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </ToolbarItem>
          <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={<DropdownToggle onToggle={this.onDropdownToggle}>Ima User</DropdownToggle>}
              dropdownItems={userDropdownItems}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    const Header = (
      <PageHeader
        logo={<Brand src={imgBrand} alt="Patternfly Logo" />}
        toolbar={PageToolbar}
        avatar={<Avatar src={imgAvatar} alt="Avatar image" />}
        showNavToggle
      />
    );

    const Sidebar = <PageSidebar nav={this.getNavItems()} />;

    const PageBreadcrumb = (
      <Breadcrumb>
        <BreadcrumbItem>Section Home</BreadcrumbItem>
        <BreadcrumbItem to="#" onClick={e => e.preventDefault()}>
          Section Title
        </BreadcrumbItem>
        <BreadcrumbItem to="#" onClick={e => e.preventDefault()}>
          Section Title
        </BreadcrumbItem>
        <BreadcrumbItem to="#" onClick={e => e.preventDefault()} isActive>
          Section Landing
        </BreadcrumbItem>
      </Breadcrumb>
    );

    const PageSkipToContent = (
      <SkipToContent href="#main-content-page-layout-expandable-nav">Skip to Content</SkipToContent>
    );

    return (
      <Page
        style={{ height: '100vh' }}
        header={Header}
        sidebar={Sidebar}
        isManagedSidebar
        skipToContent={PageSkipToContent}
        breadcrumb={PageBreadcrumb}
      >
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Main Title</Text>
            <Text component="p">
              Body text should be Overpass Regular at 16px. It should have leading of 24px because <br />
              of it’s relative line height of 1.5.
            </Text>
          </TextContent>
        </PageSection>
        <PageSection isFilled>
          <Gallery gutter="md">
            {Array.apply(0, Array(10)).map((x, i) => (
              <GalleryItem key={i}>
                <Card>
                  <CardBody>This is a card</CardBody>
                </Card>
              </GalleryItem>
            ))}
          </Gallery>
        </PageSection>
        <MegaMenuModal isOpen={isPerspectiveModalOpen} onClose={() => this.setState({ isPerspectiveModalOpen: false })}>
          {this.getCategories()}
        </MegaMenuModal>
      </Page>
    );
  }
}

export default MegaMenuExample;
