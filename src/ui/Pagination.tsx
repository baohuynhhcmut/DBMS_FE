import ReactPaginate from 'react-paginate';
import { ProductProps } from '../type';
import React, { useState } from 'react';

type Pagination = {
    totalPage:number;
    currentPage:number;
}

type Props = {
    product:ProductProps[]
    itemOffset:number;
    setItemOffset: React.Dispatch<React.SetStateAction<number>>;
    itemsPerPage:number;    
}   


const Pagination = ({ product,itemOffset,setItemOffset,itemsPerPage }:Props) => {

    const endOffset = itemOffset + itemsPerPage;
    const pageCount = Math.ceil(product.length / itemsPerPage);
    
    // Invoke when user click to request another page.
    const handlePageClick = (event:any) => {
      const newOffset = (event.selected * itemsPerPage) % product.length;
    
      const element = document.getElementById("products");
        if (element) {
            const offset = -150; // Padding in pixels
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            console.log(elementPosition);
            window.scrollTo({ top: elementPosition + offset, behavior: "smooth" });
        }
      setItemOffset(newOffset);
    };

    return (
        <div className='flex items-center justify-between mt-5'>
            <ReactPaginate
            breakLabel="..."
            nextLabel=""
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            pageCount={pageCount}
            previousLabel=""
            renderOnZeroPageCount={null}
            pageClassName='bg-white text-black ring-1 ring-gray-300  flex items-center justify-center cursor-pointer ring-inset'
            pageLinkClassName='w-full px-3'
            activeClassName='text-white !bg-black !ring-0  transition-all duration-300 ease-in-out'
            containerClassName='flex flex-row gap-x-2 items-center'
        />    
        <p>Product from {itemOffset + 1} to {endOffset <= product.length ? endOffset : product.length}</p>
        </div>
    )
}

export default Pagination