import React from 'react'
import ConvertDate from './ConvertDate'

export default function statusStyler(status, time_sent, time_received) {
    if (status === "read") {
        return <>
            <span>Odczytano</span>
            <i className="fa-solid fa-check"></i>
            <span>{ConvertDate(time_received)}</span>
        </>
    }
    else {
        return <>
            Wysłana: <i class="fa-solid fa-arrow-trend-up"></i> {ConvertDate(time_sent)}
        </>
    }
}