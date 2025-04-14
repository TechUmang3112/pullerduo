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
<p>Hello <strong>User</strong>,</p>
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
<p>Hello <strong>User</strong>,</p>
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
