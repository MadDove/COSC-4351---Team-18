const body = document.querySelector('body');

async function get_user_information(data) {
    const response = await fetch('/requests/getUserInformation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

async function updatePaymentMethod(data) {
    const response = await fetch('/requests/updatePaymentMethod', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

// Need code to handle if no cookie stored for user
dc = document.cookie;
const start_idx = dc.indexOf('UserID')
const end_idx = dc.substr(start_idx).indexOf(';');
let user_id;
if (end_idx === -1) {
    user_id = parseInt(dc.substr(start_idx+7));
}
else {
    user_id = parseInt(dc.substr(start_idx+7, end_idx));
}

//check if the cookie is existed
if ( document.cookie.indexOf('UserID') == -1){
    window.location.href = "/register";
  }

//Test to get a table
// results = {Info: []}
get_user_information({UserID: user_id}).then(results => {
    const test_list = document.getElementById('test_list');
    // test_list: {LastName, FirstName, Address, PreferredDinner, EarnedPointsd, PaymentMethod}

    for (const list_info of results.Info) {
        const li = document.createElement('li');

        const body = `Last Name:  ${list_info.LastName} First Name: ${list_info.FirstName} Address: ${list_info.Address} Preferred Dinner: ${list_info.PreferredDinner} Earned Points: ${list_info.EarnedPointsd} Payment Method: ${list_info.PaymentMethod}\t` 

        li.innerHTML = body;

        test_list.appendChild(li);
    }

});

const handle_change_payment_method = (event) => {
    const form = new FormData(event.target);
    const paymentMethod = form.get("paymentMethod");

    const response = updatePaymentMethod({UserID: user_id, PaymentMethod: paymentMethod});
    response.then(data => {
        // Data will be an object with one or two keys. It has Accepted, a boolean indicating if
        // the signup request is accepted. If it is, then the object also has the key UserID, corresponding 
        // to the ID of the user in the database internally. This is insanely insecure but will work for our
        // demo.
        if (data.Accepted) {
            alert("Payment Method Updated!");
            window.location.href = "/user";
        }
        else {
            alert("An Error Has Occurred. Please Try Again");
            window.location.href = "/user";  
        }
    })
    return false;
}


function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  
  const handle_logout = (event) => {
    deleteCookie("UserID");
    window.location.href = "/";
  }