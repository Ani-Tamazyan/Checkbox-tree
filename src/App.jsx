import React, { useState, useEffect } from 'react';
import CheckboxTreeView from './CheckboxTree';

function App() {
  const [rootChildren, setRootChildren] = useState(2); 
  const [childChildren, setChildChildren] = useState(2); 
  const [data, setData] = useState([]);
  const [rootLevels, setRootLevels] = useState(1); 

 
  const generateDynamicData = (rootLevels, rootChildren, childChildren) => {
    const generateTree = (level, parentId) => {
      return Array.from({ length: level === 0 ? rootChildren : childChildren }, (_, index) => {
        const id = parentId * 10 + index + 1;
        return {
          id,
          label: `Node ${id}`,
          children: level > 0 ? generateTree(level - 1, id) : null,
        };
      });
    };

    const rootData = {
      id: 0,
      label: 'Root Node',
      children: generateTree(rootLevels - 1, 0),
    };

    setData([rootData]); 
  };

  useEffect(() => {
    generateDynamicData(rootLevels, rootChildren, childChildren);
  }, [rootLevels, rootChildren, childChildren]);

  return (
    <div className="App">
      <h1>Dynamic Checkbox Tree</h1>
      <div>
        <label>Number of root levels:</label>
        <input
          type="number"
          value={rootLevels}
          onChange={(e) => setRootLevels(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Number of root children:</label>
        <input
          type="number"
          value={rootChildren}
          onChange={(e) => setRootChildren(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>Number of child children:</label>
        <input
          type="number"
          value={childChildren}
          onChange={(e) => setChildChildren(parseInt(e.target.value))}
        />
      </div>
      <CheckboxTreeView data={data} />
    </div>
  );
}

export default App;




