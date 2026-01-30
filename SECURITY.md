# Security Policy

## 🔒 Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue. Instead, please send an email to **security@yourdomain.com** with the following information:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within **48 hours** and work with you to address the issue before making it public.

## 🛡️ Security Best Practices

When using this application:

1. **Never commit sensitive data** (API keys, passwords, tokens) to the repository
2. **Use environment variables** for configuration
3. **Keep dependencies updated** regularly
4. **Use HTTPS** in production
5. **Enable rate limiting** (already implemented)
6. **Validate all user inputs** on both client and server side
7. **Use MongoDB authentication** in production environments

## 🔐 Current Security Measures

- Rate limiting on alert submission (1 per 10 seconds per IP)
- Input validation on backend
- CORS configuration
- MongoDB injection prevention (using PyMongo)
- XSS protection (React's built-in escaping)
- CSRF protection (Flask-WTF recommended for production)

## 📋 Security Checklist for Deployment

- [ ] Change default MongoDB credentials
- [ ] Use MongoDB authentication
- [ ] Enable HTTPS/SSL
- [ ] Set up proper CORS origins (not `*`)
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB encryption at rest
- [ ] Set up firewall rules
- [ ] Regular security audits
- [ ] Keep all dependencies updated
- [ ] Monitor for suspicious activity

---

**Note**: This is a community-driven alert system. Always verify information through official channels.

