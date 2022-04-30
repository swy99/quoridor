HORIZONTAL = 0
VERTICAL = 1

class Corner:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.occupied = False
        self.wall = None
    def __str__(self):
        return "Corner(x=" + str(self.x) + ",y=" + str(self.y) + ",occupied=" + str(self.occupied) + ")"

class Tile:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.up = True
        self.down = True
        self.left = True
        self.right = True
        self.topleft = None
        self.topright = None
        self.bottomleft = None
        self.bottomright = None
        self.reachable = False
    def __str__(self):
        return "Tile(x=" + str(self.x) + ",y=" + str(self.y) + ",up=" + str(self.up) + ",down=" + str(self.down) + ",left=" + str(self.left) + ",right=" + str(self.right) + ")"

class Wall:
    def __init__(self, x, y, direction):
        self.x = x
        self.y = y
        self.direction = direction
        self.owner = None

class Pawn:
    def __init__(self, num, board, x, y, startingwalls):
        self.x = x
        self.y = y
        self.num = num
        self.board = board
        self.wallsleft = startingwalls
    def __str__(self):
        return "Pawn" + str(self.num) + "(" + str(self.x) + "," + str(self.y) + ") with " + str(self.wallsleft) + " walls left"
    def isFinished(self):
        if self == self.board.pawn1:
            if self.y == 8:
                return True
            else:
                return False
        elif self == self.board.pawn2:
            if self.y == 0:
                return True
            else:
                return False
        else:
            print('invalid pawn')
            return False
    def reachNewTile(self, cur): #cur is a tile
        if cur.reachable == True:
            return
        x = cur.x
        y = cur.y
        cur.reachable = True
        if cur.up:
            self.reachNewTile(self.board.tiles[x][y+1])
        if cur.down:
            self.reachNewTile(self.board.tiles[x][y-1])
        if cur.left:
            self.reachNewTile(self.board.tiles[x-1][y])
        if cur.right:
            self.reachNewTile(self.board.tiles[x+1][y])
    def canReachFinishLine(self):
        for i in range(9):
            for j in range(9):
                self.board.tiles[i][j].reachable = False
        self.reachNewTile(self.board.tiles[self.x][self.y])
        result = False
        if self == self.board.pawn1:
            for i in range(9):
                if self.board.tiles[i][8].reachable:
                    result = True
        else:
            for i in range(9):
                if self.board.tiles[i][0].reachable:
                    result = True
        return result

    def move(self,x,y):
        enemy = self.board.pawn2 if self.board.pawn1 == self else self.board.pawn1
        dist = abs(self.x - x) + abs(self.y - y)
        if x<0 or y<0 or x>8 or y>8:
            return False
        if dist > 2:
            return False
        if dist == 1:
            currenttile = self.board.tiles[self.x][self.y]
            if x == self.x + 1 and currenttile.right and not (x == enemy.x and y == enemy.y):
                self.x = x
                return True
            elif x == self.x - 1 and currenttile.left and not (x == enemy.x and y == enemy.y):
                self.x = x
                return True
            elif y == self.y + 1 and currenttile.up and not (x == enemy.x and y == enemy.y):
                self.y = y
                return True
            elif y == self.y - 1 and currenttile.down and not (x == enemy.x and y == enemy.y):
                self.y = y
                return True
            return False
        if dist == 2:
            if y == self.y + 2:
                if enemy.x == self.x and enemy.y == self.y+1 and self.board.tiles[self.x][self.y].up and self.board.tiles[self.x][self.y+1].up:
                    self.y = y
                    return True
                else:
                    return False
            if y == self.y - 2:
                if enemy.x == self.x and enemy.y == self.y-1 and self.board.tiles[self.x][self.y].down and self.board.tiles[self.x][self.y-1].down:
                    self.y = y
                    return True
                else:
                    return False
            if x == self.x + 2:
                if enemy.x == self.x+1 and enemy.y == self.y and self.board.tiles[self.x][self.y].right and self.board.tiles[self.x+1][self.y].right:
                    self.x = x
                    return True
                else:
                    return False
            if x == self.x - 2:
                if enemy.x == self.x-1 and enemy.y == self.y and self.board.tiles[self.x][self.y].left and self.board.tiles[self.x-1][self.y].left:
                    self.x = x
                    return True
                else:
                    return False
            if x == self.x + 1 and y == self.y + 1:
                if enemy.x == self.x+1 and enemy.y == self.y and self.board.tiles[self.x][self.y].right and self.board.tiles[self.x+1][self.y].up and not self.board.tiles[self.x+1][self.y].right:
                    self.x = x
                    self.y = y
                    return True
                elif enemy.x == self.x and enemy.y == self.y+1 and self.board.tiles[self.x][self.y].up and self.board.tiles[self.x][self.y+1].right and not self.board.tiles[self.x][self.y+1].up:
                    self.x = x
                    self.y = y
                    return True
                else:
                    return False
            if x == self.x + 1 and y == self.y - 1:
                if enemy.x == self.x+1 and enemy.y == self.y and self.board.tiles[self.x][self.y].right and self.board.tiles[self.x+1][self.y].down and not self.board.tiles[self.x+1][self.y].right:
                    self.x = x
                    self.y = y
                    return True
                elif enemy.x == self.x and enemy.y == self.y-1 and self.board.tiles[self.x][self.y].down and self.board.tiles[self.x][self.y-1].right and not self.board.tiles[self.x][self.y-1].down:
                    self.x = x
                    self.y = y
                    return True
                else:
                    return False
            if x == self.x - 1 and y == self.y - 1:
                if enemy.x == self.x-1 and enemy.y == self.y and self.board.tiles[self.x][self.y].left and self.board.tiles[self.x-1][self.y].down and not self.board.tiles[self.x-1][self.y].left:
                    self.x = x
                    self.y = y
                    return True
                elif enemy.x == self.x and enemy.y == self.y-1 and self.board.tiles[self.x][self.y].down and self.board.tiles[self.x][self.y-1].left and not self.board.tiles[self.x][self.y-1].down:
                    self.x = x
                    self.y = y
                    return True
                else:
                    return False
            if x == self.x - 1 and y == self.y + 1:
                if enemy.x == self.x-1 and enemy.y == self.y and self.board.tiles[self.x][self.y].left and self.board.tiles[self.x-1][self.y].up and not self.board.tiles[self.x-1][self.y].left:
                    self.x = x
                    self.y = y
                    return True
                elif enemy.x == self.x and enemy.y == self.y+1 and self.board.tiles[self.x][self.y].up and self.board.tiles[self.x][self.y+1].left and not self.board.tiles[self.x][self.y+1].up:
                    self.x = x
                    self.y = y
                    return True
                else:
                    return False
        return False

    def placeWall(self,x,y,direction):
        if self.wallsleft < 1:
            return False
        if x<0 or y<0 or x>7 or y>7:
            return False
        if self.board.corners[x][y].occupied:
            return False
        if direction == HORIZONTAL and self.board.tiles[x][y].up and self.board.tiles[x+1][y].up:
            wall = Wall(x,y,direction)
            wall.owner = self
            self.board.corners[x][y].occupied = True
            self.board.corners[x][y].wall = wall
            self.board.tiles[x][y].up = False
            self.board.tiles[x+1][y].up = False
            self.board.tiles[x][y+1].down = False
            self.board.tiles[x+1][y+1].down = False
            self.wallsleft-=1
            if not self.board.pawnsCanReachFinishLine():
                self.removeWall(x,y)
                return False
            return True
        if direction == VERTICAL and self.board.tiles[x][y].right and self.board.tiles[x][y+1].right:
            wall = Wall(x,y,direction)
            wall.owner = self
            self.board.corners[x][y].occupied = True
            self.board.corners[x][y].wall = wall
            self.board.tiles[x][y].right = False
            self.board.tiles[x+1][y].left = False
            self.board.tiles[x][y+1].right = False
            self.board.tiles[x+1][y+1].left = False
            self.wallsleft-=1
            if not self.board.pawnsCanReachFinishLine():
                self.removeWall(x,y)
                return False
            return True
        return False

    def removeWall(self,x,y):
        if x<0 or y<0 or x>7 or y>7:
            return False
        if not self.board.corners[x][y].occupied:
            return False
        if self.board.corners[x][y].wall.direction == HORIZONTAL:
            owner = self.board.corners[x][y].wall.owner
            owner.wallsleft += 1
            self.board.corners[x][y].occupied = False
            self.board.corners[x][y].wall = None
            self.board.tiles[x][y].up = True
            self.board.tiles[x+1][y].up = True
            self.board.tiles[x][y+1].down = True
            self.board.tiles[x+1][y+1].down = True
            return True
        if self.board.corners[x][y].wall.direction == VERTICAL:
            owner = self.board.corners[x][y].wall.owner
            owner.wallsleft += 1
            self.board.corners[x][y].occupied = False
            self.board.corners[x][y].wall = None
            self.board.tiles[x][y].right = True
            self.board.tiles[x+1][y].left = True
            self.board.tiles[x][y+1].right = True
            self.board.tiles[x+1][y+1].left = True
            return True
        return False

class Board:
    def __init__(self):
        self.corners = []
        for i in range(8):
            self.corners.append([])
            for j in range(8):
                self.corners[i].append(Corner(i,j))
        self.tiles = []
        for i in range(9):
            self.tiles.append([])
            for j in range(9):
                _tile = Tile(i,j)
                if i==0:
                    _tile.left = False
                if i==8:
                    _tile.right = False
                if j==0:
                    _tile.down = False
                if j==8:
                    _tile.up = False
                if i>0 and j>0:
                    _tile.bottomleft = self.corners[i-1][j-1]
                if i<8 and j>0:
                    _tile.bottomright = self.corners[i][j-1]
                if i>0 and j<8:
                    _tile.topleft = self.corners[i-1][j]
                if i<8 and j<8:
                    _tile.topright = self.corners[i][j]
                self.tiles[i].append(_tile)
        self.pawn1 = Pawn(0,self,4,0,10)
        self.pawn2 = Pawn(1,self,4,8,10)
    def pawnsCanReachFinishLine(self):
        return self.pawn1.canReachFinishLine() and self.pawn2.canReachFinishLine()
    def __str__(self):
        res = []
        for i in range(17):
            res.append([])
            for j in range(17):
                res[i].append(" ")
            res[i].append("\n")

        for i in range(9):
            for j in range(9):
                if self.pawn1.x == i and self.pawn1.y == j:
                    res[16-j * 2][i * 2] = "▲"
                elif self.pawn2.x == i and self.pawn2.y == j:
                    res[16-j * 2][i * 2] = "▼"
                else:
                    res[16-j * 2][i * 2] = "□"
                if j<8 and not self.tiles[i][j].up:
                    res[16-(j*2+1)][i*2] = "━"
                if i<8 and not self.tiles[i][j].right:
                    res[16-j*2][i*2+1] = "┃"

        for i in range(8):
            for j in range(8):
                if self.corners[i][j].occupied:
                    if self.corners[i][j].wall.direction == HORIZONTAL:
                        res[16-(j*2+1)][i*2+1] = "━"
                    elif self.corners[i][j].wall.direction == VERTICAL:
                        res[16-(j*2+1)][i*2+1] = "┃"

        return "[player2] " + str(self.pawn2.wallsleft) + " walls left\n" + "".join(sum(res,[])) + "[player1] " + str(self.pawn1.wallsleft) + " walls left\n"

if __name__ == "__main__":
    board = Board()
    board.pawn1.move(4, 1)
    board.pawn2.placeWall(1, 1, HORIZONTAL)
    board.pawn2.placeWall(3, 1, HORIZONTAL)
    board.pawn1.move(5, 1)
    board.pawn2.placeWall(5, 1, HORIZONTAL)
    board.pawn2.placeWall(7, 1, HORIZONTAL)
    board.pawn1.placeWall(0, 1, VERTICAL)
    print(board)