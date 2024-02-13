import { useMyPresence, useOthers } from "@/liveblocks.config";
import { useCallback } from "react";
import LiveCursor from "./cursor/LiveCursor";

const Live = () => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    updateMyPresence({
      cursor: {
        x: e.clientX - e.currentTarget.getBoundingClientRect().x,
        y: e.clientY - e.currentTarget.getBoundingClientRect().y,
      },
    });
  }, []);

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    updateMyPresence({
      cursor: {
        x: e.clientX - e.currentTarget.getBoundingClientRect().x,
        y: e.clientY - e.currentTarget.getBoundingClientRect().y,
      },
    });
  }, []);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="h-[100vh] w-full justify-center items-center text-center border-2 border-green-500"
    >
      <LiveCursor others={others} />
    </div>
  );
};

export default Live;
