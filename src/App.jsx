import { useState, useEffect, useMemo } from 'react'
import './App.css'
import Header from "./Header"
import DataTable from 'react-data-table-component'

function App() {
  const [data, setData] = useState({
    data: [],
    dateBegin: null,
    dateEnd: null,
    template: null,
  })

  const columns = [
    { name: 'Product Code', selector: row => row.productCode, grow: 1, sortable: false },
    { name: 'Product Name', selector: row => row.productName, grow: 40, sortable: false },
    { name: 'Customer', selector: row => row.customer, grow: 30, sortable: false },
    { name: 'Order Qty', selector: row => row.orderQty, grow: 1, right: true },
    { name: 'Fill Qty', selector: row => row.fillQty, grow: 1, right: true },
    { name: 'Unit', selector: row => row.unit, grow: 12 },
    { name: 'Storage', selector: row => row.storage, grow: 20 },
  ]

  const totalFillQty = useMemo(() => {
    return data.data.reduce((sum, item) => {
      return item.customer === null ? sum + item.fillQty : sum
    }, 0)
  }, [data.data])

  const totalOrderQty = useMemo(() => {
    return data.data.reduce((sum, item) => {
      return item.customer === null ? sum + item.orderQty : sum
    }, 0)
  }, [data.data])

  const tableHeaderWithSubtitle = (
    <div style={{ padding: '10px 0' }}>
      <h2 style={{ margin: 0, fontSize: '14px'}}>{data.template}</h2>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700}}>{data.dateBegin} to {data.dateEnd}</p>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700}}>{totalFillQty} of {totalOrderQty}</p>
      <hr />
    </div>
  )

  const conditionalRowStyles = [
  {
    // Subtotal row styles
    when: (row) => row.customer == null,
    style: {
      backgroundColor: '#DDD', 
      boxShadow: 'inset 0px 0px 0px 1px #000', 
      // fontWeight: '600',
    },
  },
  ]

  return (
    <>
      <Header />
      <div className="no-print" style={{ padding: '20px', textAlign: 'center' }}>
        <textarea
          onChange={(e) => {
            const value = e.target.value
            try {
              const parsed = JSON.parse(value)
              setData({
                data: parsed.data || [],
                dateBegin: parsed.dateBegin || null,
                dateEnd: parsed.dateEnd || null,
                template: parsed.template || null,
              })
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
      <div style={{ width: '100vw', margin: 0, padding: 0, textAlign: 'center' }}>
        {data.data.length > 0 && (
          <DataTable
            title={tableHeaderWithSubtitle}
            columns={columns}
            data={data.data}
            conditionalRowStyles={conditionalRowStyles}
            striped
            dense
            // pagination
          />
        )}
      </div>
    </>
  )
}

export default App
