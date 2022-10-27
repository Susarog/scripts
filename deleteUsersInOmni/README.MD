This program is able to filter out the users in a csv file. It takes in one csv file that has all of the users needed to be deleted and the second csv file that will be used to filter out the users in the firs csv file

This program only has two problem when dealing with csv files.

1. It will remove an entire row if the same user is in both csv files. This is considered bad because it may contain important information besides the Name. Ex. the column that addresses its group. A fix to this is just give all users their respective groups and information instead of having one person containing it and adding the people below be a part of the group.
2. If there is more information of the csv after a certain column. If that row is deleted. That part of the column is also deleted.

Did not feel like dealing with these edge cases tbh.
