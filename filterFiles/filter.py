#!/usr/bin/env python3
import csv
import re
import sys

def readOrphanFile(file,regex):
    listOfFilteredOrphans = []
    with open(file) as csvFile:
        reader = list(csv.reader(csvFile, delimiter=','))
        for row in reader[2:]:
            if(re.search(regex, row[0])):
                listOfFilteredOrphans.append(row)
    return listOfFilteredOrphans

# create 2 new csv files that will either be a document or an image
def writeFilterCSV(list, fileName):
    with open(fileName+'.csv', 'a') as csvFile:
        writer = csv.writer(csvFile, delimiter=',')
        for row in list:
            writer.writerow(row)

def filterFiles(csvFile):
    images = readOrphanFile(csvFile, "([^\s](?=\.(jpg|jpeg|png|gif|bmp)))")
    documents = readOrphanFile(csvFile,"([^\s](?=\.(pdf|doc|docx|xls|ppt|pptx|xlsx)))")
    writeFilterCSV(images, 'images')
    writeFilterCSV(documents,'documents')

if(len(sys.argv) >= 2):
    filterFiles(sys.argv[1])
else:
    print("No arguments included")
