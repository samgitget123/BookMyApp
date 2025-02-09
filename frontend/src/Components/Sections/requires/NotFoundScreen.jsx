import React from 'react';

function NotFoundScreen() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you're looking for does not exist.</p>
            <a href="/">Go Back to Home</a>
        </div>
    );
}

export default NotFoundScreen;
