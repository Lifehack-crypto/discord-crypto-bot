const axios = require('axios');
const moment = require('moment');
const BASE_URI = 'https://api-pub.bitfinex.com/v2/';
const LIMIT = 60

module.exports = class BitfinexApiWrapper {
  constructor() {}

  async getBtcUsdShorts() {
    const candles = await this._getbtcUsdShortsCandles();
    if (!candles || !candles.length) {
      console.log("[getBigChangeRate]: BTCUSD-SHORTS candles not found");
      return;
    }

    const latestCandle = candles[0];
    const previousCandle = candles[candles.length - 1];
    const latestPrice = latestCandle[1];
    const previousPrice = previousCandle[1]
    const ratio = ((previousPrice - latestPrice) / latestPrice) * 100;
    
    return {
      day: moment(latestCandle[0]).format('MM/DD HH:mm'),
      price: Math.floor(latestPrice * Math.pow(10, 4)) / Math.pow(10, 4),
      ratio: Math.floor(ratio * Math.pow(10, 2)) / Math.pow(10, 2)
    };
  }

  async _getbtcUsdShortsCandles() {
    const url = `${BASE_URI}stats1/pos.size:1m:tBTCUSD:short/hist?limit=60`
    try {
      const btcUsdShorts = await axios.get(url);
      return btcUsdShorts.data;
    } catch (error) {
      console.log(error)
      return;
    }
  }
}