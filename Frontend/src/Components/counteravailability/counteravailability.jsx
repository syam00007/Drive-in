import React, { useEffect, useState } from "react";
import axios from "axios";

const Counteravailability = () => {
  const [counterdata, setCounterdata] = useState([]);
  const [counter, setCounter] = useState({});

  // Function to fetch data from API
  const fetchData = () => {
    axios
      .get("http://localhost:9098/api/cp/all")
      .then((response) => {
        setCounterdata(response.data);
      });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to change counter status
  const changeCounterStatus = (id) => {
    axios.get(`http://localhost:9098/api/cp/fetchcounter?id=${id}`).then((response) => {
      setCounter(response.data);

      // Toggle status
      if (response.data.status === "Active") {
        response.data.status = "NotActive";
      } else {
        response.data.status = "Active";
      }

      // Update status in the backend
      axios.put(`http://localhost:9098/updatecounters/${id}`, response.data).then((response) => {
        window.alert(response.data);
        fetchData();
      });
    });
  };

  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {counterdata.map((element,index) => (
            <tr key={element.id}>
              <td>{index+1}</td>
              <td>{element.counterName}</td>
              <td>
                <button
                  className={element.status === "Active" ? "btn btn-primary px-5 my-2 w-50" : "btn btn-danger px-5 my-2 w-50"}
                  onClick={() => changeCounterStatus(element.id)}
                >
                  {element.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Counteravailability;
