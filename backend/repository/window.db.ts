import { Window } from "../models/window";
import database from "../util/database"

const updateWindow = async (windowData: Window, windowId: number) => {
    try{
        const windowPrisma = await database.window.update({
            where: {
                id: windowId
            },
            data: {
                background: windowData.getBackground(),

                // Delete old buttons and recreate (simplest way to replace array relations)
                buttons: {
                    deleteMany: {}, // delete all existing buttons
                    create: windowData.getButtons().map(button => ({
                        x: button.getX(),
                        y: button.getY(),
                        width: button.getWidth(),
                        height: button.getHeight(),
                        text: button.getText()
                    }))
                },

                text: {
                    upsert: {
                        update: {
                            x: windowData.getText()?.getX() ?? 0,
                            y: windowData.getText()?.getY() ?? 0,
                            width: windowData.getText()?.getWidth() ?? 0,
                            height: windowData.getText()?.getHeight() ?? 0,
                        },
                        create: {
                            x: windowData.getText()?.getX() ?? 0,
                            y: windowData.getText()?.getY() ?? 0,
                            width: windowData.getText()?.getWidth() ?? 0,
                            height: windowData.getText()?.getHeight() ?? 0,
                        }
                    }
                }
            },
            include: {
                buttons: true,
                text: true
            }
        })
        return Window.from(windowPrisma)
    }catch(error){
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
}

const getWindowById = async (windowId: number) => {
    try{
        const windowPrisma = await database.window.findUnique({
            where: {
                id: windowId
            },
            include: {buttons: false, text: false}
        })
        if(windowPrisma === null){
            return null;
        }
        return Window.from(windowPrisma)
    }catch(error){
        console.error(error);
        throw new Error("Database error for events. See server log for details.");
    }
}

export default {
    updateWindow,
    getWindowById
}