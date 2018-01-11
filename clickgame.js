// clickgame.js
// junk for a throwaway clicker game

var ClickGame = {
    clickBase: 0,
    clickTotal: 0,
    clickRate: 0,
    clickInterval: null,
    clickIntervalTime: 1000,
    clickFlags: {
        nextUnlock: 'click02',
    },
    clickItems: {},
    
};

function toggleLoop() {
    if (ClickGame.clickInterval) {
        clearInterval(ClickGame.clickInterval);
        ClickGame.clickInterval = null;
    }
    else {
        ClickGame.clickInterval = setInterval(updateClicks, ClickGame.clickIntervalTime);
    }
}

// Base Data
var CLICKBASE = {
    ClickItem: {
        baseTypes: [
            'click01',
            'click02',
            'click03',
            'click04',
            'click05',
            'click06',
            'click07',
            'click08',
            'click09',
            'click10',
        ],
        unlockMap: {
            click02: 'click03',
            click03: 'click04',
            click04: 'click05',
            click05: 'click06',
            click06: 'click07',
            click07: 'click08',
            click08: 'click09',
            click09: 'click10',
            click10: 'none',
        },
        typeMap: {
            // this will map baseTypes to itemTypes
        },
        itemTypes: [],
        itemData: {
            'click01': {
                itemType: 'click01',
                nameSingle: '',
                namePlural: '',
                baseAmount: 1,
                baseValue: 1,
                basePrice: 0,
                baseMulti: 0.15,
                baseState: 'off',
                baseUpgradePrice: 0,
            },
            'click02': {
                itemType: 'click02',
                nameSingle: 'hired clicker',
                namePlural: 'hired clickers',
                baseAmount: 0,
                baseValue: 0.1,
                basePrice: 15,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 100,
            },
            'click03': {
                itemType: 'click03',
                nameSingle: 'mechanical clicker',
                namePlural: 'mechanical clickers',
                baseAmount: 0,
                baseValue: 1,
                basePrice: 100,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 1000,
            },
            'click04': {
                itemType: 'click04',
                nameSingle: 'roboclicker',
                namePlural: 'roboclickers',
                baseAmount: 0,
                baseValue: 8,
                basePrice: 1100,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 11000,
            },
            'click05': {
                itemType: 'click05',
                nameSingle: 'artisan clickery',
                namePlural: 'artisan clickeries',
                baseAmount: 0,
                baseValue: 64 - ((64 / 4) + 1),
                basePrice: 12000,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 120000,
            },
            'click06': {
                itemType: 'click06',
                nameSingle: 'click farm',
                namePlural: 'click farms',
                baseAmount: 0,
                baseValue: 512 - ((512 / 4) + 1),
                basePrice: 130000,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 1300000,
            },
            'click07': {
                itemType: 'click07',
                nameSingle: 'click mine',
                namePlural: 'click mines',
                baseAmount: 0,
                baseValue: 4096 - ((4096 / 4) + 1),
                basePrice: 1400000,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 14000000,
            },
            'click08': {
                itemType: 'click08',
                nameSingle: 'click factory',
                namePlural: 'click factories',
                baseAmount: 0,
                baseValue: 32768 - ((32768 / 4) + 1),
                basePrice: 15000000,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 150000000,
            },
            'click09': {
                itemType: 'click09',
                nameSingle: 'click refinery',
                namePlural: 'click refineries',
                baseAmount: 0,
                baseValue: 262144 - ((262144 / 4) + 1),
                basePrice: 175000000,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 1750000000,
            },
            'click10': {
                itemType: 'click10',
                nameSingle: 'click wizard',
                namePlural: 'click wizards',
                baseAmount: 0,
                baseValue: 2097152 - ((2097152 / 4) + 1),
                basePrice: 2000000000,
                baseMulti: 0.15,
                baseState: 'on',
                baseUpgradePrice: 20000000000,
            },
        },
    }
};


// ClickItem
var ClickItem = function (params) {
    // Attributes
    
    // Type of item for reference
    this.itemType = params.itemType;
    this.unlocked = false;
    this.totalUpgrades = 0;
    this.upgradeMulti = 5;
    this.upgradePrice = params.baseUpgradePrice;
    
    this.baseAmount = params.baseAmount;
    this.baseValue  = params.baseValue;
    this.basePrice  = params.basePrice;
    this.baseMulti  = params.baseMulti;
    this.baseState  = params.baseState;
    
    // Current amount of the item owned by the player
    this.curAmount  = params.baseAmount;
    // Current amount of currency gained per second for each of the item
    this.curValue   = params.baseValue;
    // Current price of each additional item
    this.curPrice   = params.basePrice;
    // Current multiplier for the price of the next item
    this.curMulti   = params.baseMulti;
    // Current state of activity (on/off)
    this.curState   = params.baseState;    
    
    // Methods
    this.totalValue = function () {
        return this.curAmount * this.curValue;
    };
    
    this.buyAnother = function () {
        //if (this.curAmount > 0) {
        //    this.curMulti += 0.025;
        //}
        this.curPrice += Math.ceil(this.curPrice * this.curMulti);
        this.curAmount += 1;
    };
    
    this.buyUpgrade = function () {
        this.curValue *= 2;
        this.upgradePrice *= this.upgradeMulti;
        this.totalUpgrades += 1;
        this.upgradeMulti += 5;
    };
};

ClickGame.init = function () {
    let cItem = CLICKBASE.ClickItem;
    let cTypes = cItem.baseTypes.slice();
    let aType = null;
    while (cTypes.length > 0) {
        aType = cTypes.shift();
        ClickGame.clickItems[aType] = new ClickItem(cItem.itemData[aType]);
    }
    buildBasicButton();
    toggleLoop();
};

function buildBasicButton () {
    ClickGame.clickItems.click01.unlocked = true;
    let cboxTbody = document.getElementById('cbox_tbody');
    let buttonRow = document.createElement('tr');
    buttonRow.id = 'click01';
    let buttonData = document.createElement('td');
    let basicButton = document.createElement('button');
    basicButton.id = 'click01_button';
    basicButton.onclick = doClick01;
    basicButton.textContent = 'Do a click';
    buttonData.appendChild(basicButton);
    buttonRow.appendChild(buttonData);
    cboxTbody.appendChild(buttonRow);
}

function cleanUpDecimal(aNum) {
    return Math.trunc(aNum * 10) / 10;
}

function calculateCPT() {
    // Clicks Per Tick
    let cItem = CLICKBASE.ClickItem;
    let liveItems = ClickGame.clickItems;
    let cTypes = cItem.baseTypes.slice();
    let aType = null;
    let CPT = 0;
    while (cTypes.length > 0) {
        aType = cTypes.shift();
        if (liveItems[aType].unlocked && aType != cItem.baseTypes[0]) {
            CPT += liveItems[aType].totalValue();
        }
    }
    let finalCPT = cleanUpDecimal(CPT);
    ClickGame.clickRate = finalCPT;
    return finalCPT;
}

function dumpChildren(aNode) {
    while (aNode.hasChildNodes()) {
        aNode.removeChild(aNode.firstChild);
    }
}

function redrawClicks() {
    let clickTotal = document.getElementById('click_total');
    dumpChildren(clickTotal);
    let cTotal = document.createTextNode(Math.floor(ClickGame.clickTotal).toString());
    clickTotal.appendChild(cTotal);
    
    let clickRate = document.getElementById('click_rate');
    dumpChildren(clickRate);
    let cRate = document.createTextNode(ClickGame.clickRate.toString());
    clickRate.appendChild(cRate);
}

function buildStatText(iType) {
    let sText = {
        tOwned: '',
        tValue: '',
    };
    sText.tOwned += CLICKBASE.ClickItem.itemData[iType].namePlural.toUpperCase() + ' OWNED:';
    sText.tValue += 'CPS PER ' + CLICKBASE.ClickItem.itemData[iType].nameSingle.toUpperCase() + ':';
    return sText;
}

function buildPriceText(iType) {
    let pText = '';
    pText += 'BUY 1 ' + CLICKBASE.ClickItem.itemData[iType].nameSingle.toUpperCase();
    pText += ': ' + Math.floor(ClickGame.clickItems[iType].curPrice).toString() + ' CLICKS';
    return pText;
}

function buildUpgradeText(iType) {
    let uText = '';
    uText += 'BUY UPGRADE: ' + Math.floor(ClickGame.clickItems[iType].upgradePrice).toString() + ' CLICKS';
    return uText;
}

function redrawStats(iType) {
    let sOwned = document.getElementById(iType + '_owned');
    let sValue = document.getElementById(iType + '_value');
    let oText = document.createTextNode(ClickGame.clickItems[iType].curAmount.toString());
    let vText = document.createTextNode(ClickGame.clickItems[iType].curValue.toString());
    dumpChildren(sOwned);
    dumpChildren(sValue);
    sOwned.appendChild(oText);
    sValue.appendChild(vText);

    let sButton = document.getElementById(iType + '_buy_button');
    sButton.textContent = buildPriceText(iType);
    
    let uButton = document.getElementById(iType + '_upgrade_button');
    uButton.textContent = buildUpgradeText(iType);
}

function buyAnotherItem(iType) {
    let iPrice = ClickGame.clickItems[iType].curPrice;
    if (ClickGame.clickTotal < iPrice) {
        return;
    }
    else {
        ClickGame.clickTotal -= iPrice;
        ClickGame.clickItems[iType].buyAnother();
        handleClickUpdates();
        redrawStats(iType);
    }
}

function buyAnotherUpgrade(iType) {
    let uPrice = ClickGame.clickItems[iType].upgradePrice;
    if (ClickGame.clickTotal < uPrice) {
        return;
    }
    else {
        ClickGame.clickTotal -= uPrice;
        ClickGame.clickItems[iType].buyUpgrade();
        if (iType === 'click02') {
            ClickGame.clickItems.click01.curValue *= 2;
            ClickGame.clickItems.click01.totalUpgrades += 1;
        }
        handleClickUpdates();
        redrawStats(iType);
    }
}

function buildNewClickItemRow(iType) {    
    let gboxTbody = document.getElementById('gbox_tbody');
    
    let nameRow = document.createElement('tr');
    nameRow.id = iType + '_name';
    nameRow.className = 'hidden';
    let nameData = document.createElement('td');
    nameData.id = iType + '_name_data';
    let nCode = document.createElement('code');
    let nText = document.createTextNode(CLICKBASE.ClickItem.itemData[iType].nameSingle.toUpperCase());
    nCode.appendChild(nText);
    nameData.appendChild(nCode);
    nameRow.appendChild(nameData);
    gboxTbody.appendChild(nameRow);
    
    let infoRow = document.createElement('tr');
    infoRow.id = iType + '_info';
    infoRow.className = 'hidden';
    let infoText = (buildStatText(iType));
    let infoData01 = document.createElement('td');
    let iCode01 = document.createElement('code');
    let iText01 = document.createTextNode(infoText.tOwned);
    let infoData02 = document.createElement('td');
    let iCode02 = document.createElement('code');
    let iText02 = document.createTextNode(infoText.tValue);
    iCode01.appendChild(iText01);
    infoData01.appendChild(iCode01);
    infoRow.appendChild(infoData01);
    iCode02.appendChild(iText02);
    infoData02.appendChild(iCode02);
    infoRow.appendChild(infoData02);

    let stateRow = document.createElement('tr');
    stateRow.id = iType + '_state';
    stateRow.className = 'hidden';
    let stateData01 = document.createElement('td');
    let sCode01 = document.createElement('code');
    sCode01.id = iType + '_owned';
    let sText01 = document.createTextNode(ClickGame.clickItems[iType].curAmount.toString());
    let stateData02 = document.createElement('td');
    let sCode02 = document.createElement('code');
    sCode02.id = iType + '_value';
    let sText02 = document.createTextNode(ClickGame.clickItems[iType].curValue.toString());
    sCode01.appendChild(sText01);
    stateData01.appendChild(sCode01);
    stateRow.appendChild(stateData01);
    sCode02.appendChild(sText02);
    stateData02.appendChild(sCode02);
    stateRow.appendChild(stateData02);
    
    let itemRow = document.createElement('tr');
    itemRow.id = iType + '_item';
    itemRow.className = 'hidden';
    let itemData01 = document.createElement('td');
    let iButton01 = document.createElement('button');
    iButton01.id = iType + '_buy_button';
    let buyAnotherOfThis = function () {
        return buyAnotherItem(iType);
    };
    iButton01.onclick = buyAnotherOfThis;
    iButton01.textContent = buildPriceText(iType);
    let itemData02 = document.createElement('td');
    let iButton02 = document.createElement('button');
    iButton02.id = iType + '_upgrade_button';
    let upgradeThis = function () {
        return buyAnotherUpgrade(iType);
    };
    iButton02.onclick = upgradeThis;
    iButton02.textContent = buildUpgradeText(iType);
    itemData01.appendChild(iButton01);
    itemRow.appendChild(itemData01);
    itemData02.appendChild(iButton02);
    itemRow.appendChild(itemData02);
    
    gboxTbody.appendChild(nameRow);
    gboxTbody.appendChild(infoRow);
    gboxTbody.appendChild(stateRow);
    gboxTbody.appendChild(itemRow);
    
    setTimeout(function(iType) {
        document.getElementById(iType + '_name').className = 'visible';
        return setTimeout(function(iType) {
            document.getElementById(iType + '_info').className = 'visible';
            return setTimeout(function(iType) {
                document.getElementById(iType + '_state').className = 'visible';
                return setTimeout(function(iType) {
                    document.getElementById(iType + '_item').className = 'visible';
                }, 500, iType);
            }, 500, iType);
        }, 500, iType);
    }, 100, iType);
}

function unlockNext(iType) {
    ClickGame.clickItems[iType].unlocked = true;
    buildNewClickItemRow(iType);
    ClickGame.clickFlags.nextUnlock = CLICKBASE.ClickItem.unlockMap[iType];
}

function checkForUnlocks() {
    if (ClickGame.clickFlags.nextUnlock != 'none') {
        if (ClickGame.clickTotal >= ClickGame.clickItems[ClickGame.clickFlags.nextUnlock].basePrice) {
            unlockNext(ClickGame.clickFlags.nextUnlock);
        }
    }
}

function handleClickUpdates() {
    checkForUnlocks();
    redrawClicks();
}

function updateClicks() {
    ClickGame.clickTotal += calculateCPT();
    handleClickUpdates();
}

function doClickLoop() {
    ClickGame.clickInterval = setInterval(updateClicks, ClickGame.clickIntervalTime);
}

function doClick01() {
    ClickGame.clickTotal += ClickGame.clickItems.click01.totalValue();
    handleClickUpdates();
}