  import React, { useState } from 'react';
  import TreeNode from './TreeNode';
  
  function findNodeById(nodes, nodeId) {
    for (const node of nodes) {
      if (node.id === nodeId) {
        return node;
      }
      if (node.children) {
        const foundNode = findNodeById(node.children, nodeId);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return null;
  }
  
  function CheckboxTree({ data }) {
    const [checkedNodesSet, setCheckedNodesSet] = useState(new Set());
  
    const toggleNode = (nodeId) => {
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
    };
  
    function getDescendantIds(node, ids = []) {
      if (node) {
        ids.push(node.id);
        if (node.children) {
          for (const child of node.children) {
            getDescendantIds(child, ids);
          }
        }
      }
      return ids;
    }
  
    function updateParentNodes(nodes, checkedSet) {
      nodes.forEach((node) => {
        if (node.children) {
          const allChildrenChecked = node.children.every((child) => checkedSet.has(child.id));

          if (allChildrenChecked) {
            checkedSet.add(node.id);
          } else {
            checkedSet.delete(node.id);
          }
          updateParentNodes(node.children, checkedSet);
        }
      });
  
      setCheckedNodesSet(checkedSet);
    }
  
    const renderTree = (nodes) => {
      return nodes.map((node) => (
        <TreeNode
          key={node.id}
          label={node.label}
          checked={checkedNodesSet.has(node.id)}
          indeterminate={calculateIndeterminate(node)}
          onCheck={() => toggleNode(node.id)}
        >
          {node.children && renderTree(node.children)}
        </TreeNode>
      ));
    };
  
    function calculateIndeterminate(node) {
      if (node.children) {
        const checkedChildren = node.children.filter((child) => checkedNodesSet.has(child.id));
        const allChildrenChecked = checkedChildren.length === node.children.length;
        const someChildrenChecked = checkedChildren.length > 0 && !allChildrenChecked;
        
  
        if (someChildrenChecked) {
          return true;
        }
      }
      return false;
    }
  
    return <div>{renderTree(data)}</div>;
  }
  
  export default CheckboxTree;