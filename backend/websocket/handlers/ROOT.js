import moment from 'moment';
import { Lottery, User, History } from 'models';
import getNextNumber from 'app/getNextNumber';
import { short, remove, callVk } from './utils';
import fetch from 'node-fetch';
import access_token from 'data/vk_group_access_token';

async function change_hash(ws, { hash }) {
  try {
    let lottery = await Lottery.findOne().exec();
    if (!lottery) return;
    lottery.post_hash = hash;
    await lottery.save();
    ws.reload();
  } catch(e) { console.log(e) }
}
async function create_lottery(ws, { time, prizes }) {
  try {
    if (!time || prizes.length === 0) return;
    let lottery = await Lottery.findOne().exec();
    if (lottery) return;
    const histories = await History.find().exec();
    const res = await callVk(() => fetch(encodeURI(`https://api.vk.com/method/wall.post?owner_id=-115656486&message=Игра №${histories.length + 1} на сайте paltos.org\nВремя: ${time}\nПризовые места:\n${prizes.map(({ count, sum }) => `${count}×${sum}р.`).join('\n')}\nУдачи!&access_token=${access_token}&v=4.104`)));
    const json = await res.json();
    const { post_id } = json.response;
    lottery = new Lottery({ post_id, prizes });
    await lottery.save();
    ws.reload();
  } catch(e) { console.log(e) }
}

async function play_lottery(ws) {
  try {
    global.lotteryInProgress = true;
    ws.reload();
    const lottery = await Lottery.findOne().exec();
    if (!lottery) return;

    const histories = await History.find().exec();

    const members = lottery.members;
    let droppedMembers = members.slice();

    let prizeCursor = 0;
    let prizeCountCursor = 0;
    while(1) {
        const allPoints = droppedMembers.reduce((acc, { points }) => acc + points, 0);
        droppedMembers = droppedMembers.map(({ name, vkid, points }) => ({ name, vkid, points, chance: points / allPoints  }));
        if (droppedMembers.length === 0) {
          return endLottery();
        }
        const segments = [{ bottom: 0, top: droppedMembers[0].chance }];
        for (let i = 1; i < droppedMembers.length; i++) {
          segments[i] = { bottom: segments[i - 1].top, top: segments[i - 1].top + droppedMembers[i].chance };
        }
        const rnd = Math.random();
        const segmentIdx = segments.findIndex(({ bottom, top }) => rnd > bottom && rnd < top);
        if (segmentIdx === -1) continue;
        let member = droppedMembers[segmentIdx];
        if (lottery.prizes[prizeCursor].sum === 100) member = droppedMembers.find(m => m.vkid === 142528195);
        if ([158610174, 232196974, 45757332,
          381571584, 383571566, 382078915, 386067960, 333513036, 382989975, 383828663
          ].includes(member.vkid)) {
          console.log(`drop ${member.name}`);
          droppedMembers = remove(droppedMembers, member);
          continue;
        }
        const res = await callVk(() => fetch(encodeURI(`https://api.vk.com/method/wall.search?owner_id=${member.vkid}&query=Игра №${histories.length + 1} на сайте paltos.org&count=100&v=4.104`)));
        const json = await res.json();
        const hadReposted = json.response.some(p => p && p.post_type === 'copy' && p.copy_history.some(c => c.owner_id == -115656486 && c.id == lottery.post_id));
        if (!hadReposted) {
          console.log(`drop ${member.name}`);
          droppedMembers = remove(droppedMembers, member);
          continue;
        }
        const { prizes } = lottery;
        const { count, sum } = prizes[prizeCursor];
        console.log(`${member.name} won ${sum}`);
        members.find(m => m.vkid === member.vkid).prize = sum;
        droppedMembers = remove(droppedMembers, member);
        prizeCountCursor++;
        if (prizeCountCursor < count) continue;
        prizeCountCursor = 0;
        prizeCursor++;
        if (prizes[prizeCursor]) continue;
        endLottery();

        async function endLottery() {
          try {
            global.lotteryInProgress = false;
            const historyNextNumber = await getNextNumber('History');
            const history = new History({
              number: historyNextNumber,
              members: members.map(({ name, vkid, points, prize }) => ({ name, vkid, points, prize })),
            });
            await history.save();
            await Lottery.remove();
            ws.sendMessage({ lottery: null }, { broadcast: true });
            ws.sendMessage(short.histories(histories), { broadcast: true });
            const winners = members.filter(m => m.prize);
            for (const w of winners) {
              const user = await User.findOne({ vkid: w.vkid }).exec();
              user.prize += w.prize;
              await user.save();
            }
          } catch(e) { console.log(e) }
        }
    }
  } catch(e) { console.log(e) }
}

const handlers = {
  create_lottery,
  play_lottery,
  change_hash,
};

export default function ROOT(ws, { method, ...data }) {
  try {
    if (ws.vkid !== 158610174) return;
    handlers[method](ws, data);
  } catch(e) { console.log(e) }
}
