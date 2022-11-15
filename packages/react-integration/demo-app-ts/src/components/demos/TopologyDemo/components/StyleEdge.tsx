import * as React from 'react';
import { observer } from 'mobx-react';
import { DefaultEdge, Edge, Point, WithContextMenuProps, WithSelectionProps } from '@patternfly/react-topology';

import './RequestTrace.css';

type StyleEdgeProps = {
  element: Edge;
} & WithContextMenuProps &
  WithSelectionProps;

const StyleEdge: React.FunctionComponent<StyleEdgeProps> = ({ element, onContextMenu, contextMenuOpen, ...rest }) => {
  const data = element.getData();

  const passedData = React.useMemo(() => {
    const newData = { ...data };
    Object.keys(newData).forEach(key => {
      if (newData[key] === undefined) {
        delete newData[key];
      }
    });
    return newData;
  }, [data]);

  const traceEdgeOverlay = () => {
    if (element.getType() !== 'request-trace-edge') {
      return null;
    }
    const bendpoints = element.getBendpoints();
    const startPoint = element.getStartPoint();
    const endPoint = element.getEndPoint();

    const d = `M${startPoint.x} ${startPoint.y} ${bendpoints.map((b: Point) => `L${b.x} ${b.y} `).join('')}L${
      endPoint.x
    } ${endPoint.y}`;
    return <path className="request-trace-edge-overlay" d={d} />;
  };

  return (
    <DefaultEdge
      element={element}
      {...rest}
      {...passedData}
      onContextMenu={data?.showContextMenu ? onContextMenu : undefined}
      contextMenuOpen={contextMenuOpen}
    >
      {traceEdgeOverlay()}
    </DefaultEdge>
  );
};

export default observer(StyleEdge);
