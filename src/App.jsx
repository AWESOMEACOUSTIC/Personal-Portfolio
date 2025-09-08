import React from 'react'
import StripGallery from './sections/StripGallery'
import CardStackSection from './sections/CardStackSection'
import TextMotion from './sections/TextMotion'
import GlowText from './sections/GlowText'
import CardStack from './sections/CardStack'


function App() {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
      {/* <StripGallery /> */}
      {/* <CardStackSection /> */}
      {/* <TextMotion /> */}
      {/* <GlowText>Glow</GlowText> */}
      <CardStack/>
    </div>
  )
}

export default App