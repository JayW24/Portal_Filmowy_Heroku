import React from 'react'
import ConvertDate from './ConvertDate'

export default function statusStyler(status, time_sent, time_received) {
    if (status == "read") {
        return <>
            <span className="m-1">Odczytano</span>
            <i className="m-1" class="fa-solid fa-check"></i>
            <span className="m-1">{ConvertDate(time_received)}</span>
        </>
    }
    else {
        return <>
            Wysłana: <i class="fa-solid fa-arrow-trend-up"></i> {ConvertDate(time_sent)}
        </>
    }
}