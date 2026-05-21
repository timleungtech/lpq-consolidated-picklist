import { useState, useEffect } from 'react'
import './App.css'
import DataTable from 'react-data-table-component'

function App() {
  const [data, setData] = useState([])
  const columns = [
    { name: 'Product Code', selector: row => row.productCode, grow: 1, sortable: false },
    { name: 'Product Name', selector: row => row.productName, grow: 8, sortable: false },
    { name: 'Customer', selector: row => row.customer, grow: 7, sortable: false },
    { name: 'Order Qty', selector: row => row.orderQty, grow: 1, right: true },
    { name: 'Fill Qty', selector: row => row.fillQty, grow: 1, right: true },
    { name: 'Unit', selector: row => row.unit, grow: 1 },
    { name: 'Storage', selector: row => row.storage, grow: 3 },
  ]

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const formattedDate = tomorrow.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })

  return (
    <>
      <h1 className="no-print" style={{ textAlign: 'center' }}>LPQ Packing List</h1>
      <div className="no-print" style={{ padding: '20px', textAlign: 'center' }}>
        <textarea
          onChange={(e) => {
            const value = e.target.value
            try {
              const parsed = JSON.parse(value)
              setData(parsed)
            } catch (err) {
              // optional: keep previous data or clear
              console.log("Invalid JSON")
            }
          }}
        rows={6}
        cols={70}
          placeholder="Paste data object here"
        />
      </div>
      <div style={{ width: '100vw', margin: 0, padding: 0 }}>
        {data.length > 0 && (<DataTable
          title={`Expected Delivery Date: ${formattedDate}`}
          columns={columns}
          data={data}
          striped
          dense
          // pagination
        />)}
      </div>
    </>
  )
}

export default App
