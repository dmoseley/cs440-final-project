import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";

import Condition from "../components/Condition";

const Datasets = [
  {
    value: "main",
    display: "Main Dataset",
    attributes: [
      {
        value: "song",
        display: "Song Title"
      },
      {
        value: "artist",
        display: "Artist Name"
      }
    ]
  },
  {
    value: "billboard19642015",
    display: "Billboard Hits 1964-2015",
    attributes: [
      {
        value: "song",
        display: "Song Title"
      },
      {
        value: "artist",
        display: "Artist Name"
      },
      {
        value: "releasedate",
        display: "Release Date"
      }
    ]
  },
  {
    value: "spotify1019",
    display: "Spotify Top Songs 2010-2019",
    attributes: [
      {
        value: "song",
        display: "Song Title"
      },
      {
        value: "artist",
        display: "Artist Name"
      },
      {
        value: "genre",
        display: "Genre"
      },
      {
        value: "releasedate",
        display: "Release Date"
      }
    ]
  },
  {
    value: "composer",
    display: "Artist Birthyears",
    attributes: [
      {
        value: "artist",
        display: "Artist Name"
      },
      {
        value: "birthyear",
        display: "Birth Year"
      }
    ]
  },
  {
    value: "hollywoodranking",
    display: "Hollywood Rankings",
    attributes: [
      {
        value: "song",
        display: "Song Title"
      },
      {
        value: "artist",
        display: "Artist Name"
      },
      {
        value: "releasedate",
        display: "Release Date"
      },
      {
        value: "rank",
        display: "Rank"
      }
    ]
  },
  {
    value: "pitchforkreview",
    display: "Pitchfork Reviews",
    attributes: [
      {
        value: "album",
        display: "Album"
      },
      {
        value: "artist",
        display: "Artist Name"
      },
      {
        value: "genre",
        display: "Genre"
      },
      {
        value: "rating",
        display: "Rating"
      }
    ]
  },
  {
    value: "spotifyplaylist",
    display: "Spotify Playlists",
    attributes: [
      {
        value: "song",
        display: "Song Title"
      },
      {
        value: "artist",
        display: "Artist Name"
      },
      {
        value: "playlist",
        display: "Playlist Title"
      }
    ]
  }
];

function Home() {
  const [conditions, setConditions] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("main");
  const [idCounter, setIdCounter] = useState(0);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);

  const updateDataset = e => {
    setSelectedDataset(e.target.value);
    setConditions([]);
  };

  const addCondition = () => {
    setConditions([
      ...conditions,
      { id: idCounter, attribute: "", value: "", is: "exact" }
    ]);
    setIdCounter(idCounter + 1);
  };

  const deleteCondition = id => {
    setConditions(conditions.filter(condition => condition.id !== id));
  };

  const updateConditionAttribute = (id, value) => {
    setConditions(
      conditions.map(condition =>
        condition.id === id
          ? {
              id: condition.id,
              attribute: value,
              value: condition.value,
              is: condition.is
            }
          : condition
      )
    );
  };

  const updateConditionValue = (id, value) => {
    setConditions(
      conditions.map(condition =>
        condition.id === id
          ? {
              id: condition.id,
              attribute: condition.attribute,
              value: value,
              is: condition.is
            }
          : condition
      )
    );
  };

  const updateConditionIs = (id, value) => {
    setConditions(
      conditions.map(condition =>
        condition.id === id
          ? {
              id: condition.id,
              attribute: condition.attribute,
              value: condition.value,
              is: value
            }
          : condition
      )
    );
  };

  const confirmSearch = () => {
    (async () => {
      const rawResponse = await fetch("/", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          dataset: selectedDataset,
          conditions: conditions
        })
      });
      const content = await rawResponse.json();
      setResults(content.results);
      setTotalResults(content.totalResults);
    })();
  };

  return (
    <div>
      <h1 style={{ paddingTop: "25px" }}>Search</h1>
      <hr />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h5 style={{ fontWeight: "bold" }}>Dataset:</h5>
            <select
              className="form-control"
              id="dropdownDataset"
              style={{ width: "250px" }}
              onChange={updateDataset.bind(this)}
            >
              {Datasets.map(dataset => (
                <option key={dataset.value} value={dataset.value}>
                  {dataset.display}
                </option>
              ))}
            </select>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col-12" style={{ padding: "0 20px 0 20px" }}>
            <h5 style={{ fontWeight: "bold" }}>Conditions:</h5>
            {conditions.map(condition => (
              <Condition
                key={condition.id}
                id={condition.id}
                deleteCondition={deleteCondition}
                updateConditionAttribute={updateConditionAttribute}
                updateConditionValue={updateConditionValue}
                updateConditionIs={updateConditionIs}
                attributes={
                  Datasets.find(dataset => dataset.value === selectedDataset)
                    .attributes
                }
              />
            ))}
            <button
              className="btn btn-primary"
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                margin: "10px"
              }}
              onClick={addCondition}
            >
              <FontAwesomeIcon
                style={{ marginRight: "5px" }}
                icon={faPlusCircle}
              />
              Add Condition
            </button>
          </div>
        </div>
        <hr />
        <button
          className="btn btn-success"
          style={{
            fontWeight: "bold",
            fontSize: "14px",
            margin: "10px"
          }}
          onClick={confirmSearch}
        >
          <FontAwesomeIcon style={{ marginRight: "5px" }} icon={faSearch} />
          Search
        </button>
      </div>

      {results.length === 0 ? (
        <div></div>
      ) : (
        <div>
          <h1 style={{ paddingTop: "50px" }}>Results</h1>
          <hr />
          <h4 style={{ marginLeft: "20px" }}>
            Total Count:
            <span
              style={{ margin: "0 0 0 5px" }}
              className="badge badge-secondary"
            >
              {totalResults}
            </span>
          </h4>
          <h5 style={{ margin: "20px 20px 5px 20px" }}>First 25 results:</h5>
          <table
            className="table table-striped"
            style={{ margin: "0 20px 30px 20px" }}
          >
            <thead>
              <tr>
                <th scope="col">#</th>
                {Object.keys(results[0]).map(key => {
                  return (
                    <th scope="col" key={key}>
                      {key}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    {Object.values(result).map(value => {
                      return <td key={index + value}>{value}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
