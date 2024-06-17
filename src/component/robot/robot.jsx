import { useState } from "react";
import axios from "axios";
import "./robot.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const directionMap = {
  NORTH: 0,
  EAST: 1,
  SOUTH: 2,
  WEST: 3,
};

const RobotControl = () => {
  const [robotPosition, setRobotPosition] = useState({
    x: 0,
    y: 0,
    directionFacing: "NORTH",
  });
  const [gridSize, setGridSize] = useState(5);
  const [isPlaced, setIsPlaced] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const options = Array.from({ length: 100 }, (_, i) => i + 1);
  const axisOptions = Array.from({ length: gridSize }, (_, i) => i);

  const placeRobot = async (x, y, directionFacing, TableSize) => {
    await axios.post(
      "http://robotapp.southindia.cloudapp.azure.com/api/api/Robot/place",
      {
        x,
        y,
        directionFacing: directionMap[directionFacing],
        TableSize,
      }
    );
    setRobotPosition({ x, y, directionFacing });
    setIsPlaced(true);
  };

  const moveRobot = async () => {
    const response = await axios.post(
      "http://robotapp.southindia.cloudapp.azure.com/api/api/Robot/move"
    );
    if (response.data === "Robot is moving") {
      toast.success(response.data, {
        position: "bottom-right",
      });
    } else {
      toast.error(response.data, {
        position: "bottom-right",
      });
    }

    reportRobot();
  };
  const turnRight = async () => {
    const response = await axios.post(
      "http://robotapp.southindia.cloudapp.azure.com/api/api/Robot/right"
    );
    if (response.data === "Robot turning right!!") {
      toast.success(response.data, {
        position: "bottom-right",
      });
    } else {
      toast.error(response.data, {
        position: "bottom-right",
      });
    }
    reportRobot();
  };
  const turnLeft = async () => {
    const response = await axios.post(
      "http://robotapp.southindia.cloudapp.azure.com/api/api/Robot/left"
    );
    if (response.data === "Robot turning left!!") {
      toast.success(response.data, {
        position: "bottom-right",
      });
    } else {
      toast.error(response.data, {
        position: "bottom-right",
      });
    }
    reportRobot();
  };
  const reportRobot = async () => {
    const response = await axios.get(
      "http://robotapp.southindia.cloudapp.azure.com/api/api/Robot/report"
    );
    const [x, y, facing] = response.data.split(",");
    setRobotPosition({
      x: parseInt(x),
      y: parseInt(y),
      directionFacing: facing,
    });
  };
  function getRotationAngle(direction) {
    switch (direction) {
      case "NORTH":
        return 0;
      case "EAST":
        return 270;
      case "SOUTH":
        return 180;
      case "WEST":
        return 90;
      default:
        return 0;
    }
  }
  return (
    <div>
      <ToastContainer></ToastContainer>
      <h1>Toy Robot Control:</h1>
      <div className="row m-2">
        <div className="col-3">
          <label htmlFor="tableSize" className="form-label">
            Table Size
          </label>
          <select
            className="form-select"
            id="tableSize"
            defaultValue={5}
            onChange={(e) => {
              setGridSize(parseInt(e.target.value));
              setRobotPosition({ x: 0, y: 0, directionFacing: "NORTH" });
              setIsPlaced(false);
            }}
          >
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label htmlFor="xPosition" className="form-label">
            X Position
          </label>
          <select
            className="form-select"
            id="xPosition"
            value={robotPosition.x}
            onChange={(e) => {
              setRobotPosition({
                ...robotPosition,
                x: parseInt(e.target.value),
              });
              setIsPlaced(false);
            }}
          >
            {axisOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="col-3">
          <label htmlFor="yPosition" className="form-label">
            Y Position
          </label>
          <select
            className="form-select"
            id="yPosition"
            value={robotPosition.y}
            onChange={(e) => {
              setRobotPosition({
                ...robotPosition,
                y: parseInt(e.target.value),
              });
              setIsPlaced(false);
            }}
          >
            {axisOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="col-3">
          <div className="mb-3">
            <label htmlFor="direction" className="form-label">
              Direction
            </label>
            <select
              className="form-select"
              id="direction"
              value={robotPosition.directionFacing}
              onChange={(e) => {
                setRobotPosition({
                  ...robotPosition,
                  directionFacing: e.target.value,
                });
                setIsPlaced(false);
              }}
            >
              <option value="NORTH">North</option>
              <option value="EAST">East</option>
              <option value="SOUTH">South</option>
              <option value="WEST">West</option>
            </select>
          </div>
        </div>
      </div>
      <button
        type="button"
        disabled={isPlaced}
        className="btn btn-primary me-1"
        onClick={() =>
          placeRobot(
            robotPosition.x,
            robotPosition.y,
            robotPosition.directionFacing,
            gridSize
          )
        }
      >
        Place robot
      </button>
      <button
        disabled={!isPlaced}
        type="button"
        className="btn btn-primary me-1"
        onClick={moveRobot}
      >
        Move
      </button>
      <button
        disabled={!isPlaced}
        type="button"
        className="btn btn-primary me-1"
        onClick={turnLeft}
      >
        Left
      </button>
      <button
        disabled={!isPlaced}
        type="button"
        className="btn btn-primary me-1"
        onClick={turnRight}
      >
        Right
      </button>

      <br />
      <div className="d-flex justify-content-center align-items-center mt-4">
        <div
          className="card "
          style={{
            width: "18rem",
          }}
        >
          <div className="card-body">
            <h5 className="card-title">Robot Position</h5>
            <p className="card-text">
              <strong>X:</strong> {robotPosition.x}
              <br />
              <strong>Y:</strong> {robotPosition.y}
              <br />
              <strong>Direction Facing:</strong> {robotPosition.directionFacing}
            </p>
          </div>
        </div>
      </div>
      <div
        className="grid-container mt-4"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="d-flex flex-wrap border border-dark mt-2 ml-5"
          style={{ width: `${gridSize * 50}px`, height: `${gridSize * 50}px` }}
        >
          {[...Array(gridSize * gridSize)].map((_, index) => {
            const rowIndex = Math.floor(index / gridSize);
            const colIndex = index % gridSize;
            return (
              <div
                key={index}
                className="d-flex border border-dark"
                style={{
                  flex: "1 0 auto",
                  width: `${100 / gridSize}%`,
                  height: `${100 / gridSize}%`,
                }}
              >
                {isPlaced &&
                  robotPosition.x === colIndex &&
                  robotPosition.y === gridSize - 1 - rowIndex && (
                    <div className="d-flex justify-content-center align-items-center w-100 h-100">
                      <span
                        className={`robot ${robotPosition.directionFacing}`}
                        role="img"
                        aria-label="robot"
                        style={{
                          fontSize: "2rem",
                          transform: `rotate(${getRotationAngle(
                            robotPosition.directionFacing
                          )}deg)`,
                        }}
                      >
                        🤖
                      </span>
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
      <footer
        class="footer footer-bar bg-black align-item-center"
        id="stickyFooter"
      >
        <div className="container text-foot text-center">
          <p className="mb-0">
            © {new Date().getFullYear()} Designed by{" "}
            <span className="h6"> Shubham, Saxena </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RobotControl;
