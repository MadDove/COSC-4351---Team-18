const http = require('http');
const fs = require('fs');
const mysql = require('./node_modules/mysql');

const { hostname, port, pages_path } = require('./src/contants');
const { title } = require('process');
const { table } = require('console');

//Create connection to our database
const connection = mysql.createConnection({
  host     : 'cosc-4351-team-18.cjoax2duxevo.us-east-1.rds.amazonaws.com',
  port     : '3306',
  user     : 'admin',
  password : 'passwordteam18',
  database : 'COSC4351'
});
connection.connect();

async function handle_posts_requests(request, response) {
    //Test table Queries
    if (request.url.substr(0,28) === '/requests/getUserInformation') {
        if (request.url === '/requests/getUserInformation') {
            const buffers = [];
            for await (const chunk of request) {
                buffers.push(chunk);
            }
            const user_id = JSON.parse(buffers.toString());
            const first_query = `SELECT * FROM persons WHERE (UserID = ${user_id.UserID})`
            connection.query(first_query, (error, first_results) => {
                if (error) {
                    console.log(error);
                    response.writeHead(500);
                    response.end();
                    throw error;
                }
                else {
                    const rows = {Info: []};
                    for (const row of first_results) {
                        rows.Info.push(row);
                    }
                    response.writeHead(200);
                    response.write(JSON.stringify(rows));
                    response.end();
                }
            });
        }
    }
    //Signing up
    else if (request.url.substr(0, 16) === "/requests/signup") {
        const buffers = [];
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        const user_info = JSON.parse(buffers.toString());
        const exists_query = `SELECT UserID FROM persons WHERE Username="${user_info.Username}";`
        connection.query(exists_query, (error, results) => {
            if (error) {
                console.log(error);
                throw error;
            }
            if (Object.keys(results).length > 0) { // Username already exists
                response.writeHead(409);
                response.write(JSON.stringify({'Accepted': false}));
                response.end();
            } else {
                const query = `INSERT INTO persons (Username, UserPassword, LastName, FirstName, Address, PaymentMethod) VALUES("${user_info.Username}", "${user_info.Password}", "${user_info.LastName}", "${user_info.FirstName}", "${user_info.Address}", "${user_info.PaymentMethod}");`;
                connection.query(query, (error, results) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    }

                    response.writeHead(200);
                    response.write(JSON.stringify({'Accepted': true, 'UserID': results.insertId}));
                    response.end();
                });
            }
        });
    }
    else if (request.url === '/requests/login') {
        const buffers = [];
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        const user_info = JSON.parse(buffers.toString());
        const query = `SELECT UserID FROM persons WHERE (Username="${user_info.Username}" AND UserPassword="${user_info.Password}")`
        connection.query(query, (error, results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            if (Object.keys(results).length === 0) { // Username/Password combo not found in database
                response.writeHead(200);
                response.write(JSON.stringify({'Accepted': false}));
                response.end();
            }
            else {
                response.writeHead(200);
                response.write(JSON.stringify({'Accepted': true, 'UserID': results['0'].UserID}));
                response.end();
            }
        });
    }
    else if (request.url === '/requests/availableTables') {
        const buffers = [];
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        const date_info = JSON.parse(buffers.toString());
        const weekday_query = `SELECT WEEKDAY("${date_info.Date}") as WEEKDAY`
        const holiday_query = `SELECT DateID FROM HighTrafficDays WHERE (TrafficDate="${date_info.Date}")`
        const output_available_tables_query = `SELECT TableID, Capacity From allTables WHERE TableID NOT IN (SELECT TableID FROM ReservedTables WHERE ReservationDate="${date_info.Date}")`
        connection.query(output_available_tables_query, (error, output_available_tables_results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            connection.query(weekday_query, (error, output_dates) => {
                if (error) {
                    console.log(error);
                    response.writeHead(500);
                    response.end();
                    throw error;
                }
                connection.query(holiday_query, (error, output_holiday) => {
                    if (error) {
                        console.log(error);
                        response.writeHead(500);
                        response.end();
                        throw error;
                    }
                    if (Object.keys(output_holiday).length > 0) {
                        const rowsAvailableTables = {Info: [], Dates: [], 'Holiday': true}
                        for (const rowAvailableTables of output_available_tables_results) {
                            rowsAvailableTables.Info.push(rowAvailableTables);
                        }
                        for (const rowDate of output_dates) {
                            rowsAvailableTables.Dates.push(rowDate);
                        }
                        response.writeHead(200);
                        response.write(JSON.stringify(rowsAvailableTables));
                        response.end();  
                    }
                    else{
                        const rowsAvailableTables = {Info: [], Dates: [], 'Holiday': false}
                        for (const rowAvailableTables of output_available_tables_results) {
                            rowsAvailableTables.Info.push(rowAvailableTables);
                        }
                        for (const rowDate of output_dates) {
                            rowsAvailableTables.Dates.push(rowDate);
                        }
                        response.writeHead(200);
                        response.write(JSON.stringify(rowsAvailableTables));
                        response.end();  
                    }
                });
            });
        });
    }
    else if (request.url === '/requests/reserve_guest') {
        const buffers = [];
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        const table_info = JSON.parse(buffers.toString());
        const output_available_tables_query = `INSERT INTO ReservedTables (TableID, ReservationDate) VALUES("${table_info.TableID}", "${table_info.Date}")`;

        connection.query(output_available_tables_query, (error, results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            response.writeHead(200);
            response.write(JSON.stringify({'Accepted': true}));
            response.end();          
        }
    );
    }
    else if (request.url === '/requests/reserve_registered') {
        const buffers = [];
        for await (const chunk of request) {
            buffers.push(chunk);
        }
        const table_info = JSON.parse(buffers.toString());
        const output_available_tables_query = `INSERT INTO ReservedTables (UserID, TableID, ReservationDate) VALUES("${table_info.UserID}", "${table_info.TableID}", "${table_info.Date}")`;

        connection.query(output_available_tables_query, (error, results) => {
            if (error) {
                console.log(error);
                response.writeHead(500);
                response.end();
                throw error;
            }
            response.writeHead(200);
            response.write(JSON.stringify({'Accepted': true}));
            response.end();          
        }
    );
    }
}

// Main function body of our server. All requests to our webpage are routed
// through this function.
async function server_handler(request, response) {
    console.log(request.url);
    if (request.url === '/' || request.url === '/reservation') { // Default to index page?
        file_path = pages_path + '/html/reservation.html';
        content_type = 'text/html';
    }
    else if (request.url === '/reservationRegistered' ) {
        file_path = pages_path + '/html/reservationRegistered.html';
        content_type = 'text/html';
    }
    else if (request.url === '/register' ) {
        file_path = pages_path + '/html/register.html';
        content_type = 'text/html';
    }
    else if (request.url === '/login' ) {
        file_path = pages_path + '/html/login.html';
        content_type = 'text/html';
    }

    else if (request.url.substr(0,9) === '/requests') {
        handle_posts_requests(request, response);
        return;
    }

    else { // Likely a request for a specific resource
        const extension = request.url.split('.').pop(); // gives us the last string preceeded by ".", should be file extension
        file_path = '.' + request.url;
        if (extension === 'css') {
            content_type = 'text/css';
        }
        else if (extension === 'js') {
            content_type = 'text/javascript';
        }
        else if (extension === 'png') {
            content_type = 'image/png';  
        }
        else if (extension === 'json') {
            content_type = 'application/json'
        }
        else if (extension === 'ico') {
            content_type = 'image/x-icon'
            file_path = pages_path + '/data/' + request.url;
        }
        else {
            content_type = 'text/plain';
        }
    }
    fs.readFile(file_path, function (err, content) {
        if (err) {
            console.log(err);
            response.writeHead(404);
            response.end();
            return;
        }
        response.writeHead(200, {"Content-Type": content_type});
        response.write(content);
        response.end();
    });
}

http.createServer(server_handler).listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}`)
});
