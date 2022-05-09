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

In your JSX file, import the slider component and add at least the prop className. In order for it to work, you must set some styles in your stylesheet file (you may use [CSS-modules](https://github.com/css-modules/css-modules) with global selectors). The track children width is one you must write. For example, if you'd like to show only one slide per page, this must be set:

```css
.slider .track > ul > * {
  flex: 0 0 100%;
}
```

For two slides per page:

```css
.slider .track > ul > * {
  flex: 0 0 50%;
}
```

And so on. Also remember to put that number of slides into the prop slidesToShow of the slider.

## Props

| Property | Default value | Required | Description |
| :-: | :-: | :-: | :--: |
| className | none | **true** | Class name of your slider component wrapper |
| slidesToShow | 1 | false | Number of slides per page |
| slidesToScroll | slidesToShow | false | Number of slides to scroll on click on prev/next |
| finite | false | false | Defines whether the slider should have finite scrolling or not |
| renderArrow | `(props) => <button {...props}></button>` | false | Allows customizing the arrow buttons |

## Classes

| Class name | Description |
| :-: | :-: |
| .main | div wrapping the track and arrows |
| .arrow | prev¹/next² button |
| .disabled | if arrow is disabled |
| .track | wraps the ul containing the slides |
| .dots | ul with the dots |
| .active | active dot |

¹:first-child ²:last-child

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