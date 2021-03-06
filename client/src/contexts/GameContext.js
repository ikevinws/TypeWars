import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import socket from '../config/socket';

const GameContext = React.createContext();

export const useGameContext = () => {
    return useContext(GameContext);
};
export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState({
        _id: null,
        isOpen: false,
        players: [],
        words: []
    });
    const history = useHistory();

    useEffect(() => {
        //listen for any game updates from server
        socket.on('update-game', (game) => {
            setGameState(game);
        });
        return () => {
            socket.removeListener('update-game');
        };
    }, []);

    //go to game lobby if game id changes
    useEffect(() => {
        if (gameState._id != null) history.push(`/game/${gameState._id}`);
    }, [gameState._id, history]);

    const resetGameState = useCallback(() => {
        setGameState({ _id: null, isOpen: false, players: [], words: [] });
    }, [setGameState]);

    return (
        <GameContext.Provider value={{ gameState, setGameState, resetGameState }}>
            {children}
        </GameContext.Provider>
    );
};
