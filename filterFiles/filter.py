#!/usr/bin/env python3
import csv
import re
import sys
import os

def readOrphanFile(file,regex):
    listOfFilteredOrphans = []
    with open(file) as csvFile:
        reader = list(csv.reader(csvFile, delimiter=','))
        for row in reader[2:]:
            if(re.search(regex, row[0]) or row[0] == "Path"):
                listOfFilteredOrphans.append(row)
    return listOfFilteredOrphans

def writeFile(fileName,list, arg):
    with open(fileName+'.csv', arg) as csvFile:
            writer = csv.writer(csvFile, delimiter=',')
            for row in list:
               writer.writerow(row)
def writeFilterCSV(list, fileName):
    if(os.path.exists(f"{fileName}.csv")):
        writeFile(fileName,list,'w')
    else:
        writeFile(fileName,list,'x')

def filterFiles(csvFile):
    images = readOrphanFile(csvFile, "([^\s](?=\.(jpg|jpeg|png|gif|bmp)))")
    print(images)
    documents = readOrphanFile(csvFile,"([^\s](?=\.(pdf|doc|docx|xls|ppt|pptx|xlsx)))")
    writeFilterCSV(images, 'images')
    writeFilterCSV(documents,'documents')

if(len(sys.argv) >= 2):
    filterFiles(sys.argv[1])
else:
    print("No arguments included")
