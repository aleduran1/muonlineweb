'use strict';

const itemList = require('../../items.json');

class Item {

	// 04fffffffffd1f00000000ffffffffff

	constructor(arg1, arg2) {

		if (arg1 && arg2) {
			this.hex = 'ffffffffffffffffffffffffffffffff';
			this.name = 'empty slot';
			this.btrow = arg1;
			this.btcol = arg2;
			this.isEmpty = 1;
			this.belongs = 1;
		} else if (arg1) {
			if (arg1.toUpperCase() != 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') {
				this._buffer = Buffer.from(arg1);
				this.group = this._getProperty(18, 19);
				this.id = this._getProperty(0, 2);
				this._setup();
				this.isEmpty = 0;
				this.belongs = 0;
			}
		} else {
			this.hex = 'ffffffffffffffffffffffffffffffff';
			this.name = 'empty slot';
			this.isEmpty = 1;
			this.belongs = 0;
		}

	}

	_getProperty(begin, end) {
		return parseInt(this._buffer.toString(undefined, begin, end), 16);
	}

	_getRawProperty(begin, end) {
		return this._buffer.toString(undefined, begin, end);
	}

	_setRawProperty(begin, data) {
		data = parseInt(data).toString(16).toUpperCase();
		this._buffer.write(data, begin);
	}

	_setProperties() {
		this.hex = this._buffer.toString(undefined);
		this.type = itemList.group[this.group].type;
		this.item = itemList.group[this.group].itemID[this.id];
		this.name = this.item.name;
		this.haveSkill = this.item.skill;
		this.slot = this.item.slot;
		this.X = this.item.X;
		this.Y = this.item.Y;
		this.haveSerial = this.item.haveSerial;
		this.haveOption = this.item.haveOption;
		this.dropItem = this.item.dropItem;
		this.durability = this._getProperty(4, 6);
		this.serial = this._getRawProperty(6, 14);
		this.image = '/img/items/' + this.group + '/' + this.id;
	}

	_setItemDefaults() {
		switch (this.type) {
			case 'Weapon':
				this.level = this.item.property1;
				this.minDamage = this.item.property2;
				this.maxDamage = this.item.property3;
				this.attackSpeed = this.item.property4;
				this.maxDurability = this.item.property5;
				this.magicDurability = this.item.propert6;
				this.magicDamageRate = this.item.property7;
				this.requiredLevel = this.item.property8;
				this.requiredStrength = this.item.property9;
				this.requiredDexterity = this.item.property10;
				this.requiredEnergy = this.item.property11;
				this.requiredVitality = this.item.property12;
				this.requiredLeadership = this.item.property13;
				this.none = this.item.property14;
				this.DW = this.item.property15;
				this.DK = this.item.property16;
				this.FE = this.item.property17;
				this.MG = this.item.property18;
				this.DL = this.item.property19;
				this.SU = this.item.property20;
				this.RF = this.item.property21;
				this.optionMultiplier = 4;
				break;
			case 'Shield':
				this.level = this.item.property1;
				this.defense = this.item.property2;
				this.defenseSuccessRate = this.item.property3;
				this.maxDurability = this.item.property4;
				this.requiredLevel = this.item.property5;
				this.requiredStrength = this.item.property6;
				this.requiredDexterity = this.item.property7;
				this.requiredEnergy = this.item.property8;
				this.requiredVitality = this.item.property9;
				this.requiredLeadership = this.item.property10;
				this.none = this.item.property11;
				this.DW = this.item.property12;
				this.DK = this.item.property13;
				this.FE = this.item.property14;
				this.MG = this.item.property15;
				this.DL = this.item.property16;
				this.SU = this.item.property17;
				this.RF = this.item.property18;
				this.optionMultiplier = 5;
				break;
			case 'Armor':
				this.level = this.item.property1;
				this.defense = this.item.property2;
				this.magicDefense = this.item.property3;
				this.maxDurability = this.item.property4;
				this.requiredLevel = this.item.property5;
				this.requiredStrength = this.item.property6;
				this.requiredDexterity = this.item.property7;
				this.requiredEnergy = this.item.property8;
				this.requiredVitality = this.item.property9;
				this.requiredLeadership = this.item.property10;
				this.none = this.item.property11;
				this.DW = this.item.property12;
				this.DK = this.item.property13;
				this.FE = this.item.property14;
				this.MG = this.item.property15;
				this.DL = this.item.property16;
				this.SU = this.item.property17;
				this.RF = this.item.property18;
				this.optionMultiplier = 4;
				break;
			case 'Misc1':
				this.level = this.item.property1;
				this.defense = this.item.property2;
				this.maxDurability = this.item.property3;
				this.requiredLevel = this.item.property4;
				this.requiredEnergy = this.item.property5;
				this.requiredStrength = this.item.property6;
				this.requiredDexterity = this.item.property7;
				this.requiredLeadership = this.item.property8;
				this.buyMoney = this.item.property9;
				this.DW = this.item.property10;
				this.DK = this.item.property11;
				this.FE = this.item.property12;
				this.MG = this.item.property13;
				this.DL = this.item.property14;
				this.SU = this.item.property15;
				this.RF = this.item.property16;
				this.optionMultiplier = 1;
				break;
			case 'Misc2':
				this.level = this.item.property1;
				this.maxDurability = this.item.property2;
				this.resistance1 = this.item.property3;
				this.resistance2 = this.item.property4;
				this.resistance3 = this.item.property5;
				this.resistance4 = this.item.property6;
				this.resistance5 = this.item.property7;
				this.resistance6 = this.item.property8;
				this.resistance7 = this.item.property9;
				this.none = this.item.property10;
				this.DW = this.item.property11;
				this.DK = this.item.property12;
				this.FE = this.item.property13;
				this.MG = this.item.property14;
				this.DL = this.item.property15;
				this.SU = this.item.property16;
				this.RF = this.item.property17;
				this.optionMultiplier = 1;
				break;
			case 'Misc3':
				this.value = this.item.property1;
				this.level = this.item.property2;
				this.optionMultiplier = 1;
				break;
			case 'Misc4':
				this.level = this.item.property1;
				this.requiredLevel = this.item.property2;
				this.requiredEnergy = this.item.property3;
				this.buyMoney = this.item.property4;
				this.DW = this.item.property5;
				this.DK = this.item.property6;
				this.FE = this.item.property7;
				this.MG = this.item.property8;
				this.DL = this.item.property9;
				this.SU = this.item.property10;
				this.RF = this.item.property11;
				this.optionMultiplier = 1;
				break;
		}
	}

	_setItemOptions() {
		this._option = this._getProperty(2, 4);
		this.option = this._option;

		if (this.option < 128) {
			this.skill = 0;
		} else {
			this.skill = 1;
			this.option -= 128;
		}

		this.itemLevel = Math.floor(this.option / 8);
		this.option -= this.itemLevel * 8;

		if (this.option < 4) {
			this.luck = 0;
		} else {
			this.luck = 1;
			this.option -= 4;
		}
		if (this.itemLevel) {
			this.name += ' +' + this.itemLevel;
		}

	}

	_setExcellentOptions() {
		this._excopt = this._getProperty(14, 16);
		this.excopt = this._excopt;

		if (this.excopt >= 64) {
			this.option += 4;
			this.excopt -= 64;
		}

		if (this.excopt < 32) {
			this.excellentOption6 = 0;
		} else {
			this.excellentOption6 = 1;
			this.excopt -= 32;
		}

		if (this.excopt < 16) {
			this.excellentOption5 = 0;
		} else {
			this.excellentOption5 = 1;
			this.excopt -= 16;
		}

		if (this.excopt < 8) {
			this.excellentOption4 = 0;
		} else {
			this.excellentOption4 = 1;
			this.excopt -= 8;
		}

		if (this.excopt < 4) {
			this.excellentOption3 = 0;
		} else {
			this.excellentOption3 = 1;
			this.excopt -= 4;
		}

		if (this.excopt < 2) {
			this.excellentOption2 = 0;
		} else {
			this.excellentOption2 = 1;
			this.excopt -= 2;
		}

		if (this.excopt < 1) {
			this.excellentOption1 = 0;
		} else {
			this.excellentOption1 = 1;
			this.excopt -= 1;
		}

	}

	_setTexts() {
		if (this.type == 'Weapon') {
			this.optionText = 'Additional DMG +';
			this.excellentText6 = 'Chance of doing Excellent damage +10%';
			this.excellentText5 = 'Increase Damage +Level/20';
			this.excellentText4 = 'Increase Damage +2%';
			this.excellentText3 = 'Increase Attack (Wizardry) speed +7';
			this.excellentText2 = 'Increases the amount of Life received for hunting monsters +Life/8';
			this.excellentText1 = 'Increases the amount of Mana received for hunting monsters +Mana/8';
		} else if (this.type == 'Armor') {
			this.optionText = 'Additional defense +';
			this.excellentText6 = 'Increases Maximum Life +4%';
			this.excellentText5 = 'Increases Maximum Mana +4%';
			this.excellentText4 = 'Decreases Damage +4%';
			this.excellentText3 = 'Reflect Damage +5%';
			this.excellentText2 = 'Defense Success Rate +10%';
			this.excellentText1 = 'Increases the amount of Zen received for hunting monsters +30%';
		} else if (this.type == 'Shield') {
			this.optionText = 'Additional defense rate +';
			this.excellentText6 = 'Increases Maximum Life +4%';
			this.excellentText5 = 'Increases Maximum Mana +4%';
			this.excellentText4 = 'Decreases Damage +4%';
			this.excellentText3 = 'Reflect Damage +5%';
			this.excellentText2 = 'Defense Success Rate +10%';
			this.excellentText1 = 'Increases the amount of Zen received for hunting monsters +30%';
		} else {
			this.optionText = 'Automatic HP Recovery rate +';
			this.excellentText6 = 'Option 6';
			this.excellentText5 = 'Option 5';
			this.excellentText4 = 'Option 4';
			this.excellentText3 = 'Option 3';
			this.excellentText2 = 'Option 2';
			this.excellentText1 = 'Option 1';
		}
	}

	setItemLevel(level) {
		this._option -= this.itemLevel * 8;
		this._option += level * 8;
		this._setRawProperty(2, this._option);
		this._setup();
	}

	setLuck() {
		if (!this.luck) {
			this._option += 4;
			this._setRawProperty(2, this._option);
			this._setup();
		}
	}

	setSkill() {
		if (this.haveSkill) {
			if (!this.skill) {
				this._option += 128;
				this._setRawProperty(2, this._option);
				this._setup();
			}
		}
	}

	setSerial(serial) {
		this._setRawProperty(6, serial);
		this._setup();
	}

	setItemOption(option) {
		//CLEAN CURRENT OPTION
		if (this.option > 0 && this.option < 4) {
			this._option -= this.option;
		} else if (this.option >= 4) {
			this._excopt -= 64;
			this.option -= 4;
			this._option -= this.option;
		}

		if (option < 4) {
			this._option += option;
		} else {
			this._excopt += 64;
			option -= 4;
			this._option += option;
		}

		this._setRawProperty(2, this._option);
		this._setRawProperty(14, this._excopt);
		this._setup();

	}

	setMaxDurability() {
		if (this.maxDurability) {
			this.durability = this.maxDurability;
		} else {
			this.durability = 255;
		}
		this._setRawProperty(4, this.durability);
		this._setup();
	}

	setExcellentOptions(option1, option2, option3, option4, option5, option6) {
		//CLEAN CURRENT OPTIONS
		if (this._excopt >= 64) {
			this._excopt = 64;
		} else {
			this._excopt = 0;
		}

		this._excopt += (option1 ? 1 : 0);
		this._excopt += (option2 ? 2 : 0);
		this._excopt += (option3 ? 4 : 0);
		this._excopt += (option4 ? 8 : 0);
		this._excopt += (option5 ? 16 : 0);
		this._excopt += (option6 ? 32 : 0);

		this._setRawProperty(14, this._excopt);
		this._setup();

	}

	_setup() {
		this._setProperties();
		this._setItemOptions();
		this._setItemDefaults();
		this._setExcellentOptions();
		this._setTexts();
		this.createHTML();
	}

	isExcellent() {
		if (this.excellentOption6 || this.excellentOption5 || this.excellentOption4 ||
			this.excellentOption3 || this.excellentOption2 || this.excellentOption1) {
			return 1;
		} else {
			return 0;
		}
	}

	getOption() {
		return this.option * this.optionMultiplier;
	}

	createHTML() {
		this.dataHTML = ''; // base
		// Seteamos el titulo
		if (this.isExcellent()) {
			this.dataHTML += '<p><span class="itemdata exc">Excellent ' + this.name + '</span></p>';
		} else if (this.itemLevel > 6) {
			this.dataHTML += '<p><span class="itemdata splus">' + this.name + '</span></p>';
		} else {
			this.dataHTML += '<p><span class="itemdata">' + this.name + '</span></p>';
		}
		this.dataHTML += '<p></p>';
		if (this.DW > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.DW, 'DW') + '</span></p>';
		}
		if (this.DK > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.DK, 'DK') + '</span></p>';
		}
		if (this.FE > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.FE, 'FE') + '</span></p>';
		}
		if (this.MG > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.MG, 'MG') + '</span></p>';
		}
		if (this.DL > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.DL, 'DL') + '</span></p>';
		}
		if (this.SU > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.SU, 'SU') + '</span></p>';
		}
		if (this.RF > 0) {
			this.dataHTML += '<p><span class="itemdata">Can be equipped by ' + this.getClassName(this.RF, 'RF') + '</span></p>';
		}
		this.dataHTML += '<p></p>';

		if (this.luck) {
			this.dataHTML += '<p><span class="itemdata options">Luck (success rate of Jewel of Soul +25%)</span></p>';
			this.dataHTML += '<p><span class="itemdata options">Luck (critical damage rate +5%)</span></p>';
		}

		if (this.skill) {
			this.dataHTML += '<p><span class="itemdata options">Skill</span></p>';
		}

		if (this.getOption()) {
			this.dataHTML += '<p><span class="itemdata options">' + this.optionText + this.getOption() + '</span></p>';
		}

		if (this.excellentOption6) {
			this.dataHTML += '<p><span class="itemdata options">' + this.excellentText6 + '</span></p>';
		}

		if (this.excellentOption5) {
			this.dataHTML += '<p><span class="itemdata options">' + this.excellentText5 + '</span></p>';
		}

		if (this.excellentOption4) {
			this.dataHTML += '<p><span class="itemdata options">' + this.excellentText4 + '</span></p>';
		}

		if (this.excellentOption3) {
			this.dataHTML += '<p><span class="itemdata options">' + this.excellentText3 + '</span></p>';
		}

		if (this.excellentOption2) {
			this.dataHTML += '<p><span class="itemdata options">' + this.excellentText2 + '</span></p>';
		}

		if (this.excellentOption1) {
			this.dataHTML += '<p><span class="itemdata options">' + this.excellentText1 + '</span></p>';
		}


	}

	getClassName(number, char) {
		if (char == 'DW') {
			if (number == 1) {
				return 'Dark Wizard';
			} else if (number == 2) {
				return 'Soul Master';
			} else if (number == 3) {
				return 'Grand Master';
			}
		} else if (char == 'DK') {
			if (number == 1) {
				return 'Dark Knight';
			} else if (number == 2) {
				return 'Blade Knight';
			} else if (number == 3) {
				return 'Blade Master';
			}
		} else if (char == 'FE') {
			if (number == 1) {
				return 'Elf';
			} else if (number == 2) {
				return 'Muse Elf';
			} else if (number == 3) {
				return 'High Elf';
			}
		} else if (char == 'MG') {
			if (number == 1) {
				return 'Magic Gladiator';
			} else if (number == 2) {
				return 'Duel Master';
			}
		} else if (char == 'DL') {
			if (number == 1) {
				return 'Dark Lord';
			} else if (number == 2) {
				return 'Lord Emperor';
			}
		} else if (char == 'SU') {
			if (number == 1) {
				return 'Summoner';
			} else if (number == 2) {
				return 'Bloody Summoner';
			} else if (number == 3) {
				return 'Dimension Master';
			}
		} else if (char == 'RF') {
			if (number == 1) {
				return 'Rage Fighter';
			} else if (number == 2) {
				return 'Fist Master';
			}
		}
	}

}

module.exports = Item;