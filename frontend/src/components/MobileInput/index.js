import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Input } from 'components';
import classNames from 'classnames';

class MobileInput extends Component {
  state = {
    value: '+7 (___) ___-__-__',
    numbers: [
      { position: 4, value: null },
      { position: 5, value: null },
      { position: 6, value: null },

      { position: 9, value: null },
      { position: 10, value: null },
      { position: 11, value: null },

      { position: 13, value: null },
      { position: 14, value: null },

      { position: 16, value: null },
      { position: 17, value: null },
    ],
    position: null,
  };

  componentDidMount() {
    this.input = this.refs.input.refs.input;
    this.input.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
   this.input.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if ([37, 38, 39, 40].includes(e.keyCode)) e.preventDefault();
  };

  componentDidUpdate() {
    const { numbers, value } = this.state;
    if (numbers.every(({ value }) => value !== null)) this.props.switchMobileFull(true);
    else this.props.switchMobileFull(false);
  }

  setCursor = () => {
    if (this.state.numbers.every(({ value }) => value !== null)) return this.input.setSelectionRange(18, 18);
    const cursor = this.state.numbers.find(({ value }) => value === null).position;
    this.input.setSelectionRange(cursor, cursor);
  };

  handleChange = (newValue) => {
    const { onChange } = this.props;
    const { value: oldValue, numbers } = this.state;
    const prevNumberCursor = numbers.every(({ value }) => value !== null) ? 18 : numbers.find(({ value }) => value === null).position;
    switch (newValue.length) {
      case 17:
        if (numbers.every(({ value }) => value === null)) return this.forceUpdate(this.setCursor);
        const deletedSymbol = newValue[prevNumberCursor - 1];
        const deleteNumberIdx = numbers.filter(({ value }) => value !== null).length - 1;
        return this.setState({ numbers: [
          ...numbers.slice(0, deleteNumberIdx),
          { ...numbers[deleteNumberIdx], value: null },
          ...numbers.slice(deleteNumberIdx + 1)
        ]}, () => (this.setCursor(), onChange(this.getValue()))) ;
      case 19:
        if (numbers.every(({ value }) => value)) return this.forceUpdate(this.setCursor);
        const addedSymbol = newValue[prevNumberCursor];
        if (!Number.isInteger(+addedSymbol)) return this.forceUpdate(this.setCursor);
        const addedNumberIdx = numbers.findIndex(({ value }) => !value);
        return this.setState({ numbers: [
          ...numbers.slice(0, addedNumberIdx),
          { ...numbers[addedNumberIdx], value: addedSymbol },
          ...numbers.slice(addedNumberIdx + 1)
        ]}, () => (this.setCursor(), onChange(this.getValue())));
      case 0:
        return this.setState(
          { numbers: numbers.map(number => ({ ...number, value: null })) },
          () => (this.setCursor(), onChange(this.getValue()))
        );
      default:
        return this.forceUpdate(this.setCursor);
    }
  };

  getValue = () => {
    const numbers = this.state.numbers.map(({ value }) => value || '_').join('');
    return `+7 (${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 8)}-${numbers.slice(8)}`;
  };


  render() {
    return (
      <div style={{ cursor: 'text' }} onClick={() => (this.input.focus(), this.setCursor())}>
        <div style={{ pointerEvents: 'none' }}>
          <Input
            ref="input"
            type="tel"
            value={this.getValue()}
            onChange={this.handleChange}
            onClick={this.setCursor}
            textAlignCenter
          />
        </div>
      </div>
    );
  }
}

export default connect()(MobileInput);
