import CursorSVG from "@/public/assets/CursorSVG";
import { CursorChatProps, CursorMode } from "@/types/type";
import { useEffect, useRef } from "react";

const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) => {
  const inputref = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") {
        if (inputref.current) {
          inputref.current.focus();
        }
      }
    };

    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);
  const hanleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.target.value });
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.target.value,
    });
  };

  const handlekeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // console.log(e.key);

    if (e.key === "Enter") {
      setCursorState({
        mode: CursorMode.Chat,
        previousMessage: cursorState.message, //FIXME:
        message: "",
      });
    } else if (e.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden,
      });
    }
  };

  return (
    <div
      className="absolute top-0 left-0"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {cursorState.mode === CursorMode.Chat && (
        <div>
          <CursorSVG color="#000" />
          <div className="absolute left-2 top-5 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]">
            {cursorState.previousMessage && (
              <div>{cursorState.previousMessage} </div>
            )}
            <input
              className="z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 outline-none"
              autoFocus={true}
              onChange={hanleChange}
              onKeyDown={handlekeyDown}
              placeholder={cursorState.previousMessage ? "" : "Type A Message"}
              value={cursorState.message}
              ref={inputref}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CursorChat;
