import React from 'react'
import Toolbar from './Toolbar';
import { navigate } from './constants'

class CustomToolbar extends Toolbar {
  render() {
    const { date } = this.props;

    return (
      <div className="rbc-toolbar">
        <button onClick={this.handleButtonClick}>Custom Button</button>
        <input type="text" onChange={this.handleInputChange} />
        <span className="rbc-toolbar-label">{this.props.label}</span>
        <button onClick={this.navigate.bind(null, navigate.PREVIOUS)}>back</button>
        <button onClick={this.navigate.bind(null, navigate.TODAY)}>today</button>
        <button onClick={this.navigate.bind(null, navigate.NEXT)}>next</button>
      </div>
    );
  }

  handleButtonClick = () => {
    console.log('Button Clicked!');
  };

  handleInputChange = (event) => {
    console.log('Input Value: ', event.target.value);
  };
}

export default CustomToolbar;
