import './App.css';
import { useState, useEffect } from 'react';
import AnimatedText from 'react-animated-text-content';

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

function getBingoValues(type) {
  const vcReasons = [
    "Wi-Fi Problem", "I am sick", "Link was not working", "Clashing meeting", "Time Zone Difference", "Didn't get invite", "Visiting Therapist",
    "Sick kids excuse", "I thought it's sunday today", "I totally forgot time", "Faking computer crash", "I'll get back soon",
    "It wouldn't let me in", "Voice isn't audible", "Visiting doctor", "Family emergency", "System was updating", "Surprise guests",
    "Visiting sick relative", "Yes, I was there", "Camera not working", "Mic not working", "Household chores", "Father asked for help"
  ];

  const animals = [
    "🐶", "🐱", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮",
    "🐷", "🐒", "🐔", "🐧", "🐦", "🦆", "🦅", "🦉", "🦇", "🐺",
    "🐗", "🐴", "🐙", "🐠"
  ];

  if (type === "vc") return shuffle(vcReasons);
  if (type === "animals") return shuffle(animals);
}

const cssClasses = {
  vc: {
    selecetd: 'col-2 text-bg-dark shadow-sm rounded text-center m-1 box box-text',
    normal: 'col-2 text-bg-light shadow-sm rounded text-center m-1 box box-text'
  },
  animals: {
    selecetd: 'col-2 text-bg-dark shadow-sm rounded text-center m-1 box box-text-animals',
    normal: 'col-2 text-bg-light shadow-sm rounded text-center m-1 box box-text-animals'
  }
}

const possibleCombinations = [
  ["b0", "b1", "b2", "b3", "b4"], ["b5", "b6", "b7", "b8", "b9"],
  ["b10", "b11", "b12", "b13", "b14"], ["b15", "b16", "b17", "b18", "b19"],
  ["b20", "b21", "b22", "b23", "b24"], ["b0", "b5", "b10", "b15", "b20"],
  ["b1", "b6", "b11", "b16", "b21"], ["b2", "b7", "b12", "b17", "b22"],
  ["b3", "b8", "b13", "b18", "b23"], ["b4", "b9", "b14", "b19", "b24"],
  ["b0", "b6", "b12", "b18", "b24"], ["b4", "b8", "b12", "b16", "b20"]
];

function App() {

  const [bingoValues, setBingoValues] = useState(getBingoValues("vc"));
  const [selectedBoxes, setSelectedBoxes] = useState(["b12"]);
  const [bingoType, setBingoType] = useState("vc");
  const [bingos, setBingos] = useState([]);
  const [winnerScreen, setWinnerScreen] = useState(false);

  useEffect(() => {
    for (let i = 0; i < possibleCombinations.length; i++) {
      let count = 0;
      for (let j = 0; j < 5; j++) {
        if (selectedBoxes.includes(possibleCombinations[i][j])) {
          count++;
        }
      }
      if (count === 5) {
        setBingos((prevState) => {
          if (prevState.includes(possibleCombinations[i])) return prevState;
          return [...prevState, possibleCombinations[i]];
        });
      }
    }
  }, [selectedBoxes]);

  useEffect(() => {
    if (bingos.length > 0) {
      setWinnerScreen(true);
      setTimeout(() => { setWinnerScreen(false) }, 2500)
    }
  }, [bingos]);

  const handleClick = (id) => {
    if (!selectedBoxes.includes(id))
      setSelectedBoxes((prevState) => { return [...prevState, id] });
  }

  const handleTypeSelect = (type) => {
    setBingoType(type);
    setBingoValues(getBingoValues(type));
    setSelectedBoxes(["b12"]);
    setBingos([]);
  }

  const handleRestart = () => {
    setBingoValues(getBingoValues(bingoType));
    setSelectedBoxes(["b12"]);
    setBingos([]);
  }

  const renderRow = (data) => {
    return (
      <div className='row justify-content-center'>
        {
          data.map((box) => (
            <div key={box.id}
              style={{ overflow: 'hidden' }}
              className={selectedBoxes.includes(box.id) ?
                cssClasses[box.id === "b12" ? "vc" : bingoType].selecetd :
                cssClasses[bingoType].normal
              }
              id={box.id} onClick={(e) => handleClick(e.target.id)}
            >
              {
                box.value ?
                  box.value :
                  bingoValues[parseInt(box.id.substr(1)) < 12 ? parseInt(box.id.substr(1)) : parseInt(box.id.substr(1)) - 1]
              }
            </div>
          ))
        }
      </div>
    )
  }

  const WinnerScreenView = () => (
    <div className="container winner-screen">
      <div>
        <AnimatedText
          type="words"
          animationType="bounce"
          interval={0.06}
          duration={0.7}
          tag="h1"
          includeWhiteSpaces
          threshold={0.1}
        >
          &#127882; &#127882; B i n g o ! &#127882; &#127882;
        </AnimatedText>
      </div>
    </div>
  )

  return (
    winnerScreen ?
      <WinnerScreenView /> :
      <div className="container mt-5">
        <div className='shadow-lg py-5 rounded'>
          <div className="row mt-3 p-2">
            <div className='col'>
              <h2 style={{ fontWeight: "bold", marginLeft: "30px" }}>B I N G O &#128520;</h2>
            </div>
          </div>
          <div className="row text-center my-3">
            <h2 style={{ fontWeight: "bold" }}>{bingos.length}</h2>
          </div>
          <div className="row justify-content-center">
            {renderRow([{ id: 'b0' }, { id: 'b1' }, { id: 'b2' }, { id: 'b3' }, { id: 'b4' }])}
            {renderRow([{ id: 'b5' }, { id: 'b6' }, { id: 'b7' }, { id: 'b8' }, { id: 'b9' }])}
            {renderRow([{ id: 'b10' }, { id: 'b11' }, { id: 'b12', value: bingoType === "vc" ? "Video Conference Bingo !" : "Animal Bingo !" }, { id: 'b13' }, { id: 'b14' }])}
            {renderRow([{ id: 'b15' }, { id: 'b16' }, { id: 'b17' }, { id: 'b18' }, { id: 'b19' }])}
            {renderRow([{ id: 'b20' }, { id: 'b21' }, { id: 'b22' }, { id: 'b23' }, { id: 'b24' }])}
          </div>
          <div className="row justify-content-center p-1 mt-2">
            <div className="col-4">
              <select className='form-select text-center box-text' value={bingoType} onChange={(e) => handleTypeSelect(e.currentTarget.value)}>
                <option value="vc">Video Conference</option>
                <option value="animals">Animals</option>
              </select>
            </div>
          </div>
          <div className="row justify-content-center p-1 mt-2">
            <button className='btn btn-dark p-2 box-text' style={{ maxWidth: "140px" }} onClick={handleRestart}>Restart</button>
          </div>
        </div>
      </div>
  );
}

export default App;
