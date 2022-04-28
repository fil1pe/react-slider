import './App.css'
import Slider from './components/Slider.tsx'

function App() {
  return (
    <Slider className="slider">
      {Array.from(Array(6).keys()).map((_, key) => (
        <div
          className="slide"
          style={{
            backgroundImage:
              'url(https://www.cameraegg.org/wp-content/uploads/2015/06/canon-powershot-g3-x-sample-images-1.jpg)',
          }}
          key={key}
        ></div>
      ))}
    </Slider>
  )
}

export default App
