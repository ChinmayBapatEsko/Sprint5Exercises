/*

This Component is a demo as to how we can make a table without using bootstrap datatable class by making use of the table tag in html.
Assumes a set of data (can be retrieved from database too) and provides features such as pagination, variable page size, sort by any column and search by keyword. 

*/



import React, { useState } from "react";
import '../css/Datatable.css'
import Navbar from "./Navbar";

const data = [
  { id: 1, name: 'John Doe', age: 30, city: 'New York' },
  { id: 2, name: 'Jane Smith', age: 25, city: 'Los Angeles' },
  { id: 3, name: 'Mike Johnson', age: 35, city: 'Chicago' },
  { id: 4, name: 'Alex Smith', age: 28, city: 'New York' },
  { id: 5, name: 'Chinmay Bapat', age: 40, city: 'Los Angeles' },
  { id: 6, name: 'Jeremy Clarkson', age: 45, city: 'Houston' },
  { id: 7, name: 'Lucy Hernandez', age: 32, city: 'Phoenix' },
  { id: 8, name: 'Omar Bradley', age: 37, city: 'Philadelphia' },
  { id: 9, name: 'Tina Fey', age: 29, city: 'San Antonio' },
  { id: 10, name: 'Bruce Wayne', age: 41, city: 'San Diego' },
  { id: 11, name: 'Nora Jones', age: 34, city: 'Dallas' },
  { id: 12, name: 'Peter Parker', age: 22, city: 'San Jose' },
  { id: 13, name: 'Lara Croft', age: 36, city: 'Austin' }
];

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'age', label: 'Age' },
  { key: 'city', label: 'City' },
];

const defaultPageSize = 5;

const Datatable = () => {
    const [page, setPage] = useState(1); //sets current shown page to the user.
    const [pageSize, setPageSize] = useState(defaultPageSize); // sets the current page size that the user has selected.
    const[searchTerm, setSearchTerm] = useState(''); // sets the search keyword
    const [sortConfig, setSortConfig] = useState({key:'id', direction:'ascending'}); //Sets the sort configuration. Key is the type based on which the sort should happen.

    //data.filter -> operation on an array. Item is an element in the data array. Here we are expecting the data array must contain JSON objects. And when we search, we must search inside values of the JSON object.
    //Object.values(item) --> [value1, value2, value3] --> .some() checks if the item passes the test.
    //The test being: value has the substring - the search item
    const filteredData = data.filter(item => Object.values(item).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())));

    //sort data based on the sort configuration.
    const sortedData = () => {
        const sortableItems = [...filteredData];

        if(sortConfig.key !== null){
            sortableItems.sort((a, b) => {
                if(a[sortConfig.key] < b[sortConfig.key]){
                    return sortConfig.direction == 'ascending' ? -1 : 1;
                }
                if(a[sortConfig.key] > b[sortConfig.key]){
                    return sortConfig.direction == 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return sortableItems;
    }

    const handleChangePage = (newPage) =>{
        setPage(newPage);
    };

    const handleChangePageSize = (size) =>{
        setPageSize(size);
        setPage(1);
    }

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({key, direction});
    };

    const paginatedData = sortedData().slice((page-1) * pageSize, page * pageSize);


    return(
    <>
    <Navbar/>
    <h1 className="header">Employee Data</h1>
    <div className="tableContainer">
      <input className="searchBar"
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="dataTable">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} onClick={() => handleSort(column.key)}>
                {column.label}
                {sortConfig.key === column.key && (
                  <span>{sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pageSizeSelectors">
        <p>No. of Rows per page: </p>
        <div className="pageSizeButtons">
        <button className="nRowsPageButton" onClick={() => handleChangePageSize(5)}>5</button>
        <button className="nRowsPageButton" onClick={() => handleChangePageSize(10)}>10</button>
        <button className="nRowsPageButton" onClick={() => handleChangePageSize(20)}>20</button>
        </div>
      </div>
      <div className="pageNumberSelector">
        {filteredData.length > pageSize && (
          <ul className="pageNumberList">
            <p>Page Numbers: </p>
            <div className="pageNumberButtons">
            {Array.from({ length: Math.ceil(filteredData.length / pageSize) }, (_, index) => index + 1).map(
              (num) => (
                <li key={num}>
                  <button onClick={() => handleChangePage(num)}>{num}</button>
                </li>
              )
            )}
            </div>
          </ul>
        )}
      </div>
    </div>
    </>
    )
};

export default Datatable;