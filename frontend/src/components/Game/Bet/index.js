import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { Input } from 'components';

class Bet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value || 1,
      lastValidValue: props.value || 1,
      errorText: '',
      status: '',
    };
  }

  componentWillReceiveProps({ vkid, lottery }) {
    if (!lottery) return;
    const points = lottery.members.find(m => m.vkid === vkid).points;
    if (points < this.state.value) {
      this.setState({ value: points, lastValidValue: points });
      this.handleChange(String(points));
    }
  }

  onError = () => {
    const { lastValidValue } = this.state;
    clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => this.setState({ value: lastValidValue, status: '', errorText: '' }), 500);
  };

  handleChange = (value) => {
    const { vkid, lottery } = this.props;
    const { lastValidValue } = this.state;
    if ((value[0] === '0') || value.split('').some(c => c.charCodeAt(0) < 48 || c.charCodeAt(0) > 57)) return this.setState({ value, status: 'error', errorText: 'Число от 1' }, this.onError);
    if (lottery.members.find(m => m.vkid === vkid).points < value) return this.setState({ value, status: 'error', errorText: 'У вас столько нет' }, this.onError);
    clearTimeout(this.errorTimeout);
    this.setState({ value, lastValidValue: value, status: '', errorText: '' });
    this.props.onChange(value);
  };

  handleBetBlur = () => {
    const { value } = this.state;
    if (!value) this.setState({ value: '1', lastValidValue: '1' });
  };

  render() {
    const { value, errorText, status } = this.state;
    return (
      <div className={styles.bet}>
        <span>Cтавка:</span>
        <span className={styles.input}>
          <Input
            textAlignCenter
            type="tel"
            errorText={errorText}
            status={status}
            value={value}
            onChange={this.handleChange}
          />
        </span>
      </div>
    );
  }
}

export default connect(
  state => ({
    lottery: state.data.lottery,
    vkid: state.data.vkid,
  })
)(Bet);
