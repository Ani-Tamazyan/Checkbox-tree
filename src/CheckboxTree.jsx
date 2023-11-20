import React, { useState, useCallback, useMemo, useEffect } from 'react';
import TreeNode from './TreeNode';
import { VariableSizeList as List } from 'react-window';
import debounce from 'lodash/debounce';

function findNodeById(nodes, nodeId) {
  let stack = [...nodes];
  while (stack.length > 0) {
    const node = stack.pop();
    if (node.id === nodeId) {
      return node;
    }
    if (node.children) {
      stack = [...stack, ...node.children];
    }
  }
  return null;
}

const CheckboxTree = ({ data }) => {
  const [checkedNodesSet, setCheckedNodesSet] = useState(new Set());

  const toggleNode = useCallback((nodeId) => {
    const isChecked = checkedNodesSet.has(nodeId);
    const newCheckedNodesSet = new Set(checkedNodesSet);

    if (isChecked) {
      const uncheckedIds = getDescendantIds(findNodeById(data, nodeId));
      uncheckedIds.forEach((id) => newCheckedNodesSet.delete(id));
    } else {
      const checkedIds = getDescendantIds(findNodeById(data, nodeId), [nodeId]);
      checkedIds.forEach((id) => newCheckedNodesSet.add(id));
    }

    setCheckedNodesSet(newCheckedNodesSet);
    updateParentNodes(data, newCheckedNodesSet);
  }, [data, checkedNodesSet]);

  const debouncedToggleNode = useMemo(() => debounce(toggleNode, 300), [toggleNode]);

  const handleCheck = useCallback((nodeId) => () => {
    debouncedToggleNode(nodeId);
  }, [debouncedToggleNode]);

  const getDescendantIds = useCallback((node, ids = []) => {
    let stack = [node];

    while (stack.length > 0) {
      const currentNode = stack.pop();
      ids.push(currentNode.id);
      if (currentNode.children) {
        stack = [...stack, ...currentNode.children];
      }
    }
    return ids;
  }, []);

  const updateParentNodes = useCallback((nodes, checkedSet) => {
    let stack = [...nodes];

    while (stack.length > 0) {
      const node = stack.pop();

      if (node.children) {
        const allChildrenChecked = node.children.every((child) => checkedSet.has(child.id));

        if (allChildrenChecked) {
          checkedSet.add(node.id);
        } else {
          checkedSet.delete(node.id);
        }
        stack = [...stack, ...node.children];
      }
    }

    setCheckedNodesSet(checkedSet);
  }, []);

  const calculateIndeterminate = useCallback((node) => {
    if (node.children) {
      const checkedChildren = node.children.filter((child) => checkedNodesSet.has(child.id));
      const allChildrenChecked = checkedChildren.length === node.children.length;
      const someChildrenChecked = checkedChildren.length > 0 && !allChildrenChecked;

      if (someChildrenChecked) {
        return true;
      }
    }
    return false;
  }, [checkedNodesSet]);

  const flattenTree = (node, flatArray = [], depth = 0) => {
    flatArray.push({ ...node, depth });

    if (node.children) {
      node.children.forEach((child) => flattenTree(child, flatArray, depth + 1));
    }

    return flatArray;
  };

  const flattenedData = useMemo(() => flattenTree(data[0] || {}), [data]);

  
  const rowRenderer = ({ index, style }) => {
    if (!flattenedData || index >= flattenedData.length) {
      return null;
    }
    console.log(`Rendering item at index ${index}`);
    const currentNode = flattenedData[index];
    const marginLeft = currentNode.depth * 17;

    return (
      <div key={currentNode.id} style={{ ...style, marginLeft }}>
        <TreeNode
          label={currentNode.label}
          checked={checkedNodesSet.has(currentNode.id)}
          indeterminate={calculateIndeterminate(currentNode)}
          onCheck={handleCheck(currentNode.id)}
        />
      </div>
    );
  };

  return (
    <List
      height={910}
      itemCount={flattenedData.length}
      itemSize={() => 20}
      width={1800}
    >
      {rowRenderer}
    </List>
  );
};

export default React.memo(CheckboxTree);




