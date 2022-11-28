const body = document.querySelector('body');

//Set Cookies
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path =/";
}

//Signup function called from handle_signup
async function postSignup(data) {
    const response = await fetch('/requests/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

async function get_persons_table(data) {
    const response = await fetch('/requests/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

const handle_signup = (event) => {
    const form = new FormData(event.target);
    const username = form.get("username");
    const password = form.get("password");
    const re_password = form.get("re_password");
    const firstName = form.get("firstName");
    const lastName = form.get("lastName");
    const address = form.get("lastName");
    const paymentMethod = form.get("paymentMethod");

    if (password !== re_password) {
        alert("Passwords don't match!");
        return false;
    }

    const response = postSignup({Username: username, Password: password, FirstName: firstName, LastName: lastName, Address: address, PaymentMethod: paymentMethod});
    response.then(data => {
        // Data will be an object with one or two keys. It has Accepted, a boolean indicating if
        // the signup request is accepted. If it is, then the object also has the key UserID, corresponding 
        // to the ID of the user in the database internally. This is insanely insecure but will work for our
        // demo.
        if (data.Accepted) {
            setCookie("UserID", data.UserID, 1);
            window.location.href = "/reservation";
        }
        else {
            alert("This username already exists!");    
        }
    })
    return false;
}

//Test to get a table
// results = {TestTable: []}
get_persons_table({UserID: 1}).then(results => {
    const test_list = document.getElementById('test_list');
    // test_list: {LastName, FirstName, Address, PreferredDinner, EarnedPointsd, PaymentMethod}

    for (const list_info of results.TestTable) {
        const li = document.createElement('li');

        const body = `Last Name:  ${list_info.LastName} First Name: ${list_info.FirstName} Address: ${list_info.Address} Preferred Dinner: ${list_info.PreferredDinner} Earned Points: ${list_info.EarnedPointsd} Payment Method: ${list_info.PaymentMethod}\t` 

        li.innerHTML = body;

        test_list.appendChild(li);
    }

});