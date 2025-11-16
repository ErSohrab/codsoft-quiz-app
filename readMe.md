1. **Start MongoDB** (if using local):
```bash
# For macOS with Homebrew
brew services start mongodb-community

# For Windows
net start MongoDB

# For Linux
sudo systemctl start mongod
```

2. **Run Application**:
```bash
npm run dev
```

3. **Test Features**:
   - Visit `http://localhost:3000`
   - Register as Creator and Candidate (use different emails)
   - Creator: Create a quiz
   - Candidate: Take the quiz
   - Creator: View results

### Step 6.2: Common Issues & Solutions

**Issue**: Cannot connect to MongoDB
- **Solution**: Check MONGODB_URI in .env file
- Ensure MongoDB is running (local) or connection string is correct (Atlas)

**Issue**: Session not persisting
- **Solution**: Check SESSION_SECRET is set
- Clear browser cookies and try again

**Issue**: CSS not loading
- **Solution**: Check Tailwind CDN link in header.ejs
- Verify public folder is properly served

**Issue**: Dark mode not working
- **Solution**: Check theme.js is loaded in footer.ejs
- Clear browser cache

---

## 7. Project Commands Reference

```bash
# Development
npm run dev          # Start with nodemon (auto-restart)

# Production
npm start            # Start server

# Database
mongod               # Start MongoDB (local)

# Git
git add .
git commit -m "message"
git push origin main

# Deployment
vercel               # Deploy to Vercel
heroku logs --tail   # View Heroku logs
```

---

## 8. Project Features Summary

### Implemented Features:
✅ User Authentication (Register/Login/Logout)
✅ Role-based Access (Creator/Candidate)
✅ Quiz Creation with Multiple MCQs
✅ Quiz Taking (One question at a time)
✅ Immediate Result Display
✅ Performance Reports
✅ Quiz Listing
✅ Session Management
✅ Password Hashing
✅ Responsive Design
✅ Light/Dark Mode
✅ Clean Folder Structure
✅ Production-Ready Code

### Technology Stack Used:
- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Frontend**: EJS Templates
- **Styling**: Tailwind CSS
- **Authentication**: bcryptjs, express-session

---

## 9. Next Steps & Enhancements

### Potential Improvements:
1. **Add Timer** to quizzes
2. **Quiz Categories** and filtering
3. **Leaderboard** feature
4. **Quiz Analytics** (pass rate, average score)
5. **Email Notifications** on quiz completion
6. **Export Results** to PDF/CSV
7. **Quiz Sharing** via unique links
8. **Question Bank** for reusable questions
9. **Image Support** in questions
10. **Multiple Attempts** tracking

---

## 10. Troubleshooting Guide

### Database Connection Issues
```bash
# Check MongoDB status
mongosh --eval "db.adminCommand('ping')"

# Test connection string
node -e "require('mongoose').connect('your_uri').then(() => console.log('✅ Connected'))"
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 
```

### Clear Session Data
Delete the session from MongoDB or clear browser cookies.

---

## Conclusion

You now have a fully functional, production-ready Quiz Web Application! 

**Final Checklist:**
- [ ] All dependencies installed
- [ ] MongoDB connected
- [ ] Environment variables configured
- [ ] Application tested locally
- [ ] Code pushed to GitHub
- [ ] Deployed to hosting platform
- [ ] Production environment variables set

**Support & Resources:**
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Express.js Docs: https://expressjs.com
- EJS Documentation: https://ejs.co
- Tailwind CSS: https://tailwindcss.com

Happy Coding! 🚀