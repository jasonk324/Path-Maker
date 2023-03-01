import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export default function VerticalSlider() {
  return (
    <Box 
      height="500px"
     >
      <Slider
        aria-label="Temperature"
        orientation="vertical"
        valueLabelDisplay="auto"
        marks={true}
        step={10}
        min={10}
        max={110}
        defaultValue={30}
      />
    </Box>
  );
}