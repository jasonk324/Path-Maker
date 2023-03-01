import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function HorizontalSlider() {
  return (
    <Box 
      width="500px"
     >
      <Slider
        aria-label="Length Slider"
        defaultValue={30}
        valueLabelDisplay="auto"
        step={10}
        marks
        min={10}
        max={110}
      />
    </Box>
  );
}