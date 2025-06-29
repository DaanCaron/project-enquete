import { Text as TextPrisma } from "@prisma/client"

export class Text {
    private id?: number
    private x: number
    private y: number
    private width: number
    private height: number
    private windowId: number | null

    constructor(params: {id?: number,  x: number, y: number, width: number, height: number, windowId: number}){
        this.id = params.id
        this.x = params.x
        this.y = params.y
        this.width = params.width
        this.height = params.height
        this.windowId = params.windowId
    }

    static from(data: TextPrisma): Text{
        return new Text({
            id: data.id,
            x: data.x,
            y: data.y,
            width: data.width,
            height: data.height,
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

    public setWindowId(windowId: number){
        this.windowId = windowId
    }
}