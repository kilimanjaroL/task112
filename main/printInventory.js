const database = require('./datbase');
const [itemList,promotonList]=[database.loadAllItems(),database.loadPromotions()];

function printInventory(inputs) {
    let items = getItems(inputs);
    addPromotons(items);
    printItems(items);
};

function getItems(inputs) {
    return inputs.reduce((itemsInfo, value) => {
        let dealInput = translateInput(value);
    let entry = itemsInfo.find(temp => temp.barcode === dealInput.barcode);
    if (entry) {
        entry.number += dealInput.number;
    } else {
        let info = itemList.find(obj => obj.barcode === dealInput.barcode)
        if (info) {
            dealInput.name = info.name;
            dealInput.unit = info.unit;
            dealInput.price = info.price;
            itemsInfo.push(dealInput);
        }
    }
    return itemsInfo;
}, []);
}

function translateInput(input) {
    var array = input.split(/-/);
    return {
        barcode: array[0],
        number: Number.parseInt(array[1]) || 1
    }
}

function addPromotons(items) {
    let promotonBarcodes = promotonList[0].barcodes;
    promotonBarcodes.reduce((items, value) => {
        let entry = items.find(item => item.barcode === value && item.number > 2);
    if (entry) {
        entry.saleNumber = 1;
    }
    return items;
}, items);
}

function printItems(items) {
    let log = '\n***<没钱赚商店>购物清单***\n';
    let [sum, sale, promotons] = [0, 0, []];
    for (let item of items) {
        let itemPrice;
        if (item.saleNumber) {
            itemPrice = (item.number - item.saleNumber) * item.price;
            sale += item.saleNumber * item.price;
            promotons.push(`名称：${item.name}，数量：${item.saleNumber+item.unit}\n`);
        } else {
            itemPrice = item.number * item.price;
        }
        sum += itemPrice;
        log += (`名称：${item.name}，数量：${item.number+item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${itemPrice.toFixed(2)}(元)\n`);
    }
    if (promotons.length !== 0) {
        log += ('----------------------\n挥泪赠送商品：\n');
        for (let promoton of promotons) {
            log += (promoton);
        }
    }
    log += (`----------------------\n总计：${sum.toFixed(2)}(元)\n节省：${sale.toFixed(2)}(元)\n**********************`);

    console.log(log);
}

module.exports = printInventory;
