## Summary
Generates a custom report for packing products by displaying data as JSON, object table in browser console through console.table(), or on the React web app.

## How it works
Data is retrieved from html classes and attributes and consolidated into a comma separated array. Constructor is used to make JSON row objects with the data. JSON data can be exported to web app to display an Orders By Product report. 

## How to get the data object
1. Copy script.js
2. Navigate to CrunchTime's Sales Orders By Customers Consolidated Picklist report
3. Group By Customers
4. Ensure 6 columns sorted in this order: Product Number, Product Name, Issue Unit, Order Qty, Fill Qty, Storage Location
5. Open browser console
6. Paste script.js into browser console
7. Copy the dataWithSubtotals object

## How to view table and print
1. Go to https://timleungtech.github.io/lpq-consolidated-picklist
2. Paste JSON into text box
3. Print

![preview](https://raw.githubusercontent.com/timleungtech/lpq-consolidated-picklist/refs/heads/main/samples/preview.jpg)
