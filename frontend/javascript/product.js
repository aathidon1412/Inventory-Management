const apiUrl = "http://localhost:3000/products";

// Fetch and Display Products
async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        const tableBody = document.getElementById("productTableBody");
        tableBody.innerHTML = "";

        products.forEach(product => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${product.ProductID}</td>
                <td>${product.ProductName}</td>
                <td>${product.Category}</td>
                <td>${product.Description}</td>
                <td>${product.Price}</td>
                <td>${product.StockQuantity}</td>
                <td>${product.SupplierID}</td>
                <td>${product.ReorderLevel}</td>
                <td>${new Date(product.DateAdded).toISOString().split('T')[0]}</td>
                <td>
                    <button onclick="loadProduct('${product.ProductID}')">Edit</button>
                    <button onclick="deleteProduct('${product.ProductID}')">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Add or Update Product (Including ProductID)
async function saveProduct(event) {
    event.preventDefault();
    
    const productId = document.getElementById("ProductID").value;
    const updatedProductID = document.getElementById("UpdatedProductID").value;
    const product = {
        ProductID: updatedProductID, // Allow ProductID modification
        ProductName: document.getElementById("ProductName").value,
        Category: document.getElementById("Category").value,
        Description: document.getElementById("Description").value,
        Price: parseFloat(document.getElementById("Price").value),
        StockQuantity: parseInt(document.getElementById("StockQuantity").value),
        SupplierID: document.getElementById("SupplierID").value,
        ReorderLevel: parseInt(document.getElementById("ReorderLevel").value),
        DateAdded: document.getElementById("DateAdded").value
    };

    try {
        let method = "POST";
        let url = apiUrl;

        if (productId) {
            method = "PUT";
            url = `${apiUrl}/${productId}`;
        }

        const response = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        const result = await response.json();
        if (response.ok) {
            alert(`Product ${productId ? 'updated' : 'added'} successfully!`);
            fetchProducts();
            document.getElementById("productForm").reset();
        } else {
            alert("Error: " + result.error);
        }
    } catch (error) {
        console.error("Error saving product:", error);
    }
}

// Load Product Data for Editing (Including ProductID)
async function loadProduct(productID) {
    try {
        const response = await fetch(`${apiUrl}/${productID}`);
        const product = await response.json();
        
        if (product) {
            document.getElementById("ProductID").value = product.ProductID;
            document.getElementById("UpdatedProductID").value = product.ProductID; // New field for updated ID
            document.getElementById("ProductName").value = product.ProductName;
            document.getElementById("Category").value = product.Category;
            document.getElementById("Description").value = product.Description;
            document.getElementById("Price").value = product.Price;
            document.getElementById("StockQuantity").value = product.StockQuantity;
            document.getElementById("SupplierID").value = product.SupplierID;
            document.getElementById("ReorderLevel").value = product.ReorderLevel;
            document.getElementById("DateAdded").value = new Date(product.DateAdded).toISOString().split('T')[0];

            document.getElementById("submitBtn").setAttribute("onclick", "saveProduct(event)");
        }
    } catch (error) {
        console.error("Error loading product:", error);
    }
}

// Delete Product
async function deleteProduct(productID) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
        const response = await fetch(`${apiUrl}/${productID}`, { method: "DELETE" });
        if (response.ok) {
            alert("Product deleted successfully!");
            fetchProducts();
        } else {
            alert("Failed to delete product. Check if it's linked to other tables.");
        }
    } catch (error) {
        console.error("Error deleting product:", error);
    }
}

// Fetch products when page loads
document.addEventListener("DOMContentLoaded", fetchProducts);
