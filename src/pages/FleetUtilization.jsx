// src/pages/Administration/FleetPerformanceTabs.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

// ---------------- Helper Functions ----------------

function groupStopsByDuration(stops = []) {
  const bucket1 = stops.filter((s) => (s.totalTime || 0) / 60 < 20).length;
  const bucket2 = stops.filter(
    (s) => (s.totalTime || 0) / 60 >= 20 && (s.totalTime || 0) / 60 <= 30
  ).length;
  const bucket3 = stops.filter((s) => (s.totalTime || 0) / 60 > 30).length;
  return [
    { duration: "<20 min", vehicles: bucket1 },
    { duration: "20-30 min", vehicles: bucket2 },
    { duration: ">30 min", vehicles: bucket3 },
  ];
}

function buildMainDataForVehicle(vehicle) {
  const unschedStops = vehicle.unscheduledStops || [];
  const geoStops = vehicle.geoFenceStops || [];
  const idlingStops = vehicle.idlingStops || [];
  const dailyRunning = vehicle.dailyRunning || [];
  return {
    vehicleNumber: vehicle.vehicleNumber,
    unschedStoppage: vehicle.unscheduledStopsCount ?? unschedStops.length,
    unschedTime: unschedStops.reduce((acc, s) => acc + (s.totalTime || 0), 0),
    gfStops: geoStops.length,
    gfTime: geoStops.reduce((acc, s) => acc + (s.totalTime || 0), 0),
    idling: vehicle.idlingCount ?? idlingStops.length,
    idlingTime: idlingStops.reduce((acc, s) => acc + (s.totalTime || 0), 0),
    dailyRunning: dailyRunning.length,
    km: dailyRunning.reduce((acc, d) => acc + (Number(d.distance) || 0), 0),
  };
}

// ---------------- Table Components ----------------

function SummaryTable({ summaryData = [] }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-blue-gray-50">
            <th className="p-3 text-sm font-bold uppercase text-blue-gray-600 rounded-tl-xl">
              TIME DURATION
            </th>
            <th className="p-3 text-sm font-bold uppercase text-blue-gray-600 rounded-tr-xl">
              VEHICLES
            </th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map((row, i) => (
            <tr key={i} className="even:bg-blue-gray-50/50">
              <td className="p-3">{row.duration}</td>
              <td className="p-3">{row.vehicles}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MainTable({ mainData = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto text-left border-collapse">
        <thead>
          <tr className="bg-blue-gray-50">
            <th className="p-3 text-sm font-bold uppercase">Vehicle No</th>
            <th className="p-3 text-sm font-bold uppercase">Unscheduled Stops</th>
            <th className="p-3 text-sm font-bold uppercase">Time Duration</th>
            <th className="p-3 text-sm font-bold uppercase">Geofence Stops</th>
            <th className="p-3 text-sm font-bold uppercase">Time Duration</th>
            <th className="p-3 text-sm font-bold uppercase">Idling</th>
            <th className="p-3 text-sm font-bold uppercase">Time Duration</th>
            <th className="p-3 text-sm font-bold uppercase">Daily Running (Count)</th>
            <th className="p-3 text-sm font-bold uppercase">KM</th>
          </tr>
        </thead>
        <tbody>
          {mainData.map((v, i) => {
            const unschedMin = Math.floor((v.unschedTime || 0) / 60);
            const gfMin = Math.floor((v.gfTime || 0) / 60);
            const idleMin = Math.floor((v.idlingTime || 0) / 60);
            return (
              <tr key={i} className="even:bg-blue-gray-50/50">
                <td className="p-3">{v.vehicleNumber}</td>
                <td className="p-3">{v.unschedStoppage}</td>
                <td className="p-3">{unschedMin} min</td>
                <td className="p-3">{v.gfStops}</td>
                <td className="p-3">{gfMin} min</td>
                <td className="p-3">{v.idling}</td>
                <td className="p-3">{idleMin} min</td>
                <td className="p-3">{v.dailyRunning}</td>
                <td className="p-3">{v.km} km</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ---------------- Main Component ----------------

export default function FleetPerformanceTabs() {
  const [vehicles, setVehicles] = useState([]);
  const [tabsData, setTabsData] = useState([]);
  const [mainData, setMainData] = useState([]);
  const [activeTab, setActiveTab] = useState("unscheduled-stoppage");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch raw API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://api.veyza.in/veyza-api/v0/dailyStatus", {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("Failed to fetch data");
        const json = await res.json();
        setVehicles(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Aggregate when vehicles arrive
  useEffect(() => {
    if (!vehicles.length) return;

    // Build per-vehicle main table
    const main = vehicles.map(buildMainDataForVehicle);
    setMainData(main);

    // Collect all stop/events across all vehicles
    const unschedAll = vehicles.flatMap((v) => v.unscheduledStops || []);
    const geoAll = vehicles.flatMap((v) => v.geoFenceStops || []);
    const idleAll = vehicles.flatMap((v) => v.idlingStops || []);
    const runningAll = vehicles.flatMap((v) => v.dailyRunning || []);

    // Build distribution buckets
    const unschedDist = groupStopsByDuration(unschedAll);
    const geoDist = groupStopsByDuration(geoAll);
    const idleDist = groupStopsByDuration(idleAll);
    const runningDist = [
      { duration: "0-100 km", vehicles: runningAll.filter((d) => Number(d.distance) < 100).length },
      { duration: "100-200 km", vehicles: runningAll.filter((d) => {
        const km = Number(d.distance);
        return km >= 100 && km <= 200;
      }).length },
      { duration: ">200 km", vehicles: runningAll.filter((d) => Number(d.distance) > 200).length },
    ];

    // Prepare tab definitions
    setTabsData([
      {
        label: "Unscheduled Stoppage",
        value: "unscheduled-stoppage",
        summaryData: unschedDist,
        detailData: unschedAll,
      },
      {
        label: "Geofence Stoppage",
        value: "geofence-stoppage",
        summaryData: geoDist,
        detailData: geoAll,
      },
      {
        label: "Idling",
        value: "idling",
        summaryData: idleDist,
        detailData: idleAll,
      },
      {
        label: "Daily Running Km",
        value: "daily-running-km",
        summaryData: runningDist,
        detailData: runningAll,
      },
      {
        label: "Driver Behavior",
        value: "driver-behavior",
        // no summaryData / detailData needed here
      },
    ]);
  }, [vehicles]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error)   return <Typography color="red">{error}</Typography>;
  if (!tabsData.length) return <Typography>No data available</Typography>;

  return (
    <div>
      <Typography variant="h4" className="mb-4">
        Fleet Performance
      </Typography>

      <Card className="rounded-xl shadow-sm mb-6">
        <CardBody>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <TabsHeader>
              {tabsData.map((tab) => (
                <Tab key={tab.value} value={tab.value}>
                  {tab.label}
                </Tab>
              ))}
            </TabsHeader>
            <TabsBody>
              {tabsData.map((tab) => (
                <TabPanel key={tab.value} value={tab.value}>
                  {tab.value === "driver-behavior" ? (
                    <div className="flex items-center justify-center h-64">
                      <Typography variant="h5">Coming Soon</Typography>
                    </div>
                  ) : (
                    <>
                      <SummaryTable summaryData={tab.summaryData} />
                      <MainTable mainData={mainData} />
                    </>
                  )}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
