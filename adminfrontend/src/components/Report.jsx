import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

export default function Report() {
  const chartRef = useRef(null); // Reference to store the chart instance for bar chart
  const pieChartInstanceRef = useRef(null); // Reference to store the pie chart instance
  const canvasRef = useRef(null); // Reference to the canvas for bar chart
  const pieChartRef = useRef(null); // Reference for the pie chart canvas

  const [orphanageList, setOrphanageList] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getAllApplications = async () => {
      try {
        const response = await axiosPrivate.get("/application");
        console.log(response.data.applicationList);

        // Initialize counts for each status
        const counts = {
          Accepted: 0,
          Rejected: 0,
          Pending: 0,
        };

        // Count occurrences of each status
        response.data.applicationList.forEach((application) => {
          if (application.status in counts) {
            counts[application.status]++;
          }
        });

        // Create an array called countval with counts in the desired order
        const countval = [counts.Accepted, counts.Rejected, counts.Pending];
        console.log(countval);

        const ctxPie = pieChartRef.current?.getContext("2d");
        if (ctxPie) {
          // Destroy previous pie chart instance if it exists
          if (pieChartInstanceRef.current) {
            pieChartInstanceRef.current.destroy();
          }

          // Create a new pie chart
          pieChartInstanceRef.current = new Chart(ctxPie, {
            type: "doughnut",
            data: {
              labels: ["Accepted", "Rejected", "Pending"],
              datasets: [
                {
                  label: "Application Status",
                  data: countval,
                  backgroundColor: [
                    "rgba(0, 255, 0, 0.6)",
                    "rgba(255, 0, 0, 0.6)",
                    "rgba(255, 255, 0, 0.6)"
                  ],
                },
              ],
              hoverOffset: 16, 
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1500, // Animation duration in milliseconds
              easing: "easeInOutBounce", // Easing function for smoothness
            },
            hover: {
              mode: "nearest",
              intersect: true,
            },
            plugins: {
              legend: {
                display: true,
                position: "bottom", // Legend position
                labels: {
                  color: "#333", // Text color for the legend
                  font: {
                    size: 14,
                  },
                },
              },
              tooltip: {
                enabled: true,
                backgroundColor: "rgba(0,0,0,0.7)", // Tooltip background
                titleColor: "#fff", // Tooltip text color
                bodyColor: "#fff",
                borderColor: "#ddd",
                borderWidth: 1,
              },
            },
          });
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    getAllApplications();

    const getOrphanageChildren = async (orphanageId) => {
      try {
        const response = await axiosPrivate.get(
          `/child/orphanage/${orphanageId}`,
          {
            headers: {
              orphanageId: orphanageId,
            },
          }
        );
        return response.data.childrenList.length;
      } catch (error) {
        console.error("Failed to fetch orphanage children:", error);
        return 0; // In case of an error, return 0
      }
    };

    const getAllOrphanages = async () => {
      try {
        const response = await axiosPrivate.get("/orphanage");
        const orphanages = response.data.orphanageList;
        setOrphanageList(orphanages);

        // Fetch number of children for each orphanage and construct data array
        const dataPromises = orphanages.map(async (orphanage) => {
          const children = await getOrphanageChildren(orphanage.orphanageid);
          return {
            name: orphanage.orphanagename,
            children: children,
            capacity: orphanage.capacity,
          };
        });

        const data = await Promise.all(dataPromises);

        // Destroy the previous bar chart instance if it exists
        if (chartRef.current) {
          chartRef.current.destroy();
        }

        // Create a new bar chart
        const ctx = canvasRef.current.getContext("2d");
        chartRef.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: data.map((row) => row.name),
            datasets: [
              {
                label: "Actual",
                backgroundColor: "rgba(0, 245, 255, 88)",
                data: data.map((row) => row.children),
              },
              {
                label: "Capacity",
                backgroundColor: "rgba(255, 0, 128, 1)",
                data: data.map((row) => row.capacity),
              },
            ],
          },
          options: {
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                  return Array.isArray(value)
                    ? (value[1] + value[0]) / 2
                    : value;
                },
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to fetch orphanages:", error);
      }
    };

    getAllOrphanages();

    // Cleanup: destroy chart instances on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
    };
  }, [axiosPrivate]);

  return (
    <div className="flex mb-4">
      <div className="w-1/2 h-1/2">
        <div className="mb-4 text-2xl font-semibold text-center">
          Current Child Count in Each Orphanage
        </div>
        <canvas ref={canvasRef} id="myChart" width="400" height="400"></canvas>
      </div>
      <div className="w-1/2">
        <div className="mb-4 text-2xl font-semibold text-center">
          Application Status
        </div>
        <canvas ref={pieChartRef} width="400" height="400"></canvas>
      </div>
    </div>
  );
}
