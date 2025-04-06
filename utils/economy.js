const fs = require('fs');
const path = require('path');

class Economy {
  constructor() {
    this.dataPath = path.join(__dirname, '../data/economy.json');
    this.ensureDataFile();
    this.data = this.loadData();
  }
  
  ensureDataFile() {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify({}), 'utf8');
    }
  }
  
  loadData() {
    const data = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(data);
  }
  
  saveData() {
    fs.writeFileSync(this.dataPath, JSON.stringify(this.data, null, 2), 'utf8');
  }
  
  getUser(userId) {
    if (!this.data[userId]) {
      this.data[userId] = {
        balance: 0,
        lastDaily: null,
        inventory: []
      };
      this.saveData();
    }
    
    return this.data[userId];
  }
  
  addBalance(userId, amount) {
    const user = this.getUser(userId);
    user.balance += amount;
    this.saveData();
    return user.balance;
  }
  
  removeBalance(userId, amount) {
    const user = this.getUser(userId);
    if (user.balance < amount) {
      return false;
    }
    
    user.balance -= amount;
    this.saveData();
    return user.balance;
  }
  
  getBalance(userId) {
    const user = this.getUser(userId);
    return user.balance;
  }
  
  canGetDaily(userId) {
    const user = this.getUser(userId);
    if (!user.lastDaily) {
      return true;
    }
    
    const lastDaily = new Date(user.lastDaily);
    const now = new Date();
    const diffTime = Math.abs(now - lastDaily);
    const diffHours = diffTime / (1000 * 60 * 60);
    
    return diffHours >= 24;
  }
  
  claimDaily(userId) {
    if (!this.canGetDaily(userId)) {
      return false;
    }
    
    const user = this.getUser(userId);
    const amount = 100; // Daily reward amount
    
    user.balance += amount;
    user.lastDaily = new Date().toISOString();
    this.saveData();
    
    return amount;
  }
  
  getTimeUntilDaily(userId) {
    const user = this.getUser(userId);
    if (!user.lastDaily) {
      return 0;
    }
    
    const lastDaily = new Date(user.lastDaily);
    const now = new Date();
    const nextDaily = new Date(lastDaily);
    nextDaily.setHours(nextDaily.getHours() + 24);
    
    const diffTime = Math.max(0, nextDaily - now);
    return diffTime;
  }
  
  transferBalance(fromUserId, toUserId, amount) {
    if (fromUserId === toUserId) {
      return false;
    }
    
    const fromUser = this.getUser(fromUserId);
    if (fromUser.balance < amount) {
      return false;
    }
    
    fromUser.balance -= amount;
    const toUser = this.getUser(toUserId);
    toUser.balance += amount;
    this.saveData();
    
    return true;
  }
}

module.exports = new Economy();