# Quoridor
It is a multiplayer web game. 
# Language
python, javascript
# How to run?
Execute
- quoridor/server/server.py
- quoridor/webserver/app.py

And connect to the webserver. To play with others, you must change the ip addresses from localhost to your IPv4 address.

# Goal
The goal of the game is to make the color every tile the same. When you press 1,2,3, or 4 on your keyboard, The tiles that are connected are painted red, orange, yellow, or green, respectively.

# Rules
Each player in turn, chooses to move his pawn or to put up one of his fences. When he has run out of fences, the player must move his pawn.

At the beginning the board is empty. Choose and place your pawn in the center of the first line of your side of the board, your opponent takes another pawn and places it in the center of the first line of his side of the board (the one facing yours). Then take 10 fences each.

A draw will determine who starts first.

# Pawn Moves
The pawns are moved one square at a time, horizontally or vertically, forwards or backwards, never diagonally.

The pawns must bypass the fences. If, while you move, you face your opponent's pawn you can jump over.

# Positioning of the fences
The fences must be placed between 2 sets of 2 squares.

By placing fences, you force your opponent to move around it and increase the number of moves they need to make. But be careful, you are not allowed to lock up to lock up your opponents pawn, it must always be able to reach it's goal by at least one square.


# Face To Face
When two pawns face each other on neighboring squares which are not separated by a fence, the player whose turn it is can jump the opponent's pawn (and place himself behind him), thus advancing an extra square.

If there is a fence behind the said pawn, the player can place his pawn to the left or the right of the other pawn.

# End of the Game
The first player who reaches one of the 9 squares opposite his base line is the winner.

# Reference
- [rules](https://www.ultraboardgames.com/quoridor/game-rules.php) 