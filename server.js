// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app and apply middleware for CORS and JSON request body parsing
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Establish a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'inventorydb',
});

// Attempt to connect and handle errors
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1); // Exit if connection fails
  }
  console.log('Connected to MySQL!');
});

// CRUD OPERATIONS

// CREATE (Add Product)
app.post('/products', (req, res) => {
  const { ProductName, Category, Description, Price, StockQuantity, SupplierID, ReorderLevel, DateAdded } = req.body;
  const query = 'INSERT INTO Product (ProductName, Category, Description, Price, StockQuantity, SupplierID, ReorderLevel, DateAdded) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [ProductName, Category, Description, Price, StockQuantity, SupplierID, ReorderLevel, DateAdded], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Product added successfully!' });
    }
  });
});

// READ (Get All Products)
app.get('/products', (req, res) => {
  connection.query('SELECT * FROM Product', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});
// READ (Get a Single Product by ID)
app.get('/products/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Product WHERE ProductID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Product not found' });
    } else {
      res.status(200).json(result[0]); // Return the first matched product
    }
  });
});


// UPDATE (Edit Product)
app.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const { ProductName, Category, Description, Price, StockQuantity, SupplierID, ReorderLevel, DateAdded } = req.body;
  const query = 'UPDATE Product SET ProductName = ?, Category = ?, Description = ?, Price = ?, StockQuantity = ?, SupplierID = ?, ReorderLevel = ?, DateAdded = ? WHERE ProductID = ?';
  connection.query(query, [ProductName, Category, Description, Price, StockQuantity, SupplierID, ReorderLevel, DateAdded, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Product updated successfully!' });
    }
  });
});

// DELETE (Remove Product)
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  console.log("Received DELETE request for ProductID:", id);

  connection.query('DELETE FROM Product WHERE ProductID = ?', [id], (err, result) => {
      if (err) {
          console.error("Error deleting product:", err);
          res.status(500).json({ error: err.message });
      } else if (result.affectedRows === 0) {
          res.status(404).json({ message: "Product not found" });
      } else {
          res.status(200).json({ message: "Product deleted successfully!" });
      }
  });
});


// SUPPLIERS CRUD
// CREATE
app.post('/suppliers', (req, res) => {
  const { SupplierName, ContactPerson, PhoneNumber, Email, Address } = req.body;
  const query = 'INSERT INTO Supplier (SupplierName, ContactPerson, PhoneNumber, Email, Address) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [SupplierName, ContactPerson, PhoneNumber, Email, Address], 
    (err, result) => {
    if (err) { 
      res.status(500).json({ error: err.message });
    } else { 
      res.status(201).json({ message: 'Supplier added successfully!' });
    }
  });
});
// READ
app.get('/suppliers', (req, res) => {
  connection.query('SELECT * FROM Supplier', (err, results) => {
    if (err) { 
      res.status(500).json({ error: err.message });
    } else { 
      res.status(200).json(results);
    }
  });
});
app.get('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Supplier WHERE SupplierID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Supplier not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});
// UPDATE
app.put('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  const { SupplierName, ContactPerson, PhoneNumber, Email, Address } = req.body;
  const query = 'UPDATE Supplier SET SupplierName = ?, ContactPerson = ?, PhoneNumber = ?, Email = ?, Address = ? WHERE SupplierID = ?';
  connection.query(query, [SupplierName, ContactPerson, PhoneNumber, Email, Address, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Supplier updated successfully!' });
    }
  });
});
// DELETE
app.delete('/suppliers/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Supplier WHERE SupplierID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Supplier deleted successfully!' });
    }
  });
});

// CRUD OPERATIONS FOR CUSTOMERS
// CREATE
app.post('/customers', (req, res) => {
  const { Name, ContactNumber, Email, Address } = req.body;
  const query = 'INSERT INTO Customer (Name, ContactNumber, Email, Address) VALUES (?, ?, ?, ?)';
  connection.query(query, [Name, ContactNumber, Email, Address], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Customer added successfully!' });
    }
  });
});
// READ
app.get('/customers', (req, res) => {
  connection.query('SELECT * FROM Customer', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/customers/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Customer WHERE CustomerID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Customer not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});
// UPDATE
app.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { Name, ContactNumber, Email, Address } = req.body;
  const query = 'UPDATE Customer SET Name = ?, ContactNumber = ?, Email = ?, Address = ? WHERE CustomerID = ?';
  connection.query(query, [Name, ContactNumber, Email, Address, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Customer updated successfully!' });
    }
  });
});
// DELETE
app.delete('/customers/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Customer WHERE CustomerID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Customer deleted successfully!' });
    }
  });
});

// CRUD OPERATIONS FOR ORDERS
// CREATE
app.post('/orders', (req, res) => {
  const { CustomerID, ProductID, Quantity, TotalPrice, OrderDate, PaymentMethod, OrderStatus } = req.body;
  const query = 'INSERT INTO Orders (CustomerID, ProductID, Quantity, TotalPrice, OrderDate, PaymentMethod, OrderStatus) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [CustomerID, ProductID, Quantity, TotalPrice, OrderDate, PaymentMethod, OrderStatus], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Order added successfully!' });
    }
  });
});
// READ
app.get('/orders', (req, res) => {
  connection.query('SELECT * FROM Orders', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/orders/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Orders WHERE OrderID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Order not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// UPDATE
app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { CustomerID, ProductID, Quantity, TotalPrice, OrderDate, PaymentMethod, OrderStatus } = req.body;
  const query = 'UPDATE Orders SET CustomerID = ?, ProductID = ?, Quantity = ?, TotalPrice = ?, OrderDate = ?, PaymentMethod = ?, OrderStatus = ? WHERE OrderID = ?';
  connection.query(query, [CustomerID, ProductID, Quantity, TotalPrice, OrderDate, PaymentMethod, OrderStatus, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Order updated successfully!' });
    }
  });
});
// DELETE
app.delete('/orders/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Orders WHERE OrderID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Order deleted successfully!' });
    }
  });
});

// CRUD OPERATIONS FOR TRANSACTIONS
// CREATE
app.post('/stocktransactions', (req, res) => {
  const { ProductID, Quantity, TransactionType, DateTime } = req.body;
  const query = 'INSERT INTO stocktransaction (ProductID, Quantity, TransactionType, DateTime) VALUES (?, ?, ?, ?)';
  connection.query(query, [ProductID, Quantity, TransactionType, DateTime], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Transaction added successfully!' });
    }
  });
});
// READ
app.get('/stocktransactions', (req, res) => {
  connection.query('SELECT * FROM stocktransaction', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/stocktransactions/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM StockTransaction WHERE TransactionID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Stock Transaction not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// UPDATE
app.put('/stocktransactions/:id', (req, res) => {
  const { id } = req.params;
  const { ProductID, Quantity, TransactionType, DateTime } = req.body;
  const query = 'UPDATE stocktransaction SET ProductID = ?, Quantity = ?, TransactionType = ?, DateTime = ? WHERE TransactionID = ?';
  connection.query(query, [ProductID, Quantity, TransactionType, DateTime, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Transaction updated successfully!' });
    }
  });
});
// DELETE
app.delete('/stocktransactions/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM stocktransaction WHERE TransactionID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Transaction deleted successfully!' });
    }
  });
});

// CRUD OPERATIONS FOR EMPLOYEES
// CREATE
app.post('/employees', (req, res) => {
  const { Name, Role, ContactNumber, Username, Password } = req.body;
  const query = 'INSERT INTO Employee (Name, Role, ContactNumber, Username, Password) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [Name, Role, ContactNumber, Username, Password], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ message: 'Employee added successfully!' });
    }
  });
});
// READ
app.get('/employees', (req, res) => {
  connection.query('SELECT * FROM Employee', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});
app.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM Employee WHERE EmployeeID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.length === 0) {
      res.status(404).json({ message: 'Employee not found' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// UPDATE
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { Name, Role, ContactNumber, Username, Password } = req.body;
  const query = 'UPDATE Employee SET Name = ?, Role = ?, ContactNumber = ?, Username = ?, Password = ? WHERE EmployeeID = ?';
  connection.query(query, [Name, Role, ContactNumber, Username, Password, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Employee updated successfully!' });
    }
  });
});
// DELETE
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM Employee WHERE EmployeeID = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: 'Employee deleted successfully!' });
    }
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
