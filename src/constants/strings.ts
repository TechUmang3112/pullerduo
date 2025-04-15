export const OTP_HTML = `<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><style>body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f7f9fc;margin:0;padding:0;color:#333}.container{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}.header{background:linear-gradient(135deg,#6e8efb,#a777e3);padding:30px 20px;text-align:center;color:#fff}.header h1{margin:0;font-size:24px;font-weight:600}.content{padding:30px}.otp-box{background:#f0f4ff;border-radius:8px;padding:15px;text-align:center;margin:20px 0;font-size:28px;font-weight:bold;letter-spacing:5px;color:#6e8efb;border:1px dashed #a777e3}.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}.note{font-size:14px;color:#777;margin-top:20px}</style></head><body><div class=\"container\"><div class=\"header\"><h1>Your One-Time Password</h1></div><div class=\"content\"><p>Hello <strong>User</strong>,</p><p>Your OTP for verification is:</p><div class=\"otp-box\">OTP_CODE</div><p>This code expires in <strong>10 minutes</strong>. Do not share it.</p><p class=\"note\">If you didn’t request this, ignore this email.</p></div><div class=\"footer\"><p>&copy; 2025 PullerDuo. All rights reserved.</p></div></div></body></html>`;

export const DOC_APPEROVE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f7f9fc;margin:0;padding:0;color:#333}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.header{background:linear-gradient(135deg,#4CAF50,#81C784);padding:30px 20px;text-align:center;color:#fff}
.header h1{margin:0;font-size:24px;font-weight:600}
.content{padding:30px}
.status-box{background:#e8f5e9;border-radius:8px;padding:20px;text-align:center;margin:20px 0;font-size:24px;font-weight:bold;color:#2E7D32;border:1px dashed #81C784}
.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}
.note{font-size:14px;color:#777;margin-top:20px}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Document Approval Notification</h1>
</div>
<div class="content">
<p>Hello <strong>USER_NAME</strong>,</p>
<p>We're pleased to inform you that your document has been:</p>
<div class="status-box">APPROVED</div>
<p>Your document has been successfully verified and approved.</p>
<p class="note">Thank you for your submission.</p>
</div>
<div class="footer">
<p>&copy; 2025 PullerDuo. All rights reserved.</p>
</div>
</div>
</body>
</html>`;

export const DOC_DECLINE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f7f9fc;margin:0;padding:0;color:#333}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.header{background:linear-gradient(135deg,#f44336,#e57373);padding:30px 20px;text-align:center;color:#fff}
.header h1{margin:0;font-size:24px;font-weight:600}
.content{padding:30px}
.status-box{background:#ffebee;border-radius:8px;padding:20px;text-align:center;margin:20px 0;font-size:24px;font-weight:bold;color:#C62828;border:1px dashed #e57373}
.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}
.note{font-size:14px;color:#777;margin-top:20px}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Document Rejection Notification</h1>
</div>
<div class="content">
<p>Hello <strong>USER_NAME</strong>,</p>
<p>We regret to inform you that your document has been:</p>
<div class="status-box">REJECTED</div>
<p>Please review the document and submit again with corrections.</p>
<p class="note">Contact support if you have any questions.</p>
</div>
<div class="footer">
<p>&copy; 2025 PullerDuo. All rights reserved.</p>
</div>
</div>
</body>
</html>`;

export const PAYMENT_RECEIVED = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f7f9fc;margin:0;padding:0;color:#333}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.header{background:linear-gradient(135deg,#2196F3,#64B5F6);padding:30px 20px;text-align:center;color:#fff}
.header h1{margin:0;font-size:24px;font-weight:600}
.content{padding:30px}
.status-box{background:#e3f2fd;border-radius:8px;padding:20px;text-align:center;margin:20px 0;font-size:24px;font-weight:bold;color:#1565C0;border:1px dashed #64B5F6}
.amount{font-size:32px;margin:10px 0;color:#0D47A1}
.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}
.note{font-size:14px;color:#777;margin-top:20px}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Payment Received Notification</h1>
</div>
<div class="content">
<p>Hello <strong>USER_NAME</strong>,</p>
<p>We're pleased to inform you that we have received your payment:</p>
<div class="status-box">
  PAYMENT RECEIVED
  <div class="amount">PAYMENT_AMOUNT</div>
</div>
<p>Your payment has been successfully processed and credited to your account.</p>
<p class="note">Thank you for your payment.</p>
</div>
<div class="footer">
<p>&copy; 2025 PullerDuo. All rights reserved.</p>
</div>
</div>
</body>
</html>`;

export const RIDE_ACCEPTED_BY_RIDER = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f7f9fc;margin:0;padding:0;color:#333}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.header{background:linear-gradient(135deg,#4CAF50,#81C784);padding:30px 20px;text-align:center;color:#fff}
.header h1{margin:0;font-size:24px;font-weight:600}
.content{padding:30px}
.details-box{background:#e8f5e9;border-radius:8px;padding:20px;margin:20px 0;color:#2E7D32;border:1px dashed #81C784}
.detail-row{margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #C8E6C9}
.detail-row:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
.detail-label{font-weight:600;color:#1B5E20;display:block;margin-bottom:5px}
.detail-value{font-size:16px}
.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}
.note{font-size:14px;color:#777;margin-top:20px}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>New Ride Assignment</h1>
</div>
<div class="content">
<p>Hello <strong>DRIVER_NAME</strong>,</p>
<p>You have been assigned a new ride. Here are the details:</p>
<div class="details-box">
  <div class="detail-row">
    <span class="detail-label">Passenger Name</span>
    <span class="detail-value">RIDER_NAME</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Passenger Email</span>
    <span class="detail-value">RIDER_EMAIL</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Pickup Location</span>
    <span class="detail-value">START_PLACE</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Destination</span>
    <span class="detail-value">END_PLACE</span>
  </div>
</div>
<p>Please ensure you arrive on time and provide excellent service.</p>
<p class="note">Thank you for being part of our team!</p>
</div>
<div class="footer">
<p>&copy; 2025 PullerDuo. All rights reserved.</p>
</div>
</div>
</body>
</html>`;

export const DRIVER_DETAILS_FOR_RIDE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:#f7f9fc;margin:0;padding:0;color:#333}
.container{max-width:600px;margin:20px auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 4px 15px rgba(0,0,0,0.1)}
.header{background:linear-gradient(135deg,#2196F3,#64B5F6);padding:30px 20px;text-align:center;color:#fff}
.header h1{margin:0;font-size:24px;font-weight:600}
.content{padding:30px}
.details-box{background:#e3f2fd;border-radius:8px;padding:20px;margin:20px 0;color:#1565C0;border:1px dashed #64B5F6}
.detail-row{margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #bbdefb}
.detail-row:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none}
.detail-label{font-weight:600;color:#0D47A1;display:block;margin-bottom:5px}
.detail-value{font-size:16px}
.footer{background:#f1f1f1;padding:15px;text-align:center;font-size:12px;color:#777}
.note{font-size:14px;color:#777;margin-top:20px}
.contact{margin-top:10px;font-style:italic}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>Your Ride is Confirmed</h1>
</div>
<div class="content">
<p>Hello <strong>RIDER_NAME</strong>,</p>
<p>Your ride has been confirmed! Here are your ride details:</p>
<div class="details-box">
  <div class="detail-row">
    <span class="detail-label">Driver Name</span>
    <span class="detail-value">DRIVER_NAME</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Driver Contact</span>
    <span class="detail-value">DRIVER_EMAIL</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Pickup Location</span>
    <span class="detail-value">START_PLACE</span>
  </div>
  <div class="detail-row">
    <span class="detail-label">Destination</span>
    <span class="detail-value">END_PLACE</span>
  </div>
</div>
<p class="contact">Your driver will contact you if needed. Please be ready at the pickup location.</p>
<p class="note">Thank you for choosing our service!</p>
</div>
<div class="footer">
<p>&copy; 2025 PullerDuo. All rights reserved.</p>
</div>
</div>
</body>
</html>`;
