const screen = new Object();
var walldirection = HORIZONTAL;
var mylastmsg;

function canvasinit(){
    let canvas = document.getElementById('canvas');
    screen.canvas = canvas;
    const colorset1 = {
        friendly : '#1E1559',
        enemy : '#8C2920',
        background : '#DEF1FA',
        tile : '#66ADD9',
        crossroad : '#BDE3F2',
        wall : '#663300',
    };
    const colorset2 = {
        friendly : '#ff0051',
        enemy : '#7700ff',
        background : '#000000',
        tile : '#47ffff',
        crossroad : '#262626',
        wall : '#ffff00',
    };
    screen.colorset = colorset2;
    if(canvas.getContext){
        adjustScreenSize();
        canvas.style.background = screen.colorset.background;
        let context = canvas.getContext('2d');
    }
    window.addEventListener('resize', adjustScreenSize);
    document.addEventListener("click", e=>{clickHandler(e.offsetX,e.offsetY)});
}

function clickHandler(x,y){
    const click = getPos(x,y);
    var cx,cy,dirx;
    switch(click.target){
        case 'rotationbutton':
            if(walldirection == HORIZONTAL) walldirection = VERTICAL;
            else if(walldirection == VERTICAL) walldirection = HORIZONTAL;
            else console.log("invalid walldirection");
            board.draw();
            break;
        case 'tile':
            cx = click.x;
            cy = click.y;
            if(state != 'myturn') return;
            if(board.pawn2.move(click.x,click.y)){
                if(me=='p1'){
                    cy=8-cy;
                }
                else if(me=='p2'){
                    cx=8-cx;
                }
                else{
                    console.log("invalid me");
                }
                mylastmsg = "move"+cx+","+cy;
                socket.send(mylastmsg);
                board.draw();
            }
            break;
        case 'crossroad':
            cx = click.x;
            cy = click.y;
            if(state != 'myturn') return;
            if(board.pawn2.placeWall(click.x,click.y,walldirection)){
                if(me=='p1'){
                    cy=7-cy;
                }
                else if(me=='p2'){
                    cx=7-cx;
                }
                else{
                    console.log("invalid me");
                }
                mylastmsg = "wall"+cx+","+cy+","+walldirection
                socket.send(mylastmsg);
                board.draw();
            }
            break;
        default:
            ;
    }
}
function getPos(x,y){
    const click = new Object();
    var x0 = screen.xoffset;
    var y0 = screen.yoffset;
    var w = screen.multiplier;
    var h = 1.2 * w;
    if(x >= x0 && x <= x0+w && y >= y0 && y <= y0+h){
        if(y > y0+w){
            x0 = screen.xoffset + 1/2 * screen.multiplier;
            y0 = screen.yoffset + 1.1 * screen.multiplier;
            var r = screen.multiplier * 2/26;
            if((x-x0)**2 + (y-y0)**2 < r**2){
                click.target = 'rotationbutton';
            }
            else{
                click.target = 'bottombar';
            }
        }
        else{
            const l = 3/26*w;
            var xr = x-x0;
            var yr = y-y0;
            var n = Math.floor(xr/l);
            var m = Math.floor(yr/l);
            if(xr-n*l < 2/3*l && yr-m*l < 2/3*l){
                click.target = 'tile';
                click.x = n;
                click.y = m;

            }
            else{
                click.target = 'crossroad';
                xr -= 1/3*l;
                yr -= 1/3*l;
                n = Math.floor(xr/l);
                m = Math.floor(yr/l);
                click.x = n;
                click.y = m;
            }
        }
    }
    else{
        click.target = 'background';
    }
    return click;
}

function adjustScreenSize(){
    let wx = window.innerWidth;
    let wy = window.innerHeight;
    canvas.width = wx;
    canvas.height = wy;
    if(wy/wx >= 1.2){
        screen.multiplier = wx;
        screen.xoffset = 0;
        screen.yoffset = (wy - 1.2*screen.multiplier)/2;
    }
    else{
        screen.multiplier = wy/1.2;
        screen.xoffset = (wx - screen.multiplier)/2;
        screen.yoffset = 0;
    }
    board.draw();
}

function drawScreen(){
    let context = screen.canvas.getContext('2d');
    context.fillStyle = screen.colorset.crossroad;
    context.fillRect(screen.xoffset,screen.yoffset,screen.multiplier,screen.multiplier*1.2);
    context.fillStyle = screen.colorset.tile;
    for(var i=0;i<9;i++){
        for(var j=0;j<9;j++){
            var x, y, w, h;
            x = screen.xoffset + 3/26 * i * screen.multiplier;
            y = screen.yoffset + 3/26 * j * screen.multiplier;
            w = 2/26 * screen.multiplier;
            h = 2/26 * screen.multiplier;
            context.fillRect(x,y,w,h);
        }
    }
}

function drawWall(x,y,direction,color){
    let context = screen.canvas.getContext('2d');
    context.fillStyle = color;
    var ratio,blank,x,y,w,h;
    ratio = 1;
    blank = (1-ratio) * 1/26 * screen.multiplier;
    if(direction == HORIZONTAL){
        x = screen.xoffset + 3/26 * x * screen.multiplier;
        y = screen.yoffset + (2/26 + 3/26 * y) * screen.multiplier;
        w = 5/26 * screen.multiplier;
        h = 1/26 * screen.multiplier;
    }
    else if(direction == VERTICAL){
        x = screen.xoffset + (2/26 + 3/26 * x) * screen.multiplier;
        y = screen.yoffset + 3/26 * y * screen.multiplier;
        w = 1/26 * screen.multiplier;
        h = 5/26 * screen.multiplier;
    }
    context.fillRect(x+blank/2,y+blank/2,w-blank,h-blank);
}

function drawPawn(x,y,color){
    let context = screen.canvas.getContext('2d');
    const x0 = screen.xoffset + (3/26 * x + 1/26) * screen.multiplier;
    const y0 = screen.yoffset + (3/26 * y + 1/26) * screen.multiplier;
    const r = screen.multiplier * 1/26 * 0.8;
    context.fillStyle = color;
    context.beginPath();
    context.arc(x0,y0,r,0,Math.PI * 2);
    context.stroke();
    context.fillStyle = color;
    context.fill();
}

function drawRotationB(){
    let context = screen.canvas.getContext('2d');
    var x,x0,y,y0,r,w,h,color;
    x0 = screen.xoffset + 1/2 * screen.multiplier;
    y0 = screen.yoffset + 1.1 * screen.multiplier;
    r = screen.multiplier * 2/26;
    color = '#dedede';
    context.beginPath();
    context.arc(x0,y0,r,0,Math.PI * 2);
    context.stroke();
    context.fillStyle = color;
    context.fill();
    r *= 0.9
    color = '#808080';
    context.beginPath();
    context.arc(x0,y0,r,0,Math.PI * 2);
    context.stroke();
    context.fillStyle = color;
    context.fill();
    if(walldirection == HORIZONTAL){
        h = r*0.3;
        w = h*5;
        x = x0-w/2;
        y = y0-h/2;
    }
    else if(walldirection == VERTICAL){
        w = r*0.3;
        h = w*5;
        x = x0-w/2;
        y = y0-h/2;
    }
    else{
        console.log("invalid wall direction");
        return;
    }
    context.fillStyle = screen.colorset.wall;
    context.fillRect(x,y,w,h);
}