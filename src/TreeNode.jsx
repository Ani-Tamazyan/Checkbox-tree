import React from 'react';
import IndeterminateCheckbox, { CHECKED, UNCHECKED, INDETERMINATE } from './IndeterminateCheckbox';

function TreeNode({ label, children, onCheck, checked, indeterminate }) {
  const handleCheck = () => {
    onCheck();
  };

  return (
    <div className="tree-node">
      <label>
        <IndeterminateCheckbox
          value={checked ? CHECKED : indeterminate ? INDETERMINATE : UNCHECKED}
          onChange={handleCheck}
        />
        {label}
      </label>
      <div className="child-nodes">{children}</div>
    </div>
  );
}

export default TreeNode;

