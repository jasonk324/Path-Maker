import React, { useState, useEffect } from 'react';
import Node from './Components/Node/Node'
import { dijkstra, getNodesInShortestPathOrder } from './Components/Algorithms/dijkstra';
import { Box } from '@mui/system';
import { Button } from '@mui/material';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const switchData = [
  { id: 1, label: 'Starting', color: '#009C07' }, 
  { id: 2, label: 'Ending', color: '#FF0000' }, 
  { id: 3, label: 'Checkpoint', color: '#00C5FF' }, 
  { id: 4, label: 'Open Path', color: '#DCDCDC' }, 
  { id: 5, label: 'Barrier', color: '#32387E' }, 
];

const App = () => {

  const initStartRow = 15
  const initStartCol = 10
  const initEndRow = 10
  const initEndCol = 80 

  const [startNode, setStartNode] = useState({row:initStartRow, col:initStartCol})
  const [endNode, setEndNode] = useState({row:initEndRow, col:initEndCol})
  const [selectedSwitch, setSelectedSwitch] = useState(4);
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [temp, setTemp] = useState('Let see');

  useEffect(() => {
    getGridInfo()
  }, [])

  useEffect(() => {
    const initialGrid = getInitialGrid();
    setGrid(initialGrid);
  }, []);

  let getGridInfo = async () => {
    let response  = await fetch(`http://127.0.0.1:8000/api/`)
    let data = await response.json();
    console.log('DATA:', data)
    setGrid(data)
  }

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGrid(grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGrid(grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const handleSwitchClick = (index) => {
    setSelectedSwitch(index);
  };

  const updateStart = (rowUpdate, colUpdate) => {
    setStartNode({row:rowUpdate, col:colUpdate})
  };

  const updateEnd = (rowUpdate, colUpdate) => {
    setEndNode({row:rowUpdate, col:colUpdate})
  };

  const getNewGrid = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    let newNode = {...node}
    if (switchData[selectedSwitch]['label'] == 'Barrier') {
      newNode = {...node, isWall: true};
    } else if (switchData[selectedSwitch]['label'] === 'Starting') {
      newNode = {...node, isStart: true}
      let oldStart = {...newGrid[startNode['row']][startNode['col']], isStart: false}
      newGrid[startNode['row']][startNode['col']] = oldStart
      updateStart(row, col)
    } else if (switchData[selectedSwitch]['label'] === 'Ending') {
      newNode = {...node, isFinish: true}
      let oldEnd = {...newGrid[endNode['row']][endNode['col']], isFinish: false}
      newGrid[endNode['row']][endNode['col']] = oldEnd
      updateEnd(row, col)
    } else if (switchData[selectedSwitch]['label'] === 'Open Path') {
      newNode = {...node, isWall: false};
    } else if (selectedSwitch['label'] === 'Checkpoint') {
      newNode = {...node}
    }
    newGrid[row][col] = newNode;
    return newGrid;
  };

  const getInitialGrid = () => {
    let grid_new = []
    let rows_amount = grid.length
    let col_amount = grid[0].length
    for (let row = 0; row < rows_amount; row++) {
      const currentRow = [];
      for (let col = 0; col < col_amount; col++) {
        currentRow.push(createNode(col, row, grid[row][col]));
      }
      grid_new.push(currentRow);
    }
    return grid_new;
    };

  // const getInitialGrid = () => {
  //   const grid = [];
  //   for (let row = 0; row < 50; row++) {
  //     const currentRow = [];
  //     for (let col = 0; col < 97; col++) {
  //       currentRow.push(createNode(col, row));
  //     }
  //     grid.push(currentRow);
  //   }
  //   return grid;
  //   };

  // const resetGrid = () => {
  //   for (let row = 0; row < 30; row++) {
  //     for (let col = 0; col < 97; col++) {
  //       let nodeClassName = document.getElementById(`node-${row}-${col}`).className
  //       if (nodeClassName === 'node node-visited' || nodeClassName === 'node node-shortest-path') {
  //         document.getElementById(`node-${row}-${col}`).className = 'node'
  //       }
  //     }
  //   }
  //   setStartNode({row:initStartRow, col:initStartCol})
  //   setEndNode({row:initEndRow, col:initEndCol})
  //   console.log(startNode)
  //   console.log(endNode)
  //   const initialGrid = getInitialGrid();
  //   setGrid(initialGrid);
  // }
    
  const createNode = (col, row, isWall) => {
    let wallInput = false
    if (isWall === 1) {
      wallInput = true
    } 
    return {
      col,
      row,
      isStart: row === startNode['row'] && col === startNode['col'],
      isFinish: row === endNode['row'] && col === endNode['col'],
      distance: Infinity,
      isVisited: false,
      sWall: wallInput,
      previousNode: null,
    };
  };

  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
      }, 5 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, 25 * i);
    }
  };

  const visualizeDijkstra = () => {
    const startNodeNode = grid[startNode['row']][startNode['col']];
    const finishNodeNode = grid[endNode['row']][endNode['col']];
    const visitedNodesInOrder = dijkstra(grid, startNodeNode, finishNodeNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNodeNode);
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  return (
    <Box
      display='grid'
      gap='5px'
      gridTemplateColumns='repeat(5, 1fr)'
    >
      <Box
        gridColumn='span 1'
        bgcolor='#F3D6D6'
        p='15px'
        m='auto'>
        <Box m='4px'>
          <Button variant="contained" onClick={visualizeDijkstra}>
              Visualize Path
          </Button>
        </Box>
        <FormGroup>
        {switchData.map((switchItem, index) => (
          <FormControlLabel
            key={switchItem.id}
            control={
              <Switch
                checked={selectedSwitch === index}
                onChange={() => handleSwitchClick(index)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track' : {
                    backgroundColor: switchItem.color,
                  },
                  '& .MuiSwitch-thumb': {
                    backgroundColor: switchItem.color,
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: switchItem.color,
                  },
                }}
              />
            }
            label={switchItem.label}
          />
          ))}
        </FormGroup>
        {/* <Box m='4px' justifyContent='center'>
          <Button variant="contained" onClick={resetGrid}>
              Reset Grid
          </Button>
        </Box> */}
      </Box>
      <Box 
        gridColumn='span 4'
        bgcolor='#EFD8FF'
        p='15px'
        m='auto'
      >
        {grid.map((row, rowIdx) => {
          return (
            <Box key={rowIdx} display='flex'>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseIsPressed={mouseIsPressed}
                    onMouseDown={() => handleMouseDown(row, col)}
                    onMouseEnter={() => handleMouseEnter(row, col)}
                    onMouseUp={handleMouseUp}
                    row={row}></Node>
                  );
                  })}
            </Box>
          );
        })}
      </Box>
    </Box>
  )
}

export default App;