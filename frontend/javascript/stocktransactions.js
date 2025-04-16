const apiUrl = "http://localhost:3000/stocktransactions"; // API Endpoint

// Fetch and Display Stock Transactions
async function fetchStockTransactions() {
    try {
        const response = await fetch(apiUrl);
        const transactions = await response.json();
        const tableBody = document.getElementById("stockTransactionTableBody");
        tableBody.innerHTML = "";

        transactions.forEach(transaction => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${transaction.TransactionID}</td>
                <td>${transaction.ProductID}</td>
                <td>${transaction.Quantity}</td>
                <td>${transaction.TransactionType}</td>
                <td>${new Date(transaction.DateTime).toLocaleString()}</td>
                <td>
                    <button onclick="loadTransaction('${transaction.TransactionID}')">Edit</button>
                    <button onclick="deleteTransaction('${transaction.TransactionID}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching stock transactions:", error);
    }
}

// Add or Update Stock Transaction
async function saveTransaction(event) {
    event.preventDefault();
    
    const transactionId = document.getElementById("TransactionID").value;
    const transaction = {
        ProductID: document.getElementById("ProductID").value,
        Quantity: parseInt(document.getElementById("Quantity").value),
        TransactionType: document.getElementById("TransactionType").value,
        DateTime: document.getElementById("DateTime").value
    };

    try {
        const method = transactionId ? "PUT" : "POST";
        const url = transactionId ? `${apiUrl}/${transactionId}` : apiUrl;
        
        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Transaction ${transactionId ? 'updated' : 'added'} successfully!`);
            fetchStockTransactions();
            document.getElementById("transactionForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error saving transaction:", error);
    }
}

// Load Transaction Data for Editing
async function loadTransaction(transactionID) {
    try {
        const response = await fetch(`${apiUrl}/${transactionID}`);
        const transaction = await response.json();
        
        if (transaction) {
            document.getElementById("TransactionID").value = transaction.TransactionID;
            document.getElementById("ProductID").value = transaction.ProductID;
            document.getElementById("Quantity").value = transaction.Quantity;
            document.getElementById("TransactionType").value = transaction.TransactionType;
            document.getElementById("DateTime").value = new Date(transaction.DateTime).toISOString().slice(0, 16);
        }
    } catch (error) {
        console.error("Error loading transaction:", error);
    }
}

// Delete Transaction
async function deleteTransaction(transactionID) {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
        const response = await fetch(`${apiUrl}/${transactionID}`, { method: "DELETE" });
        if (response.ok) {
            alert("Transaction deleted successfully!");
            fetchStockTransactions();
        } else {
            alert("Failed to delete transaction. Check if it's linked to other tables.");
        }
    } catch (error) {
        console.error("Error deleting transaction:", error);
    }
}

// Fetch transactions when page loads
document.addEventListener("DOMContentLoaded", fetchStockTransactions);
