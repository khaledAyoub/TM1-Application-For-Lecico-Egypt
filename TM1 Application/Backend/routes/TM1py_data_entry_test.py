from config import connections
from fastapi import APIRouter, HTTPException, Cookie, Request
import pandas as pd

TM1pyDataEntryTest = APIRouter()


@TM1pyDataEntryTest.post("/test")
async def test_tmi_py_data_entry(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing.")

    if access_token not in connections:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    connection = connections[access_token]

    try:
        dimensions = connection.dimensions.get_all_names()
        return {
            "authenticated": True,
            "dimensions": dimensions
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve dimensions: {str(e)}"
        )


@TM1pyDataEntryTest.post("/getData")
async def getData(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing.")

    if access_token not in connections:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    connection = connections[access_token]

    MDX = """
        SELECT
        {
            [TM1py column].[TM1py column].MEMBERS
        } ON 0,
        {
            [TM1py row].[TM1py row].MEMBERS
        } ON 1
        FROM [TM1py data entry test]
    """

    try:
        view = connection.cubes.cells.execute_mdx_dataframe(
            MDX,
            skip_zeros=False
        )

        # Preserve original TM1 order
        row_order = view["TM1py row"].drop_duplicates().tolist()
        col_order = view["TM1py column"].drop_duplicates().tolist()

        df_pivot = view.pivot(
            index="TM1py row",
            columns="TM1py column",
            values="Value"
        )

        df_pivot = df_pivot.reindex(
            index=row_order,
            columns=col_order
        )

        return {
            "authenticated": True,
            "view": df_pivot.to_dict()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve data: {str(e)}"
        )


@TM1pyDataEntryTest.post("/setData")
async def setData(request: Request, access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing.")

    if access_token not in connections:
        raise HTTPException(status_code=401, detail="Invalid access token.")

    connection = connections[access_token]

    body = await request.json()
    view_dict = body["view"]

    MDX = """
        SELECT
        {
            [TM1py column].[TM1py column].MEMBERS
        } ON 0,
        {
            [TM1py row].[TM1py row].MEMBERS
        } ON 1
        FROM [TM1py data entry test]
    """

    try:
        # Rebuild dataframe
        df_pivot = pd.DataFrame.from_dict(view_dict)

        # Convert everything to numeric
        df_pivot = df_pivot.apply(
            pd.to_numeric,
            errors="coerce"
        ).fillna(0)

        # TM1 expects row-major order
        values = df_pivot.to_numpy().flatten().tolist()

        print("DataFrame:")
        print(df_pivot)

        print("Values being sent:")
        print(values)

        connection.cells.write_values_through_cellset(
            mdx=MDX,
            values=values
        )

        return {
            "success": True
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to write data: {str(e)}"
        )