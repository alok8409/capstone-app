import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setLoading(false);
          setError('Please login to view your orders');
          return;
        }

        const response = await axios.get(`http://localhost:5000/orders/${userId}`);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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

  return (
    <div className="container mt-5">
      <h2>Your Orders</h2>
      
      {orders.length === 0 ? (
        <div className="text-center mt-4">
          <p>You haven't placed any orders yet</p>
          <Link to="/restaurents" className="btn btn-primary mt-2">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <div className="row mt-4">
          {orders.map(order => (
            <div key={order._id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0">Order #{order._id.substring(0, 8)}</h5>
                    <small className="text-muted">
                      {new Date(order.orderTime).toLocaleString()}
                    </small>
                  </div>
                  <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h6>Items:</h6>
                      <ul className="list-group list-group-flush">
                        {order.items.map((item, index) => (
                          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                              {item.menuItem.name} x {item.quantity}
                            </div>
                            <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <div className="card">
                        <div className="card-body">
                          <h6>Order Summary</h6>
                          <div className="d-flex justify-content-between">
                            <span>Total:</span>
                            <strong>${order.totalAmount.toFixed(2)}</strong>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Payment:</span>
                            <span className={`badge ${order.paymentStatus === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h6>Delivery Address:</h6>
                    <p>{order.deliveryAddress}</p>
                  </div>
                  
                  <div className="mt-3">
                    <h6>Restaurant:</h6>
                    <p>{order.restaurant.name}</p>
                  </div>
                </div>
                <div className="card-footer">
                  <Link to={`/order/${order._id}`} className="btn btn-outline-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}