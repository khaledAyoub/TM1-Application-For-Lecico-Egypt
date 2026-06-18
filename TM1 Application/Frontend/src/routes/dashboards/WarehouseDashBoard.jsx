import React, { useEffect, useState } from "react";
import { getData } from "../../helper/dataSetterAndGetter";
import ViewViewer from "../../component/ViewViewer.jsx";
import Header from "../../component/Header.jsx";

export default function WarehouseDashBoard() {
  // const [loading, setLoading] = useState(false)
  const [view, setView] = useState({});
  const [dimensions, setDimensions] = useState([]);

  useEffect(() => {
    const getDataJson = async () => {
      try {
        // setLoading(true)

        const MDX =
          "SELECT { [Voucher Type].[Voucher Type].[Issue without Intercompany Sales], [Voucher Type].[Voucher Type].[Production], [Voucher Type].[Voucher Type].[Closing Balance After InterCompany Sales] } ON 0, { { [Year].[Flat Years].[2023], [Year].[Flat Years].[2024], [Year].[Flat Years].[2025], [Year].[Flat Years].[2026] } * { [Days].[Days].[Year^Jan], [Days].[Days].[Year^Feb], [Days].[Days].[Year^Mar], [Days].[Days].[Year^Apr], [Days].[Days].[Year^May], [Days].[Days].[Year^Jun], [Days].[Days].[Year^Jul], [Days].[Days].[Year^Aug], [Days].[Days].[Year^Sep], [Days].[Days].[Year^Oct], [Days].[Days].[Year^Nov], [Days].[Days].[Year^Dec] } } ON 1 FROM [Warehouse] WHERE ( [Version].[Version].[Actual vs Static Budget^Actual], [Choices].[Choices].[Total Choices], [Sanitary Colour].[Sanitary Colour].[Total Colour], [Warehouse].[Warehouse].[All Warehouse], [Sanitary Size].[Sanitary Size].[All Size^Sz 1], [Legal Entity].[Legal Entity].[Lecico Egypt Combined], [Measurement Unit].[Measurement Unit].[Pieces], [Voucher Reason].[Voucher Reason].[Total Reason], [Sanitary Inlet or Outlet].[Sanitary Inlet or Outlet].[All Inlet or Outlet], [Sanitary Function].[Sanitary Function].[All Functions], [Sanitary Operation].[Sanitary Operation].[All Operation], [Sanitary Package].[Sanitary Package].[All Sanitary Package], [Sanitary Product Type].[Sanitary Product Type].[Total Type], [Sanitary Options].[Sanitary Options].[All Options], [Sanitary Set].[Sanitary Set].[Total Set] )";

        const dataJson = await getData(MDX);

        setView(dataJson.view || {});
        setDimensions(dataJson.dimensions || []);
      } catch (error) {
        console.error(error);
      } finally {
        // setLoading(false)
      }
    };

    getDataJson();
  }, []);

  return (
    <>
      <Header backBtton={true} />
      <ViewViewer
        view={view}
        dimensions={dimensions}
        rowDimensions={["Year", "Days"]}
        columnDimensions={["Voucher Type"]}
        className=""
      />
    </>
  );
}
