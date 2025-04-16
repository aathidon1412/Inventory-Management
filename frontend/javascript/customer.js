const apiUrl = "http://localhost:3000/customers";

// Fetch and Display Customers
async function fetchCustomers() {
    try {
        const response = await fetch(apiUrl);
        const customers = await response.json();
        const tableBody = document.getElementById("customerTableBody");
        tableBody.innerHTML = "";

        customers.forEach(customer => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${customer.CustomerID}</td>
                <td>${customer.Name}</td>
                <td>${customer.ContactNumber}</td>
                <td>${customer.Email}</td>
                <td>${customer.Address}</td>
                <td>
                    <button class="edit-btn" onclick="loadCustomer('${customer.CustomerID}')">Edit</button>
                    <button class="delete-btn" onclick="deleteCustomer('${customer.CustomerID}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
    }
}

// Add or Update Customer
async function saveCustomer(event) {
    event.preventDefault();

    const customerId = document.getElementById("CustomerID").value;
    const updatedCustomer = {
        Name: document.getElementById("Name").value,
        ContactNumber: document.getElementById("ContactNumber").value,
        Email: document.getElementById("Email").value,
        Address: document.getElementById("Address").value
    };

    try {
        let method = "POST";
        let url = apiUrl;

        if (customerId) {
            method = "PUT";
            url = `${apiUrl}/${customerId}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCustomer)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Customer ${customerId ? 'updated' : 'added'} successfully!`);
            fetchCustomers();
            document.getElementById("customerForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error saving customer:", error);
    }
}

// Load Customer Data for Editing
async function loadCustomer(customerID) {
    try {
        const response = await fetch(`${apiUrl}/${customerID}`);
        const customer = await response.json();

        if (customer) {
            document.getElementById("CustomerID").value = customer.CustomerID;
            document.getElementById("Name").value = customer.Name;
            document.getElementById("ContactNumber").value = customer.ContactNumber;
            document.getElementById("Email").value = customer.Email;
            document.getElementById("Address").value = customer.Address;

            document.getElementById("submitBtn").setAttribute("onclick", "saveCustomer(event)");
        }
    } catch (error) {
        console.error("Error loading customer:", error);
    }
}

// Delete Customer
async function deleteCustomer(customerID) {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
        const response = await fetch(`${apiUrl}/${customerID}`, { method: "DELETE" });
        if (response.ok) {
            alert("Customer deleted successfully!");
            fetchCustomers();
        } else {
            alert("Failed to delete customer. Check if it's linked to other tables.");
        }
    } catch (error) {
        console.error("Error deleting customer:", error);
    }
}

// Fetch customers when page loads
document.addEventListener("DOMContentLoaded", fetchCustomers);
