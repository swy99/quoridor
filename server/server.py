from game import *
sema = None
waitlist = []

async def serve(ws):
    global sema
    print("serving " + ws.remote_address[0])
    global waitlist
    if len(waitlist) == 0:
        waitlist.append(ws)
        print(ws.remote_address[0] + " is connected(1)")
        sema = asyncio.Semaphore(0)
        await sema.acquire()
        await sema.release()
    elif len(waitlist) == 1:
        print(ws.remote_address[0] + " is connected(2)")
        waitlist.append(ws)
        try:
            await waitlist[0].send("check")
        except Exception as e:
            del waitlist[0]
            print("previous connection is removed")
            print(ws.remote_address[0] + " is connected(1)")
            sema = asyncio.Semaphore(0)
            await sema.acquire()
            await sema.release()
        game = Game(waitlist[0], waitlist[1], sema)
        waitlist=[]
        print("a new game started")
        cor = asyncio.create_task(game.start())
        await cor
    else:
        print('error')

async def main():
    async with websockets.serve(serve, "localhost", 18765):
        await asyncio.Future()  # run forever

asyncio.run(main())