import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './styles.scss';
import { Input, ClickableText } from 'components';

class Prizes extends Component {
  addPrize = () => {
    const { prizes, onChange } = this.props;
    onChange([
      ...prizes.map(p => ({ ...p, opened: false })),
      { count: '', sum: '', opened: true },
    ]);
  };

  changePrize = ({ idx, type, value }) => {
    const { prizes, onChange } = this.props;
    onChange([
      ...prizes.slice(0, idx),
      { ...prizes[idx], [type]: value },
      ...prizes.slice(idx + 1)
    ]);
  };

  handlePrizeClick = ({ idx, opened }) => {
    const { prizes, onChange } = this.props;
    const { count, sum } = prizes[idx];
    onChange(
      (!count && !sum)
        ? [...prizes.slice(0, idx), ...prizes.slice(idx + 1)]
        : [
          ...prizes.slice(0, idx),
          { ...prizes[idx], opened: !opened },
          ...prizes.slice(idx + 1)
        ]
    );
  };

  render() {
    return (
      <div>
        <div className={styles.add}>
          <ClickableText text="+" onClick={this.addPrize}/>
        </div>
        <div className={styles.prizes}>
          {this.props.prizes.map(({ count, sum, opened }, idx) => (
            <div className={styles.prize} key={idx}>
              <div className={styles.count}>
                {opened
                  ? <Input
                    textAlignCenter
                    value={count}
                    onChange={value => this.changePrize({ idx, type: 'count', value })}
                  />
                  : <span>
                    {count}
                  </span>
              }
              </div>
              мест по
              <div className={styles.value}>
                {opened
                  ? <Input
                    textAlignCenter
                    value={sum}
                    onChange={value => this.changePrize({ idx, type: 'sum', value })}
                  />
                  : <span>
                    {sum}
                  </span>
                }
              </div>
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => this.handlePrizeClick({ idx, opened })}
              >
                руб.
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}


class CreateLottery extends Component {
  state = {
    prizes: [],
    time: '',
  };
  render() {
    const { prizes, time } = this.state;
    return (
      <div className={styles.block}>
        <div className={styles.header}>Создать лотерею</div>
        <div className={styles.el}>
          <Prizes prizes={prizes} onChange={prizes => (console.log(prizes), this.setState({ prizes }))}/>
        </div>
        <div className={styles.el}>
          <span>Время</span>
          <Input textAlignCenter value={time} onChange={time => this.setState({ time })}/>
        </div>
        <div className={styles.el}>
          <ClickableText
            text="Создать"
            onClick={() => this.props.ws.sendMessage({ type: 'ROOT', method: 'create_lottery', prizes, time })}
          />
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    ws: state.ws,
  })
)(CreateLottery);

