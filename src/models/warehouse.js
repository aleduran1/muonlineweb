'use strict';

const item = require('./item');

class Warehouse {

	constructor(hex) {
		this._buffer = Buffer.from(hex);
		this.warehouse = [];
		this.hex = '';
		this.initialize();
		this.setBelongings();
	}

	initialize() {

		let row = 1;
		let column = 1;

		for (let i = 0; i < 120; i++) {

			this.itemHex = this._buffer.toString(undefined, i * 32, (i + 1) * 32);
			let object;

			if (!this.isEmpty(this.itemHex)) {
				object = new item(this.itemHex);
			} else {
				object = new item();
			}

			if (!this.warehouse[row]) {
				this.warehouse[row] = [];
			}
			this.warehouse[row][column] = object;
			column++;
			if (column == 9) {
				row++;
				column = 1;
			}

		}
	}

	setBelongings() {
		for (let row = 1; row < 16; row++) {
			for (let column = 1; column < 9; column++) {
				let slot = this.warehouse[row][column];
				if (!this.isEmpty(slot.hex)) { // Entonces es un item
					if (slot.X > 1) {
						if (slot.Y > 1) {
							for (let i = 0; i < slot.Y; i++) {
								for (let j = 0; j < slot.X; j++) {
									if (j != 0 || i != 0) {
										this.warehouse[parseInt(row) + parseInt(i)][parseInt(column) + parseInt(j)] = new item(row, column);
									}
								}
							}
						} else {
							for (let i = 1; i < slot.X; i++) {
								this.warehouse[row][parseInt(column) + parseInt(i)] = new item(row, column);
							}
						}
					} else if (slot.Y > 1) {
						for (let i = 1; i < slot.Y; i++) {
							this.warehouse[parseInt(row) + parseInt(i)][column] = new item(row, column);
						}
					}
				}
			}
		}
	}

	isEmpty(hex) {
		if (hex.toUpperCase() == 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF') {
			return 1;
		} else {
			return 0;
		}
	}

	printWarehouse() {
		let print = [];
		for (let row = 1; row < 16; row++) {
			print[row] = '';
			for (let column = 1; column < 9; column++) {
				let slot = this.warehouse[row][column];
				if (slot.btrow) {
					print[row] += ' | ' + slot.name.substr(0, 1).toUpperCase() + slot.btrow + slot.btcol;
				} else {

					print[row] += ' | ' + slot.name.substr(0, 3).toUpperCase();
				}
			}
		}
		for (let p = 1; p < 16; p++) {
			console.log(print[p]);
		}
	}

	prepareHex() {
		this.hex = '';
		for (let row = 1; row < 16; row++) {
			for (let column = 1; column < 9; column++) {
				this.hex += this.warehouse[row][column].hex;
			}
		}
	}

	searchForSlot(x, y) {

		if (x < 1 || y < 1) {
			return 0;
		}

		let place = {
			row: -1,
			column: -1
		};
		let slotsFound = 0;

		for (let row = 1; row < 16; row++) {
			for (let column = 1; column < 9; column++) {

				if (place.row != -1 && place.column != -1) {
					break;
				}

				slotsFound = 0;

				let slot = this.warehouse[row][column];

				if (slot.isEmpty && !slot.belongs) {
					if (place.row != -1 && place.column != -1) {
						break;
					}
					slotsFound = 1;
					if (x > 1) {
						if (y > 1) {
							for (let i = 0; i < y; i++) {
								for (let j = 0; j < x; j++) {
									if (j != 0 || i != 0) {
										if (parseInt(row) + parseInt(i) < 16 && parseInt(column) + parseInt(j) < 9) {
											let thisItem = this.warehouse[parseInt(row) + parseInt(i)][parseInt(column) + parseInt(j)];
											if (thisItem.isEmpty & !thisItem.belongs) {
												slotsFound++;
											} else {
												break;
											}
										}
									}
								}
							}
						} else {
							for (let i = 1; i < x; i++) {
								if (parseInt(column) + parseInt(i) < 9) {
									let thisItem = this.warehouse[row][parseInt(column) + parseInt(i)];
									if (thisItem.isEmpty & !thisItem.belongs) {
										slotsFound++;
									} else {
										break;
									}
								}
							}
						}
					} else if (y > 1) {
						for (let i = 1; i < y; i++) {
							if (parseInt(row) + parseInt(i) < 16) {
								let thisItem = this.warehouse[parseInt(row) + parseInt(i)][column];
								if (thisItem.isEmpty & !thisItem.belongs) {
									slotsFound++;
								} else {
									break;
								}
							}
						}
					}
					if (slotsFound == (x * y)) {
						place.row = row;
						place.column = column;
					}
				}
			}
		}

		if (place.row != -1 && place.column != -1) {
			return place;
		} else {
			return 0;
		}
	}

	clearInventory() {
		for (let row = 1; row < 16; row++) {
			for (let column = 1; column < 9; column++) {
				console.log('se ha tocado la fila ' + row + ' y la columna ' + column);
				this.warehouse[row][column] = new item();
			}
		}
		this.setBelongings();
		this.prepareHex();
	}

	getHex(row, column) {
		if (this.isEmpty(this.warehouse[row][column].hex)) {
			return 0;
		}
		return this.warehouse[row][column].hex;
	}

	removeItemHex(row, column) {
		this.warehouse[row][column] = new item();
		this.setBelongings();
		this.prepareHex();
		return 1;
	}

	removeItem(arg) {
		let hex = '';
		if (arg.name) {
			hex = arg.hex;
		} else if (arg.length == 32) {
			hex = arg;
		} else {
			return 0;
		}

		if (this.isEmpty(hex)) {
			return 0;
		}

		let deleted = 0;
		for (let row = 1; row < 16; row++) {
			if (deleted)
				break;
			for (let column = 1; column < 9; column++) {
				if (this.warehouse[row][column].hex == hex) {
					this.warehouse[row][column] = new item();
					this.setBelongings();
					this.prepareHex();
					deleted = 1;
				}
			}
		}

		if (deleted)
			return 1;
		else
			return 0;
	}

	addItem(arg) {

		if (arg.name) {
			let place = this.searchForSlot(arg.X, arg.Y);
			if (place) {
				this.warehouse[place.row][place.column] = arg;
				this.setBelongings();
				this.prepareHex();
				return 1;
			} else {
				return 0;
			}
		} else if (arg.length == 32) {
			arg = new item(arg);
			let place = this.searchForSlot(arg.X, arg.Y);
			if (place) {
				this.warehouse[place.row][place.column] = arg;
				this.setBelongings();
				this.prepareHex();
				return 1;
			} else {
				return 0;
			}
		} else {
			return 0;
		}

	}

}

module.exports = Warehouse;