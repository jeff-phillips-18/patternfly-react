---
id: Topology view
section: extensions
---

Note: Topology lives in its own package at [`@patternfly/react-topology`](https://www.npmjs.com/package/@patternfly/react-topology)

## Basic Usage

To use React Topology out-of-the-box, you will first need to transform your back-end data into a [Model](https://github.com/patternfly/patternfly-react/blob/main/packages/react-topology/src/types.ts#L16-L20). These model objects contain the information needed to display the nodes and edges. Each node and edge has a set of properties used by PF Topology as well as a data field which can be used to customize the nodes and edges by the application.

You will then need to declare a controller, which can be initialized via the `useVisualizationController()` method.

The `fromModel` method must be called on the controller to create the nodes. `fromModel` will take your data model as a parameter. Your data model should include a `graph` object, on which you will need to set `id` , `type` and `layout`.

To create your topology view component, you can use `TopologyView` to Wrap `<VisualizationSurface>` which can accept `state` as a parameter. The state is application specific. It can be any data the application wants to store/retrieve from the controller. Adding state to the surface allows hooks to update when state changes. The state is useful to keep graph state such as selected elements.

Use a controller to wrap your topology view component. In the example below, this is done via the `VisualizationProvider` which consumes the `Controller` via context.

Three `register` methods are accessed by the controller.

The following two must be declared explicitly\:

- `registerLayoutFactory`: This method sets the layout of your topology view (e.g. Force, Dagre, Cola, etc.). You can use `defaultLayoutFactory` as a parameter if your application supports all layouts. You can also update `defaultLayout` to a custom implementation if you only want to support a subset of the available layout options.

- `registerComponentFactory`: This method lets you customize the components in your topology view (e.g. nodes, groups, and edges). You can use `defaultComponentFactory` as a parameter.

The register method below is initialized in `Visualization.ts`, therefore it doesn't need to be declared unless you want to support a custom implementation which modifies the types.

- `registerElementFactory`: This method sets the types of the elements being used (e.g. graphs, nodes, edges). `defaultElementFactory` uses types from `ModelKind` and is exported in `index.ts`.