import { Survey } from "@/types"

type props = {
    originalColor: string
    changeColor(color: string): void
}

const LeftSideMenu: React.FC<props> = ({originalColor, changeColor}) => {
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
            </label>
        </div>
    )
}

export default LeftSideMenu
