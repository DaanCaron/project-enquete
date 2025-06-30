import { WindowConfig } from "@/types";

const updateWindow = async (window: WindowConfig) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/window/update/${window.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(window),
    })
}

export default {
    updateWindow
}