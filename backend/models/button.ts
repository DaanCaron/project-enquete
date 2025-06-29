import { Button as ButtonPrisma, Window as WindowPrisma } from "@prisma/client"
import { Window } from "./window"

export class Button {
    private id?: number
    private x: number
    private y: number
    private width: number
    private height: number
    private text: string

    private window?: Window

    constructor(params: {id?: number,  x: number, y: number, width: number, height: number, text: string, window?: Window}){
        this.id = params.id
        this.x = params.x
        this.y = params.y
        this.width = params.width
        this.height = params.height
        this.text = params.text
        this.window = params.window
    }

    static from(data: ButtonPrisma & {window? : WindowPrisma}): Button{
        return new Button({
            id: data.id,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            text: data.text,
            window: data.window ? Window.from(data.window) : undefined
        })
    }

    public getId(){
        return this.id
    }

    public getX(){
        return this.x
    }

    public getY(){
        return this.y
    }

    public getWidth(){
        return this.width
    }

    public getHeight(){
        return this.height
    }

    public getText(){
        return this.text
    }

    public getWindow(){
        return this.window
    }


    public setId(id: number){
        this.id = id
    }

    public setX(x: number){
        this.x = x
    }

    public setY(y:number){
        this.y = y
    }

    public setWidth(width: number){
        this.width = width
    }

    public setHeight(height: number){
        this.height = height
    }

    public setText(text: string){
        this.text = text
    }

    public setWindow(window: Window){
        this.window = window
    }
}