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
}) => {
    const isResizing = useRef(false);

    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

    const onResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isResizing.current = true;
        setResizeStart({
            x: e.clientX,
            y: e.clientY,
            w: width,
            h: height,
        });
        document.addEventListener("mousemove", onResizing);
        document.addEventListener("mouseup", onResizeMouseUp);
    };

    const onResizing = (e: MouseEvent) => {
        if (!isResizing.current) return;
        const dx = (e.clientX - resizeStart.x) / scaleX;
        const dy = (e.clientY - resizeStart.y) / scaleY;
        const newWidth = Math.max(20, resizeStart.w + dx);
        const newHeight = Math.max(20, resizeStart.h + dy);
        onResize(id, Math.round(newWidth), Math.round(newHeight));
    };

    const onResizeMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener("mousemove", onResizing);
        document.removeEventListener("mouseup", onResizeMouseUp);
    };

    return (
        <div
            className={`absolute border ${type === "button" ? "bg-blue-500 text-white" : "bg-transparent border-dashed text-black"
                } rounded cursor-move flex items-center justify-center`}
            onMouseDown={(e) => onDragStart(e, id)}
            style={{
                left: x * scaleX,
                top: y * scaleY,
                width: width * scaleX,
                height: height * scaleY,
                fontSize: `${Math.min(width * scaleX, height * scaleY) * 0.3}px`,
                textAlign: "center",
            }}
        >
            {text}
            <div
                className="absolute w-3 h-3 bg-white border border-gray-500 right-0 bottom-0 cursor-se-resize"
                onMouseDown={onResizeMouseDown}
                style={{ transform: "translate(50%, 50%)" }}
            />
        </div>
    );
};

export default ResizableDraggableBox;
