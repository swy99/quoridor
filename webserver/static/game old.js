const board = new Board();
var me;
var state = 'waiting';
var socket;
init();
function init(){
    var tbox = document.getElementById('textbox');
    socket = io.connect('http://1.235.60.203:3413');
    tbox.innerHTML = 'waiting...';
    socket.on('msg',data=>{
        console.log(msg);
        switch(state){
            case 'waiting':
                if(msg=='check');
                else if(msg=='p1'){
                    state = 'myturn';
                    me = 'p1';
                    tbox.innerHTML = '';
                    canvasinit();
                }
                else if(msg=='p2'){
                    state = 'enemyturn';
                    me = 'p2';
                    tbox.innerHTML = '';
                    canvasinit();
                }
                break;
            case 'myturn':
                if(msg=='win'){
                    state ='end';
                    console.log('WIN!');
                    document.title = 'win';
                }
                else if(msg=='lose'){
                    state ='end';
                    console.log('LOSE!');
                    document.title = 'lose';
                }
                else{
                    console.log('error');
                }
                break;
            case 'enemyturn':
                if(msg=='win'){
                    state ='end';
                    console.log('WIN!');
                    document.title = 'win';
                }
                else if(msg=='lose'){
                    state ='end';
                    console.log('LOSE!');
                    document.title = 'lose';
                }
                else if(msg.substr(0,4)=='move'){
                    var x,y;
                    x=parseInt(msg.substr(4,5));
                    y=parseInt(msg.substr(6,7));
                    if(me=='p1'){
                        y=8-y;
                    }
                    else if(me=='p2'){
                        x=8-x;
                    }
                    else{
                        console.log('error');
                    }
                    if(!board.pawn1.move(x,y))console.log('invalid enemy move');
                    board.draw();
                }
                else if(msg.substr(0,4)=='wall'){
                    var x,y,dirx;
                    x=parseInt(msg.substr(4,5));
                    y=parseInt(msg.substr(6,7));
                    dirx=parseInt(msg.substr(8,9));
                    if(me=='p1'){
                        y=7-y;
                    }
                    else if(me=='p2'){
                        x=7-x;
                    }
                    else{
                        console.log('error');
                    }
                    if(!board.pawn1.move(x,y))console.log('invalid enemy wall');
                    board.draw();
                }
                else{
                    console.log('error');
                }
                state = 'myturn';
                break;
            case 'end':
                break;
            default:
                console.log('invalid state');
        }
    });
}