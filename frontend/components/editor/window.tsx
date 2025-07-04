import React, { useEffect, useRef, useState } from "react";
import { QuestionData, Button, TextBlock } from "@/types";
import ResizableDraggableBox from "./ResisibleDraggableBox";

type WindowProps = {
    question: QuestionData;
    previewWidth: number;
    previewHeight: number;
    onUpdateWindow?: (updatedWindow: QuestionData["window"]) => void;
    onUpdateQuestionText?: (newText: string) => void;
    snapToGrid: boolean
};

const Window: React.FC<WindowProps> = ({
    question,
    previewWidth,
    previewHeight,
    onUpdateWindow,
    snapToGrid,
    onUpdateQuestionText
}) => {
    const [windowObj, setWindowObj] = useState(question.window);
    const containerRef = useRef<HTMLDivElement>(null);

    const scaleX = previewWidth / 2133; //change values manually for scale
    const scaleY = previewHeight / 1200;
    const gridSize = 45

    const dragItem = useRef<{ type: "button" | "text"; id: number } | null>(null);
    const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const [realPos, setRealPos] = useState({ x: 0, y: 0 });

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

        const containerRect = containerRef.current?.getBoundingClientRect();
        const targetRect = (e.target as HTMLElement).getBoundingClientRect();
        
        if (!containerRect) return;

        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        const elementX = (targetRect.left - containerRect.left);
        const elementY = (targetRect.top - containerRect.top);

        dragOffset.current = {
            x: mouseX - elementX,
            y: mouseY - elementY,
        };
    };


    const onMouseMove = (e: React.MouseEvent) => {
        if (!dragItem.current || !containerRef.current) return;

        const { type, id } = dragItem.current;
        const containerRect = containerRef.current.getBoundingClientRect();

        const mouseX = e.clientX - containerRect.left;
        const mouseY = e.clientY - containerRect.top;

        const width =
            type === "button"
                ? windowObj.buttons.find((b) => b.id === id)?.width ?? 0
                : windowObj.text.width;

        const height =
            type === "button"
                ? windowObj.buttons.find((b) => b.id === id)?.height ?? 0
                : windowObj.text.height;

        let newX = mouseX - dragOffset.current.x;
        let newY = mouseY - dragOffset.current.y;

        newX = Math.min(Math.max(newX, 0), previewWidth - width * scaleX);
        newY = Math.min(Math.max(newY, 0), previewHeight - height * scaleY);

        let realX = Math.round(newX / scaleX);
        let realY = Math.round(newY / scaleY);

        if (snapToGrid) {
            realX = Math.round(realX / gridSize) * gridSize
            realY = Math.round(realY / gridSize) * gridSize
        }

        setRealPos({ x: realX, y: realY });

        setWindowObj((prev) => {
            if (type === "button") {
                return {
                    ...prev,
                    buttons: prev.buttons.map((b) =>
                        b.id === id ? { ...b, x: realX, y: realY } : b
                    ),
                };
            } else if (type === "text") {
                return {
                    ...prev,
                    text: { ...prev.text, x: realX, y: realY },
                };
            }
            return prev;
        });

    };

    const onMouseUp = () => {
        dragItem.current = null;
        onUpdateWindow?.(windowObj);
    };

    const onRemove = (id: number) => {
        console.log(windowObj.buttons)
        setWindowObj((prev) => {
            return {
                ...prev,
                buttons: prev.buttons.filter((b) => b.id !== id)
            }
        })
        const updatedWindow = {
            ...windowObj,
            buttons: windowObj.buttons.filter((b) => b.id !== id),
        }
        onUpdateWindow?.(updatedWindow)
    }

    return (
        <div
            ref={containerRef}
            className="relative rounded-lg shadow-lg select-none align-text-bottom"
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
                    onRemove={onRemove} 
                    snaptoGrid={snapToGrid}
                    gridSize={gridSize}
                    key={btn.id}
                    {...btn}
                    scaleX={scaleX}
                    scaleY={scaleY}
                    text={btn.text}
                    type="button"
                    onDragStart={(e, id) => onDragStart(e, "button", id)}
                    onResize={(id, newWidth, newHeight) => {
                        setWindowObj((prev) => {
                            const newButtons = prev.buttons.map((b) => b.id === id ? { ...b, width: newWidth, height: newHeight } : b
                            );
                            const updated = { ...prev, buttons: newButtons };
                            onUpdateWindow?.(updated);
                            return updated;
                        });
                    } }

                    onTextChange={(id, newText) => {
                        setWindowObj((prev) => {
                            const newButtons = prev.buttons.map((b) => b.id === id ? { ...b, text: newText } : b
                            );
                            const updated = { ...prev, buttons: newButtons };
                            onUpdateWindow?.(updated);
                            return updated;
                        });
                    } }                />
            ))}

            <ResizableDraggableBox
                onRemove={onRemove} 
                snaptoGrid={snapToGrid}
                gridSize={gridSize}
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
                } }

                onTextChange={(id, newText) => {
                    onUpdateQuestionText?.(newText);
                } }            />
            <p className="absolute bottom-2 ml-2 transform text-white">{realPos.x}, {realPos.y}</p>
        </div>
    );
};

export default Window;
