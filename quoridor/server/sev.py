import asyncio
import websockets
import time

wslist = []
wslock = asyncio.Lock()
chatlog = []

async def serve(ws):
    async with wslock:
        wslist.append(ws)
    try:
        await ws.send("\n".join(chatlog))
    except:
        async with wslock:
            wslist.remove(ws)

    while True:
        try:
            msg = await ws.recv()
            async with wslock:
                now = time.localtime()
                timestr = "%04d/%02d/%02d %02d:%02d:%02d" % (
                now.tm_year, now.tm_mon, now.tm_mday, now.tm_hour, now.tm_min, now.tm_sec)
                chatlog.append("[" + timestr + "]" + msg)
                if len(chatlog) >= 100:
                    chatlog.pop(0)
                websockets.broadcast(wslist, "[" + timestr + "]" + msg)
        except:
            async with wslock:
                wslist.remove(ws)
                break



async def main():
    async with websockets.serve(serve, "1.235.60.203", 18765):
        await asyncio.Future()  # run forever

asyncio.run(main())