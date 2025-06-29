import React, { useEffect, useRef, useState } from "react";
import { QuestionData, Button, TextBlock } from "@/types";
import ResizableDraggableBox from "./ResisibleDraggableBox";

type WindowProps = {
    question: QuestionData;
    previewWidth: number;
    previewHeight: number;
    onUpdateWindow?: (updatedWindow: QuestionData["window"]) => void; // optional callback to lift state up
};

const Window: React.FC<WindowProps> = ({
    question,
    previewWidth,
    previewHeight,
    onUpdateWindow,
}) => {
    // Use local state so dragging triggers rerender:
    const [windowObj, setWindowObj] = useState(question.window);

    const scaleX = previewWidth / 1920; // base size for scaling, adjust if needed
    const scaleY = previewHeight / 1080;

    const dragItem = useRef<{ type: "button" | "text"; id: number } | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        setWindowObj(question.window);
    }, [question]);

    const onDragStart = (
        e: React.MouseEvent,
        type: "button" | "text",
        id: number
    ) => {
        e.preventDefault();
        dragItem.current = { type, id };
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragItem.current) return;

        const { type, id } = dragItem.current;

        let newX = e.clientX - dragOffset.current.x;
        let newY = e.clientY - dragOffset.current.y;

        newX = Math.min(Math.max(newX, 0), previewWidth);
        newY = Math.min(Math.max(newY, 0), previewHeight);

        const realX = Math.round(newX / scaleX);
        const realY = Math.round(newY / scaleY);

        if (type === "button") {
            setWindowObj((prev) => {
                const newButtons = prev.buttons.map((b) =>
                    b.id === id ? { ...b, x: realX, y: realY } : b
                );
                const updated = { ...prev, buttons: newButtons };
                onUpdateWindow?.(updated);
                return updated;
            });
        } else if (type === "text") {
            setWindowObj((prev) => {
                const updated = { ...prev, text: { ...prev.text, x: realX, y: realY } };
                onUpdateWindow?.(updated);
                return updated;
            });
        }
    };

    const onMouseUp = () => {
        dragItem.current = null;
    };

    return (
        <div
            className="relative rounded-lg shadow-lg select-none"
            style={{
                width: previewWidth,
                height: previewHeight,
                backgroundColor: windowObj.background,
            }}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {windowObj.buttons.map((btn) => (
                <ResizableDraggableBox
                    key={btn.id}
                    {...btn}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    text={btn.text}
                    type="button"
                    onDragStart={(e, id) => onDragStart(e, "button", id)}
                    onResize={(id, newWidth, newHeight) => {
                        setWindowObj((prev) => {
                            const newButtons = prev.buttons.map((b) =>
                                b.id === id ? { ...b, width: newWidth, height: newHeight } : b
                            );
                            const updated = { ...prev, buttons: newButtons };
                            onUpdateWindow?.(updated);
                            return updated;
                        });
                    }}
                />
            ))}

            <ResizableDraggableBox
                {...windowObj.text}
                text={question.question}
                scaleX={scaleX}
                scaleY={scaleY}
                type="text"
                onDragStart={(e, id) => onDragStart(e, "text", id)}
                onResize={(id, newWidth, newHeight) => {
                    setWindowObj((prev) => {
                        const updated = {
                            ...prev,
                            text: { ...prev.text, width: newWidth, height: newHeight },
                        };
                        onUpdateWindow?.(updated);
                        return updated;
                    });
                }}
            />
        </div>
    );
};

export default Window;
