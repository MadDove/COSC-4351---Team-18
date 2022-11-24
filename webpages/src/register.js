const body = document.querySelector('body');

async function get_songs(data) {
    const response = await fetch('/requests/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application.json'
        },
        body: JSON.stringify(data)
    })
    return response.json();
}

// results = {TestTable: []}
get_songs({UserID: 1}).then(results => {
    const test_list = document.getElementById('test_list');
    // test_list: {LastName, FirstName, Address, PreferredDinner, EarnedPointsd, PaymentMethod}

    for (const list_info of results.TestTable) {
        const li = document.createElement('li');

        const body = `Last Name:  ${list_info.LastName} First Name: ${list_info.FirstName} Address: ${list_info.Address} Preferred Dinner: ${list_info.PreferredDinner} Earned Points: ${list_info.EarnedPointsd} Payment Method: ${list_info.PaymentMethod}\t` 

        li.innerHTML = body;

        test_list.appendChild(li);
    }

});