import asyncio
import websockets


from board import *
from time import time
time_limit = 60 * 20
INF = 60*100
timetemp = time()
class Timer():
    def __init__(self):
        self.temp = time()
    def get(self):
        start = self.temp
        end = time()
        self.temp = end
        return end-start

async def send(sock, msg):
    try:
        await sock.send(msg)
    except Exception as e:
        print(e)

async def rec(sock):
    msg = ""
    try:
        msg = await asyncio.wait_for(sock.recv(), sock.__timeout)
    except asyncio.TimeoutError:
        return None
    print(msg)
    return msg

def settout(sock, time):
    sock.__timeout = time

def interp(msg, pawn):
    if msg is None:
        return None
    if msg[0:4] == "move":
        if not msg[4:5].isdigit():
            return False
        x=int(msg[4:5])
        if not msg[5:6] == ',':
            return False
        if not msg[6:7].isdigit():
            return False
        y=int(msg[6:7])
        return pawn.move(x,y)
    elif msg[0:4] == "wall":
        if not msg[4:5].isdigit():
            return False
        x=int(msg[4:5])
        if not msg[5:6] == ',':
            return False
        if not msg[6:7].isdigit():
            return False
        y=int(msg[6:7])
        if not msg[7:8] == ',':
            return False
        if not msg[8:9].isdigit():
            return False
        direction=int(msg[8:9])
        return pawn.placeWall(x,y,direction)
    else:
        return False

class Player:
    def __init__(self,sock,timelimit):
        self.socket = sock
        self.pawn = None
        self.time = timelimit
        self.timeout = False
    def deducttime(self,sec):
        self.time -= sec
        if self.time <= 0:
            self.timeout = True
            return True
        return False

class Game:
    def __init__(self, socket1, socket2, sema):
        self.sema = sema
        self.board = Board()
        self.player1 = Player(socket1,time_limit)
        self.player1.pawn = self.board.pawn1
        self.player2 = Player(socket2,time_limit)
        self.player2.pawn = self.board.pawn2
        self.dran = self.player1
        self.timer = Timer()
        self.winner = None
    async def taketurn(self):
        if self.dran == self.player1:
            print("turn of player1")
            settout(self.player1.socket,self.player1.time)
            settout(self.player2.socket,INF)
            while True:
                msg = await rec(self.player1.socket)
                res = interp(msg, self.player1.pawn)
                if res is None:
                    self.winner = self.player2
                    break
                elif not res:
                    continue
                else:
                    await send(self.player1.socket, msg)
                    await send(self.player2.socket, msg)
                    if self.player1.pawn.isFinished():
                        self.winner = self.player1
                    print(self.board)
                    self.dran = self.player2
                    break
            if self.player1.deducttime(self.timer.get()):
                self.winner = self.player2
        elif self.dran == self.player2:
            print("turn of player2")
            settout(self.player2.socket,self.player2.time)
            settout(self.player1.socket,INF)
            while True:
                msg = await rec(self.player2.socket)
                res = interp(msg, self.player2.pawn)
                if res is None:
                    self.winner = self.player1
                elif not res:
                    continue
                else:
                    await send(self.player2.socket, msg)
                    await send(self.player1.socket, msg)
                    if self.player2.pawn.isFinished():
                        self.winner = self.player2
                    print(self.board)
                    self.dran = self.player1
                    break
            if self.player2.deducttime(self.timer.get()):
                self.winner = self.player1
        else:
            print('invalid turn')
    async def start(self):
        await send(self.player1.socket, "p1")
        settout(self.player1.socket,self.player1.time)
        await send(self.player2.socket, "p2")
        settout(self.player2.socket,INF)
        while self.winner is None:
            await self.taketurn()
        await send(self.winner.socket, "win")
        await send(self.player2.socket if self.winner == self.player1 else self.player1.socket, "lose")
        asyncio.run(self.sema.release())