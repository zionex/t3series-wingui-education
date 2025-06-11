import React, {useState } from "react"
import Pagination from "react-js-pagination"; 
import './Paging.css';

const Paging = ({activePage, itemsCountPerPage, totalItemsCount, pageRangeDisplayed, onChange}) => {
  return (
    <Pagination
      activePage={activePage}
      itemsCountPerPage={itemsCountPerPage}
      totalItemsCount={totalItemsCount}
      pageRangeDisplayed={pageRangeDisplayed}
      prevPageText={"‹"}
      nextPageText={"›"}
      onChange={(page)=>onChange(page)}
    />
  );
};

export default Paging;
