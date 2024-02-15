import useInterval from "@/hooks/useInterval";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import { useCallback, useEffect, useState } from "react";
import CursorChat from "./cursor/CursorChat";
import LiveCursor from "./cursor/LiveCursor";
import FlyingReaction from "./reaction/FlyingReaction";
import ReactionSelector from "./reaction/ReactionButton";

const Live = () => {
  const others = useOthers();
  const [{ cursor, message }, updateMyPresence] = useMyPresence() as any;

  const [cursorState, setcursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const broadcast = useBroadcastEvent();
  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000)
    );
  }, 1000);
  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReactions((reactions) =>
        reactions.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ])
      );
      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventdata) => {
    const event = eventdata.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ])
    );
  });
  const setReaction = useCallback((reaction: string) => {
    setcursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (cursor == null && cursorState.mode !== CursorMode.ReactionSelector) {
      updateMyPresence({
        cursor: {
          x: e.clientX - e.currentTarget.getBoundingClientRect().x,
          y: e.clientY - e.currentTarget.getBoundingClientRect().y,
        },
      });
    }
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    setcursorState({
      mode: CursorMode.Hidden,
    });
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);
  const handlePointerup = useCallback(
    (e: React.PointerEvent) => {
      setcursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, setcursorState]
  );
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      updateMyPresence({
        cursor: {
          x: e.clientX - e.currentTarget.getBoundingClientRect().x,
          y: e.clientY - e.currentTarget.getBoundingClientRect().y,
        },
      });
      setcursorState((state: CursorState) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state
      );
    },
    [cursorState.mode, setcursorState]
  );
  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "/") {
        setcursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (e.key === "Escape") {
        updateMyPresence({ message: "" });
        setcursorState({ mode: CursorMode.Hidden });
      } else if (e.key === "e") {
        // console.log(cursorState.mode);

        if (cursorState.mode !== 1) {
          //TODO:
          setcursorState({ mode: CursorMode.ReactionSelector });
        }
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/") {
        e.preventDefault();
      }
    };
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);
  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerup}
      className="h-[100vh] w-full justify-center items-center text-center border-2 border-green-500"
    >
      <h1 className="text-2xl text-white"> Figma Clone</h1>
      {reactions.map((reaction) => (
        <FlyingReaction
          key={reaction.timestamp.toString()}
          x={reaction.point.x}
          y={reaction.point.y}
          timestamp={reaction.timestamp}
          value={reaction.value}
        />
      ))}
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setcursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector setReaction={setReaction} />
      )}
      <LiveCursor others={others} />
    </div>
  );
};

export default Live;
