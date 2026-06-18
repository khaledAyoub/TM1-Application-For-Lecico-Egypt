import sqlite3
import os
import bcrypt
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    def __init__(self, db_path=None):
        if db_path is None:
            # Resolve the path relative to the current file
            base_dir = os.path.dirname(os.path.abspath(__file__))
            self.db_path = os.path.join(base_dir, "..", "DB", "Lecico TM1 App.db")
        else:
            self.db_path = db_path

    def get_connection(self):
        """Creates and returns a new database connection with dictionary-like row factory."""
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    # ---------------------------------------------------------
    # Application Users Table Control
    # ---------------------------------------------------------
    def addUser(self, UserName, Password):
        if Password is None:
            raise ValueError("Password cannot be None")
        if UserName is None:
            raise ValueError("UserName cannot be None")
        if len(Password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(UserName) < 3:
            raise ValueError("UserName must be at least 3 characters long")
        if self.isUser(UserName):
            raise ValueError("UserName already exists")

        PasswordHash = bcrypt.hashpw(Password.encode('utf-8'), bcrypt.gensalt())
        
        with self.get_connection() as db:
            db.execute("INSERT INTO Users (UserName, PasswordHash) VALUES (?, ?)", (UserName, PasswordHash))
            db.commit()
        return True

    def isUser(self, UserName):  
        if UserName is None:
            raise ValueError("UserName cannot be None")
        if len(UserName) < 3:
            raise ValueError("UserName must be at least 3 characters long")

        with self.get_connection() as db:
            cursor = db.execute("SELECT 1 FROM Users WHERE UserName = ?", (UserName,))
            user = cursor.fetchone()
            return user is not None

    def checkPassword(self, UserName, Password):
        if UserName is None:
            raise ValueError("UserName cannot be None")
        if Password is None:
            raise ValueError("Password cannot be None")
        if not self.isUser(UserName):
            raise ValueError("UserName does not exist")

        with self.get_connection() as db:
            cursor = db.execute("SELECT PasswordHash FROM Users WHERE UserName = ?", (UserName,))
            user = cursor.fetchone()
            stored_hash = user['PasswordHash']
            return bcrypt.checkpw(Password.encode('utf-8'), stored_hash)

    def updateUserPassword(self, UserName, Password, NewPassword):
        if UserName is None:
            raise ValueError("UserName cannot be None")
        if NewPassword is None:
            raise ValueError("NewPassword cannot be None")
        if Password is None:
            raise ValueError("Password cannot be None")
        if len(Password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if len(NewPassword) < 8:
            raise ValueError("NewPassword must be at least 8 characters long")
        if not self.isUser(UserName):
            raise ValueError("UserName does not exist")
        if not self.checkPassword(UserName, Password):
            raise ValueError("Password is incorrect")
            
        PasswordHash = bcrypt.hashpw(NewPassword.encode('utf-8'), bcrypt.gensalt())
        with self.get_connection() as db:
            db.execute("UPDATE Users SET PasswordHash = ? WHERE UserName = ?", (PasswordHash, UserName))
            db.commit()
        return True

    def updateUserName(self, UserName, NewUserName):
        if UserName is None:
            raise ValueError("UserName cannot be None")
        if NewUserName is None:
            raise ValueError("NewUserName cannot be None")
        if UserName == NewUserName:
            raise ValueError("UserName and NewUserName cannot be the same")
        if len(NewUserName) < 3:
            raise ValueError("NewUserName must be at least 3 characters long")
        if not self.isUser(UserName):
            raise ValueError("UserName does not exist")
        if self.isUser(NewUserName):
            raise ValueError("NewUserName already exists")
            
        with self.get_connection() as db:
            db.execute("UPDATE Users SET UserName = ? WHERE UserName = ?", (NewUserName, UserName))
            db.commit()
        return True

    def updateUserTM1UserName(self, UserName, NewTM1UserName):
        if UserName is None:
            raise ValueError("UserName cannot be None")
        if NewTM1UserName is None:
            raise ValueError("NewTM1UserName cannot be None")
        if len(NewTM1UserName) < 3:
            raise ValueError("NewTM1UserName must be at least 3 characters long")
        if not self.isUser(UserName):
            raise ValueError("UserName does not exist")
        if self.tm1UserExists(NewTM1UserName):
            raise ValueError("NewTM1UserName already exists")
            
        with self.get_connection() as db:
            db.execute("UPDATE Users SET TM1UserName = ? WHERE UserName = ?", (NewTM1UserName, UserName))
            db.commit()
        return True

    def getAllUsers(self):
        """Returns all users (excluding password hashes)"""
        with self.get_connection() as db:
            cursor = db.execute("SELECT UserName, TM1UserName FROM Users")
            # Convert sqlite3.Row objects to dicts
            return [dict(row) for row in cursor.fetchall()]

    # ---------------------------------------------------------
    # Pages Table Control
    # ---------------------------------------------------------
    def addPage(self, PageName, URL):
        if PageName is None:
            raise ValueError("PageName can't be empty")
        if URL is None:
            raise ValueError("URL can't be empty")
        if self.pageNameOrUrlExists(PageName, URL):
            raise ValueError("PageName or URL already exists")

        with self.get_connection() as db:
            db.execute("INSERT INTO Pages (PageName, URL) VALUES (?, ?)", (PageName, URL))
            db.commit()
        return True

    def pageNameOrUrlExists(self, PageName, URL):
        if PageName is None and URL is None:
            raise ValueError("Both PageName and URL can't be empty")
        with self.get_connection() as db:
            record = db.execute(
                "SELECT 1 FROM Pages WHERE PageName = ? OR URL = ?",
                (PageName, URL)
            ).fetchone()
            return record is not None

    def pageExists(self, PageName):
        if PageName is None:
            raise ValueError("PageName can't be empty")
        with self.get_connection() as db:
            record = db.execute(
                "SELECT 1 FROM Pages WHERE PageName = ?",
                (PageName,)
            ).fetchone()
            return record is not None

    def updatePageURL(self, PageName, PageURL):
        if PageName is None:
            raise ValueError("PageName can't be empty")
        if PageURL is None:
            raise ValueError("PageURL can't be empty")

        if not self.pageExists(PageName):
            raise ValueError("PageName doesn't exist")

        with self.get_connection() as db:
            db.execute(
                "UPDATE Pages SET URL = ? WHERE PageName = ?",
                (PageURL, PageName)
            )
            db.commit()
        return True

    def deletePage(self, PageName):
        if PageName is None:
            raise ValueError("PageName can't be empty")

        if not self.pageExists(PageName):
            raise ValueError("PageName doesn't exist")

        with self.get_connection() as db:
            db.execute(
                "DELETE FROM Pages WHERE PageName = ?",
                (PageName,)
            )
            # Should also delete related PageAccess entries to keep DB clean
            db.execute("DELETE FROM PageAccess WHERE PageName = ?", (PageName,))
            db.commit()
        return True

    def getAllPages(self):
        """Returns all pages"""
        with self.get_connection() as db:
            cursor = db.execute("SELECT * FROM Pages")
            return [dict(row) for row in cursor.fetchall()]

    # ---------------------------------------------------------
    # TM1_Instances Table Control
    # ---------------------------------------------------------
    def addTM1Instance(self, TM1InstanceName, TM1InstanceHost, TM1InstancePort, TM1InstanceSSL):
        if TM1InstanceName is None:
            raise ValueError("TM1InstanceName can't be empty")
        if TM1InstanceHost is None:
            raise ValueError("TM1InstanceHost can't be empty")
        if TM1InstancePort is None:
            raise ValueError("TM1InstancePort can't be empty")
        if TM1InstanceSSL is None or TM1InstanceSSL not in (0, 1):
            raise ValueError("TM1InstanceSSL can't be empty or invalid")
        
        if self.tm1InstanceExists(TM1InstanceName):
            raise ValueError("TM1InstanceName already exists")

        with self.get_connection() as db:
            db.execute("INSERT INTO TM1_Instances (InstanceName, Host, Port, SSL) VALUES (?, ?, ?, ?)", 
                       (TM1InstanceName, TM1InstanceHost, TM1InstancePort, TM1InstanceSSL))
            db.commit()
        return True 

    def tm1InstanceExists(self, TM1InstanceName):
        if TM1InstanceName is None:
            raise ValueError("TM1InstanceName can't be empty")

        with self.get_connection() as db:
            record = db.execute(
                "SELECT 1 FROM TM1_Instances WHERE InstanceName = ?",
                (TM1InstanceName,)
            ).fetchone()
            return record is not None

    def updateTM1InstanceDetails(self, TM1InstanceName, TM1InstanceHost, TM1InstancePort, TM1InstanceSSL):
        if TM1InstanceName is None:
            raise ValueError("TM1InstanceName can't be empty")
        if TM1InstanceHost is None:
            raise ValueError("TM1InstanceHost can't be empty")
        if TM1InstancePort is None:
            raise ValueError("TM1InstancePort can't be empty")
        if TM1InstanceSSL is None or TM1InstanceSSL not in (0, 1):
            raise ValueError("TM1InstanceSSL can't be empty or invalid")
        if not self.tm1InstanceExists(TM1InstanceName):
            raise ValueError("TM1InstanceName doesn't exist")
        
        with self.get_connection() as db:
            db.execute("UPDATE TM1_Instances SET Host = ?, Port = ?, SSL = ? WHERE InstanceName = ?", 
                       (TM1InstanceHost, TM1InstancePort, TM1InstanceSSL, TM1InstanceName))
            db.commit()
        return True

    def removeTM1Instance(self, TM1InstanceName):
        if TM1InstanceName is None:
            raise ValueError("TM1InstanceName can't be empty")
        if not self.tm1InstanceExists(TM1InstanceName):
            raise ValueError("TM1InstanceName doesn't exist")
        
        with self.get_connection() as db:
            db.execute("DELETE FROM TM1_Instances WHERE InstanceName = ?", (TM1InstanceName,))
            db.commit()
        return True

    def getAllTM1Instances(self):
        """Returns all TM1 instances"""
        with self.get_connection() as db:
            cursor = db.execute("SELECT * FROM TM1_Instances")
            return [dict(row) for row in cursor.fetchall()]

    # ---------------------------------------------------------
    # TM1 Users Table Control
    # ---------------------------------------------------------
    def addTM1User(self, TM1UserName, Password, InstanceName):
        if TM1UserName is None:
            raise ValueError("TM1UserName can't be empty")
        if Password is None:
            raise ValueError("Password can't be empty")
        if InstanceName is None:
            raise ValueError("InstanceName can't be empty")
        if self.tm1UserExists(TM1UserName):
            raise ValueError("TM1UserName already exists")
        if not self.tm1InstanceExists(InstanceName):
            raise ValueError("InstanceName doesn't exist")
        
        with self.get_connection() as db:
            db.execute("INSERT INTO TM1_Users (TM1_UserName, TM1_Password, InstanceName) VALUES (?, ?, ?)", 
                       (TM1UserName, Password, InstanceName))
            db.commit()
        return True

    def tm1UserExists(self, TM1UserName):
        if TM1UserName is None:
            raise ValueError("TM1UserName can't be empty")

        with self.get_connection() as db:
            record = db.execute(
                "SELECT 1 FROM TM1_Users WHERE TM1_UserName = ?",
                (TM1UserName,)
            ).fetchone()
            return record is not None

    def updateTM1User(self, TM1UserName, Password, InstanceName):
        if TM1UserName is None:
            raise ValueError("TM1UserName can't be empty")
        if Password is None:
            raise ValueError("Password can't be empty")
        if InstanceName is None:
            raise ValueError("InstanceName can't be empty")
        if not self.tm1UserExists(TM1UserName):
            raise ValueError("TM1UserName doesn't exist")
        if not self.tm1InstanceExists(InstanceName):
            raise ValueError("InstanceName doesn't exist")  
        
        with self.get_connection() as db:
            db.execute("UPDATE TM1_Users SET TM1_Password = ?, InstanceName = ? WHERE TM1_UserName = ?", 
                       (Password, InstanceName, TM1UserName))
            db.commit()
        return True

    def deleteTM1User(self, TM1UserName):
        if TM1UserName is None:
            raise ValueError("TM1UserName can't be empty")
        if not self.tm1UserExists(TM1UserName):
            raise ValueError("TM1UserName doesn't exist")
        
        with self.get_connection() as db:
            db.execute("DELETE FROM TM1_Users WHERE TM1_UserName = ?", (TM1UserName,))
            db.commit()
        return True

    def getAllTM1Users(self):
        """Returns all TM1 users"""
        with self.get_connection() as db:
            cursor = db.execute("SELECT TM1_UserName, InstanceName FROM TM1_Users")
            return [dict(row) for row in cursor.fetchall()]

    # ---------------------------------------------------------
    # Page Access Table Control
    # ---------------------------------------------------------
    def addPageAccess(self, UserName, PageName):
        if UserName is None:
            raise ValueError("UserName can't be empty")
        if PageName is None:
            raise ValueError("PageName can't be empty")
        if not self.isUser(UserName):
            raise ValueError("UserName doesn't exist")
        if not self.pageExists(PageName):
            raise ValueError("PageName doesn't exist")
        if self.pageAccessExists(UserName, PageName):
            raise ValueError("PageAccess already exists")    
        
        with self.get_connection() as db:
            db.execute("INSERT INTO PageAccess (UserName, PageName) VALUES (?, ?)", (UserName, PageName))
            db.commit()
        return True

    def removePageAccess(self, UserName, PageName):
        if UserName is None:
            raise ValueError("UserName can't be empty")
        if PageName is None:
            raise ValueError("PageName can't be empty")
        if not self.isUser(UserName):
            raise ValueError("UserName doesn't exist")
        if not self.pageExists(PageName):
            raise ValueError("PageName doesn't exist")
        if not self.pageAccessExists(UserName, PageName):
            raise ValueError("PageAccess doesn't exist")
            
        with self.get_connection() as db:
            db.execute("DELETE FROM PageAccess WHERE UserName = ? AND PageName = ?", (UserName, PageName))
            db.commit()
        return True

    def pageAccessExists(self, UserName, PageName):
        if UserName is None:
            raise ValueError("UserName can't be empty")
        if PageName is None:
            raise ValueError("PageName can't be empty")
            
        with self.get_connection() as db:
            record = db.execute(
                "SELECT 1 FROM PageAccess WHERE UserName = ? AND PageName = ?",
                (UserName, PageName)
            ).fetchone()
            return record is not None

    def getAllUserPages(self, UserName):
        if UserName is None:
            raise ValueError("UserName can't be empty")
        if not self.isUser(UserName):
            raise ValueError("UserName doesn't exist")
            
        with self.get_connection() as db:
            cursor = db.execute(
                "SELECT PageName FROM PageAccess WHERE UserName = ?",
                (UserName,)
            )
            return [dict(row) for row in cursor.fetchall()]

    def getAllPageAccess(self):
        """Returns all page access entries for all users"""
        with self.get_connection() as db:
            cursor = db.execute("SELECT * FROM PageAccess")
            return [dict(row) for row in cursor.fetchall()]