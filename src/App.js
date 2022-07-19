import './App.css'
import Slider from './components/Slider.tsx'

const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']

function App() {
  return (
    <Slider
      className="example-slider"
      slidesToShow={2}
      slidesToScroll={1}
      autoplayTimeout={4000}
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
  )
}

export default App
