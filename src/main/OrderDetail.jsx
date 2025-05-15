import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Make sure we have a valid token for authenticated requests
        const token = localStorage.getItem('token');
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        
        const response = await axios.get(`http://localhost:5000/orders/details/${id}`, config);
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details. ' + (error.response?.data?.error || ''));
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    } else {
      setError('Order ID is missing');
      setLoading(false);
    }
  }, [id]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'placed': return 'bg-info';
      case 'preparing': return 'bg-warning';
      case 'on the way': return 'bg-primary';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 alert alert-danger">{error}</div>;
  if (!order) return <div className="container mt-5">Order not found</div>;

  // Check if order has items before trying to access them
  const hasItems = order.items && Array.isArray(order.items) && order.items.length > 0;
  
  const subtotal = hasItems 
    ? order.items.reduce((sum, item) => sum + (item.menuItem?.price || 0) * item.quantity, 0) 
    : 0;
  
  const taxRate = 0.10;
  const tax = subtotal * taxRate;

  const deliveryFee = 2.99;
  
  const calculatedTotal = subtotal + tax + deliveryFee;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order Details</h2>
        <div>
          <Link to="/orders" className="btn btn-outline-secondary me-2">
            Back to Orders
          </Link>
          <Link to="/cart" className="btn btn-primary">
            Go to Cart
          </Link>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header bg-light">
          <div className="row">
            <div className="col-md-6">
              <h5 className="mb-0">Order #{order._id.substring(0, 8)}</h5>
              <small className="text-muted">
                Placed on {new Date(order.orderTime).toLocaleString()}
              </small>
            </div>
            <div className="col-md-6 text-md-end">
              <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row">
            <div className="col-md-8">
              <h5>Items</h5>
              {hasItems ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th className="text-end">Price</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.menuItem?.name || 'Unknown Item'}</td>
                          <td>{item.quantity}</td>
                          <td className="text-end">${item.menuItem?.price?.toFixed(2) || '0.00'}</td>
                          <td className="text-end">${((item.menuItem?.price || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-warning">No items found in this order</div>
              )}
            </div>
            
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <div className="d-flex justify-content-between mt-3">
                    <span>Total Items:</span>
                    <span>{hasItems ? order.items.reduce((sum, item) => sum + item.quantity, 0) : 0}</span>
                  </div>
                  
                  {/* Subtotal Section */}
                  <div className="d-flex justify-content-between mt-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Tax Section */}
                  <div className="d-flex justify-content-between mt-2">
                    <span>Tax ({(taxRate * 100).toFixed(0)}%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  {/* Delivery Fee */}
                  <div className="d-flex justify-content-between mt-2">
                    <span>Delivery Fee:</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  
                 
                  <div className="d-flex justify-content-between mt-2">
                    <span>Total Amount:</span>
                    <span className="fw-bold">${order.totalAmount?.toFixed(2) || calculatedTotal.toFixed(2)}</span>
                  </div>
                  
                  <hr />
                  <h6 className="mt-3">Payment Information</h6>
                  <div className="d-flex justify-content-between mt-2">
                    <span>Payment Method:</span>
                    <span>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>Payment Status:</span>
                    <span className={`badge ${order.paymentStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="card mt-3">
                <div className="card-body">
                  <h5 className="card-title">Delivery Information</h5>
                  <p className="mb-1"><strong>Address:</strong></p>
                  <p className="mb-3">{order.deliveryAddress || 'No address provided'}</p>
                  
                  {order.restaurant && (
                    <>
                      <p className="mb-1"><strong>Restaurant:</strong></p>
                      <p>{order.restaurant.name || 'Unknown Restaurant'}</p>
                      <p>{order.restaurant.address || 'No address available'}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}