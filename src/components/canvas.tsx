import React, { useEffect, useRef} from "react";
import {useCountRenders} from '../hooks/use.count.render'

const xSCALE = 1
const ySCALE = 1

interface CanvasProps {
    height:number,
    width:number,
    block:number,
    cells?:number[][]
}

type TLocation = {
    x:number,
    y:number,
    type:number
}

function draw(ctx:any, location:TLocation, block:number):void {
    ctx.fillStyle = location.type?'deepskyblue':'white';
    ctx.shadowBlur = 20
    ctx.save()
    ctx.scale(xSCALE, ySCALE)
    ctx.fillRect(location.x , location.y, block, block);
    ctx.restore()
}

export const Canvas = React.memo(({width, height, block, cells=[]}:CanvasProps) => {
    const canvasRef = useRef(null)
    // const xBoard = Math.floor((width-1) / block)*block;
    // const yBoard = Math.floor((height-1) / block)*block;
    const xOffset = Math.round(((width-1) % block)/2);
    // const yOffset = Math.round(((height-1) % block)/2);
    useEffect(() => {
             const canvas : any = canvasRef.current
             const ctx = canvas.getContext('2d')
             ctx.clearRect(0, 0, width, height)
             cells.forEach((line: number[], y: number) => {
                 line.forEach((cell: number, x: number) =>
                     cell?draw(ctx, {
                         x: xOffset + x * block,
                         y: y * block,
                         type: 1
                     }, block):false
                 )
             })
    }, [cells])

    useCountRenders('Canvas')
    return <div className="canvas">
        <canvas ref={canvasRef} width={width} height={height} />
    </div>
})