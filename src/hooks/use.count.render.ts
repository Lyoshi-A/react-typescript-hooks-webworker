import {useRef} from "react";

export const useCountRenders = (title:string, reset:boolean = false) =>{
    const render = useRef(0)
    if (reset) render.current = 0;
    //console.log(`--------------${title}`, render.current++);
}