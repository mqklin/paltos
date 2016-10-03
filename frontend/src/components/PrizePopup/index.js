import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { MobileInput, ClickableText } from 'components';

class Popup extends Component {
  state = {
    mobileIsFull: false,
    mobileValue: '',
  };

  componentWillMount() {
    document.addEventListener('click', this.handleBodyClick);
  }

  handleBodyClick = ({ target }) => {
    if (this.refs.content.contains(target)) return;
    this.props.dispatch({ type: 'SET_DATA', prize: 0 });
  };

  componentWillUnmount() {
    document.removeEventListener('click', this.handleBodyClick);
  }

  handleRefillClick = () => {
    const { mobileValue } = this.state;
    this.props.ws.sendMessage({ type: 'GET_PRIZE', mobile: mobileValue });
  };

  handleOkClick = () => {
    this.props.ws.sendMessage({ type: 'GET_PRIZE' });
    this.props.dispatch({ type: 'SET_DATA', prize: 0 });
  };

  render() {
    const { mobileIsFull } = this.state;
    const { prize } = this.props;
    return (
      <div className={styles.wrapper}>
        <div className={styles.content} ref="content">
          <div className={styles.block}>
            <div className={styles.el}>Вы выиграли {prize} рублей!</div>
          </div>
          <div className={styles.block}>
            <div className={styles.el}>Для получения выигрыша напишите</div>
            <div className={styles.el}>свой номер телефона <ClickableText href="https://vk.com/id158610174" text="админу"/>.</div>
          </div>
          {/*<div className={styles.row}>
            <MobileInput
              onChange={mobileValue => this.setState({ mobileValue })}
              switchMobileFull={isFull => mobileIsFull !== isFull && this.setState({ mobileIsFull: isFull })}
            />
          </div>*/}
          <div className={styles.block}>
            <div className={styles.el}>
              {/*<ClickableText
                text="Пополнить"
                disabled={!mobileIsFull}
                onClick={this.handleRefillClick}
              />*/}
              <ClickableText
                text="Окей"
                onClick={this.handleOkClick}
              />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
  })
)(Popup);
