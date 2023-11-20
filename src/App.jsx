import React, { useState, useEffect } from 'react';
import CheckboxTreeView from './CheckboxTree';


function App() {
  const [rootLevels, setRootLevels] = useState(1);
  const [data, setData] = useState([]);

  const generateDynamicData = (rootLevels) => {
    const getRandomNumber = () => Math.floor(Math.random() * 5) + 1;

    const generateTree = (level, parentId) => {
      return Array.from({ length: level === 0 ? getRandomNumber() : getRandomNumber() }, (_, index) => {
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
    generateDynamicData(rootLevels);
  }, [rootLevels]);

  return (
    <div className="App">
      <h1>Checkbox Tree</h1>
      <div>
        <label>Number of root levels:</label>
        <input
          type="number"
          value={rootLevels}
          onChange={(e) => setRootLevels(parseInt(e.target.value))}
        />
      </div>
      <CheckboxTreeView data={data} />
    </div>
  );
}

export default App;