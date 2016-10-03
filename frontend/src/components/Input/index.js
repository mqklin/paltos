import React, { Component, PropTypes } from 'react';
import styles from './styles.scss';
import classNames from 'classnames';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || '',
      status: props.status || '',
      errorText: props.errorText || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.value, status: nextProps.status, errorText: nextProps.errorText });
  }

  render() {
    const { value, status, errorText } = this.state;
    const { type, textAlignCenter } = this.props;
    return (
      <div className={styles.root}>
        <input style={{ display: 'none' }} />
        <input
          ref="input"
          type={type || 'text'}
          className={classNames(styles.input, styles[status], textAlignCenter && styles.textAlignCenter)}
          value={value}
          onChange={({ target: { value } }) => this.props.onChange(value)}
          onBlur={() => this.props.onBlur}
          onClick={() => this.props.onClick}
        />
        {status === 'error' && <span className={styles.errorText}>{errorText}</span>}
      </div>
    );
  }
}

export default Input;
