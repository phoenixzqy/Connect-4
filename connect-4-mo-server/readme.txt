Game

initGame(int min_size, int max_size)
@param min_size: minimum number of players to start the game
@param max_size: maximum number of players to start the game

addPlayer(String name, int pos)
@return valid or invalid

delPlayer(String name)
@return valid or invalid (if player does not exists)

setPlayerState(String name, int state)
@return success or failure

changePosition(String name, int pos)
@return valid or invlaid

swapPosition(String p1, String p2)
@return void

setPlayerState(String name)
@return success or otherwise

setStartingPlayer(StartingPlayerStrategy strategy)
@return starting player name

start()
@return success or otherwise

reset()

winner()
@return winning player name if found

rematch()
same players
@return success or otherwise

makeMove(GameAction action)
@return valid or invalid

nextTurn()
@return winning player name if found


Connect4

changeBoard(int width, int height)
@return success or fail


