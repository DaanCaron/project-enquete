import { Button, Survey } from "@/types"

type props = {
    originalColor: string
    changeColor(color: string): void
    snapToGrid(state: boolean): void
    addButton(): void
}

const LeftSideMenu: React.FC<props> = ({ originalColor, changeColor, snapToGrid, addButton}) => {
    return (
        <div className="bg-[#252525] mr-4 h-full w-64 p-4 rounded shadow-lg flex flex-col justify-between">
            <label className="flex flex-col items-center text-white font-medium gap-2">
                <span>Pick a background</span>
                <input
                    type="color"
                    className="w-16 h-16 p-1 rounded-lg shadow-inner border-2 border-white cursor-pointer"
                    value={originalColor}
                    onChange={(e) => changeColor(e.target.value)}
                />
                <label className="flex items-center gap-2 mt-11">
                    <span>Snap to Grid</span>
                    <input
                        type="checkbox"
                        onChange={(e) => snapToGrid(e.target.checked)}
                        className="cursor-pointer w-5 h-5"
                    />
                </label>
                <label className="flex items-center gap-2 mt-11">
                    <button
                        onClick={() => addButton()}
                        className="rounded-md bg-gray-400 hover:bg-gray-500 transition-colors duration-150 w-36 h-10"
                    >
                        Add a button!
                    </button>
                </label>
            </label>
        </div>
    )
}

export default LeftSideMenu
