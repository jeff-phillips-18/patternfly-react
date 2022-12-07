# @patternfly/react-topology

This package provides Topology View components based on [PatternFly 4][patternfly-4]

### Prerequisites

#### Node Environment

This project currently supports Node [Active LTS](https://github.com/nodejs/Release#release-schedule) releases. Please stay current with Node Active LTS when developing patternfly-react.

For example, to develop with Node 8, use the following:

```
nvm install 8
nvm use 8
```

This project also requires a Yarn version of >=1.6.0. The latest version can be installed [here](https://yarnpkg.com/).

### Installing

```
yarn add @patternfly/react-topology
```

or

```
npm install @patternfly/react-topology --save
```

## Basic Usage

To use React Topology out-of-the-box, you will first need to transform your back-end data into a [Model](https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/types.ts#L16-L20). These model objects contain the information needed to display the nodes and edges. Each node and edge has a set of properties used by PF Topology as well as a data field which can be used to customize the nodes and edges by the application.

You will then need to declare a controller, which can be initialized via the `useVisualizationController()` method.

The `fromModel` method must be called on the controller to create the nodes. `fromModel` will take your data model as a parameter. Your data model should include a `graph` object, on which you will need to set `id` , `type` and `layout`.

To create your topology view component, you can use `TopologyView` to Wrap `<VisualizationSurface>` which can accept `state` as a parameter. The state is application specific. It can be any data the application wants to store/retrieve from the controller. Adding state to the surface allows hooks to update when state changes. The state is useful to keep graph state such as selected elements.

Use a controller to wrap your topology view component. In the example below, this is done via the `VisualizationProvider` which consumes the `Controller` via context.

Three `register` methods are accessed by the controller.

The following two must be declared explicitly\:

- `registerLayoutFactory`\: This method sets the layout of your topology view (e.g. Force, Dagre, Cola, etc.). You can use `defaultLayoutFactory` as a parameter if your application supports all layouts. You can also update `defaultLayout` to a custom implementation if you only want to support a subset of the available layout options.

- `registerComponentFactory`\: This method lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `defaultComponentFactory` as a parameter.

The register method below is initialized in `Visualization.ts`, therefore it doesn't need to be declared unless you want to support a custom implementation which modifies the types.

- `registerElementFactory`\: This method sets the types of the elements being used (e.g. graphs, nodes, edges). `defaultElementFactory` uses types from `ModelKind` and is exported in `index.ts`.

#### Example Component Usage

```ts
import * as React from 'react';
import {
  SELECTION_EVENT,
  SelectionEventListener,
  TopologyView,
  useEventListener,
  useVisualizationController,
  Visualization,
  VisualizationProvider,
  VisualizationSurface
} from '@patternfly/react-topology';
import stylesComponentFactory from './components/stylesComponentFactory';
import defaultLayoutFactory from './layouts/defaultLayoutFactory';
import defaultComponentFactory from './components/defaultComponentFactory';
import { generateDataModel } from './data/generator';
import { useTopologyOptions } from './useTopologyOptions';

const TopologyViewComponent: React.FunctionComponent = () => {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const controller = useVisualizationController();

  const { nodeOptions, edgeOptions, nestedLevel, creationCounts } = useTopologyOptions(controller);

  React.useEffect(() => {
    const dataModel = generateDataModel(
      creationCounts.numNodes,
      creationCounts.numGroups,
      creationCounts.numEdges,
      nestedLevel,
      nodeOptions,
      edgeOptions
    );

    const model = {
      graph: {
        id: 'g1',
        type: 'graph',
        layout: 'Cola'
      },
      ...dataModel
    };

    controller.fromModel(model, false);
    // Don't update on option changes, its handled differently to not re-layout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creationCounts]);

  useEventListener<SelectionEventListener>(SELECTION_EVENT, ids => {
    setSelectedIds(ids);
  });

  return (
    <TopologyView>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};

export const TopologyBaseline = React.memo(() => {
  const controller = new Visualization();
  controller.registerLayoutFactory(defaultLayoutFactory);
  controller.registerComponentFactory(defaultComponentFactory);
  controller.registerComponentFactory(stylesComponentFactory);

  return (
    <VisualizationProvider controller={controller}>
      <TopologyViewComponent />
    </VisualizationProvider>
  );
});
```
