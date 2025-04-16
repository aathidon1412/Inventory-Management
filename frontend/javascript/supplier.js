const supplierApiUrl = "http://localhost:3000/suppliers";

// Fetch and Display Suppliers
async function fetchSuppliers() {
    try {
        const response = await fetch(supplierApiUrl);
        const suppliers = await response.json();
        const tableBody = document.getElementById("supplierTableBody");
        tableBody.innerHTML = "";

        suppliers.forEach(supplier => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${supplier.SupplierID}</td>
                <td>${supplier.SupplierName}</td>
                <td>${supplier.ContactPerson}</td>
                <td>${supplier.PhoneNumber}</td>
                <td>${supplier.Email}</td>
                <td>${supplier.Address}</td>
                <td>
                    <button onclick="loadSupplier(${supplier.SupplierID})">Edit</button>
                    <button onclick="deleteSupplier(${supplier.SupplierID})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching suppliers:", error);
    }
}

// Add or Update Supplier
async function saveSupplier(event) {
    event.preventDefault();

    const supplierId = document.getElementById("SupplierID").value;
    const supplier = {
        SupplierName: document.getElementById("SupplierName").value,
        ContactPerson: document.getElementById("ContactPerson").value,
        PhoneNumber: document.getElementById("PhoneNumber").value,
        Email: document.getElementById("Email").value,
        Address: document.getElementById("Address").value
    };

    try {
        let method = "POST";
        let url = supplierApiUrl;

        if (supplierId) {
            method = "PUT";
            url = `${supplierApiUrl}/${supplierId}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(supplier)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Supplier ${supplierId ? 'updated' : 'added'} successfully!`);
            fetchSuppliers();
            document.getElementById("supplierForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error saving supplier:", error);
    }
}

// Load Supplier Data for Editing
async function loadSupplier(supplierID) {
    try {
        const response = await fetch(`${supplierApiUrl}/${supplierID}`);
        const supplier = await response.json();

        if (supplier) {
            document.getElementById("SupplierID").value = supplier.SupplierID;
            document.getElementById("SupplierName").value = supplier.SupplierName;
            document.getElementById("ContactPerson").value = supplier.ContactPerson;
            document.getElementById("PhoneNumber").value = supplier.PhoneNumber;
            document.getElementById("Email").value = supplier.Email;
            document.getElementById("Address").value = supplier.Address;

            document.getElementById("submitBtn").setAttribute("onclick", "saveSupplier(event)");
        }
    } catch (error) {
        console.error("Error loading supplier:", error);
    }
}

// Delete Supplier
async function deleteSupplier(supplierID) {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
        const response = await fetch(`${supplierApiUrl}/${supplierID}`, { method: "DELETE" });
        if (response.ok) {
            alert("Supplier deleted successfully!");
            fetchSuppliers();
        } else {
            alert("Failed to delete supplier. Check if it's linked to other tables.");
        }
    } catch (error) {
        console.error("Error deleting supplier:", error);
    }
}

// Fetch suppliers when page loads
document.addEventListener("DOMContentLoaded", fetchSuppliers);
