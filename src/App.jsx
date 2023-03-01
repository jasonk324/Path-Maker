import React from 'react'
import Grid from './Components/Grid/Grid'
import HorizontalSlider from './Components/Sliders/HorizontalSlider'
import VerticalSlider from './Components/Sliders/VertialSlider'
import { Box } from '@mui/system';
// import Accordion from './Components/testing';

const App = () => {
  return (
    <Box>
      <Box
        backgroundColor="lightgrey"
        m='40px'
      >
        <Grid />
      </Box>
      <Box
        backgroundColor="lightgrey"
        m='40px'
      >
        <HorizontalSlider />
      </Box>
      <Box
        backgroundColor="lightgrey"
        m='40px'
      >
        <VerticalSlider />
      </Box>
      {/* <Accordion /> */}
    </Box>
  )
}

export default App