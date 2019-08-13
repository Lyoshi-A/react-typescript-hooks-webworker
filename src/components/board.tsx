import React, {useCallback, useEffect, useState} from "react";
import wWorker from '../services/app.worker.js';
import {Canvas} from './canvas'
import {WebWorker} from '../services/WebWorker';
import {useCountRenders} from '../hooks/use.count.render'
import './board.css'

type TLive = {
    cells:number[][],
    time:string,
    tick:number
}

type TLiveData = {
    type:string,
    cells?:number[][],
    size?:number
}

interface LiveFunc {
    (data:number[][]) : void;
}

interface BoardHeader {
   (data:number[][]) : Element;
}

const runWorker = (data:TLiveData, cb:LiveFunc):void => {
    const worker = WebWorker(wWorker);
    worker.postMessage(data)
    worker.addEventListener('message', (event) =>  cb(event.data))
}

const defaultState = ():TLive => ({
    cells:[],
    time:new Date().toTimeString().split(' ')[0],
    tick:0
})

interface HeaderProps {
    time:string,
    tick:number
}

const Header = React.memo(({time,tick}:HeaderProps)=>{
    useCountRenders('Header');
    return <h2>LIFE ({time}) CYCLE: {tick}</h2>
})

export const Board = () => {
    const size = 129;
    const [life, changeLife] = useState<TLive>(defaultState);
    const [interval, setNewInterval] = useState<any>(undefined);

    const newTick = useCallback(()=> {
        changeLife(currentLife => ({
                ...currentLife,
                time: new Date().toTimeString().split(' ')[0],
                tick: currentLife.tick+1
            }))
    },[changeLife])

    useEffect(() => {
        runWorker(life.tick ? {type: 'live', cells: life.cells} : {type: 'init', size: size}, res => {
            changeLife(currentLife => ({
                    ...currentLife,
                    cells: res
                }))
        })
    },[life.tick])

    const startClick = () => {
        setNewInterval(setInterval(() => {
            newTick();
        }, 500))
    }

    const stopClick = () => {
        clearInterval(interval)
    }

    const resetClick = () => {
        clearInterval(interval);
        changeLife(defaultState)
    }

    useCountRenders('Board');
    return <>
        <Header time={life.time} tick={life.tick}/>
        <div className="col s6">
            <button className="btn btn-large waves-effect waves-light hoverable purple-dark accent-3" onClick={startClick}>{'START'}</button>
            <button className="btn btn-large waves-effect waves-light hoverable red-dark accent-3" onClick={stopClick}>{'STOP'}</button>
            <button className="btn btn-large waves-effect waves-light hoverable red-dark accent-3" onClick={resetClick}>{'RESET'}</button>
        </div>
        <Canvas width={1296} height={1200} block={10} cells={life.cells}/>
    </>
}