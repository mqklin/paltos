import crypto from 'crypto';
import fetch from 'node-fetch'
import { User, Lottery, History } from 'models';
import getNextNumber from 'app/getNextNumber';
import widget_secret from 'data/widget_secret';
import { short, callVk } from './utils';
const apiId = 5637950

function vkUserIsReal({ expire, vkid, secret, sid, sig, hash }) {
  const md5 = s => crypto.createHash('md5').update(s).digest('hex');
  return hash
    ? hash === md5('' + apiId + vkid + widget_secret)
    : sig === md5(`expire=${expire}mid=${vkid}secret=${secret}sid=${sid}${widget_secret}`);
}

export default async function LOGIN(ws, data) {
  try {
    if (!vkUserIsReal(data)) return;
    let user = await User.findOne({ vkid: data.vkid }).exec();

    if (user === null) {
      const res = await callVk(() => fetch(`https://api.vk.com/method/users.get?lang=ru&user_ids=${data.vkid}&v=5.57`));
      const usersData = await res.json();
      const userName = usersData.response[0].first_name + ' ' + usersData.response[0].last_name;
      user = new User({ name: userName, vkid: data.vkid });
      await user.save();
    }
    ws.vkid = user.vkid;
    const lottery = await Lottery.findOne().exec();
    if (lottery && lottery.members.every(m => m.vkid !== user.vkid)) {
      lottery.members.push({ name: user.name, vkid: user.vkid });
      await lottery.save();
      ws.sendMessage(short.lottery(lottery), { broadcast: true });
    }
    const histories = await History.find().exec();
    ws.sendMessage({
      vkid: user.vkid,
      name: user.name,
      ...short.histories(histories),
      ...short.lottery(lottery),
      prize: user.prize,
      players: !lottery ? [] : global.clients
        .filter(c => c.vkid && c.readyState === 1)
        .reduce((acc, { vkid }) => acc.every(c => c.vkid !== vkid) ? [...acc, { vkid }] : acc, [])
        .map(({ vkid }) => lottery.members.find(m => m.vkid === vkid))
        .map(({ vkid, name, points }) => ({ vkid, name, points })),
    });
    ws.sendMessage({ added_player: { vkid: user.vkid, name: user.name } }, { broadcast: true });
  } catch(e) { console.log(e) }
}

