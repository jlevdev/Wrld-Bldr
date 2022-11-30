import React, { useContext } from 'react';
import PaperContext from 'context/PaperContext';

const usePaper = () => {
    return useContext(PaperContext);
}

export default usePaper;