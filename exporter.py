import sqlite3
import os
import json
import sys

def main():
    sqlite_file = "store.sqlite"
    json_files = {"users": "users.json", "bookings": "bookings.json", "properties": "properties.json", "subscriptions": "subscriptions.json"}
    for i in json_files.keys():
        destination = os.getcwd() + "/store/" + json_files[i]
        data = json.load(open(destination))



        try:
            conn = sqlite3.connect(sqlite_file)  # create a database and/or make a connection to it.
            dbcommand = "CREATE TABLE "+ i +" ("
            for j in data[0].keys():
                dbcommand += j + " text,"
            dbcommand = dbcommand[:-1] + ")"

            c = conn.cursor()


            c.execute(dbcommand)  # create a table.

            for element in data:
                insertcommand = "INSERT INTO " + i + " VALUES ("
                for key in element.keys():
                    insertcommand += "\"" + str(element[key]) + "\","
                insertcommand = insertcommand[:-1] + ")"
                c.execute(insertcommand)

        except Exception as e:
            print("failed to create a table")
            print(e)
            sys.exit(1)
        else:
            conn.commit()
            print("created a table in the database...")

    conn.close()
main()