import fetch from 'node-fetch'
import { User } from 'models';

export default async function GET_PRIZE(ws, { mobile }) {
  try {
    const user = await User.findOne({ vkid: ws.vkid }).exec();
    if (!user || !user.prize) return;
    user.prize = 0;
    await user.save();
    console.log('send bablo to + ' + mobile);
  } catch(e) { console.log(e) }
}
