const TuyAPI = require('tuyapi');

class TuyaDevice {
  constructor({id, key, ip, version = '3.3', log}) {
    this.log = log;
    this.dpPower = 1;      // default
    this.device = new TuyAPI({id, key, ip, version});

    this.device.on('connected', () => this.log(`${id} connected`));
    this.device.on('error', err => this.log.error(err));
    this.device.on('data', data => this._handleReport(data.dps));
  }

  /* ---------- Public ---------- */

  connect()       { this.device.connect(); }
  disconnect()    { this.device.disconnect(); }

  async get(dps)  { return (await this.device.get({schema: true})).dps[dps]; }
  async set(dps,v){        this.device.set({dps, set: v}); }

  /* ---------- Private ---------- */

  _handleReport(dps) {
    if (this.onReport) { this.onReport(dps); }
  }
}

module.exports = TuyaDevice;
