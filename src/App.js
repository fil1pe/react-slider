import { useRef } from 'react'
import './App.css'
import Slider from './components/Slider.tsx'

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

function App() {
  const ref = useRef()

  return (
    <>
      <Slider
        className="example-slider"
        slidesToShow={2}
        slidesToScroll={1}
        autoplayTimeout={4000}
        ref={ref}
        pagination={2}
      >
        {colors.map((color, key) => (
          <div
            className="slide"
            style={{
              background: color,
            }}
            key={key}
          ></div>
        ))}
      </Slider>
      <button onClick={() => ref.current.slickGoTo(0)}>First slide</button>
    </>
  )
}

export default App
