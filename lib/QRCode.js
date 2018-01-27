import React from 'react'
import PropTypes from 'prop-types'
import Canvas from './Canvas'
import qr from 'qr.js'
import { View, PixelRatio } from 'react-native'

function renderCanvas(canvas) {
  var ctx = canvas.getContext('2d')
  var size = this.size
  var fgColor = this.fgColor
  var bgColor = this.bgColor
  canvas.width = size
  canvas.height = size
  canvas.style.left = (window.innerWidth - size) / 2 + 'px'
  if(window.innerHeight > size) canvas.style.top = (window.innerHeight - size) / 2 + 'px'
  ctx.fillRect(0, 0, size, size)
  var cells = this.cells
  var cellWidth = this.size / cells.length
  var cellHeight = this.size / cells.length
  var nRoundedWidth = Math.round(cellWidth)
  var nRoundedHeight = Math.round(cellHeight)
  cells.forEach(function(row, rowIndex) {
    row.forEach(function(column, columnIndex) {
      var nLeft = columnIndex * cellWidth
      var nTop = rowIndex * cellHeight
      ctx.fillStyle = ctx.strokeStyle = column ? bgColor : fgColor
      ctx.lineWidth = 1
      ctx.fillRect(nLeft, nTop, cellWidth, cellHeight)
      ctx.strokeRect(
        Math.floor(nLeft) + 0.5,
        Math.floor(nTop) + 0.5,
        nRoundedWidth,
        nRoundedHeight
      )
      ctx.strokeRect(
        Math.ceil(nLeft) - 0.5,
        Math.ceil(nTop) - 0.5,
        nRoundedWidth,
        nRoundedHeight
      )
    })
  })
}

export default class QRCode extends React.Component {

  static propTypes = {
    value: PropTypes.string,
    size: PropTypes.number,
    bgColor: PropTypes.string,
    fgColor: PropTypes.string,
  }

  static defaultProps = {
    value: 'https://github.com/cssivision',
    fgColor: 'white',
    bgColor: 'black',
    size: 128,
  }

  utf16to8(str) {
    var out, i, len, c
    out = ''
    len = str.length
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i)
      if ((c >= 0x0001) && (c <= 0x007F)) {
        out += str.charAt(i)
      } else if (c > 0x07FF) {
        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
        out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F))
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F))
      } else {
        out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F))
        out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F))
      }
    }
    return out
  }

  render() {
    const pixelRatio = PixelRatio.get() * 2;
    const size = this.props.size * pixelRatio;
    const value = this.utf16to8(this.props.value)
    const cells = qr(value).modules;
    // console.log(`canvas size: ${size}.\nprops size: ${this.props.size}.\npixel ratio: ${pixelRatio}.\ncells: ${cells}`)
    return (
      <View>
          <Canvas
            context={{
              size,
              value: this.props.value,
              bgColor: this.props.bgColor,
              fgColor: this.props.fgColor,
              cells,
            }}
            render={renderCanvas}
            style={{height: this.props.size, width: this.props.size}}
          />
      </View>
    )
  }
}
