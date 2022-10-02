import {  useEffect } from 'react';

export default function useUpdateLogger(val) {
    useEffect(() => {
        console.log(val);
    }, [val])
}