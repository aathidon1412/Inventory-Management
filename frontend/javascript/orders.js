const apiUrl = "http://localhost:3000/orders";

// Fetch and Display Orders
async function fetchOrders() {
    try {
        const response = await fetch(apiUrl);
        const orders = await response.json();
        const tableBody = document.getElementById("orderTableBody");
        tableBody.innerHTML = "";

        orders.forEach(order => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${order.OrderID}</td>
                <td>${order.CustomerID}</td>
                <td>${order.ProductID}</td>
                <td>${order.Quantity}</td>
                <td>${parseFloat(order.TotalPrice || 0).toFixed(2)}</td>
                <td>${new Date(order.OrderDate).toISOString().split('T')[0]}</td>
                <td>${order.PaymentMethod}</td>
                <td>${order.OrderStatus}</td>
                <td>
                    <button onclick="loadOrder('${order.OrderID}')">Edit</button>
                    <button onclick="deleteOrder('${order.OrderID}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
    }
}

// Add or Update Order
async function saveOrder(event) {
    event.preventDefault();

    const orderId = document.getElementById("OrderID").value;
    const updatedOrder = {
        CustomerID: parseInt(document.getElementById("CustomerID").value),
        ProductID: parseInt(document.getElementById("ProductID").value),
        Quantity: parseInt(document.getElementById("Quantity").value),
        TotalPrice: parseFloat(document.getElementById("TotalPrice").value),
        OrderDate: document.getElementById("OrderDate").value,
        PaymentMethod: document.getElementById("PaymentMethod").value,
        OrderStatus: document.getElementById("OrderStatus").value
    };

    try {
        let method = "POST";
        let url = apiUrl;

        if (orderId) {
            method = "PUT";
            url = `${apiUrl}/${orderId}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedOrder)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Order ${orderId ? 'updated' : 'added'} successfully!`);
            fetchOrders();
            document.getElementById("orderForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error saving order:", error);
    }
}

// Load Order Data for Editing
async function loadOrder(orderID) {
    try {
        const response = await fetch(`${apiUrl}/${orderID}`);
        const order = await response.json();

        if (order) {
            document.getElementById("OrderID").value = order.OrderID;
            document.getElementById("CustomerID").value = order.CustomerID;
            document.getElementById("ProductID").value = order.ProductID;
            document.getElementById("Quantity").value = order.Quantity;
            document.getElementById("TotalPrice").value = order.TotalPrice;
            document.getElementById("OrderDate").value = new Date(order.OrderDate).toISOString().split('T')[0];
            document.getElementById("PaymentMethod").value = order.PaymentMethod;
            document.getElementById("OrderStatus").value = order.OrderStatus;

            document.getElementById("submitBtn").setAttribute("onclick", "saveOrder(event)");
        }
    } catch (error) {
        console.error("Error loading order:", error);
    }
}

// Delete Order
async function deleteOrder(orderID) {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
        const response = await fetch(`${apiUrl}/${orderID}`, { method: "DELETE" });
        if (response.ok) {
            alert("Order deleted successfully!");
            fetchOrders();
        } else {
            alert("Failed to delete order. Check if it's linked to other records.");
        }
    } catch (error) {
        console.error("Error deleting order:", error);
    }
}

// Fetch orders when page loads
document.addEventListener("DOMContentLoaded", fetchOrders);
