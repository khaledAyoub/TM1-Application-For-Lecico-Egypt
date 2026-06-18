import sqlite3

DBconnection = sqlite3.connect("../DB/Lecico TM1 App.db")
cursor = DBconnection.cursor()

def tableCreation():

    TM1_Instances = """
        CREATE TABLE IF NOT EXISTS TM1_Instances (
            InstanceName TEXT PRIMARY KEY,
            Host         TEXT NOT NULL,
            Port         INTEGER NOT NULL,
            SSL          INTEGER NOT NULL CHECK (SSL IN (0, 1))
        );
    """

    TM1_Users  = """
        CREATE TABLE IF NOT EXISTS TM1_Users (
            TM1_UserName TEXT PRIMARY KEY,
            TM1_Password TEXT,
            InstanceName TEXT NOT NULL,
            FOREIGN KEY (InstanceName) REFERENCES TM1_Instances(InstanceName)
        );
    """

    Users = """
        CREATE TABLE IF NOT EXISTS Users (
            UserName     TEXT PRIMARY KEY,
            PasswordHash TEXT NOT NULL,
            TM1_UserName TEXT,
            FOREIGN KEY (TM1_UserName) REFERENCES TM1_Users(TM1_UserName)
        );
    """

    Pages = """
        CREATE TABLE IF NOT EXISTS Pages (
            PageName TEXT PRIMARY KEY,
            URL      TEXT NOT NULL UNIQUE
        );
    """
    
    PageAccess = """
        CREATE TABLE IF NOT EXISTS PageAccess (
            UserName TEXT NOT NULL,
            PageName TEXT NOT NULL,
            PRIMARY KEY (UserName, PageName),
            FOREIGN KEY (UserName) REFERENCES Users(UserName),
            FOREIGN KEY (PageName) REFERENCES Pages(PageName)
        );
    """
    
    cursor.execute(TM1_Instances)
    cursor.execute(TM1_Users)
    cursor.execute(Users)
    cursor.execute(Pages)
    cursor.execute(PageAccess)

    DBconnection.commit()

tableCreation()