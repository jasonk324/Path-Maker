import React, { useState, useEffect } from 'react';
import Node from './Components/Node/Node'
import { dijkstra, getNodesInShortestPathOrder } from './Components/Algorithms/dijkstra';
import { Box } from '@mui/system';
import { Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './App.css';

const switchData = [
  { id: 1, label: 'Starting', color: '#9CEE8C' }, 
  { id: 2, label: 'Ending', color: '#EE8C8C' }, 
  { id: 3, label: 'Open Path', color: '#DCDCDC' }, 
  { id: 4, label: 'Barrier', color: '#8C9FEE' }, 
];

const App = () => {

  const initStartRow = 15
  const initStartCol = 10
  const initEndRow = 10
  const initEndCol = 80 

  const [startNode, setStartNode] = useState({row:initStartRow, col:initStartCol})
  const [endNode, setEndNode] = useState({row:initEndRow, col:initEndCol})
  const [selectedSwitch, setSelectedSwitch] = useState(3);
  const [grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  useEffect(() => {
    getGridInfo();
  }, []);

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    console.log("trying to select the file")
    setSelectedFile(event.target.files[0]);
    console.log(selectedFile)
  };

  const handleFormSubmit = (event) => {
    console.log("Trying to submit the file");
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", selectedFile);
  
    fetch("http://127.0.0.1:8000/api/upload-image/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("PLEASE:", data);
        let gridNew = [];
        for (let row = 0; row < data.length; row++) {
          const currentRow = [];
          for (let col = 0; col < data[0].length; col++) {
            currentRow.push(createNode(col, row, data[row][col]));
          }
          gridNew.push(currentRow);
        }
        setGrid(gridNew);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  // const getInitialGrid = () => {
  //   let grid_new = []
  //   let rows_amount = 50
  //   let col_amount = 97
  //   for (let row = 0; row < rows_amount; row++) {
  //     const currentRow = [];
  //     for (let col = 0; col < col_amount; col++) {
  //       currentRow.push(createNode(col, row, 0));
  //     }
  //     grid_new.push(currentRow);
  //   }
  //   return grid_new;
  //   };
  
  let getGridInfo = async () => {
    let response  = await fetch(`http://127.0.0.1:8000/api/recieve-init/`)
    let data = await response.json();
    let gridNew = [];
    for (let row = 0; row < data.length; row++) {
    const currentRow = [];
    for (let col = 0; col < data[0].length; col++) {
      currentRow.push(createNode(col, row, data[row][col]));
    }
    gridNew.push(currentRow);
    }
    setGrid(gridNew);
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

  // const getInitialGrid = () => {
  //   console.log("Trying to initalize the grid")
  //   let grid_new = []
  //   let rows_amount = grid.length
  //   let col_amount = grid[0].length
  //   for (let row = 0; row < rows_amount; row++) {
  //     const currentRow = [];
  //     for (let col = 0; col < col_amount; col++) {
  //       currentRow.push(createNode(col, row, grid[row][col]));
  //     }
  //     grid_new.push(currentRow);
  //   }
  //   return grid_new;
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
    
  const createNode = (col, row, wall) => {
    let wallInput = false
    if (wall === 1) {
      wallInput = true
    } 
    return {
      col,
      row,
      isStart: row === startNode['row'] && col === startNode['col'],
      isFinish: row === endNode['row'] && col === endNode['col'],
      distance: Infinity,
      isVisited: false,
      isWall: wallInput,
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
    <div className="container dark">
    <div className="app">
    <Box
      display='grid'
      gap='5px'
      gridTemplateColumns='repeat(5, 1fr)'
    >
      <Box
        gridColumn='span 1'
        bgcolor='#5F8183'
        p='15px'
        m='auto'>
        <Box
          borderRadius="10px"
          bgcolor='#424242'>
          <Typography variant='h6' fontWeight='800' textAlign='center'>PATH MAKER</Typography>
        </Box>
        <Typography variant='body1' fontWeight='500' textAlign="justify">
          When interacting with the map, depending on the switch you have selected, a different color square will be placed.
        </Typography>
        <Box 
          p='10px 0px 10px 55px'
        >
          <FormGroup
          textAlign='center'>
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
        </Box>
        <Box
        p='10px'>
          <Typography variant='body1' fontWeight='500' textAlign="center">
            Insert and Upload a Map
          </Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              type="file"
              // label="Select an image file"
              onChange={handleFileSelect}
              hidden
            />
            <Box ml='55px' mt='10px'>
              <Button type="submit" variant="contained" color='info'>
                Upload
              </Button>
            </Box>
          </form>
        </Box>
        <Box ml='40px'>
          <Button variant="contained" onClick={visualizeDijkstra} color='success'>
            Visualize Path
          </Button>
        </Box>
      </Box>
      <Box 
        gridColumn='span 4'
        bgcolor='#C6DBDD'
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
    </div>
    </div>
  )
}

export default App;