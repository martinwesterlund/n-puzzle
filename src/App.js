import React, { useState, useEffect } from "react";

const App = () => {
  const [cols, setCols] = useState(4);
  const [gameStarted, setGameStarted] = useState(false);
  const [gridCols, setGridCols] = useState("");
  const [moves, setMoves] = useState(0);
  const [rows, setRows] = useState(4);
  const [solved, setSolved] = useState(false);
  const [tiles, setTiles] = useState([]);

  const generateTiles = () => {
    let tiles = [];
    for (let i = 1; i <= rows * cols; i++) {
      tiles.push(i);
    }
    return tiles;
  };

  const handleClick = (tile) => {
    if (isSameRow(tiles.indexOf(tile), tiles.indexOf(rows * cols), cols)) {
      setMoves((prev) => prev + 1);
      setTiles([
        ...moveTile(tiles, tiles.indexOf(rows * cols), tiles.indexOf(tile)),
      ]);
    }

    if (isSameColumn(tiles.indexOf(tile), tiles.indexOf(rows * cols), cols)) {
      setMoves((prev) => prev + 1);
      let tilesInSameCol = [];
      let tilesToBeMoved = [];
      tiles.forEach((tile, index) => {
        if (isSameColumn(index, tiles.indexOf(rows * cols), cols)) {
          tilesInSameCol.push(tile);
        }
      });

      if (tiles.indexOf(tile) < tiles.indexOf(rows * cols)) {
        tilesToBeMoved = tilesInSameCol.filter(
          (t) =>
            tiles.indexOf(t) <= tiles.indexOf(rows * cols) &&
            tiles.indexOf(t) >= tiles.indexOf(tile)
        );
        tilesToBeMoved.forEach((t) => {
          if (tiles.indexOf(t) === tiles.indexOf(rows * cols)) {
            setTiles([
              ...moveTile(
                tiles,
                tiles.indexOf(t),
                tiles.indexOf(t) - cols * (tilesToBeMoved.length - 1)
              ),
            ]);
          } else {
            setTiles([
              ...moveTile(
                tiles,
                tiles.indexOf(t),
                tiles.indexOf(t) + (cols - 1)
              ),
            ]);
          }
        });
      } else if (tiles.indexOf(tile) > tiles.indexOf(rows * cols)) {
        tilesToBeMoved = tilesInSameCol.filter(
          (t) =>
            tiles.indexOf(t) >= tiles.indexOf(rows * cols) &&
            tiles.indexOf(t) <= tiles.indexOf(tile)
        );
        tilesToBeMoved.forEach((t) => {
          if (tiles.indexOf(t) === tiles.indexOf(rows * cols)) {
            setTiles([
              ...moveTile(
                tiles,
                tiles.indexOf(t),
                tiles.indexOf(t) + cols * (tilesToBeMoved.length - 1)
              ),
            ]);
          } else {
            setTiles([
              ...moveTile(
                tiles,
                tiles.indexOf(t),
                tiles.indexOf(t) - (cols - 1)
              ),
            ]);
          }
        });
      }
    }
  };

  const isSameColumn = (item1, item2, cols) => {
    const col1 = item1 % cols;
    const col2 = item2 % cols;
    return col1 === col2;
  };

  const isSameRow = (item1, item2, cols) => {
    const row1 = Math.floor(item1 / cols);
    const row2 = Math.floor(item2 / cols);
    return row1 === row2;
  };

  const isSolved = (tiles) => {
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i] !== i + 1) {
        return false;
      }
    }
    return true;
  };

  const moveTile = (array, fromIndex, toIndex) => {
    let tile = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, tile);
    return array;
  };

  const shuffleTiles = (array) => {
    setMoves(0);
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const startGame = (event) => {
    event.preventDefault();
    setGameStarted(true);
    setTiles(shuffleTiles(generateTiles()));
  };

  useEffect(() => {
    switch (cols) {
      case 3:
        setGridCols("grid-cols-3");
        break;
      case 4:
        setGridCols("grid-cols-4");
        break;
      case 5:
        setGridCols("grid-cols-5");
        break;
      case 6:
        setGridCols("grid-cols-6");
        break;
      default:
        setGridCols("grid-cols-3");
    }
  }, [cols]);

  useEffect(() => {
    if (tiles.length > 0) {
      setSolved(isSolved(tiles));
    }
  }, [tiles]);

  return (
    <div className="mx-auto flex h-screen max-w-screen-md flex-col items-center justify-start p-2 font-sans sm:p-6 md:justify-center">
      {!gameStarted && (
        <div>
          <h1 className="my-8 text-center text-2xl">N-pussel</h1>
          <form className="grid place-items-center py-16" onSubmit={startGame}>
            <label className="flex w-full items-center justify-end">
              Rader:
              <input
                className="ml-4 cursor-pointer"
                onChange={(event) => setRows(Number(event.target.value))}
                type="range"
                min="3"
                max="6"
                value={rows}
              />
              <span className="ml-4">{rows}</span>
            </label>
            <label className="mt-2 flex w-full items-center">
              Kolumner:
              <input
                className="ml-4 cursor-pointer"
                onChange={(event) => setCols(Number(event.target.value))}
                type="range"
                min="3"
                max="6"
                value={cols}
              />
              <span className="ml-4">{cols}</span>
            </label>
            <br />
            <input
              className="mt-16 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-400"
              type="submit"
              value="Starta spelet"
            />
          </form>
        </div>
      )}
      {gameStarted && (
        <>
          <div className="text-center">Antal drag: {moves}</div>
          <div
            className={`relative mt-8 grid px-1 ${gridCols} gap-1 sm:gap-2 `}
          >
            {tiles &&
              tiles.map((tile, index) => (
                <div
                  key={index}
                  className={`xs:w-11 flex aspect-square w-10 cursor-pointer items-center justify-center rounded border border-black bg-blue-300 text-sm transition-colors duration-300 hover:bg-opacity-30 sm:w-12 sm:rounded-md sm:text-base md:w-16 md:text-lg lg:w-20 lg:text-xl xl:text-2xl 2xl:text-3xl ${
                    tile === rows * cols ? " pointer-events-none invisible" : ""
                  }`}
                  onClick={() => handleClick(tile)}
                >
                  {tile}
                </div>
              ))}
          </div>
          <button
            className="mt-8 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-400"
            onClick={() => setTiles([...shuffleTiles(tiles)])}
          >
            Shuffla
          </button>
        </>
      )}
      {solved && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6">
            <h1 className="text-2xl">Grattis!</h1>
            <p className="mt-4">Du klarade det på {moves} drag.</p>
            <button
              className="mt-4 cursor-pointer rounded-md bg-blue-500 px-4 py-2 text-white transition-colors duration-300 hover:bg-blue-400"
              onClick={() => {
                setGameStarted(false);
                setTiles([]);
                setMoves(0);
                setSolved(false);
              }}
            >
              Spela igen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
