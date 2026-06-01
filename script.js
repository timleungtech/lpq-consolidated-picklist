// LPQ Orders by Product report generator. Run this script in the console of CrunchTime's Orders By Customers Consolidated Picklist page for an object table.
// Required: 
//  - Group By Customers
//  - 6 columns sorted in this order: Product Number, Product Name, Issue Unit, Order Qty, Fill Qty, Storage Location

// get all td with html attribute data-qtip
function getTableValues(){
    let rows = document.querySelectorAll('td[data-qtip]')
    let items = [...rows].map(x => x.getAttribute("data-qtip"))
    return items
}
// get all customers who placed orders
function getCustomers(){
    let header = document.querySelectorAll('div.x-grid-group-title')
    let customers = [...header].map(x => x.innerText.trim().slice(10))
    // let sixDigitCustomers = customers.map(x => x.charAt(0) == '3' ? '00' + x : '000' + x)
    return customers
}
// helper function to remove commas for numbers greater than 3-digits
function cleanQty(val){
    return String(val).replace(/,/g, '') || '0'
}
// make an array of rows that contains array elements with comma separated values
function makeRows(){
    let arrayOfRows = []
    let row = []
    let items = tableValues
    let j = 0
    let currentCustomer = customers[j]
    for (let i = 0; i < items.length; i++){
        if (items[i].startsWith('Subtotal') === true || items[i].startsWith('Totals') === true){
            j++
            currentCustomer = customers[j]
            i += 2
        } else {
            row = currentCustomer.concat(delimiter, items[i], delimiter, items[i+1], delimiter, items[i+2], delimiter, cleanQty(items[i+3]), delimiter, cleanQty(items[i+4]), delimiter, items[i+5])
            arrayOfRows.push(row)
            i += 5
        }
    }
    return arrayOfRows
}
// row constructor to convert array to object
class MakeRowObj{
    constructor(customer, productCode, productName, unit, orderQty, fillQty, storage){
        this.customer = customer
        this.productCode = productCode
        this.productName = productName
        this.unit = unit
        this.orderQty = Number(orderQty)
        this.fillQty = Number(fillQty)
        this.storage = storage
    }
}
// converts array to object
function makeArrayOfObjects(){
    let row = []
    let arrayOfObjects = []
    for (let i = 0; i < rows.length; i++){
        row = rows[i].split(delimiter)
        let obj = new MakeRowObj(row[0], row[1], row[2], row[3], row[4], row[5], row[6])
        arrayOfObjects.push(obj)
    }
    return arrayOfObjects
}
// sort objects by productName and then by customer
function sortByProperty(data){
    let primary = 'productName'
    let secondary = 'customer'
    return data.sort((a, b) => (a[primary] > b[primary]) ? 1 : (a[primary] === b[primary]) ? ((a[secondary] > b[secondary]) ? 1 : -1) : -1 )
}
// get unique item names
function getUniqueProductNames(){
    let subtotalProductNames = []
    for (let i = 0; i < data.length; i++){
        subtotalProductNames.push(data[i].productName)
    }
    let uniqueSubtotalNames = [...new Set(subtotalProductNames)]
    return uniqueSubtotalNames
}
// sum items subtotal. params: "orderQty", "fillQty"
function getItemsSubtotalList(qtyType){
    let sum = 0
    let arrayOfSums = []
    for (let j = 0; j < uniqueProductNames.length; j++){
        for (let i = 0; i < data.length; i++){
            if (uniqueProductNames[j] == data[i].productName){
                sum += data[i][qtyType]
            }
        }
        arrayOfSums.push(sum)
        sum = 0
    }
    return arrayOfSums
}
// create subtotals rows
function createSubtotalsRow(){
    let itemsIndex = 0
    let subtotal = {}
    for (let i = 0; i < data.length - 1; i++){
        if (data[i].productName !== data[i+1].productName){
            subtotal = new MakeRowObj(null, data[i].productCode, `TOTAL: ${data[i].productName}`, data[i].unit, orderedSubtotals[itemsIndex], filledSubtotals[itemsIndex], data[i].storage)
            data.splice(i+1, 0, subtotal)
            i++
            itemsIndex++
        }
    }
    let lastSubtotal = new MakeRowObj(null, data[data.length - 1].productCode, `TOTAL: ${data[data.length - 1].productName}`, data[data.length - 1].unit, orderedSubtotals[itemsIndex], filledSubtotals[itemsIndex], data[data.length - 1].storage)
    data.splice(data.length, 0, lastSubtotal)    
    return data
}
function countStoresContainingItem (item){
    let stores = 0
    for (let i = 0; i < data.length; i++){
        if (data[i].productName == item && data[i].customer !== null){
            stores++
        }
    }
    return stores
}

function getDivIdByLabel(labelText) {
    // find all label text spans
    const labels = Array.from(document.querySelectorAll('.x-form-item-label-text'))
    // find the span that matches text in parameter
    const targetLabel = labels.find(el => el.textContent.trim() === labelText)
    if (targetLabel) {
        // move up the DOM tree to the top-level div container (class 'x-field')
        const parentDiv = targetLabel.closest('.x-field')
        return parentDiv ? parentDiv.id : null
    }
    return null
}

let allCustomers = [
    '114', 
    '118', 
    '123', 
    '127', 
    '130', 
    '134', 
    '136', 
    '142', 
    '144', 
    '146', 
    '148', 
    '149', 
    '151', 
    '153', 
    '154', 
    '156', 
    '3002', 
    '3003', 
    '3004', 
    '3005', 
    '3007', 
    '3008', 
    '3009', 
    '3010', 
    '3011', 
    '3013', 
    '3404', 
    '401', 
    '402', 
    '403'
]

let delimiter = '**'
let tableValues = getTableValues()
let customers = getCustomers()
let rows = makeRows()
let data = sortByProperty(makeArrayOfObjects())

let uniqueProductNames = getUniqueProductNames()
let orderedSubtotals = getItemsSubtotalList('orderQty')
let filledSubtotals = getItemsSubtotalList('fillQty')

let dataWithSubtotals = createSubtotalsRow(data)

const dateBeginId = getDivIdByLabel('Begin Date:')
const dateEndId = getDivIdByLabel('End Date:')
const templateId = getDivIdByLabel('Template:')
const dateBeginValue = document.getElementById(dateBeginId).querySelector('input').value
const dateEndValue = document.getElementById(dateEndId).querySelector('input').value
const templateValue = document.getElementById(templateId).querySelector('input').value

let dataWithLabels = {
    data: dataWithSubtotals,
    dateBegin: dateBeginValue,
    dateEnd: dateEndValue,
    template: templateValue
}

console.table(dataWithSubtotals)

// sum all subtotals
let totalOrdered = orderedSubtotals.reduce((a, c) => a + c)
let totalFilled = filledSubtotals.reduce((a, c) => a + c)
console.log(`Quantity: ${totalFilled} of ${totalOrdered}`)

let storesWithWheat = countStoresContainingItem('BREAD WHEAT OG')
if (storesWithWheat > 0){
    console.log(`Stores with wheat: ${storesWithWheat}`)
}

let customersSubmittedOrder = customers.map(x => x.slice(0,4).trim())
let customersMissingOrder = allCustomers.filter(x => !customersSubmittedOrder.includes(x))
if (customersMissingOrder.length > 0){
    console.log(`Stores missing order (${customersMissingOrder.length}): ${customersMissingOrder}`)
}

console.log(dataWithLabels)