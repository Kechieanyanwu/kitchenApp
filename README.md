# kitchenApp

WIP personal project to help me stop buying duplicate grocery items. 

This readme is a WIP. Scratchpad for now. 
- Todo
- Rename files from folder.type to folderType

Clone the repo, install dependencies, and run npm test to check testing. 


Process
- Started by testing the routing of the endpoints
- Moved onto testing the expected result of the GET method of the categories endpoint
- Once satisfied with the expected output, now refactoring to correct implementation
- Focused on categories, as its much simpler in operation
    - Set up the kitchenapp database
    - Created a db config file for permissions and exported into categoriesModel file 
    - Currently deciding between mocking the database, or testing the actual connection then mocking
