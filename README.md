# React Slider

This is a simple slider implementation in React. Make your own carousels of images, texts or whatever you need easily with this component and some stylesheet.

## Installation

### npm

```bash
$ npm install @fil1pe/react-slider --save
```

### yarn

```bash
$ yarn add @fil1pe/react-slider
```

## Usage

In your JSX file, import the slider component as in the [example below](#example). You are free to customize it using the prop className and the classes that follow.

## Classes

| Class name | Description |
| :-: | :-: |
| .main | div wrapping the track and arrows |
| .arrow | prev/next button |
| .disabled | if arrow is disabled |
| .track | wraps the ul containing the slides |
| .dots | ul with the dots |
| .active | active dot |
| .pages | pagination info |

## Component props

| Property | Default value | Required | Description |
| :-: | :-: | :-: | :--: |
| className | none | false | Class name of your slider component wrapper |
| slidesToShow | 1 | false | Number of slides per page |
| slidesToScroll | slidesToShow | false | Number of slides to scroll on click on prev/next |
| finite | false | false | Defines whether the slider should have finite scrolling or not |
| renderArrow | `(props, type) => <button {...props}>{type === ArrowType.Next ? 'Next' : 'Previous'}</button>` | false | Allows customizing the arrow buttons |
| autoplayTimeout | none (∞) | false | Autoplay interval in milliseconds |
| slidesToAppend | none | false | Additional number of slides to append before and after |
| adaptiveHeight | false | false | Variable height |
| pagination | 0 | false | Shows current slide index alongside the total number of slides<br/>(1 for no spacing, 2 otherwise) |
| onSlideChange(int) | none | false | Function triggered on slide change |

## Methods

Referencing the slider allows you to manually change the current slide through the methods below.

| Method | Arguments | Description |
| :-: | :-: | :-: |
| slickGoTo | slide index | Navigates to the specified slide |
| slickNext | none | Goes to the next slide |
| slickPrev | none | Goes to the previous slide |

## Example

```js
import React from 'react'
import Slider from '@fil1pe/react-slider'

function App() {
  return (
    <Slider slidesToShow={2} slidesToScroll={1} className="slider">
      <div class="slide">1</div>
      <div class="slide">2</div>
      <div class="slide">3</div>
      <div class="slide">4</div>
      <div class="slide">5</div>
    </Slider>
  )
}

export default App
```