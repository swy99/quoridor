const HORIZONTAL = 0;
const VERTICAL = 1;

class Corner{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.occupied = false;
        this.wall = null;
    }
}
class Tile{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.up = true;
        this.down = true;
        this.left = true;
        this.right = true;
        this.topleft = null;
        this.topright = null;
        this.bottomleft = null;
        this.bottomright = null;
        this.reachable = false;
    }
}
class Wall{
    constructor(x, y, direction){
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.owner = null;
    }
}
class Pawn{
    constructor(num, board, x, y, startingwalls){
        this.x=x;
        this.y=y;
        this.num= num;
        this.board= board;
        this.wallsleft=startingwalls;
    }
    reachNewTile(cur){
        if(cur.reachable == true) return;
        var x=cur.x;
        var y=cur.y;
        cur.reachable=true;
        if(cur.up) this.reachNewTile(this.board.tiles[x][y+1]);
        if(cur.down) this.reachNewTile(this.board.tiles[x][y-1]);
        if(cur.left) this.reachNewTile(this.board.tiles[x-1][y]);
        if(cur.right) this.reachNewTile(this.board.tiles[x+1][y]);
    }
    canReachFinishLine(){
        for(var i=0;i<9;i++){
            for(var j=0;j<9;j++){
                this.board.tiles[i][j].reachable = false;
            }
        }
        this.reachNewTile(this.board.tiles[this.x][this.y]);
        var result = false;
        if(this == this.board.pawn1){
            for(var i=0;i<9;i++){
                if(this.board.tiles[i][8].reachable) result = true;
            }
        }
        else{
            for(var i=0;i<9;i++){
                if(this.board.tiles[i][0].reachable) result = true;
            }
        }
        return result;
    }
    move(x,y){
        var enemy = this.board.pawn1;
        if(this.board.pawn1 == this) enemy = this.board.pawn2;
        var dist = Math.abs(this.x - x) + Math.abs(this.y - y);
        if(x<0 || y<0 || x>8 || y>8) return false;
        if(dist > 2) return false;
        if(dist == 1){
            var currenttile = this.board.tiles[this.x][this.y];
            if(x == this.x + 1 && currenttile.right && !(x == enemy.x && y == enemy.y)){
                this.x = x;
                return true;
            }
            else if(x == this.x - 1 && currenttile.left && !(x == enemy.x && y == enemy.y)){
                this.x = x;
                return true;
            }
            else if(y == this.y + 1 && currenttile.up && !(x == enemy.x && y == enemy.y)){
                this.y = y;
                return true;
            }
            else if(y == this.y - 1 && currenttile.down && !(x == enemy.x && y == enemy.y)){
                this.y = y;
                return true;
            }
            return false;
        }
        if(dist == 2){
            if(y == this.y + 2){
                if(enemy.x == this.x && enemy.y == this.y+1 && this.board.tiles[this.x][this.y].up && this.board.tiles[this.x][this.y+1].up){
                    this.y = y;
                    return true;
                }
                else return false;
            }
            if(y == this.y - 2){
                if(enemy.x == this.x && enemy.y == this.y-1 && this.board.tiles[this.x][this.y].down && this.board.tiles[this.x][this.y-1].down){
                    this.y = y;
                    return true;
                }
                else return false;
            }
            if(x == this.x + 2){
                if(enemy.x == this.x+1 && enemy.y == this.y && this.board.tiles[this.x][this.y].right && this.board.tiles[this.x+1][this.y].right){
                    this.x = x;
                    return true;
                }
                else return false;
            }
            if(x == this.x - 2){
                if(enemy.x == this.x-1 && enemy.y == this.y && this.board.tiles[this.x][this.y].left && this.board.tiles[this.x-1][this.y].left){
                    this.x = x;
                    return true;
                }
                else return false;
            }
            if(x == this.x + 1 && y == this.y + 1){
                if(enemy.x == this.x+1 && enemy.y == this.y && this.board.tiles[this.x][this.y].right && this.board.tiles[this.x+1][this.y].up && !this.board.tiles[this.x+1][this.y].right){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else if(enemy.x == this.x && enemy.y == this.y+1 && this.board.tiles[this.x][this.y].up && this.board.tiles[this.x][this.y+1].right && !this.board.tiles[this.x][this.y+1].up){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else return false;
            }
            if(x == this.x + 1 && y == this.y - 1){
                if(enemy.x == this.x+1 && enemy.y == this.y && this.board.tiles[this.x][this.y].right && this.board.tiles[this.x+1][this.y].down && !this.board.tiles[this.x+1][this.y].right){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else if(enemy.x == this.x && enemy.y == this.y-1 && this.board.tiles[this.x][this.y].down && this.board.tiles[this.x][this.y-1].right && !this.board.tiles[this.x][this.y-1].down){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else return false;
            }
            if(x == this.x - 1 && y == this.y - 1){
                if(enemy.x == this.x-1 && enemy.y == this.y && this.board.tiles[this.x][this.y].left && this.board.tiles[this.x-1][this.y].down && !this.board.tiles[this.x-1][this.y].left){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else if(enemy.x == this.x && enemy.y == this.y-1 && this.board.tiles[this.x][this.y].down && this.board.tiles[this.x][this.y-1].left && !this.board.tiles[this.x][this.y-1].down){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else return false;
            }
            if(x == this.x - 1 && y == this.y + 1){
                if(enemy.x == this.x-1 && enemy.y == this.y && this.board.tiles[this.x][this.y].left && this.board.tiles[this.x-1][this.y].up && !this.board.tiles[this.x-1][this.y].left){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else if(enemy.x == this.x && enemy.y == this.y+1 && this.board.tiles[this.x][this.y].up && this.board.tiles[this.x][this.y+1].left && !this.board.tiles[this.x][this.y+1].up){
                    this.x = x;
                    this.y = y;
                    return true;
                }
                else return false;
            }
        }
        return false;
    }
    placeWall(x,y,direction){
        if(this.wallsleft < 1) return false;
        if(x<0 || y<0 || x>7 || y>7) return false;
        if(this.board.corners[x][y].occupied) return false;
        if(direction == HORIZONTAL && this.board.tiles[x][y].up && this.board.tiles[x+1][y].up){
            var wall = new Wall(x,y,direction);
            wall.owner = this;
            this.board.corners[x][y].occupied = true;
            this.board.corners[x][y].wall = wall;
            this.board.tiles[x][y].up = false;
            this.board.tiles[x+1][y].up = false;
            this.board.tiles[x][y+1].down = false;
            this.board.tiles[x+1][y+1].down = false;
            this.wallsleft-=1;
            if(!this.board.pawnsCanReachFinishLine()){
                this.removeWall(x,y);
                return false;
            }
            console.log('%d walls left', this.wallsleft);
            return true;
        }
        if(direction == VERTICAL && this.board.tiles[x][y].right && this.board.tiles[x][y+1].right){
            var wall = new Wall(x,y,direction);
            wall.owner = this;
            this.board.corners[x][y].occupied = true;
            this.board.corners[x][y].wall = wall;
            this.board.tiles[x][y].right = false;
            this.board.tiles[x+1][y].left = false;
            this.board.tiles[x][y+1].right = false;
            this.board.tiles[x+1][y+1].left = false;
            this.wallsleft-=1;
            if(!this.board.pawnsCanReachFinishLine()){
                this.removeWall(x,y);
                return false;
            }
            console.log('%d walls left', this.wallsleft);
            return true;
        }
        return false;
    }
    removeWall(x,y){
        if(x<0 || y<0 || x>7 || y>7){
            return false;
        }
        if(!this.board.corners[x][y].occupied){
            return false;
        }
        if(this.board.corners[x][y].wall.direction == HORIZONTAL){
            var owner = this.board.corners[x][y].wall.owner;
            owner.wallsleft += 1;
            this.board.corners[x][y].occupied = false;
            this.board.corners[x][y].wall = null;
            this.board.tiles[x][y].up = true;
            this.board.tiles[x+1][y].up = true;
            this.board.tiles[x][y+1].down = true;
            this.board.tiles[x+1][y+1].down = true;
            return true;
        }
        if(this.board.corners[x][y].wall.direction == VERTICAL){
            var owner = this.board.corners[x][y].wall.owner;
            owner.wallsleft += 1;
            this.board.corners[x][y].occupied = false;
            this.board.corners[x][y].wall = null;
            this.board.tiles[x][y].right = true;
            this.board.tiles[x+1][y].left = true;
            this.board.tiles[x][y+1].right = true;
            this.board.tiles[x+1][y+1].left = true;
            return true;
        }
        return false;
    }
}
class Board{
    constructor(){
        this.corners = [];
        for(var i=0;i<8;i++){
            this.corners.push([]);
            for(var j=0;j<8;j++){
                this.corners[i].push(new Corner(i,j));
            }
        }
        this.tiles = [];
        for(var i=0;i<9;i++){
            this.tiles.push([])
            for(var j=0;j<9;j++){
                var _tile = new Tile(i,j);
                if(i==0) _tile.left = false;
                if(i==8) _tile.right = false;
                if(j==0) _tile.down = false;
                if(j==8) _tile.up = false;
                if(i>0 && j>0) _tile.bottomleft = this.corners[i-1][j-1];
                if(i<8 && j>0) _tile.bottomright = this.corners[i][j-1];
                if(i>0 && j<8) _tile.topleft = this.corners[i-1][j];
                if(i<8 && j<8) _tile.topright = this.corners[i][j];
                this.tiles[i].push(_tile);
            }
        }
        this.pawn1 = new Pawn(0,this,4,0,10); //enemy
        this.pawn2 = new Pawn(1,this,4,8,10); //friendly
    }
    pawnsCanReachFinishLine(){
        return this.pawn1.canReachFinishLine() && this.pawn2.canReachFinishLine();
    }
    draw(){
        drawScreen();
        drawPawn(this.pawn1.x,this.pawn1.y,screen.colorset.enemy);
        drawPawn(this.pawn2.x,this.pawn2.y,screen.colorset.friendly);
        for(var i=0;i<8;i++){
            for(var j=0;j<8;j++){
                if(this.corners[i][j].occupied) drawWall(i,j,this.corners[i][j].wall.direction,screen.colorset.wall);
            }
        }
        drawRotationB();
    }
}