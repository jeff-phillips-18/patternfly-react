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

  //   React.useEffect(() => {
  //     controller.getGraph().setDetailsLevelThresholds({
  //       low: lowScale,
  //       medium: medScale
  //     });
  //   }, [controller, lowScale, medScale]);

  //   React.useEffect(() => {
  //     const currentModel = controller.toModel();
  //     const nodes = currentModel.nodes;
  //     if (nodes.length) {
  //       const updatedNodes: NodeModel[] = nodes.map((node, index) => {
  //         if (node.group) {
  //           return node;
  //         }
  //         return {
  //           ...node,
  //           ...generateNode(index, nodeOptions)
  //         };
  //       });
  //       controller.fromModel({ nodes: updatedNodes, edges: currentModel.edges });
  //     }
  //     // Don't update on controller change
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [nodeOptions]);

  //   React.useEffect(() => {
  //     const currentModel = controller.toModel();
  //     const edges = currentModel.edges;
  //     if (edges.length) {
  //       const updatedEdges: EdgeModel[] = edges.map((edge, index) => ({
  //         ...edge,
  //         ...generateEdge(index, edge.source, edge.target, edgeOptions)
  //       }));
  //       controller.fromModel({ edges: updatedEdges, nodes: currentModel.nodes });
  //     }
  //   }, [edgeOptions, controller]);

  return (
    <TopologyView>
      <VisualizationSurface state={{ selectedIds }} />
    </TopologyView>
  );
};

export const TopologyBaselineDemo = React.memo(() => {
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
