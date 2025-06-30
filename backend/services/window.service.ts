import { Button } from "../models/button";
import { Text } from "../models/text";
import { Window } from "../models/window";
import windowDb from "../repository/window.db";
import { WindowConfig } from "../types"

const updateWindow = async (window: WindowConfig, windowId:number): Promise<Window | null> => {
    const windowCheck = await windowDb.getWindowById(windowId)

    if(!windowCheck){
        throw new Error('No window found with given ID');
    }

    try{
        const windowData: Window = new Window({
            id: window.id,
            background: window.background,
            buttons: window.buttons.map((button) => new Button(button)),
            text: new Text(window.text)
        })

        const windowRes = await windowDb.updateWindow(windowData, windowId)

        if(!windowRes){
            throw new Error('No window found with given ID');
        }

        return windowRes

    }catch(error){
        console.error(error);
        throw new Error('Error Question on given Survey');
    }
}

export default {
    updateWindow
}