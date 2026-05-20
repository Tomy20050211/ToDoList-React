import { useEffect, useState } from "react";


export function useTimer(initialTimer: number = 0){
    const [time, setTime] = useState(initialTimer)

    const [isRunning, setIsRunning] = useState(false)

    useEffect(() =>{

        let interval:number 

        if(isRunning) {
            interval = setInterval(() =>{
                setTime(prev => prev +1)
            }, 1000)
        }

        return ()=> clearInterval(interval)
    }, [isRunning])

    function start(){
        setIsRunning(true)
    }

    function stop(){
        setIsRunning(false)
    }

    function reset(){
        setTime(initialTimer)
        setIsRunning(false)
    }

    return {
        time,
        isRunning,
        start,
        stop,
        reset
    }
}

