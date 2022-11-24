const http = require('http');
const fs = require('fs');
const mysql = require('./node_modules/mysql');

const { hostname, port, pages_path } = require('./src/contants');
const { title } = require('process');

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
    if (request.url.substr(0,20) === '/requests/register') {
        if (request.url === '/requests/register') {
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
                    const rows = {TestTable: []};
                    for (const row of first_results) {
                        rows.TestTable.push(row);
                    }
                    response.writeHead(200);
                    response.write(JSON.stringify(rows));
                    response.end();
                }
            });
        }
    }
}

// Main function body of our server. All requests to our webpage are routed
// through this function.
async function server_handler(request, response) {
    console.log(request.url);
    if (request.url === '/' ) { // Default to index page?
        file_path = pages_path + '/html/register.html';
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
