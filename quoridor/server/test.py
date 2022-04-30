import sys

r, c = map(int, sys.stdin.readline().split())

tiles = []
g1,g2 = None,None
edge = set()

def p():
    print("==========================",end="")
    print(cnt)
    for i in range(r):
        for j in range(c):
            print(tiles[i][j],end="")
        print()

def main():
    readinputs()
    global cnt
    cnt = 0
    while not bfs():
        cnt += 1
        melt()
    print(cnt)


def readinputs():
    global tiles,g1,g2
    g1found = False
    ice = set()
    for i in range(r):
        tiles.append([])
        temp = sys.stdin.readline()
        for j in range(c):
            tiles[i].append(temp[j])
            if tiles[i][j] == 'L':
                if not g1found:
                    g1 = (i,j)
                    g1found = True
                else:
                    g2 = (i,j)
            elif tiles[i][j] == 'X':
                ice.add((i,j))
    getedge(ice)


def getedge(ice):
    global edge
    for cur in ice:
        for t in getadj(cur):
            x,y = t
            if tiles[x][y] == '.' or tiles[x][y] == 'L':
                edge.add(cur)



def bfs():
    traveled = set()
    travcand = {g1}
    while travcand:
        cur = travcand.pop()
        traveled.add(cur)
        for t in getadj(cur):
            x,y = t
            if t == g2:
                return True
            elif tiles[x][y] == '.' and not t in traveled:
                travcand.add(t)
    return False



def melt():
    global edge,tiles
    newedge = set()
    for cur in edge:
        x,y = cur
        tiles[x][y] = '.'
    for cur in edge:
        for t in getadj(cur):
            x,y = t
            if tiles[x][y] == 'X':
                newedge.add(t)
    edge = newedge




def getadj(cur):
    x,y = cur
    res = []
    if x-1 >= 0:
        res.append((x-1,y))
    if x+1 < r:
        res.append((x+1,y))
    if y-1 >= 0:
        res.append((x,y-1))
    if y+1 < c:
        res.append((x,y+1))
    return res

main()