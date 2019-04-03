This project on "Vacancy Registration App" is made for Rites Ltd .

The project is made on a NodeJS framework , which is ExpressJS.
A restful api has been made for which consists of the following features:
    1) Admin can upload a vacancy along with the document related to that vacancy.
    2) Candidates can register for the uploaded vacancies.
    3) After candidate registers, a unique "userid" and "password" is sent to the candidates provided email.
    4) Then the candidate has to use those credentials to login inside the application and upload his photograph and    signature.
    5) The routes have been declared inside the ./api/routes/* folder.
    6) Then after user has completed all the formalities, the admin can view the biodata in odf format of the candidate by logging-in through the admin panel.
    7) The uploaded images and photographs and biodata are stored inside the uploads directory.

The application has adependency of NodeJS being installed on the server
The app runs by executing 'npm install and then npm start' inside './' direectory.
