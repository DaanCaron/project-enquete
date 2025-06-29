import { Button as ButtonPrisma } from "@prisma/client"

export class Button {
    private id?: number
    private x: number
    private y: number
    private width: number
    private height: number
    private text: string

    private windowId: number | null

    constructor(params: {id?: number,  x: number, y: number, width: number, height: number, text: string, windowId: number}){
        this.id = params.id
        this.x = params.x
        this.y = params.y
        this.width = params.width
        this.height = params.height
        this.text = params.text
        this.windowId = params.windowId
    }

    static from(data: ButtonPrisma): Button{
        return new Button({
            id: data.id,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
            text: data.text,
            windowId: data.windowId
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

    public getWindowId(){
        return this.windowId
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

    public setWindowId(windowId: number){
        this.windowId = windowId
    }
}