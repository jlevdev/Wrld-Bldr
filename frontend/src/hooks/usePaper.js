import React, { useContext } from 'react';
import PaperContext from 'context/PaperContext';

export const usePaper = () => {
    return useContext(PaperContext);
}

export default usePaper;
