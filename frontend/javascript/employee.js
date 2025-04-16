const apiUrl = "http://localhost:3000/employees"; // API Endpoint

// Fetch and Display Employees
async function fetchEmployees() {
    try {
        const response = await fetch(apiUrl);
        const employees = await response.json();
        const tableBody = document.getElementById("employeeTableBody");
        tableBody.innerHTML = "";

        employees.forEach(employee => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${employee.EmployeeID}</td>
                <td>${employee.Name}</td>
                <td>${employee.Role}</td>
                <td>${employee.ContactNumber}</td>
                <td>${employee.Username}</td>
                <td>
                    <button onclick="loadEmployee('${employee.EmployeeID}')">Edit</button>
                    <button onclick="deleteEmployee('${employee.EmployeeID}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

// Add or Update Employee
async function saveEmployee(event) {
    event.preventDefault();
    
    const employeeId = document.getElementById("EmployeeID").value;
    const employee = {
        Name: document.getElementById("Name").value,
        Role: document.getElementById("Role").value,
        ContactNumber: document.getElementById("ContactNumber").value,
        Username: document.getElementById("Username").value,
        Password: document.getElementById("Password").value
    };

    try {
        const method = employeeId ? "PUT" : "POST";
        const url = employeeId ? `${apiUrl}/${employeeId}` : apiUrl;
        
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employee)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Employee ${employeeId ? 'updated' : 'added'} successfully!`);
            fetchEmployees();
            document.getElementById("employeeForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error saving employee:", error);
    }
}

// Load Employee Data for Editing
async function loadEmployee(employeeID) {
    try {
        const response = await fetch(`${apiUrl}/${employeeID}`);
        const employee = await response.json();
        
        if (employee) {
            document.getElementById("EmployeeID").value = employee.EmployeeID;
            document.getElementById("Name").value = employee.Name;
            document.getElementById("Role").value = employee.Role;
            document.getElementById("ContactNumber").value = employee.ContactNumber;
            document.getElementById("Username").value = employee.Username;
            document.getElementById("Password").value = ""; // Do not prefill password for security
        }
    } catch (error) {
        console.error("Error loading employee:", error);
    }
}

// Delete Employee
async function deleteEmployee(employeeID) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        const response = await fetch(`${apiUrl}/${employeeID}`, { method: "DELETE" });
        if (response.ok) {
            alert("Employee deleted successfully!");
            fetchEmployees();
        } else {
            alert("Failed to delete employee. Check dependencies.");
        }
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
}

// Fetch employees when page loads
document.addEventListener("DOMContentLoaded", fetchEmployees);
