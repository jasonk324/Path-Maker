import React from 'react';
import './Node.css';
import { Box } from '@mui/system';

const Node = ({
  col,
  isFinish,
  isStart,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  row,
}) => {
  
  const extraClassName = isFinish 
    ? 'node-finish'
    : isStart 
    ? 'node-start' 
    : isWall
    ? 'node-wall'
    : '';

  return (
    <Box
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    >
    </Box>
  )
}

export default Node