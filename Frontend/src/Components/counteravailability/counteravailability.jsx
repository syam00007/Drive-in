import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const CounterAvailability = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Wrap fetchCounters with useCallback to prevent unnecessary re-creations.
  const fetchCounters = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:9098/api/cp/all");
      setCounters(response.data);
    } catch (error) {
      console.error("Error fetching counters:", error);
      enqueueSnackbar("Failed to load counters.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        action: (key) => (
          <IconButton onClick={() => closeSnackbar(key)} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar, closeSnackbar]);

  // Toggle counter status between "Active" and "Not Active"
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Not Active" : "Active";
    try {
      const response = await axios.put(
        `http://localhost:9098/api/cp/updateAvailability/${id}?status=${newStatus}`
      );
      enqueueSnackbar(response.data, {
        variant: "success",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        action: (key) => (
          <IconButton onClick={() => closeSnackbar(key)} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        ),
      });
      fetchCounters(); // Refresh the counters after updating status
    } catch (error) {
      console.error("Error updating status:", error);
      enqueueSnackbar("Failed to update status.", {
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" },
        action: (key) => (
          <IconButton onClick={() => closeSnackbar(key)} color="inherit">
            <CloseIcon fontSize="small" />
          </IconButton>
        ),
      });
    }
  };

  useEffect(() => {
    // Now that fetchCounters is memoized, it can be included in the dependency array.
    fetchCounters();
  }, [fetchCounters]);

  return (
    <div className="container mt-5">
      <h1 style={{ color: "DodgerBlue", fontFamily: "Times New Roman" }}>
        <center>
          <strong>Counter Availability</strong>
        </center>
      </h1>

      {loading ? (
        <div className="text-center">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Counter Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {counters.length > 0 ? (
                counters.map((counter, index) => {
                  const status = counter.status || "Not Active";
                  return (
                    <tr key={counter.id}>
                      <td>{index + 1}</td>
                      <td>{counter.counterName}</td>
                      <td>
                        <button
                          className={`btn ${
                            status === "Active"
                              ? "btn-success"
                              : "btn-outline-danger"
                          } w-50`}
                          onClick={() => toggleStatus(counter.id, status)}
                        >
                          {status}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3}>No counters available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CounterAvailability;
