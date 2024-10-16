import React, { useEffect, useState, useRef } from "react";
import { socket } from "../utils";

const TextArea = () => {
    const [documentContent, setDocumentContent] = useState("");
    const [userCursors, setUserCursors] = useState({});
    const [userSelections, setUserSelections] = useState({});
    const [activeUsers, setActiveUsers] = useState([]);
    const textareaRef = useRef(null);
    const mirrorDivRef = useRef(null);

    useEffect(() => {

        socket.emit("join-document");
        socket.on("load-document", (content) => {
            setDocumentContent(content);
        });


        socket.on("receive-text-change", ({ content, cursorPosition, userId }) => {
            setDocumentContent(content);
            setUserCursors((prev) => ({
                ...prev,
                [userId]: cursorPosition,
            }));
        });


        socket.on("cursor-update", ({ userId, position }) => {
            setUserCursors((prev) => ({
                ...prev,
                [userId]: position,
            }));
        });
        socket.on("active-users", (users) => {
           setActiveUsers(users);
        });

        socket.on("selection-update", ({ userId, selectionStart, selectionEnd }) => {
            setUserSelections((prev) => ({
                ...prev,
                [userId]: { selectionStart, selectionEnd },
            }));
        });
        localStorage.setItem("startedTyping", "true")

        return () => {
            socket.off("load-document");
            socket.off("receive-text-change");
            socket.off("cursor-update");
            socket.off("selection-update");
            localStorage.removeItem("startedTyping")
        };
    }, []);


    const handleTyping = (e) => {
        const newContent = e.target.value;
        const cursorPosition = e.target.selectionStart;
        const selectionStart = e.target.selectionStart;
        const selectionEnd = e.target.selectionEnd;

        setDocumentContent(newContent);


        socket.emit("text-change", {
            content: newContent,
            cursorPosition: cursorPosition,
        });


        socket.emit("selection-change", { selectionStart, selectionEnd });
    };


    const calculateCursorPosition = (position) => {
        if (!textareaRef.current || !mirrorDivRef.current) return { left: "0px", top: "0px" };

        const text = documentContent.slice(0, position);


        mirrorDivRef.current.textContent = text.replace(/\n$/, "\n ");

        const span = document.createElement("span");
        span.textContent = "|";
        mirrorDivRef.current.appendChild(span);

        const rect = span.getBoundingClientRect();
        mirrorDivRef.current.removeChild(span);

        const textareaRect = textareaRef.current.getBoundingClientRect();

        return {
            left: `${rect.left - textareaRect.left}px`,
            top: `${rect.top - textareaRect.top}px`,
        };
    };


    const handleCursorChange = (e) => {
        const cursorPosition = e.target.selectionStart;
        socket.emit("update-cursor", cursorPosition);
    };

    const handleSelectionChange = (e) => {
        const selectionStart = e.target.selectionStart;
        const selectionEnd = e.target.selectionEnd;
        if (selectionStart !== selectionEnd) {
            socket.emit("selection-change", { selectionStart, selectionEnd });
        }
    };

    return (
        <div className="relative flex justify-start items-center flex-col" style={{ height: "100vh", width: "100vw" }}>

          
            <div className="editor-container relative border border-8 rounded-lg" style={{ width: "60vw", height: "70vh", marginTop: "10vh" }}>

                {/* Hidden mirror div for sizing */}
                <div
                    ref={mirrorDivRef}
                    className="mirror-div invisible whitespace-pre-wrap absolute"
                    style={{
                        whiteSpace: "pre-wrap",
                        visibility: "hidden",
                        position: "absolute",
                        overflow: "hidden",
                        width: "100%",
                        height: "auto",
                        padding: "8px",
                        border: "1px solid #ccc",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit",
                    }}
                />

                {/* Main textarea for document content */}
                <textarea
                    ref={textareaRef}
                    value={documentContent}
                    onChange={handleTyping}
                    onSelect={handleCursorChange}
                    placeholder="Start typing..."
                    className="textarea border-none outline-none z-0"
                    style={{ width: "100%", height: "100%" }}
                    onMouseUp={handleSelectionChange}
                    onKeyUp={handleSelectionChange}
                />

                {/* Overlay for user cursors */}
                {Object.keys(userCursors).map((userId) => {
                    const position = userCursors[userId];
                    const userColor = "green";
                    const cursorPositionStyle = calculateCursorPosition(position);

                    return (
                        <div
                            key={userId}
                            className="user-cursor absolute"
                            style={cursorPositionStyle}
                        >
                            <div
                                className={`w-1 h-6 bg-${userColor}-500`}
                                style={{
                                    position: "absolute",
                                    left: `${cursorPositionStyle.left}`,
                                    top: `${cursorPositionStyle.top}`,
                                }}
                            ></div>
                            <div
                                className={`absolute text-sm bg-orange-500 text-white px-1 rounded whitespace-nowrap`}
                                style={{ top: "-20px" }}
                            >
                                User {userId}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-center bg-black relative flex-col rounded m-4 p-4">
                <h1 className="text-orange-400 py-4">Active users</h1>

                <div className="  grid grid-cols-8 gap-4   ">
                    {activeUsers.map((user) => (
                        <div
                            key={user.id}
                            className=" w-10 h-10 group flex items-center justify-center rounded-full bg-orange-400 text-white transition-transform duration-200 ease-in-out transform hover:scale-110"
                        >
                            {user.id.charAt(0).toUpperCase()}
                            <span className="hidden group-hover:block absolute -top-4 transform -translate-y-2 transition-opacity duration-200 ease-in-out bg-orange-500 rounded-full z-50 whitespace-nowrap py-4 px-8 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 z-50">
                                {user.id}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );

};

export default TextArea;
