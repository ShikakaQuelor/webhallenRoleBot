const ranks = ['Bronze', 'Silver', 'Gold', 'White', 'Black', 'V O I D'];

const classes = {
  strength: 'Warrior',
  dexterity: 'Rogue',
  charm: 'Charmer',
  holy: 'Healer',
  wisdom: 'Mage',
};

const getCurrentRank = (level) => {
  const id = Math.floor(level / 4);
  if (level > 22) {
    return [ranks[id], 'Forever 24 Club'];
  }
  return ranks[id];
};

const getInactiveRanks = (level) => {
  const id = Math.floor(level / 4);
  const dummy = ranks.slice();
  dummy.splice(id, 1);
  return dummy;
};

const getClass = (stats) => {
  const id = Object.keys(stats).reduce((a, b) => (stats[a] > stats[b] ? a : b));
  return classes[id];
};

const getInactiveClasses = (stats) => {
  const id = Object.keys(stats).reduce((a, b) => (stats[a] > stats[b] ? a : b));
  const dummy = Object.fromEntries(
    Object.entries(classes).filter(([key, value]) => key !== id)
  );
  return Object.values(dummy);
};

exports.getCurrentRank = getCurrentRank;
exports.getClass = getClass;
exports.getInactiveRanks = getInactiveRanks;
exports.getInactiveClasses = getInactiveClasses;
