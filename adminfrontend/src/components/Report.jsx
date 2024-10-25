import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { countries } from './../assets/assets';

export default function Report() {
  const barChartInstanceRef= useRef(null); 
  const pieChartInstanceRef = useRef(null); 
  const barChart2InstanceRef = useRef(null);
  const barChartRef = useRef(null); 
  const barChart2Ref = useRef(null);
  const pieChartRef = useRef(null); 
  

  const [orphanageList, setOrphanageList] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getAllApplications = async () => {
      try {
        const response = await axiosPrivate.get("/application");
        // console.log(response.data.applicationList);

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
        // console.log(countval);

        const ctxPie = pieChartRef.current?.getContext("2d");
        if (ctxPie) {
          // Destroy previous pie chart instance if it exists
          if (pieChartInstanceRef.current) {
            pieChartInstanceRef.current.destroy();
          }
          // Create a new pie chart
          pieChartInstanceRef.current = new Chart(ctxPie, {
            type: "pie",
            data: {
              labels: ["Accepted", "Rejected", "Pending"],
              datasets: [
                {
                  label: "Application Status",
                  data: countval,
                  backgroundColor: [
                    "rgba(0, 120, 0, 1)",    
                    "rgba(178, 34, 34, 1)",    
                    "rgba(255, 215, 0, 1)"   
                  ],
                },
              ],
              hoverOffset: 16, 
            },
            options: {
              responsive: true,
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
        if (barChartInstanceRef.current) {
          barChartInstanceRef.current.destroy();
        }

        // Create a new bar chart
        const ctx = barChartRef.current.getContext("2d");
        barChartInstanceRef.current = new Chart(ctx, {
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
                backgroundColor: "rgba(0, 0, 128, 1)",
                data: data.map((row) => row.capacity),
              },
            ],
          },
          options: {
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

    const countries = {};

const getAlldonations = async () => {
  console.log("Fetching donations");
  try {
    const response = await axiosPrivate.get("/donate");
    console.log(response);

    response.data.donations.forEach((donation) => {
      const donationAmount = parseFloat(donation.amount);

      if (!countries[donation.country]) {
        countries[donation.country] = donationAmount;
      } else {
        countries[donation.country] += donationAmount;
      }
    }); // Fixed closing parenthesis for forEach

    // Prepare data for the chart
    const labels = Object.keys(countries);
    const data = Object.values(countries);

    const ctx = barChart2Ref.current.getContext("2d");
    barChart2InstanceRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels, // Use labels from countries
        datasets: [
          {
            label: "Amount",
            backgroundColor:"rgba(255, 20, 147, 1)",
            data: data // Use data values from countries
          },
        ],

      },
      options: {
        indexAxis: 'y',
      }
    });

  } catch (error) {
    console.error("Failed to fetch donations:", error);
  }
  console.log(countries);
}

getAlldonations();

    
    // Cleanup: destroy chart instances on unmount
    return () => {
      if (barChartInstanceRef.current) {
        barChartInstanceRef.current.destroy();
      }
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
      }
      if (barChart2InstanceRef.current) {
        barChart2InstanceRef.current.destroy();
      }
    };
  }, [axiosPrivate]);

  return (
    <div className="flex mt-20">
      <div className="w-1/3 h-1/3">
        <div className="mb-4 text-2xl font-semibold text-center">
          Current Child Count in Each Orphanage
        </div>
        <canvas ref={barChartRef} width="100" height="100"></canvas>
      </div>
      <div className="w-1/3 h-1/3"> 
        <div className="mb-4 text-2xl font-semibold text-center">
          Application Status
        </div>
        <canvas ref={pieChartRef} width="100" height="100"></canvas>
      </div>
      <div className="w-1/3 h-1/3">
        <div className="mb-4 text-2xl font-semibold text-center">
          Donation Status
        </div>
        <canvas ref={barChart2Ref} width="100" height="100"></canvas>
      </div>
    </div>
  );
}
