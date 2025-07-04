import React, { useRef, useState } from "react";

type Props = {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    scaleX: number;
    scaleY: number;
    onDragStart: (e: React.MouseEvent, id: number) => void;
    onResize: (id: number, newWidth: number, newHeight: number) => void;
    type: "button" | "text";
    snaptoGrid: boolean
    gridSize: number
    onTextChange?: (id: number, newText: string) => void;
};

const ResizableDraggableBox: React.FC<Props> = ({
    id,
    x,
    y,
    width,
    height,
    text,
    scaleX,
    scaleY,
    onDragStart,
    onResize,
    type,
    snaptoGrid,
    gridSize,
    onTextChange
}) => {

    const isResizing = useRef(false);
    const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

    const clickStartTime = useRef<number | null>(null);
    const CLICK_THRESHOLD_MS = 150;

    const [editing, setEditing] = useState(false)
    const [tempText, setTempText] = useState(text);

    //resizing
    const onResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isResizing.current = true;
        resizeStartRef.current = {
            x: e.clientX,
            y: e.clientY,
            w: width,
            h: height,
        };
        document.addEventListener("mousemove", onResizing);
        document.addEventListener("mouseup", onResizeMouseUp);
    };

    const onResizing = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const { x, y, w, h } = resizeStartRef.current;
        const dx = (e.clientX - x) / scaleX;
        const dy = (e.clientY - y) / scaleY;
        let newWidth = Math.max(20, w + dx);
        let newHeight = Math.max(20, h + dy);

        if (snaptoGrid) {
            newWidth = Math.round(newWidth / gridSize) * gridSize
            newHeight = Math.round(newHeight / gridSize) * gridSize
        }

        onResize(id, Math.round(newWidth), Math.round(newHeight));
    };

    const onResizeMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", onResizing);
        document.removeEventListener("mouseup", onResizeMouseUp);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        clickStartTime.current = Date.now();
        onDragStart(e, id);
    };

    const handleMouseUp = () => {
        const now = Date.now();
        if (clickStartTime.current !== null && now - clickStartTime.current < CLICK_THRESHOLD_MS) {
            setEditing(true)
        }
        clickStartTime.current = null;
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempText(e.target.value);
    };

    const commitText = () => {
        setEditing(false);
        onTextChange?.(id, tempText);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commitText();
        }
    };

    return (
        <div
            className={`absolute border ${type === "button" ? "bg-blue-500 text-white" : "bg-transparent border-dashed text-black"
                } rounded cursor-move flex items-center justify-center`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            style={{
                left: x * scaleX,
                top: y * scaleY,
                width: width * scaleX,
                height: height * scaleY,
                fontSize: `${Math.min(width * scaleX, height * scaleY) * 0.3}px`,
                textAlign: "center",
            }}
        >
            {editing ? (
                <input
                    type="text"
                    className="w-full h-full p-1 bg-white text-black rounded outline-none"
                    value={tempText}
                    autoFocus
                    onChange={handleTextChange}
                    onBlur={commitText}
                    onKeyDown={handleKeyDown}
                />
            ) : (
               <div>
                    {text}
                </div> 
            )}
            <div
                className="absolute w-3 h-3 bg-white border border-gray-500 right-0 bottom-0 cursor-se-resize"
                onMouseDown={onResizeMouseDown}
                style={{ transform: "translate(50%, 50%)" }}
            />
            <p className="absolute left-0 bottom-0 text-base text-white ml-1 mb-1">{width}, {height}</p>

        </div>
    );
};

export default ResizableDraggableBox;
